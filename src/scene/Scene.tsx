import { useEffect, useRef } from "react";
import { useUI } from "../store";
import type { Engine } from "./engine";

function supportsWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useUI((s) => s.reducedMotion);
  const setSceneActive = useUI((s) => s.setSceneActive);
  const enabled = !reducedMotion && supportsWebGL2();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    let engine: Engine | undefined;
    let cancelled = false;
    // three.js lives in its own chunk so the page content paints first.
    import("./engine").then(({ Engine }) => {
      if (cancelled) return;
      engine = new Engine(canvas);
      engine.start();
      setSceneActive(true);
    });
    return () => {
      cancelled = true;
      setSceneActive(false);
      engine?.dispose();
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
