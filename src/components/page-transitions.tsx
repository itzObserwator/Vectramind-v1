"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "covering" | "waiting" | "revealing";
type Journey = {
  origin: string;
  href: string;
  covered: boolean;
  revealAfter: number;
  ready: boolean;
  revealScheduled?: boolean;
};
const path = (value: string) => value.replace(/\/$/, "") || "/";

export function PageTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const previous = useRef(pathname);
  const journey = useRef<Journey | null>(null);
  const timers = useRef(new Set<number>());
  const [phase, setPhase] = useState<Phase>("idle");
  const later = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);
  const clear = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current.clear();
    document.documentElement.removeAttribute("data-page-arriving");
    document
      .querySelectorAll("[data-page-image-reveal]")
      .forEach((element) => element.removeAttribute("data-page-image-reveal"));
  }, []);
  const navigate = useCallback(() => {
    const current = journey.current;
    if (!current || current.covered) return;
    current.covered = true;
    current.revealAfter = performance.now() + 300;
    setPhase("waiting");
    startTransition(() => router.push(current.href));
  }, [router]);
  const uncover = useCallback(() => {
    journey.current = null;
    setPhase("idle");
  }, []);
  const reveal = useCallback(() => {
    const current = journey.current;
    if (!current?.covered || !current.ready || current.revealScheduled) return;
    current.revealScheduled = true;
    // The recording holds a complete white frame before the curtain lifts.
    later(
      () => {
        if (journey.current !== current) return;
        // Only the photographs/previews at the destination get this entrance;
        // the rest keep their existing scroll-driven reveals.
        document
          .querySelectorAll<HTMLElement>(
            "main .inner-hero-art, main .page-hero-photo, main .platform-image-link, main .people-image, main .insight-image, main .article-cover, main .career-photo",
          )
          .forEach((element) => {
            const bounds = element.getBoundingClientRect();
            if (
              bounds.bottom > 0 &&
              bounds.top < innerHeight + 80 &&
              !element.parentElement?.closest("[data-page-image-reveal]")
            )
              element.setAttribute("data-page-image-reveal", "");
          });
        document.documentElement.setAttribute("data-page-arriving", "");
        setPhase("revealing");
        // Animation events keep routing synchronized with the real rendered
        // curtain, even on a busy device; timers remain a bounded fallback.
        later(() => {
          if (journey.current === current) uncover();
        }, 1000);
        later(() => {
          document.documentElement.removeAttribute("data-page-arriving");
          document
            .querySelectorAll("[data-page-image-reveal]")
            .forEach((element) =>
              element.removeAttribute("data-page-image-reveal"),
            );
        }, 1450);
      },
      Math.max(32, current.revealAfter - performance.now()),
    );
  }, [later, uncover]);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    if (from === pathname) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clear();
      journey.current = null;
      setPhase("idle");
      return;
    }
    if (!journey.current) {
      clear();
      journey.current = {
        origin: from,
        href: location.href,
        covered: true,
        revealAfter: performance.now(),
        ready: true,
      };
      setPhase("waiting");
    } else journey.current.ready = true;
    reveal();
  }, [pathname, clear, reveal]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      const destination = new URL(link.href, location.href);
      if (
        destination.origin !== location.origin ||
        path(destination.pathname) === path(location.pathname)
      )
        return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      // Next Link still runs its user onClick, including closing the menu,
      // but leaves routing to this handoff when defaultPrevented is true.
      if (journey.current) return;
      clear();
      const current: Journey = {
        origin: previous.current,
        href: destination.pathname + destination.search + destination.hash,
        covered: false,
        revealAfter: 0,
        ready: false,
      };
      journey.current = current;
      setPhase("covering");
      later(() => {
        if (journey.current === current) navigate();
      }, 1000);
      // Unavailable client routes fall back to normal document navigation.
      later(() => {
        if (journey.current === current && !current.ready)
          location.assign(current.href);
      }, 8000);
    };
    const history = () => {
      if (
        path(location.pathname) === path(previous.current) ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      clear();
      journey.current = {
        origin: previous.current,
        href: location.href,
        covered: true,
        revealAfter: performance.now(),
        ready: false,
      };
      setPhase("waiting");
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", history, true);
    return () => {
      clear();
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", history, true);
    };
  }, [navigate, clear, later]);

  return (
    <>
      {children}
      <div
        className="page-curtain"
        data-phase={phase}
        aria-hidden="true"
        onAnimationEnd={(event) => {
          if (event.animationName === "page-cover") navigate();
          if (event.animationName === "page-uncover") uncover();
        }}
      />
      <span className="sr-only" role="status">
        {phase === "covering" || phase === "waiting" ? "Loading page" : ""}
      </span>
    </>
  );
}
