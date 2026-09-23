import RAPIER from "@dimforge/rapier3d-compat";
import { PX, type Physics } from "./physics";

interface Letter {
  el: HTMLElement;
  body: RAPIER.RigidBody;
  /** Resting center in page coordinates (scroll-independent). */
  restX: number;
  restY: number;
}

const SETTLE_MS = 700;

/**
 * Turns the hero's `[data-letter]` spans into physics bodies. The glyphs stay real DOM text;
 * each frame they get a transform that places them where their body is.
 */
export class TextPhysics {
  private readonly physics: Physics;
  private letters: Letter[] = [];

  constructor(physics: Physics) {
    this.physics = physics;
  }

  get enabled() {
    return this.letters.length > 0;
  }

  private measure(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY, w: r.width, h: r.height };
  }

  enable() {
    if (this.enabled) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-letter]")];
    // Measure every letter at rest before moving any of them.
    for (const el of els) {
      el.style.transition = "";
      el.style.transform = "";
    }
    const rects = els.map((el) => this.measure(el));
    const { world } = this.physics;

    this.letters = els.map((el, i) => {
      const r = rects[i];
      const p = this.physics.toWorld(r.x - window.scrollX, r.y - window.scrollY);
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(p.x, p.y, 0)
          .enabledTranslations(true, true, false)
          .enabledRotations(false, false, true)
          .setAngularDamping(0.3)
          .setCcdEnabled(true)
          // A little random spin so the name tumbles apart instead of dropping like a brick.
          .setAngvel({ x: 0, y: 0, z: (Math.random() - 0.5) * 3 })
          .setLinvel((Math.random() - 0.5) * 1.5, Math.random() * 2, 0),
      );
      // Glyph boxes include side bearing, so trim the width a little so letters can touch visually.
      world.createCollider(
        RAPIER.ColliderDesc.cuboid((r.w * 0.45) / PX, (r.h * 0.5) / PX, 0.3).setRestitution(0.25).setFriction(0.7).setDensity(1),
        body,
      );
      this.physics.addDraggable(body, true);
      el.style.cursor = "grab";
      return { el, body, restX: r.x, restY: r.y };
    });

    this.physics.afterStep = this.sync;
  }

  private sync = () => {
    for (const { el, body, restX, restY } of this.letters) {
      const t = body.translation();
      const c = this.physics.toClient(t.x, t.y);
      const dx = c.x - (restX - window.scrollX);
      const dy = c.y - (restY - window.scrollY);
      // Physics z-rotation is counter-clockwise with y up; CSS rotates clockwise with y down.
      const angle = -2 * Math.atan2(body.rotation().z, body.rotation().w);
      el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${angle.toFixed(4)}rad)`;
    }
  };

  /** Re-measures resting spots after a layout change, e.g. a resize reflowing the hero. */
  remeasure() {
    for (const l of this.letters) l.el.style.transform = "";
    for (const l of this.letters) {
      const r = this.measure(l.el);
      l.restX = r.x;
      l.restY = r.y;
    }
    this.sync();
  }

  disable() {
    this.physics.afterStep = null;
    for (const { el, body } of this.letters) {
      this.physics.removeBody(body);
      el.style.cursor = "";
      el.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), SETTLE_MS);
    }
    this.letters = [];
  }

  dispose() {
    if (this.enabled) this.disable();
  }
}
