"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function HeroEnergy({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const start = () => {
      import("./hero-pulses-runtime").then(({ mount }) => {
        if (!disposed && root.current) cleanup = mount(root.current);
      });
    };
    // Artwork and copy are already rendered. Let initial hydration finish
    // before downloading and starting this decorative enhancement.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start, { timeout: 500 })
        : window.setTimeout(start, 60);
    return () => {
      disposed = true;
      if (typeof window.cancelIdleCallback === "function")
        window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      cleanup?.();
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
