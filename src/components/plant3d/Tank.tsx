import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface TankProps {
  position: [number, number, number];
  radius?: number;
  height?: number;
  color: string;
  label: string;
  waterLevel?: number;
  isActive?: boolean;
  onClick?: () => void;
  showBubbles?: boolean;
}

export function Tank({
  position,
  radius = 2,
  height = 4,
  color,
  label,
  waterLevel = 75,
  isActive = true,
  onClick,
  showBubbles = false,
}: TankProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  // Bubble particles
  const bubblePositions = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * radius * 1.5;
      positions[i * 3 + 1] = Math.random() * height * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.5;
    }
    return positions;
  }, [radius, height]);

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle water animation
      waterRef.current.position.y = -height / 2 + (height * waterLevel) / 200 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    if (bubblesRef.current && showBubbles && isActive) {
      const positions = bubblesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 50; i++) {
        positions[i * 3 + 1] += 0.03;
        if (positions[i * 3 + 1] > height * 0.9) {
          positions[i * 3 + 1] = 0;
        }
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Tank shell (glass-like) */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tank base */}
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, 0.2, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tank top rim */}
      <mesh position={[0, height / 2, 0]}>
        <torusGeometry args={[radius, 0.1, 8, 32]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Water inside */}
      <mesh ref={waterRef} position={[0, -height / 2 + (height * waterLevel) / 200, 0]}>
        <cylinderGeometry args={[radius * 0.95, radius * 0.95, (height * waterLevel) / 100, 32]} />
        <meshPhysicalMaterial
          color="#60a5fa"
          transparent
          opacity={0.7}
          roughness={0.1}
          transmission={0.5}
        />
      </mesh>

      {/* Bubbles */}
      {showBubbles && isActive && (
        <points ref={bubblesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={bubblePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#ffffff" size={0.1} transparent opacity={0.6} />
        </points>
      )}

      {/* Status LED */}
      <mesh position={[radius + 0.3, height / 2 - 0.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#22c55e" : "#ef4444"}
          emissive={isActive ? "#22c55e" : "#ef4444"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, height / 2 + 0.8, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Water level indicator */}
      <Text
        position={[0, -height / 2 - 0.5, 0]}
        fontSize={0.35}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {`${waterLevel}%`}
      </Text>
    </group>
  );
}
