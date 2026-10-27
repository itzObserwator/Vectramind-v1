import "./page-styles";
import Link from "next/link";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";

export function AboutHero() {
  return (
    <section
      id="top"
      className="inner-hero experience-hero product-landing-hero about-hero"
      aria-labelledby="about-title"
    >
      <HeroEnergy>
        <HeroRibbons />
      </HeroEnergy>
      <div className="product-landing-hero-content">
        <span className="eyebrow">Meet Vectramind</span>
        <h1 id="about-title" className="display">
          With you
          <br />
          <span className="brand-heading-accent">in mind.</span>
        </h1>
        <p>
          <ResponsiveCopy compact="Intelligence and innovation, built around people.">
            Where magnitude meets direction. We bring intelligence, innovation
            and technology together to transform human experiences.
          </ResponsiveCopy>
        </p>
        <div className="product-landing-actions">
          <Link href="#our-story" className="button button-primary">
            <ResponsiveCopy compact="Our story">
              Discover our story
            </ResponsiveCopy>
          </Link>
          <Link href="/capabilities" className="button hero-platform-button">
            <ResponsiveCopy compact="Our capabilities">
              Meet our capabilities
            </ResponsiveCopy>
          </Link>
        </div>
      </div>
      <div className="product-landing-hero-caption" aria-hidden="true">
        <span>People. Platforms. Possibilities.</span>
        <span>One shared purpose.</span>
      </div>
    </section>
  );
}
