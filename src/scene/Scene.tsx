import { useEffect, useRef, useState } from "react";
import { useUI } from "../store";

/**
 * WebGL2 with a real GPU. Software renderers (SwiftShader, llvmpipe) technically work but
 * would pin the main thread every frame, so they get the static fallback. `?forcegl` overrides.
 */
function probeHardwareWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    // Release the probe context right away; browsers only allow a handful at once.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (new URLSearchParams(location.search).has("forcegl")) return true;
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

// Probed lazily (creating a GL context isn't free) and only once per page load.
let webglOK: boolean | undefined;
const hasHardwareWebGL2 = () => (webglOK ??= probeHardwareWebGL2());

/** Runs after the page has loaded and the browser is idle, so the scene never delays content. */
function whenIdle(fn: () => void) {
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useUI((s) => s.reducedMotion);
  const setSceneActive = useUI((s) => s.setSceneActive);
  // Unknown until the idle-time probe runs; the (still empty) canvas stays mounted meanwhile.
  const [gpuOK, setGpuOK] = useState(webglOK);
  const enabled = !reducedMotion && gpuOK !== false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    let unmount: (() => void) | undefined;
    let cancelled = false;
    // The GPU probe and three.js both wait for idle, so neither delays the first paint.
    whenIdle(() => {
      if (cancelled) return;
      if (!hasHardwareWebGL2()) {
        setGpuOK(false);
        return;
      }
      import("./controller").then(({ mountScene }) => {
        if (cancelled) return;
        unmount = mountScene(canvas);
        setSceneActive(true);
      });
    });
    return () => {
      cancelled = true;
      setSceneActive(false);
      unmount?.();
    };
  }, [enabled, setSceneActive]);

  if (!enabled) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgb(139_92_246/0.12),transparent_60%)]"
      />
    );
  }

  // Sized to the visible viewport (not lvh), so the physics floor is never under a mobile toolbar.
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 block size-full" />;
};

export default Scene;
