import "./page-styles";
import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import { Button } from "@/components/ui/button";
import { BrandAccentText } from "@/components/brand-accent-text";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  cta,
  href = "/contact",
  image,
}: {
  eyebrow: string;
  title: readonly string[];
  description: string;
  children?: ReactNode;
  cta?: string;
  href?: string;
  image?: string;
}) {
  return (
    <section
      className={`inner-hero page-padding ${image ? "inner-hero-photo" : ""}`}
      id="top"
    >
      <div className="inner-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{eyebrow}</span>
      </div>
      <div className="inner-hero-grid">
        <div>
          <span className="eyebrow inner-eyebrow">{eyebrow}</span>
          <span className="page-brand-colours" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <h1 className="display">
            {title.map((line) => (
              <span className="inner-title-mask" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p>{description}</p>
          {cta && (
            <Button asChild>
              <Link href={href}>
                {cta}
                <Arrow />
              </Link>
            </Button>
          )}
        </div>
        <div className="inner-hero-art" data-reveal>
          {image ? (
            <figure className="page-hero-photo">
              <img
                src={`/images/${image}`}
                alt={
                  eyebrow === "Meet Vectramind"
                    ? "The Vectramind team"
                    : "Life at Vectramind"
                }
                fetchPriority="high"
              />
              <figcaption>{eyebrow}</figcaption>
            </figure>
          ) : (
            children || <PageConnectionArt />
          )}
        </div>
      </div>
      <div className="inner-hero-bottom">
        <span>Intelligence. Innovation. Technology.</span>
        <span>With you in mind. ↓</span>
      </div>
    </section>
  );
}
function PageConnectionArt() {
  return (
    <div className="page-connection-art" aria-hidden="true">
      <svg viewBox="0 0 500 360" fill="none">
        {Array.from({ length: 18 }, (_, i) => (
          <path
            key={i}
            d={`M -40 ${35 + i * 9} C 120 ${40 + i * 9}, 130 ${300 - i * 6}, 270 ${230 - i * 2} S 390 ${80 + i * 4}, 540 ${100 + i * 6}`}
            stroke="#b8bec8"
            strokeOpacity=".45"
          />
        ))}
        {["#2873b9", "#e22526", "#f2bb0b", "#318a3e"].map((colour, i) => (
          <circle
            key={colour}
            cx={160 + i * 56}
            cy={177 + Math.sin(i) * 25}
            r="4"
            fill={colour}
          />
        ))}
      </svg>
      <span>People. Platforms. Possibilities.</span>
    </div>
  );
}
export function IntroSection({
  label,
  title,
  text,
  children,
}: {
  label: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="inner-section page-padding">
      <SectionLabel>{label}</SectionLabel>
      <div className="inner-intro">
        <h2 className="display" data-reveal>
          <BrandAccentText text={title} />
        </h2>
        <div>
          <p data-reveal>{text}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
export function FeatureGrid({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: readonly (readonly [string, string])[];
}) {
  return (
    <section className="inner-section inner-panel page-padding">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="display inner-section-title" data-reveal>
        <BrandAccentText text={title} />
      </h2>
      <div className="inner-feature-grid">
        {items.map(([name, text], i) => (
          <article key={name} data-reveal>
            <span className="eyebrow">
              0{i + 1} <span>↗</span>
            </span>
            <h3>{name}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export { FaqList } from "./faq-list";
export function PageCta({
  title = "Your next chapter starts here.",
  text = "Let’s bring your goals, your people and your systems into a shared direction.",
  label = "Start a conversation",
  href = "/contact",
}: {
  title?: string;
  text?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="inner-cta page-padding">
      <span className="eyebrow">A shared direction</span>
      <h2 className="display" data-reveal>
        {title}
      </h2>
      <div>
        <p>{text}</p>
        <Button asChild>
          <Link href={href}>
            {label}
            <Arrow />
          </Link>
        </Button>
      </div>
    </section>
  );
}
