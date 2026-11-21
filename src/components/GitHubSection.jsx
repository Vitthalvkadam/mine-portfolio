import { FaGithub, FaRegStar, FaCodeBranch } from "react-icons/fa";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import Section from "./Section.jsx";
import { useGithub } from "../hooks/useGithub.js";
import { profile, socials } from "../data/portfolioData.js";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function Stat({ label, value }) {
  return (
    <div className="card px-5 py-4">
      <dd className="font-display text-2xl font-semibold text-text">{value}</dd>
      <dt className="mt-0.5 text-sm text-muted">{label}</dt>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card h-20" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card h-32" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  const message = error?.rateLimited
    ? "GitHub's API rate limit was reached for this connection. Try again in a few minutes."
    : error?.notFound
    ? "That GitHub account could not be found."
    : "Couldn't load GitHub data. Check your connection and try again.";
  return (
    <div role="alert" className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">{message}</p>
      <div className="flex gap-3">
        <button type="button" onClick={onRetry} className="btn-ghost">
          Retry
        </button>
        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
          Open GitHub profile
        </a>
      </div>
    </div>
  );
}

export default function GitHubSection() {
  const { status, data, error, retry } = useGithub(profile.githubUsername);

  return (
    <Section
      id="github"
      title="GitHub"
      description="Live from the public GitHub API: my most recently updated repositories."
      action={
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <FaGithub aria-hidden="true" />@{profile.githubUsername}
          <HiOutlineArrowTopRightOnSquare aria-hidden="true" />
        </a>
      }
    >
      <div aria-busy={status === "loading"} aria-live="polite">
        {status === "loading" && <Skeleton />}
        {status === "error" && <ErrorState error={error} onRetry={retry} />}

        {status === "success" && (
          <div className="space-y-8">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Public repositories" value={data.user.publicRepos} />
              <Stat label="Stars earned" value={data.stars} />
              <Stat label="Followers" value={data.user.followers} />
              <Stat label="On GitHub since" value={data.user.since} />
            </dl>

            {data.languages.length > 0 && (
              <p className="text-sm text-muted">
                Most used across repos:{" "}
                {data.languages.map((l, i) => (
                  <span key={l.name}>
                    <span className="text-text">{l.name}</span>
                    {i < data.languages.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}

            {data.repos.length === 0 ? (
              <p className="text-sm text-muted">No public repositories to show yet.</p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.repos.map((repo) => (
                  <li key={repo.id}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card flex h-full flex-col p-5"
                    >
                      <span className="font-mono text-sm font-medium text-text">{repo.name}</span>
                      {repo.description && (
                        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {repo.description}
                        </span>
                      )}
                      <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted">
                        {repo.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                            {repo.language}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1" title="Stars">
                          <FaRegStar aria-hidden="true" />
                          {repo.stars}
                          <span className="sr-only">stars</span>
                        </span>
                        <span className="inline-flex items-center gap-1" title="Forks">
                          <FaCodeBranch aria-hidden="true" />
                          {repo.forks}
                          <span className="sr-only">forks</span>
                        </span>
                        <span className="ml-auto">Updated {dateFmt.format(new Date(repo.pushedAt))}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
