import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createEcosystemEntrance } from "./ecosystem-motion";
gsap.registerPlugin(ScrollTrigger);
export function mount(root: RefObject<HTMLElement | null>) {
  const media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 901px)",
      compact: "(max-width: 767px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const section = root.current;
      if (!section) return;
      if (!context.conditions?.motion) {
        section.dataset.phase = "complete";
        return () => {
          delete section.dataset.phase;
        };
      }
      createEcosystemEntrance(
        section,
        !!context.conditions.desktop,
        !!context.conditions.compact,
      );
      const observer = new IntersectionObserver(([entry]) => {
        section.dataset.visible = String(entry.isIntersecting);
      });
      observer.observe(section);
      return () => {
        observer.disconnect();
        delete section.dataset.visible;
        delete section.dataset.phase;
      };
    },
    root,
  );
  return () => media.revert();
}
