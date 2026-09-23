import RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import type { Engine } from "./engine";
import type { WorldObject } from "./hiddenWorld";

/** Rapier is tuned for meter-ish sizes, so 1 physics unit = 100 CSS pixels. */
export const PX = 100;
const NAV_HEIGHT = 64;
const MAX_SPEED = 30; // units/s, keeps thrown bodies from tunneling
const MIN_DRIFT = 0.12; // floating objects never fully stop
const STEP = 1 / 60;

export interface Draggable {
  body: RAPIER.RigidBody;
  /** Only letter-style bodies are grabbable by touch; hidden objects would hijack scrolling. */
  touchGrab: boolean;
}

export class Physics {
  readonly world: RAPIER.World;
  private readonly engine: Engine;
  private readonly bodies = new Map<number, Draggable>();
  private readonly floating: { obj: WorldObject; body: RAPIER.RigidBody }[] = [];
  private walls: RAPIER.RigidBody;
  private readonly cursor: RAPIER.RigidBody;
  private cursorActive = false;
  private grabbed: RAPIER.RigidBody | null = null;
  private readonly grabTarget = new THREE.Vector2();
  private accumulator = 0;
  private lastScrollY = window.scrollY;
  private readonly finePointer = window.matchMedia("(pointer: fine)").matches;
  /** Called after each simulation frame, e.g. to sync DOM letters. */
  afterStep: (() => void) | null = null;

  static async create(engine: Engine) {
    await RAPIER.init();
    return new Physics(engine);
  }

