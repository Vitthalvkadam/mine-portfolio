import {
  SiSpringboot,
  SiSpring,
  SiSpringsecurity,
  SiHibernate,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiPostman,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { HiOutlineCircleStack } from "react-icons/hi2";
import { TbApi } from "react-icons/tb";
import Section from "./Section.jsx";
import { skillCategories } from "../data/portfolioData";

const ICONS = {
  java: FaJava,
  javascript: SiJavascript,
  typescript: SiTypescript,
  html: SiHtml5,
  css: SiCss,
  springboot: SiSpringboot,
  spring: SiSpring,
  springsecurity: SiSpringsecurity,
  hibernate: SiHibernate,
  jpa: HiOutlineCircleStack,
  nodejs: SiNodedotjs,
  express: SiExpress,
  restapi: TbApi,
  react: SiReact,
  tailwind: SiTailwindcss,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  git: SiGit,
  github: SiGithub,
  postman: SiPostman,
};

export default function Skills() {
  return (
    <Section id="skills" title="Skills" description="The technologies I use across the stack, grouped by role.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map(({ category, skills }) => (
          <div key={category} className="card p-6">
            <h3 className="font-display text-base font-semibold text-text">{category}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {skills.map((skill) => {
                const Icon = ICONS[skill.icon];
                return (
                  <li key={skill.name} className="flex items-center gap-2.5 text-sm text-muted">
                    {Icon && <Icon className="shrink-0 text-lg text-accent-2" aria-hidden="true" />}
                    <span>{skill.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
