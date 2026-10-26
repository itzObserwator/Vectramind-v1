import trails from "./hero-pulse-paths.json";
import {
  trailPulseColors,
  trailPulseDelay,
  trailPulseDuration,
  trailPulseLength,
  trailPulseOpacity,
} from "./trail-pulses";

// Sample the original projected ribbons once. Only transform and opacity change
// during playback, so Chrome can move the streaks on the compositor thread.
function ribbonMotion(path: string) {
  const points = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const segments: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    distance: number;
    start: number;
  }[] = [];
  let length = 0;
  for (let i = 2; i < points.length; i += 2) {
    const dx = points[i] - points[i - 2];
    const dy = points[i + 1] - points[i - 1];
    const distance = Math.hypot(dx, dy);
    segments.push({
      x: points[i - 2],
      y: points[i - 1],
      dx,
      dy,
      distance,
      start: length,
    });
    length += distance;
  }
  const keyframes = Array.from({ length: 65 }, (_, i) => {
    const progress = i / 64;
    const distance = progress * length;
    const segment =
      segments.find((s) => s.start + s.distance >= distance) ||
      segments.at(-1)!;
    const t = (distance - segment.start) / segment.distance;
    const x = segment.x + segment.dx * t;
    const y = segment.y + segment.dy * t;
    return {
      transform: `translate(${x}px, ${y}px) rotate(${Math.atan2(segment.dy, segment.dx)}rad) translate(-50%, -50%)`,
      opacity:
        trailPulseOpacity * Math.min(1, progress / 0.08, (1 - progress) / 0.12),
      offset: progress,
    };
  });
  return { keyframes, width: length * trailPulseLength * 2 };
}

export function mount(element: HTMLDivElement) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const nodes = element.querySelectorAll<HTMLElement>(".hero-trail-pulse");
  const animations: Animation[] = [];
  trails.forEach((trail, index) => {
    [trail.left, trail.right].forEach((path, side) => {
      const node = nodes[index * 2 + side];
      const { keyframes, width } = ribbonMotion(path);
      node.style.width = `${width}px`;
      const animation = node.animate(keyframes, {
        duration: trailPulseDuration(index) * 500,
        delay: (trailPulseDelay(index) - 1.6) * 1000,
        iterations: Infinity,
        easing: "linear",
        fill: "both",
      });
      animation.pause();
      animations.push(animation);
    });
  });
  let visible = false;
  const sync = () => {
    const active = visible && !document.hidden && !reduced.matches;
    element.dataset.active = String(active);
    animations.forEach((animation) =>
      active ? animation.play() : animation.pause(),
    );
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  const resize = new ResizeObserver(([entry]) => {
    element.style.setProperty(
      "--hero-pulse-scale",
      String(entry.contentRect.height / 1000),
    );
  });
  resize.observe(element);
  observer.observe(element);
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  return () => {
    observer.disconnect();
    resize.disconnect();
    animations.forEach((animation) => animation.cancel());
    reduced.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}
