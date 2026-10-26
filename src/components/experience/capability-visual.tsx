import { useId } from "react";
import { PRIMARY_SIGNALS } from "@/lib/primary-theme";
import { IntegrationVisual } from "./integration-visual";
import {
  INTELLIGENCE_PANEL_COUNT,
  intelligencePanelPose,
} from "./intelligence-ribbon";
import { capabilityPath } from "./capability-geometry";
const colors = PRIMARY_SIGNALS;

/** Source-owned vector faces; projected coordinates are updated by the scroll timeline. */
export function CapabilityVisual({ active }: { active: number }) {
  const id = useId().replaceAll(":", "");
  const edge = `url(#${id}-edge)`;
  const shape = (kind: string, index: number, chapter: number) => ({
    "data-geometry": kind,
    "data-index": index,
    "data-chapter": chapter,
    d: capabilityPath(kind, index, chapter === 2 ? 0.65 : 0.45),
  });
  const guides = (chapter: number) =>
    [0, 1, 2].map((i) => (
      <g key={i}>
        <path
          {...shape(
            chapter === 2
              ? "guide-system"
              : chapter === 0
                ? "guide-fold"
                : "guide",
            i,
            chapter,
          )}
          stroke="#aaaaaa"
          strokeWidth=".7"
          strokeOpacity=".38"
        />
        <path
          {...shape(
            chapter === 2
              ? "guide-system"
              : chapter === 0
                ? "guide-fold"
                : "guide",
            i,
            chapter,
          )}
          className="capability-signal"
          stroke={colors[i]}
          strokeWidth="1.7"
          strokeOpacity=".58"
          strokeDasharray="2 26"
        />
      </g>
    ));
  const grid = (chapter: number) =>
    Array.from({ length: 22 }, (_, i) => (
      <g key={i}>
        <path
          {...shape(
            chapter === 0
              ? "rail-fold"
              : chapter === 2
                ? "rail-system"
                : "rail",
            i,
            chapter,
          )}
          stroke="#b0b0b0"
          strokeOpacity={chapter === 2 ? 0.34 : 0.28}
          strokeWidth=".7"
        />
        <path
          {...shape(
            chapter === 0
              ? "rail-fold"
              : chapter === 2
                ? "rail-system"
                : "rail",
            i,
            chapter,
          )}
          className="capability-signal"
          stroke={colors[Math.floor(i / 2) % 4]}
          strokeOpacity=".55"
          strokeWidth="1.8"
          strokeDasharray="1.5 39"
        />
        {chapter === 2 && (
          <path
            {...shape("rail-system", i, 2)}
            className="capability-signal"
            stroke={colors[Math.floor(i / 2) % 4]}
            strokeOpacity=".16"
            strokeWidth="5"
            strokeDasharray="1.5 39"
            filter={`url(#${id}-ribbon-glow)`}
          />
        )}
      </g>
    ));
  return (
    <svg
      className="capability-visual"
      data-active={active}
      viewBox="0 0 800 620"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${id}-connected-frame`} clipPathUnits="userSpaceOnUse">
          <rect
            className="capability-connected-clip"
            x="-30"
            y="-20"
            width="860"
            height="660"
          />
        </clipPath>
        <filter
          id={`${id}-layer-shadow`}
          x="-25%"
          y="-50%"
          width="150%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <linearGradient
          id={`${id}-ribbon-depth-fade`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="385"
          x2="0"
          y2="610"
        >
          <stop stopColor="#fff" />
          <stop offset=".18" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask
          id={`${id}-ribbon-depth`}
          maskUnits="userSpaceOnUse"
          x="-200"
          y="-200"
          width="1300"
          height="1100"
        >
          <rect
            x="-200"
            y="-200"
            width="1300"
            height="1100"
            fill={`url(#${id}-ribbon-depth-fade)`}
          />
        </mask>
        <filter
          id={`${id}-ribbon-glow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <radialGradient id={`${id}-ribbon-mist`}>
          <stop stopColor="#fafafa" stopOpacity=".86" />
          <stop offset=".65" stopColor="#f4f4f4" stopOpacity=".42" />
          <stop offset="1" stopColor="#fafafa" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${id}-layer-pearl`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="85%"
        >
          <stop stopColor="#f2f8ff" stopOpacity=".96" />
          <stop offset=".4" stopColor="#c9e3ff" stopOpacity=".72" />
          <stop offset="1" stopColor="#8cbbea" stopOpacity=".42" />
        </linearGradient>
        <linearGradient
          id={`${id}-layer-edge`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop stopColor="#fff" stopOpacity=".9" />
          <stop offset=".35" stopColor="#9ac4eb" stopOpacity=".55" />
          <stop offset="1" stopColor="#76a7d8" stopOpacity=".36" />
        </linearGradient>
        <linearGradient
          id={`${id}-integration-metal`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="45%"
        >
          <stop stopColor="#fff" stopOpacity=".96" />
          <stop offset=".38" stopColor="#bfdcfa" stopOpacity=".94" />
          <stop offset=".65" stopColor="#81b0df" stopOpacity=".86" />
          <stop offset="1" stopColor="#d7eaff" stopOpacity=".8" />
        </linearGradient>
        <linearGradient
          id={`${id}-ribbon-rear`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="35%"
        >
          <stop stopColor="#f2f8ff" stopOpacity=".98" />
          <stop offset=".24" stopColor="#c9e3ff" stopOpacity=".94" />
          <stop offset=".8" stopColor="#8cbbea" stopOpacity=".63" />
          <stop offset="1" stopColor="#dfedfc" stopOpacity=".72" />
        </linearGradient>
        <linearGradient
          id={`${id}-ribbon-front`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="60%"
        >
          <stop stopColor="#f0f7ff" stopOpacity=".96" />
          <stop offset=".4" stopColor="#b2d5f7" stopOpacity=".87" />
          <stop offset="1" stopColor="#82b4e6" stopOpacity=".48" />
        </linearGradient>
        <linearGradient id={`${id}-edge`}>
          <stop stopColor="#93bce5" stopOpacity=".45" />
          <stop offset=".45" stopColor="#fff" />
          <stop offset="1" stopColor="#9fc6eb" stopOpacity=".6" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#e5f1ff" stopOpacity=".68" />
          <stop offset="1" stopColor="#fafafa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="485" cy="360" rx="330" ry="270" fill={`url(#${id}-halo)`} />
      <g className="capability-visual-stage capability-visual-stage-0">
        <g className="capability-folds">
          <g
            className="capability-intelligence-grid"
            transform="translate(0 60)"
          >
            {grid(0)}
          </g>
          <g
            className="capability-ribbon-panels"
            mask={`url(#${id}-ribbon-depth)`}
          >
            {Array.from({ length: INTELLIGENCE_PANEL_COUNT }, (_, i) => (
              <g
                className="capability-fin"
                data-panel-index={i}
                key={i}
                opacity={intelligencePanelPose(i).opacity}
              >
                <path
                  {...shape("fin", i, 0)}
                  fill={`url(#${id}-${i > 15 ? "ribbon-front" : "ribbon-rear"})`}
                  fillOpacity=".96"
                  stroke={edge}
                  strokeWidth=".8"
                />
                <path
                  {...shape("fin-edge", i, 0)}
                  fill="#89b5df"
                  fillOpacity=".58"
                />
                <path
                  {...shape("fin-highlight", i, 0)}
                  stroke="#ffffff"
                  strokeOpacity=".76"
                  strokeWidth=".85"
                />
              </g>
            ))}
          </g>
          <g className="capability-intelligence-mist" pointerEvents="none">
            <ellipse
              cx="110"
              cy="475"
              rx="290"
              ry="140"
              fill={`url(#${id}-ribbon-mist)`}
            />
            <ellipse
              cx="405"
              cy="580"
              rx="310"
              ry="160"
              fill={`url(#${id}-ribbon-mist)`}
            />
          </g>
        </g>
      </g>
      <g
        className="capability-visual-stage capability-visual-stage-1"
        clipPath={`url(#${id}-connected-frame)`}
      >
        <g className="capability-layers">
          {grid(1)}
          {guides(1)}
          <g className="capability-forming-core">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                {...shape("plate-core", i, 1)}
                fill={`url(#${id}-layer-pearl)`}
                fillOpacity={i === 2 ? 0.65 : 0.38}
                stroke={edge}
                strokeWidth=".9"
                opacity="0"
              />
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <path
                key={`rib-${i}`}
                {...shape("plate-rib", i, 1)}
                stroke={edge}
                strokeWidth="1.25"
                opacity="0"
              />
            ))}
          </g>
          {[5, 4, 3, 2, 1, 0].map((i) => (
            <g className="capability-plate" key={i}>
              <path
                {...shape("plate-shadow", i, 1)}
                fill="#464646"
                fillOpacity=".15"
                filter={`url(#${id}-layer-shadow)`}
              />
              <path
                {...shape("plate-edge", i, 1)}
                fill={`url(#${id}-layer-edge)`}
                stroke={edge}
                strokeWidth=".6"
              />
              <path
                {...shape("plate", i, 1)}
                fill={`url(#${id}-layer-pearl)`}
                stroke={edge}
                strokeWidth=".8"
              />
              <path
                {...shape("plate-bevel", i, 1)}
                stroke="#fff"
                strokeOpacity=".65"
                strokeWidth=".7"
              />
              <path
                {...shape("plate-signal", i, 1)}
                stroke={colors[i % 4]}
                strokeOpacity=".2"
                strokeWidth=".8"
              />
              <path
                {...shape("plate-signal", i, 1)}
                className="capability-signal"
                filter={`url(#${id}-ribbon-glow)`}
                stroke={colors[i % 4]}
                strokeOpacity=".24"
                strokeDasharray="2 20"
                strokeWidth="4"
              />
              <path
                {...shape("plate-signal", i, 1)}
                className="capability-signal"
                stroke={colors[i % 4]}
                strokeOpacity=".65"
                strokeDasharray="2 20"
                strokeWidth="1.5"
              />
            </g>
          ))}
          <g className="capability-connected-mist">
            <ellipse
              cx="470"
              cy="490"
              rx="335"
              ry="160"
              fill={`url(#${id}-ribbon-mist)`}
              opacity=".58"
            />
            <ellipse
              cx="410"
              cy="635"
              rx="380"
              ry="155"
              fill={`url(#${id}-ribbon-mist)`}
            />
          </g>
        </g>
      </g>
      <g
        className="capability-stack-chip"
        clipPath={`url(#${id}-connected-frame)`}
        opacity="0"
      >
        <path
          fill={`url(#${id}-layer-pearl)`}
          stroke="#b4b4b4"
          strokeWidth="1.2"
          filter={`url(#${id}-system-shadow)`}
        />
        <path
          className="integration-chip-coat"
          fill={`url(#${id}-system-surface)`}
          stroke="#b4b4b4"
          strokeWidth="1.2"
          opacity="0"
        />
      </g>
      <g
        className="capability-visual-stage capability-visual-stage-2"
        clipPath={`url(#${id}-connected-frame)`}
      >
        <IntegrationVisual id={id} />
      </g>
    </svg>
  );
}
