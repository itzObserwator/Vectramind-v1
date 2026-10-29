"use client";
import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MotionProvider } from "@/components/motion-provider";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { CookieNotice } from "@/components/cookie-notice";

const ContactDialog = dynamic(
  () =>
    import("@/components/contact-dialog").then(
      (module) => module.ContactDialog,
    ),
  {
    loading: () => (
      <DialogContent
        className="vectramind-chat"
        aria-busy="true"
        onInteractOutside={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => {
          // Replacing the loading shell is not a dialog close. Keep focus in
          // the ready form; a real close still restores the original trigger.
          if (
            document.querySelector(
              '.vectramind-chat[data-state="open"]:not([aria-busy])',
            )
          )
            event.preventDefault();
        }}
      >
        <div className="chat-header">
          <div>
            <img
              src="/images/vectramind-logo.svg"
              alt="Vectramind"
              width="205"
              height="30"
            />
            <DialogTitle className="chat-title">Help Desk</DialogTitle>
          </div>
        </div>
        <DialogDescription className="sr-only">
          Loading the Vectramind Help Desk.
        </DialogDescription>
        <div className="chat-conversation">
          <p role="status">Opening your conversation…</p>
        </div>
      </DialogContent>
    ),
  },
);

// The Next.js template remounts this shell on navigation, cleaning up every
// page's animations before the next page initializes its own scroll effects.
export function SiteShell({ children }: { children: ReactNode }) {
  const [contactLoaded, setContactLoaded] = useState(false);
  useEffect(() => {
    // Text fields match :focus-visible even after a mouse click. Track Tab
    // navigation so forms keep a keyboard ring without adding click outlines.
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab")
        document.documentElement.removeAttribute("data-pointer-focus");
    };
    const pointer = () =>
      document.documentElement.setAttribute("data-pointer-focus", "");
    document.addEventListener("keydown", keyboard, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", keyboard, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);
  return (
    <MotionProvider>
      <Dialog
        modal={false}
        onOpenChange={(open) => {
          if (open) setContactLoaded(true);
        }}
      >
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
        {contactLoaded && <ContactDialog />}
      </Dialog>
    </MotionProvider>
  );
}
