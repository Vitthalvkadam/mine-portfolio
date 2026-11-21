import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";
import { profile } from "../data/portfolioData.js";

const SHOW_MS = 2600;
const SHOW_MS_REDUCED = 900;
const EASE = [0.76, 0, 0.24, 1];

/**
 * SplashScreen — deliberately simple: the name rises in letter by letter, a thin line
 * draws under it as the percentage counts up, then the whole screen slides up like a
 * curtain to reveal the site. Uses the theme colours, so it matches light and dark mode.
 * Click / tap / Esc / Enter skips it. No sound, no images.
 */
export default function SplashScreen() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);
  const total = reduced ? SHOW_MS_REDUCED : SHOW_MS;
  const letters = Array.from(profile.name);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t0 = performance.now();
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / (total - 450));
      const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2; // slow start, quick middle, soft landing
      setPct(Math.round(eased * 100));
    }, 30);
    const done = setTimeout(() => setVisible(false), total);
    return () => {
      clearInterval(id);
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, [total]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Loading"
          onClick={() => setVisible(false)}
          initial={{ y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduced ? 0.3 : 0.8, ease: EASE }}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-bg text-text"
        >
          {/* soft glow behind the name */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-mono text-[11px] uppercase tracking-[0.45em] text-muted"
              style={{ textIndent: "0.45em" }}
            >
              Portfolio
            </motion.p>

            {/* name: letters rise out of a mask */}
            <h1 className="mt-5 flex flex-wrap justify-center overflow-hidden font-display text-5xl font-semibold tracking-tight sm:text-7xl" aria-label={profile.name}>
              {letters.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden pb-2" aria-hidden="true">
                  <motion.span
                    className="inline-block"
                    initial={reduced ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.045, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-3 font-mono text-xs tracking-[0.2em] text-muted"
            >
              {profile.role}
            </motion.p>

            {/* progress line */}
            <div className="relative mt-10 h-px w-[min(70vw,300px)] bg-border" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ width: `${pct}%`, boxShadow: "0 0 12px 1px var(--color-accent)" }}
              />
            </div>
            <p className="mt-3 font-mono text-xs tabular-nums tracking-[0.3em] text-muted" style={{ textIndent: "0.3em" }}>
              {String(pct).padStart(3, "0")}
            </p>
          </div>

          <button
            type="button"
            aria-label="Skip intro"
            onClick={() => setVisible(false)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg text-muted transition hover:border-accent hover:text-accent"
          >
            <HiOutlineX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
