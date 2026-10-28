"use client";
import { useEffect, useRef } from "react";
type Cleanup = void | (() => void);
// Keep readable HTML in the initial response; download animation code only
// when its section approaches. Never run a late import after unmounting.
export function useDeferredAnimation(
  ready: boolean,
  load: () => Promise<() => Cleanup>,
) {
  const loader = useRef(load);
  loader.current = load;
  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    let started = false;
    let cleanup: Cleanup;
    const start = () => {
      if (disposed || started) return;
      started = true;
      window.removeEventListener("scroll", onScroll);
      loader.current().then((initialize) => {
        if (!disposed) cleanup = initialize();
      });
    };
    const onScroll = () => {
      if (scrollY > 0) start();
    };
    // A section can be within the preload margin at the top of a tall phone.
    // Its scroll effects only need the timeline engine once scrolling begins.
    if (document.querySelector(".experience-home") && scrollY === 0)
      window.addEventListener("scroll", onScroll, { passive: true });
    else start();
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      cleanup?.();
    };
  }, [ready]);
}
