import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile } from "../data/portfolioData";
import profileImg from "../assets/profile.jpg";
import ThemeToggle from "./ThemeToggle.jsx";

/**
 * Navbar
 * Sticky + blurred once the page scrolls. "About" scrolls to the section
 * on the home page (or navigates home first if you're on another route);
 * "Projects" and "Blog" are their own routed pages.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#about");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) return undefined;

    const sectionLinks = navLinks.filter((l) => l.type === "section");
    const sections = sectionLinks
      .map((l) => document.querySelector(l.href.replace("/", "")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const handleSectionClick = (href) => {
    setMenuOpen(false);
    const hash = href.replace("/", ""); // e.g. "/#about" -> "#about"
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const isLinkActive = (link) => {
    if (link.type === "section") return isHome && active === link.href.replace("/", "");
    return location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4 sm:top-6">
<nav className="glass flex w-[1130px] max-w-[95vw] items-center justify-between rounded-3xl px-12 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.55)]">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          aria-label={profile.name}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="glass flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-10 sm:w-10">
            <img
              src={profileImg}
              alt={profile.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
            <span
              style={{ display: "none" }}
              className="h-full w-full items-center justify-center bg-gradient-to-br from-surface to-surface-2 font-display text-sm font-semibold text-accent"
            >
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const activeLink = isLinkActive(link);
            return (
              <li key={link.href} className="relative">
                {link.type === "section" ? (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick(link.href);
                    }}
                    className={`font-body text-[15px] font-medium transition-colors duration-300 ${activeLink ? "text-accent" : "text-muted hover:text-text"
                      }`}
                  >
                    {link.label}
                    {activeLink && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-accent to-accent-2"
                      />
                    )}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-body text-[15px] font-medium transition-colors duration-300 ${activeLink ? "text-accent" : "text-muted hover:text-text"
                      }`}
                  >
                    {link.label}
                    {activeLink && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-accent to-accent-2"
                      />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden md:flex" />

          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick("/#contact");
            }}
            className="btn-ghost font-body hidden md:inline-flex"
          >
            Let's talk
          </a>

          <ThemeToggle className="flex h-9 w-9 md:hidden" />

          {/* mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass rounded-full p-2 text-text md:hidden"
          >
            {menuOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass mt-3 w-[calc(100%-1rem)] max-w-xs overflow-hidden rounded-2xl md:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const activeLink = isLinkActive(link);
                return (
                  <li key={link.href}>
                    {link.type === "section" ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSectionClick(link.href);
                        }}
                        className={`block rounded-lg px-3 py-2.5 font-body text-[15px] font-medium ${activeLink
                            ? "bg-surface-2 text-accent"
                            : "text-muted hover:bg-surface-2 hover:text-text"
                          }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block rounded-lg px-3 py-2.5 font-body text-[15px] font-medium ${activeLink
                            ? "bg-surface-2 text-accent"
                            : "text-muted hover:bg-surface-2 hover:text-text"
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
