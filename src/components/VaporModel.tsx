"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, Torus, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function OrbitingRing({ radius, color, speed, rotationOffset }: { radius: number, color: string, speed: number, rotationOffset: [number, number, number] }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x += rotationOffset[0] * speed;
    ringRef.current.rotation.y += rotationOffset[1] * speed;
    ringRef.current.rotation.z += rotationOffset[2] * speed;
  });

  return (
    <group ref={ringRef}>
      <mesh>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={20}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function TechOrb() {
  const groupRef = useRef<THREE.Group>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !cageRef.current || !coreRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth floating motion
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.5;
    groupRef.current.position.x = 6 + Math.cos(t * 0.3) * 0.5;
    
    // Fast spinning cage
    cageRef.current.rotation.y = t * 3;
    cageRef.current.rotation.z = t * 1.5;
    
    // Intense core pulsing
    const pulse = 1 + Math.sin(t * 15) * 0.08;
    coreRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={[6, 0, 0]} ref={groupRef}>
      {/* Outer Cage Structure (Grid) */}
      <mesh ref={cageRef}>
        <sphereGeometry args={[2.8, 24, 24]} />
        <meshStandardMaterial
          color="#00d4ff"
          wireframe
          wireframeLinewidth={3}
          emissive="#00d4ff"
          emissiveIntensity={4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Internal High-Intensity Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00d4ff"
          emissiveIntensity={25}
          transparent
          opacity={1}
        />
        <pointLight intensity={30} distance={10} color="#00d4ff" />
      </mesh>

      {/* Atmospheric Glow inside cage */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshStandardMaterial
          color="#0066ff"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Colorful Orbiting Trails (Inspired by image) */}
      <OrbitingRing radius={3.1} color="#00ffcc" speed={0.02} rotationOffset={[1, 1, 0]} />
      <OrbitingRing radius={3.3} color="#ff00ff" speed={0.015} rotationOffset={[0, 1, 1]} />
      <OrbitingRing radius={3.5} color="#00d4ff" speed={0.025} rotationOffset={[1, 0, 1]} />
      <OrbitingRing radius={3.8} color="#ffff00" speed={0.01} rotationOffset={[0.5, 1, 0.5]} />
      
      {/* Sparkles around the orb */}
      <Sparkles count={50} scale={6} size={2} speed={0.4} color="#00d4ff" />
    </group>
  );
}

export function VaporModel() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.1} />
        
        {/* Dense Star Field from image */}
        <Stars radius={100} depth={50} count={10000} factor={6} saturation={0.5} fade speed={2} />
        
        {/* Distant space dust */}
        <Sparkles count={1000} scale={100} size={1} speed={0.1} color="#ffffff" />
        
        <TechOrb />
        
        <fog attach="fog" args={["#020205", 5, 30]} />
      </Canvas>
    </div>
  );
}
