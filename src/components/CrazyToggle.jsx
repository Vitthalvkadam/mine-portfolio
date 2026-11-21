import { useCrazyMode } from "../context/CrazyModeContext.jsx";
import GhostIcon from "./GhostIcon.jsx";
import SoundToggle from "./SoundToggle.jsx";

/**
 * Navbar logo-button for Crazy Mode. Horror lettering (Creepster) with a
 * chromatic glitch on hover, a bobbing/blinking ghost that goes wild when the
 * mode is on, and a blood-red glow. A mute button appears beside it only while
 * Crazy Mode is active.
 */
export default function CrazyToggle() {
  const { crazy, toggleCrazy } = useCrazyMode();

  return (
    <>
      {crazy && <SoundToggle className="h-9 w-9 md:h-10 md:w-10" />}
      <button
        type="button"
        onClick={toggleCrazy}
        aria-pressed={crazy}
        aria-label={crazy ? "Turn off Crazy Mode" : "Turn on Crazy Mode"}
        title={crazy ? "Crazy Mode: on" : "Crazy Mode: off"}
        className={`crazy-btn glass group relative flex h-9 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full px-2.5 transition-all duration-300 md:h-10 md:px-3.5 ${
          crazy ? "crazy-btn--on" : "text-text hover:border-red-500/60 hover:text-red-500"
        }`}
      >
        <GhostIcon className={`h-5 w-5 ${crazy ? "crazy-bob crazy-bob--wild" : "crazy-bob"}`} />
        <span className="crazy-word hidden text-[17px] leading-none md:inline">
          CRAZY<span className="hidden lg:inline"> MODE</span>
        </span>
      </button>
    </>
  );
}
