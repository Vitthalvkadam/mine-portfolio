import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { playDarkStinger } from "../utils/sfx.js";

/**
 * ThemeLamp
 * A pendant lamp hanging from the footer rule — the light/dark theme switch.
 * Lamp ON = light theme, lamp OFF = dark theme. Clicking swings the lamp, pulls
 * the chain, and (turning on) flickers the bulb into a warm glow. Switching to
 * dark plays the subtle horror sting. The theme itself is persisted by ThemeContext.
 */
export default function ThemeLamp() {
  const { theme, toggleTheme } = useTheme();
  const on = theme === "light";
  const reduced = useReducedMotion();

  const swing = useAnimationControls();
  const chain = useAnimationControls();
  const glow = useAnimationControls();
  const firstRun = useRef(true);
  const fadeTimer = useRef(0);

  // Light bloom: flicker in when switching on, ease out when switching off.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (on && !reduced) {
      glow.start({ opacity: [0, 1, 0.35, 1, 0.7, 1], transition: { duration: 0.8 } });
    } else {
      glow.start({ opacity: on ? 1 : 0, transition: { duration: 0.45 } });
    }
  }, [on, reduced, glow]);

  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  const handleClick = () => {
    const goingDark = on;

    // Short global colour cross-fade so the whole page changes smoothly.
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => root.classList.remove("theme-transition"), 600);

    if (!reduced) {
      swing.start({ rotate: [0, 6, -4, 2, -1, 0], transition: { duration: 1, ease: "easeOut" } });
      chain.start({ y: [0, 14, 0], transition: { duration: 0.5, ease: "easeOut" } });
    }

    toggleTheme();
    if (goingDark) playDarkStinger();
  };

  const label = `Switch to ${on ? "dark" : "light"} mode`;

  return (
    <div className="relative mx-auto h-[104px] w-[120px]">
      {/* soft ambient bloom on the page, fades with the lamp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 h-[230px] w-[min(380px,100vw)] -translate-x-1/2 transition-opacity duration-700"
        style={{
          opacity: on ? 1 : 0,
          background:
            "radial-gradient(ellipse 50% 55% at 50% 0%, rgba(251,191,36,0.30), rgba(251,191,36,0.10) 55%, transparent 80%)",
        }}
      />

      <motion.button
        type="button"
        onClick={handleClick}
        role="switch"
        aria-checked={on}
        aria-label={label}
        title={label}
        animate={swing}
        style={{ transformOrigin: "50% 0%" }}
        className="relative block h-full w-full cursor-pointer rounded-b-2xl"
        whileTap={reduced ? undefined : { scale: 0.97 }}
      >
        <svg viewBox="0 0 140 118" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="lamp-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fde68a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lamp-halo">
              <stop offset="0" stopColor="#fde047" stopOpacity="0.9" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* light cone + halo, animated as one group */}
          <motion.g initial={{ opacity: on ? 1 : 0 }} animate={glow}>
            <polygon points="48,70 92,70 150,190 -10,190" fill="url(#lamp-cone)" />
            <circle cx="70" cy="74" r="30" fill="url(#lamp-halo)" />
          </motion.g>

          {/* cord */}
          <line x1="70" y1="0" x2="70" y2="34" stroke="var(--color-muted)" strokeWidth="2" />

          {/* bulb (drawn before the shade so the shade overlaps its top) */}
          <motion.circle
            cx="70"
            cy="71"
            r="9"
            initial={false}
            animate={{ fill: on ? "#fff3b0" : "#3a3a3a" }}
            transition={{ duration: 0.4 }}
          />

          {/* shade */}
          <path
            d="M38 68 L52 34 H88 L102 68 Z"
            fill="var(--color-surface-2)"
            stroke="var(--color-muted)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="62" y="29" width="16" height="7" rx="2" fill="var(--color-muted)" />
          <motion.ellipse
            cx="70"
            cy="68"
            rx="32"
            ry="3.5"
            initial={false}
            animate={{ fill: on ? "#fcd34d" : "#52525b" }}
            transition={{ duration: 0.4 }}
          />

          {/* pull chain */}
          <motion.g animate={chain}>
            <line x1="94" y1="66" x2="94" y2="96" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="94" cy="100" r="4" fill="var(--color-accent)" />
          </motion.g>
        </svg>
      </motion.button>
    </div>
  );
}
