import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useCrazyMode } from "../context/CrazyModeContext.jsx";
import { playGhostPass, playGhostScream } from "../utils/sfx.js";
import { resolveGhost } from "../utils/assets.js";
import GhostFace from "./GhostFace.jsx";

const INTERVAL = 30000; // a main attack roughly every 30s...
const JITTER = 5000; // ...±5s so it stays unpredictable
const KINDS = [
  { kind: "rush", weight: 0.4, dur: 3000 }, // dark -> creeps -> sudden full-screen lunge
  { kind: "slow", weight: 0.3, dur: 5200 }, // same, but a long, slow, dreadful approach
  { kind: "sweep", weight: 0.3, dur: 0 }, // fast run across the screen (dur randomised)
];

const rand = (a, b) => a + Math.random() * (b - a);
const ghostState = { busy: false }; // shared so the background runner never stacks on an attack

function pickKind() {
  let r = Math.random();
  for (const k of KINDS) {
    if (r < k.weight) return k;
    r -= k.weight;
  }
  return KINDS[0];
}

function GhostArt({ src, className }) {
  return src ? (
    <img src={src} alt="" referrerPolicy="no-referrer" draggable={false} className={className} />
  ) : (
    <GhostFace className="h-[88vh] w-auto max-w-full" />
  );
}

/** Main full-screen attack: rush / slow / sweep, one at a time, ~every 30s. */
function GhostAttack() {
  const { crazy } = useCrazyMode();
  const reduced = useReducedMotion();
  const [attack, setAttack] = useState(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!crazy) return undefined;
    let cancelled = false;
    resolveGhost("primary").then((u) => !cancelled && setSrc(u));

    const timers = new Set();
    const later = (fn, ms) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    function launch() {
      later(launch, INTERVAL + rand(-JITTER, JITTER)); // next one is scheduled from this start
      if (ghostState.busy || document.hidden) return;
      const k = reduced ? KINDS[0] : pickKind();
      const dur = k.kind === "sweep" ? Math.round(rand(1100, 2000)) : k.dur;
      const total = reduced ? 2200 : dur;
      ghostState.busy = true;
      setAttack({
        id: Date.now(),
        kind: reduced ? "rush" : k.kind,
        dur: total,
        vars: {
          "--ga-dur": `${total}ms`,
          "--dir": Math.random() < 0.5 ? 1 : -1,
          "--y": `${Math.round(rand(-22, 22))}vh`,
          "--s": rand(1.1, 1.7).toFixed(2),
          "--ox": `${Math.round(rand(35, 65))}%`,
          "--oy": `${Math.round(rand(35, 65))}%`,
        },
      });
      if (reduced) {
        later(playGhostScream, 400);
      } else if (k.kind === "sweep") {
        later(playGhostScream, 80);
      } else {
        later(playGhostScream, Math.round(total * 0.35)); // lunge starts at 35% of the timeline
      }
      later(() => {
        setAttack(null);
        ghostState.busy = false;
      }, total + 100);
    }

    later(launch, INTERVAL + rand(-JITTER, JITTER));

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      ghostState.busy = false;
      setAttack(null);
    };
  }, [crazy, reduced]);

  if (!crazy || !attack) return null;

  const sweep = attack.kind === "sweep";
  const fullBleed = Boolean(src) && !sweep;
  const imgClass = sweep ? "h-[85vh] w-auto max-w-none" : "h-full w-full object-cover";

  return (
    <div
      key={attack.id}
      aria-hidden="true"
      style={attack.vars}
      className={`ga-root ga-root--${attack.kind} pointer-events-none fixed inset-0 z-[90] overflow-hidden ${reduced ? "ga-root--reduced" : ""}`}
    >
      <div className="ga-dark absolute inset-0 bg-black" />
      <div className={`ga-ghost absolute inset-0 flex items-center justify-center ${src ? "ga-ghost--media" : ""}`}>
        <div className={`ga-shake flex h-full w-full items-center justify-center ${fullBleed ? "" : "p-2"}`}>
          <GhostArt src={src} className={imgClass} />
        </div>
      </div>
      <div className="ga-blood absolute inset-0" />
      <div className="ga-noise absolute inset-0" />
      <div className="ga-flash absolute inset-0" />
    </div>
  );
}

const measure = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ url, ratio: (img.naturalWidth || 1) / (img.naturalHeight || 1) });
    img.onerror = () => resolve(null);
    img.src = url;
  });

