import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PipeProps {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
  flowActive?: boolean;
}

export function Pipe({
  start,
  end,
  radius = 0.15,
  color = "#3b82f6",
  flowActive = true,
}: PipeProps) {
  const pipeRef = useRef<THREE.Mesh>(null);
  const flowRef = useRef<THREE.Points>(null);

  // Calculate pipe direction and length
  const direction = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    return endVec.clone().sub(startVec);
  }, [start, end]);

  const length = direction.length();
  const midpoint = useMemo(() => {
    return [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ] as [number, number, number];
  }, [start, end]);

  // Calculate rotation to align pipe with direction
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );
    return q;
  }, [direction]);

  // Flow particles
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(20 * 3);
    for (let i = 0; i < 20; i++) {
      const t = i / 20;
      positions[i * 3] = start[0] + direction.x * t;
      positions[i * 3 + 1] = start[1] + direction.y * t;
      positions[i * 3 + 2] = start[2] + direction.z * t;
    }
    return positions;
  }, [start, direction]);

  useFrame((state) => {
    if (flowRef.current && flowActive) {
      const positions = flowRef.current.geometry.attributes.position.array as Float32Array;
      const speed = 0.05;
      
      for (let i = 0; i < 20; i++) {
        const t = ((i / 20 + state.clock.elapsedTime * speed) % 1);
        positions[i * 3] = start[0] + direction.x * t;
        positions[i * 3 + 1] = start[1] + direction.y * t;
        positions[i * 3 + 2] = start[2] + direction.z * t;
      }
      flowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main pipe */}
      <mesh ref={pipeRef} position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Flow particles */}
      {flowActive && (
        <points ref={flowRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={20}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff"
            size={0.08}
            transparent
            opacity={0.8}
          />
        </points>
      )}

      {/* Pipe joints */}
      <mesh position={start}>
        <sphereGeometry args={[radius * 1.2, 16, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[radius * 1.2, 16, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}
