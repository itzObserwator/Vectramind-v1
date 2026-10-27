import Link from "next/link";
import { ProductLandingHero } from "./product-landing-hero";
import { PlatformPreview } from "@/components/experience/platform-preview";
import { ClientStrip } from "@/components/sections/client-strip";
import { SectionLabel } from "@/components/site-primitives";
import { FaqList } from "./page-primitives";
import { ProductModules } from "./product-modules";
import { SynapseCopy as ResponsiveCopy } from "./synapse-copy";
import { SynapseFeatureGroup as ResponsiveFeatureGroup } from "./synapse-feature-group";
import { products } from "@/content/products";

export function FirstpassPage() {
  const data = products.firstpass;
  return (
    <div className="firstpass-overview">
      <ProductLandingHero product="firstpass" />
      <ClientStrip />
      <section
        className="product-landing-overview page-padding"
        aria-labelledby="firstpass-overview-title"
      >
        <SectionLabel right="01 / People before processes">
          Meet Firstpass
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="firstpass-overview-title" className="display" data-reveal>
            A simpler journey.
            <br />
            <span className="brand-heading-accent">At every step.</span>
          </h2>
          <p>
            <ResponsiveCopy compact="Connect the digital front door with care inside your facility.">
              {data.introText}
            </ResponsiveCopy>
          </p>
        </div>
        <div
          className="inner-hero-art product-landing-workspace firstpass-workspace"
          data-reveal
        >
          <PlatformPreview platform="firstpass" />
        </div>
        <div className="product-landing-workspace-caption">
          <div className="platform-card-tags">
            <span className="platform-category">Patient experience</span>
            <span className="platform-category">Healthcare</span>
            <span className="platform-category">Real-time</span>
          </div>
          <span>From the first hello to the next step.</span>
        </div>
        <div
          className="product-metrics product-landing-metrics"
          aria-label="Firstpass at a glance"
        >
          {data.metrics.map(([value, label], index) => (
            <div key={label}>
              <strong className="display">{value}</strong>
              <span>
                <ResponsiveCopy
                  compact={
                    ["Engagements / year", "Modules", "Care pillars"][index]
                  }
                >
                  {label}
                </ResponsiveCopy>
              </span>
            </div>
          ))}
        </div>
      </section>
      <ResponsiveFeatureGroup
        label="Real-time governance"
        title="Stay aware. Respond with confidence."
        compactTitle="See care in real time."
        summary="Keep teams informed about patient flow and facility operations."
        items={[
          [
            "Patient status, around the clock",
            "Stay informed about patient status, waiting times and transit times across the journey.",
          ],
          [
            "Real-time information",
            "Bring current operational data together so teams can make decisions with a clearer view of what is happening.",
          ],
          [
            "Facility oversight",
            "Use predictive insights to understand service demand and identify opportunities to save time and resources.",
          ],
          [
            "Resource optimization",
            "Connect patient touchpoints with data-backed insights to inform staff and facility-resource decisions.",
          ],
        ]}
      />
      <div
        id="platform-features"
        className="product-landing-feature-section firstpass-pillars"
      >
        <ResponsiveFeatureGroup
          label="02 / Four connected pillars"
          title="A better experience. For everyone."
          compactTitle="Better care, together."
          summary="Support patients, care teams and providers through one connected journey."
          items={data.features}
        />
      </div>
      <div id="firstpass-modules" className="product-landing-channel-section">
        <ProductModules
          product="firstpass"
          name={data.name}
          modules={data.modules}
        />
      </div>
      <section
        className="inner-section page-padding faq-section product-landing-faq"
        aria-labelledby="firstpass-faq-title"
      >
        <SectionLabel right="04 / A little more clarity">
          Your questions
        </SectionLabel>
        <div className="faq-layout">
          <div>
            <h2
              id="firstpass-faq-title"
              className="display inner-section-title"
              data-reveal
            >
              <ResponsiveCopy compact="Your questions, answered.">
                Care, connected.
                <br />
                <span className="brand-heading-accent">
                  Questions, answered.
                </span>
              </ResponsiveCopy>
            </h2>
            <p>
              Find the right starting point for your patients and your care
              teams.
            </p>
          </div>
          <FaqList items={data.faqs} />
        </div>
      </section>
      <section
        className="product-landing-next page-padding"
        aria-labelledby="firstpass-next-title"
      >
        <SectionLabel>Explore our platforms</SectionLabel>
        <div>
          <h2 id="firstpass-next-title" className="display" data-reveal>
            <ResponsiveCopy compact="Conversations, connected.">
              Every conversation.
              <br />
              <span className="brand-heading-accent">
                A meaningful connection.
              </span>
            </ResponsiveCopy>
          </h2>
          <p>
            <ResponsiveCopy compact="Explore Synapse for connected customer conversations.">
              Bring your customer conversations together with Synapse, our
              omnichannel engagement platform.
            </ResponsiveCopy>
          </p>
          <Link href="/synapse" className="button hero-platform-button">
            Explore Synapse
          </Link>
        </div>
      </section>
    </div>
  );
}
