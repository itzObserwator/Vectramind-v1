// Emphasise the closing thought without changing copy or forcing a new line.
export function BrandAccentText({ text }: { text: string }) {
  const split = text.lastIndexOf(". ");
  if (split < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, split + 2)}
      <span className="brand-heading-accent">{text.slice(split + 2)}</span>
    </>
  );
}
