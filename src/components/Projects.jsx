import { Link } from "react-router-dom";
import Section from "./Section.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { projects } from "../data/portfolioData";

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      description="Full-stack projects built end to end, from database design to the UI."
      action={
        <Link to="/projects" className="text-sm text-muted transition-colors hover:text-accent">
          View all projects
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
