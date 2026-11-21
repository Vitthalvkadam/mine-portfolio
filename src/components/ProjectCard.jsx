import { Link } from "react-router-dom";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { hasLink } from "../utils/links.js";

const MAX_TAGS = 6;

/** Project summary card used on the home page and the /projects page. */
export default function ProjectCard({ project }) {
  const extra = project.stack.length - MAX_TAGS;
  const detailsHref = `/projects/${project.id}`;

  return (
    <article className="card card-hover relative flex h-full flex-col p-6">
      <h3 className="font-display text-xl font-semibold text-text">
        <Link
          to={detailsHref}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
        >
          {project.title}
        </Link>
      </h3>

      <div className="mt-3 flex-1">
        <p className="line-clamp-5 text-sm leading-relaxed text-muted">{project.description}</p>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
        {project.stack.slice(0, MAX_TAGS).map((tech) => (
          <li key={tech} className="tag">
            {tech}
          </li>
        ))}
        {extra > 0 && <li className="tag text-muted">+{extra} more</li>}
      </ul>

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm">
        {hasLink(project.liveUrl) && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-text transition-colors hover:text-accent"
          >
            <HiOutlineArrowTopRightOnSquare aria-hidden="true" />
            Live demo
          </a>
        )}
        {hasLink(project.githubUrl) && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
          >
            <FaGithub aria-hidden="true" />
            Source
          </a>
        )}
        <Link
          to={detailsHref}
          className="ml-auto text-muted transition-colors hover:text-accent"
          tabIndex={-1}
          aria-hidden="true"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
