import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { projects } from "../data/portfolioData";
import { hasLink } from "../utils/links.js";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <section className="container-px mx-auto max-w-3xl py-40 text-center">
        <h1 className="section-heading">Project not found</h1>
        <p className="mt-4 text-muted">This project doesn't exist or may have been moved.</p>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:text-accent-2"
        >
          <HiOutlineArrowLeft />
          Back to projects
        </Link>
      </section>
    );
  }

  return (
    <section className="container-px mx-auto max-w-3xl py-32">
      <Link
        to="/projects"
        className="mb-10 inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <HiOutlineArrowLeft />
        Back to projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="section-heading">{project.title}</h1>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="tag"
            >
              {tech}
            </span>
          ))}
        </div>


        <p className="mt-8 max-w-prose leading-relaxed text-muted">{project.description}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {hasLink(project.liveUrl) && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <HiOutlineArrowTopRightOnSquare aria-hidden="true" />
              Live demo
            </a>
          )}
          {hasLink(project.githubUrl) && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <FaGithub aria-hidden="true" />
              View source
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
