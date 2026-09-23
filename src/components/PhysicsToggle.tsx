import { useUI } from "../store";

const PhysicsToggle = () => {
  const sceneActive = useUI((s) => s.sceneActive);
  const on = useUI((s) => s.textPhysics);
  const toggle = useUI((s) => s.toggleTextPhysics);
  if (!sceneActive) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? "Put the letters back" : "Drop the letters and throw them around"}
      className="fixed right-4 bottom-4 z-30 flex min-h-11 items-center gap-2 rounded-full border border-grey-700 bg-grey-900/80 px-4 text-sm backdrop-blur-md transition-colors hover:border-violet-400 sm:right-6 sm:bottom-6"
    >
      <span className={"size-2 rounded-full transition-colors " + (on ? "bg-violet-400 shadow-[0_0_8px] shadow-violet-400" : "bg-grey-600")} aria-hidden="true" />
      <span>
        text.physics = <span className="text-violet-300">{on ? "true" : "false"}</span>
      </span>
    </button>
  );
};

export default PhysicsToggle;
