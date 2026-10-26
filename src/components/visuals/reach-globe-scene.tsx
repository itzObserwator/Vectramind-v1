"use client";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Vector3,
  Mesh,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  Timer,
} from "three";
import { reachLocations } from "@/content/global-reach";
// A single regular sample per land point keeps the reference's crisp dot pattern.
const vertex = `varying float alpha; uniform float pixelRatio; uniform float dotScale;
void main(){vec4 p=modelViewMatrix*vec4(position,1.); float facing=dot(normalize(normalMatrix*position),normalize(-p.xyz));
alpha=smoothstep(0.,.25,facing)*(.45+.55*max(0.,facing)); gl_PointSize=pixelRatio*dotScale*clamp(17./-p.z,1.3,3.); gl_Position=projectionMatrix*p;}`;
const fragment = `varying float alpha; void main(){float d=length(gl_PointCoord-.5); if(d>.5)discard;
gl_FragColor=vec4(.12,.14,.17,alpha*(1.-smoothstep(.32,.5,d)));}`;
const surfaceVertex = `varying vec3 n; varying vec3 eye; void main(){vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); eye=normalize(-p.xyz); gl_Position=projectionMatrix*p;}`;
const surfaceFragment = `varying vec3 n; varying vec3 eye; void main(){float edge=pow(1.-max(0.,dot(normalize(n),normalize(eye))),2.); gl_FragColor=vec4(mix(vec3(.985),vec3(.84,.91,.98),edge),1.);}`;
type MapProps = {
  data: number[];
  still: boolean;
  selectedOffice: number;
  labels: RefObject<SVGSVGElement | null>;
};
export default function ReachGlobeScene({
  data,
  visible,
  still,
  fallback,
  onReady,
  selectedOffice,
  labels,
}: MapProps & {
  visible: boolean;
  fallback: ReactNode;
  onReady: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const props = useRef({ visible, still, selectedOffice, onReady });
  props.current = { visible, still, selectedOffice, onReady };
  const wake = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: WebGLRenderer;
    const canvas = document.createElement("canvas");
    const attributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    };
    const unavailable = () => {
      setFailed(true);
      props.current.onReady();
    };
    try {
      // A phone may disable WebGL to conserve resources. Check before Three's
      // constructor, which logs an error before throwing on unsupported GPUs.
      const context = canvas.getContext("webgl2", attributes);
      if (!context) {
        unavailable();
        return;
      }
      renderer = new WebGLRenderer({
        canvas,
        context,
        ...attributes,
      });
    } catch {
      unavailable();
      return;
    }
    canvas.style.cssText = "display:block;width:100%;height:100%";
    container.append(canvas);
    const scene = new Scene();
    const camera = new PerspectiveCamera(39, 1, 0.1, 1000);
    camera.position.set(0, 0, 7.35);
    camera.updateMatrixWorld();
    const earth = new Group();
    scene.add(earth);
    const surfaceGeometry = new SphereGeometry(2.392, 48, 32);
    const surfaceMaterial = new ShaderMaterial({
      vertexShader: surfaceVertex,
      fragmentShader: surfaceFragment,
    });
    earth.add(new Mesh(surfaceGeometry, surfaceMaterial));
    const dotMaterial = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: { pixelRatio: { value: 1 }, dotScale: { value: 1 } },
    });
    const points = new Points(new BufferGeometry(), dotMaterial);
    points.frustumCulled = false;
    earth.add(points);
    let compact: boolean | undefined;
    let width = 1,
      height = 1;
    const annotations = Array.from(
      labels.current?.querySelectorAll<SVGGElement>("[data-location]") || [],
    ).map((root) => ({
      root,
      leader: root.querySelector<SVGPathElement>("path")!,
      label: root.querySelector<SVGGElement>(".reach-location-label")!,
    }));
    const pins = reachLocations.map((location) => {
      const lat = (location.latitude * Math.PI) / 180,
        lon = (location.longitude * Math.PI) / 180;
      return new Vector3(
        Math.cos(lat) * Math.sin(lon) * 2.42,
        Math.sin(lat) * 2.42,
        Math.cos(lat) * Math.cos(lon) * 2.42,
      );
    });
    const world = new Vector3(),
      projected = new Vector3();
    let rotation = (-reachLocations[0].longitude * Math.PI) / 180;
    let tilt = (reachLocations[0].latitude * Math.PI) / 180;
    let request = 0,
      previous = 0,
      elapsed = 0,
      lastStamp = 0,
      disposed = false;
    // Timer is Three's visibility-aware replacement for the deprecated Clock.
    const timer = new Timer();
    timer.connect(document);
    const paint = (now: number) => {
      request = 0;
      if (disposed || !props.current.visible || document.hidden) return;
      if (previous && now - previous < 1000 / 30) {
        request = requestAnimationFrame(paint);
        return;
      }
      previous = now;
      timer.update(now);
      const delta = Math.min(timer.getDelta(), 0.05);
      const { selectedOffice: selected, still: reduced } = props.current;
      const target = (-reachLocations[selected].longitude * Math.PI) / 180;
      const latitude = (reachLocations[selected].latitude * Math.PI) / 180;
      const difference = Math.atan2(
        Math.sin(target - rotation),
        Math.cos(target - rotation),
      );
      const latitudeDifference = latitude - tilt;
      const ease = reduced ? 1 : 1 - Math.exp(-delta * 5);
      rotation += difference * ease;
      tilt += latitudeDifference * ease;
      earth.rotation.set(tilt, rotation, 0);
      const settled =
        reduced || Math.abs(difference) + Math.abs(latitudeDifference) < 0.001;
      if (!reduced && !settled) elapsed += delta;
      canvas.dataset.motion = settled ? "settled" : "moving";
      canvas.dataset.office = reachLocations[selected].name;
      earth.updateWorldMatrix(true, false);
      pins.forEach((pin, index) => {
        const annotation = annotations[index];
        if (!annotation) return;
        earth.localToWorld(world.copy(pin));
        const front = camera.position.dot(world) - world.lengthSq() > 0.15;
        annotation.root.style.opacity = front ? "1" : "0";
        annotation.label.style.opacity = index === selected ? "1" : "0";
        annotation.leader.style.opacity = index === selected ? "1" : "0";
        annotation.root.dataset.facing = front ? "front" : "back";
        projected.copy(world).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width,
          y = (-projected.y * 0.5 + 0.5) * height;
        const labelWidth = reachLocations[index].name.length * 6.3 + 18;
        const lx =
          Math.max(12, Math.min(width - labelWidth - 12, x - labelWidth / 2)) -
          x;
        annotation.root.setAttribute(
          "transform",
          `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
        );
        annotation.leader.setAttribute("d", `M0 0L${lx + labelWidth / 2} 30`);
        annotation.label.setAttribute("transform", `translate(${lx} 18)`);
      });
      if (elapsed - lastStamp > 0.45 || !canvas.dataset.rotation) {
        canvas.dataset.rotation = elapsed.toFixed(3);
        lastStamp = elapsed;
      }
      renderer.render(scene, camera);
      props.current.onReady();
      if (!settled) request = requestAnimationFrame(paint);
    };
    const start = () => {
      if (!props.current.visible || document.hidden) {
        cancelAnimationFrame(request);
        request = 0;
        return;
      }
      if (!request) {
        previous = 0;
        timer.reset();
        request = requestAnimationFrame(paint);
      }
    };
    wake.current = start;
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      const density = Math.min(1, Math.sqrt(1_400_000 / (width * height)));
      renderer.setPixelRatio(density);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dotMaterial.uniforms.pixelRatio.value = density;
      const nextCompact = width <= 900;
      if (compact !== nextCompact) {
        compact = nextCompact;
        const positions: number[] = [];
        let land = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 0.5 || (compact && land++ % 2)) continue;
          positions.push(
            data[i] * 2.405,
            data[i + 1] * 2.405,
            data[i + 2] * 2.405,
          );
        }
        points.geometry.dispose();
        points.geometry = new BufferGeometry();
        points.geometry.setAttribute(
          "position",
          new Float32BufferAttribute(positions, 3),
        );
        dotMaterial.uniforms.dotScale.value = compact ? 0.7 : 1;
      }
      start();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    document.addEventListener("visibilitychange", start);
    resize();
    return () => {
      disposed = true;
      wake.current = () => {};
      cancelAnimationFrame(request);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      timer.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      points.geometry.dispose();
      dotMaterial.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [data, labels]);
  useEffect(() => wake.current(), [visible, still, selectedOffice]);
  return failed ? (
    <div
      className="reach-globe-unavailable"
      style={{ position: "absolute", inset: 0 }}
    >
      {fallback}
    </div>
  ) : (
    <div ref={host} style={{ position: "absolute", inset: 0 }} />
  );
}
