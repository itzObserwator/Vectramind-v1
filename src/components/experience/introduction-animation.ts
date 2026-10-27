import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function mount(root: RefObject<HTMLElement | null>) {
  const media = gsap.matchMedia();
  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      stacked: "(max-width: 600px)",
    },
    (context) => {
      const section = root.current;
      const graphic = section?.querySelector<HTMLElement>(".post-hero-graphic");
      if (!section || !graphic) return;
      if (context.conditions?.reduced) {
        graphic.dataset.animationPhase = "static";
        return () => {
          graphic.dataset.animationPhase = "idle";
        };
      }
      // On desktop the heading and illustration share one entrance clock.
      // Start with the illustration's center in view, rather than playing the
      // result below the fold. Stacked mobile copy enters independently.
      const copy = gsap
        .timeline({ paused: true })
        .fromTo(
          Array.from(
            section.querySelectorAll(".post-hero-question-line"),
          ).filter((line) => line.getClientRects().length > 0),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, stagger: 0.18, ease: "power3.out" },
          0,
        )
        .fromTo(
          section.querySelector(".post-hero-description"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          0.72,
        );
      const scene = gsap.timeline({
        scrollTrigger: { trigger: graphic, start: "center 78%", once: true },
        onStart() {
          graphic.dataset.animationPhase = "playing";
        },
        onComplete() {
          graphic.dataset.animationPhase = "complete";
        },
      });
      if (context.conditions?.stacked) {
        ScrollTrigger.create({
          trigger: section.querySelector(".post-hero-copy"),
          start: "top 72%",
          once: true,
          onEnter: () => copy.play(),
        });
      } else {
        scene.add(copy.paused(false), 0);
      }
      scene
        .fromTo(
          graphic.querySelector(".post-hero-connections"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          0,
        )
        .fromTo(
          graphic.querySelector(".post-hero-progress"),
          { autoAlpha: 0, height: "48%" },
          { autoAlpha: 1, height: "72%", duration: 1.05, ease: "power2.out" },
          0.04,
        )
        .fromTo(
          graphic.querySelector(".post-hero-column-left"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          0.12,
        )
        .fromTo(
          graphic.querySelector(".post-hero-column-right"),
          { height: "12%", autoAlpha: 0 },
          { height: "37%", autoAlpha: 1, duration: 1.1, ease: "power2.out" },
          0.08,
        )
        .fromTo(
          graphic.querySelector(".post-hero-card-patient"),
          { autoAlpha: 0, y: 10, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          0.4,
        )
        .fromTo(
          graphic.querySelector(".post-hero-card-message"),
          { autoAlpha: 0, y: 10, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          0.64,
        )
        .fromTo(
          graphic.querySelector(".post-hero-outcome"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          0.88,
        )
        .fromTo(
          graphic.querySelector(".post-hero-tens-reel"),
          { yPercent: 0, y: "0em" },
          { y: "-1em", duration: 1.8, ease: "power2.inOut" },
          1.12,
        )
        .fromTo(
          graphic.querySelector(".post-hero-ones-reel"),
          { yPercent: 0, y: "0em" },
          { y: "-10em", duration: 1.8, ease: "power2.out" },
          1.12,
        )
        .fromTo(
          graphic.querySelector(".post-hero-outcome-fill"),
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1.8,
            ease: "power2.out",
          },
          1.12,
        );
      gsap.fromTo(
        section.querySelector(".post-hero-resolution"),
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section.querySelector(".post-hero-resolution"),
            start: "top 94%",
            once: true,
          },
        },
      );
      return () => {
        graphic.dataset.animationPhase = "idle";
      };
    },
    root,
  );
  return () => media.revert();
}
