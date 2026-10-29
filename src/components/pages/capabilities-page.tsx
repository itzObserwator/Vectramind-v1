import Link from "next/link";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { CapabilitiesHero } from "./capabilities-hero";
import { ExperienceCapabilities } from "@/components/experience/capabilities";
import { OurPlatforms } from "@/components/experience/our-platforms";
import { ClientStrip } from "@/components/sections/client-strip";
import { SectionLabel } from "@/components/site-primitives";
import { expertise } from "@/content/capabilities";
import { capabilities } from "@/content/site";

export function CapabilitiesPage() {
  return (
    <>
      <CapabilitiesHero />
      <ClientStrip />
      <nav
        className="capabilities-jump page-padding"
        aria-label="Explore capabilities"
      >
        {expertise.map((item, index) => (
          <Link key={item.id} href={`#${item.id}`}>
            <span>0{index + 1}</span>
            <ResponsiveCopy compact={item.mobileLabel}>
              {capabilities[index].label}
            </ResponsiveCopy>
          </Link>
        ))}
      </nav>
      <ExperienceCapabilities
        exploreHref="#capability-services"
        exploreLabel="Explore our expertise"
      />
      <section
        id="capability-services"
        className="capabilities-services page-padding"
        aria-labelledby="capabilities-services-title"
      >
        <SectionLabel right="01 / Expertise with purpose">
          What we bring
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="capabilities-services-title" className="display" data-reveal>
            <ResponsiveCopy compact="Expertise that connects.">
              Three disciplines.
              <br />
              <span className="brand-heading-accent">
                One shared direction.
              </span>
            </ResponsiveCopy>
          </h2>
          <p>
            <ResponsiveCopy compact="Three disciplines, working together to move your business forward.">
              Start with your business, your people and the challenge ahead. We
              bring the right expertise together to turn possibility into
              practical progress.
            </ResponsiveCopy>
          </p>
        </div>
        <div className="capabilities-service-list">
          {expertise.map((item, index) => (
            <article
              id={item.id}
              key={item.id}
              className="capabilities-service"
            >
              <div className="capabilities-service-heading">
                <span className="eyebrow">
                  0{index + 1} / {item.title}
                </span>
                <h3 className="display" data-reveal>
                  <ResponsiveCopy compact={item.mobileLead}>
                    {item.lead}
                  </ResponsiveCopy>
                </h3>
                <Link
                  href={`/support/?topic=${item.id}#contact-form`}
                  className="button hero-platform-button"
                >
                  <ResponsiveCopy compact="Let’s talk">
                    Let’s explore your challenge
                  </ResponsiveCopy>
                </Link>
              </div>
              <div className="capabilities-service-content">
                <p>
                  <ResponsiveCopy compact={item.mobileText}>
                    {item.text}
                  </ResponsiveCopy>
                </p>
                <ul
                  className="capabilities-expertise-desktop"
                  aria-label={`${item.title} expertise`}
                >
                  {item.items.map((name, itemIndex) => (
                    <li key={name} data-reveal>
                      <span aria-hidden="true">0{itemIndex + 1}</span>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
                <details className="capabilities-expertise-mobile">
                  <summary>
                    Explore expertise<span aria-hidden="true">+</span>
                  </summary>
                  <p>{item.text}</p>
                  <ul aria-label={`${item.title} expertise`}>
                    {item.items.map((text) => {
                      const separator = text.indexOf(":");
                      return (
                        <li key={text}>
                          <strong>{text.slice(0, separator)}</strong>
                          <p>{text.slice(separator + 1).trim()}</p>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="capabilities-platforms">
        <OurPlatforms presentation="flow" />
      </div>
    </>
  );
}
