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
    const spawn = this.spawnPositions(rects);

    this.letters = els.map((el, i) => {
      const r = rects[i];
      const p = spawn[i];
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
      this.physics.addLetter(body);
      el.style.cursor = "grab";
      el.style.willChange = "transform";
      return { el, body, restX: r.x, restY: r.y };
    });

    this.physics.afterStep = this.sync;
  }

  /**
   * Where each letter's body starts, in physics units. Normally that's right where the glyph is,
   * but the toggle works from anywhere on the page: if the hero is scrolled out of view, the word
   * is moved (as a block, keeping its shape) to just under the ceiling so it drops into view.
   */
  private spawnPositions(rects: { x: number; y: number; w: number; h: number }[]) {
    const b = this.physics.bounds();
    const pts = rects.map((r) => ({ ...this.physics.toWorld(r.x - window.scrollX, r.y - window.scrollY), hw: r.w / 2 / PX, hh: r.h / 2 / PX }));
    const top = Math.max(...pts.map((p) => p.y + p.hh));
    const bottom = Math.min(...pts.map((p) => p.y - p.hh));
    const margin = 0.05;
    let dy = 0;
    if (top > b.top - margin) dy = b.top - margin - top;
    else if (bottom < b.bottom + margin) dy = b.bottom + margin - bottom;
    return pts.map((p) => ({
      x: Math.min(Math.max(p.x, b.left + p.hw + margin), b.right - p.hw - margin),
      y: p.y + dy,
    }));
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
      setTimeout(() => {
        if (this.enabled) return; // toggled back on mid-settle
        el.style.transition = "";
        el.style.willChange = "";
      }, SETTLE_MS);
    }
    this.letters = [];
  }

  dispose() {
    if (this.enabled) this.disable();
  }
}
