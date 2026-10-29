import Link from "next/link";
import { products, type ProductKey } from "@/content/products";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import {
  PageHero,
  IntroSection,
  FeatureGrid,
  FaqList,
  PageCta,
} from "./page-primitives";
import { PlatformPreview } from "@/components/experience/platform-preview";
import { ProductModules } from "./product-modules";
import { CaseStudies } from "@/components/sections/case-studies";

function ProductArt({ product }: { product: ProductKey }) {
  return (
    <div className="product-hero-preview">
      <div className="product-preview-label">
        <span>{products[product].name}</span>
        <span>
          {product === "synapse" ? "Customer engagement" : "Patient experience"}
        </span>
      </div>
      <PlatformPreview platform={product} />
      <p>Human experiences, connected.</p>
    </div>
  );
}
export function ProductPage({ product }: { product: ProductKey }) {
  const data = products[product];
  return (
    <div className={`inner-page product-page ${product}-page`}>
      <PageHero
        eyebrow={data.category}
        title={data.headline}
        description={data.description}
        cta={`Request a ${data.name} demo`}
        href={`/support/?topic=${product}#contact-form`}
      >
        <ProductArt product={product} />
      </PageHero>
      <section
        className="product-metrics page-padding"
        aria-label={`${data.name} at a glance`}
      >
        {data.metrics.map(([value, label]) => (
          <div key={label}>
            <strong className="display">{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <IntroSection
        label={`Meet ${data.name}`}
        title={data.intro}
        text={data.introText}
      >
        <Link className="text-link" href="#platform-features">
          Explore the platform
          <Arrow />
        </Link>
      </IntroSection>
      <div id="platform-features">
        <FeatureGrid
          label={
            product === "firstpass"
              ? "Four connected pillars"
              : "Built for meaningful engagement"
          }
          title={
            product === "firstpass"
              ? "A better experience. For everyone."
              : "Your conversations. Without the complexity."
          }
          items={data.features}
        />
      </div>
      <ProductModules
        product={product}
        name={data.name}
        modules={data.modules}
      />
      {product === "synapse" && <CaseStudies />}
      <section className="inner-section page-padding faq-section">
        <SectionLabel>A little more clarity</SectionLabel>
        <div className="faq-layout">
          <h2 className="display inner-section-title" data-reveal>
            Your questions.
            <br />
            Answered.
          </h2>
          <FaqList items={data.faqs} />
        </div>
      </section>
      <section className="related-platform page-padding">
        <span className="eyebrow">Explore more of Vectramind</span>
        <Link href={product === "synapse" ? "/firstpass" : "/synapse"}>
          <span>
            {product === "synapse"
              ? "Better patient journeys with Firstpass."
              : "Meaningful customer conversations with Synapse."}
          </span>
          <Arrow />
        </Link>
      </section>
      <PageCta
        title={
          product === "synapse"
            ? "Make your next conversation count."
            : "Put people first. At every step."
        }
        label={`Let’s talk ${data.name}`}
        href={`/support/?topic=${product}#contact-form`}
      />
    </div>
  );
}
