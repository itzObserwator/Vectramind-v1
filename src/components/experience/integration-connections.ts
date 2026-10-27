import gsap from "gsap";

/** Clockwise: route draws from the hub, its pulse arrives, then its chip unfolds.
 * Chip opacity stays at one throughout; the reveal is a physical expansion
 * from the connection port. Every sequence reverses on the parent scroll clock.
 */
export function addIntegrationConnections(
  timeline: gsap.core.Timeline,
  scene: Element,
) {
  const order = [0, 2, 3, 1, 4];
  const cards = scene.querySelectorAll<SVGGElement>(".integration-chip-body");
  order.forEach((index, step) => {
    const start = 3.18 + step * 0.16;
    const connection = scene.querySelector(`[data-connection="${index}"]`)!;
    const card = cards[index];
    const origin = index === 4 ? "405 480" : index < 2 ? "145 45" : "0 45";
    // Normalized pathLength values need fractions; CSS pixel rounding would
    // otherwise turn the draw into a 1 → 0 snap.
    timeline.fromTo(
      connection.querySelectorAll(
        ".integration-route, .integration-route-mask",
      ),
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        autoRound: false,
        duration: 0.085,
        ease: "power1.inOut",
      },
      start,
    );
    timeline.fromTo(
      connection.querySelector(".integration-leading-pulse"),
      { opacity: 1, strokeDashoffset: 0.03 },
      {
        opacity: 1,
        strokeDashoffset: -0.97,
        autoRound: false,
        duration: 0.085,
        ease: "power1.inOut",
      },
      start,
    );
    timeline.to(
      connection.querySelector(".integration-leading-pulse"),
      { opacity: 0, duration: 0.025 },
      start + 0.085,
    );
    timeline.fromTo(
      card,
      {
        scaleX: index === 4 ? 0.7 : 0,
        scaleY: index === 4 ? 0 : 0.7,
        svgOrigin: origin,
      },
      { scaleX: 1, scaleY: 1, duration: 0.085, ease: "power2.out" },
      start + 0.095,
    );
  });
}
