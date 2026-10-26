import "./page-styles";
import Link from "next/link";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";
import { products, type ProductKey } from "@/content/products";

export function ProductLandingHero({ product }: { product: ProductKey }) {
  const data = products[product];
  const firstpass = product === "firstpass";
  const title = firstpass ? ["Your care.", "Connected."] : data.headline;
  return (
    <section
      id="top"
      className="inner-hero experience-hero product-landing-hero"
      aria-labelledby={`${product}-title`}
    >
      <HeroEnergy>
        <HeroRibbons />
      </HeroEnergy>
      <div className="product-landing-hero-content">
        <img
          className={`product-landing-brand ${product}-brand`}
          src={`/images/${product}.svg`}
          alt={firstpass ? "Firstpass" : "Synapse CPaaS"}
          width="180"
          height="48"
        />
        <span className="eyebrow">
          {firstpass
            ? "Patient experience. Connected."
            : "Customer engagement. Connected."}
        </span>
        <h1 id={`${product}-title`} className="display">
          {title[0]}
          <br />
          <span className="brand-heading-accent">{title[1]}</span>
        </h1>
        <p>{data.description}</p>
        <div className="product-landing-actions">
          <Link
            href={`/contact?topic=${product}`}
            className="button button-primary"
          >
            Request a {data.name} demo
          </Link>
          <Link
            href={firstpass ? "#firstpass-modules" : "#synapse-channels"}
            className="button hero-platform-button"
          >
            {firstpass ? "Explore the platform" : "Explore the channels"}
          </Link>
        </div>
      </div>
      <div className="product-landing-hero-caption" aria-hidden="true">
        <span>
          {firstpass
            ? "One journey. Every touchpoint."
            : "One platform. Every channel."}
        </span>
        <span>With you in mind.</span>
      </div>
    </section>
  );
}
