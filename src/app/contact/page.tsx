import type { Metadata } from "next";
import { ContactRedirect } from "@/components/pages/contact-redirect";
export const metadata: Metadata = {
  title: "Contact form — Vectramind Support",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <ContactRedirect />;
}
