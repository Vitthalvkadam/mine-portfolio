import { motion } from "framer-motion";
import { HiOutlineArrowUp } from "react-icons/hi";
import { profile } from "../data/portfolioData";

/**
 * Footer
 * A big, name-forward sign-off: eyebrow (role + location), a large
 * split-tone wordmark of the name, then a closing line with a
 * personal tagline.
 */
export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const [firstName, ...rest] = profile.name.trim().split(" ");
  const lastName = rest.join(" ");

  return (
    <footer className="container-px relative mx-auto max-w-7xl border-t border-border pb-10 pt-16">
      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -3 }}
        aria-label="Back to top"
        className="glass absolute right-6 top-10 flex h-10 w-10 items-center justify-center rounded-full text-accent sm:right-10 lg:right-20"
      >
        <HiOutlineArrowUp />
      </motion.button>

      <div className="flex flex-col items-center text-center">
        <span className="eyebrow">
          {profile.role}  
        </span>

        <h2 className="mt-6 font-display text-[clamp(2.5rem,9vw,6rem)] font-bold uppercase leading-none tracking-tight">
          <span className="text-text">{firstName}</span>
          <span className="text-accent"> </span>
          <span className="text-muted">{lastName}</span>
        </h2>

        <div className="mt-10 h-px w-full max-w-md bg-gradient-to-r from-transparent via-border to-transparent" />

        <p className="mt-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.name} - 
           <span className="font-semibold text-accent"> Debugging until the code apologizes 💀</span>
        </p>
      </div>
    </footer>
  );
}
