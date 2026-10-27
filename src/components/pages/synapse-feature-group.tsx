import { FeatureGrid } from "./page-primitives";

export function SynapseFeatureGroup({
  label,
  title,
  compactTitle,
  summary,
  items,
}: {
  label: string;
  title: string;
  compactTitle: string;
  summary: string;
  items: readonly (readonly [string, string])[];
}) {
  return (
    <>
      <div className="synapse-copy-full synapse-feature-desktop">
        <FeatureGrid label={label} title={title} items={items} />
      </div>
      <section
        className="synapse-feature-mobile inner-section page-padding"
        aria-label={compactTitle}
      >
        <h2 className="display inner-section-title" data-reveal>
          {compactTitle}
        </h2>
        <p className="section-description" data-reveal>
          {summary}
        </p>
        <div className="synapse-feature-list">
          {items.map(([name, text]) => (
            <details key={name}>
              <summary>
                {name}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
