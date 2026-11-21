import { useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";
import { profile, projects, skillCategories, socials } from "../data/portfolioData.js";
import { hasLink } from "../utils/links.js";

const COMMAND_HELP = {
  help: "list available commands",
  about: "who I am",
  skills: "technology stack by category",
  projects: "things I've built",
  resume: "open my resume (PDF)",
  contact: "ways to reach me",
  clear: "clear the terminal",
};
const COMMAND_NAMES = Object.keys(COMMAND_HELP);
const MAX_ENTRIES = 40;

const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
    {children}
  </a>
);

/** Each command returns an array of lines (strings or nodes). Content comes from portfolioData. */
function run(name) {
  switch (name) {
    case "help":
      return COMMAND_NAMES.map((c) => (
        <span key={c}>
          <span className="inline-block w-24 text-accent">{c}</span>
          {COMMAND_HELP[c]}
        </span>
      ));
    case "about":
      return [
        `${profile.name} — ${profile.role}`,
        profile.about,
        ...profile.facts.map((f) => `${f.label}: ${f.value}`),
      ];
    case "skills":
      return skillCategories.map((c) => (
        <span key={c.category}>
          <span className="inline-block w-24 text-accent">{c.category}</span>
          {c.skills.map((s) => s.name).join(", ")}
        </span>
      ));
    case "projects":
      return projects.map((p) => (
        <span key={p.id} className="block">
          <span className="text-text">{p.title}</span> — {p.stack.slice(0, 4).join(", ")}
          <br />
          <span className="ml-4 inline-flex flex-wrap gap-x-4">
            {hasLink(p.githubUrl) && <Link href={p.githubUrl}>source</Link>}
            {hasLink(p.liveUrl) && <Link href={p.liveUrl}>live demo</Link>}
          </span>
        </span>
      ));
    case "resume":
      return [
        <span key="r">
          Resume: <Link href={profile.resumeUrl}>Vitthal_Resume.pdf</Link>
        </span>,
      ];
    case "contact":
      return [
        <span key="e">
          email <Link href={socials.email}>{profile.email}</Link>
        </span>,
        <span key="g">
          github <Link href={socials.github}>{socials.github.replace("https://", "")}</Link>
        </span>,
        <span key="l">
          linkedin <Link href={socials.linkedin}>{socials.linkedin.replace("https://", "")}</Link>
        </span>,
      ];
    default:
      return null;
  }
}

export default function Terminal() {
  const [entries, setEntries] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1); // position while browsing history with ↑/↓
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const nextId = useRef(0);

  // Keep the newest output in view — scrolls the terminal itself, never the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const execute = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setCursor(-1);
    if (cmd === "clear") {
      setEntries([]);
      return;
    }
    const result = run(cmd);
    const lines = result ?? [`command not found: ${cmd}. Type "help" for available commands.`];
    setEntries((prev) => [...prev, { id: nextId.current++, cmd, lines, error: !result }].slice(-MAX_ENTRIES));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    execute(value);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab" && value) {
      const match = COMMAND_NAMES.find((c) => c.startsWith(value.toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    }
  };

  return (
    <Section
      id="terminal"
      title="Developer terminal"
      description="A small interactive shell. Type a command, or tap one below."
    >
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-xs text-muted">
          <span>visitor@{profile.githubUsername.toLowerCase()}: ~</span>
          <span className="hidden sm:inline">↑ ↓ history · Tab completes</span>
        </div>

        {/* Clicking the output area focuses the input, like a real terminal. */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus()}
          className="h-72 overflow-y-auto bg-bg/40 p-4 font-mono text-[13px] leading-relaxed text-muted"
        >
          <p>
            Welcome. Type <span className="text-accent">help</span> to see what I can do.
          </p>
          {entries.map((entry) => (
            <div key={entry.id} className="mt-3">
              <p>
                <span className="text-accent">$</span> <span className="text-text">{entry.cmd}</span>
              </p>
              <div className={`mt-1 space-y-1 ${entry.error ? "text-red-400" : ""}`}>
                {entry.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border px-4 py-3 font-mono">
          <label htmlFor="terminal-input" className="text-accent">
            <span aria-hidden="true">$</span>
            <span className="sr-only">Terminal command</span>
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type a command"
            className="min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-muted/60 sm:text-sm"
          />
          <button type="submit" className="btn-ghost px-3 py-1.5 text-xs">
            Run
          </button>
        </form>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Quick commands">
        {COMMAND_NAMES.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => execute(c)}
              className="tag cursor-pointer transition-colors hover:border-accent hover:text-accent"
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
