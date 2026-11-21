import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { HiOutlineArrowUp, HiOutlineCheck, HiOutlineLockClosed } from "react-icons/hi2";
import { playGhostScream } from "../utils/sfx.js";
import { useCrazyMode } from "../context/CrazyModeContext.jsx";
import { Ghost3D, GhostRoomBackdrop } from "../components/GhostScene.jsx";

/**
 * GhostPage — "type anything, the ghost does (almost) anything".
 * Only reachable in Crazy Mode. The TV shows static until the visitor enters a date of birth (MIN_AGE+),
 * then a 3D ghost (built in code with three.js, no model file) standing in a haunted home reacts to typed commands (several can be chained with
 * "then" / "and" / commas). A few commands also navigate the portfolio.
 */

const RESET = { x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (a) => (Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a);

// body/arm values are framer-motion keyframes; `dur` is seconds; `hold` keeps the pose (ms)
const ACTIONS = [
  { id: "wave", re: /\b(wave|hi|hello|hey|greet|howdy)/, say: ["Hey there! 👋", "Boo-tiful to meet you!"], face: "happy", armR: { rotate: [0, -140, -100, -140, -100, -140, 0] }, dur: 2.2 },
  { id: "dance", re: /\b(danc|boogie|groove|party|twerk)/, say: "Watch these moves!", face: "happy", fx: "♪", body: { x: [0, -34, 34, -34, 34, 0], rotate: [0, -9, 9, -9, 9, 0], y: [0, -14, 0, -14, 0, 0] }, armL: { rotate: [0, 120, 20, 120, 20, 0] }, armR: { rotate: [0, -20, -120, -20, -120, 0] }, dur: 3 },
  { id: "jump", re: /\b(jump|hop|bounce|leap)/, say: "Boing!", face: "happy", body: { y: [0, -100, 0, -65, 0, -30, 0], scaleY: [1, 1.06, 0.88, 1.04, 0.94, 1, 1] }, armL: { rotate: [0, 60, 0, 40, 0] }, armR: { rotate: [0, -60, 0, -40, 0] }, dur: 1.5 },
  { id: "spin", re: /\b(spin|twirl|rotate|turn|whirl)/, say: "Wheeeee!", face: "happy", body: { rotate: [0, 360, 720], scale: [1, 0.9, 1] }, armL: { rotate: [0, 90, 90] }, armR: { rotate: [0, -90, -90] }, dur: 1.8 },
  { id: "flip", re: /\b(flip|somersault|backflip|tumble)/, say: "Ta-da!", face: "happy", body: { y: [0, -120, 0], rotate: [0, -360, -360] }, dur: 1.1 },
  { id: "scare", re: /\b(scare|boo|scream|frighten|spook|attack|jumpscare)/, say: "BOOOO!!!", face: "scream", flash: true, sound: true, body: { scale: [1, 1.75, 1.55, 1.7, 1], x: [0, -10, 10, -8, 0] }, armL: { rotate: [0, 100, 100, 100, 0] }, armR: { rotate: [0, -100, -100, -100, 0] }, dur: 1.8 },
  { id: "sleep", re: /\b(sleep|nap|rest|snooze|tired|bed)/, say: "Zzz… five more minutes…", face: "sleep", fx: "Z", body: { rotate: [0, -82], y: [0, 70] }, dur: 1.4, hold: 2600 },
  { id: "faint", re: /\b(faint|die|dead|collapse|pass out)/, say: "I'm already dead… 💀", face: "sleep", body: { rotate: [0, 90], y: [0, 70] }, dur: 0.8, hold: 2200 },
  { id: "hide", re: /\b(hide|vanish|disappear|invisible|teleport)/, say: "…you can't see me.", body: { opacity: [1, 0, 0, 0, 1] }, dur: 2.6 },
  { id: "fly", re: /\b(fly|float|levitate|hover|soar)/, say: "I believe I can fly!", face: "happy", body: { y: [0, -130, -105, -130, -105, 0] }, armL: { rotate: [0, 55, 40, 55, 40, 0] }, armR: { rotate: [0, -55, -40, -55, -40, 0] }, dur: 3.2 },
  { id: "cry", re: /\b(cry|sad|weep|sob|tear)/, say: "Nobody ever scares back… 😢", face: "sad", fx: "💧", body: { y: [0, 8, 0, 8, 0], scaleY: [1, 0.95, 1, 0.95, 1] }, dur: 2.6 },
  { id: "laugh", re: /\b(laugh|haha|lol|giggle|joke|funny)/, say: "Mwahahaha!", face: "happy", body: { y: [0, -10, 0, -10, 0, -10, 0], rotate: [0, -4, 4, -4, 4, -4, 0] }, dur: 1.8 },
  { id: "clap", re: /\b(clap|applau|cheer)/, say: "Bravo! 👏", face: "happy", armL: { rotate: [0, -38, 0, -38, 0, -38, 0] }, armR: { rotate: [0, 38, 0, 38, 0, 38, 0] }, dur: 1.8 },
  { id: "bow", re: /\b(bow|thank|curtsy|salute)/, say: "At your service.", face: "happy", body: { rotate: [0, 28, 28, 0], y: [0, 14, 14, 0] }, dur: 2 },
  { id: "love", re: /\b(love|kiss|heart|hug|like you)/, say: "Aww… you're making me blush 💕", face: "love", fx: "❤", body: { scale: [1, 1.1, 1, 1.1, 1] }, armL: { rotate: [0, 70, 70, 0] }, armR: { rotate: [0, -70, -70, 0] }, dur: 2.2 },
  { id: "angry", re: /\b(angry|mad|rage|furious|growl|grr)/, say: "GRRRR!", face: "angry", body: { x: [0, -8, 8, -8, 8, 0], scale: [1, 1.15, 1.15, 1.15, 1.15, 1] }, dur: 1.8 },
  { id: "sing", re: /\b(sing|song|hum|music)/, say: "🎵 oooOOOoooh… 🎵", face: "happy", fx: "♪", body: { rotate: [0, -6, 6, -6, 6, 0] }, dur: 3 },
  { id: "run", re: /\b(run|dash|sprint|chase|escape)/, say: "Can't catch me!", face: "happy", body: { x: [0, -230, -230, 230, 230, 0], scaleX: [1, 1, -1, -1, 1, 1] }, dur: 2.6 },
  { id: "think", re: /\b(think|ponder|wonder|hmm)/, say: "Hmm… 🤔", body: { rotate: [0, -8, -8, 0] }, armR: { rotate: [0, -150, -150, 0] }, dur: 2.2 },
  { id: "shrug", re: /\b(shrug|dunno|idk|confus)/, say: "¯\\_(ツ)_/¯", body: { y: [0, -6, 0] }, armL: { rotate: [0, 55, 0] }, armR: { rotate: [0, -55, 0] }, dur: 1.4 },
  // portfolio shortcuts
  { id: "projects", re: /\bprojects?\b/, say: "Opening the projects…", face: "happy", nav: "/projects" },
  { id: "blog", re: /\b(blog|posts?|articles?)\b/, say: "Fetching the blog…", face: "happy", nav: "/blog" },
  { id: "contact", re: /\b(contact|hire|email|reach)/, say: "Let's get you in touch…", face: "happy", nav: "/#contact" },
  { id: "skills", re: /\b(skills?|stack|tech)\b/, say: "Here's the tech stack…", face: "happy", nav: "/#skills" },
  { id: "certs", re: /\b(certificates?|certs?)\b/, say: "Behold, the certificates…", face: "happy", nav: "/#certificates" },
  { id: "home", re: /\b(home|top|start)\b/, say: "Back to the beginning…", face: "happy", nav: "/" },
];

// The ghost's own voice for the commands that suit him (everything else uses the default line)
const SAY = {
  wave: ["…hello. 👋", "You will not escape my wrath… but hi."],
  dance: "Even the dead need to dance!",
  scare: "You will not escape my wrath!!!",
  sleep: "Even a spirit needs rest… Zzz",
  faint: "Already dead… 💀",
  hide: "…I'm right behind you.",
  cry: "Nobody ever stays in the house… 😢",
  laugh: "Heh heh heh… 😈",
  angry: "NOW you've made me angry!",
  love: "Careful… I get a little obsessed 💕",
  run: "Run? I thought that was YOUR job!",
  bow: "Always a pleasure, mortal.",
};

const INTRO = "This is my house now… type a command. 👻";

const UNKNOWN = [
  "Hmm… I don't know that one. Try something else!",
  "I'm a ghost, not a genie. Try 'dance' or 'scare me'.",
  "That's beyond even my powers…",
  "Whoooo? I didn't catch that.",
];

const MIN_AGE = 13;
const MAX_CHARS = 50;
const AGE_KEY = "ghostAgeOk"; // session flag only; the date of birth itself is never stored
// faded command hints shown beside the locked TV
const PREVIEW = ["wave hello", "dance", "jump", "spin around", "scare me", "take a nap", "fly away", "run away"];

const CHIPS = ["wave", "dance", "jump", "spin", "scare me", "sleep", "vanish", "fly", "cry", "laugh", "bow", "run", "love", "show projects"];

// arm-only actions (wave, clap, think…) become a body sway, since the 3D model has no controllable arms
const SWAY = { rotate: [0, -6, 6, -4, 0], y: [0, -10, 0, -6, 0] };

function readAgeFlag() {
  try {
    return sessionStorage.getItem(AGE_KEY) === "1";
  } catch {
    return false;
  }
}

function checkDob(m, d, y) {
  if (!m || !d || y.length !== 4) return "Enter your full date of birth.";
  const mm = Number(m);
  const dd = Number(d);
  const yy = Number(y);
  const dt = new Date(yy, mm - 1, dd);
  if (dt.getFullYear() !== yy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return "That date doesn't exist.";
  const now = new Date();
  if (dt > now || yy < 1900) return "Enter a valid date of birth.";
  let age = now.getFullYear() - yy;
  if (now < new Date(now.getFullYear(), mm - 1, dd)) age -= 1;
  return age >= MIN_AGE ? "" : `You must be at least ${MIN_AGE} to enter.`;
}

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.5 -.5'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const STYLES = `
.gp-noise{background-image:${NOISE};background-size:220px 220px;opacity:.55;animation:gp-noise .5s steps(1) infinite}
@keyframes gp-noise{0%{background-position:0 0}20%{background-position:-60px 40px}40%{background-position:35px -70px}60%{background-position:-20px -30px}80%{background-position:70px 55px}100%{background-position:0 0}}
.gp-lines{position:absolute;left:0;right:0;top:-100%;height:200%;background:repeating-linear-gradient(180deg,rgba(255,255,255,.17) 0 2px,transparent 2px 9px);animation:gp-scroll 2.2s linear infinite}
.gp-lines--slow{background:repeating-linear-gradient(180deg,rgba(255,255,255,.1) 0 6px,transparent 6px 41px);animation-duration:5.5s}
@keyframes gp-scroll{from{transform:translateY(0)}to{transform:translateY(50%)}}
.gp-band{position:absolute;left:0;right:0;height:22%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.2) 45%,rgba(255,255,255,.07) 70%,transparent);animation:gp-band 4.6s linear infinite}
@keyframes gp-band{from{top:-26%}to{top:110%}}
.gp-ransom{display:inline-flex;align-items:center;justify-content:center;min-width:.7em;padding:0 .12em;background:#f3f3f1;color:#0b0b0b;font-family:Impact,"Arial Black",sans-serif;line-height:1.05;text-transform:uppercase;box-shadow:0 2px 0 rgba(0,0,0,.6)}
.gp-ransom--dark{background:#141414;color:#f3f3f1;outline:1px solid rgba(255,255,255,.35)}
.gp-red{font-family:Impact,"Arial Black",sans-serif;text-transform:uppercase;letter-spacing:-.01em;line-height:.95;color:#e3202c;-webkit-text-stroke:2px #6d0007;text-shadow:0 3px 0 #5a0006,0 6px 0 #2a0003,0 12px 20px rgba(0,0,0,.75);display:inline-block;transform:skewX(-5deg) scaleY(1.12)}
.gp-glitch{animation:gp-glitch 3.4s infinite}
@keyframes gp-glitch{0%,90%,100%{transform:translate(0);filter:none}91%{transform:translate(-5px,1px) skewX(-8deg);filter:drop-shadow(4px 0 #00e5ff) drop-shadow(-4px 0 #ff1744)}93%{transform:translate(6px,-2px);filter:drop-shadow(-4px 0 #00e5ff) drop-shadow(4px 0 #ff1744)}95%{transform:translate(-2px,2px) skewX(5deg)}97%{transform:translate(3px,0);filter:none}}
.gp-flicker{animation:gp-flicker 5s infinite}
@keyframes gp-flicker{0%,100%{opacity:1}46%{opacity:1}47%{opacity:.35}48%{opacity:1}72%{opacity:1}73%{opacity:.5}74%{opacity:1}}
.gp-shake{animation:gp-shake .4s}
@keyframes gp-shake{20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(4px)}}
.gp-wheel{background:conic-gradient(#e53935 0 16.6%,#fb8c00 0 33.3%,#fdd835 0 50%,#43a047 0 66.6%,#1e88e5 0 83.3%,#8e24aa 0)}
@media (prefers-reduced-motion:reduce){.gp-noise,.gp-lines,.gp-band,.gp-glitch,.gp-flicker{animation:none}}
`;

const ROT = [-4, 3, -2, 5, -5, 2, -3, 4];

function RansomWord({ text, size }) {
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-[3px]" style={{ fontSize: size }}>
      {[...text].map((ch, i) =>
        ch === " " ? (
          <span key={i} className="w-[.5em]" />
        ) : (
          <motion.span
            key={i}
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 320, damping: 18 }}
            style={{ rotate: ROT[i % ROT.length] }}
            className={`gp-ransom ${i % 3 === 1 ? "gp-ransom--dark" : ""}`}
          >
            {ch}
          </motion.span>
        )
      )}
    </span>
  );
}

/** Own title lettering: cut-out white letters over a big red word. */
function TitleLogo({ compact = false }) {
  return (
    <div className="gp-glitch flex flex-col items-center gap-1 text-center" aria-label="Command the ghost" role="img">
      <RansomWord text="COMMAND THE" size={compact ? "clamp(16px,1.9vw,26px)" : "clamp(18px,3vw,38px)"} />
      <span className="gp-red" style={{ fontSize: compact ? "clamp(54px,6.5vw,92px)" : "clamp(64px,11vw,150px)" }}>
        Ghost
      </span>
    </div>
  );
}

/** Locked screen: grey TV static, scrolling lines and the glitching title. */
function StaticScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#222224]">
      <div className="gp-noise absolute inset-0" />
      <div className="gp-lines" />
      <div className="gp-lines gp-lines--slow" />
      <div className="gp-band" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <TitleLogo />
        <p className="gp-flicker mt-5 font-mono text-[11px] tracking-[0.3em] text-white/70 sm:text-xs">
          SIGNAL LOCKED · VERIFY AGE TO TUNE IN<span className="animate-pulse">▌</span>
        </p>
      </div>
    </div>
  );
}

/** Dark retro TV: rounded bezel, glass screen, scanlines, red LED + VHS slot. */
function Tv({ children }) {
  return (
    <div className="relative rounded-[2.4rem] border border-white/[0.06] bg-gradient-to-b from-[#1d1212] to-[#0c0707] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95),inset_0_2px_0_rgba(255,255,255,0.06)] sm:p-4">
      <div className="relative aspect-[4/3] min-h-[400px] w-full overflow-hidden rounded-[1.6rem] bg-[#07030a] shadow-[0_0_0_2px_#000,inset_0_0_40px_rgba(0,0,0,0.8)]">
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-40 mix-blend-multiply"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 58%, rgba(0,0,0,0.6) 100%), linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 26%)" }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-2 sm:px-4" aria-hidden="true">
        <span className="h-5 w-8 sm:w-12" style={{ backgroundImage: "repeating-linear-gradient(90deg, #3a2a2a 0 2px, transparent 2px 6px)" }} />
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(255,40,40,0.8)]" />
          <span className="flex h-6 w-32 items-center justify-center gap-2 rounded-md bg-[#050303] font-mono text-[8px] tracking-[0.2em] text-white/35 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] sm:w-44">
            <span className="rounded-sm bg-white/10 px-1">VHS</span>HI-FI
          </span>
        </div>
        <span className="h-5 w-8 sm:w-12" style={{ backgroundImage: "repeating-linear-gradient(90deg, #3a2a2a 0 2px, transparent 2px 6px)" }} />
      </div>
    </div>
  );
}

function GhostStage() {
  const navigate = useNavigate();
  const body = useAnimationControls();
  const [verified, setVerified] = useState(readAgeFlag);
  const [dob, setDob] = useState({ m: "", d: "", y: "" });
  const [dobErr, setDobErr] = useState("");
  const [shake, setShake] = useState(0);
  const dobRefs = [useRef(null), useRef(null), useRef(null)];
  const [face, setFace] = useState("normal");
  const [say, setSay] = useState(INTRO);
  const [fx, setFx] = useState(null);
  const [flash, setFlash] = useState(0);
  const [text, setText] = useState("");
  const runId = useRef(0);

  useEffect(
    () => () => {
      runId.current += 1; // cancels any in-flight sequence on leaving the page
      body.stop();
    },
    [body]
  );

  const resetPose = () => body.set(RESET);

  async function perform(action, id) {
    setFace(action.face || "normal");
    setSay(pick(SAY[action.id] || action.say));
    if (action.fx) setFx({ id: Date.now() + Math.random(), glyph: action.fx });
    if (action.flash) setFlash((n) => n + 1);
    if (action.sound) playGhostScream();
    if (action.nav) {
      await sleep(1100);
      if (id === runId.current) navigate(action.nav);
      return;
    }
    const pose = action.body || (action.armL || action.armR ? SWAY : {});
    await body.start({ ...pose, transition: { duration: action.dur ?? 1, ease: "easeInOut" } });
    if (id !== runId.current) return;
    if (action.hold) {
      await sleep(action.hold);
      if (id !== runId.current) return;
    }
    await body.start({ ...RESET, transition: { duration: 0.35 } });
  }

  async function command(raw) {
    const input = raw.trim().toLowerCase();
    if (!input) return;
    const id = ++runId.current;
    body.stop();
    resetPose();
    setFx(null);

    if (/^(help|\?|commands)$/.test(input)) {
      setFace("happy");
      setSay("Try: dance, spin, jump, scare me, sleep, vanish, fly, cry… or 'show projects'. Chain them: 'wave then spin'.");
      return;
    }

    const steps = input
      .split(/\bthen\b|\band\b|,|\+|&/)
      .map((p) => ACTIONS.find((a) => a.re.test(p)))
      .filter(Boolean)
      .slice(0, 4);

    if (!steps.length) {
      setFace("normal");
      setSay(pick(UNKNOWN));
      await body.start({ rotate: [0, -10, 10, -6, 0], transition: { duration: 1.2 } });
      return;
    }

    for (const step of steps) {
      if (id !== runId.current) return;
      await perform(step, id);
    }
    if (id === runId.current) {
      setFace("normal");
      setFx(null);
    }
  }

  const submit = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    command(text);
    setText("");
  };

  /* ---- date of birth gate ---- */
  const setPart = (key, idx, len) => (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, len);
    setDob((p) => ({ ...p, [key]: v }));
    setDobErr("");
    if (v.length === len && idx < 2) dobRefs[idx + 1].current?.focus();
  };

  const dobKey = (key, idx) => (e) => {
    if (e.key === "Backspace" && !dob[key] && idx > 0) dobRefs[idx - 1].current?.focus();
    if (e.key === "Enter") verify();
  };

  function verify(e) {
    e?.preventDefault();
    const err = checkDob(dob.m, dob.d, dob.y);
    if (err) {
      setDobErr(err);
      setShake((n) => n + 1);
      return;
    }
    try {
      sessionStorage.setItem(AGE_KEY, "1");
    } catch {
      /* storage blocked: the gate simply asks again next time */
    }
    setDob({ m: "", d: "", y: "" });
    setVerified(true);
  }

  const dobInput = "h-14 min-w-0 rounded-xl border border-white/10 bg-[#0d0d10] text-center font-mono text-lg text-white outline-none placeholder:text-white/45 focus:border-sky-400 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.45)]";

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-10 pt-28 sm:px-8">
      <style>{STYLES}</style>

      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
        {/* ---------- TV ---------- */}
        <div className="flex items-center">
          <div className="w-full">
            <Tv>
              {verified && (
                <>
                  <GhostRoomBackdrop />
                  <motion.div
                    key={flash}
                    aria-hidden="true"
                    initial={{ opacity: flash ? 0.85 : 0 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.9 }}
                    className="pointer-events-none absolute inset-0 z-10 bg-red-600"
                  />
                  <div className="absolute inset-x-0 top-4 z-10 flex justify-center px-4" aria-live="polite">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={say}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-md rounded-2xl bg-white/95 px-4 py-2.5 text-center font-mono text-xs text-black shadow-lg sm:text-sm"
                      >
                        {say}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
                    <div className="relative origin-bottom scale-[.78] sm:scale-[.88] xl:scale-100">
                      <motion.div animate={body} style={{ transformOrigin: "50% 100%" }}>
                        <Ghost3D face={face} />
                        <AnimatePresence>
                          {fx &&
                            [0, 1, 2, 3, 4].map((i) => (
                              <motion.span
                                key={`${fx.id}-${i}`}
                                aria-hidden="true"
                                initial={{ opacity: 0, y: 0, x: 0 }}
                                animate={{ opacity: [0, 1, 0], y: -150 - i * 18, x: (i - 2) * 34 }}
                                transition={{ duration: 2.2, delay: i * 0.35 }}
                                className="pointer-events-none absolute left-1/2 top-10 text-2xl text-white"
                              >
                                {fx.glyph}
                              </motion.span>
                            ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <div className="-mt-5 h-4 w-48 rounded-full bg-black/70 blur-md" />
                  </div>
                </>
              )}

              {/* static screen until the age is verified */}
              <AnimatePresence>
                {!verified && (
                  <motion.div
                    key="static"
                    className="absolute inset-0 z-[5]"
                    exit={{ opacity: [1, 1, 0], filter: ["brightness(1)", "brightness(3)", "brightness(1)"] }}
                    transition={{ duration: 0.7 }}
                  >
                    <StaticScreen />
                  </motion.div>
                )}
              </AnimatePresence>
            </Tv>
          </div>
        </div>

        {/* ---------- right column ---------- */}
        <div className="flex min-h-[420px] flex-col justify-between gap-8 lg:min-h-0">
          {verified ? (
            <div className="flex flex-1 items-center justify-center py-4">
              <TitleLogo compact />
            </div>
          ) : (
            <ul className="flex-1 space-y-3 overflow-hidden font-mono text-lg text-white sm:text-xl" aria-hidden="true">
              {PREVIEW.map((c, i) => (
                <li key={c} className="flex items-center gap-3" style={{ opacity: 0.18 + (i / (PREVIEW.length - 1)) * 0.72 }}>
                  <span className="text-white/80">›</span>
                  <span>{c}</span>
                  <span className="h-8 w-8 rounded-lg bg-white/[0.07]" />
                </li>
              ))}
            </ul>
          )}

          {verified ? (
            <form
              onSubmit={submit}
              className="relative rounded-[1.8rem] border border-white/10 bg-[#120c0d] p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.replace(/\n/g, " "))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) submit(e);
                }}
                rows={2}
                maxLength={MAX_CHARS}
                placeholder="Tell the ghost what to do…"
                aria-label="Command for the ghost"
                className="w-full resize-none bg-transparent font-mono text-base text-white outline-none placeholder:text-white/55"
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => command(pick(CHIPS))}
                  aria-label="Surprise me with a random command"
                  title="Surprise me"
                  className="gp-wheel h-12 w-12 rounded-full border-2 border-white/20 shadow-lg transition hover:rotate-90 active:scale-95"
                >
                  <span className="mx-auto block h-4 w-4 rounded-full bg-white/90 shadow" />
                </button>
                <span className="font-mono text-xs text-white/50">
                  {text.length} / {MAX_CHARS}
                </span>
                <button
                  type="submit"
                  aria-label="Send command"
                  disabled={!text.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#f0434a] to-[#c8101c] text-2xl text-white shadow-[0_6px_18px_rgba(230,30,40,0.45)] transition hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  <HiOutlineArrowUp />
                </button>
              </div>
            </form>
          ) : (
            <div>
              <motion.form
                key={shake}
                onSubmit={verify}
                className={`relative z-10 rounded-[1.8rem] border border-[#9a0f1b] bg-gradient-to-b from-[#6a0008] to-[#4a0006] p-6 shadow-[0_20px_50px_-15px_rgba(120,0,10,0.7)] ${shake ? "gp-shake" : ""}`}
                noValidate
              >
                <h2 className="text-2xl font-bold text-white">Enter your date of birth</h2>
                <div className="mt-5 grid grid-cols-[1fr_1fr_1.35fr_auto] items-center gap-2.5">
                  <input
                    ref={dobRefs[0]}
                    value={dob.m}
                    onChange={setPart("m", 0, 2)}
                    onKeyDown={dobKey("m", 0)}
                    inputMode="numeric"
                    autoComplete="bday-month"
                    autoFocus
                    placeholder="MM"
                    aria-label="Birth month"
                    className={dobInput}
                  />
                  <input
                    ref={dobRefs[1]}
                    value={dob.d}
                    onChange={setPart("d", 1, 2)}
                    onKeyDown={dobKey("d", 1)}
                    inputMode="numeric"
                    autoComplete="bday-day"
                    placeholder="DD"
                    aria-label="Birth day"
                    className={dobInput}
                  />
                  <input
                    ref={dobRefs[2]}
                    value={dob.y}
                    onChange={setPart("y", 2, 4)}
                    onKeyDown={dobKey("y", 2)}
                    inputMode="numeric"
                    autoComplete="bday-year"
                    placeholder="YYYY"
                    aria-label="Birth year"
                    className={dobInput}
                  />
                  <button
                    type="submit"
                    aria-label="Verify age"
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-[#f0434a] to-[#d4202b] text-2xl text-white shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition hover:brightness-110 active:scale-95"
                  >
                    <HiOutlineCheck />
                  </button>
                </div>
                <p className="mt-3 min-h-5 font-mono text-xs text-red-200" role="alert">
                  {dobErr}
                </p>
              </motion.form>

              <div className="relative -mt-6 flex min-h-[8.5rem] items-start justify-between rounded-[1.8rem] border border-white/10 bg-[#130e0f] px-6 pb-5 pt-12">
                <p className="font-mono text-base text-white/55">verify your age to unlock…</p>
                <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white/60" aria-hidden="true">
                  <HiOutlineLockClosed />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] text-white/45">
        {verified ? "Try “help”, or chain moves: “jump and spin then bow”." : "Verify your age to unlock the ghost."}
      </p>
    </section>
  );
}

/** The ghost only exists in Crazy Mode: outside it the route bounces back home. */
export default function GhostPage() {
  const { crazy } = useCrazyMode();
  if (!crazy) return <Navigate to="/" replace />;
  return <GhostStage />;
}
