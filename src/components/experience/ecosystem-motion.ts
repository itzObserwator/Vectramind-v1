import gsap from "gsap";

// Sampled against the on-screen reference at 16–19.5s. Bases lead spheres;
// the near-left outer nodes resolve before the far/right half of the network.
export const ecosystemReveal = [
  { base: 0.18, sphere: 0.23 }, // Synapse: upper-left inner
  { base: 0.11, sphere: 0.16 }, // Firstpass: upper-right inner
  { base: 0.31, sphere: 0.37 }, // APIs: lower-right inner
  { base: 0.24, sphere: 0.29 }, // Insights: lower-left inner
  { base: 0.47, sphere: 0.55 }, // Far-left rear
  { base: 0.52, sphere: 0.61 }, // Far-right rear
  { base: 0.58, sphere: 0.68 }, // Right upper
  { base: 0.64, sphere: 0.75 }, // Right lower
  { base: 0.68, sphere: 0.8 }, // Right front
  { base: 0.43, sphere: 0.51 }, // Left front
  { base: 0.4, sphere: 0.48 }, // Left lower
  { base: 0.38, sphere: 0.46 }, // Left upper
];

export function createEcosystemEntrance(
  section: HTMLElement,
  desktop: boolean,
  compact = false,
) {
  const select = gsap.utils.selector(section);
  const scene = section.querySelector<HTMLElement>(".ecosystem-sticky")!;
  const ringDrawing = compact
    ? ".ecosystem-mobile-connections"
    : ".ecosystem-connections";
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate() {
      // Follow the rendered scrub clock, including reverse scroll.
      const p = this.time();
      section.dataset.phase =
        p < 0.16 ? "hub" : p < 0.44 ? "inner" : p < 0.93 ? "outer" : "complete";
    },
    scrollTrigger: {
      trigger: section,
      start: compact
        ? () => `top -${Math.max(0, scene.offsetHeight - innerHeight - 80)}`
        : desktop
          ? "top top"
          : "top 68%",
      end: compact
        ? () => `+=${Math.max(1200, Math.round(innerHeight * 1.8))}`
        : desktop
          ? "bottom bottom"
          : "+=750",
      pin: compact ? scene : undefined,
      scrub: compact ? true : desktop ? 0.65 : undefined,
      invalidateOnRefresh: true,
      toggleActions: desktop || compact ? undefined : "play none none reverse",
    },
  });
  // The reference settles vertically at the beginning. It does not keep
  // zooming the entire diagram while the outer nodes build.
  if (!compact)
    timeline.fromTo(
      select(".ecosystem-diagram"),
      { y: 90 },
      { y: 0, duration: 0.17, ease: "power2.out" },
      0,
    );
  timeline.fromTo(
    select(".ecosystem-hub"),
    { autoAlpha: 0, filter: "blur(4px)" },
    { autoAlpha: 1, filter: "blur(0px)", duration: 0.14 },
    0.015,
  );
  timeline.fromTo(
    select(".ecosystem-center-base"),
    { opacity: 0 },
    { opacity: 1, duration: 0.08 },
    0.035,
  );
  timeline.fromTo(
    select(".ecosystem-center-base .ecosystem-base-trace"),
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.15 },
    0.04,
  );
  if (desktop)
    timeline.fromTo(
      select(".ecosystem-heading"),
      { opacity: 1, y: 0 },
      { opacity: 0, y: -12, duration: 0.16 },
      0.14,
    );
  timeline.fromTo(
    select(".ecosystem-caption"),
    { opacity: 0 },
    { opacity: 1, duration: 0.12 },
    0.88,
  );

  ecosystemReveal.forEach(({ base, sphere }, index) => {
    timeline.fromTo(
      select(`[data-node-base="${index}"]`),
      { opacity: 0 },
      { opacity: 1, duration: 0.045 },
      base,
    );
    timeline.fromTo(
      select(`[data-node-base="${index}"] .ecosystem-base-trace`),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.15 },
      base,
    );
    timeline.fromTo(
      select(`[data-ecosystem-node="${index}"]`),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.12 },
      sphere,
    );
    timeline.fromTo(
      select(`[data-ecosystem-node="${index}"] .ecosystem-sphere`),
      { y: 14, yPercent: -40, filter: "blur(3px)" },
      {
        y: 0,
        yPercent: -40,
        filter: "blur(0px)",
        duration: 0.15,
        ease: "power2.out",
      },
      sphere,
    );
  });
  // Four separate arcs keep the reveal connected to its neighboring bases.
  // No diagonal cross is drawn through the central logo.
  const innerStart = [0.19, 0.3, 0.35, 0.25];
  const outerStart = [0.49, 0.62, 0.73, 0.54];
  [0, 1].forEach((ring) => {
    for (let arc = 0; arc < 4; arc++) {
      const start = (ring ? outerStart : innerStart)[arc];
      const target = select(`${ringDrawing} [data-orbit="${ring}-${arc}"]`);
      timeline.fromTo(
        target,
        { opacity: 0, strokeDashoffset: 1 },
        { opacity: 1, strokeDashoffset: 0, duration: ring ? 0.18 : 0.13 },
        start,
      );
    }
    timeline.fromTo(
      select(`${ringDrawing} .ecosystem-ring-${ring} .ecosystem-current`),
      { opacity: 0 },
      { opacity: 1, duration: 0.13 },
      ring ? 0.83 : 0.39,
    );
  });
  timeline.fromTo(
    select(`${ringDrawing} .ecosystem-bridge`),
    { opacity: 0, strokeDashoffset: 1 },
    { opacity: 1, strokeDashoffset: 0, duration: 0.15, stagger: 0.055 },
    0.6,
  );
  timeline.to({}, { duration: 0.1 }, 1);
  return timeline;
}
