import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Original, hand-drawn SVG "Ghostface" style character (hooded black robe,
 * elongated white mask with drooping teardrop eyes and a stretched mouth)
 * plus a moonlit haunted-room backdrop. Used by GhostPage as a second
 * playable character. Everything is inline SVG, no external assets.
 *
 * `armL` / `armR` are framer-motion animation controls from GhostPage.
 */

const BLACK = "#050507";

/** Teardrop eye (left one); the right eye is the same path mirrored. */
const EYE = "M113 68C104 64 97 72 97 84C97 96 99 104 101 113C108 105 115 92 115 80C115 75 114 71 113 68Z";

function Mirror({ children }) {
  return <g transform="translate(240 0) scale(-1 1)">{children}</g>;
}

function MaskFace({ face }) {
  const scream = face === "scream";
  const eyeScale = scream ? "translate(-10 -12) scale(1.1)" : undefined;

  return (
    <>
      {/* eyes */}
      <g transform={eyeScale}>
        <path d={EYE} fill={BLACK} />
        <Mirror>
          <path d={EYE} fill={BLACK} />
        </Mirror>
      </g>

      {face === "angry" && (
        <>
          <ellipse cx="106" cy="92" rx="3.4" ry="6" fill="#ff2a2a" />
          <ellipse cx="134" cy="92" rx="3.4" ry="6" fill="#ff2a2a" />
          <path d="M92 62L119 80M148 62L121 80" stroke={BLACK} strokeWidth="5" strokeLinecap="round" />
        </>
      )}

      {face === "love" && (
        <>
          <text x="106" y="96" fontSize="17" textAnchor="middle" fill="#ff3b6b">❤</text>
          <text x="134" y="96" fontSize="17" textAnchor="middle" fill="#ff3b6b">❤</text>
        </>
      )}

      {face === "sleep" && (
        <>
          {/* closed lids painted over the eyes */}
          <path d="M92 62H118V118H92z" fill="#f4f3ec" />
          <path d="M122 62H148V118H122z" fill="#f4f3ec" />
          <path d="M96 90Q106 98 116 90M124 90Q134 98 144 90" stroke="#222" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}

      {face === "sad" && (
        <>
          <path d="M94 70L116 62M146 70L124 62" stroke="#9a9a92" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 116Q99 124 100 128Q104 124 100 116z" fill="#6ab7ff" />
          <path d="M140 118Q139 126 140 130Q144 126 140 118z" fill="#6ab7ff" />
        </>
      )}

      {/* mouth */}
      {face === "happy" || face === "love" ? (
        <path d="M100 124Q120 166 140 124Q120 136 100 124z" fill={BLACK} />
      ) : face === "scream" ? (
        <path d="M120 102C104 110 101 136 106 154C109 166 114 172 120 172C126 172 131 166 134 154C139 136 136 110 120 102z" fill={BLACK} />
      ) : face === "sleep" ? (
        <ellipse cx="120" cy="140" rx="5" ry="7" fill={BLACK} />
      ) : face === "sad" ? (
        <path d="M120 128C115 132 114 142 117 150C118 154 119 155 120 155C121 155 122 154 123 150C126 142 125 132 120 128z" fill={BLACK} />
      ) : face === "angry" ? (
        <path d="M120 112C109 118 107 134 110 146C112 156 116 160 120 160C124 160 128 156 130 146C133 134 131 118 120 112z" fill={BLACK} />
      ) : (
        <path d="M120 112C109 118 107 134 110 146C112 156 116 160 120 160C124 160 128 156 130 146C133 134 131 118 120 112z" fill={BLACK} />
      )}
    </>
  );
}

function Arm({ side, controls }) {
  const left = side === "L";
  const d = left ? "M70 140C58 176 50 220 44 262" : "M170 140C182 176 190 220 196 262";
  const hx = left ? 43 : 197;
  return (
    <motion.g
      animate={controls}
      style={{ transformBox: "fill-box", transformOrigin: left ? "100% 0%" : "0% 0%" }}
    >
      <path d={d} stroke="#262630" strokeWidth="36" strokeLinecap="round" fill="none" />
      <path d={d} stroke="#0d0d12" strokeWidth="32" strokeLinecap="round" fill="none" />
      {/* tattered cuff */}
      <path
        d={left ? "M28 262L34 282L40 266L46 286L52 268L60 280L62 262z" : "M178 262L180 280L188 268L194 286L200 266L206 282L212 262z"}
        fill="#0d0d12"
      />
      {/* glove */}
      <ellipse cx={hx} cy="284" rx="10" ry="13" fill="#030304" stroke="#2c2c34" strokeWidth="1.2" />
      <path
        d={left ? "M34 292l-3 10M39 296l-1 11M45 296l2 10M50 291l4 8" : "M190 291l-4 8M195 296l-2 10M201 296l1 11M206 292l3 10"}
        stroke="#030304"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

export function GhostfaceSvg({ face = "normal", armL, armR }) {
  return (
    <svg viewBox="0 0 240 400" className="w-full overflow-visible drop-shadow-[0_8px_26px_rgba(0,0,0,0.8)]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gfx-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1d24" />
          <stop offset="100%" stopColor="#040405" />
        </linearGradient>
        <radialGradient id="gfx-mask" cx="50%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#ecebe3" />
          <stop offset="100%" stopColor="#a9a89f" />
        </radialGradient>
      </defs>

      {/* robe */}
      <path
        d="M120 98C90 98 66 114 58 150C48 200 44 270 34 346L26 394L44 380L52 398L66 382L78 400L92 384L104 398L116 384L128 400L140 384L152 398L166 382L180 400L192 382L206 396L214 394L206 346C196 270 192 200 182 150C174 114 150 98 120 98z"
        fill="url(#gfx-robe)"
      />
      {/* folds */}
      <path
        d="M92 160C88 220 84 300 78 384M120 170V392M148 160C152 220 156 300 162 384M64 200C66 260 58 320 50 380M176 200C174 260 182 320 190 380"
        stroke="#2b2b35"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* hood */}
      <path
        d="M120 12C80 12 64 50 64 92C64 120 58 140 48 160C68 150 84 146 96 152L144 152C156 146 172 150 192 160C182 140 176 120 176 92C176 50 160 12 120 12z"
        fill="#0e0e13"
        stroke="#2a2a33"
        strokeWidth="1.5"
      />
      {/* shadowed opening */}
      <path
        d="M120 28C96 28 82 54 82 92C82 132 98 160 120 174C142 160 158 132 158 92C158 54 144 28 120 28z"
        fill="#000"
      />

      {/* mask */}
      <path
        d="M120 40C98 40 90 60 92 88C93 118 100 148 112 168Q120 180 128 168C140 148 147 118 148 88C150 60 142 40 120 40z"
        fill="url(#gfx-mask)"
        stroke="#1a1a1a"
        strokeWidth="1.6"
      />
      {/* mask shading: forehead crease + drooping cheek lines */}
      <path d="M102 54Q120 48 138 54" stroke="#b4b3aa" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M98 118C102 138 108 154 114 166M142 118C138 138 132 154 126 166" stroke="#bdbcb3" strokeWidth="2" fill="none" opacity="0.7" />

      <MaskFace face={face} />

      {/* arms sit above the robe */}
      <Arm side="L" controls={armL} />
      <Arm side="R" controls={armR} />
    </svg>
  );
}

/**
 * The real Ghostface cut-out image (same one the random runner uses). Arms/face can't
 * be animated on a photo, so expressions become colour glows; if the image fails to
 * load we fall back to the hand-drawn SVG above (which has moving arms).
 */
const MOOD_FILTER = {
  normal: "drop-shadow(0 10px 22px rgba(0,0,0,.85))",
  happy: "drop-shadow(0 10px 22px rgba(0,0,0,.85)) brightness(1.08)",
  scream: "drop-shadow(0 0 26px rgba(255,30,30,.9)) contrast(1.25) brightness(1.1)",
  angry: "drop-shadow(0 0 22px rgba(255,0,0,.85)) saturate(1.6) contrast(1.15)",
  love: "drop-shadow(0 0 22px rgba(255,80,140,.85)) brightness(1.05)",
  sad: "drop-shadow(0 10px 22px rgba(0,0,0,.85)) grayscale(.6) brightness(.85)",
  sleep: "drop-shadow(0 10px 22px rgba(0,0,0,.85)) grayscale(.8) brightness(.6)",
};

export function GhostfacePhoto({ src, face = "normal", armL, armR }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-[min(40vw,190px)]">
        <GhostfaceSvg face={face} armL={armL} armR={armR} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className="mx-auto block max-h-[min(60vh,390px)] w-auto max-w-[70vw] select-none object-contain transition-[filter] duration-200"
      style={{ filter: MOOD_FILTER[face] || MOOD_FILTER.normal }}
    />
  );
}

/* ---------- furniture helpers for the room ---------- */

function Sofa({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-92" width="250" height="96" rx="26" fill="#3b2a2e" />
      <rect x="-14" y="-52" width="46" height="84" rx="18" fill="#4a3439" />
      <rect x="218" y="-52" width="46" height="84" rx="18" fill="#4a3439" />
      <rect x="26" y="-40" width="98" height="58" rx="12" fill="#533a40" />
      <rect x="126" y="-40" width="98" height="58" rx="12" fill="#533a40" />
      <rect x="26" y="14" width="198" height="26" rx="8" fill="#43303a" />
      <path d="M40 -34L64 -64L96 -40z" fill="#c9a227" opacity="0.9" />
      <rect x="150" y="-72" width="52" height="40" rx="8" fill="#7a1f2e" transform="rotate(-8 176 -52)" />
      <rect x="-6" y="40" width="10" height="14" rx="3" fill="#150d0b" />
      <rect x="246" y="40" width="10" height="14" rx="3" fill="#150d0b" />
    </g>
  );
}

function Armchair({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-100" width="112" height="108" rx="30" fill="#2c3b3a" />
      <rect x="-16" y="-48" width="38" height="78" rx="16" fill="#364a48" />
      <rect x="90" y="-48" width="38" height="78" rx="16" fill="#364a48" />
      <rect x="18" y="-34" width="78" height="52" rx="12" fill="#3f5654" />
      <rect x="18" y="14" width="78" height="22" rx="8" fill="#2f4240" />
      <rect x="-4" y="30" width="10" height="16" rx="3" fill="#150d0b" />
      <rect x="108" y="30" width="10" height="16" rx="3" fill="#150d0b" />
    </g>
  );
}

function Bed({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* headboard */}
      <rect x="0" y="-150" width="250" height="150" rx="14" fill="#2a1a12" />
      <rect x="12" y="-138" width="226" height="52" rx="8" fill="none" stroke="#4a3022" strokeWidth="3" />
      <rect x="12" y="-76" width="226" height="40" rx="8" fill="none" stroke="#4a3022" strokeWidth="3" />
      {/* pillows */}
      <rect x="22" y="-62" width="98" height="42" rx="18" fill="#d8d3c4" />
      <rect x="130" y="-62" width="98" height="42" rx="18" fill="#cfc9b8" />
      <path d="M40 -52Q70 -44 100 -52M148 -52Q178 -44 208 -52" stroke="#b5ae9a" strokeWidth="2" fill="none" />
      {/* blanket, hanging a little over the front */}
      <path d="M8 -22H242L250 36H0z" fill="#5a1420" />
      <path d="M0 -8H250" stroke="#8a2a3a" strokeWidth="6" />
      <path d="M38 -22L30 36M92 -22L88 36M158 -22L162 36M212 -22L220 36" stroke="#3f0d16" strokeWidth="3" opacity="0.7" />
      {/* a bit of the white sheet peeking out at the top fold */}
      <path d="M8 -22H242L240 -12H10z" fill="#d8d3c4" />
      <rect x="6" y="36" width="12" height="12" fill="#150d0b" />
      <rect x="232" y="36" width="12" height="12" fill="#150d0b" />
    </g>
  );
}

