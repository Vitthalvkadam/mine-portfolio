import { useCallback, useEffect, useState } from "react";

const API = "https://api.github.com";
const TTL_MS = 10 * 60 * 1000; // cache for 10 min to stay well inside the unauthenticated rate limit
const cacheKey = (user) => `gh-cache:${user}`;

function readCache(user) {
  try {
    const raw = sessionStorage.getItem(cacheKey(user));
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(user, data) {
  try {
    sessionStorage.setItem(cacheKey(user), JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable — fine, just skip caching */
  }
}

async function getJson(url, signal) {
  const res = await fetch(url, { signal, headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) {
    const err = new Error(`GitHub responded with ${res.status}`);
    // Browsers only see x-ratelimit-* when GitHub exposes it via CORS, so treat an unreadable 403 as rate limiting too.
    const remaining = res.headers.get("x-ratelimit-remaining");
    err.rateLimited = res.status === 429 || (res.status === 403 && (remaining === null || remaining === "0"));
    err.notFound = res.status === 404;
    throw err;
  }
  return res.json();
}

function summarize(user, repos) {
  const own = repos.filter((r) => !r.fork);
  const languages = {};
  own.forEach((r) => {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
  });
  return {
    user: {
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      since: new Date(user.created_at).getFullYear(),
      url: user.html_url,
    },
    stars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
    languages: Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    repos: own
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
        homepage: r.homepage,
      })),
  };
}

/**
 * Public GitHub data for one user. No tokens: only unauthenticated, read-only
 * public endpoints are called from the browser.
 * Returns { status: "loading" | "success" | "error", data, error, retry }.
 */
export function useGithub(username) {
  const [state, setState] = useState(() => {
    const cached = readCache(username);
    return cached ? { status: "success", data: cached, error: null } : { status: "loading", data: null, error: null };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (attempt === 0 && state.status === "success") return undefined; // served from cache
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getJson(`${API}/users/${username}`, signal),
      getJson(`${API}/users/${username}/repos?per_page=100&type=owner`, signal),
    ])
      .then(([user, repos]) => {
        const data = summarize(user, repos);
        writeCache(username, data);
        setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
