// Bake the existing 3D camera projection once, instead of rebuilding 40 tubes
// and a WebGL context in every visitor's browser. The curves/camera are unchanged.
import { CatmullRomCurve3, Matrix4, PerspectiveCamera, Vector3 } from "three";
import { writeFile } from "node:fs/promises";
const camera = new PerspectiveCamera(44, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.updateMatrixWorld();
const rotation = new Matrix4().makeRotationX(0.1);
// Lighter linework without changing the curves or pulse timing.
const thicknessScale = 0.5;
const project = (point) => {
  const p = point.clone().applyMatrix4(rotation).project(camera);
  return [(p.x + 1) * 500, (1 - p.y) * 500];
};
// Remove collinear samples within a tenth of a viewBox pixel. This keeps the
// projected curves visually identical without shipping redundant coordinates.
function simplify(points, tolerance = 0.1) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0],
    [bx, by] = points.at(-1);
  const dx = bx - ax,
    dy = by - ay,
    length = dx * dx + dy * dy;
  let distance = 0,
    split = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const t = length
      ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length))
      : 0;
    const d = Math.hypot(x - ax - t * dx, y - ay - t * dy);
    if (d > distance) {
      distance = d;
      split = i;
    }
  }
  return distance > tolerance
    ? [
        ...simplify(points.slice(0, split + 1), tolerance).slice(0, -1),
        ...simplify(points.slice(split), tolerance),
      ]
    : [points[0], points.at(-1)];
}
const path = (points) =>
  simplify(points)
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ");
const trails = Array.from({ length: 40 }, (_, i) => {
  const side = i < 20 ? 1 : -1,
    offset = (i % 20) / 20;
  const curve = new CatmullRomCurve3([
    new Vector3(-10, side * (4 + offset * 2), -offset * 2),
    new Vector3(-5, side * (2 + offset), -offset),
    new Vector3(0, side * (0.08 + offset * 0.18), offset * 0.4),
    new Vector3(5, side * (2 + offset), -offset),
    new Vector3(10, side * (4 + offset * 2), -offset * 2),
  ]);
  const points = Array.from({ length: 101 }, (_, j) =>
    project(curve.getPointAt(j / 100)),
  );
  const middle = curve.getPointAt(0.5).applyMatrix4(rotation);
  const radius = (i % 5 === 0 ? 0.017 : 0.007) * thicknessScale;
  const width =
    (2 * radius * 1000) /
    (2 * Math.tan((22 * Math.PI) / 180) * (10 - middle.z));
  return {
    d: path(points),
    width: +width.toFixed(3),
    ...(i % 5 === 0
      ? {
          left: path(points.slice(0, 51)),
          right: path(points.slice(50).reverse()),
        }
      : {}),
  };
});
await writeFile(
  new URL("../src/components/visuals/hero-trail-paths.json", import.meta.url),
  JSON.stringify(trails),
);
// Static linework is a cacheable image, rather than geometry duplicated in
// the HTML and client JavaScript. Only the animated paths need DOM elements.
await writeFile(
  new URL("../src/components/visuals/hero-pulse-paths.json", import.meta.url),
  JSON.stringify(
    trails
      .filter((trail) => trail.left)
      .map(({ width, left, right }) => ({ width, left, right })),
  ),
);
await writeFile(
  new URL("../public/images/hero-ribbon-base.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1000 -500 3000 2000" fill="none">${trails.map((trail, index) => `<path d="${trail.d}" stroke="${index % 5 === 0 ? "#979797" : "#b8b8b8"}" stroke-width="${trail.width}" opacity="${index % 5 === 0 ? 0.3 : 0.14}"/>`).join("")}</svg>`,
);
await writeFile(
  new URL("../public/images/hero-ribbon-underlay.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" fill="none">${Array.from({ length: 24 }, (_, i) => `<path d="M -100 ${-80 + i * 9} C 250 ${50 + i * 8}, 400 ${640 - i * 6}, 600 390 S 1000 ${120 + i * 5}, 1300 ${i * 10 - 30}" stroke="${i % 4 === 0 ? "#afafaf" : "#c6c6c6"}" stroke-opacity=".14" stroke-width="${(i % 4 === 0 ? 2 : 1) * thicknessScale}"/>`).join("")}</svg>`,
);
console.log(
  "Baked 40 original hero trails, static artwork and 16 mirrored pulse paths.",
);
