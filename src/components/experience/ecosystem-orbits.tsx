import { ecosystemNodes } from "@/content/experience";

// A fixed, shallow perspective: spheres stay upright while their bases and
// connecting rings lie on the same plane. No WebGL or per-frame React updates.
export function orbitPosition(ring: number, angle: number, compact = false) {
  const radians = (angle * Math.PI) / 180;
  return {
    x:
      500 +
      Math.cos(radians) *
        (compact ? (ring === 0 ? 190 : 300) : ring === 0 ? 150 : 295),
    y:
      340 +
      Math.sin(radians) *
        (compact ? (ring === 0 ? 110 : 200) : ring === 0 ? 90 : 175),
  };
}
const ellipse = (rx: number, ry: number, cx = 500, cy = 340) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 1 ${rx * 2} 0 a ${rx} ${ry} 0 1 1 ${-rx * 2} 0`;

export function MobileEcosystemOrbits() {
  return (
    <svg
      className="ecosystem-mobile-connections"
      viewBox="0 0 1000 650"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {[
        [190, 110],
        [300, 200],
      ].map(([rx, ry], index) => (
        <g key={rx} className={`ecosystem-ring-${index}`}>
          {[0, 1, 2, 3].map((arc) => (
            <path
              key={arc}
              className="ecosystem-mobile-orbit"
              data-orbit={`${index}-${arc}`}
              d={orbitArc(index, (index ? 202.5 : 225) + arc * 90, true)}
              pathLength="1"
              stroke="#c5ccd5"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            className="ecosystem-current"
            d={ellipse(rx, ry)}
            pathLength="1"
            style={{ animationDuration: `${index ? 24 : 16}s` }}
          />
        </g>
      ))}
      {[225, 315, 45, 135].map((angle, index) => {
        const inside = orbitPosition(0, angle, true);
        const outside = orbitPosition(
          1,
          [202.5, 337.5, 22.5, 157.5][index],
          true,
        );
        return (
          <path
            key={angle}
            className="ecosystem-bridge"
            pathLength="1"
            d={`M ${inside.x} ${inside.y} L ${outside.x} ${outside.y}`}
            stroke="#c5ccd5"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
const orbitArc = (ring: number, angle: number, compact = false) => {
  const start = orbitPosition(ring, angle, compact);
  const end = orbitPosition(ring, angle + 90, compact);
  const rx = compact ? (ring ? 300 : 190) : ring ? 295 : 150;
  const ry = compact ? (ring ? 200 : 110) : ring ? 175 : 90;
  return `M ${start.x} ${start.y} A ${rx} ${ry} 0 0 1 ${end.x} ${end.y}`;
};

export function EcosystemOrbits() {
  return (
    <svg
      className="ecosystem-connections"
      viewBox="0 0 1000 650"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ecosystem-base">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".12" />
          <stop offset=".7" stopColor="#f2f2f2" stopOpacity=".18" />
          <stop offset="1" stopColor="#d8d8d8" stopOpacity=".1" />
        </radialGradient>
        <linearGradient id="ecosystem-ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dedede" stopOpacity=".45" />
          <stop offset=".45" stopColor="#bdbdbd" />
          <stop offset=".72" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d4d4d4" />
        </linearGradient>
      </defs>
      {[0, 1].map((ring) => (
        <g key={ring} className={`ecosystem-ring ecosystem-ring-${ring}`}>
          {[0, 1, 2, 3].map((arc) => (
            <path
              key={arc}
              className="ecosystem-orbit-path"
              data-orbit={`${ring}-${arc}`}
              pathLength="1"
              d={orbitArc(ring, (ring ? 202.5 : 225) + arc * 90)}
            />
          ))}
          <path
            className="ecosystem-current"
            pathLength="1"
            d={ellipse(ring ? 295 : 150, ring ? 175 : 90)}
          />
        </g>
      ))}
      {[225, 315, 45, 135].map((angle, index) => {
        const inside = orbitPosition(0, angle);
        const outside = orbitPosition(1, [202.5, 337.5, 22.5, 157.5][index]);
        return (
          <path
            key={angle}
            className="ecosystem-bridge"
            data-bridge={index}
            pathLength="1"
            d={`M ${inside.x} ${inside.y} L ${outside.x} ${outside.y}`}
          />
        );
      })}
      <g className="ecosystem-center-base">
        <ellipse
          cx="500"
          cy="342"
          rx="66"
          ry="32"
          fill="url(#ecosystem-base)"
        />
        <path
          className="ecosystem-halo ecosystem-base-trace"
          pathLength="1"
          d={ellipse(66, 32, 500, 342)}
        />
      </g>
      {ecosystemNodes.map((node, index) => {
        const { x, y } = orbitPosition(node.ring, node.angle);
        return (
          <g
            key={node.label}
            className="ecosystem-node-base"
            data-node-base={index}
          >
            <ellipse
              cx={x}
              cy={y + 5}
              rx="37"
              ry="19"
              fill="url(#ecosystem-base)"
            />
            <path
              className="ecosystem-halo ecosystem-base-trace"
              pathLength="1"
              d={ellipse(37, 19, x, y + 5)}
            />
          </g>
        );
      })}
    </svg>
  );
}
