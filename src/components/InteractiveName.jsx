import { useEffect, useRef } from "react";

const RADIUS = 150; // px — how far the cursor's influence reaches
const PUSH = 46; // px — maximum scatter distance
const TILT = 28; // deg — maximum tilt
const STIFFNESS = 0.09; // spring strength
const DAMPING = 0.8; // per-frame velocity retention (lower = less bounce)

/**
 * InteractiveName
 * Splits the name into letters that scatter, tilt and swell away from the
 * pointer with spring physics, then spring back home. Letters are moved via
 * direct style writes inside one requestAnimationFrame loop (no React
 * re-renders), and the loop stops itself once everything is at rest.
 *
 *  - mouse / touch / pen: pointer events (touch-action: pan-y keeps scrolling)
 *  - keyboard: focus or Enter/Space plays a bouncing wave
 *  - prefers-reduced-motion: no motion at all
 *
 * `parts` = [{ text, className }] — one entry per word; the exact text is kept
 * and exposed to assistive tech through `label`.
 */
export default function InteractiveName({ parts, label }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const letters = Array.from(root.querySelectorAll("[data-letter]"));
    const state = letters.map(() => ({ x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0, kick: 0 }));
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let last = 0;

    const tick = (now) => {
      const dt = Math.min(2, (now - (last || now)) / 16.667) || 1;
      last = now;
      const damp = DAMPING ** dt;

      // read pass (layout) before the write pass
      const rects = pointer.active ? letters.map((el) => el.getBoundingClientRect()) : null;
      let moving = pointer.active;

      letters.forEach((el, i) => {
        const p = state[i];
        let tx = 0;
        let ty = 0;
        let tr = 0;
        let ts = 1;

        if (rects) {
          const b = rects[i];
          // remove our own translation to get the letter's resting centre
          const dx = b.left + b.width / 2 - p.x - pointer.x;
          const dy = b.top + b.height / 2 - p.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < RADIUS) {
            const f = 1 - d / RADIUS;
            tx = (dx / d) * f * PUSH;
            ty = (dy / d) * f * PUSH;
            tr = (dx / d) * f * TILT;
            ts = 1 + f * 0.3;
          }
        }

        if (p.kick && now >= p.kick) {
          p.kick = 0;
          p.vy = -9;
          p.vr = (i % 2 ? 1 : -1) * 5;
          p.vs = 0.04;
        }

        p.vx = (p.vx + (tx - p.x) * STIFFNESS * dt) * damp;
        p.vy = (p.vy + (ty - p.y) * STIFFNESS * dt) * damp;
        p.vr = (p.vr + (tr - p.r) * STIFFNESS * dt) * damp;
        p.vs = (p.vs + (ts - p.s) * STIFFNESS * dt) * damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        p.s += p.vs * dt;

        const restless =
          p.kick ||
          Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.vr) > 0.02 ||
          Math.abs(p.x - tx) + Math.abs(p.y - ty) > 0.05 ||
          Math.abs(p.s - ts) > 0.002;
        if (restless) moving = true;

        el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotate(${p.r.toFixed(2)}deg) scale(${p.s.toFixed(3)})`;
      });

      if (moving) {
        raf = requestAnimationFrame(tick);
      } else {
        // fully at rest: restore the pristine layout and stop the loop
        letters.forEach((el, i) => {
          el.style.transform = "";
          Object.assign(state[i], { x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0 });
        });
        raf = 0;
        last = 0;
      }
    };

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      if (reducedQuery.matches) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      ensureLoop();
    };
    const release = () => {
      pointer.active = false;
      ensureLoop();
    };
    const onPointerUp = (e) => {
      if (e.pointerType !== "mouse") release(); // finger lifted
    };

    const wave = () => {
      if (reducedQuery.matches) return;
      const now = performance.now();
      state.forEach((p, i) => {
        p.kick = now + i * 55;
      });
      ensureLoop();
    };
    const onKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        wave();
      }
    };
    const onFocus = () => {
      if (root.matches(":focus-visible")) wave();
    };

    root.addEventListener("pointerenter", onMove);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerdown", onMove);
    root.addEventListener("pointerleave", release);
    root.addEventListener("pointercancel", release);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("focus", onFocus);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerenter", onMove);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerdown", onMove);
      root.removeEventListener("pointerleave", release);
      root.removeEventListener("pointercancel", release);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("focus", onFocus);
      letters.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);

  return (
    <span
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      className="inline-block select-none rounded-lg"
      style={{ touchAction: "pan-y" }}
    >
      {parts.map((part, pi) => (
        <span key={pi}>
          {pi > 0 && " "}
          <span className={`inline-block whitespace-nowrap ${part.className}`}>
            {Array.from(part.text).map((ch, ci) => (
              <span key={ci} data-letter aria-hidden="true" className="inline-block">
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
