"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
import { Button } from "@/components/ui/button";
import { PageHero } from "./page-primitives";
import { offices } from "@/content/site";
import { officeMapLinks } from "@/content/global-reach";

export function RequestForm({ support = false }: { support?: boolean }) {
  const [topic, setTopic] = useState(support ? "support" : "general");
  const [draft, setDraft] = useState<{ href: string; body: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get("topic");
    if (
      incoming &&
      (support
        ? ["support", "synapse", "firstpass", "integration-services"]
        : [
            "synapse",
            "firstpass",
            "careers",
            "artificial-intelligence",
            "solution-design",
            "integration-services",
          ]
      ).includes(incoming)
    )
      setTopic(incoming);
  }, [support]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "Not provided"}\nOrganization: ${data.get("company") || "Not provided"}\nEnquiry type: ${data.get("enquiryType")}\nTopic: ${topic}\nContact consent: Provided for this enquiry\n\n${data.get("message")}`;
    setDraft({
      body,
      href: `mailto:support@vectramind.com?subject=${encodeURIComponent(`Website enquiry — ${topic}`)}&body=${encodeURIComponent(body)}`,
    });
  }
  return (
    <div className="request-form-wrap">
      {draft ? (
        <div className="email-draft" role="status">
          <Mark />
          <span className="eyebrow">Ready for the next step</span>
          <h3>Your email is ready.</h3>
          <p>
            Open your email app to review and send your enquiry to
            support@vectramind.com.
          </p>
          <pre>{draft.body}</pre>
          <div className="draft-actions">
            <Button asChild>
              <a href={draft.href}>
                Open email app
                <Arrow />
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft.body);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied" : "Copy enquiry"}
            </Button>
          </div>
          <button
            className="draft-edit"
            onClick={() => {
              setDraft(null);
              setCopied(false);
            }}
          >
            Write another enquiry
          </button>
          <p className="form-note">
            Your enquiry has not been sent. Send it from your email app to
            complete your request.
          </p>
        </div>
      ) : (
        <form className="request-form" onSubmit={submit}>
          <div className="form-heading">
            <span className="eyebrow">
              {support
                ? "Tell us how we can help"
                : "A conversation is a good beginning"}
            </span>
            <h2>
              {support
                ? "Let’s find a way forward."
                : "What do you have in mind?"}
            </h2>
          </div>
          <div className="form-fields">
            <label>
              Your name <span>*</span>
              <input
                name="name"
                autoComplete="name"
                required
                placeholder="Full name"
                maxLength={100}
              />
            </label>
            <label>
              Work email <span>*</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                maxLength={180}
              />
            </label>
            <label>
              Organization
              <input
                name="company"
                autoComplete="organization"
                placeholder="Company or organization"
                maxLength={150}
              />
            </label>
            <label>
              Phone number
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder="Include your country code"
              />
            </label>
            <fieldset className="form-full enquiry-types">
              <legend>Enquiry type</legend>
              {[
                "Sales enquiry",
                "General query",
                "Career / job application",
              ].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="enquiryType"
                    value={type}
                    defaultChecked={type === "General query"}
                  />
                  {type}
                </label>
              ))}
            </fieldset>
            <label>
              {support ? "I need help with" : "I’m interested in"}{" "}
              <span>*</span>
              <select
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {!support && (
                  <option value="general">
                    A conversation with Vectramind
                  </option>
                )}
                <option value="synapse">
                  {support ? "Synapse support" : "Synapse demo"}
                </option>
                <option value="firstpass">
                  {support ? "Firstpass support" : "Firstpass demo"}
                </option>
                {!support && (
                  <>
                    <option value="artificial-intelligence">
                      Artificial intelligence
                    </option>
                    <option value="solution-design">
                      Solution design & development
                    </option>
                  </>
                )}
                <option value="integration-services">
                  {support ? "Integration support" : "Integration services"}
                </option>
                <option value="support">Product support</option>
                {!support && <option value="careers">Careers</option>}
              </select>
            </label>
            <label className="form-full">
              Your message <span>*</span>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                placeholder={
                  support
                    ? "Tell us which product you use and what you need help with."
                    : "Tell us about your goals, your team, or the challenge you’d like to solve."
                }
              />
            </label>
          </div>
          <label className="form-consent">
            <input type="checkbox" required />{" "}
            <span>
              I agree to the <Link href="/privacy-policy">privacy policy</Link>{" "}
              and to being contacted about this enquiry by email, WhatsApp, RCS
              or SMS using the details I provide.
            </span>
          </label>
          <div className="form-submit">
            <Button type="submit">
              Prepare email
              <Arrow />
            </Button>
            <p className="form-note">
              Creates an email draft for you to review and send. This form does
              not send messages automatically.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
export function ContactPage() {
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Contact Vectramind"
        title={["Let’s connect.", "Then evolve."]}
        description="A new platform. A complex challenge. An idea that deserves a conversation. Tell us what’s next for you."
      />
      <section className="contact-layout page-padding">
        <aside>
          <span className="eyebrow">With you in mind</span>
          <h2>Good things start with a conversation.</h2>
          <p>
            Explore Synapse, Firstpass or a solution built around your
            organization.
          </p>
          <a className="contact-email" href="mailto:support@vectramind.com">
            support@vectramind.com
            <Arrow />
          </a>
          <div className="contact-side-links">
            <Link href="/synapse">
              Customer engagement
              <Arrow />
            </Link>
            <Link href="/firstpass">
              Patient experience
              <Arrow />
            </Link>
            <Link href="/support">
              Need product support?
              <Arrow />
            </Link>
          </div>
        </aside>
        <RequestForm />
      </section>
      <section
        id="locations"
        className="inner-section page-padding inner-panel"
      >
        <SectionLabel>Our world</SectionLabel>
        <h2 className="display inner-section-title" data-reveal>
          Closer than
          <br />
          you think.
        </h2>
        <div className="locations-grid">
          {offices.map((office, i) => (
            <a
              key={office}
              href={officeMapLinks[office]}
              target="_blank"
              rel="noreferrer"
            >
              <span className="eyebrow">0{i + 1} / Vectramind</span>
              <h3>{office}</h3>
              <span>
                View on map
                <Arrow />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
