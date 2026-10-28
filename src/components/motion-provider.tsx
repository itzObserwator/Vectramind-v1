"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { mountInnerMotion } from "./inner-motion-runtime";
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const inner = document.querySelector<HTMLElement>(
      ".inner-page, .not-found-page",
    );
    if (inner) return mountInnerMotion(inner);
    let disposed = false,
      started = false;
    let cleanup: void | (() => void);
    const start = () => {
      if (started) return;
      started = true;
      import("./motion-runtime").then(({ mountMotion }) => {
        if (!disposed) cleanup = mountMotion();
      });
    };
    // Homepage scroll effects are progressive enhancement. Its hero pulses use
    // CSS and its text is already visible, so load the scroll engine on scroll.
    const home = document.querySelector(".experience-home");
    const keyboard = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " ", "Tab"].includes(event.key))
        start();
    };
    const anchor = (event: MouseEvent) => {
      if ((event.target as Element).closest('a[href^="#"]')) start();
    };
    if (!home || scrollY > 0) start();
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("keydown", keyboard);
    document.addEventListener("click", anchor);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", start);
      window.removeEventListener("keydown", keyboard);
      document.removeEventListener("click", anchor);
      cleanup?.();
    };
  }, [pathname]);
  return <>{children}</>;
}
