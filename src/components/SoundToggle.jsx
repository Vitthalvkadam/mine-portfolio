import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useCrazyMode } from "../context/CrazyModeContext.jsx";

/** Mute / unmute every portfolio sound (dark-mode sting, ghost, certificate voice). */
export default function SoundToggle({ className = "" }) {
  const { muted, toggleMute } = useCrazyMode();
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      className={`glass flex shrink-0 items-center justify-center rounded-full text-lg text-text transition-colors duration-300 hover:border-accent/50 hover:text-accent ${className}`}
    >
      {muted ? <HiOutlineSpeakerXMark /> : <HiOutlineSpeakerWave />}
    </button>
  );
}
