import "./page-styles";
import Link from "next/link";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";

export function CapabilitiesHero() {
  return (
    <section
      id="top"
      className="inner-hero experience-hero product-landing-hero capabilities-hero"
      aria-labelledby="capabilities-title"
    >
      <HeroEnergy>
        <HeroRibbons />
      </HeroEnergy>
      <div className="product-landing-hero-content">
        <span className="eyebrow">Our capabilities</span>
        <h1 id="capabilities-title" className="display">
          Intelligence.
          <br />
          <span className="brand-heading-accent">In motion.</span>
        </h1>
        <p>
          <ResponsiveCopy compact="Intelligence, design and integration. Built around your people.">
            Bring intelligence, thoughtful design and connected systems
            together. Build better experiences around your customers, patients
            and teams.
          </ResponsiveCopy>
        </p>
        <div className="product-landing-actions">
          <Link href="/contact" className="button button-primary">
            <ResponsiveCopy compact="Let’s talk">
              Let’s build what’s next
            </ResponsiveCopy>
          </Link>
          <Link
            href="#capability-services"
            className="button hero-platform-button"
          >
            <ResponsiveCopy compact="Our expertise">
              Explore our expertise
            </ResponsiveCopy>
          </Link>
        </div>
      </div>
      <div className="product-landing-hero-caption" aria-hidden="true">
        <span>Intelligence. Experience. Integration.</span>
        <span>With you in mind.</span>
      </div>
    </section>
  );
}
