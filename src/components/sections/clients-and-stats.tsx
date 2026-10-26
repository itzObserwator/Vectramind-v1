"use client";

import { SectionLabel } from "@/components/site-primitives";
import { ClientLogoGrid } from "@/components/sections/client-logo-grid";
export function ClientsAndStats() {
  return (
    <section
      id="clients"
      className="clients-section clients-editorial section-space"
      aria-labelledby="clients-title"
    >
      <div className="client-section-inner">
        <SectionLabel right="05 / Evolving together">Our clients</SectionLabel>
        <div className="client-editorial-heading">
          <h2 id="clients-title" data-reveal>
            Great companies.
            <br />
            <span className="brand-heading-accent">Lasting connections.</span>
          </h2>
          <p>
            Our customized solutions respond to the diverse needs of more than
            800 clients around the world.
          </p>
        </div>
        <ClientLogoGrid />
        <div className="client-principles">
          {[
            [
              "Technology that moves with you",
              "Adaptable platforms built to respond to real business challenges and create better human experiences.",
            ],
            [
              "A connected perspective",
              "Break down silos between systems, teams and touchpoints with seamless integrations.",
            ],
            [
              "Your goals, our direction",
              "Customized solutions shaped around your organization, its people and its potential.",
            ],
            [
              "Responsible innovation",
              "AI guided by a commitment to users, businesses and the trust behind every interaction.",
            ],
          ].map(([title, text]) => (
            <div key={title} data-reveal>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
