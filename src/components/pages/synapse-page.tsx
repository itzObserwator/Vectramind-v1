import Link from "next/link";
import { SynapseHero } from "./synapse-hero";
import { PlatformPreview } from "@/components/experience/platform-preview";
import { ClientStrip } from "@/components/sections/client-strip";
import { SectionLabel, Arrow } from "@/components/site-primitives";
import { FaqList } from "./page-primitives";
import { SynapseFeatureGroup } from "./synapse-feature-group";
import { SynapseCopy } from "./synapse-copy";
import { ProductModules } from "./product-modules";
import { CaseStudies } from "@/components/sections/case-studies";
import { products } from "@/content/products";
import {
  synapseDetailSections,
  synapseIntegrations,
} from "@/content/synapse-details";

export function SynapsePage() {
  const data = products.synapse;
  return (
    <>
      <SynapseHero />
      <ClientStrip />
      <section
        className="product-landing-overview page-padding"
        aria-labelledby="synapse-overview-title"
      >
        <SectionLabel right="01 / One connected experience">
          Meet Synapse
        </SectionLabel>
        <div className="product-landing-section-heading">
          <h2 id="synapse-overview-title" className="display" data-reveal>
            Every channel.
            <br />
            <span className="brand-heading-accent">One conversation.</span>
          </h2>
          <p>
            <SynapseCopy compact="Bring messaging and customer context together for more relevant, two-way conversations.">
              {data.introText}
            </SynapseCopy>
          </p>
        </div>
        <div className="inner-hero-art product-landing-workspace" data-reveal>
          <PlatformPreview platform="synapse" />
        </div>
        <div className="product-landing-workspace-caption">
          <div className="platform-card-tags">
            <span className="platform-category">Customer engagement</span>
            <span className="platform-category">Omnichannel</span>
            <span className="platform-category">CPaaS</span>
          </div>
          <span>A shared view of every conversation.</span>
        </div>
        <div
          className="product-metrics product-landing-metrics"
          aria-label="Synapse at a glance"
        >
          {data.metrics.map(([value, label], index) => (
            <div key={label}>
              <strong className="display">{value}</strong>
              <span>
                <SynapseCopy
                  compact={
                    ["Clients", "Notifications / year", "Connections"][index]
                  }
                >
                  {label}
                </SynapseCopy>
              </span>
            </div>
          ))}
        </div>
      </section>
      <div id="synapse-channels" className="product-landing-channel-section">
        <ProductModules
          product="synapse"
          name={data.name}
          modules={data.modules}
        />
      </div>
      <div id="platform-features" className="product-landing-feature-section">
        <SynapseFeatureGroup
          label="02 / Built around your business"
          title="Good conversations. Thoughtfully connected."
          compactTitle="Built for your business."
          summary="Send at scale, manage campaigns and keep your teams in control."
          items={data.features}
        />
      </div>
      {synapseDetailSections.map((section) => (
        <div
          id={section.id}
          key={section.id}
          className="product-landing-feature-section"
        >
          <SynapseFeatureGroup
            label={section.label}
            title={section.title}
            compactTitle={section.compactTitle}
            summary={section.summary}
            items={section.items}
          />
        </div>
      ))}
      <section className="inner-section page-padding published-integrations">
        <SectionLabel>
          <SynapseCopy compact="Integrations">
            Expand your conversational ecosystem
          </SynapseCopy>
        </SectionLabel>
        <h2 className="display inner-section-title" data-reveal>
          <span className="synapse-copy-full">
            Your systems.
            <br />
            <span className="brand-heading-accent">
              Still part of the conversation.
            </span>
          </span>
          <span className="synapse-copy-compact">Connect your systems.</span>
        </h2>
        <p className="section-description">
          <SynapseCopy compact="Connect through APIs, databases and HL7.">
            Connect core applications through APIs, databases and healthcare
            interfaces. Vectramind’s published integration ecosystem includes{" "}
            {synapseIntegrations.join(", ")}.
          </SynapseCopy>
        </p>
        <img
          src="/images/integration-options.webp"
          data-reveal
          alt="Cerner, Cloverleaf, InterSystems, Rhapsody and TIBCO integration ecosystem"
          width="925"
          height="64"
          loading="lazy"
          decoding="async"
        />
        <ul
          className="synapse-integration-list"
          aria-label="Integration ecosystem"
        >
          {synapseIntegrations.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>
      <div className="product-landing-proof">
        <CaseStudies />
      </div>
      <section
        className="inner-section page-padding faq-section product-landing-faq"
        aria-labelledby="synapse-faq-title"
      >
        <SectionLabel right="04 / A little more clarity">
          Your questions
        </SectionLabel>
        <div className="faq-layout">
          <div>
            <h2
              id="synapse-faq-title"
              className="display inner-section-title"
              data-reveal
            >
              <span className="synapse-copy-full">
                A clearer view.
                <br />
                <span className="brand-heading-accent">Before we begin.</span>
              </span>
              <span className="synapse-copy-compact">
                Your questions, answered.
              </span>
            </h2>
            <p>Find your starting point. We’ll help you connect the rest.</p>
          </div>
          <FaqList items={data.faqs} />
        </div>
      </section>
      <section
        className="product-landing-next page-padding"
        aria-labelledby="synapse-next-title"
      >
        <SectionLabel>Explore our platforms</SectionLabel>
        <div>
          <h2 id="synapse-next-title" className="display">
            <span className="synapse-copy-full">
              Better journeys.
              <br />
              <span className="brand-heading-accent">
                Healthier experiences.
              </span>
            </span>
            <span className="synapse-copy-compact">Care, connected.</span>
          </h2>
          <p>
            <SynapseCopy compact="Explore Firstpass for connected patient care.">
              Bring that same connected thinking to healthcare. Discover
              Firstpass, our patient experience platform.
            </SynapseCopy>
          </p>
          <Link href="/firstpass" className="button hero-platform-button">
            Explore Firstpass <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
