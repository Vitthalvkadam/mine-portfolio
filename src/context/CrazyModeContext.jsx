import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as sfx from "../utils/sfx.js";

const CrazyModeContext = createContext(null);

function readFlag(key) {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function writeFlag(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable (private mode) — state still works for the session */
  }
}

/**
 * Crazy Mode + sound mute state. Deliberately separate from ThemeContext so
 * the light/dark theme and the spooky extras never affect each other.
 */
export function CrazyModeProvider({ children }) {
  const [crazy, setCrazy] = useState(() => readFlag("crazyMode"));
  const [muted, setMuted] = useState(() => {
    const m = readFlag("soundMuted");
    sfx.setMuted(m); // before first paint, so the splash sound respects a saved mute
    return m;
  });

  // Create the audio context on the first real interaction (autoplay policy).
  useEffect(() => sfx.armOnFirstGesture(), []);

  useEffect(() => {
    sfx.setMuted(muted); // muting also stops anything currently playing
    writeFlag("soundMuted", muted);
  }, [muted]);

  const wasCrazy = useRef(crazy);
  useEffect(() => {
    document.documentElement.classList.toggle("crazy", crazy);
    writeFlag("crazyMode", crazy);
    if (!crazy && wasCrazy.current) sfx.stopAll(); // switching off silences everything right away
    wasCrazy.current = crazy;
    return () => document.documentElement.classList.remove("crazy");
  }, [crazy]);

  const toggleCrazy = useCallback(() => {
    if (!crazy) {
      sfx.playCrazyOn(); // inside the click handler = valid user gesture
      sfx.preloadAsset("scream"); // warm the real scream so the attack is in sync
      sfx.preloadAsset("runner"); // warm the runner sound too
    }
    setCrazy(!crazy);
  }, [crazy]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const value = useMemo(
    () => ({ crazy, toggleCrazy, muted, toggleMute }),
    [crazy, toggleCrazy, muted, toggleMute]
  );

  return <CrazyModeContext.Provider value={value}>{children}</CrazyModeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCrazyMode() {
  const ctx = useContext(CrazyModeContext);
  if (!ctx) throw new Error("useCrazyMode must be used within a CrazyModeProvider");
  return ctx;
}
