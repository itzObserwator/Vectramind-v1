"use client";

import { useEffect, useState } from "react";

const colours = ["#2873b9", "#318a3e", "#e22526", "#f2bb0b"];

// Split each original curve at the logo so both halves feed inward.
const connections = colours.flatMap((colour, index) => {
  const leftY = 35 + index * 72;
  const rightY = 285 - index * 72;
  return [
    {
      origin: "left",
      colour,
      path: `M -40 ${leftY} C 160 ${leftY}, 210 160, 400 160`,
    },
    {
      origin: "right",
      colour,
      path: `M 840 ${rightY} C 650 ${rightY}, 590 160, 400 160`,
    },
  ];
});

function pulseMask(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320"><path d="${path}" fill="none" stroke="white" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function SitePreloader() {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set<number>();
    let disposed = false;
    let finished = false;
    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.add(timer);
    };
    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      setPhase("leaving");
      window.dispatchEvent(new Event("vectramind:intro-complete"));
      later(() => setPhase("done"), reduced ? 0 : 280);
    };
    // Keep the requested five-second presentation independent of asset timing.
    // CSS has the same deadline, including when hydration is delayed.
    later(finish, 5000);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") finish();
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      disposed = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", keyboard);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="site-preloader"
      data-phase={phase}
      role="status"
      aria-label="Loading Vectramind"
    >
      <div className="preloader-composition">
        <svg
          className="preloader-connections"
          viewBox="0 0 800 320"
          fill="none"
          aria-hidden="true"
        >
          {connections.map(({ origin, path, colour }) => {
            return (
              <g key={`${origin}-${colour}`}>
                <path
                  className="preloader-rail"
                  d={path}
                  stroke="#dce4ee"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>
        {connections.map(({ origin, path, colour }, index) => (
          <div
            key={`${origin}-${colour}`}
            className="preloader-pulse-track"
            data-origin={origin}
            aria-hidden="true"
            style={{ maskImage: pulseMask(path) }}
          >
            <span
              className="preloader-pulse"
              style={{ background: colour, animationDelay: `${index * -0.4}s` }}
            />
          </div>
        ))}
        <div className="preloader-brand">
          <img
            src="/images/vectramind-logo.svg"
            alt=""
            width="260"
            height="60"
            fetchPriority="high"
          />
          <p>With you in mind.</p>
        </div>
        <div className="preloader-colours" aria-hidden="true">
          {colours.map((colour) => (
            <span key={colour} style={{ background: colour }} />
          ))}
        </div>
      </div>
    </div>
  );
}
