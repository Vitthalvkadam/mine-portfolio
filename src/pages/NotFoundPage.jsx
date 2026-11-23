import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <section className="container-px mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center py-32 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="font-display text-[8rem] font-bold leading-none tracking-tight text-text sm:text-[11rem]"
      >
        4<span className="text-accent">0</span>4
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h1 className="mt-6 font-display text-2xl font-semibold text-text sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <p className="mt-3 break-all font-mono text-xs text-muted">
          <span className="text-accent">GET</span> {pathname} → 404
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="btn-primary">
            <HiOutlineArrowLeft />
            Back to home
          </Link>
          <Link to="/projects" className="btn-ghost">
            View projects
          </Link>
        </div>
      </motion.div>
    </section>
  );
}