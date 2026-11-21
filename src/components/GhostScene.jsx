import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GhostfaceRoom } from "./GhostfaceFigure.jsx";

/**
 * The 3D ghost: a long-haired girl in a blood-stained white robe, built entirely in code with
 * three.js primitives (no model file, no loader) and rendered on a transparent canvas, standing in a
 * real-home backdrop. Needs: npm install three.
 */

// A photo of a real home. Drop your own at src/assets/horror/room.jpg|png|webp and it wins.
const localRoom = Object.values(
  import.meta.glob("../assets/horror/room.{jpg,jpeg,png,webp,avif}", {
    eager: true,
    query: "?url",
    import: "default",
  })
)[0];
const FALLBACK_ROOM = "https://unsplash.com/photos/DXPnkL7yDzs/download?force=true&w=1800";

function probe(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Real-home photo, darkened into a night-time haunting. Falls back to the drawn room if no photo loads. */
export function GhostRoomBackdrop() {
  const [bg, setBg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    [localRoom, FALLBACK_ROOM]
      .filter(Boolean)
      .reduce((p, url) => p.then((found) => found || probe(url)), Promise.resolve(null))
      .then((url) => !cancelled && setBg(url));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!bg) return <GhostfaceRoom />;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url("${bg}")`, filter: "brightness(0.42) contrast(1.2) saturate(0.65)" }}
      />
      {/* cold night tint */}
      <div className="absolute inset-0 bg-[#0a1236]/60 mix-blend-multiply" />
      {/* faint warm pool of light on the floor where the ghost stands */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(255,170,90,0.16),transparent_55%)]" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_38%,rgba(0,0,0,0.88)_100%)]" />
      {/* the lights flicker now and then */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0, 0.35, 0, 0.55, 0, 0] }}
        transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.52, 0.55, 0.57, 0.6, 1] }}
      />
    </div>
  );
}

// Expressions can't change a rigid mesh, so each mood re-lights him instead.
const MOODS = {
  normal: { key: [0xffe6cc, 2.2], rim: [0xff2a2a, 1.4], hemi: 1.0 },
  happy: { key: [0xfff2d8, 3.0], rim: [0xffb070, 1.2], hemi: 1.3 },
  scream: { key: [0xff5a4a, 1.4], rim: [0xff0000, 7], hemi: 0.5, shake: 0.03 },
  angry: { key: [0xff7050, 1.6], rim: [0xff0000, 5], hemi: 0.6, shake: 0.012 },
  love: { key: [0xffb0d0, 2.4], rim: [0xff3b8a, 3], hemi: 1.0 },
  sad: { key: [0x7aa0ff, 1.4], rim: [0x3a5cff, 1.2], hemi: 0.8 },
  sleep: { key: [0x6a7aa8, 0.6], rim: [0x2a1a3a, 0.5], hemi: 0.35 },
};

/* ------------------------------------------------------------------ */
/* procedural ghost                                                    */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cream robe cloth with grime, folds, a lace hem band and blood pooling / dripping from the hem. */
function makeRobeTexture(THREE, { seed = 11, blood = 1 } = {}) {
  const W = 512;
  const H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  const r = rng(seed);

  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#f6efe3");
  base.addColorStop(0.6, "#efe3d2");
  base.addColorStop(1, "#e2d0bc");
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  // soft grime blotches (drawn twice so the texture tiles around the robe)
  for (let i = 0; i < 240; i += 1) {
    const x = r() * W;
    const y = r() * H;
    const rad = 18 + r() * 60;
    const a = 0.03 + r() * 0.1;
    for (const ox of [0, -W]) {
      const gr = g.createRadialGradient(x + ox, y, 0, x + ox, y, rad);
      gr.addColorStop(0, `rgba(110,80,62,${a})`);
      gr.addColorStop(1, "rgba(110,80,62,0)");
      g.fillStyle = gr;
      g.fillRect(x + ox - rad, y - rad, rad * 2, rad * 2);
    }
  }
  // cloth folds
  for (let i = 0; i < 80; i += 1) {
    g.fillStyle = `rgba(80,60,50,${0.03 + r() * 0.07})`;
    g.fillRect(r() * W, r() * H * 0.4, 2 + r() * 10, H);
  }

  // blood pooling toward the hem (canvas bottom = hem)
  const pool = g.createLinearGradient(0, H * 0.74, 0, H);
  pool.addColorStop(0, "rgba(150,10,16,0)");
  pool.addColorStop(0.6, `rgba(140,8,14,${0.4 * blood})`);
  pool.addColorStop(1, `rgba(105,0,8,${0.85 * blood})`);
  g.fillStyle = pool;
  g.fillRect(0, H * 0.74, W, H * 0.26);

  // drips and smears: heavier toward the hem, thin streaks higher up
  for (let i = 0; i < Math.round(46 * blood); i += 1) {
    const x = r() * W;
    const y0 = H * (0.5 + r() * 0.45);
    const len = 40 + r() * 170;
    const w = 3 + r() * 9;
    const gr = g.createLinearGradient(0, y0, 0, y0 + len);
    gr.addColorStop(0, "rgba(135,6,12,0.0)");
    gr.addColorStop(0.2, "rgba(135,6,12,0.7)");
    gr.addColorStop(1, "rgba(95,0,8,0.8)");
    g.fillStyle = gr;
    g.fillRect(x - w / 2, y0, w, len);
    g.beginPath();
    g.arc(x, y0 + len, w / 2, 0, Math.PI * 2);
    g.fill();
  }
  // splatter
  for (let i = 0; i < Math.round(150 * blood); i += 1) {
    const y = H * (0.55 + r() * 0.45);
    g.fillStyle = `rgba(${110 + r() * 50},4,10,${0.3 + r() * 0.5})`;
    g.beginPath();
    g.arc(r() * W, y, 1 + r() * 5, 0, Math.PI * 2);
    g.fill();
  }
  // lace hem band
  const bandTop = H * 0.935;
  g.fillStyle = "#b9a899";
  g.fillRect(0, bandTop, W, H - bandTop);
  for (let x = 0; x < W; x += 7) {
    g.fillStyle = x % 14 ? "rgba(70,90,110,0.45)" : "rgba(235,225,210,0.55)";
    g.fillRect(x, bandTop + 4, 3, H - bandTop - 8);
  }
  g.fillStyle = "rgba(120,4,10,0.75)";
  g.fillRect(0, H - 7, W, 7);
  g.fillStyle = "rgba(125,6,12,0.45)";
  g.fillRect(0, bandTop - 2, W, 3);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/** A flat, tapering, curved strip of hair along a cubic Bezier. Points are relative to the head. */
function hairStrip(THREE, p0, p1, p2, p3, dir, w0, w1, segs = 16) {
  const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
  const pts = curve.getPoints(segs);
  const pos = new Float32Array(pts.length * 2 * 3);
  const idx = [];
  pts.forEach((p, i) => {
    const t = i / segs;
    const tan = pts[Math.min(i + 1, segs)].clone().sub(pts[Math.max(i - 1, 0)]).normalize();
    let side = new THREE.Vector3().crossVectors(tan, dir);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
    side.normalize();
    const w = (w0 + (w1 - w0) * t * t) / 2;
    pos.set([p.x - side.x * w, p.y - side.y * w, p.z - side.z * w], i * 6);
    pos.set([p.x + side.x * w, p.y + side.y * w, p.z + side.z * w], i * 6 + 3);
    if (i < segs) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds the whole ghost (about 2 units tall, feet on y = 0, facing +z) from primitives.
 * Returns the group plus an update(t, mood) used every frame for idle motion and expressions.
 */
function buildGhost(THREE) {
  const root = new THREE.Group();
  const r = rng(5);

  const robeMat = new THREE.MeshStandardMaterial({
    map: makeRobeTexture(THREE),
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  // sleeves: same cloth, but only a little blood and a stained cuff
  const sleeveMat = new THREE.MeshStandardMaterial({
    map: makeRobeTexture(THREE, { seed: 23, blood: 0.18 }),
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb98670, roughness: 0.62 });
  const paleMat = new THREE.MeshStandardMaterial({ color: 0xd6bcad, roughness: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0b0405, roughness: 0.8 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x030303, roughness: 0.8, metalness: 0, side: THREE.DoubleSide });
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0x2a0407, roughness: 0.6 });
  const braceletMat = new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.7 });

  /* ---- robe (lathe) ---- */
  const profile = new THREE.SplineCurve(
    [
      [0.262, 0.12],
      [0.258, 0.22],
      [0.235, 0.5],
      [0.2, 0.8],
      [0.165, 1.05],
      [0.138, 1.25],
      [0.119, 1.33],
      [0.13, 1.42],
      [0.15, 1.52],
      [0.167, 1.6],
      [0.14, 1.655],
      [0.065, 1.69],
      [0.046, 1.705],
    ].map(([x, y]) => new THREE.Vector2(x, y))
  ).getPoints(60);
  const robeGeo = new THREE.LatheGeometry(profile, 56);
  const rp = robeGeo.attributes.position;
  for (let i = 0; i < rp.count; i += 1) {
    const x = rp.getX(i);
    const y = rp.getY(i);
    const z = rp.getZ(i);
    const th = Math.atan2(x, z);
    const k = Math.max(0, 1 - (y - 0.12) / 0.95); // ripples are strongest near the hem
    const f = 1 + 0.035 * k * Math.sin(5 * th + 1.3) + 0.02 * k * Math.sin(9 * th);
    rp.setXYZ(i, x * f, y, z * f * 0.8);
  }
  robeGeo.computeVertexNormals();
  const robe = new THREE.Mesh(robeGeo, robeMat);
  robe.rotation.y = Math.PI; // keep the texture seam at the back
  root.add(robe);

  /* ---- legs / feet peeking under the hem ---- */
  [-1, 1].forEach((s) => {
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.2, 14), skinMat);
    shin.position.set(s * 0.085, 0.09, 0.01);
    root.add(shin);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), skinMat);
    foot.scale.set(0.05, 0.03, 0.125);
    foot.position.set(s * 0.09, 0.03, 0.065);
    foot.rotation.y = s * -0.12;
    root.add(foot);
  });

  /* ---- neck ---- */
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.042, 0.13, 16), paleMat);
  neck.position.set(0, 1.7, 0);
  root.add(neck);

  /* ---- arms: bell sleeves, forearm, hand ---- */
  const arms = [-1, 1].map((s) => {
    const arm = new THREE.Group();
    arm.position.set(s * 0.165, 1.6, 0);
    const sleeveGeo = new THREE.CylinderGeometry(0.05, 0.115, 0.46, 28, 8, true);
    sleeveGeo.translate(0, -0.23, 0);
    const sp = sleeveGeo.attributes.position;
    for (let i = 0; i < sp.count; i += 1) {
      const y = sp.getY(i);
      const k = Math.min(1, Math.max(0, (-y - 0.3) / 0.16));
      const th = Math.atan2(sp.getX(i), sp.getZ(i));
      const f = 1 + k * 0.09 * Math.sin(4 * th + s);
      sp.setX(i, sp.getX(i) * f);
      sp.setZ(i, sp.getZ(i) * f);
    }
    sleeveGeo.computeVertexNormals();
    arm.add(new THREE.Mesh(sleeveGeo, sleeveMat));

    const forearmGeo = new THREE.CylinderGeometry(0.03, 0.024, 0.26, 14);
    forearmGeo.translate(0, -0.55, 0);
    arm.add(new THREE.Mesh(forearmGeo, skinMat));
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.006, 8, 18), braceletMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.62;
    arm.add(band);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), skinMat);
    hand.scale.set(0.034, 0.075, 0.022);
    hand.position.set(0, -0.73, 0.008);
    arm.add(hand);
    root.add(arm);
    return arm;
  });

  /* ---- head ---- */
  const HEAD_Y = 1.82;
  const head = new THREE.Group();
  head.position.set(0, HEAD_Y, 0);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.112, 32, 24), paleMat);
  skull.scale.set(0.88, 1.12, 0.98);
  head.add(skull);
  [-1, 1].forEach((s) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), darkMat);
    eye.scale.set(0.02, 0.013, 0.01);
    eye.position.set(s * 0.036, 0.012, 0.1);
    head.add(eye);
  });
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mouthMat);
  mouth.scale.set(0.028, 0.004, 0.01);
  mouth.position.set(0, -0.055, 0.098);
  head.add(mouth);
  // hair cap: covers the skull except for a narrow centre parting at the front
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.121, 36, 26, Math.PI / 2 + 0.1, Math.PI * 2 - 0.2),
    hairMat
  );
  cap.scale.set(0.97, 1.13, 1.04);
  cap.position.set(0, 0.006, -0.006);
  head.add(cap);
  root.add(head);

  /* ---- long hair: ~150 tapering strips falling over the face, shoulders and back ---- */
  const hair = new THREE.Group();
  hair.position.set(0, HEAD_Y, 0);
  const strands = [];
  const COUNT = 150;
  for (let i = 0; i < COUNT; i += 1) {
    let th = (i / COUNT) * Math.PI * 2 + (r() - 0.5) * 0.05;
    th = ((th + Math.PI) % (Math.PI * 2)) - Math.PI; // -PI..PI, 0 = front
    if (Math.abs(th) < 0.1) th = Math.sign(th || 1) * (0.1 + r() * 0.05); // keep the parting open
    const dir = new THREE.Vector3(Math.sin(th), 0, Math.cos(th));
    const polar = 0.3 + r() * 0.65;
    const R = 0.135;
    const start = new THREE.Vector3(
      R * 0.97 * Math.sin(polar) * dir.x,
      R * 1.13 * Math.cos(polar),
      R * 1.04 * Math.sin(polar) * dir.z
    );
    const front = Math.cos(th); // 1 front, -1 back
    const side = Math.sin(th);
    let end;
    if (front > 0.15) {
      // curtain over the face, down over chest and shoulders
      end = new THREE.Vector3(side * (0.07 + r() * 0.1) + Math.sign(side) * 0.02, -(0.5 + r() * 0.38), 0.145 + r() * 0.03);
    } else if (front < -0.15) {
      // down the back
      end = new THREE.Vector3(side * (0.09 + r() * 0.05), -(0.38 + r() * 0.62), -(0.15 + r() * 0.03));
    } else {
      // behind the shoulders
      end = new THREE.Vector3(Math.sign(side) * (0.105 + r() * 0.02), -(0.3 + r() * 0.22), front * 0.1);
    }
    const c1 = start.clone().add(new THREE.Vector3(dir.x * 0.07, -0.03, dir.z * 0.08));
    const c2 = new THREE.Vector3(end.x * 1.1, end.y + 0.35 + r() * 0.1, end.z + Math.sign(front) * 0.03);
    const geo = hairStrip(THREE, start, c1, c2, end, dir, 0.034 + r() * 0.03, 0.006 + r() * 0.008);
    const m = new THREE.Mesh(geo, hairMat);
    m.userData.phase = r() * Math.PI * 2;
    m.userData.len = Math.abs(end.y);
    hair.add(m);
    strands.push(m);
  }
  root.add(hair);

  const [armL, armR] = arms;
  let mouthOpen = 0;

  function update(t, mood, reduced) {
    // arms: relaxed by the sides, raised when he screams
    const spread = { scream: 1.2, angry: 0.6, happy: 0.5, love: 0.35, sad: 0.14, sleep: 0.12 }[mood] ?? 0.2;
    const idle = reduced ? 0 : Math.sin(t * 0.9) * 0.02;
    const wave = mood === "happy" && !reduced ? Math.sin(t * 9) * 0.12 : 0;
    armR.rotation.z += (spread + idle + wave - armR.rotation.z) * 0.1;
    armL.rotation.z += (-(spread + idle) - armL.rotation.z) * 0.1;

    // face: mouth opens when he screams
    const open = { scream: 1, angry: 0.45, happy: 0.18 }[mood] ?? 0;
    mouthOpen += (open - mouthOpen) * 0.15;
    mouth.scale.y = 0.004 + mouthOpen * 0.034;
    mouth.scale.x = 0.028 + mouthOpen * 0.006;
    const tilt = { sad: 0.1, sleep: 0.14 }[mood] ?? 0;
    head.rotation.z += (tilt + (reduced ? 0 : Math.sin(t * 0.7) * 0.015) - head.rotation.z) * 0.08;

    // hair sways; it thrashes when he is angry or screaming
    const amp = { scream: 0.09, angry: 0.05 }[mood] ?? 0.018;
    const speed = mood === "scream" ? 7 : mood === "angry" ? 4 : 0.8;
    if (!reduced) {
      strands.forEach((s) => {
        const p = s.userData.phase;
        s.rotation.z = Math.sin(t * speed + p) * amp;
        s.rotation.x = Math.sin(t * speed * 0.8 + p * 1.7) * amp * 0.7;
      });
    }
  }

  return { group: root, update };
}

/** three.js view of the procedural ghost. Drag sideways to turn her; she sways and floats on her own. */
export function Ghost3D({ face = "normal" }) {
  const hostRef = useRef(null);
  const moodRef = useRef(face);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    moodRef.current = face;
  }, [face]);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.setClearColor(0x000000, 0);
        const el = renderer.domElement;
        el.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
        host.appendChild(el);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 100);
        const hemi = new THREE.HemisphereLight(0x8fa6ff, 0x1a0a0a, 1.0);
        const key = new THREE.DirectionalLight(0xffe6cc, 2.2);
        key.position.set(-1.5, 2.2, 3);
        const rim = new THREE.DirectionalLight(0xff2a2a, 1.4);
        rim.position.set(2.5, 1.5, -2);
        scene.add(hemi, key, rim);

        const pivot = new THREE.Group();
        scene.add(pivot);
        let height = 2;
        let ghost = null;

        const resize = () => {
          const w = host.clientWidth || 1;
          const h = host.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(host);
        resize();

        // build the ghost from primitives, stand her on the origin and frame the camera
        ghost = buildGhost(THREE);
        pivot.add(ghost.group);
        pivot.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(ghost.group);
        ghost.group.position.x -= box.getCenter(new THREE.Vector3()).x;
        ghost.group.position.y -= box.min.y;
        height = box.getSize(new THREE.Vector3()).y;
        const dist = (height * 0.5) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.08;
        camera.position.set(0, height * 0.52, dist);
        camera.lookAt(0, height * 0.5, 0);
        setStatus("ready");

        // drag to turn
        let dragging = false;
        let lastX = 0;
        let dragYaw = 0;
        const down = (e) => {
          dragging = true;
          lastX = e.clientX;
          el.style.cursor = "grabbing";
          el.setPointerCapture?.(e.pointerId);
        };
        const move = (e) => {
          if (!dragging) return;
          dragYaw += (e.clientX - lastX) * 0.012;
          lastX = e.clientX;
        };
        const up = () => {
          dragging = false;
          el.style.cursor = "grab";
        };
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);

        const tmp = new THREE.Color();
        let raf = 0;
        const t0 = performance.now();
        const tick = () => {
          raf = requestAnimationFrame(tick);
          if (document.hidden) return;
          const t = (performance.now() - t0) / 1000;
          const m = MOODS[moodRef.current] || MOODS.normal;
          ghost?.update(t, moodRef.current, reduced);

          // ease the lighting toward the current mood
          key.color.lerp(tmp.setHex(m.key[0]), 0.12);
          key.intensity += (m.key[1] - key.intensity) * 0.12;
          rim.color.lerp(tmp.setHex(m.rim[0]), 0.12);
          rim.intensity += (m.rim[1] - rim.intensity) * 0.12;
          hemi.intensity += (m.hemi - hemi.intensity) * 0.12;

          if (!dragging) dragYaw *= 0.985; // drift back to facing the viewer
          const sway = reduced ? 0 : Math.sin(t * 0.6) * 0.3;
          pivot.rotation.y = dragYaw + sway;
          pivot.position.y = reduced ? 0 : Math.sin(t * 1.4) * 0.04 * height * 0.5;
          const sh = reduced ? 0 : m.shake || 0;
          pivot.position.x = sh ? (Math.random() - 0.5) * sh * 2 : 0;
          pivot.rotation.z = sh ? (Math.random() - 0.5) * sh : 0;

          renderer.render(scene, camera);
        };
        tick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
              const mats = Array.isArray(o.material) ? o.material : [o.material];
              mats.forEach((mat) => {
                Object.values(mat).forEach((v) => v && v.isTexture && v.dispose());
                mat.dispose();
              });
            }
          });
          renderer.dispose();
          renderer.forceContextLoss();
          el.remove();
        };
        if (disposed) cleanup();
      } catch {
        if (!disposed) setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative h-[min(58vh,430px)] w-[min(70vw,320px)]">
      <div ref={hostRef} className="absolute inset-0" />
      {status !== "ready" && (
        <p className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-xs tracking-[0.25em] text-white/70">
          {status === "loading" && <span className="animate-pulse">SUMMONING…</span>}
          {status === "error" && "THE GHOST COULD NOT BE SUMMONED (WebGL is unavailable)"}
        </p>
      )}
    </div>
  );
}
