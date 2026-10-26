import Link from "next/link";
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
            {capabilities[index].label}
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
            Three disciplines.
            <br />
            <span className="brand-heading-accent">One shared direction.</span>
          </h2>
          <p>
            Start with your business, your people and the challenge ahead. We
            bring the right expertise together to turn possibility into
            practical progress.
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
                  {item.lead}
                </h3>
                <Link
                  href={`/contact?topic=${item.id}`}
                  className="button hero-platform-button"
                >
                  Let’s explore your challenge
                </Link>
              </div>
              <div className="capabilities-service-content">
                <p>{item.text}</p>
                <ul aria-label={`${item.title} expertise`}>
                  {item.items.map((name, itemIndex) => (
                    <li key={name} data-reveal>
                      <span aria-hidden="true">0{itemIndex + 1}</span>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
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
