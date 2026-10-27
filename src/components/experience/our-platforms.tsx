"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useRef } from "react";
import Link from "next/link";
import { Arrow } from "@/components/site-primitives";
import { platformCards } from "@/content/platforms";
import { PlatformPreview } from "./platform-preview";

import { useNearViewport } from "@/components/use-near-viewport";

export function OurPlatforms({
  presentation = "scroll",
}: { presentation?: "scroll" | "flow" } = {}) {
  const root = useRef<HTMLElement>(null);
  const ready = useNearViewport(root);
  useDeferredAnimation(ready && presentation === "scroll", () =>
    import("./our-platforms-animation").then(
      ({ mount }) =>
        () =>
          mount(root),
    ),
  );

  return (
    <section
      id="products"
      className={`experience-work reference-platforms${presentation === "flow" ? " platforms-flow" : ""}`}
      ref={root}
      aria-labelledby="platforms-title"
    >
      <div className="platforms-sticky">
        <header className="platforms-section-label">
          <span>03 / Built around you</span>
          <h2 id="platforms-title">Our platforms</h2>
        </header>
        <div className="experience-work-grid platforms-grid">
          {platformCards.map((platform) => (
            <article
              className="experience-work-card platform-card"
              key={platform.slug}
            >
              <Link
                href={platform.href}
                className={`platform-image-link work-${platform.slug}`}
                data-reveal={presentation === "flow" ? "" : undefined}
              >
                <span className="sr-only">Explore {platform.name}</span>
                <PlatformPreview platform={platform.slug} />
                <span className="platform-preview-cursor" aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <div className="platform-card-tags">
                {platform.tags.map((tag) => (
                  <span className="platform-category" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3>
                <span className="platform-copy-full">{platform.title}</span>
                <span className="platform-copy-compact">
                  {platform.mobileTitle}
                </span>
              </h3>
              <p className="platform-card-description">
                <span className="platform-copy-full">
                  {platform.description}
                </span>
                <span className="platform-copy-compact">
                  {platform.mobileDescription}
                </span>
              </p>
              <Link href={platform.href} className="platform-card-cta">
                Explore {platform.name} <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
