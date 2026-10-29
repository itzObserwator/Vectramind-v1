"use client";
import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { SectionLabel, Mark, Arrow } from "@/components/site-primitives";
import { SynapseCopy } from "@/components/pages/synapse-copy";

// Published anonymized examples from Vectramind's Synapse page.
const cases = [
  {
    type: "Healthcare",
    title: "A more connected patient journey.",
    compactTitle: "Fewer missed appointments.",
    compactText:
      "DB and HL7 integration enabled reminders 24 hours before appointments in a published hospital deployment.",
    text: "Synapse integrated with a hospital’s Intersystems EMR using DB and HL7 messaging. Appointment reminders sent 24 hours in advance helped the hospital achieve a 10% reduction in no-shows.",
    result: "10%",
    label: "reduction in appointment no-shows",
  },
  {
    type: "Financial services",
    title: "Built for the pace of every transaction.",
    compactTitle: "Messaging at speed.",
    compactText:
      "An on-premise deployment connected exchange services while meeting throughput and security requirements.",
    text: "An on-premise Synapse deployment helped a financial exchange connect its services, process messages quickly and maintain throughput while meeting its security requirements.",
    result: "500",
    label: "SMS per second in the published deployment",
  },
  {
    type: "Government",
    title: "One platform. Many public services.",
    compactTitle: "Connected public services.",
    compactText:
      "One platform connected parking, fines and other public-service communications.",
    text: "A government organization connected communications across parking management, smart fines, building, environmental and planning services using Synapse’s integration capabilities.",
    result: "One",
    label: "connected messaging platform",
  },
];
export function CaseStudies() {
  const [active, setActive] = useState(0);
  return (
    <section className="case-studies page-padding section-space">
      <SectionLabel right="Published Synapse success stories">
        Connections with impact
      </SectionLabel>
      <h2 className="synapse-case-heading display">Published deployments.</h2>
      <div className="case-layout">
        <div className="case-summary">
          <span className="eyebrow">{cases[active].type}</span>
          <strong className="display">{cases[active].result}</strong>
          <p>{cases[active].label}</p>
          <div className="slider-controls">
            <button
              aria-label="Previous success story"
              onClick={() =>
                setActive((i) => (i + cases.length - 1) % cases.length)
              }
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                className="rotate-180"
              />
            </button>
            <button
              aria-label="Next success story"
              onClick={() => setActive((i) => (i + 1) % cases.length)}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
            </button>
            <span className="case-counter">0{active + 1} / 03</span>
          </div>
        </div>
        <div className="case-story" aria-live="polite">
          <Mark />
          <div key={active} className="case-story-content">
            <h3>
              <SynapseCopy compact={cases[active].compactTitle}>
                {cases[active].title}
              </SynapseCopy>
            </h3>
            <p>
              <SynapseCopy compact={cases[active].compactText}>
                {cases[active].text}
              </SynapseCopy>
            </p>
            <details className="synapse-case-detail">
              <summary>Read the case</summary>
              <p>{cases[active].text}</p>
            </details>
            <Link
              href="/support/?topic=synapse#contact-form"
              className="text-link"
            >
              Discuss your use case
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
