import type { RefObject, Dispatch, SetStateAction } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCapabilityRenderer } from "./capability-geometry";
import { fitConnectedScenes } from "./capability-framing";
import { createStackChipTransition } from "./stack-chip-transition";
import { addIntegrationConnections } from "./integration-connections";
import { mountMobileCapabilities } from "./capabilities-mobile-motion";
gsap.registerPlugin(ScrollTrigger);
export function mount(
  root: RefObject<HTMLElement | null>,
  setActive: Dispatch<SetStateAction<number>>,
) {
  const section = root.current;
  const heading = section?.querySelector<HTMLElement>(".capability-main-title");
  const svg = section?.querySelector<SVGSVGElement>(".capability-visual");
  // Fit the traced stage-01 crest beneath the heading at every desktop size.
  // Its minimum y is 90 in reference pixels, mapped to the SVG viewBox.
  let refreshChip = () => {};
  const fitFirstStage = () => {
    if (!section || !heading || !svg) return;
    const matrix = svg.getScreenCTM();
    if (!matrix || matrix.d <= 0) return;
    const crestY = matrix.f + (((90 - 53) * 620) / 408) * matrix.d;
    const drop =
      innerWidth <= 900
        ? 0
        : Math.max(
            0,
            (heading.getBoundingClientRect().bottom + 28 - crestY) / matrix.d,
          );
    section.style.setProperty(
      "--intelligence-panel-drop",
      `${drop.toFixed(2)}px`,
    );
    fitConnectedScenes(section, svg);
    refreshChip();
  };
  const layoutObserver = new ResizeObserver(fitFirstStage);
  if (heading) layoutObserver.observe(heading);
  if (svg) layoutObserver.observe(svg);
  fitFirstStage();
  const media = gsap.matchMedia();
  media.add(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    () => {
      const section = root.current;
      if (!section) return;
      const stages = section.querySelectorAll(".capability-visual-stage");
      gsap.set(stages, { opacity: 0 });
      gsap.set(stages[0], { opacity: 1 });
      const reel = section.querySelector(".capability-number-reel");
      const firstScene = section.querySelector<SVGGElement>(
        ".capability-visual-stage-0",
      )!;
      const renderBaseGeometry = createCapabilityRenderer(section);
      const chipTransition = createStackChipTransition(section);
      const frame = { time: 0 };
      refreshChip = () => chipTransition.render(frame.time);
      const renderGeometry = (
        time: number | null,
        phase = 0,
        firstOnly = false,
      ) => {
        renderBaseGeometry(
          time === null ? null : Math.min(time, 2.76),
          phase,
          firstOnly,
        );
        if (!firstOnly) chipTransition.render(time);
      };
      const panelCycle = { phase: 0 };
      renderGeometry(0);
      const panelMotion = gsap.to(panelCycle, {
        phase: 1,
        duration: 32,
        repeat: -1,
        ease: "none",
        paused: true,
        onUpdate: () => {
          renderGeometry(frame.time, panelCycle.phase, true);
          firstScene.dataset.panelPhase = panelCycle.phase.toFixed(6);
        },
      });
      const signalFlow = gsap.fromTo(
        firstScene.querySelectorAll(".capability-signal"),
        { strokeDashoffset: 0 },
        {
          // End on whole dash periods so repeating never jumps the light points.
          strokeDashoffset: (_: number, target: SVGPathElement) =>
            -2 *
            (target.getAttribute("stroke-dasharray") || "0")
              .split(/[ ,]+/)
              .reduce((sum, value) => sum + Number(value), 0),
          duration: 6.4,
          repeat: -1,
          ease: "none",
          paused: true,
        },
      );
      const secondScene = stages[1] as SVGGElement;
      const connectedFlow = gsap.fromTo(
        secondScene.querySelectorAll(".capability-signal"),
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: (_: number, target: SVGPathElement) =>
            -2 *
            (target.getAttribute("stroke-dasharray") || "0")
              .split(/[ ,]+/)
              .reduce((sum, value) => sum + Number(value), 0),
          duration: 6.4,
          repeat: -1,
          ease: "none",
          paused: true,
        },
      );
      const mistDrift = gsap.fromTo(
        firstScene.querySelector(".capability-intelligence-mist"),
        { x: -9, y: 12 },
        {
          x: 9,
          y: -8,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        },
      );
      const connectedMist = gsap.fromTo(
        secondScene.querySelector(".capability-connected-mist"),
        { x: 12, y: 10 },
        {
          x: -12,
          y: -10,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        },
      );
      const systemScene = stages[2] as SVGGElement;
      const systemFlow = gsap.fromTo(
        systemScene.querySelectorAll(".capability-signal"),
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: (_: number, target: SVGPathElement) =>
            (target.classList.contains("integration-return") ? 2 : -2) *
            (target.getAttribute("stroke-dasharray") || "0")
              .split(/[ ,]+/)
              .reduce((sum, value) => sum + Number(value), 0),
          autoRound: false,
          duration: 5.8,
          repeat: -1,
          ease: "none",
          paused: true,
        },
      );
      const systemMist = gsap.fromTo(
        systemScene.querySelector(".capability-integration-mist"),
        { x: -14, y: 12 },
        {
          x: 14,
          y: -12,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        },
      );
      let inView = false;
      let renderedChapter = 0;
      const syncFlow = () => {
        const running = inView && renderedChapter === 0 && !document.hidden;
        signalFlow.paused(!running);
        panelMotion.paused(!running);
        mistDrift.paused(!running);
        firstScene.dataset.flow = running ? "running" : "paused";
        const connectedRunning =
          inView && renderedChapter === 1 && !document.hidden;
        connectedFlow.paused(!connectedRunning);
        connectedMist.paused(!connectedRunning);
        secondScene.dataset.flow = connectedRunning ? "running" : "paused";
        const systemRunning =
          inView && renderedChapter === 2 && !document.hidden;
        systemFlow.paused(!systemRunning);
        systemMist.paused(!systemRunning);
        systemScene.dataset.flow = systemRunning ? "running" : "paused";
      };
      const visibility = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          syncFlow();
        },
      });
      inView = visibility.isActive;
      syncFlow();
      document.addEventListener("visibilitychange", syncFlow);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          // Keep the rolling index and stack-to-chip handoff on the same eased clock.
          scrub: 0.9,
        },
        onUpdate() {
          // Read the rendered timeline, so copy never jumps ahead of artwork
          // when the visitor flicks quickly or reverses their scrolling.
          const time = timeline.time();
          const chapter = time < 1 ? 0 : time < 3 ? 1 : 2;
          renderedChapter = chapter;
          syncFlow();
          setActive((previous) => (previous === chapter ? previous : chapter));
        },
      });
      timeline
        .to(
          frame,
          {
            time: 4,
            duration: 4,
            ease: "none",
            onUpdate: () => renderGeometry(frame.time, panelCycle.phase),
          },
          0,
        )
        .to(stages[0], { opacity: 0, duration: 0.18 }, 0.91)
        .to(stages[1], { opacity: 1, duration: 0.18 }, 0.91)
        .to(
          reel,
          { yPercent: -100 / 3, duration: 0.22, ease: "power2.inOut" },
          0.9,
        )
        .set(stages[1], { opacity: 0 }, 2.94)
        .set(stages[2], { opacity: 1 }, 2.94)
        .to(
          reel,
          { yPercent: -200 / 3, duration: 0.22, ease: "power2.inOut" },
          2.9,
        );
      timeline.fromTo(
        systemScene.querySelector(".integration-hub-surface"),
        { opacity: 0 },
        { opacity: 1, duration: 0.012 },
        3.158,
      );
      timeline.fromTo(
        systemScene.querySelectorAll(
          ".integration-map-background, .integration-map-eyebrow, .integration-flow-caption",
        ),
        { opacity: 0 },
        { opacity: 1, duration: 0.18 },
        3.16,
      );
      timeline.fromTo(
        systemScene.querySelector(".integration-chip-content"),
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        3.1,
      );
      addIntegrationConnections(timeline, systemScene);
      timeline.fromTo(
        section.querySelector(".capability-atmosphere"),
        { x: 28, y: 35 },
        { x: -18, y: -20, duration: 4, ease: "none" },
        0,
      );
      return () => {
        document.removeEventListener("visibilitychange", syncFlow);
        signalFlow.kill();
        connectedFlow.kill();
        connectedMist.kill();
        systemFlow.kill();
        systemMist.kill();
        panelMotion.kill();
        mistDrift.kill();
        delete firstScene.dataset.flow;
        delete firstScene.dataset.panelPhase;
        delete secondScene.dataset.flow;
        delete systemScene.dataset.flow;
        renderGeometry(null);
        refreshChip = () => {};
      };
    },
    root,
  );
  media.add(
    "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    () => (root.current ? mountMobileCapabilities(root.current) : undefined),
    root,
  );
  return () => {
    layoutObserver.disconnect();
    media.revert();
    section?.style.removeProperty("--intelligence-panel-drop");
  };
}
