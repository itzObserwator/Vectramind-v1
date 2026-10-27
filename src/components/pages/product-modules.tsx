"use client";
import { useState } from "react";
import Link from "next/link";
import type { ProductKey } from "@/content/products";
import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
export function ProductModules({
  product,
  name,
  modules,
}: {
  product: ProductKey;
  name: string;
  modules: readonly (readonly [string, string])[];
}) {
  const [moduleIndex, setModuleIndex] = useState(0);
  const detail =
    product === "firstpass"
      ? {
          name: modules[moduleIndex][0],
          slug: modules[moduleIndex][0].replaceAll(" ", "-"),
        }
      : undefined;
  return (
    <section className="inner-section page-padding">
      <SectionLabel>
        {product === "firstpass"
          ? "A connected suite"
          : "Your conversational ecosystem"}
      </SectionLabel>
      <div className="module-layout">
        <div>
          <h2 className="display inner-section-title" data-reveal>
            {product === "firstpass"
              ? "One journey. Every touchpoint."
              : "Many channels. One connection."}
          </h2>
          <p className="section-description">
            {product === "firstpass"
              ? "Explore nine modules designed to work powerfully on their own and seamlessly together."
              : "Meet your customers where they are, with channels that work as part of a shared engagement strategy."}
          </p>
          <div
            className="module-buttons"
            role="tablist"
            aria-label={`${name} ${product === "firstpass" ? "modules" : "channels"}`}
          >
            {modules.map(([name], i) => (
              <button
                key={name}
                id={`module-tab-${i}`}
                role="tab"
                aria-selected={moduleIndex === i}
                aria-controls="module-panel"
                tabIndex={moduleIndex === i ? 0 : -1}
                onClick={() => setModuleIndex(i)}
                onKeyDown={(e) => {
                  if (
                    [
                      "ArrowRight",
                      "ArrowDown",
                      "ArrowLeft",
                      "ArrowUp",
                      "Home",
                      "End",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? modules.length - 1
                          : (i +
                              (e.key === "ArrowRight" || e.key === "ArrowDown"
                                ? 1
                                : -1) +
                              modules.length) %
                            modules.length;
                    setModuleIndex(next);
                    document.getElementById(`module-tab-${next}`)?.focus();
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div
          className="module-panel"
          id="module-panel"
          role="tabpanel"
          aria-labelledby={`module-tab-${moduleIndex}`}
          tabIndex={0}
        >
          <span className="module-numeral display" aria-hidden="true">
            {String(moduleIndex + 1).padStart(2, "0")}
          </span>
          <Mark />
          <h3>{modules[moduleIndex][0]}</h3>
          <p>{modules[moduleIndex][1]}</p>
          {detail && (
            <Link href={`/firstpass/${detail.slug}`} className="text-link">
              Explore {detail.name} <Arrow />
            </Link>
          )}
          <Link href={`/contact?topic=${product}`} className="text-link">
            Explore with our team
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
