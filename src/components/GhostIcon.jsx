/** Shared ghost drawing used by the Crazy Mode toggle and the ghost overlay. */
export default function GhostIcon({
  className = "",
  bodyFill = "currentColor",
  eyeFill = "var(--color-bg)",
}) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true" focusable="false">
      <path
        d="M8 64V30C8 14 20 4 32 4s24 10 24 26v34l-8-7-8 7-8-7-8 7-8-7z"
        fill={bodyFill}
      />
      <ellipse className="ghost-eye" cx="23" cy="30" rx="4" ry="6" fill={eyeFill} />
      <ellipse className="ghost-eye" cx="41" cy="30" rx="4" ry="6" fill={eyeFill} />
      <ellipse cx="32" cy="45" rx="5" ry="6.5" fill={eyeFill} opacity="0.85" />
    </svg>
  );
}
