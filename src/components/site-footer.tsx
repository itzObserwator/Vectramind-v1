"use client";
import { useDeferredAnimation } from "@/components/use-deferred-animation";
import { useNearViewport } from "@/components/use-near-viewport";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  PinLocation01Icon,
  Linkedin02Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { Arrow } from "@/components/site-primitives";
import { FooterFlow } from "@/components/visuals/footer-flow";
import { FooterJoin } from "@/components/footer-join";

function subscribeMotion(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const navigation = [
  ["About us", "/about"],
  ["Support", "/support"],
  ["Capabilities", "/capabilities"],
  ["Synapse", "/synapse"],
  ["Firstpass", "/firstpass"],
  ["Insights", "/blog"],
];
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "60px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  const ready = useNearViewport(root);
  useDeferredAnimation(ready, () =>
    import("./site-footer-animation").then(
      ({ mount }) =>
        () =>
          mount(root),
    ),
  );
  return (
    <footer
      ref={root}
      className="reference-footer"
      aria-labelledby="footer-contact-title"
      data-ready={ready}
      data-animate={visible && !hidden && !reduced}
    >
      <FooterFlow />
      <div className="footer-reference-content">
        <header className="footer-contact-heading">
          <h2 id="footer-contact-title">
            Get in <span className="brand-heading-accent">touch.</span>
          </h2>
          <p>We're here for your questions, ideas and what comes next.</p>
        </header>
        <div className="footer-contacts">
          <article className="footer-contact">
            <span className="footer-contact-icon">
              <HugeiconsIcon icon={Mail01Icon} size={21} strokeWidth={1.4} />
            </span>
            <h3>Email</h3>
            <p>
              Start a conversation. We'd love to hear what you have in mind.
            </p>
            <a href="mailto:support@vectramind.com">
              support@vectramind.com <Arrow />
            </a>
          </article>
          <article className="footer-contact">
            <span className="footer-contact-icon">
              <HugeiconsIcon icon={Call02Icon} size={21} strokeWidth={1.4} />
            </span>
            <h3>Phone</h3>
            <p>Talk through your next idea with the people who can help.</p>
            <Link href="/contact">
              Request a call <Arrow />
            </Link>
          </article>
          <article className="footer-contact">
            <span className="footer-contact-icon">
              <HugeiconsIcon
                icon={PinLocation01Icon}
                size={21}
                strokeWidth={1.4}
              />
            </span>
            <h3>Office</h3>
            <p>
              Dubai, Hyderabad, Riyadh,
              <br />
              Tanuku and Vancouver.
            </p>
            <Link href="/contact#locations">
              Explore our offices <Arrow />
            </Link>
          </article>
        </div>
        <div className="footer-reference-lower">
          <div className="footer-reference-brand">
            <Link href="/" aria-label="Vectramind home">
              <img
                src="/images/vectramind-logo.svg"
                alt="Vectramind"
                width="205"
                height="30"
              />
            </Link>
            <nav aria-label="Footer navigation">
              {navigation.map(([title, href]) => (
                <Link key={href} href={href}>
                  {title}
                </Link>
              ))}
            </nav>
          </div>
          <FooterJoin />
        </div>
        <div className="footer-reference-legal">
          <div>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms-of-use">Terms of use</Link>
          </div>
          <span>© {new Date().getFullYear()} Vectramind Corporation.</span>
          <div>
            <a
              href="https://www.linkedin.com/company/vectramind/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <HugeiconsIcon
                icon={Linkedin02Icon}
                size={20}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
            <a
              href="https://x.com/vectramind"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="X"
            >
              <HugeiconsIcon
                icon={NewTwitterIcon}
                size={20}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: reduced ? "instant" : "smooth",
                });
              }}
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
