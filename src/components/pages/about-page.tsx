import Link from "next/link";
import { AboutHero } from "./about-hero";
import { SectionLabel } from "@/components/site-primitives";
import { FeatureGrid, IntroSection } from "./page-primitives";
import { People } from "@/components/sections/people";
import { MilestoneArchive } from "@/components/sections/milestone-archive";
import {
  reachContent,
  reachLocations,
  officeMapLinks,
} from "@/content/global-reach";

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
            ["18+", "years of company experience"],
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
              For over 18 years, Vectramind has helped organizations keep pace
              with change through AI-driven insights and connected systems. Our
              work spans automotive, aviation, banking, insurance, retail and
              healthcare. From Synapse to Firstpass, evolution continues to
              shape the experiences we build.
            </p>
          </div>
        </div>
      </section>
      <IntroSection
        label="Culture / Curious and consistent"
        title="Room to explore. The focus to deliver."
        text="Work, life and play meet in a culture shaped by curiosity, consistency and an anything-is-possible outlook. We draw on over 50 years of industry expertise to develop transformative solutions, with a focus on delivering on time and within budget. Experimentation and a shared pursuit of excellence help us keep improving."
      />
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
              href={officeMapLinks[office.name]}
              target="_blank"
              rel="noreferrer"
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
      <section className="inner-section page-padding published-partners">
        <SectionLabel>Our global partners</SectionLabel>
        <h2 className="display inner-section-title" data-reveal>
          Shared expertise.
          <br />
          <span className="brand-heading-accent">Greater possibilities.</span>
        </h2>
        <p className="section-description">
          Our partners help enable the platforms and connections our clients
          depend on. As technology and business needs evolve, we keep building
          on those relationships to support what comes next.
        </p>
        <img
          src="/images/global-partners.webp"
          data-reveal
          alt="Global partner and industry ecosystem logos published by Vectramind"
          width="802"
          height="28"
          loading="lazy"
          decoding="async"
        />
        <p className="published-partner-names">
          Crown Commercial Service · du · e&amp; · IBM · Meta · Microsoft ·
          Oracle Health
        </p>
      </section>
      <People includeFounder={false} sectionIndex="05" />
      <MilestoneArchive />
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
