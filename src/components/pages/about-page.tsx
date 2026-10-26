import Link from "next/link";
import { AboutHero } from "./about-hero";
import { SectionLabel } from "@/components/site-primitives";
import { FeatureGrid } from "./page-primitives";
import { People } from "@/components/sections/people";
import { reachContent, reachLocations } from "@/content/global-reach";

const values = [
  [
    "Intelligence",
    "We connect ideas, data and systems to create useful insights and thoughtful solutions.",
  ],
  [
    "Innovation",
    "Curiosity drives us to explore new possibilities, experiment and keep improving.",
  ],
  [
    "Human experiences",
    "We build around the people behind every interaction, journey and organization.",
  ],
] as const;

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <section
        id="our-story"
        className="about-story page-padding"
        aria-labelledby="about-story-title"
      >
        <SectionLabel right="01 / People behind the possibilities">
          Who we are
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="about-story-title" className="display" data-reveal>
            Many minds.
            <br />
            <span className="brand-heading-accent">One shared purpose.</span>
          </h2>
          <p>{reachContent.description}</p>
        </div>
        <figure className="about-team-photo">
          <div className="inner-hero-art about-team-image" data-reveal>
            <img
              src="/images/team.webp"
              alt="The Vectramind team gathered together"
              width="1359"
              height="512"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>Different perspectives. A shared direction.</figcaption>
        </figure>
        <div
          className="product-metrics product-landing-metrics"
          aria-label="Vectramind at a glance"
        >
          {[
            ["170+", "curious minds"],
            ["800+", "clients worldwide"],
            ["5", "locations, one global outlook"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong className="display">{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section
        className="about-purpose page-padding"
        aria-labelledby="about-purpose-title"
      >
        <SectionLabel right="02 / Our perspective">What moves us</SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="about-purpose-title" className="display" data-reveal>
            A world in motion.
            <br />
            <span className="brand-heading-accent">
              A purpose that stays human.
            </span>
          </h2>
          <p>
            We solve problems with carefully measured magnitude and precisely
            dialed direction, creating impact through intelligent platforms and
            connected experiences.
          </p>
        </div>
        <div className="about-purpose-grid">
          <article>
            <span className="eyebrow">01 / Reinvention</span>
            <h3 className="display" data-reveal>
              Adapt.
            </h3>
            <p>
              Adapting to change is as natural to us as breathing. We believe
              reinvention is a constant practice in everything we do in the
              pursuit of excellence.
            </p>
          </article>
          <article>
            <span className="eyebrow">02 / Possibility</span>
            <h3 className="display" data-reveal>
              Evolve.
            </h3>
            <p>
              We’re inspired by an unfolding future of connecting minds,
              integrated systems and insightful solutions, in a constant process
              of innovation and improvement.
            </p>
          </article>
        </div>
      </section>
      <section
        className="about-founder page-padding"
        aria-labelledby="about-founder-title"
      >
        <SectionLabel right="03 / A shared belief">
          From our founder
        </SectionLabel>
        <div className="about-founder-layout">
          <div className="founder-image about-founder-image" data-reveal>
            <img
              src="/images/ceo_about.webp"
              alt="Dr. Murali Krishna Vakalapudi, Founder and CEO of Vectramind"
              width="647"
              height="754"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <h2 id="about-founder-title" className="eyebrow">
              A message from our founder
            </h2>
            <blockquote>
              <p className="display" data-reveal>
                “I invite you to experience success. I invite you to experience
                Vectramind.”
              </p>
              <div className="about-founder-credit">
                <strong>Dr. Murali Krishna Vakalapudi, MBBS</strong>
                <span>Founder & CEO</span>
              </div>
            </blockquote>
            <p className="about-founder-note">
              Our AI-driven technology fuels data-driven insights and seamless
              integrations, empowering our customers to keep pace with change.
              From Synapse to Firstpass, the Vectramind story has always been
              defined by evolution.
            </p>
          </div>
        </div>
      </section>
      <div className="product-landing-feature-section about-values">
        <FeatureGrid
          label="04 / The way we work"
          title="Curious minds. Consistent purpose."
          items={values}
        />
      </div>
      <section
        className="about-locations page-padding"
        aria-labelledby="about-locations-title"
      >
        <SectionLabel right="5 offices / 4 countries">
          Global in outlook
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="about-locations-title" className="display" data-reveal>
            Many places.
            <br />
            <span className="brand-heading-accent">One direction.</span>
          </h2>
          <p>
            {reachContent.statement} Our team connects perspectives across five
            key locations.
          </p>
        </div>
        <div className="about-office-grid">
          {reachLocations.map((office, index) => (
            <Link
              key={office.name}
              href="/contact#locations"
              className="about-office"
              data-reveal
            >
              <span className="about-office-index" aria-hidden="true">
                0{index + 1}
                <i />
              </span>
              <strong>{office.name}</strong>
              <span>{office.country}</span>
            </Link>
          ))}
        </div>
      </section>
      <People includeFounder={false} sectionIndex="05" />
      <section
        className="product-landing-next about-careers page-padding"
        aria-labelledby="about-careers-title"
      >
        <SectionLabel>Life at Vectramind</SectionLabel>
        <div>
          <h2 id="about-careers-title" className="display" data-reveal>
            Your next chapter.
            <br />
            <span className="brand-heading-accent">Our shared future.</span>
          </h2>
          <p>
            Join curious minds who are turning big ideas into better human
            experiences.
          </p>
          <Link href="/careers" className="button hero-platform-button">
            Explore life at Vectramind
          </Link>
        </div>
      </section>
    </>
  );
}