function RotaryPhone({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* pulsing red "it's ringing" glow */}
      <circle cx="0" cy="-10" r="26" fill="none" stroke="#ff2a3a" strokeWidth="2">
        <animate attributeName="r" values="14;46" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0;-4;4;-4;4;0" dur="0.5s" repeatCount="indefinite" begin="0s" additive="sum" />
        <path d="M-18 0Q-18 -16 0 -16Q18 -16 18 0z" fill="#1a1a1a" />
        <rect x="-26" y="-24" width="52" height="9" rx="4" fill="#111" />
        <circle cx="0" cy="-6" r="7" fill="#2a2a2a" stroke="#555" strokeWidth="1" />
      </g>
    </g>
  );
}

/**
 * Haunted bedroom/living room: window + moon, bed, nightstand with a ringing phone,
 * armchair, sofa, floor lamp, TV with static, shelf with skull + candles, swinging
 * ceiling lamp, drifting fog. All inline SVG.
 */
export function GhostfaceRoom() {
  const planks = [];
  for (let x = -400; x <= 1300; x += 90) {
    planks.push(
      <line key={x} x1={x} y1="380" x2={450 + (x - 450) * 2.4} y2="520" stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" />
    );
  }
  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="gfr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a2a" />
          <stop offset="100%" stopColor="#1a1024" />
        </linearGradient>
        <linearGradient id="gfr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1810" />
          <stop offset="100%" stopColor="#0b0604" />
        </linearGradient>
        <linearGradient id="gfr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35609a" />
          <stop offset="100%" stopColor="#0c1a36" />
        </linearGradient>
        <linearGradient id="gfr-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9db8ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9db8ff" stopOpacity="0.02" />
        </linearGradient>
        <radialGradient id="gfr-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2f6ff" />
          <stop offset="60%" stopColor="#f2f6ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f2f6ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gfr-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gfr-tv" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fe8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7fe8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gfr-vig" cx="50%" cy="55%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
        <pattern id="gfr-paper" width="36" height="10" patternUnits="userSpaceOnUse">
          <rect width="2" height="10" fill="#fff" fillOpacity="0.035" />
          <circle cx="18" cy="5" r="1.4" fill="#fff" fillOpacity="0.04" />
        </pattern>
        <filter id="gfr-static">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3">
            <animate attributeName="seed" values="1;5;2;9;4;7" dur="0.6s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="gfr-tvclip">
          <rect x="372" y="262" width="76" height="52" rx="4" />
        </clipPath>
      </defs>

      {/* wall */}
      <rect width="900" height="380" fill="url(#gfr-wall)" />
      <rect width="900" height="380" fill="url(#gfr-paper)" />
      <rect y="300" width="900" height="80" fill="#07040e" fillOpacity="0.7" />
      {[30, 240, 450, 660].map((x) => (
        <rect key={x} x={x} y="312" width="190" height="56" fill="none" stroke="#3a2a4a" strokeOpacity="0.55" strokeWidth="2" />
      ))}
      <rect y="298" width="900" height="5" fill="#2a1d36" />
      <rect y="376" width="900" height="8" fill="#1a1022" />

      {/* window + moon, above the bed */}
      <g>
        <rect x="70" y="40" width="190" height="140" fill="#2a1b14" />
        <rect x="80" y="50" width="170" height="120" fill="url(#gfr-glass)" />
        <circle cx="205" cy="92" r="56" fill="url(#gfr-moon)" />
        <circle cx="205" cy="92" r="18" fill="#f4f7ff" />
        <path d="M80 170V140C96 134 102 120 116 114C126 106 134 108 138 98M104 124C98 114 92 112 86 112M190 170V150C200 146 206 136 216 132" stroke="#04060f" strokeWidth="4" strokeLinecap="round" fill="none" />
        <rect x="162" y="50" width="6" height="120" fill="#2a1b14" />
        <rect x="80" y="104" width="170" height="6" fill="#2a1b14" />
        <path d="M54 30H100C96 80 92 130 98 188H50z" fill="#3a0d1a" />
        <path d="M232 30H276V188H236C242 130 236 80 232 30z" fill="#3a0d1a" />
      </g>
      <polygon points="100,384 270,384 470,520 -20,520" fill="url(#gfr-beam)" />

      {/* wall shelf with skull + candles (right of window) */}
      <g>
        <rect x="300" y="150" width="110" height="7" fill="#35241a" />
        <path d="M330 150V128C330 114 354 114 354 128V150z" fill="#e9e4d4" />
        <circle cx="338" cy="130" r="3" fill="#0a0a0a" />
        <circle cx="346" cy="130" r="3" fill="#0a0a0a" />
        <rect x="372" y="132" width="9" height="18" fill="#e8dfc5" />
        <ellipse cx="376.5" cy="126" rx="3" ry="6" fill="#ffb347">
          <animate attributeName="ry" values="6;8;5;7;6" dur="1.1s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="376.5" cy="126" r="26" fill="url(#gfr-lamp)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.4;0.75;0.5;0.7" dur="1.3s" repeatCount="indefinite" />
        </circle>
        <rect x="392" y="138" width="8" height="12" fill="#e8dfc5" />
        <ellipse cx="396" cy="133" rx="2.6" ry="5" fill="#ffb347">
          <animate attributeName="ry" values="5;7;4;6;5" dur="0.9s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* portrait + clock above sofa side */}
      <g>
        <circle cx="520" cy="96" r="30" fill="#1a1210" stroke="#4a3322" strokeWidth="5" />
        <circle cx="520" cy="96" r="23" fill="#d9d2bd" fillOpacity="0.9" />
        <path d="M520 96V80M520 96L532 103" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        <rect x="610" y="60" width="100" height="130" fill="#3b2a14" />
        <rect x="619" y="69" width="82" height="112" fill="#0c0a10" />
        <circle cx="660" cy="118" r="20" fill="#171320" />
        <path d="M623 181C625 152 641 142 660 142S695 152 697 181z" fill="#171320" />
        <circle cx="653" cy="116" r="2.6" fill="#ff4a4a">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="667" cy="116" r="2.6" fill="#ff4a4a">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect x="740" y="84" width="64" height="84" fill="#3b2a14" />
        <rect x="746" y="90" width="52" height="72" fill="#10101a" />
        <path d="M752 156L772 112L792 156z" fill="#1d1a2a" />
      </g>

      {/* TV with static, on a low stand, centre-left */}
      <g>
        <circle cx="410" cy="290" r="110" fill="url(#gfr-tv)">
          <animate attributeName="opacity" values="1;0.6;1;0.8;0.5;1" dur="0.7s" repeatCount="indefinite" />
        </circle>
        <rect x="364" y="254" width="92" height="66" rx="8" fill="#14120f" />
        <rect x="372" y="262" width="76" height="52" rx="4" fill="#9fb4b0" />
        <rect x="372" y="262" width="76" height="52" rx="4" filter="url(#gfr-static)" opacity="0.9" clipPath="url(#gfr-tvclip)" />
        <rect x="380" y="320" width="60" height="8" fill="#14120f" />
        <rect x="350" y="328" width="120" height="52" rx="4" fill="#24160f" />
        <path d="M410 254L392 232M410 254L430 232" stroke="#555" strokeWidth="2" />
      </g>

      {/* furniture */}
      <Bed x={34} y={380} />
      {/* nightstand + phone */}
      <g>
        <rect x="292" y="332" width="54" height="48" rx="3" fill="#2d1d14" />
        <rect x="292" y="326" width="54" height="8" rx="3" fill="#3d2a1d" />
        <rect x="300" y="346" width="38" height="12" fill="none" stroke="#4a3022" strokeWidth="2" />
        <RotaryPhone x={319} y={324} />
      </g>
      <Armchair x={530} y={382} />
      {/* floor lamp between armchair and sofa */}
      <g>
        <circle cx="682" cy="230" r="120" fill="url(#gfr-lamp)">
          <animate attributeName="opacity" values="1;0.8;1;0.9;0.65;1" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <rect x="679" y="252" width="6" height="130" fill="#1a1210" />
        <ellipse cx="682" cy="382" rx="22" ry="5" fill="#1a1210" />
        <path d="M660 252L668 208H696L704 252z" fill="#e8b45c">
          <animate attributeName="fill-opacity" values="1;0.8;1;0.9;0.65;1" dur="3.4s" repeatCount="indefinite" />
        </path>
      </g>
      <Sofa x={620} y={392} />

      {/* floor */}
      <rect y="384" width="900" height="136" fill="url(#gfr-floor)" />
      {planks}
      <line x1="0" y1="384" x2="900" y2="384" stroke="#000" strokeOpacity="0.6" strokeWidth="3" />
      {/* rug in front */}
      <ellipse cx="450" cy="470" rx="330" ry="44" fill="#3a0f1d" />
      <ellipse cx="450" cy="470" rx="296" ry="36" fill="none" stroke="#7a2c40" strokeOpacity="0.7" strokeWidth="3" />
      <ellipse cx="450" cy="470" rx="250" ry="29" fill="none" stroke="#7a2c40" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="10 8" />

      {/* swinging ceiling lamp */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-5 450 0;5 450 0;-5 450 0" dur="4.5s" repeatCount="indefinite" />
        <line x1="450" y1="0" x2="450" y2="46" stroke="#1a1210" strokeWidth="2" />
        <path d="M430 74L438 46H462L470 74z" fill="#e8b45c" fillOpacity="0.9" />
        <circle cx="450" cy="78" r="44" fill="url(#gfr-lamp)" opacity="0.6" />
      </g>

      {/* drifting floor fog */}
      <g opacity="0.35">
        <ellipse cx="200" cy="468" rx="220" ry="22" fill="#b8c4e6" opacity="0.25">
          <animate attributeName="cx" values="120;300;120" dur="14s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="700" cy="480" rx="260" ry="20" fill="#b8c4e6" opacity="0.2">
          <animate attributeName="cx" values="760;600;760" dur="17s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* dust in the moonlight */}
      {[
        [150, 250, 2.2, 6],
        [196, 230, 1.6, 8],
        [232, 290, 1.8, 7],
        [120, 300, 1.4, 9],
      ].map(([cx, cy, r, dur]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#cfe0ff" opacity="0.6">
          <animate attributeName="cy" values={`${cy};${cy - 36};${cy}`} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${dur}s`} repeatCount="indefinite" />
        </circle>
      ))}

      <rect width="900" height="520" fill="url(#gfr-vig)" />
    </svg>
  );
}

/**
 * Retro CRT television. Wraps the Ghostface stage so the character + room play out
 * "on the TV": wood-grain cabinet, curved glass, scanlines, flicker, rolling
 * hum bar, power LED, knobs and speaker grille. Passes children through when `on` is false.
 */
export function GhostfaceTV({ on, children }) {
  if (!on) return children;
  return (
    <div className="relative mx-auto mt-6 max-w-3xl pt-10">
      {/* rabbit-ear antenna */}
      <svg viewBox="0 0 200 60" className="pointer-events-none absolute left-1/2 top-0 h-12 w-40 -translate-x-1/2" aria-hidden="true" focusable="false">
        <path d="M100 58L52 6M100 58L148 10" stroke="#8a8f99" strokeWidth="3" strokeLinecap="round" />
        <circle cx="52" cy="6" r="4" fill="#c8ccd4" />
        <circle cx="148" cy="10" r="4" fill="#c8ccd4" />
        <ellipse cx="100" cy="58" rx="22" ry="5" fill="#15100c" />
      </svg>

      {/* cabinet */}
      <div className="rounded-[2.2rem] border border-black/60 bg-gradient-to-b from-[#4a3326] via-[#2f2018] to-[#1a110c] p-3 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(120,220,255,0.35),inset_0_2px_0_rgba(255,255,255,0.12)] sm:p-5">
        {/* bezel + glass */}
        <div className="rounded-[1.8rem] bg-[#0a0807] p-2.5 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)] sm:p-3.5">
          <div className="relative overflow-hidden rounded-[1.4rem] shadow-[0_0_0_2px_#000,0_0_30px_rgba(120,220,255,0.18)]">
            {children}

            {/* scanlines */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-40 mix-blend-multiply"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)" }}
            />
            {/* rolling hum bar */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 z-20 h-24 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
              initial={{ top: "-20%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* flicker */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-white"
              animate={{ opacity: [0.02, 0.05, 0.015, 0.06, 0.02] }}
              transition={{ duration: 0.45, repeat: Infinity }}
            />
            {/* curved-glass vignette + reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%), linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 28%)",
              }}
            />
          </div>
        </div>

        {/* control strip */}
        <div className="mt-3 flex items-center gap-3 px-2 sm:px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(255,40,40,0.8)]" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#b49a86]/80">REC · CH 13</span>
          <div className="mx-2 hidden h-5 flex-1 sm:block" aria-hidden="true"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, #0c0806 0 3px, transparent 3px 8px)", opacity: 0.8 }} />
          <div className="ml-auto flex items-center gap-2.5" aria-hidden="true">
            {[0, 1].map((k) => (
              <span key={k} className="h-6 w-6 rounded-full border border-black/70 bg-gradient-to-b from-[#6b5444] to-[#2a1d15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <span className="mx-auto mt-0.5 block h-2 w-0.5 rounded bg-black/70" style={{ transform: `rotate(${k ? 40 : -30}deg)` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* feet */}
      <div className="mx-auto flex max-w-[85%] justify-between" aria-hidden="true">
        <span className="h-3 w-16 rounded-b-lg bg-[#120b08]" />
        <span className="h-3 w-16 rounded-b-lg bg-[#120b08]" />
      </div>
    </div>
  );
}
