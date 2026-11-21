import { useRef, useState } from "react";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Section from "./Section.jsx";
import { profile, socials } from "../data/portfolioData";

// Public Formspree form ID (not a secret). Override per environment with VITE_FORM_ENDPOINT.
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "https://formspree.io/f/xykrjowj";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Enter your name (at least 2 characters).";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address, like you@example.com.";
  if (message.trim().length < 10) errors.message = "Write at least 10 characters so I know how to help.";
  else if (message.length > 2000) errors.message = "Keep the message under 2000 characters.";
  return errors;
}

const infoRows = [
  { icon: HiOutlineMail, label: "Email", value: profile.email, href: socials.email },
  { icon: FaGithub, label: "GitHub", value: `@${profile.githubUsername}`, href: socials.github },
  { icon: FaLinkedin, label: "LinkedIn", value: "/in/Vitthalvkadam", href: socials.linkedin },
  { icon: HiOutlineLocationMarker, label: "Location", value: profile.location, href: null },
];

const fieldClass = (invalid) =>
  `w-full rounded-lg border bg-surface-2 px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent ${
    invalid ? "border-red-400" : "border-border"
  }`;

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const formRef = useRef(null);

  const errors = validate(form);
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (status === "sent" || status === "error") setStatus("idle");
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          _gotcha: formRef.current?.elements._gotcha?.value || "", // honeypot
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section
      id="contact"
      title="Contact"
      description="Open to full-stack roles and collaborations. Send a message and I'll get back to you."
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <ul className="divide-y divide-border self-start border-y border-border">
          {infoRows.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <Icon className="shrink-0 text-lg text-accent" aria-hidden="true" />
                <span className="w-20 shrink-0 text-sm text-muted">{label}</span>
                <span className="min-w-0 break-words text-sm text-text">{value}</span>
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-4 transition-colors hover:text-accent"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 py-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="card p-6 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" error={shown("name")}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(shown("name"))}
                aria-describedby={shown("name") ? "name-error" : undefined}
                className={fieldClass(shown("name"))}
                placeholder="Your name"
              />
            </Field>
            <Field id="email" label="Email" error={shown("email")}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(shown("email"))}
                aria-describedby={shown("email") ? "email-error" : undefined}
                className={fieldClass(shown("email"))}
                placeholder="you@example.com"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field id="message" label="Message" error={shown("message")}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(shown("message"))}
                  aria-describedby={shown("message") ? "message-error" : undefined}
                  className={`${fieldClass(shown("message"))} resize-y`}
                  placeholder="Tell me about the role or project"
                />
              </Field>
            </div>
          </div>

          {/* Honeypot: hidden from people, bots tend to fill it. */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 w-full sm:w-auto">
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          <div aria-live="polite" className="mt-4 min-h-5 text-sm">
            {status === "sent" && <p className="text-accent">Message sent. Thanks, I'll reply soon.</p>}
            {status === "error" && (
              <p className="text-red-400">
                Couldn't send your message. Try again, or email me at{" "}
                <a href={socials.email} className="underline">
                  {profile.email}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
