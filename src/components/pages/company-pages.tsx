"use client";
import Link from "next/link";
import { Arrow } from "@/components/site-primitives";
import { PageHero, IntroSection, FeatureGrid } from "./page-primitives";

export function CareersPage() {
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Careers at Vectramind"
        title={["Open minds.", "New possibilities."]}
        description="Storytellers. Pioneers. Mentors. Creators. Bring your curiosity to a team that is always finding new ways to adapt and evolve."
        image="career.webp"
        cta="Introduce yourself"
        href="/contact?topic=careers"
      />
      <IntroSection
        label="Life at Vectramind"
        title="Big ideas start with curious people."
        text="Fast-paced and future-driven. Unbridled curiosity. Mutual trust. At Vectramind, we bring together experiences and perspectives to turn ambitious ideas into reality. Growth aligns with purpose, and magnitude meets direction."
      />
      <FeatureGrid
        label="Room to grow"
        title="Build great products. Grow together."
        items={[
          [
            "Learning",
            "Stay curious, explore new ideas and build knowledge alongside your colleagues.",
          ],
          [
            "Recognition",
            "Bring your perspective to a culture that recognizes talent, contribution and collaboration.",
          ],
          [
            "Growth",
            "Develop your skills while helping shape platforms that serve people and organizations.",
          ],
          [
            "Leadership",
            "Take initiative, share your experience and help others move forward.",
          ],
        ]}
      />
      <section className="career-story page-padding inner-section">
        <div className="career-photo">
          <img
            src="/images/event-31.webp"
            alt="The Vectramind team working together"
            loading="lazy"
            data-parallax
          />
        </div>
        <div>
          <span className="eyebrow">Collaborate & work as one</span>
          <h2 className="display" data-reveal>
            A global outlook.
            <br />
            <span className="brand-heading-accent">A human culture.</span>
          </h2>
          <p>
            We’re an equal rights employer that encourages diversity while
            recognizing merit and growth. From Dubai to Vancouver, we recognize
            excellence across geographies and cultures, connecting a global
            network of storytellers, pioneers, mentors and creators.
          </p>
          <Link className="text-link" href="/about">
            Meet Vectramind
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="talent-panel page-padding">
        <span className="eyebrow">Open positions for open minds</span>
        <h2 className="display" data-reveal>
          Your next move
          <br />
          <span className="brand-heading-accent">could start here.</span>
        </h2>
        <p>
          Build great products, adapt and evolve, and collaborate as one. Our
          approach to learning, recognition, growth and leadership is grounded
          in helping people stay passionate about their work. Tell us what you
          love building and where you want to grow.
        </p>
        <Link className="button button-primary" href="/contact?topic=careers">
          Start a careers conversation
          <Arrow />
        </Link>
      </section>
    </div>
  );
}
