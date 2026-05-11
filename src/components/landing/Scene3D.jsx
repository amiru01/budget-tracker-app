import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Stars,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

// Premium Dashboard Model with glass and depth
function DashboardModel() {
  const group = useRef();
  const floatingCards = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 6) * 0.15;
      group.current.position.y = Math.sin(t / 2.5) * 0.12;
    }

    // Floating cards animation
    floatingCards.current.forEach((card, i) => {
      if (card) {
        card.position.y += Math.sin(t / 3 + i) * 0.003;
        card.position.z = Math.sin(t / 4 + i * 0.5) * 0.3;
      }
    });
  });

  return (
    <group ref={group}>
      {/* Main Glass Dashboard Panel */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[4, 2.4, 0.12]}
        radius={0.1}
        smoothness={12}
      >
        <meshPhysicalMaterial
          color="#f0f9ff"
          metalness={0.1}
          roughness={0.15}
          transmission={0.95}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
          envMapIntensity={0.5}
        />
      </RoundedBox>

      {/* Ambient background glow */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[4.2, 2.6]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>

      {/* Dashboard content visualization - UI Bar 1 */}
      <RoundedBox
        position={[-1.2, 0.6, 0.15]}
        args={[1, 0.5, 0.04]}
        radius={0.02}
        smoothness={6}
      >
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          emissive="#10b981"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Dashboard content visualization - UI Bar 2 */}
      <RoundedBox
        position={[0.4, 0.6, 0.15]}
        args={[0.9, 0.5, 0.04]}
        radius={0.02}
        smoothness={6}
      >
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.3}
          roughness={0.4}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Dashboard content visualization - Chart area */}
      <RoundedBox
        position={[0, -0.3, 0.15]}
        args={[2.2, 0.9, 0.04]}
        radius={0.02}
        smoothness={6}
      >
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.5} />
      </RoundedBox>

      {/* Floating analytics chart bars with glow */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={`bar-${i}`}>
          <mesh position={[0.2 + i * 0.35, -0.1 + i * 0.08, 0.22]}>
            <cylinderGeometry args={[0.08, 0.08, 0.25 + i * 0.25, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#10b981" : "#3b82f6"}
              metalness={0.4}
              roughness={0.3}
              emissive={i % 2 === 0 ? "#10b981" : "#3b82f6"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Floating data cards */}
      {[0, 1].map((i) => (
        <RoundedBox
          key={`card-${i}`}
          ref={(el) => (floatingCards.current[i] = el)}
          position={[-1.8 + i * 3.6, 1.2, 0.3]}
          args={[0.8, 0.6, 0.05]}
          radius={0.02}
          smoothness={8}
        >
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.1}
            transmission={0.8}
            thickness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

// Floating ambient shapes with depth
function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [3, 1.5, -2], type: "octahedron", color: "#34d399", size: 0.5 },
      { pos: [-3, -1, 2], type: "torus", color: "#38bdf8", size: 0.4 },
      { pos: [2.5, -2, 0], type: "sphere", color: "#fbbf24", size: 0.35 },
      { pos: [-2, 2, -1], type: "icosahedron", color: "#f87171", size: 0.4 },
    ],
    [],
  );

  return (
    <>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={2 + i * 0.3}
          rotationIntensity={1.2 + i * 0.2}
          floatIntensity={1.5 + i * 0.1}
        >
          <group position={shape.pos}>
            {shape.type === "octahedron" && (
              <mesh>
                <octahedronGeometry args={[shape.size]} />
                <meshPhysicalMaterial
                  color={shape.color}
                  metalness={0.3}
                  roughness={0.4}
                  transmission={0.6}
                  ior={1.4}
                  wireframe={false}
                  emissive={shape.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}
            {shape.type === "torus" && (
              <mesh>
                <torusGeometry args={[shape.size, shape.size * 0.3, 16, 100]} />
                <meshPhysicalMaterial
                  color={shape.color}
                  metalness={0.4}
                  roughness={0.2}
                  transmission={0.8}
                  ior={1.5}
                  emissive={shape.color}
                  emissiveIntensity={0.3}
                />
              </mesh>
            )}
            {shape.type === "sphere" && (
              <mesh>
                <sphereGeometry args={[shape.size, 64, 64]} />
                <meshPhysicalMaterial
                  color={shape.color}
                  metalness={0.2}
                  roughness={0.3}
                  transmission={0.7}
                  ior={1.4}
                  emissive={shape.color}
                  emissiveIntensity={0.25}
                />
              </mesh>
            )}
            {shape.type === "icosahedron" && (
              <mesh>
                <icosahedronGeometry args={[shape.size]} />
                <meshPhysicalMaterial
                  color={shape.color}
                  metalness={0.35}
                  roughness={0.35}
                  transmission={0.5}
                  ior={1.4}
                  emissive={shape.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}
          </group>
        </Float>
      ))}
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none md:pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0f172a"]} />

        {/* Premium lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[12, 15, 8]}
          intensity={1.2}
          color="#10b981"
          castShadow
        />
        <directionalLight
          position={[-10, -8, -5]}
          intensity={0.6}
          color="#3b82f6"
        />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="#fbbf24" />

        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6.5, Math.PI / 6.5]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
            <DashboardModel />
          </Float>
          <FloatingShapes />
        </PresentationControls>

        {/* Enhanced contact shadows for depth */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={5}
          color="#000000"
        />

        {/* Premium environment lighting */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
