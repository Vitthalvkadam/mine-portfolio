import Section from "./Section.jsx";
import { profile, timeline } from "../data/portfolioData";

export default function About() {
  return (
    <Section id="about" title="About" description="A short introduction and how I got here.">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="max-w-prose text-base leading-relaxed text-muted">{profile.about}</p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            {profile.facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="text-sm text-text">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-text">Developer journey</h3>
          <ol className="mt-6 space-y-8 border-l border-border pl-6">
            {timeline.map((entry) => (
              <li key={entry.year} className="relative">
                <span
                  className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs text-accent-2">{entry.year}</p>
                <h4 className="mt-1 font-display text-base font-medium text-text">{entry.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
