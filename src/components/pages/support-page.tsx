import Link from "next/link";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { SupportHero } from "./support-hero";
import { SupportAnswers } from "./support-answers";
import { RequestForm } from "./contact-pages";
import { Mark, SectionLabel } from "@/components/site-primitives";

export function SupportPage() {
  return (
    <>
      <SupportHero />
      <section
        className="support-start page-padding"
        aria-labelledby="support-start-title"
      >
        <SectionLabel right="01 / A good place to begin">
          Find your way
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="support-start-title" className="display" data-reveal>
            <ResponsiveCopy compact="Help for your platform.">
              The right help.
              <br />
              <span className="brand-heading-accent">For your platform.</span>
            </ResponsiveCopy>
          </h2>
          <p>
            <ResponsiveCopy compact="Explore your platform or tell us what you need.">
              Explore what your platform can do, find an answer to your question
              or tell our team what you need.
            </ResponsiveCopy>
          </p>
        </div>
        <div className="support-help-grid">
          <article>
            <img
              src="/images/synapse.svg"
              alt="Synapse CPaaS"
              width="170"
              height="40"
              loading="lazy"
            />
            <h3>
              <ResponsiveCopy compact="Messaging support.">
                Every conversation, connected.
              </ResponsiveCopy>
            </h3>
            <p>
              <ResponsiveCopy compact="Explore channels, campaigns and integrations.">
                Explore messaging channels, campaigns and integrations across
                your customer engagement platform.
              </ResponsiveCopy>
            </p>
            <Link href="/synapse" className="button hero-platform-button">
              Explore Synapse
            </Link>
          </article>
          <article>
            <img
              src="/images/firstpass.svg"
              alt="Firstpass"
              width="170"
              height="40"
              loading="lazy"
            />
            <h3>
              <ResponsiveCopy compact="Patient journeys.">
                Care at every touchpoint.
              </ResponsiveCopy>
            </h3>
            <p>
              <ResponsiveCopy compact="Explore scheduling, patient flow and communications.">
                Explore scheduling, patient flow, communications and the modules
                behind a connected patient journey.
              </ResponsiveCopy>
            </p>
            <Link href="/firstpass" className="button hero-platform-button">
              Explore Firstpass
            </Link>
          </article>
          <article>
            <div className="support-team-brand">
              <Mark />
              <span>Our team</span>
            </div>
            <h3>A human connection.</h3>
            <p>
              <ResponsiveCopy compact="Tell us what’s happening. We’ll help you find a way forward.">
                Tell us what’s happening. We’ll help you find the right starting
                point for your question.
              </ResponsiveCopy>
            </p>
            <Link
              href="#support-request"
              className="button hero-platform-button"
            >
              Talk to our team
            </Link>
          </article>
        </div>
      </section>
      <section
        id="support-request"
        className="support-request page-padding"
        aria-labelledby="support-request-title"
      >
        <SectionLabel right="02 / Let’s find a way forward">
          Contact support
        </SectionLabel>
        <div className="support-request-layout">
          <aside>
            <h2 id="support-request-title" className="display" data-reveal>
              <ResponsiveCopy compact="Contact support.">
                Tell us what’s
                <br />
                <span className="brand-heading-accent">happening.</span>
              </ResponsiveCopy>
            </h2>
            <p>
              <ResponsiveCopy compact="Tell us about your platform and the help you need.">
                Help our team understand your question so we can point you in
                the right direction.
              </ResponsiveCopy>
            </p>
            <a className="contact-email" href="mailto:support@vectramind.com">
              support@vectramind.com
            </a>
            <div className="support-steps-desktop">
              <SupportPreparationSteps />
            </div>
            <details className="support-preparation">
              <summary>
                What to include<span aria-hidden="true">+</span>
              </summary>
              <SupportPreparationSteps />
            </details>
          </aside>
          <RequestForm support />
        </div>
      </section>
      <section
        id="support-answers"
        className="support-faq page-padding"
        aria-labelledby="support-faq-title"
      >
        <SectionLabel right="03 / A little more clarity">
          Your questions
        </SectionLabel>
        <div className="support-faq-layout">
          <div className="support-faq-intro">
            <h2 id="support-faq-title" className="display" data-reveal>
              <ResponsiveCopy compact="Find an answer.">
                Answers that
                <br />
                <span className="brand-heading-accent">move you forward.</span>
              </ResponsiveCopy>
            </h2>
            <p>
              <ResponsiveCopy compact="Choose a topic or search your question.">
                Start with a product or search for what you need. If you’re
                still looking for an answer, we’re here.
              </ResponsiveCopy>
            </p>
          </div>
          <SupportAnswers />
        </div>
      </section>
    </>
  );
}

function SupportPreparationSteps() {
  return (
    <ol className="support-request-steps">
      <li>
        <span aria-hidden="true">01</span>
        <div>
          <h3>Your platform</h3>
          <p>
            Let us know which product and organization you’re contacting us
            about.
          </p>
        </div>
      </li>
      <li>
        <span aria-hidden="true">02</span>
        <div>
          <h3>Your question</h3>
          <p>
            Describe what happened, when it occurred and the steps leading up to
            it.
          </p>
        </div>
      </li>
      <li>
        <span aria-hidden="true">03</span>
        <div>
          <h3>Review and send</h3>
          <p>
            Prepare your enquiry, then review and send it from your email app.
          </p>
        </div>
      </li>
    </ol>
  );
}
