import { useEffect, useRef } from "react";
import { useUI } from "../store";

/**
 * WebGL2 with a real GPU. Software renderers (SwiftShader, llvmpipe) technically work but
 * would pin the main thread every frame, so they get the static fallback. `?forcegl` overrides.
 */
function hasHardwareWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    if (new URLSearchParams(location.search).has("forcegl")) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

const webglOK = hasHardwareWebGL2();

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
  const enabled = !reducedMotion && webglOK;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    let unmount: (() => void) | undefined;
    let cancelled = false;
    // three.js lives in its own chunk so the page content paints first.
    whenIdle(() =>
      import("./controller").then(({ mountScene }) => {
        if (cancelled) return;
        unmount = mountScene(canvas);
        setSceneActive(true);
      }),
    );
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

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 block h-lvh w-full" />;
};

export default Scene;
