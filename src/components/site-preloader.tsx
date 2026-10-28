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
          {connections.map(({ origin, path, colour }, index) => {
            return (
              <g key={`${origin}-${colour}`} data-origin={origin}>
                <path
                  d={path}
                  stroke="#dce4ee"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="preloader-pulse"
                  d={path}
                  stroke={colour}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  pathLength="1"
                  style={{ animationDelay: `${index * -0.4}s` }}
                />
              </g>
            );
          })}
        </svg>
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
