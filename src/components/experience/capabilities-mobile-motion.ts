import gsap from "gsap";
import { createCapabilityRenderer } from "./capability-geometry";
import { addIntegrationConnections } from "./integration-connections";
import { createStackChipTransition } from "./stack-chip-transition";

/** Structural animation follows the desktop's 0–4 scroll clock. Only the first
 * chapter's ambient fins and the visible chapter's light flow run with time. */
export function mountMobileCapabilities(section: HTMLElement) {
  const svg = section.querySelector<SVGSVGElement>(".capability-visual");
  if (!svg) return;
  const stages = Array.from(
    svg.querySelectorAll<SVGGElement>(".capability-visual-stage"),
  );
  const render = createCapabilityRenderer(section);
  const chipTransition = createStackChipTransition(section);
  let selected = Number(svg.dataset.active || 0);
  let visible = false;
  let phase = 0;
  let scrollTime = 0;
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
    { opacity: 1, duration: 0.012 },
    3.158,
  );
  integration.fromTo(
    stages[2].querySelectorAll(
      ".integration-map-background, .integration-map-eyebrow, .integration-flow-caption",
    ),
    { opacity: 0 },
    { opacity: 1, duration: 0.18 },
    3.16,
  );
  integration.fromTo(
    stages[2].querySelector(".integration-chip-content"),
    { opacity: 0 },
    { opacity: 1, duration: 0.15 },
    3.1,
  );
  addIntegrationConnections(integration, stages[2]);
  integration.time(0);

  const running = () => visible && !document.hidden && !disposed;
  const paint = (now: number) => {
    request = 0;
    if (!running() || selected !== 0) return;
    if (previous && now - previous < 1000 / 30) {
      request = requestAnimationFrame(paint);
      return;
    }
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    phase = (phase + delta / 32) % 1;
    render(Math.min(scrollTime, 2.76), phase, true);
    stages[0].dataset.panelPhase = phase.toFixed(6);
    request = requestAnimationFrame(paint);
  };
  const sync = () => {
    const active = running();
    stages.forEach((stage, index) => {
      const playing = active && selected === index;
      stage.dataset.flow = playing ? "running" : "paused";
      flows[index].paused(!playing);
      mists[index].paused(!playing);
    });
    if (!active || selected !== 0) {
      cancelAnimationFrame(request);
      request = 0;
      previous = 0;
    } else if (!request) {
      previous = 0;
      request = requestAnimationFrame(paint);
    }
  };
  const renderProgress = (progress: number) => {
    scrollTime = Math.max(0, Math.min(1, progress)) * 4;
    selected = scrollTime < 1 ? 0 : scrollTime < 3 ? 1 : 2;
    render(Math.min(scrollTime, 2.76), phase);
    chipTransition.render(scrollTime);
    integration.pause().time(scrollTime, true);
    sync();
    return selected;
  };
  renderProgress(0);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(svg);
  document.addEventListener("visibilitychange", sync);
  sync();
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(request);
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    flows.forEach((flow) => flow.kill());
    mists.forEach((mist) => mist.kill());
    integration.kill();
    chipTransition.render(null);
    stages.forEach((stage) => {
      delete stage.dataset.flow;
      delete stage.dataset.panelPhase;
    });
    render(null);
  };
  return { renderProgress, dispose };
}
