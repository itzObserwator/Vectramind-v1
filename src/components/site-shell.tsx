"use client";
import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MotionProvider } from "@/components/motion-provider";
import { ContactDialog } from "@/components/contact-dialog";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { CookieNotice } from "@/components/cookie-notice";

// The Next.js template remounts this shell on navigation, cleaning up every
// page's animations before the next page initializes its own scroll effects.
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <Dialog modal={false}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieNotice />
        <DialogTrigger asChild>
          <button className="floating-contact" aria-label="Contact Vectramind">
            <HugeiconsIcon icon={Message01Icon} size={24} strokeWidth={1.6} />
          </button>
        </DialogTrigger>
        <ContactDialog />
      </Dialog>
    </MotionProvider>
  );
}
