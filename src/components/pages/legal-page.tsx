import Link from "next/link";
import terms from "@/content/imported/termsofuse.json";
import privacy from "@/content/imported/privacypolicy.json";
import { PageHero } from "./page-primitives";

// These are sanitized, checked-in source documents, never arbitrary user HTML.
export function LegalPage({ type }: { type: "terms" | "privacy" }) {
  const document = type === "terms" ? terms : privacy;
  let index = 0;
  const headings: { id: string; text: string }[] = [];
  const body = document.html.replace(
    /<h([3-6])>([\s\S]*?)<\/h\1>/g,
    (_, level: string, text: string) => {
      const id = `policy-section-${index++}`;
      headings.push({ id, text: text.replace(/<[^>]+>/g, "").trim() });
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
  );
  return (
    <div className="inner-page legal-page">
      <PageHero
        eyebrow="The details behind the connection"
        title={
          type === "terms"
            ? ["Terms of use."]
            : ["Your privacy.", "Our responsibility."]
        }
        description={
          type === "terms"
            ? "The terms governing Vectramind, Synapse and Firstpass services, reproduced from the current Vectramind website."
            : "Vectramind’s published website and application privacy policies, brought together in one place."
        }
      />
      <section className="legal-layout page-padding">
        <aside>
          <span className="eyebrow">In this document</span>
          {headings.map((h) => (
            <a href={`#${h.id}`} key={h.id}>
              {h.text}
            </a>
          ))}
          <Link href="/support/#contact-form">
            Questions? Contact our team ↗
          </Link>
        </aside>
        <div
          className="legal-document prose-document"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </section>
    </div>
  );
}
