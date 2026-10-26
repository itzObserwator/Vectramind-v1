import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import trails from "./hero-pulse-paths.json";
import {
  heroPulseColors,
  trailPulseDelay,
  trailPulseDuration,
  trailPulseLength,
  trailPulseOpacity,
} from "./trail-pulses";

// These trusted, repository-owned vectors are embedded during static export.
// Keep their geometry out of the client bundle and avoid a hero image request.
function ribbonMarkup(name: string) {
  return readFileSync(join(process.cwd(), "public/images", name), "utf8")
    .replace(/^<svg\b[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
}
const underlay = ribbonMarkup("hero-ribbon-underlay.svg");
const ribbons = ribbonMarkup("hero-ribbon-base.svg");

export function HeroRibbons() {
  return (
    <>
      <svg
        className="hero-ribbon-underlay"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: underlay }}
      />
      <svg
        className="hero-ribbon-main"
        viewBox="0 0 1000 1000"
        fill="none"
        aria-hidden="true"
      >
        <g dangerouslySetInnerHTML={{ __html: ribbons }} />
        {trails.flatMap((trail, index) =>
          [trail.left, trail.right].map((d, side) => (
            <path
              key={`${index}-${side}`}
              className="hero-trail-pulse"
              d={d}
              pathLength="1"
              stroke={heroPulseColors[index % 4]}
              strokeWidth={trail.width}
              strokeLinecap="round"
              strokeDasharray={`${trailPulseLength * 2} ${1 - trailPulseLength * 2}`}
              opacity={trailPulseOpacity}
              style={
                {
                  "--hero-pulse-duration": `${trailPulseDuration(index) / 2}s`,
                  "--hero-pulse-delay": `${trailPulseDelay(index) - 1.6}s`,
                } as CSSProperties
              }
            />
          )),
        )}
      </svg>
    </>
  );
}
