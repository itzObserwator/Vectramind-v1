import gsap from "gsap";
import { createCapabilityRenderer } from "./capability-geometry";
import { addIntegrationConnections } from "./integration-connections";

/** Button-selected mobile chapters use the same geometry as desktop, without
 * pinning a tall scroll track. Only the visible chapter animates. */
export function mountMobileCapabilities(section: HTMLElement) {
  const svg = section.querySelector<SVGSVGElement>(".capability-visual");
  if (!svg) return;
  const stages = Array.from(
    svg.querySelectorAll<SVGGElement>(".capability-visual-stage"),
  );
  const render = createCapabilityRenderer(section);
  let selected = Number(svg.dataset.active || 0);
  let visible = false;
  let phase = 0;
  let elapsed = 0;
  let request = 0;
  let previous = 0;
  let disposed = false;

  const flows = stages.map((stage, index) =>
    gsap.fromTo(
      stage.querySelectorAll(".capability-signal"),
      { strokeDashoffset: 0 },
      {
        strokeDashoffset: (_: number, target: SVGPathElement) =>
          (target.classList.contains("integration-return") ? 2 : -2) *
          (target.getAttribute("stroke-dasharray") || "0")
            .split(/[ ,]+/)
            .reduce((sum, value) => sum + Number(value), 0),
        autoRound: false,
        duration: index === 2 ? 5.8 : 6.4,
        repeat: -1,
        ease: "none",
        paused: true,
      },
    ),
  );
  const mists = stages.map((stage, index) =>
    gsap.fromTo(
      stage.querySelector(
        ".capability-intelligence-mist, .capability-connected-mist, .capability-integration-mist",
      ),
      { x: -9, y: 10 },
      {
        x: 9,
        y: -8,
        duration: 10 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      },
    ),
  );
  const integration = gsap.timeline({ paused: true });
  integration.fromTo(
    stages[2].querySelector(".integration-hub-surface"),
    { opacity: 0 },
    { opacity: 1, duration: 0.12 },
    3.08,
  );
  integration.fromTo(
    stages[2].querySelectorAll(
      ".integration-map-background, .integration-map-eyebrow, .integration-flow-caption, .integration-chip-content",
    ),
    { opacity: 0 },
    { opacity: 1, duration: 0.15 },
    3.08,
  );
  addIntegrationConnections(integration, stages[2]);
  integration.timeScale(0.18).time(3.08);

  const running = () => visible && !document.hidden && !disposed;
  const paint = (now: number) => {
    request = 0;
    if (!running() || selected === 2) return;
    if (previous && now - previous < 1000 / 30) {
      request = requestAnimationFrame(paint);
      return;
    }
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    if (selected === 0) {
      phase = (phase + delta / 32) % 1;
      render(0.45, phase, true);
      stages[0].dataset.panelPhase = phase.toFixed(6);
    } else {
      elapsed = Math.min(elapsed + delta, 8);
      // Replay the reference's illuminated squares → plates → compressed
      // surface → upward stack, then hold its completed pose.
      render(1 + (elapsed / 8) * 1.76, 0);
    }
    if (selected === 0 || elapsed < 8) request = requestAnimationFrame(paint);
  };
  const sync = () => {
    const active = running();
    stages.forEach((stage, index) => {
      const playing = active && selected === index;
      stage.dataset.flow = playing ? "running" : "paused";
      flows[index].paused(!playing);
      mists[index].paused(!playing);
    });
    if (active && selected === 2 && integration.time() < integration.duration())
      integration.play();
    else integration.pause();
    if (!active || selected === 2) {
      cancelAnimationFrame(request);
      request = 0;
      previous = 0;
    } else if (!request && (selected === 0 || elapsed < 8)) {
      previous = 0;
      request = requestAnimationFrame(paint);
    }
  };
  const choose = () => {
    const next = Number(svg.dataset.active || 0);
    if (next === selected) return;
    selected = next;
    elapsed = 0;
    previous = 0;
    cancelAnimationFrame(request);
    request = 0;
    if (selected === 0) render(0.45, phase, true);
    else if (selected === 1) render(1, 0);
    else {
      render(4, 0);
      integration.pause().time(3.08);
    }
    sync();
  };
  if (selected === 0) render(0.45, phase, true);
  else if (selected === 1) render(1, 0);
  else {
    render(4, 0);
    integration.time(3.08);
  }

  const selection = new MutationObserver(choose);
  selection.observe(svg, {
    attributes: true,
    attributeFilter: ["data-active"],
  });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(svg);
  document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    disposed = true;
    cancelAnimationFrame(request);
    observer.disconnect();
    selection.disconnect();
    document.removeEventListener("visibilitychange", sync);
    flows.forEach((flow) => flow.kill());
    mists.forEach((mist) => mist.kill());
    integration.kill();
    stages.forEach((stage) => {
      delete stage.dataset.flow;
      delete stage.dataset.panelPhase;
    });
    render(null);
  };
}
