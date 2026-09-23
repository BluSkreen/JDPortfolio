import * as THREE from "three";
import fullscreenVert from "./shaders/fullscreen.vert?raw";
import maskFrag from "./shaders/mask.frag?raw";
import compositeFrag from "./shaders/composite.frag?raw";

// The mask is low-frequency, so it renders at a fraction of CSS resolution.
const MASK_SCALE = 0.35;

export interface Brush {
  /** Pointer in UV space (0..1, y up). */
  pointer: THREE.Vector2;
  prevPointer: THREE.Vector2;
  strength: number;
}

export class Reveal {
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly maskMaterial: THREE.ShaderMaterial;
  private readonly compositeMaterial: THREE.ShaderMaterial;
  private readonly scene = new THREE.Scene();
  private targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  /** Fresh targets are zero-filled, which decodes as a strong velocity; clear them to neutral first. */
  private needsClear = true;
  private static readonly NEUTRAL = new THREE.Color(0, 0.5, 0.5);
  readonly hiddenTarget: THREE.WebGLRenderTarget;

  constructor(width: number, height: number, pixelRatio: number) {
    const opts = { type: THREE.UnsignedByteType, depthBuffer: false };
    this.targets = [new THREE.WebGLRenderTarget(1, 1, opts), new THREE.WebGLRenderTarget(1, 1, opts)];
    this.hiddenTarget = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });

    this.maskMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: maskFrag,
      uniforms: {
        uPrev: { value: null },
        uPointer: { value: new THREE.Vector2(-1, -1) },
        uPrevPointer: { value: new THREE.Vector2(-1, -1) },
        uAspect: { value: 1 },
        uRadius: { value: 0.12 },
        uStrength: { value: 0 },
        uDecay: { value: 0.97 },
      },
    });

    this.compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: compositeFrag,
      uniforms: {
        uMask: { value: null },
        uHidden: { value: this.hiddenTarget.texture },
        uResolution: { value: new THREE.Vector2() },
        uTime: { value: 0 },
        uBg: { value: new THREE.Color().setHex(0x222222, THREE.LinearSRGBColorSpace) },
        uAccent: { value: new THREE.Color().setHex(0x8b5cf6, THREE.LinearSRGBColorSpace) },
        uGhost: { value: 0.06 },
      },
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.maskMaterial);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
    this.setSize(width, height, pixelRatio);
  }

  setSize(width: number, height: number, pixelRatio: number) {
    const mw = Math.max(1, Math.round(width * MASK_SCALE));
    const mh = Math.max(1, Math.round(height * MASK_SCALE));
    for (const t of this.targets) t.setSize(mw, mh);
    this.needsClear = true;
    this.hiddenTarget.setSize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
    this.maskMaterial.uniforms.uAspect.value = width / height;
    // Brush radius is in UV-height units; keep it roughly 90px wide on any screen.
    this.maskMaterial.uniforms.uRadius.value = Math.min(0.25, 110 / height);
    this.compositeMaterial.uniforms.uResolution.value.set(width, height);
  }

  /** Advances the trail mask one frame. */
  updateMask(renderer: THREE.WebGLRenderer, brush: Brush, dt: number) {
    if (this.needsClear) {
      renderer.setClearColor(Reveal.NEUTRAL, 1);
      for (const t of this.targets) {
        renderer.setRenderTarget(t);
        renderer.clear();
      }
      this.needsClear = false;
    }

    const u = this.maskMaterial.uniforms;
    u.uPrev.value = this.targets[0].texture;
    u.uPointer.value.copy(brush.pointer);
    u.uPrevPointer.value.copy(brush.prevPointer);
    u.uStrength.value = brush.strength;
    u.uDecay.value = Math.pow(0.974, dt * 60);

    this.quad.material = this.maskMaterial;
    renderer.setRenderTarget(this.targets[1]);
    renderer.render(this.scene, this.camera);
    this.targets.reverse();
  }

  /** Draws the final frame to the screen. */
  composite(renderer: THREE.WebGLRenderer, time: number) {
    const u = this.compositeMaterial.uniforms;
    u.uMask.value = this.targets[0].texture;
    u.uTime.value = time;
    this.quad.material = this.compositeMaterial;
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    for (const t of this.targets) t.dispose();
    this.hiddenTarget.dispose();
    this.quad.geometry.dispose();
    this.maskMaterial.dispose();
    this.compositeMaterial.dispose();
  }
}
