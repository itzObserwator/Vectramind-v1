import { ContactButton } from "@/components/site-primitives";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";
import { experience } from "@/content/experience";

export function ExperienceHero() {
  return (
    <section
      id="top"
      className="experience-hero"
      aria-label="Vectramind introduction"
    >
      <HeroEnergy>
        <HeroRibbons />
      </HeroEnergy>
      <div className="experience-hero-content">
        <p className="experience-kicker">
          <span />
          {experience.hero.eyebrow}
        </p>
        <h1 aria-label="Vectramind — Transforming human experiences">
          {experience.hero.title.map((line, i) => (
            <span className="experience-title-mask" key={line}>
              <span
                className="hero-title-enter"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="experience-hero-description">
          <span className="hero-description-full">
            {experience.hero.description}
          </span>
          <span className="hero-description-compact">
            {experience.hero.mobileDescription}
          </span>
        </p>
        <div className="experience-hero-actions">
          <ContactButton showArrow={false}>
            <span className="hero-cta-full">Let’s build what’s next</span>
            <span className="hero-cta-compact">Let’s talk</span>
          </ContactButton>
          <a
            href="#products"
            className="button hero-platform-button"
            aria-label="Explore our platforms"
          >
            <span className="hero-cta-full">Explore our platforms</span>
            <span className="hero-cta-compact">Our platforms</span>
          </a>
        </div>
      </div>
      <div className="experience-hero-foot">
        <div className="experience-pillars">
          {experience.hero.pillars.map((item) => (
            <span key={item}>
              <i />
              {item}
            </span>
          ))}
        </div>
        <p>Built for people. Ready for possibility.</p>
      </div>
    </section>
  );
}
