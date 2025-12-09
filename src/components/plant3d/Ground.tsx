import { useRef } from "react";
import { Grid } from "@react-three/drei";

export function Ground() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#374151"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#4b5563"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Zone markers */}
      {/* Primary Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, 0.02, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>

      {/* Secondary Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.1} />
      </mesh>

      {/* Tertiary Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, 0.02, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
