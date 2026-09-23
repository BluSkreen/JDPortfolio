import * as THREE from "three";
import { Reveal, type Brush } from "./reveal";
import { HiddenWorld } from "./hiddenWorld";

const IDLE_AFTER = 2.5; // seconds without input before the ghost brush wanders

/** Pointer in CSS pixels, viewport-centered, y up (the hidden world's coordinate space). */
export interface Pointer {
  world: THREE.Vector2;
  active: boolean;
}

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly world: HiddenWorld;
  readonly pointer: Pointer = { world: new THREE.Vector2(), active: false };
  /** Replaced by the physics layer once it loads. */
  simulate: (dt: number) => void;

  private readonly reveal: Reveal;
  private readonly clock = new THREE.Timer();
  private readonly brush: Brush = { pointer: new THREE.Vector2(-1, -1), prevPointer: new THREE.Vector2(-1, -1), strength: 0 };
  private readonly target = new THREE.Vector2(-1, -1);
  private idle = IDLE_AFTER;
  private elapsed = 0;
  private running = false;
  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.autoClear = false;

    const { width, height } = this.size();
    this.renderer.setSize(width, height, false);
    this.world = new HiddenWorld(width, height);
    this.reveal = new Reveal(width, height, this.renderer.getPixelRatio());
    this.simulate = (dt) => this.world.drift(dt);

    window.addEventListener("pointermove", this.onPointer, { passive: true });
    window.addEventListener("pointerdown", this.onPointer, { passive: true });
    window.addEventListener("touchmove", this.onTouch, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onLeave);
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  private size() {
    return { width: this.canvas.clientWidth || window.innerWidth, height: this.canvas.clientHeight || window.innerHeight };
  }

  private setPointer(clientX: number, clientY: number) {
    const { width, height } = this.world;
    this.target.set(clientX / width, 1 - clientY / height);
    this.pointer.world.set(clientX - width / 2, height / 2 - clientY);
    this.pointer.active = true;
    if (this.idle >= IDLE_AFTER) this.brush.pointer.copy(this.target); // don't streak in from the ghost
    this.idle = 0;
  }

  private onPointer = (e: PointerEvent) => this.setPointer(e.clientX, e.clientY);
  private onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) this.setPointer(t.clientX, t.clientY);
  };
  private onLeave = () => {
    this.pointer.active = false;
  };

  private onResize = () => {
    const { width, height } = this.size();
    this.renderer.setSize(width, height, false);
    this.world.setSize(width, height);
    this.reveal.setSize(width, height, this.renderer.getPixelRatio());
  };

  private onVisibility = () => {
    if (document.hidden) this.renderer.setAnimationLoop(null);
    else if (this.running) this.startLoop();
  };

  private startLoop() {
    this.clock.reset();
    this.renderer.setAnimationLoop(this.frame);
  }

  private frame = (timestamp: number) => {
    this.clock.update(timestamp);
    const dt = Math.min(this.clock.getDelta(), 1 / 20);
    this.elapsed += dt;
    this.idle += dt;

    // Move the brush: follow the pointer, or wander slowly while idle so touch users see the effect too.
    this.brush.prevPointer.copy(this.brush.pointer);
    if (this.idle > IDLE_AFTER) {
      const t = this.elapsed * 0.25;
      this.target.set(0.5 + 0.38 * Math.sin(t * 1.3), 0.5 + 0.32 * Math.sin(t * 2.1 + 1));
      this.brush.pointer.lerp(this.target, 1 - Math.pow(0.02, dt));
      this.brush.strength = THREE.MathUtils.lerp(this.brush.strength, 0.35, dt);
      this.pointer.active = false;
    } else {
      this.brush.pointer.lerp(this.target, 1 - Math.pow(0.0001, dt));
      this.brush.strength = 1;
    }

    this.simulate(dt);
    this.reveal.updateMask(this.renderer, this.brush, dt);
    this.world.render(this.renderer, this.reveal.hiddenTarget);
    this.reveal.composite(this.renderer, this.elapsed);
  };

  start() {
    this.running = true;
    if (!document.hidden) this.startLoop();
  }

  dispose() {
    this.running = false;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener("pointermove", this.onPointer);
    window.removeEventListener("pointerdown", this.onPointer);
    window.removeEventListener("touchmove", this.onTouch);
    document.documentElement.removeEventListener("pointerleave", this.onLeave);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.world.dispose();
    this.reveal.dispose();
    this.renderer.dispose();
  }
}
