"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useInView } from "framer-motion";
import type { Group } from "three";
import { Component, Suspense, useRef, type ReactNode } from "react";

// A procedural scene: no proprietary reference models or textures are required.
function Form({
  mode,
  still,
}: {
  mode: "orb" | "layers" | "cluster";
  still: boolean;
}) {
  const group = useRef<Group>(null);
  const orb = useRef<Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || still) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x +=
      (pointer.y * 0.12 - group.current.rotation.x) * 0.025;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.11;
    if (orb.current) orb.current.rotation.z += delta * 0.08;
  });
  return (
    <group
      ref={group}
      rotation={[0.3, 0, -0.25]}
      scale={mode === "layers" ? 0.86 : 1}
    >
      {mode === "orb" ? (
        // A continuous blue connection joins two silver surfaces. All three
        // patches share one radius, keeping the silhouette and seams smooth.
        <group ref={orb} rotation={[0.3, 0, 0.45]}>
          {[
            { start: 0, length: 1.23, color: "#c9e3ff" },
            { start: 1.23, length: Math.PI - 2.46, color: "#007BFF" },
            { start: Math.PI - 1.23, length: 1.23, color: "#c9e3ff" },
          ].map(({ start, length, color }, index) => (
            <mesh key={index}>
              <sphereGeometry
                args={[1.65, 80, 40, 0, Math.PI * 2, start, length]}
              />
              <meshStandardMaterial
                color={color}
                metalness={0.66}
                roughness={0.28}
              />
            </mesh>
          ))}
        </group>
      ) : mode === "layers" ? (
        // Rounded layers share the sphere's smooth silhouette and material.
        // Small gaps keep each surface clean as the sculpture rotates.
        [-0.9, 0, 0.9].map((height, i) => (
          <mesh
            key={`layer-${i}`}
            position={[0, height, 0]}
            scale={[1.6, 0.4, 1.2]}
          >
            <sphereGeometry args={[1, 64, 48]} />
            <meshStandardMaterial
              color={i === 1 ? "#007BFF" : "#c9e3ff"}
              roughness={0.28}
              metalness={0.66}
            />
          </mesh>
        ))
      ) : (
        Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[
              ((i % 2) - 0.5) * 1.3,
              ((Math.floor(i / 2) % 2) - 0.5) * 1.3,
              (Math.floor(i / 4) - 0.5) * 1.3,
            ]}
          >
            <sphereGeometry args={[0.8, 40, 40]} />
            <meshStandardMaterial
              color={i === 2 ? "#007BFF" : "#b2d5f7"}
              metalness={0.7}
              roughness={0.22}
            />
          </mesh>
        ))
      )}
    </group>
  );
}
class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="orb-fallback" />
    ) : (
      this.props.children
    );
  }
}
export default function Sculpture({
  mode = "orb",
  still = false,
}: {
  mode?: "orb" | "layers" | "cluster";
  still?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "150px" });
  return (
    <div className="sculpture" ref={root} aria-hidden="true">
      <CanvasBoundary>
        <Suspense fallback={<div className="orb-fallback" />}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6], fov: 44 }}
            gl={{ alpha: true, antialias: true }}
            frameloop={still || !visible ? "demand" : "always"}
          >
            <ambientLight intensity={1.6} />
            <directionalLight
              position={[-3, 4, 5]}
              intensity={4}
              color="#ffffff"
            />
            <directionalLight
              position={[3, -2, -1]}
              intensity={2.8}
              color="#93adff"
            />
            <Form mode={mode} still={still} />
          </Canvas>
        </Suspense>
      </CanvasBoundary>
    </div>
  );
}
