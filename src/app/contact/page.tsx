import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-pages";
import { DesktopOnlyPage } from "@/components/pages/desktop-only-page";
export const metadata: Metadata = {
  title: "Contact Vectramind \u2014 Vectramind",
  description:
    "Talk to Vectramind about Synapse, Firstpass, custom solutions, careers or product support.",
};
export default function Page() {
  return (
    <DesktopOnlyPage page="contact">
      <ContactPage />
    </DesktopOnlyPage>
  );
}
