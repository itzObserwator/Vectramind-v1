"use client";
import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Arrow } from "@/components/site-primitives";

// Static hosting has no mailing-list service. Prepare an explicit email request
// instead of claiming a subscription that has not actually been recorded.
export function FooterJoin() {
  const emailId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = String(new FormData(form).get("email") || "").trim();
    setDraft(
      `mailto:support@vectramind.com?subject=${encodeURIComponent("Vectramind updates request")}&body=${encodeURIComponent(`Hello Vectramind,\n\nI would like to hear about your product news and updates.\n\nMy email: ${email}\n\nThank you.`)}`,
    );
  }
  return (
    <div className="footer-join">
      <h3>
        <span className="footer-join-copy-full">Join the conversation.</span>
        <span className="footer-join-copy-compact">Stay connected.</span>
      </h3>
      {draft ? (
        <div className="footer-join-result" role="status">
          <p>Your email request is ready to review.</p>
          <a href={draft}>
            Review & send <Arrow />
          </a>
          <button type="button" onClick={() => setDraft(null)}>
            Change email
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor={emailId}>
            Your email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            required
            aria-describedby={`${emailId}-note`}
          />
          <button type="submit">
            Join <Arrow />
          </button>
        </form>
      )}
      <p id={`${emailId}-note`} className="footer-join-note">
        <span className="footer-join-copy-full">
          Request updates by email. Review and send your request from your email
          app. <Link href="/privacy-policy">Privacy policy</Link>.
        </span>
        <span className="footer-join-copy-compact">
          Review and send in your email app.
        </span>
      </p>
    </div>
  );
}
