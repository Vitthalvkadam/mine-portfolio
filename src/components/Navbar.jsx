import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile } from "../data/portfolioData";
import profileImg from "../assets/profile.jpg";
import CrazyToggle from "./CrazyToggle.jsx";
import { useCrazyMode } from "../context/CrazyModeContext.jsx";

const linkBase = "relative py-1 text-sm font-medium transition-colors duration-200";

/**
 * Navbar
 * Floating bar aligned to the page's content width. Section links scroll on the home page
 * (or navigate home first); Blog and Ghost are routes. Ghost only shows in Crazy Mode.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pendingHash = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { crazy } = useCrazyMode();

  const links = navLinks.filter((l) => crazy || l.href !== "/ghost");
  const isHome = location.pathname === "/";

  // Stronger bar background once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!isHome) return undefined;
    const sections = navLinks
      .filter((l) => l.type === "section")
      .map((l) => document.querySelector(l.href.replace("/", "")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const scrollToHash = (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  const handleSectionClick = (href) => {
    const hash = href.replace("/", ""); // "/#about" -> "#about"
    if (!isHome) {
      setMenuOpen(false);
      navigate(href);
    } else if (menuOpen) {
      // Smooth scroll started during the menu re-render gets cancelled, so wait for it to close.
      pendingHash.current = hash;
      setMenuOpen(false);
    } else {
      scrollToHash(hash);
    }
  };

  const handleMenuExited = () => {
    if (pendingHash.current) {
      scrollToHash(pendingHash.current);
      pendingHash.current = null;
    }
  };

  const isLinkActive = (link) => {
    if (link.type === "section") return isHome && active === link.href.replace("/", "");
    return location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
  };

  const renderLink = (link, mobile = false) => {
    const current = isLinkActive(link);
    const cls = mobile
      ? `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          current ? "bg-surface-2 text-accent" : "text-muted hover:bg-surface-2 hover:text-text"
        }`
      : `${linkBase} ${current ? "text-text" : "text-muted hover:text-text"}`;
    const underline =
      !mobile && current ? (
        <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-1 h-px bg-accent" />
      ) : null;

    return link.type === "section" ? (
      <a
        href={link.href}
        aria-current={current ? "location" : undefined}
        onClick={(e) => {
          e.preventDefault();
          handleSectionClick(link.href);
        }}
        className={cls}
      >
        {link.label}
        {underline}
      </a>
    ) : (
      <Link
        to={link.href}
        aria-current={current ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
        className={cls}
      >
        {link.label}
        {underline}
      </Link>
    );
  };

  return (
    <header className="fixed inset-x-0 top-3 z-50 sm:top-4">
      <div className="container-px mx-auto max-w-6xl">
        <nav
          aria-label="Primary"
          className={`glass flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 transition-shadow duration-300 sm:px-5 ${
            scrolled ? "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]" : ""
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            aria-label={`${profile.name} — home`}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2">
              <img
                src={profileImg}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              <span
                style={{ display: "none" }}
                className="h-full w-full items-center justify-center font-display text-sm font-semibold text-accent"
              >
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </span>
            <span className="hidden font-display text-sm font-semibold text-text lg:inline">{profile.name}</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <li key={link.href}>{renderLink(link)}</li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <CrazyToggle />
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSectionClick("/#contact");
              }}
              className="btn-primary hidden px-4 py-2 md:inline-flex"
            >
              Contact
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-accent md:hidden"
            >
              {menuOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence onExitComplete={handleMenuExited}>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="glass mt-2 overflow-hidden rounded-xl md:hidden"
            >
              <ul className="flex flex-col gap-1 p-3">
                {links.map((link) => (
                  <li key={link.href}>{renderLink(link, true)}</li>
                ))}
                <li>
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick("/#contact");
                    }}
                    className="btn-primary mt-1 w-full"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}