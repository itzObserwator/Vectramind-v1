import Link from "next/link";
import { PageHero, FeatureGrid, PageCta } from "./page-primitives";
import { PlatformPreview } from "@/components/experience/platform-preview";
import { SectionLabel } from "@/components/site-primitives";
import {
  firstpassModules,
  type FirstpassModule,
} from "@/content/firstpass-modules";

export function FirstpassModulePage({ content }: { content: FirstpassModule }) {
  return (
    <div className="firstpass-module-page">
      <PageHero
        eyebrow={`Firstpass / ${content.name}`}
        title={[content.name, content.headline]}
        description={content.introduction}
        cta="Explore with our team"
        href="/support?topic=firstpass#support-request"
      >
        <PlatformPreview platform="firstpass" />
      </PageHero>
      <nav
        className="module-detail-navigation page-padding"
        aria-label="Firstpass modules"
      >
        <Link href="/firstpass#firstpass-modules">All Firstpass modules</Link>
        {firstpassModules.map((item) => (
          <Link
            key={item.slug}
            href={`/firstpass/${item.slug}`}
            aria-current={item.slug === content.slug ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      {content.sections.map((section, index) => (
        <FeatureGrid
          key={section.title}
          label={`${String(index + 1).padStart(2, "0")} / ${content.name}`}
          title={section.title}
          items={section.items}
        />
      ))}
      <section className="module-detail-suite page-padding inner-section">
        <SectionLabel>One suite. An end-to-end journey.</SectionLabel>
        <h2 className="display inner-section-title" data-reveal>
          Powerful individually.
          <br />
          <span className="brand-heading-accent">Connected by design.</span>
        </h2>
        <p className="section-description">
          From scheduling and verification to flow, engagement, governance and
          feedback, Firstpass modules work as part of one patient experience.
          Explore the suite to choose the touchpoints your facility needs.
        </p>
        <Link
          href="/firstpass#firstpass-modules"
          className="button hero-platform-button"
        >
          Explore the Firstpass suite
        </Link>
      </section>
      <PageCta
        title="Build a more connected patient journey."
        text={`Discover how ${content.name} can work with your facility’s teams and systems.`}
        label="Request a Firstpass demo"
        href="/support?topic=firstpass#support-request"
      />
    </div>
  );
}
