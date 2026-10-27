import "./page-styles";
import Link from "next/link";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";

export function SupportHero() {
  return (
    <section
      id="top"
      className="inner-hero experience-hero product-landing-hero support-hero"
      aria-labelledby="support-title"
    >
      <HeroEnergy>
        <HeroRibbons />
      </HeroEnergy>
      <div className="product-landing-hero-content">
        <span className="eyebrow">Vectramind support</span>
        <h1 id="support-title" className="display">
          Here to help.
          <br />
          <span className="brand-heading-accent">With you.</span>
        </h1>
        <p>
          <ResponsiveCopy compact="Find an answer or connect with our support team.">
            Find answers, explore your platform and connect with the people who
            can help you move forward.
          </ResponsiveCopy>
        </p>
        <div className="product-landing-actions">
          <Link href="#support-answers" className="button button-primary">
            Find an answer
          </Link>
          <Link href="#support-request" className="button hero-platform-button">
            Contact support
          </Link>
        </div>
      </div>
      <div className="product-landing-hero-caption" aria-hidden="true">
        <span>Human. Helpful. Connected.</span>
        <span>With you in mind.</span>
      </div>
    </section>
  );
}
