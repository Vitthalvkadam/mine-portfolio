/**
 * Optional real audio. Vite resolves this glob at build time, so a URL is only exposed
 * when the file actually exists in src/assets/audio (see the README.txt there).
 */
const audio = import.meta.glob("../assets/audio/*.{mp3,ogg,wav,m4a}", {
  eager: true,
  query: "?url",
  import: "default",
});

function find(map, name) {
  const key = Object.keys(map).find((p) => {
    const m = p.match(/\/([^/]+)\.([a-z0-9]+)$/i);
    return m && m[1].toLowerCase() === name;
  });
  return key ? map[key] : null;
}

export const audioAssets = {
  certificate: find(audio, "certificate"),
};