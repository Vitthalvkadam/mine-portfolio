import { FaGithub } from "react-icons/fa";
import Section from "./Section.jsx";
import { currentlyBuilding } from "../data/portfolioData.js";
import { hasLink } from "../utils/links.js";

export default function CurrentlyBuilding() {
  const { projects, learning } = currentlyBuilding;

  return (
    <Section
      id="building"
      title="Currently building"
      description="What I'm working on and learning right now."
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {projects.map((p) => (
            <article key={p.name} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-semibold text-text">{p.name}</h3>
                {hasLink(p.href) && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} on GitHub`}
                    className="text-lg text-muted transition-colors hover:text-accent"
                  >
                    <FaGithub aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                {p.stack.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
              {p.status && (
                <p className="mt-4 flex items-center gap-2 text-sm text-text">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  {p.status}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-text">Learning</h3>
          <ul className="mt-4 space-y-3">
            {learning.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
