"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Arrow, ContactButton } from "@/components/site-primitives";

const navigation = [
  ["Synapse", "/synapse"],
  ["Firstpass", "/firstpass"],
  ["Capabilities", "/capabilities"],
  ["About us", "/about"],
  ["Support", "/support"],
];
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const prefetchProduct = (href: string) => {
    if (
      [
        "/synapse",
        "/firstpass",
        "/capabilities",
        "/about",
        "/support",
      ].includes(href)
    )
      router.prefetch(`${href}/`);
  };
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    // Mobile links are hidden until the menu opens. Warm product pages before
    // the tap, instead of waiting for the link's viewport-prefetch scheduler.
    router.prefetch("/synapse/");
    router.prefetch("/firstpass/");
    router.prefetch("/capabilities/");
    router.prefetch("/about/");
    router.prefetch("/support/");
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    const nativeScroll = document.body.getAttribute("data-lenis-prevent");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-lenis-prevent", "");
    document.body.setAttribute("data-navigation-open", "");
    const links = Array.from(
      header.current?.querySelectorAll<HTMLAnchorElement>(".mobile-nav a") ||
        [],
    );
    const targets = [menuButton.current, ...links].filter(
      (element): element is HTMLButtonElement | HTMLAnchorElement => !!element,
    );
    links[0]?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus({ preventScroll: true });
      } else if (event.key === "Tab") {
        const index = targets.indexOf(
          document.activeElement as HTMLButtonElement | HTMLAnchorElement,
        );
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          targets.at(-1)?.focus();
        } else if (
          !event.shiftKey &&
          (index < 0 || index === targets.length - 1)
        ) {
          event.preventDefault();
          targets[0]?.focus();
        }
      }
    };
    const desktop = matchMedia("(min-width: 901px)");
    const resized = () => {
      if (desktop.matches) setMenu(false);
    };
    document.addEventListener("keydown", keyboard);
    desktop.addEventListener("change", resized);
    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.body.removeAttribute("data-navigation-open");
      if (nativeScroll === null)
        document.body.removeAttribute("data-lenis-prevent");
      else document.body.setAttribute("data-lenis-prevent", nativeScroll);
      document.removeEventListener("keydown", keyboard);
      desktop.removeEventListener("change", resized);
    };
  }, [menu, router]);
  return (
    <header
      ref={header}
      className={`header ${scrolled ? "header-scrolled" : ""} ${pathname !== "/" ? "header-inner" : "header-home"}`}
    >
      <Link
        href="/"
        aria-label="Vectramind home"
        className="logo"
        prefetch={pathname === "/" ? false : null}
      >
        <img
          src="/images/vectramind-logo.svg"
          alt="Vectramind"
          fetchPriority="high"
          width="205"
          height="40"
        />
      </Link>
      <nav aria-label="Main navigation" className="desktop-nav">
        {navigation.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            onPointerEnter={() => prefetchProduct(href)}
            onFocus={() => prefetchProduct(href)}
            aria-current={
              pathname === href || pathname === href + "/" ? "page" : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <div
        className="header-actions"
        onClick={(event) => {
          if ((event.target as Element).closest(".button")) setMenu(false);
        }}
      >
        <ContactButton>Consultation</ContactButton>
        <button
          ref={menuButton}
          className="menu-button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          <HugeiconsIcon icon={menu ? Cancel01Icon : Menu01Icon} size={24} />
        </button>
      </div>
      {menu && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ...navigation,
            ["Our clients", "/#clients"],
            ["Insights", "/blog"],
            ["Careers", "/careers"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onPointerEnter={() => prefetchProduct(href)}
              onFocus={() => prefetchProduct(href)}
              onClick={() => setMenu(false)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
              <Arrow />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
