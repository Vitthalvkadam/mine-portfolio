import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as sfx from "../utils/sfx.js";

const SoundContext = createContext(null);

function readMuted() {
  try {
    return window.localStorage.getItem("soundMuted") === "true";
  } catch {
    return false;
  }
}

/**
 * Global sound mute state (used by the footer SoundToggle, the theme lamp sting and the
 * certificate voice line). Kept separate from ThemeContext so the two never affect each other.
 */
export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(() => {
    const m = readMuted();
    sfx.setMuted(m); // before first paint, so a saved mute is respected immediately
    return m;
  });

  // Create the audio context on the first real interaction (autoplay policy).
  useEffect(() => sfx.armOnFirstGesture(), []);

  useEffect(() => {
    sfx.setMuted(muted); // muting also stops anything currently playing
    try {
      window.localStorage.setItem("soundMuted", String(muted));
    } catch {
      /* storage unavailable (private mode): state still works for the session */
    }
  }, [muted]);

  // One-time tidy-up of the flag the removed Crazy Mode used to store.
  useEffect(() => {
    try {
      window.localStorage.removeItem("crazyMode");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);
  const value = useMemo(() => ({ muted, toggleMute }), [muted, toggleMute]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
}