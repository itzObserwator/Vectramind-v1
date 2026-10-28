"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { afterSiteIntro } from "../after-site-intro";

export function HeroEnergy({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let introduced = false;
    const sync = () => {
      element.dataset.active = String(
        introduced && visible && !document.hidden && !reduced.matches,
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    const cancel = afterSiteIntro(() => {
      introduced = true;
      sync();
    });
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      cancel();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div
      ref={root}
      className="hero-signal hero-energy signal-field"
      aria-hidden="true"
      data-active="false"
    >
      {children}
    </div>
  );
}
