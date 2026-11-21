/**
 * Optional real media. Vite resolves these globs at build time, so a URL is only
 * ever exposed when the file actually exists in src/assets/audio or src/assets/horror.
 * See the README.txt in each folder for the expected file names.
 */
const audio = import.meta.glob(["../assets/audio/*.{mp3,ogg,wav,m4a}", "../assets/horror/*.{mp3,ogg,wav,m4a}"], {
  eager: true,
  query: "?url",
  import: "default",
});
const visual = import.meta.glob("../assets/horror/*.{mp4,webm,jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const IMG = ["jpg", "jpeg", "png", "webp", "avif"];

function find(map, name, exts) {
  const key = Object.keys(map).find((p) => {
    const m = p.match(/\/([^/]+)\.([a-z0-9]+)$/i);
    return m && m[1].toLowerCase() === name && (!exts || exts.includes(m[2].toLowerCase()));
  });
  return key ? map[key] : null;
}

export const audioAssets = {
  splash: find(audio, "splash"),
  scream: find(audio, "scream"),
  certificate: find(audio, "certificate"),
  runner: find(audio, "runner"), // whoosh/sting for the fast background pass
};

// Local copies (src/assets/horror/ghost-primary.* and ghost-secondary.*) win when present.
const localGhost = {
  primary: find(visual, "ghost-primary", IMG) || find(visual, "ghost", IMG),
  secondary: find(visual, "ghost-secondary", IMG),
  secondary2: find(visual, "ghost-secondary-two", IMG),
};

// Ghostface cut-out: used as the Ghostface character on /ghost (the page falls back to an SVG if it fails).
export const GHOSTFACE_IMAGE =
  "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA4L3dvcmxkZmFjZXNsYWJfZnJvbnRhbF9mdWxsLWJvZHlfc2hvdF9vZl9hX2dob3N0bHlfZmlndXJlaW5fYnVybl84MDQ3ZmM0Mi1iN2Q0LTRiNjQtODI2ZS1mMzVhN2UzYjAxNGYucG5n.png";

// Image supplied by the owner for the full-screen attack (used only if no local file exists / loads).
const REMOTE_GHOST = {
  primary:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNdsUNzuhoy0Y31AV3kvLEOYWzN3Dpo3EMnBSPfk1eoQ&s",
  // the background runner uses the local src/assets/horror/ghost-secondary.png (the crawling girl)
  secondary: null,
  secondary2: null,
};

function probe(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const cache = {};

/**
 * Resolves to the first ghost image URL that actually loads (see order above), or null so callers fall back to the built-in SVG face.
 * Failures are not cached, so a later Crazy Mode toggle retries.
 */
export function resolveGhost(kind) {
  if (!cache[kind]) {
    cache[kind] = [localGhost[kind], REMOTE_GHOST[kind]]
      .filter(Boolean)
      .reduce((p, url) => p.then((found) => found || probe(url)), Promise.resolve(null))
      .then((found) => {
        if (!found) delete cache[kind];
        return found;
      });
  }
  return cache[kind];
}