/**
 * Secondary ghosts: now and then one of them (ghost-secondary / ghost-secondary-two) shows up
 * *behind* the content (fixed, negative z-index, pointer-events:none, so links/scrolling are unaffected).
 * Half the time it is a "dash": the figure blurs across the whole screen in a quarter of a second,
 * too fast to tell what it was, with a whoosh. The rest are slower: stop-motion stalk, edge peek, strobe lunge.
 */
function GhostRunner() {
  const { crazy } = useCrazyMode();
  const reduced = useReducedMotion();
  const [hasImg, setHasImg] = useState(false);
  const elRef = useRef(null);
  const imgRef = useRef(null);
  const picksRef = useRef([]); // [{ url, ratio }]
  const on = crazy && !reduced;

  useEffect(() => {
    if (!on) return undefined;
    let cancelled = false;
    let timer = 0;
    let anim = null;
    let timer2 = 0;
    picksRef.current = [];
    Promise.all(["secondary", "secondary2"].map((k) => resolveGhost(k).then((u) => (u ? measure(u) : null)))).then((list) => {
      if (cancelled) return;
      picksRef.current = list.filter(Boolean);
      setHasImg(picksRef.current.length > 0);
    });

    const schedule = () => {
      timer = window.setTimeout(run, rand(8000, 20000));
    };

    function run() {
      const el = elRef.current;
      if (!el || ghostState.busy || document.hidden) {
        schedule();
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const r = Math.random();
      const variant = r < 0.5 ? "dash" : r < 0.7 ? "stalk" : r < 0.85 ? "peek" : "lunge";
      const glow = "drop-shadow(0 0 22px rgba(255,0,0,.45))";
      el.style.transformOrigin = "50% 50%";

      // pick one of the two images at random and size the box from its real aspect ratio
      const picks = picksRef.current;
      const pick = picks.length ? picks[Math.floor(Math.random() * picks.length)] : null;
      const ratio = pick ? pick.ratio : 0.8;
      if (pick && imgRef.current) imgRef.current.src = pick.url;
      const size = (hVh) => {
        el.style.height = `${hVh}vh`;
        const w = ((vh * hVh) / 100) * ratio;
        el.style.width = `${w}px`;
        return w;
      };

      let frames;
      let opts;

      if (variant === "dash") {
        // a blur across the entire screen in ~a quarter of a second
        const h = rand(38, 62);
        const w = size(h);
        el.style.top = `${rand(6, 100 - h)}vh`;
        el.style.filter = `${glow} contrast(1.25) brightness(1.15) blur(${rand(1.5, 3).toFixed(1)}px)`;
        const a = dir > 0 ? -w * 1.2 : vw + w * 0.2;
        const b = dir > 0 ? vw + w * 0.2 : -w * 1.2;
        const t = (x) => `translate(${x}px,0px) scaleX(${dir}) skewX(${-10 * dir}deg)`;
        frames = [
          { transform: t(a), opacity: 0.95, offset: 0 },
          { transform: t(b), opacity: 0.95, offset: 1 },
        ];
        opts = { duration: rand(240, 420), easing: "linear" };
        playGhostPass();
      } else if (variant === "stalk") {
        // stop-motion walk: frozen poses that snap forward, one long stare in the middle
        const h = rand(30, 46); // vh
        const w = size(h);
        el.style.top = `${100 - h + rand(-2, 3)}vh`;
        el.style.filter = `${glow} contrast(1.1) blur(${rand(0, 1.2).toFixed(1)}px)`;
        const a = dir > 0 ? -w : vw;
        const b = dir > 0 ? vw : -w;
        const steps = 16;
        const op = rand(0.45, 0.7);
        frames = [];
        for (let i = 0; i <= steps; i += 1) {
          const f = i / steps;
          frames.push({
            transform: `translate(${a + (b - a) * f}px,${i % 2 ? -8 : 0}px) scaleX(${dir}) rotate(${rand(-3, 3).toFixed(1)}deg)`,
            opacity: i === 0 || i === steps ? 0 : op,
            offset: f,
            easing: "steps(1, end)",
          });
          if (i === 8) {
            // freeze and "look" at the visitor for a beat, then twitch
            frames.push({
              transform: `translate(${a + (b - a) * f}px,0px) scaleX(${dir}) rotate(6deg)`,
              opacity: op,
              offset: f + 0.025,
              easing: "steps(1, end)",
            });
            frames.push({
              transform: `translate(${a + (b - a) * f}px,0px) scaleX(${dir}) rotate(-5deg)`,
              opacity: op * 0.5,
              offset: f + 0.04,
              easing: "steps(1, end)",
            });
          }
        }
        frames = frames.filter((fr) => fr.offset <= 1).sort((x, y) => x.offset - y.offset);
        opts = { duration: rand(6500, 9000), easing: "linear" };
        playGhostPass(); // eerie sound as the ghost starts stalking
      } else if (variant === "peek") {
        // slides half in from the edge, trembles while staring, then slips away
        const h = rand(42, 62);
        const w = size(h);
        el.style.top = `${rand(18, 100 - h)}vh`;
        el.style.filter = `${glow} contrast(1.15)`;
        const out = dir > 0 ? -w : vw;
        const inn = dir > 0 ? -w * 0.42 : vw - w * 0.58;
        const op = rand(0.55, 0.8);
        const t = (x, rot) => `translate(${x}px,0px) scaleX(${dir}) rotate(${rot}deg)`;
        frames = [
          { transform: t(out, 0), opacity: 0, offset: 0, easing: "ease-out" },
          { transform: t(inn, 0), opacity: op, offset: 0.22 },
          { transform: t(inn + 6 * dir, 1.5), opacity: op, offset: 0.3 },
          { transform: t(inn - 5 * dir, -1.5), opacity: op * 0.6, offset: 0.36 },
          { transform: t(inn + 7 * dir, 2), opacity: op, offset: 0.44 },
          { transform: t(inn - 4 * dir, -2), opacity: op, offset: 0.52 },
          { transform: t(inn + 5 * dir, 1), opacity: op * 0.5, offset: 0.62 },
          { transform: t(inn, 0), opacity: op, offset: 0.78 },
          { transform: t(out, 0), opacity: 0, offset: 1, easing: "ease-in" },
        ];
        opts = { duration: rand(4800, 6500), easing: "linear" };
        playGhostPass(); // sound as the ghost slides in from the edge
      } else {
        // appears far away in the dark, strobes closer, then lunges at the screen
        const h = rand(38, 50);
        const w = size(h);
        el.style.top = `${rand(14, 100 - h - 6)}vh`;
        el.style.filter = `${glow} contrast(1.2) blur(1.2px)`;
        const x = vw * rand(0.25, 0.75) - w / 2;
        const t = (sc, rot = 0) => `translate(${x}px,0px) scale(${sc}) rotate(${rot}deg)`;
        frames = [
          { transform: t(0.22), opacity: 0, offset: 0 },
          { transform: t(0.24, -2), opacity: 0.55, offset: 0.1, easing: "steps(1, end)" },
          { transform: t(0.24), opacity: 0, offset: 0.16, easing: "steps(1, end)" },
          { transform: t(0.3, 2), opacity: 0.7, offset: 0.3, easing: "steps(1, end)" },
          { transform: t(0.3), opacity: 0, offset: 0.36, easing: "steps(1, end)" },
          { transform: t(0.42, -3), opacity: 0.75, offset: 0.52, easing: "steps(1, end)" },
          { transform: t(0.42), opacity: 0, offset: 0.57, easing: "steps(1, end)" },
          { transform: t(0.6), opacity: 0.85, offset: 0.7, easing: "ease-in" },
          { transform: t(1.7, 3), opacity: 0.7, offset: 0.86, easing: "ease-in" },
          { transform: t(2.8, -4), opacity: 0, offset: 1 },
        ];
        const lungeDur = rand(3600, 4800);
        opts = { duration: lungeDur, easing: "linear" };
        timer2 = window.setTimeout(playGhostScream, Math.round(lungeDur * 0.68)); // scream right as it lunges
      }

      anim = el.animate(frames, opts);
      anim.onfinish = () => {
        anim = null;
        schedule();
      };
    }

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
      if (anim) {
        anim.onfinish = null;
        anim.cancel();
      }
    };
  }, [on]);

  if (!on) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <div ref={elRef} className="absolute left-0 top-0 opacity-0 will-change-transform">
        {hasImg ? (
          <img
            ref={imgRef}
            src={picksRef.current[0]?.url}
            alt=""
            referrerPolicy="no-referrer"
            draggable={false}
            className="h-full w-full object-contain"
          />
        ) : (
          <GhostFace className="h-full w-auto" />
        )}
      </div>
    </div>
  );
}

export default function GhostOverlay() {
  return (
    <>
      <GhostRunner />
      <GhostAttack />
    </>
  );
}
