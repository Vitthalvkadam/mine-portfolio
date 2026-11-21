import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import ProjectCard from "../components/ProjectCard.jsx";
import { projects } from "../data/portfolioData";

export default function ProjectsPage() {
  return (
    <section className="container-px mx-auto max-w-6xl py-32">
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <HiOutlineArrowLeft aria-hidden="true" />
        Back to home
      </Link>

      <h1 className="section-heading">Projects</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        Full-stack projects built end to end, from database design to the UI.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
