/**
 * Background
 * Plain, flat background layer shared by the whole page (var(--color-bg)).
 */
export default function Background() {
  return <div className="pointer-events-none fixed inset-0 -z-10 bg-bg" />;
}