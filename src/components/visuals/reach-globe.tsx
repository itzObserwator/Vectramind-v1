"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useViewportPresence } from "@/components/use-viewport-presence";
import { reachLocations } from "@/content/global-reach";
import { PRIMARY_COLOR } from "@/lib/primary-theme";
const Scene = dynamic(() => import("./reach-globe-scene"), { ssr: false });
function Fallback() {
  return (
    <svg
      className="reach-globe-fallback"
      viewBox="0 0 800 800"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="reach-fallback-fill">
          <stop stopColor="#e8f3ff" stopOpacity=".1" />
          <stop offset="1" stopColor="#a9cff2" stopOpacity=".25" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#b5b5b5" strokeWidth=".7">
        <circle cx="400" cy="400" r="310" fill="url(#reach-fallback-fill)" />
        {[80, 160, 240].map((r) => (
          <ellipse key={r} cx="400" cy="400" rx={r} ry="310" />
        ))}
        {[140, 240].map((r) => (
          <ellipse key={r} cx="400" cy="400" rx="310" ry={r} />
        ))}
      </g>
    </svg>
  );
}
export function ReachGlobe({ selectedOffice }: { selectedOffice: number }) {
  const labels = useRef<SVGSVGElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const visible = useViewportPresence(root, "100px");
  const reduced = useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [hidden, setHidden] = useState(false);
  const [data, setData] = useState<number[] | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  useEffect(() => {
    if (!visible || data) return;
    const controller = new AbortController();
    fetch("/data/globe-points.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Globe points unavailable");
        return r.json();
      })
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, [visible, data]);
  const fallback = <Fallback />;
  return (
    <div
      className="reach-globe-renderer"
      ref={root}
      aria-hidden="true"
      data-flow={visible && !hidden && !reduced ? "running" : "paused"}
    >
      {!ready && fallback}
      {data && (
        <Scene
          data={data}
          visible={visible && !hidden}
          still={!!reduced}
          fallback={fallback}
          onReady={() => setReady(true)}
          selectedOffice={selectedOffice}
          labels={labels}
        />
      )}
      <svg ref={labels} className="reach-location-callouts" aria-hidden="true">
        {reachLocations.map((location, index) => (
          <g key={location.name} data-location={location.name} opacity="0">
            <path fill="none" stroke="#838994" strokeWidth=".8" />
            <circle r="5" fill="white" />
            <circle r="3" fill={PRIMARY_COLOR} />
            <g className="reach-location-label">
              <rect
                width={location.name.length * 6.3 + 18}
                height="24"
                rx="12"
              />
              <text x="9" y="16">
                {location.name}
              </text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
