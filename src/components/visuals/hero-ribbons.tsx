import { readFileSync } from "node:fs";
import { join } from "node:path";
import trails from "./hero-pulse-paths.json";
import { trailPulseColors } from "./trail-pulses";

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
        dangerouslySetInnerHTML={{ __html: ribbons }}
      />
      <div className="hero-pulse-plane">
        {trails.flatMap((trail, index) =>
          [0, 1].map((side) => (
            <span
              key={`${index}-${side}`}
              className="hero-trail-pulse"
              style={{
                height: `${trail.width}px`,
                background: trailPulseColors[index % 4],
              }}
            />
          )),
        )}
      </div>
    </>
  );
}
