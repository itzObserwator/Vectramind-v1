import { capabilities } from "@/content/site";

export function CapabilityContent({ active }: { active: number }) {
  const capability = capabilities[active];
  return (
    <>
      <p className="experience-kicker">{capability.detail}</p>
      <h3>
        <span className="capability-copy-full">{capability.title}</span>
        <span className="capability-copy-compact">
          {capability.mobileTitle}
        </span>
      </h3>
      <p className="experience-capability-text">
        <span className="capability-copy-full">{capability.text}</span>
        <span className="capability-copy-compact">{capability.mobileText}</span>
      </p>
    </>
  );
}
