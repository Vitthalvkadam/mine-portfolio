import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useOnlineStatus from "../hooks/useOnlineStatus";

function RatIllustration() {
  const ink = "#222";
  return (
    <svg
      viewBox="0 0 360 290"
      className="h-auto w-[280px] sm:w-[340px]"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="A cartoon rat who just cut the Wi-Fi wire"
    >
      {/* Wi-Fi symbol */}
      <g stroke={ink} strokeWidth="5">
        {[
          "M258.9 58.9 A44 44 0 0 1 321.1 58.9",
          "M268.8 68.8 A30 30 0 0 1 311.2 68.8",
          "M278.7 78.7 A16 16 0 0 1 301.3 78.7",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: (2 - i) * 0.15 }}
          />
        ))}
      </g>
      <circle cx="290" cy="92" r="5" fill={ink} />

      {/* Cut wire */}
      <path d="M290 98 C292 125 278 145 284 170" stroke={ink} strokeWidth="4" />
      <path d="M232 262 C255 272 290 266 312 244" stroke={ink} strokeWidth="4" />

      {/* Tail */}
      <path d="M228 238 C268 258 300 232 322 204" stroke={ink} strokeWidth="10" />
      <path d="M228 238 C268 258 300 232 322 204" stroke="#f4a58a" strokeWidth="5" />

      {/* Ears */}
      <circle cx="132" cy="98" r="24" fill="#7a7a76" stroke={ink} strokeWidth="3" />
      <circle cx="132" cy="98" r="14" fill="#f4a58a" />
      <circle cx="228" cy="98" r="24" fill="#7a7a76" stroke={ink} strokeWidth="3" />
      <circle cx="228" cy="98" r="14" fill="#f4a58a" />

      {/* Body + belly */}
      <ellipse cx="180" cy="205" rx="52" ry="56" fill="#7a7a76" stroke={ink} strokeWidth="3" />
      <ellipse cx="180" cy="218" rx="30" ry="36" fill="#a9a8a3" />

      {/* Feet */}
      <ellipse cx="152" cy="258" rx="20" ry="8" fill="#8f8e89" stroke={ink} strokeWidth="3" />
      <ellipse cx="208" cy="258" rx="20" ry="8" fill="#8f8e89" stroke={ink} strokeWidth="3" />

      {/* Head */}
      <ellipse cx="180" cy="142" rx="56" ry="46" fill="#7a7a76" stroke={ink} strokeWidth="3" />

      {/* Face */}
      <circle cx="160" cy="136" r="10" fill="#fff" stroke={ink} strokeWidth="2.5" />
      <circle cx="200" cy="136" r="10" fill="#fff" stroke={ink} strokeWidth="2.5" />
      <circle cx="162" cy="138" r="4.5" fill={ink} />
      <circle cx="198" cy="138" r="4.5" fill={ink} />
      <ellipse cx="180" cy="156" rx="7" ry="5" fill="#f4a58a" stroke={ink} strokeWidth="2" />
      <path d="M171 164 Q180 172 189 164" stroke={ink} strokeWidth="2.5" />

      {/* Whiskers */}
      <g stroke={ink} strokeWidth="2">
        <path d="M122 152 L150 157" />
        <path d="M120 164 L149 162" />
        <path d="M238 152 L210 157" />
        <path d="M240 164 L211 162" />
      </g>

      {/* Arm + scissors */}
      <path d="M142 196 L116 178" stroke={ink} strokeWidth="9" />
      <path d="M142 196 L116 178" stroke="#7a7a76" strokeWidth="4" />
      <motion.g
        style={{ originX: "108px", originY: "172px" }}
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M104 164 L94 134" stroke={ink} strokeWidth="3" />
        <path d="M112 164 L124 136" stroke={ink} strokeWidth="3" />
        <circle cx="102" cy="174" r="6" stroke="#e0533d" strokeWidth="3" />
        <circle cx="114" cy="174" r="6" stroke="#e0533d" strokeWidth="3" />
      </motion.g>

      {/* Snip sparks */}
      <g stroke={ink} strokeWidth="2.5">
        <path d="M78 150 L88 156" />
        <path d="M74 164 L86 164" />
        <path d="M78 178 L88 172" />
      </g>
    </svg>
  );
}

export default function OfflineScreen() {
  const [online, setOnline] = useOnlineStatus();
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const retry = async () => {
    setChecking(true);
    setFailed(false);
    try {
      // Real connectivity check (navigator.onLine can be wrong)
      const res = await fetch(`/favicon.svg?ping=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("bad response");
      setOnline(true);
    } catch {
      setFailed(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          key="offline"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fdfcf0] px-6 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <RatIllustration />
          </motion.div>

          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            No internet?
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8a8a80]">
            Blame the rat! He thought the Wi-Fi wire was a snack!
          </p>

          <p className="mt-3 font-display text-lg font-semibold text-[#111] sm:text-xl">
            Sir plzzzz 🙏 check ur internet
          </p>

          {failed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              transition={{ duration: 0.4 }}
              className="mt-3 font-mono text-xs text-[#e0533d]"
            >
              Still no connection…
            </motion.p>
          )}

          <button
            type="button"
            onClick={retry}
            disabled={checking}
            className="mt-8 rounded-full border border-[#222]/30 bg-[#8a8a8a] px-10 py-2 text-sm font-medium text-[#111] shadow-md transition hover:bg-[#7b7b7b] active:scale-95 disabled:opacity-60"
          >
            {checking ? "Checking…" : "Retry"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}