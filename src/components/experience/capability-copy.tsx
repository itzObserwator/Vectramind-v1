"use client";
import { CapabilityContent } from "./capability-content";
export default function CapabilityCopy({ active }: { active: number }) {
  return (
    <div key={active} className="capability-copy-enter">
      <CapabilityContent active={active} />
    </div>
  );
}
