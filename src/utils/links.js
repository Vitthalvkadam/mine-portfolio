/** True for a real, usable http(s) URL (filters out null, "" and "#" placeholders). */
export const hasLink = (url) => typeof url === "string" && /^https?:\/\//i.test(url);
