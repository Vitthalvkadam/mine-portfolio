/**
 * Background
 * Plain, flat background layer shared by the whole page.
 * Uses var(--color-bg), so it's white in light mode and dark in dark mode
 * automatically, with no grid, blobs, glow, or particles.
 */
export default function Background() {
  return <div className="pointer-events-none fixed inset-0 -z-10 bg-bg" />;
}