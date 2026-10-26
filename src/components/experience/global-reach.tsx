"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useRef, useState, useId } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { ReachGlobe } from "@/components/visuals/reach-globe";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import { statistics } from "@/content/site";
import { reachContent, reachLocations } from "@/content/global-reach";
import { useNearViewport } from "@/components/use-near-viewport";
function MetricLaurel() {
  return (
    <img
      className="reach-metric-laurel"
      src="/images/metric-laurel.svg"
      alt=""
      width="110"
      height="70"
      loading="lazy"
    />
  );
}
export function GlobalReach() {
  const root = useRef<HTMLElement>(null);
  const ready = useNearViewport(root);
  const [selectedOffice, setSelectedOffice] = useState(0);
  const officePrefix = useId();
  const office = reachLocations[selectedOffice];
  function selectOffice(index: number, focus = false) {
    const next = (index + reachLocations.length) % reachLocations.length;
    setSelectedOffice(next);
    if (focus) document.getElementById(`${officePrefix}-${next}`)?.focus();
  }
  useDeferredAnimation(ready, () =>
    import("./global-reach-animation").then(
      ({ mount }) =>
        () =>
          mount(root),
    ),
  );
  return (
    <section
      id="global-reach"
      className="reference-reach"
      ref={root}
      aria-labelledby="reach-title"
    >
      <div className="reach-sticky">
        <div className="reach-section-label">
          <SectionLabel right="5 offices / 4 countries">
            {reachContent.title}
          </SectionLabel>
        </div>
        <div className="reach-overview">
          <div className="reach-copy">
            <h2 id="reach-title">
              Global reach.
              <br />
              <span className="brand-heading-accent">Human touch.</span>
            </h2>
            <p>{reachContent.description}</p>
            <Link href="/about" className="reach-about-link">
              Meet Vectramind <Arrow />
            </Link>
          </div>
        </div>
        <div className="reach-stage">
          <div className="reach-map-panel">
            <div className="reach-globe-scene">
              <ReachGlobe selectedOffice={selectedOffice} />
            </div>
          </div>
          <div className="reach-offices">
            <span className="reach-eyebrow">EXPLORE OUR OFFICES</span>
            <div
              className="reach-office-list"
              role="tablist"
              aria-label="Explore our offices"
              aria-orientation="vertical"
            >
              {reachLocations.map((location, index) => (
                <button
                  key={location.name}
                  id={`${officePrefix}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedOffice === index}
                  aria-controls={`${officePrefix}-panel`}
                  tabIndex={selectedOffice === index ? 0 : -1}
                  onClick={() => selectOffice(index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight" || event.key === "ArrowDown"
                        ? selectedOffice + 1
                        : event.key === "ArrowLeft" || event.key === "ArrowUp"
                          ? selectedOffice - 1
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? reachLocations.length - 1
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      selectOffice(next, true);
                    }
                  }}
                >
                  <span className="reach-office-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="reach-office-name">
                    {location.name}
                    <small>{location.country}</small>
                  </span>
                  <Arrow />
                </button>
              ))}
            </div>
            <div
              className="reach-office-detail"
              id={`${officePrefix}-panel`}
              role="tabpanel"
              aria-labelledby={`${officePrefix}-${selectedOffice}`}
              tabIndex={0}
            >
              <div aria-live="polite" aria-atomic="true">
                <h3 className="sr-only">{office.name}</h3>
                <p>{office.country}</p>
              </div>
              <div className="reach-office-controls">
                <span>{String(selectedOffice + 1).padStart(2, "0")} / 05</span>
                <button
                  type="button"
                  aria-label="Previous office"
                  onClick={() => selectOffice(selectedOffice - 1)}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="reach-arrow-previous"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Next office"
                  onClick={() => selectOffice(selectedOffice + 1)}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="reach-statistics">
          <Link href="/about" className="reach-highlight">
            <strong className="reach-client-count">800+</strong>
            <span>
              Clients worldwide <Arrow />
            </span>
          </Link>
          <div className="reach-metrics">
            {[statistics[1], statistics[2], statistics[4]].map((stat) => (
              <div className="reach-metric" key={stat.value}>
                <MetricLaurel />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
