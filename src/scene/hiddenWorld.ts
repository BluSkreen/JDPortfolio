import * as THREE from "three";

export type ShapeKind = "icosahedron" | "octahedron" | "box" | "dodecahedron" | "tetrahedron" | "torusKnot";

export interface WorldObject {
  kind: ShapeKind;
  /** Bounding radius in CSS pixels. */
  radius: number;
  group: THREE.Group;
  geometry: THREE.BufferGeometry;
  velocity: THREE.Vector2;
  spin: THREE.Vector3;
}

const KINDS: ShapeKind[] = ["icosahedron", "octahedron", "box", "dodecahedron", "tetrahedron", "torusKnot"];
const COLORS = ["#a78bfa", "#8b5cf6", "#c4b5fd", "#e879f9", "#7c3aed", "#e1e1e1"];

function makeGeometry(kind: ShapeKind, r: number): THREE.BufferGeometry {
  switch (kind) {
    case "icosahedron":
      return new THREE.IcosahedronGeometry(r, 0);
    case "octahedron":
      return new THREE.OctahedronGeometry(r, 0);
    case "box": {
      const s = r * 1.15;
      return new THREE.BoxGeometry(s, s, s);
    }
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(r, 0);
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(r * 1.1, 0);
    case "torusKnot":
      return new THREE.TorusKnotGeometry(r * 0.55, r * 0.18, 64, 8);
  }
}

/**
 * The scene that only shows through the reveal mask. Uses an orthographic camera in CSS pixels
 * with the origin at the viewport center, so DOM coordinates map directly into it.
 */
export class HiddenWorld {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
  readonly objects: WorldObject[] = [];
  width = 1;
  height = 1;

  constructor(width: number, height: number) {
    this.camera.position.z = 1000;
    this.scene.add(new THREE.HemisphereLight("#ffffff", "#2e1065", 1.6));
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(-0.6, 1, 0.8);
    this.scene.add(key);

    this.setSize(width, height);
    this.populate();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    Object.assign(this.camera, { left: -width / 2, right: width / 2, top: height / 2, bottom: -height / 2 });
    this.camera.updateProjectionMatrix();
    // Keep objects on screen when the viewport shrinks.
    for (const o of this.objects) {
      const p = o.group.position;
      p.x = THREE.MathUtils.clamp(p.x, -width / 2 + o.radius, width / 2 - o.radius);
      p.y = THREE.MathUtils.clamp(p.y, -height / 2 + o.radius, height / 2 - o.radius);
    }
  }

  private populate() {
    const { width: w, height: h } = this;
    const count = w < 768 ? 7 : 12;
    const base = THREE.MathUtils.clamp(Math.min(w, h) * 0.075, 32, 80);

    for (let i = 0; i < count; i++) {
      const kind = KINDS[i % KINDS.length];
      const radius = base * THREE.MathUtils.randFloat(0.7, 1.3);
      const geometry = makeGeometry(kind, radius);
      const color = COLORS[i % COLORS.length];

      const group = new THREE.Group();
      group.add(
        new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.45, metalness: 0.1 })),
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry, 20),
          new THREE.LineBasicMaterial({ color: "#f5f3ff", transparent: true, opacity: 0.55 }),
        ),
      );

      // Rejection-sample a spot that doesn't overlap earlier objects.
      for (let attempt = 0; attempt < 40; attempt++) {
        group.position.set(
          THREE.MathUtils.randFloat(-w / 2 + radius, w / 2 - radius),
          THREE.MathUtils.randFloat(-h / 2 + radius, h / 2 - radius),
          0,
        );
        const clear = this.objects.every(
          (o) => o.group.position.distanceTo(group.position) > o.radius + radius + 12,
        );
        if (clear) break;
      }
      group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      this.scene.add(group);
      this.objects.push({
        kind,
        radius,
        group,
        geometry,
        velocity: new THREE.Vector2(1, 0)
          .rotateAround(new THREE.Vector2(), Math.random() * Math.PI * 2)
          .multiplyScalar(THREE.MathUtils.randFloat(6, 18)),
        spin: new THREE.Vector3(THREE.MathUtils.randFloatSpread(0.6), THREE.MathUtils.randFloatSpread(0.6), 0),
      });
    }
  }

  /** Physics-free fallback: slow drift that bounces off the viewport edges. */
  drift(dt: number) {
    const hw = this.width / 2;
    const hh = this.height / 2;
    for (const o of this.objects) {
      const p = o.group.position;
      p.x += o.velocity.x * dt;
      p.y += o.velocity.y * dt;
      if (Math.abs(p.x) > hw - o.radius) {
        p.x = Math.sign(p.x) * (hw - o.radius);
        o.velocity.x *= -1;
      }
      if (Math.abs(p.y) > hh - o.radius) {
        p.y = Math.sign(p.y) * (hh - o.radius);
        o.velocity.y *= -1;
      }
      o.group.rotation.x += o.spin.x * dt;
      o.group.rotation.y += o.spin.y * dt;
    }
  }

  render(renderer: THREE.WebGLRenderer, target: THREE.WebGLRenderTarget) {
    renderer.setRenderTarget(target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
  }
}
