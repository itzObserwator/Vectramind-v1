"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  Vector3,
  Quaternion,
  Euler,
  type Group,
  type Mesh,
} from "three";
import { Component, useEffect, useMemo, useRef, type ReactNode } from "react";

function LightTrails({ still }: { still: boolean }) {
  const group = useRef<Group>(null);
  const curves = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const side = i < 20 ? 1 : -1;
        const offset = (i % 20) / 20;
        return new CatmullRomCurve3([
          new Vector3(-10, side * (4 + offset * 2), -offset * 2),
          new Vector3(-5, side * (2 + offset), -offset),
          new Vector3(0, side * (0.08 + offset * 0.18), offset * 0.4),
          new Vector3(5, side * (2 + offset), -offset),
          new Vector3(10, side * (4 + offset * 2), -offset * 2),
        ]);
      }),
    [],
  );
  useFrame(({ clock, pointer }) => {
    if (!group.current || still) return;
    const t = clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.12) * 0.045;
    group.current.rotation.y = pointer.x * 0.05;
    group.current.position.y = Math.sin(t * 0.24) * 0.13;
  });
  return (
    <group ref={group} rotation={[0.1, 0, 0]}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry
            args={[curve, 100, i % 5 === 0 ? 0.017 : 0.007, 4, false]}
          />
          <meshBasicMaterial
            color={i % 5 === 0 ? "#20a9da" : "#007BFF"}
            transparent
            opacity={i % 5 === 0 ? 0.55 : 0.18}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
// Each slat keeps its mesh and eases toward the next arrangement. Switching
// scroll states therefore morphs the geometry instead of replacing the scene.
function Slat({
  index,
  variant,
  still,
}: {
  index: number;
  variant: number;
  still: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const target = useMemo(() => {
    const t = (index / 27) * Math.PI * 2;
    const center = (index - 13.5) / 4.4;
    const position = new Vector3(
      ...((variant === 0
        ? [center, Math.sin(t) * 0.5, Math.cos(t) * 0.5]
        : variant === 1
          ? [Math.cos(t) * 1.9, Math.sin(t) * 1.9, Math.sin(t * 2) * 0.5]
          : [center, Math.sin(t * 1.5) * 0.8, Math.cos(t * 1.5) * 0.7]) as [
        number,
        number,
        number,
      ]),
    );
    const rotation = new Quaternion().setFromEuler(
      variant === 1
        ? new Euler(0, 0, t)
        : new Euler(0, Math.sin(t) * 0.35, Math.sin(t) * 0.18),
    );
    return {
      position,
      rotation,
      height: variant === 1 ? 1 : 2.1 + Math.cos(t) * 0.7,
    };
  }, [index, variant]);
  const initial = useRef(target);
  useEffect(() => {
    if (still && mesh.current) {
      mesh.current.position.copy(target.position);
      mesh.current.quaternion.copy(target.rotation);
      mesh.current.scale.y = target.height;
    }
  }, [still, target]);
  useFrame((_, delta) => {
    if (!mesh.current || still) return;
    const amount = 1 - Math.exp(-delta * 5);
    mesh.current.position.lerp(target.position, amount);
    mesh.current.quaternion.slerp(target.rotation, amount);
    mesh.current.scale.y += (target.height - mesh.current.scale.y) * amount;
  });
  return (
    <mesh
      ref={mesh}
      position={initial.current.position}
      quaternion={initial.current.rotation}
      scale={[1, initial.current.height, 1]}
    >
      <boxGeometry args={[0.1, 1, 1.2]} />
      <meshStandardMaterial
        color={index % 7 < 2 ? "#007BFF" : "#cbd8e6"}
        metalness={0.5}
        roughness={0.28}
      />
    </mesh>
  );
}
function Architecture({ variant, still }: { variant: number; still: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || still) return;
    group.current.rotation.y +=
      (pointer.x * 0.12 - group.current.rotation.y) * delta;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
  });
  return (
    <group ref={group} rotation={[0.2, -0.2, -0.15]}>
      {Array.from({ length: 28 }, (_, i) => (
        <Slat key={i} index={i} variant={variant} still={still} />
      ))}
    </group>
  );
}
function Globe({ still }: { still: boolean }) {
  const group = useRef<Group>(null);
  const rings = useMemo(() => {
    const paths: number[][] = [];
    for (let latitude = -60; latitude <= 60; latitude += 20) {
      const phi = (latitude * Math.PI) / 180;
      paths.push(
        Array.from({ length: 128 }, (_, i) => {
          const theta = (i / 128) * Math.PI * 2;
          return [
            Math.cos(theta) * Math.cos(phi) * 2,
            Math.sin(phi) * 2,
            Math.sin(theta) * Math.cos(phi) * 2,
          ];
        }).flat(),
      );
    }
    for (let longitude = 0; longitude < 180; longitude += 15) {
      const phi = (longitude * Math.PI) / 180;
      paths.push(
        Array.from({ length: 128 }, (_, i) => {
          const theta = (i / 128) * Math.PI * 2;
          return [
            Math.sin(theta) * Math.cos(phi) * 2,
            Math.cos(theta) * 2,
            Math.sin(theta) * Math.sin(phi) * 2,
          ];
        }).flat(),
      );
    }
    return paths.map((path) => new Float32Array(path));
  }, []);
  const pins = useMemo(
    () =>
      [
        [25.2, 55.3],
        [17.4, 78.5],
        [24.7, 46.7],
        [16.8, 81.7],
        [49.3, -123.1],
      ].map(([lat, lng]) => {
        const phi = (lat * Math.PI) / 180,
          theta = ((lng - 55) * Math.PI) / 180;
        return new Vector3(
          Math.sin(theta) * Math.cos(phi) * 2.04,
          Math.sin(phi) * 2.04,
          Math.cos(theta) * Math.cos(phi) * 2.04,
        );
      }),
    [],
  );
  useFrame((_, delta) => {
    if (group.current && !still) group.current.rotation.y += delta * 0.07;
  });
  return (
    <group ref={group} rotation={[0.08, -0.3, -0.12]}>
      <mesh>
        <sphereGeometry args={[1.98, 48, 32]} />
        <meshStandardMaterial
          color="#c8def4"
          metalness={0.15}
          roughness={0.6}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      {rings.map((positions, i) => (
        <lineLoop key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#397ed0" transparent opacity={0.25} />
        </lineLoop>
      ))}
      {pins.map((pin, i) => (
        <group key={i} position={pin}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 12]} />
            <meshBasicMaterial color="#007BFF" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.085, 16, 12]} />
            <meshBasicMaterial
              color="#007BFF"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      <mesh rotation={[Math.PI * 0.6, 0.25, 0]}>
        <torusGeometry args={[2.3, 0.004, 4, 160]} />
        <meshBasicMaterial color="#86addc" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function SignalScene({
  mode,
  variant = 0,
  still = false,
  visible = true,
  fallback,
  onReady,
}: {
  mode: "flow" | "architecture" | "globe";
  variant?: number;
  still?: boolean;
  visible?: boolean;
  fallback: ReactNode;
  onReady: () => void;
}) {
  return (
    <SceneBoundary fallback={fallback}>
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, mode === "flow" ? 10 : 8], fov: 44 }}
        frameloop={still || !visible ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={onReady}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[-4, 5, 6]} intensity={3} />
        <directionalLight position={[4, -2, 2]} color="#87baff" intensity={2} />
        {mode === "flow" ? (
          <LightTrails still={still} />
        ) : mode === "globe" ? (
          <Globe still={still} />
        ) : (
          <Architecture variant={variant} still={still} />
        )}
      </Canvas>
    </SceneBoundary>
  );
}
