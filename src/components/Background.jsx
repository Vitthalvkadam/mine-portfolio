import { useState } from "react";
import { useCrazyMode } from "../context/CrazyModeContext.jsx";

/**
 * Background
 * Plain, flat background layer shared by the whole page (var(--color-bg)).
 * In Crazy Mode one fixed red-horror layer (lighting, fog, embers) sits on top of
 * it, so the same backdrop shows behind every section, route and the footer.
 */
export default function Background() {
  const { crazy } = useCrazyMode();
  const [embers] = useState(() =>
    Array.from({ length: 16 }, () => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dur: 7 + Math.random() * 7,
      delay: Math.random() * 8,
    }))
  );

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-bg" />
      {crazy && (
        <div className="crazy-bg" aria-hidden="true">
          {embers.map((e, i) => (
            <span
              key={i}
              className="crazy-ember"
              style={{ left: `${e.left}%`, width: e.size, height: e.size, animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s` }}
            />
          ))}
        </div>
      )}
    </>
  );
}
