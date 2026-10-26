import Link from "next/link";
import { SynapseHero } from "./synapse-hero";
import { PlatformPreview } from "@/components/experience/platform-preview";
import { ClientStrip } from "@/components/sections/client-strip";
import { SectionLabel, Arrow } from "@/components/site-primitives";
import { FeatureGrid, FaqList } from "./page-primitives";
import { ProductModules } from "./product-modules";
import { CaseStudies } from "@/components/sections/case-studies";
import { products } from "@/content/products";

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
          <p>{data.introText}</p>
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
          {data.metrics.map(([value, label]) => (
            <div key={label}>
              <strong className="display">{value}</strong>
              <span>{label}</span>
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
        <FeatureGrid
          label="02 / Built around your business"
          title="Good conversations. Thoughtfully connected."
          items={data.features}
        />
      </div>
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
              A clearer view.
              <br />
              <span className="brand-heading-accent">Before we begin.</span>
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
            Better journeys.
            <br />
            <span className="brand-heading-accent">Healthier experiences.</span>
          </h2>
          <p>
            Bring that same connected thinking to healthcare. Discover
            Firstpass, our patient experience platform.
          </p>
          <Link href="/firstpass" className="button hero-platform-button">
            Explore Firstpass <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
