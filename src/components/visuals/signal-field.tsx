"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
const Scene = dynamic(() => import("./signal-scene"), { ssr: false });
function SignalFallback({ mode }: { mode: "flow" | "architecture" | "globe" }) {
  return (
    <svg
      className="signal-fallback"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {mode === "globe" ? (
        <g fill="none" stroke="#6e9ed9" strokeWidth="1" opacity=".65">
          <circle cx="600" cy="350" r="260" />
          {[65, 130, 195].map((r) => (
            <ellipse key={r} cx="600" cy="350" rx={r} ry="260" />
          ))}
          {[90, 180, 260].map((r) => (
            <ellipse key={r} cx="600" cy="350" rx="260" ry={r} />
          ))}
        </g>
      ) : (
        Array.from({ length: 24 }, (_, i) =>
          mode === "flow" ? (
            <path
              key={i}
              d={`M -100 ${-80 + i * 9} C 250 ${50 + i * 8}, 400 ${640 - i * 6}, 600 390 S 1000 ${120 + i * 5}, 1300 ${i * 10 - 30}`}
              fill="none"
              stroke={i % 4 === 0 ? "#28a9cf" : "#007BFF"}
              strokeOpacity=".14"
              strokeWidth={i % 4 === 0 ? 2 : 1}
            />
          ) : (
            <rect
              key={i}
              x={220 + i * 30}
              y={160 + Math.sin(i * 0.25) * 65}
              width="12"
              height={270 + Math.cos(i * 0.25) * 60}
              rx="4"
              fill={i % 7 < 2 ? "#007BFF" : "#d9e4ee"}
              transform={`rotate(-12 ${220 + i * 30} 350)`}
            />
          ),
        )
      )}
    </svg>
  );
}
export function SignalField({
  mode = "flow",
  variant = 0,
  className = "",
}: {
  mode?: "flow" | "architecture" | "globe";
  variant?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "100px" });
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (visible) setReady(true);
  }, [visible]);
  const fallback = <SignalFallback mode={mode} />;
  return (
    <div ref={root} className={`signal-field ${className}`} aria-hidden="true">
      {!rendered && fallback}
      {ready && (
        <Scene
          mode={mode}
          variant={variant}
          still={!!reduced}
          visible={visible}
          fallback={fallback}
          onReady={() => setRendered(true)}
        />
      )}
    </div>
  );
}
