import { Engine } from "./engine";
import type { Physics } from "./physics";
import type { TextPhysics } from "./textPhysics";
import { useUI } from "../store";

const FIRST_INPUT = ["pointermove", "pointerdown", "touchstart", "keydown"] as const;

/** Starts the background scene. Physics (Rapier WASM) loads on first interaction or first toggle. */
export function mountScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas);
  engine.start();

  let disposed = false;
  let loaded: Promise<{ physics: Physics; text: TextPhysics } | null> | null = null;

  const loadPhysics = () =>
    (loaded ??= Promise.all([import("./physics"), import("./textPhysics")]).then(async ([{ Physics }, { TextPhysics }]) => {
      if (disposed) return null;
      const physics = await Physics.create(engine);
      if (disposed) {
        physics.dispose();
        return null;
      }
      return { physics, text: new TextPhysics(physics) };
    }));

  const onFirstInput = () => {
    for (const type of FIRST_INPUT) window.removeEventListener(type, onFirstInput);
    loadPhysics();
  };
  for (const type of FIRST_INPUT) window.addEventListener(type, onFirstInput, { passive: true });

  const syncText = async () => {
    const p = await loadPhysics();
    if (!p) return;
    // Read the latest value: the toggle may have flipped again while Rapier was loading.
    if (useUI.getState().textPhysics) p.text.enable();
    else p.text.disable();
  };
  const unsubscribe = useUI.subscribe((s, prev) => {
    if (s.textPhysics !== prev.textPhysics) syncText();
  });

  const onResize = () => loaded?.then((p) => p?.text.enabled && p.text.remeasure());
  window.addEventListener("resize", onResize);

  return () => {
    disposed = true;
    for (const type of FIRST_INPUT) window.removeEventListener(type, onFirstInput);
    window.removeEventListener("resize", onResize);
    unsubscribe();
    // Physics holds references into the engine, so it goes first (once it has finished loading).
    Promise.resolve(loaded).then((p) => {
      p?.text.dispose();
      p?.physics.dispose();
      engine.dispose();
    });
    useUI.setState({ textPhysics: false });
  };
}
