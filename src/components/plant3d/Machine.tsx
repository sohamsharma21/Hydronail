import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface MachineProps {
  position: [number, number, number];
  size?: [number, number, number];
  color: string;
  label: string;
  isActive?: boolean;
  rpm?: number;
  onClick?: () => void;
  type?: "box" | "filter" | "mixer" | "pump";
}

export function Machine({
  position,
  size = [2, 3, 2],
  color,
  label,
  isActive = true,
  rpm = 60,
  onClick,
  type = "box",
}: MachineProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (rotorRef.current && isActive) {
      rotorRef.current.rotation.y += (rpm / 60) * 0.1;
    }
    
    // Subtle vibration when active
    if (meshRef.current && isActive) {
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 20) * 0.01;
    }
  });

  const renderMachine = () => {
    switch (type) {
      case "mixer":
        return (
          <>
            {/* Main body */}
            <mesh ref={meshRef}>
              <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 32]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Rotating paddle */}
            <mesh ref={rotorRef} position={[0, -size[1] / 4, 0]}>
              <boxGeometry args={[size[0] * 0.8, 0.1, 0.2]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Paddle arm */}
            <mesh position={[0, size[1] / 4, 0]}>
              <cylinderGeometry args={[0.1, 0.1, size[1] / 2, 8]} />
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        );

      case "filter":
        return (
          <>
            <mesh ref={meshRef}>
              <boxGeometry args={size} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Filter grate */}
            {isActive && (
              <mesh ref={rotorRef} position={[0, 0, size[2] / 2 + 0.1]}>
                <cylinderGeometry args={[size[0] / 3, size[0] / 3, 0.2, 16]} />
                <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
              </mesh>
            )}
          </>
        );

      case "pump":
        return (
          <>
            <mesh ref={meshRef}>
              <cylinderGeometry args={[size[0] / 2, size[0] / 2 * 0.8, size[1], 32]} />
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Pump impeller */}
            <mesh ref={rotorRef} position={[0, size[1] / 2, 0]}>
              <torusGeometry args={[size[0] / 3, 0.1, 8, 16]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
            </mesh>
          </>
        );

      default:
        return (
          <mesh ref={meshRef}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </mesh>
        );
    }
  };

  return (
    <group position={position} onClick={onClick}>
      {renderMachine()}

      {/* Status LED */}
      <mesh position={[size[0] / 2 + 0.2, size[1] / 2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#22c55e" : "#ef4444"}
          emissive={isActive ? "#22c55e" : "#ef4444"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, size[1] / 2 + 0.6, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* RPM display for mixers */}
      {type === "mixer" && isActive && (
        <Text
          position={[0, -size[1] / 2 - 0.4, 0]}
          fontSize={0.3}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {`${rpm} RPM`}
        </Text>
      )}
    </group>
  );
}
