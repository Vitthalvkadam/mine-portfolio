import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile, socials } from "../data/portfolioData";
import profileImg from "../assets/profile.jpg";

/** Cycles through the roles in portfolioData. Static first role when reduced motion is on. */
function useTypingEffect(words, enabled, typingSpeed = 65, pauseTime = 1400) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => setText((t) => (deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1))),
        deleting ? typingSpeed / 2 : typingSpeed
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, enabled, typingSpeed, pauseTime]);

  return enabled ? text : words[0];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

const iconLink =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg text-muted transition-colors hover:border-accent hover:text-accent";

export default function Hero() {
  const reduced = useReducedMotion();
  const typed = useTypingEffect(profile.typingRoles, !reduced);

  return (
    <section
      id="home"
      className="container-px mx-auto grid min-h-[100svh] max-w-6xl content-center items-center gap-8 pb-16 pt-28 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:pt-32"
    >
      <motion.div variants={container} initial={reduced ? "show" : "hidden"} animate="show">
        <motion.p variants={item} className="inline-flex items-center gap-2 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {profile.availability}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-6xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p variants={item} className="mt-4 font-mono text-lg text-accent sm:text-xl">
          <span className="sr-only">{profile.role}</span>
          <span aria-hidden="true">
            {typed}
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-accent" />
          </span>
        </motion.p>

        <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {profile.headline}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <HiOutlineDocumentArrowDown aria-hidden="true" className="text-lg" />
            Resume
          </a>
          <a href="#projects" className="btn-ghost">
            View projects
          </a>
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <div className="flex items-center gap-3">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
            <FaGithub />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLink}>
            <FaLinkedin />
          </a>
          <a href={socials.email} aria-label="Email" className={iconLink}>
            <HiOutlineMail />
          </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="order-first w-28 sm:mx-auto sm:w-48 lg:order-none lg:mx-0 lg:w-full lg:max-w-[18rem] lg:justify-self-end"
      >
        <img
          src={profileImg}
          alt={`Portrait of ${profile.name}`}
          width="383"
          height="383"
          className="aspect-square w-full rounded-2xl border border-border object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </motion.div>
    </section>
  );
}
