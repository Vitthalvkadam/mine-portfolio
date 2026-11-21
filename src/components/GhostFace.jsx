/**
 * Stand-in ghost used for the full-screen attack when no real asset exists in
 * src/assets/horror. A gaunt, hollow-eyed face with a stretched mouth and
 * trailing hair, warped by an SVG displacement filter. Replace it by dropping
 * ghost.mp4/webm/jpg/png/webp into src/assets/horror.
 */
export default function GhostFace({ className = "" }) {
  return (
    <svg viewBox="0 0 400 560" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="gf-skin" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#f3f1ea" />
          <stop offset="55%" stopColor="#b9b6ad" />
          <stop offset="100%" stopColor="#3c3a38" />
        </radialGradient>
        <radialGradient id="gf-eye" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#000" />
          <stop offset="70%" stopColor="#050000" />
          <stop offset="100%" stopColor="#2a0000" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="gf-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <filter id="gf-warp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
        </filter>
        <filter id="gf-soft">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g filter="url(#gf-warp)">
        {/* hair */}
        <path
          d="M200 20C90 20 50 120 55 230c4 90-15 200-40 320h40c20-90 30-170 35-250h220c5 80 15 160 35 250h40c-25-120-44-230-40-320C350 120 310 20 200 20z"
          fill="url(#gf-hair)"
        />
        {/* face */}
        <path
          d="M200 48c-70 0-108 62-108 146 0 60 18 112 50 160 14 22 36 38 58 38s44-16 58-38c32-48 50-100 50-160 0-84-38-146-108-146z"
          fill="url(#gf-skin)"
        />
        {/* cheek hollows & brow shadow */}
        <g filter="url(#gf-soft)" fill="#000" opacity="0.5">
          <ellipse cx="135" cy="290" rx="26" ry="52" />
          <ellipse cx="265" cy="290" rx="26" ry="52" />
          <rect x="112" y="150" width="176" height="22" rx="11" />
        </g>
        {/* eyes */}
        <ellipse cx="152" cy="205" rx="34" ry="46" fill="url(#gf-eye)" transform="rotate(-8 152 205)" />
        <ellipse cx="248" cy="205" rx="34" ry="46" fill="url(#gf-eye)" transform="rotate(8 248 205)" />
        <circle cx="152" cy="212" r="4.5" fill="#ff2a2a" opacity="0.9" />
        <circle cx="248" cy="212" r="4.5" fill="#ff2a2a" opacity="0.9" />
        {/* nose */}
        <path d="M200 250l-9 40h18z" fill="#000" opacity="0.35" />
        {/* screaming mouth */}
        <path
          d="M148 360c10-18 34-26 52-26s42 8 52 26c4 70-18 128-52 128s-56-58-52-128z"
          fill="#030000"
        />
        <path d="M168 372h64M172 468h56" stroke="#d8d4c8" strokeWidth="6" strokeDasharray="5 9" opacity="0.7" />
      </g>
    </svg>
  );
}
