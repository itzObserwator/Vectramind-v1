"use client";
import { useState } from "react";
import Link from "next/link";
import type { ProductKey } from "@/content/products";
import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
import { SynapseCopy } from "./synapse-copy";
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
        {product === "firstpass" ? (
          <SynapseCopy compact="Patient journey">A connected suite</SynapseCopy>
        ) : (
          <SynapseCopy compact="Messaging channels">
            Your conversational ecosystem
          </SynapseCopy>
        )}
      </SectionLabel>
      <div className="module-layout">
        <div>
          <h2 className="display inner-section-title" data-reveal>
            {product === "firstpass" ? (
              <SynapseCopy compact="Choose your module.">
                One journey. Every touchpoint.
              </SynapseCopy>
            ) : (
              <SynapseCopy compact="Choose your channel.">
                Many channels. One connection.
              </SynapseCopy>
            )}
          </h2>
          <p className="section-description">
            {product === "firstpass" ? (
              <SynapseCopy compact="Explore nine connected parts of the patient journey.">
                Explore nine modules designed to work powerfully on their own
                and seamlessly together.
              </SynapseCopy>
            ) : (
              <SynapseCopy compact="Reach people on the channels they use.">
                Meet your customers where they are, with channels that work as
                part of a shared engagement strategy.
              </SynapseCopy>
            )}
          </p>
          <label className="synapse-channel-picker">
            <span className="sr-only">
              {product === "firstpass"
                ? "Choose a Firstpass module"
                : "Choose a Synapse channel"}
            </span>
            <select
              value={moduleIndex}
              onChange={(event) => setModuleIndex(Number(event.target.value))}
              aria-controls="module-panel"
            >
              {modules.map(([channel], index) => (
                <option key={channel} value={index}>
                  {channel}
                </option>
              ))}
            </select>
          </label>
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
          <Link
            href={`/support/?topic=${product}#contact-form`}
            className="text-link"
          >
            Explore with our team
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
