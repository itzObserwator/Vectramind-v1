import "./page-styles";
import Link from "next/link";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { HeroRibbons } from "@/components/visuals/hero-ribbons";
import { products, type ProductKey } from "@/content/products";
import { SynapseCopy } from "./synapse-copy";

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
        <p>
          {firstpass ? (
            <SynapseCopy compact="Connect appointments, patient flow and care teams.">
              {data.description}
            </SynapseCopy>
          ) : (
            <SynapseCopy compact="Connect customer conversations across every channel.">
              {data.description}
            </SynapseCopy>
          )}
        </p>
        <div className="product-landing-actions">
          <Link
            href={`/support/?topic=${product}#contact-form`}
            className="button button-primary"
          >
            {firstpass ? (
              <SynapseCopy compact="Request a demo">
                Request a {data.name} demo
              </SynapseCopy>
            ) : (
              <SynapseCopy compact="Request a demo">
                Request a Synapse demo
              </SynapseCopy>
            )}
          </Link>
          <Link
            href={firstpass ? "#firstpass-modules" : "#synapse-channels"}
            className="button hero-platform-button"
          >
            {firstpass ? (
              <SynapseCopy compact="Explore modules">
                Explore the platform
              </SynapseCopy>
            ) : (
              <SynapseCopy compact="Explore channels">
                Explore the channels
              </SynapseCopy>
            )}
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
