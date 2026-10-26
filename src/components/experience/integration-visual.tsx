import { HugeiconsIcon } from "@hugeicons/react";
import { PRIMARY_COLOR, PRIMARY_SIGNALS } from "@/lib/primary-theme";
import {
  Calendar03Icon,
  Message01Icon,
  Link01Icon,
  ChartLineData01Icon,
} from "@hugeicons/core-free-icons";

// An integration diagram, rather than an architectural metaphor. Each route
// connects a real system category in the accompanying Vectramind copy.
const systems = [
  {
    name: "CRM",
    detail: "Customer context",
    x: 70,
    y: 120,
    color: PRIMARY_COLOR,
    icon: ChartLineData01Icon,
  },
  {
    name: "EMR",
    detail: "Clinical records",
    x: 70,
    y: 350,
    color: PRIMARY_COLOR,
    icon: Calendar03Icon,
  },
  {
    name: "Synapse",
    detail: "Customer engagement",
    x: 560,
    y: 120,
    color: PRIMARY_COLOR,
    icon: Message01Icon,
  },
  {
    name: "Firstpass",
    detail: "Patient experience",
    x: 560,
    y: 350,
    color: PRIMARY_COLOR,
    icon: Calendar03Icon,
  },
];
const routes = [
  "M310 268H283Q270 268 270 255V178Q270 165 257 165H215",
  "M310 312H283Q270 312 270 325V382Q270 395 257 395H215",
  "M500 268H527Q540 268 540 255V178Q540 165 553 165H560",
  "M500 312H527Q540 312 540 325V382Q540 395 553 395H560",
  "M405 345V480",
];
const packetColors = [...PRIMARY_SIGNALS, PRIMARY_COLOR];

export function IntegrationVisual({ id }: { id: string }) {
  return (
    <g
      className="capability-system capability-integration-map"
      aria-label="CRM, EMR, Synapse and Firstpass connected through Vectramind’s integration layer"
    >
      <defs>
        <filter
          id={`${id}-system-shadow`}
          x="-30%"
          y="-40%"
          width="160%"
          height="190%"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="12"
            floodColor="#6e6e6e"
            floodOpacity=".09"
          />
        </filter>
        <linearGradient id={`${id}-system-surface`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#fafafa" />
        </linearGradient>
        <pattern
          id={`${id}-system-dots`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".65" fill="#c7c7c7" fillOpacity=".38" />
        </pattern>
      </defs>
      <rect
        className="integration-map-background"
        x="48"
        y="85"
        width="695"
        height="480"
        rx="30"
        fill={`url(#${id}-system-dots)`}
        opacity=".55"
      />
      <text x="70" y="65" className="integration-map-eyebrow">
        YOUR SYSTEMS. ONE CONNECTED FLOW.
      </text>
      <g className="capability-integration-mist" opacity=".35">
        <ellipse
          cx="410"
          cy="505"
          rx="310"
          ry="55"
          fill={`url(#${id}-ribbon-mist)`}
        />
      </g>
      {routes.map((d, index) => (
        <g key={d} className="integration-connection" data-connection={index}>
          <path
            className="integration-route"
            d={d}
            fill="none"
            pathLength="1"
          />
          <mask
            id={`${id}-route-${index}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="800"
            height="620"
          >
            <path
              className="integration-route-mask"
              d={d}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth="12"
              strokeDasharray="1"
            />
          </mask>
          <g
            className="integration-packets"
            mask={`url(#${id}-route-${index})`}
          >
            <path
              className="integration-leading-pulse"
              d={d}
              pathLength="1"
              fill="none"
              stroke={packetColors[index]}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray=".03 .97"
              opacity="0"
            />
            <path
              className="capability-signal integration-packet"
              d={d}
              fill="none"
              stroke={packetColors[index]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="3 35"
            />
            <path
              className="capability-signal integration-packet integration-return"
              d={d}
              fill="none"
              stroke={packetColors[index]}
              strokeWidth="2"
              strokeOpacity=".45"
              strokeLinecap="round"
              strokeDasharray="2 36"
            />
          </g>
        </g>
      ))}
      {systems.map((system, index) => (
        <g
          key={system.name}
          className="integration-system-card"
          data-system={system.name}
          transform={`translate(${system.x} ${system.y})`}
        >
          <g className="integration-chip-body">
            <rect
              width="145"
              height="90"
              rx="13"
              fill={`url(#${id}-system-surface)`}
              stroke="#d8d8d8"
              filter={`url(#${id}-system-shadow)`}
            />
            <g transform="translate(15 16)" color={system.color}>
              <HugeiconsIcon icon={system.icon} size={21} strokeWidth={1.4} />
            </g>
            <circle cx="125" cy="19" r="2.5" fill={system.color} opacity=".7" />
            <text x="15" y="56" className="integration-system-name">
              {system.name}
            </text>
            <text x="15" y="73" className="integration-system-description">
              {system.detail}
            </text>
            <circle
              cx={index < 2 ? 145 : 0}
              cy="45"
              r="3.5"
              fill="#fbfbfb"
              stroke={system.color}
              strokeWidth="1.2"
            />
          </g>
        </g>
      ))}
      <g className="integration-hub">
        <rect
          className="integration-hub-surface"
          x="310"
          y="235"
          width="190"
          height="110"
          rx="16"
          fill={`url(#${id}-system-surface)`}
          stroke="#d8d8d8"
          strokeWidth="1.2"
          filter={`url(#${id}-system-shadow)`}
        />
        <g className="integration-chip-content">
          <image
            href="/images/vectramind-logo.svg"
            x="329"
            y="253"
            width="112"
            height="17"
          />
          <text x="329" y="301" className="integration-hub-title">
            Integration layer
          </text>
          <text x="329" y="322" className="integration-system-description">
            Bi-directional connections
          </text>
          {[0, 1, 2, 3].map((index) => (
            <circle
              key={index}
              cx={465 + (index % 2) * 8}
              cy={255 + Math.floor(index / 2) * 8}
              r="2"
              fill={packetColors[index]}
            />
          ))}
          {[
            [310, 268],
            [310, 312],
            [500, 268],
            [500, 312],
            [405, 345],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="#fbfbfb"
              stroke="#939393"
              strokeWidth="1.2"
            />
          ))}
        </g>
      </g>
      <g className="integration-infrastructure">
        <g className="integration-chip-body">
          <rect
            x="305"
            y="480"
            width="200"
            height="60"
            rx="12"
            fill="#ffffff"
            stroke="#d7d7d7"
          />
          <g transform="translate(321 498)" color="#7d7d7d">
            <HugeiconsIcon icon={Link01Icon} size={20} strokeWidth={1.4} />
          </g>
          <text x="355" y="505" className="integration-infrastructure-name">
            APIs &amp; databases
          </text>
          <text x="355" y="522" className="integration-system-description">
            Your existing infrastructure
          </text>
          <circle
            cx="405"
            cy="480"
            r="3.5"
            fill="#fbfbfb"
            stroke="#939393"
            strokeWidth="1.2"
          />
        </g>
      </g>
      <g className="integration-flow-caption">
        <path
          d="M337 580H350M347 577L350 580L347 583M371 580H358M361 577L358 580L361 583"
          fill="none"
          stroke="#939393"
          strokeWidth="1"
        />
        <text x="381" y="583" className="integration-system-description">
          Information moves both ways.
        </text>
      </g>
    </g>
  );
}
