"use client";
import { useEffect, useState, type RefObject } from "react";
import { afterSiteIntro } from "./after-site-intro";
// Initialise expensive decorative artwork shortly before its section is visible.
// Section headings, copy and controls remain server-rendered and usable.
export function useNearViewport(
  ref: RefObject<HTMLElement | null>,
  margin = "600px",
) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current || ready) return;
    let observer: IntersectionObserver | undefined;
    const cancel = afterSiteIntro(() => {
      if (!ref.current) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setReady(true);
          observer?.disconnect();
        },
        { rootMargin: margin },
      );
      observer.observe(ref.current);
    });
    return () => {
      cancel();
      observer?.disconnect();
    };
  }, [ref, ready, margin]);
  return ready;
}
