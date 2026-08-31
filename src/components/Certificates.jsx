
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { HiOutlineX } from "react-icons/hi";
import { certificates } from "../data/portfolioData";

export default function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <section
      id="certificates"
      className="container-px mx-auto max-w-7xl py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="eyebrow">Certificates</span>

        <h2 className="section-heading mt-3">
          Proof of <span className="gradient-text">practice</span>
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.015 }}
            onClick={() => setSelectedCertificate(cert)}
            className="glass relative cursor-pointer overflow-hidden rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.15)]"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />

            <HiOutlineAcademicCap className="text-3xl text-accent" />

            <h3 className="mt-4 font-display text-base font-semibold text-text">
              {cert.title}
            </h3>

            <p className="mt-1 text-sm text-muted">
              {cert.issuer}
            </p>

            <span className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-accent-2">
              {cert.date}
            </span>

            <p className="mt-5 text-xs text-muted opacity-70">
              Click to verify →
            </p>
          </motion.div>
        ))}
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-md rounded-2xl p-8 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-text"
                aria-label="Close"
              >
                <HiOutlineX className="text-xl" />
              </button>

              <HiOutlineAcademicCap className="mx-auto text-5xl text-accent" />

              <h3 className="mt-5 font-display text-xl font-semibold text-text">
                Don’t take my word for it?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Fair enough. Here’s the actual proof.
              </p>

              <button
                onClick={() => {
                  window.open(
                    selectedCertificate.image,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="mt-7 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                Certificate
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

