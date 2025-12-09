import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface UVUnitProps {
  position: [number, number, number];
  isActive?: boolean;
  intensity?: number;
  onClick?: () => void;
}

export function UVUnit({
  position,
  isActive = true,
  intensity = 80,
  onClick,
}: UVUnitProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current && isActive) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      glowRef.current.scale.setScalar(pulse);
    }
    if (lightRef.current) {
      lightRef.current.intensity = isActive ? (intensity / 100) * 2 : 0;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* UV Unit housing */}
      <mesh>
        <boxGeometry args={[3, 1.5, 1.5]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* UV tubes */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
            <meshStandardMaterial
              color={isActive ? "#a78bfa" : "#6b7280"}
              emissive={isActive ? "#8b5cf6" : "#000000"}
              emissiveIntensity={isActive ? intensity / 100 : 0}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* UV glow effect */}
      {isActive && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.15 * (intensity / 100)}
          />
        </mesh>
      )}

      {/* Point light for UV effect */}
      <pointLight
        ref={lightRef}
        color="#8b5cf6"
        intensity={isActive ? (intensity / 100) * 2 : 0}
        distance={5}
      />

      {/* Status LED */}
      <mesh position={[1.7, 0.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#22c55e" : "#ef4444"}
          emissive={isActive ? "#22c55e" : "#ef4444"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        UV Disinfection
      </Text>

      {/* Intensity display */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? `${intensity}%` : "OFF"}
      </Text>
    </group>
  );
}
