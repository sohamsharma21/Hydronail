import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BlowerProps {
  position: [number, number, number];
  isActive?: boolean;
  label: string;
  onClick?: () => void;
}

export function Blower({
  position,
  isActive = true,
  label,
  onClick,
}: BlowerProps) {
  const fanRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (fanRef.current && isActive) {
      fanRef.current.rotation.y += 0.3;
    }
    // Vibration when active
    if (bodyRef.current && isActive) {
      bodyRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 30) * 0.02;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Blower body */}
      <mesh ref={bodyRef}>
        <cylinderGeometry args={[0.6, 0.5, 1, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Fan blades */}
      <mesh ref={fanRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 3]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Status LED */}
      <mesh position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#22c55e" : "#ef4444"}
          emissive={isActive ? "#22c55e" : "#ef4444"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
