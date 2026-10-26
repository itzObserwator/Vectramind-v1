"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Arrow, Mark } from "@/components/site-primitives";
import { ecosystemNodes, experience } from "@/content/experience";
import { EcosystemOrbits, orbitPosition } from "./ecosystem-orbits";
import { EcosystemAtmosphere } from "./ecosystem-atmosphere";
import { BrandAccentText } from "@/components/brand-accent-text";

import { useNearViewport } from "@/components/use-near-viewport";

export function ConnectedEcosystem() {
  const root = useRef<HTMLElement>(null);
  const ready = useNearViewport(root);
  const [active, setActive] = useState<number | null>(null);
  useDeferredAnimation(ready, () =>
    import("./ecosystem-animation").then(
      ({ mount }) =>
        () =>
          mount(root),
    ),
  );

  const detailPosition =
    active === null
      ? null
      : orbitPosition(
          ecosystemNodes[active].ring,
          ecosystemNodes[active].angle,
        );
  return (
    <section
      id="ecosystem"
      className="experience-ecosystem orbital-ecosystem"
      ref={root}
      aria-labelledby="ecosystem-title"
    >
      <div className="ecosystem-sticky">
        <header className="ecosystem-heading">
          <span className="ecosystem-eyebrow">Connected by design</span>
          <h2 id="ecosystem-title">
            <BrandAccentText
              text={experience.network.title.replace("\n", " ")}
            />
          </h2>
        </header>
        <div
          className="ecosystem-diagram"
          onMouseLeave={() => setActive(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setActive(null);
          }}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setActive(null);
          }}
        >
          <EcosystemOrbits />
          <div
            className="ecosystem-hub"
            role="img"
            aria-label="Vectramind, at the center of your connected experience"
          >
            <Mark />
          </div>
          {ecosystemNodes.map((node, index) => {
            const { x, y } = orbitPosition(node.ring, node.angle);
            return (
              <button
                key={node.label}
                className={`ecosystem-node ecosystem-color-${node.color}`}
                data-ecosystem-node={index}
                style={
                  {
                    left: `${x / 10}%`,
                    top: `${(y / 650) * 100}%`,
                    zIndex: Math.round(y),
                  } as CSSProperties
                }
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                aria-label={
                  "shortLabel" in node
                    ? `${node.shortLabel}: ${node.label}`
                    : node.label
                }
                aria-pressed={active === index}
                aria-describedby={
                  active === index ? "ecosystem-detail" : undefined
                }
              >
                <span className="ecosystem-sphere">
                  <span>
                    {"shortLabel" in node ? node.shortLabel : node.label}
                  </span>
                </span>
              </button>
            );
          })}
          {active !== null && (
            <div
              className="ecosystem-detail"
              id="ecosystem-detail"
              role="status"
              data-side={detailPosition!.x < 500 ? "left" : "right"}
              style={{
                left: `${detailPosition!.x / 10}%`,
                top: `${detailPosition!.y / 6.5}%`,
              }}
            >
              <span>{ecosystemNodes[active].label}</span>
              <p>{ecosystemNodes[active].detail}</p>
            </div>
          )}
        </div>
        <div className="ecosystem-mist" aria-hidden="true" />
        <EcosystemAtmosphere />
        <footer className="ecosystem-caption">
          <p>{experience.network.text}</p>
          <Link href="#products" className="text-link">
            Find your platform <Arrow />
          </Link>
        </footer>
      </div>
    </section>
  );
}