  private constructor(engine: Engine) {
    this.engine = engine;
    this.world = new RAPIER.World({ x: 0, y: -18, z: 0 });
    this.world.timestep = STEP;
    this.walls = this.buildWalls();

    this.cursor = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 1e4, 0));
    this.world.createCollider(RAPIER.ColliderDesc.ball(26 / PX), this.cursor);

    for (const obj of engine.world.objects) this.addFloating(obj);

    engine.simulate = (dt) => this.step(dt);
    window.addEventListener("pointerdown", this.onPointerDown, { passive: false });
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerup", this.release);
    window.addEventListener("pointercancel", this.release);
    window.addEventListener("touchstart", this.onTouchStart, { passive: false });
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  // --- coordinates -------------------------------------------------------

  /** Viewport client px → physics units (origin at viewport center, y up). */
  toWorld(clientX: number, clientY: number) {
    const { width, height } = this.engine.world;
    return { x: (clientX - width / 2) / PX, y: (height / 2 - clientY) / PX };
  }

  /** Physics units → viewport client px. */
  toClient(x: number, y: number) {
    const { width, height } = this.engine.world;
    return { x: x * PX + width / 2, y: height / 2 - y * PX };
  }

  // --- bodies ------------------------------------------------------------

  private buildWalls() {
    const { width, height } = this.engine.world;
    const hw = width / 2 / PX;
    const hh = height / 2 / PX;
    const top = hh - NAV_HEIGHT / PX;
    const t = 2; // wall half-thickness, thick enough that nothing tunnels through
    const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    const wall = (x: number, y: number, hx: number, hy: number) =>
      this.world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, 5).setTranslation(x, y, 0).setFriction(0.6), body);
    wall(0, -hh - t, hw + 2 * t, t); // floor
    wall(0, top + t, hw + 2 * t, t); // ceiling (below the nav)
    wall(-hw - t, 0, t, hh + 2 * t); // left
    wall(hw + t, 0, t, hh + 2 * t); // right
    return body;
  }

  private addFloating(obj: WorldObject) {
    const p = obj.group.position;
    const q = obj.group.quaternion;
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(p.x / PX, p.y / PX, 0)
        .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
        .setLinvel(obj.velocity.x / PX, obj.velocity.y / PX, 0)
        .setAngvel({ x: obj.spin.x, y: obj.spin.y, z: 0 })
        .setGravityScale(0)
        .setLinearDamping(0.6)
        .setAngularDamping(0.4)
        .enabledTranslations(true, true, false)
        .setCcdEnabled(true),
    );

    let collider: RAPIER.ColliderDesc | null = null;
    if (obj.kind === "box") {
      const s = obj.radius * 0.575;
      collider = RAPIER.ColliderDesc.cuboid(s / PX, s / PX, s / PX);
    } else if (obj.kind !== "torusKnot") {
      const pos = obj.geometry.getAttribute("position").array as Float32Array;
      collider = RAPIER.ColliderDesc.convexHull(pos.map((v) => v / PX));
    }
    collider ??= RAPIER.ColliderDesc.ball(obj.radius / PX);
    this.world.createCollider(collider.setRestitution(0.7).setDensity(0.5), body);

    this.floating.push({ obj, body });
    this.bodies.set(body.handle, { body, touchGrab: false });
  }

  /** Registers an externally created body (e.g. a letter) as draggable. */
  addDraggable(body: RAPIER.RigidBody, touchGrab: boolean) {
    this.bodies.set(body.handle, { body, touchGrab });
  }

  removeBody(body: RAPIER.RigidBody) {
    if (this.grabbed === body) this.release();
    this.bodies.delete(body.handle);
    this.world.removeRigidBody(body);
  }

  // --- input -------------------------------------------------------------

  private bodyAt(clientX: number, clientY: number, touch: boolean) {
    const p = this.toWorld(clientX, clientY);
    let hit: RAPIER.RigidBody | null = null;
    this.world.intersectionsWithPoint({ x: p.x, y: p.y, z: 0 }, (collider) => {
      const entry = collider.parent() && this.bodies.get(collider.parent()!.handle);
      if (entry && (!touch || entry.touchGrab)) {
        hit = entry.body;
        return false;
      }
      return true;
    });
    return hit as RAPIER.RigidBody | null;
  }

  private static isInteractive(target: EventTarget | null) {
    return target instanceof Element && !!target.closest("a, button, input, textarea, select, label, [role=button]");
  }

  private grab(body: RAPIER.RigidBody, clientX: number, clientY: number) {
    this.grabbed = body;
    const p = this.toWorld(clientX, clientY);
    this.grabTarget.set(p.x, p.y);
    body.wakeUp();
    document.documentElement.dataset.grabbing = "";
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || Physics.isInteractive(e.target)) return;
    const body = this.bodyAt(e.clientX, e.clientY, e.pointerType !== "mouse");
    if (!body) return;
    e.preventDefault(); // no text selection while dragging
    this.grab(body, e.clientX, e.clientY);
  };

  // Touch scrolling can only be cancelled from touchstart, so grabbable hits are claimed here.
  private onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (e.touches.length !== 1 || !t || Physics.isInteractive(e.target)) return;
    if (this.bodyAt(t.clientX, t.clientY, true)) e.preventDefault();
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.grabbed) {
      const p = this.toWorld(e.clientX, e.clientY);
      this.grabTarget.set(p.x, p.y);
    } else if (this.finePointer) {
      const over = !Physics.isInteractive(e.target) && !!this.bodyAt(e.clientX, e.clientY, false);
      if (over) document.documentElement.dataset.grabbable = "";
      else delete document.documentElement.dataset.grabbable;
    }
  };

  private release = () => {
    this.grabbed = null;
    delete document.documentElement.dataset.grabbing;
  };

  private onResize = () => {
    this.world.removeRigidBody(this.walls);
    this.walls = this.buildWalls();
    // Pull anything the new walls left outside back into view.
    const { width, height } = this.engine.world;
    const hw = width / 2 / PX;
    const hh = height / 2 / PX;
    for (const { body } of this.bodies.values()) {
      const t = body.translation();
      const x = THREE.MathUtils.clamp(t.x, -hw + 0.3, hw - 0.3);
      const y = THREE.MathUtils.clamp(t.y, -hh + 0.3, hh - NAV_HEIGHT / PX - 0.3);
      if (x !== t.x || y !== t.y) body.setTranslation({ x, y, z: 0 }, true);
    }
  };

  // Scrolling jolts the "box" everything lives in, so bodies get a small kick against the scroll.
  private onScroll = () => {
    const dy = window.scrollY - this.lastScrollY;
    this.lastScrollY = window.scrollY;
    const kick = THREE.MathUtils.clamp(dy / PX, -0.6, 0.6) * 2.5;
    if (!kick) return;
    for (const { body } of this.bodies.values()) {
      const v = body.linvel();
      body.setLinvel({ x: v.x, y: v.y + kick, z: 0 }, true);
    }
  };

  // --- simulation --------------------------------------------------------

  private moveCursor() {
    const { pointer } = this.engine;
    if (!pointer.active || this.grabbed) {
      if (this.cursorActive) this.cursor.setTranslation({ x: 0, y: 1e4, z: 0 }, false);
      this.cursorActive = false;
      return;
    }
    const target = { x: pointer.world.x / PX, y: pointer.world.y / PX, z: 0 };
    // Teleport on (re)entry so the cursor doesn't sweep across the screen smashing things.
    if (this.cursorActive) this.cursor.setNextKinematicTranslation(target);
    else this.cursor.setTranslation(target, false);
    this.cursorActive = true;
  }

  private step(dt: number) {
    this.accumulator = Math.min(this.accumulator + dt, STEP * 4);
    while (this.accumulator >= STEP) {
      this.moveCursor();

      if (this.grabbed) {
        // A stiff spring toward the pointer; releasing keeps the velocity, which is the "throw".
        const t = this.grabbed.translation();
        this.grabbed.setLinvel({ x: (this.grabTarget.x - t.x) * 18, y: (this.grabTarget.y - t.y) * 18, z: 0 }, true);
      }

      for (const { body } of this.bodies.values()) {
        const v = body.linvel();
        const speed = Math.hypot(v.x, v.y);
        if (speed > MAX_SPEED) body.setLinvel({ x: (v.x / speed) * MAX_SPEED, y: (v.y / speed) * MAX_SPEED, z: 0 }, true);
      }
      for (const { body } of this.floating) {
        const v = body.linvel();
        const speed = Math.hypot(v.x, v.y);
        if (speed < MIN_DRIFT) {
          const dir = speed > 1e-4 ? { x: v.x / speed, y: v.y / speed } : { x: Math.random() - 0.5, y: Math.random() - 0.5 };
          body.setLinvel({ x: dir.x * MIN_DRIFT, y: dir.y * MIN_DRIFT, z: 0 }, true);
        }
      }

      this.world.step();
      this.accumulator -= STEP;
    }

    for (const { obj, body } of this.floating) {
      const t = body.translation();
      const r = body.rotation();
      obj.group.position.set(t.x * PX, t.y * PX, 0);
      obj.group.quaternion.set(r.x, r.y, r.z, r.w);
    }
    this.afterStep?.();
  }

  dispose() {
    window.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.release);
    window.removeEventListener("pointercancel", this.release);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
    this.release();
    delete document.documentElement.dataset.grabbable;
    this.engine.simulate = (dt) => this.engine.world.drift(dt);
    this.world.free();
  }
}
