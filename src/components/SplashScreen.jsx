import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * SplashScreen
 * Shows the "VK" mark for ~1.6s on first load, then fades out to
 * reveal the portfolio underneath. Purely presentational — it sits
 * on top of the already-mounted app in a fixed, full-screen overlay.
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-5xl font-semibold tracking-[0.08em] text-text sm:text-6xl"
          >
            VK
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
