import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import CurrentlyBuilding from "../components/CurrentlyBuilding";
import GitHubSection from "../components/GitHubSection";
import Certificates from "../components/Certificates";
import Terminal from "../components/Terminal";
import Contact from "../components/Contact";

/** The landing page: one scrollable page. /projects and /blog stay separate routes. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <CurrentlyBuilding />
      <GitHubSection />
      <Certificates />
      <Terminal />
      <Contact />
    </>
  );
}