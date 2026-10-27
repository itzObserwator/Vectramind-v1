import type { ReactNode } from "react";

export function SynapseCopy({
  children,
  compact,
}: {
  children: ReactNode;
  compact: string;
}) {
  return (
    <>
      <span className="synapse-copy-full">{children}</span>
      <span className="synapse-copy-compact">{compact}</span>
    </>
  );
}
