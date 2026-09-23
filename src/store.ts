import { create } from "zustand";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

interface UIState {
  reducedMotion: boolean;
  /** True once the WebGL scene is running (false for reduced motion or no WebGL). */
  sceneActive: boolean;
  textPhysics: boolean;
  setSceneActive: (active: boolean) => void;
  toggleTextPhysics: () => void;
}

export const useUI = create<UIState>()((set) => ({
  reducedMotion: motionQuery.matches,
  sceneActive: false,
  textPhysics: false,
  setSceneActive: (sceneActive) => set({ sceneActive }),
  toggleTextPhysics: () => set((s) => ({ textPhysics: !s.textPhysics })),
}));

motionQuery.addEventListener("change", (e) =>
  useUI.setState({ reducedMotion: e.matches, ...(e.matches && { textPhysics: false }) }),
);
