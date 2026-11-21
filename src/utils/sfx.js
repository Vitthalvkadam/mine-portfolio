/**
 * sfx — sound layer for the portfolio.
 *
 * Real recordings (src/assets/audio, see utils/assets.js) are played through
 * HTMLAudio when present. Short synthesised effects (Web Audio) remain only as
 * non-speech fallbacks / ambience. No text-to-speech is used.
 *
 * Autoplay rules: the AudioContext is only created from a real user gesture
 * (see `armOnFirstGesture` / the gesture-driven play functions). Timer-driven
 * sounds (the ghost) never create or force-resume a context, so they stay
 * silent until the visitor has interacted with the page at least once.
 */

import { audioAssets } from "./assets.js";

let ctx = null;
let master = null;
let noiseBuffer = null;
let muted = false;
const live = new Set(); // every started source, so stopAll() can kill them

/* ------------------------------------------------------------------ */
/* context / lifecycle                                                */
/* ------------------------------------------------------------------ */

function unlock() {
  const AC =
    typeof window !== "undefined" ? window.AudioContext || window.webkitAudioContext : null;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    const limiter = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = 0.7; // keep everything comfortably quiet
    master.connect(limiter);
    limiter.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** Run `fn` once the context is actually running. Drops stale (late) requests. */
function run(fn) {
  if (muted || !ctx) return;
  const c = ctx;
  if (c.state === "running") {
    fn(c);
    return;
  }
  const asked = Date.now();
  c.resume()
    .then(() => {
      if (!muted && c.state === "running" && Date.now() - asked < 600) fn(c);
    })
    .catch(() => {});
}

/** Create the audio context on the visitor's first interaction. */
export function armOnFirstGesture() {
  if (typeof window === "undefined") return () => {};
  const events = ["pointerup", "keydown", "touchend", "click"];
  const off = () => events.forEach((e) => window.removeEventListener(e, handler, true));
  function handler() {
    unlock();
    off();
  }
  events.forEach((e) => window.addEventListener(e, handler, { capture: true, passive: true }));
  return off;
}

/* ---- real recordings (HTMLAudio) ---- */
const assetEls = {};
const VOLUME = { splash: 0.6, scream: 0.85, certificate: 0.9, runner: 0.8 };

export const hasAsset = (name) => Boolean(audioAssets[name]);

function assetEl(name) {
  if (!audioAssets[name] || typeof Audio === "undefined") return null;
  if (!assetEls[name]) {
    const a = new Audio(audioAssets[name]);
    a.preload = "auto";
    a.volume = VOLUME[name] ?? 0.7;
    assetEls[name] = a;
  }
  return assetEls[name];
}

function stopAssets() {
  Object.values(assetEls).forEach((a) => {
    a.pause();
    try {
      a.currentTime = 0;
    } catch {
      /* not seekable yet */
    }
  });
}

/** Warm the cache for a recording (call from a user gesture where possible). */
export function preloadAsset(name) {
  assetEl(name)?.load();
}

/**
 * Play a real recording once (restarts, never stacks). Resolves true if it
 * started, false if missing / muted / blocked by autoplay policy.
 */
export function playAsset(name) {
  const a = muted ? null : assetEl(name);
  if (!a) return Promise.resolve(false);
  a.pause();
  try {
    a.currentTime = 0;
  } catch {
    /* ignore */
  }
  return a.play().then(
    () => true,
    () => false
  );
}

/** Immediately silence every sound that is playing or scheduled. */
export function stopAll() {
  live.forEach((node) => {
    try {
      node.stop();
    } catch {
      /* already stopped */
    }
    try {
      node.disconnect();
    } catch {
      /* already disconnected */
    }
  });
  live.clear();
  stopAssets();
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  if (value) stopAll();
}

/* ------------------------------------------------------------------ */
/* synth building blocks                                              */
/* ------------------------------------------------------------------ */

function begin(src, at, end) {
  src.start(at);
  src.stop(end);
  live.add(src);
  src.onended = () => {
    live.delete(src);
    try {
      src.disconnect();
    } catch {
      /* ignore */
    }
  };
}

function tone(c, { type = "sine", f0, f1, path, t = 0, dur, peak, attack = 0.03, lp, vib }) {
  const at = c.currentTime + t;
  const osc = c.createOscillator();
  osc.type = type;
  if (path) {
    osc.frequency.setValueAtTime(path[0][1], at);
    path.slice(1).forEach(([time, f]) => osc.frequency.linearRampToValueAtTime(f, at + time));
  } else {
    osc.frequency.setValueAtTime(f0, at);
    if (f1) osc.frequency.exponentialRampToValueAtTime(f1, at + dur);
  }

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  if (lp) {
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lp;
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }
  gain.connect(master);

  if (vib) {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = vib.rate;
    lfoGain.gain.value = vib.depth;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    begin(lfo, at, at + dur + 0.05);
  }
  begin(osc, at, at + dur + 0.05);
}

function whoosh(c, { t = 0, dur, peak, f0, f1, q = 0.8, attack = 0.25 }) {
  const at = c.currentTime + t;
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;

  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = q;
  band.frequency.setValueAtTime(f0, at);
  band.frequency.exponentialRampToValueAtTime(f1, at + dur);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  src.connect(band);
  band.connect(gain);
  gain.connect(master);
  begin(src, at, at + dur + 0.05);
}

/* ------------------------------------------------------------------ */
/* public sounds                                                      */
/* ------------------------------------------------------------------ */

/** Short, subtle horror sting for switching to dark mode (user-initiated). */
export function playDarkStinger() {
  unlock();
  run((c) => {
    tone(c, { f0: 72, f1: 38, dur: 1.7, peak: 0.16, attack: 0.18 });
    tone(c, { type: "triangle", f0: 150, f1: 85, dur: 1.5, peak: 0.05, attack: 0.2, lp: 420 });
    tone(c, { type: "sine", f0: 1320, f1: 990, t: 0.25, dur: 0.9, peak: 0.012, attack: 0.3 });
    whoosh(c, { dur: 1.5, peak: 0.05, f0: 520, f1: 110 });
  });
}

/** Music-box style minor chime when Crazy Mode is switched on (user-initiated). */
export function playCrazyOn() {
  unlock();
  run((c) => {
    [659, 622, 523, 311].forEach((f, i) => {
      tone(c, { f0: f, t: i * 0.17, dur: 0.9, peak: 0.07, attack: 0.01 });
      tone(c, { f0: f * 2.76, t: i * 0.17, dur: 0.5, peak: 0.012, attack: 0.01 });
    });
    whoosh(c, { t: 0.1, dur: 1, peak: 0.025, f0: 900, f1: 200 });
  });
}

/** Sudden scare: only the real recording (src/assets/audio/scream.mp3). No synthesised fallback. */
export function playGhostScream() {
  if (muted) return;
  playAsset("scream");
}

/** Fast background pass: only the real recording (src/assets/audio/runner.mp3). */
export function playGhostPass() {
  if (muted) return;
  playAsset("runner");
}

/** Cartoon "boing" — fallback when speech synthesis is unavailable. */
export function playBoing() {
  unlock();
  run((c) => {
    tone(c, {
      path: [
        [0, 180],
        [0.12, 520],
        [0.3, 260],
        [0.45, 420],
      ],
      dur: 0.5,
      peak: 0.12,
      attack: 0.01,
      vib: { rate: 22, depth: 18 },
    });
  });
}

/* ------------------------------------------------------------------ */
/* certificate voice                                                  */
/* ------------------------------------------------------------------ */

/** Human voice line from audio/certificate.* if it exists; otherwise a short non-speech boing. */
export function speakCertificateLine() {
  if (muted) return;
  if (hasAsset("certificate")) {
    playAsset("certificate");
    return;
  }
  playBoing();
}