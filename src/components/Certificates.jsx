import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { HiOutlineX } from "react-icons/hi";
import Section from "./Section.jsx";
import { certificates } from "../data/portfolioData";
import { speakCertificateLine } from "../utils/sfx.js";

export default function Certificates() {
  const [selected, setSelected] = useState(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  const close = () => {
    setSelected(null);
    openerRef.current?.focus(); // return focus to the card that opened the dialog
  };

  useEffect(() => {
    if (!selected) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <Section id="certificates" title="Certificates" description="Courses and programmes I've completed.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <li key={cert.title}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setSelected(cert);
                speakCertificateLine();
              }}
              className="card card-hover flex h-full w-full flex-col p-6 text-left"
            >
              <HiOutlineAcademicCap className="text-2xl text-accent" aria-hidden="true" />
              <span className="mt-4 font-display text-base font-semibold text-text">{cert.title}</span>
              <span className="mt-1 text-sm text-muted">{cert.issuer}</span>
              <span className="mt-4 flex w-full items-center justify-between font-mono text-xs text-accent-2">
                {cert.date}
                <span className="text-muted">Verify</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-dialog-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="card relative w-full max-w-md p-8 text-center"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="absolute right-3 top-3 rounded-full p-2 text-muted transition-colors hover:text-text"
                aria-label="Close"
              >
                <HiOutlineX className="text-xl" />
              </button>

              <HiOutlineAcademicCap className="mx-auto text-4xl text-accent" aria-hidden="true" />
              <h3 id="cert-dialog-title" className="mt-4 font-display text-xl font-semibold text-text">
                Sounds fake?
              </h3>
              <p className="mt-2 text-sm text-muted">Unfortunately, it’s real.</p>
              <p className="mt-1 text-sm text-muted">{selected.title}</p>

              <a href={selected.image} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
                Open certificate
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
