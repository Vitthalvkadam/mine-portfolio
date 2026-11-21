/**
 * Section
 * Consistent wrapper + left-aligned heading for every home-page section.
 * `action` is an optional node rendered to the right of the heading.
 */
export default function Section({ id, title, description, action, children, className = "" }) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`container-px mx-auto max-w-6xl py-20 sm:py-24 ${className}`}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id={headingId} className="section-heading">
            {title}
          </h2>
          {description && <p className="mt-3 leading-relaxed text-muted">{description}</p>}
        </div>
        {action}
      </header>
      <div className="mt-10">{children}</div>
    </section>
  );
}
