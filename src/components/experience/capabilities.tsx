"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { capabilities } from "@/content/site";
import { Arrow } from "@/components/site-primitives";
import { CapabilityVisual } from "./capability-visual";
import Link from "next/link";
import { useNearViewport } from "@/components/use-near-viewport";
import { CapabilityContent } from "./capability-content";

const CapabilityCopy = dynamic(() => import("./capability-copy"));
export function ExperienceCapabilities({
  exploreHref = "/capabilities",
  exploreLabel = "Explore the possibilities",
}: { exploreHref?: string; exploreLabel?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const ready = useNearViewport(root);
  useDeferredAnimation(ready, () =>
    import("./capabilities-animation").then(
      ({ mount }) =>
        () =>
          mount(root, setActive),
    ),
  );
  function select(index: number) {
    const i = Math.max(0, Math.min(2, index));
    if (!root.current) return;
    const mobileStart = window.matchMedia("(max-width: 900px)").matches
      ? Math.max(740 - innerHeight, 0)
      : 0;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
      window.scrollTo({
        top:
          root.current.getBoundingClientRect().top +
          scrollY +
          mobileStart +
          (root.current.offsetHeight - innerHeight - mobileStart) *
            [0.12, 0.5, 0.87][i],
        behavior: "smooth",
      });
    else setActive(i);
  }
  return (
    <section
      id="capabilities"
      className="experience-capability-track capability-track reference-capabilities"
      ref={root}
      aria-labelledby="capability-heading"
    >
      <div className="experience-capability-sticky experience-padding">
        <h2 id="capability-heading" className="capability-main-title">
          Transform. Connect.
          <br />
          <span className="brand-heading-accent">Evolve.</span>
        </h2>
        <div className="experience-capability-scene">
          <div className="experience-capability-copy capability-copy">
            <div className="capability-number-window" aria-hidden="true">
              <div
                className="capability-number-mobile"
                style={{ transform: `translateY(${active * -33.333333}%)` }}
              >
                {[1, 2, 3].map((i) => (
                  <span className="experience-capability-number" key={i}>
                    0{i}
                  </span>
                ))}
              </div>
              <div className="capability-number-reel" aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <span className="experience-capability-number" key={i}>
                    0{i}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="capability-description-window"
              aria-live="polite"
              aria-atomic="true"
            >
              {ready ? (
                <CapabilityCopy active={active} />
              ) : (
                <div>
                  <CapabilityContent active={active} />
                </div>
              )}
            </div>
            <div
              className="capability-navigation"
              role="group"
              aria-label="Browse capabilities"
            >
              <button
                aria-label="Previous capability"
                disabled={active === 0}
                onClick={() => select(active - 1)}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </button>
              <button
                aria-label="Next capability"
                disabled={active === 2}
                onClick={() => select(active + 1)}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </button>
              <span>
                <span className="capability-navigation-label">
                  {capabilities[active].label}
                </span>
                <span
                  className="capability-navigation-count"
                  aria-hidden="true"
                >
                  0{active + 1} / 03
                </span>
                <span className="sr-only">, {active + 1} of 3</span>
              </span>
            </div>
          </div>
          <div className="experience-capability-art">
            {ready && <CapabilityVisual active={active} />}
            <div className="capability-atmosphere" aria-hidden="true" />
          </div>
        </div>
        <Link className="text-link capability-explore" href={exploreHref}>
          {exploreLabel} <Arrow />
        </Link>
      </div>
    </section>
  );
}
