import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Text, PerspectiveCamera } from "@react-three/drei";
import { Tank } from "./Tank";
import { Machine } from "./Machine";
import { Pipe } from "./Pipe";
import { UVUnit } from "./UVUnit";
import { Blower } from "./Blower";
import { Ground } from "./Ground";

interface PlantSceneProps {
  controls: {
    screenFilter1: boolean;
    screenFilter2: boolean;
    flashMixerRpm: number;
    coagulantPump: number;
    blower1: boolean;
    blower2: boolean;
    blower3: boolean;
    sandFilter1: boolean;
    sandFilter2: boolean;
    carbonFilter: boolean;
    uvIntensity: number;
    chlorinePump: number;
  };
  tankLevels: {
    intake: number;
    aeration: number;
    final: number;
  };
  cameraPreset: string;
  onControlChange: (key: string, value: boolean | number) => void;
}

function PlantContent({ controls, tankLevels, onControlChange }: Omit<PlantSceneProps, "cameraPreset">) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={["#87CEEB", "#545454", 0.5]} />
      <pointLight position={[-15, 10, 0]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#f59e0b" />
      <pointLight position={[15, 10, 0]} intensity={0.5} color="#10b981" />

      {/* Ground */}
      <Ground />

      {/* Zone Labels */}
      <Text position={[-15, 8, -8]} fontSize={1} color="#3b82f6" anchorX="center">
        PRIMARY TREATMENT
      </Text>
      <Text position={[0, 8, -8]} fontSize={1} color="#f59e0b" anchorX="center">
        SECONDARY TREATMENT
      </Text>
      <Text position={[15, 8, -8]} fontSize={1} color="#10b981" anchorX="center">
        TERTIARY TREATMENT
      </Text>

      {/* ===== PRIMARY TREATMENT ZONE (Left, Blue) ===== */}
      
      {/* Intake Tank */}
      <Tank
        position={[-22, 3, 0]}
        radius={3}
        height={5}
        color="#3b82f6"
        label="Intake Tank"
        waterLevel={tankLevels.intake}
        isActive={true}
      />

      {/* Screen Filters */}
      <Machine
        position={[-17, 2, -2]}
        size={[2, 3, 1]}
        color="#1e40af"
        label="Screen Filter 1"
        isActive={controls.screenFilter1}
        type="filter"
        onClick={() => onControlChange("screenFilter1", !controls.screenFilter1)}
      />
      <Machine
        position={[-17, 2, 2]}
        size={[2, 3, 1]}
        color="#1e40af"
        label="Screen Filter 2"
        isActive={controls.screenFilter2}
        type="filter"
        onClick={() => onControlChange("screenFilter2", !controls.screenFilter2)}
      />

      {/* Flash Mixer */}
      <Machine
        position={[-13, 2, 0]}
        size={[2, 3, 2]}
        color="#60a5fa"
        label="Flash Mixer"
        isActive={controls.flashMixerRpm > 0}
        rpm={controls.flashMixerRpm}
        type="mixer"
      />

      {/* Coagulation Tank */}
      <Tank
        position={[-9, 2.5, 0]}
        radius={2.5}
        height={4}
        color="#3b82f6"
        label="Coagulation"
        waterLevel={70}
        isActive={controls.coagulantPump > 0}
      />

      {/* Flocculation Tank */}
      <Tank
        position={[-5, 2.5, 0]}
        radius={2.5}
        height={4}
        color="#2563eb"
        label="Flocculation"
        waterLevel={65}
        isActive={true}
      />

      {/* ===== SECONDARY TREATMENT ZONE (Center, Yellow) ===== */}

      {/* Aeration Tank */}
      <Tank
        position={[0, 4, 0]}
        radius={4}
        height={6}
        color="#fbbf24"
        label="Aeration Tank"
        waterLevel={tankLevels.aeration}
        isActive={controls.blower1 || controls.blower2 || controls.blower3}
        showBubbles={controls.blower1 || controls.blower2 || controls.blower3}
      />

      {/* Blowers on top of Aeration Tank */}
      <Blower
        position={[-1.5, 7.5, 0]}
        isActive={controls.blower1}
        label="Blower 1"
        onClick={() => onControlChange("blower1", !controls.blower1)}
      />
      <Blower
        position={[0, 7.5, 1.5]}
        isActive={controls.blower2}
        label="Blower 2"
        onClick={() => onControlChange("blower2", !controls.blower2)}
      />
      <Blower
        position={[1.5, 7.5, 0]}
        isActive={controls.blower3}
        label="Blower 3"
        onClick={() => onControlChange("blower3", !controls.blower3)}
      />

      {/* Secondary Settling Tank */}
      <Tank
        position={[6, 2.5, 0]}
        radius={3}
        height={4}
        color="#d97706"
        label="Settling Tank"
        waterLevel={60}
        isActive={true}
      />

      {/* ===== TERTIARY TREATMENT ZONE (Right, Green) ===== */}

      {/* Sand Filters */}
      <Tank
        position={[11, 2.5, -2]}
        radius={1.5}
        height={4}
        color="#10b981"
        label="Sand Filter 1"
        waterLevel={80}
        isActive={controls.sandFilter1}
        onClick={() => onControlChange("sandFilter1", !controls.sandFilter1)}
      />
      <Tank
        position={[11, 2.5, 2]}
        radius={1.5}
        height={4}
        color="#10b981"
        label="Sand Filter 2"
        waterLevel={80}
        isActive={controls.sandFilter2}
        onClick={() => onControlChange("sandFilter2", !controls.sandFilter2)}
      />

      {/* Activated Carbon Filter */}
      <Tank
        position={[15, 2.5, 0]}
        radius={1.5}
        height={4}
        color="#059669"
        label="Carbon Filter"
        waterLevel={75}
        isActive={controls.carbonFilter}
        onClick={() => onControlChange("carbonFilter", !controls.carbonFilter)}
      />

      {/* UV Disinfection Unit */}
      <UVUnit
        position={[19, 1.5, 0]}
        isActive={controls.uvIntensity > 0}
        intensity={controls.uvIntensity}
      />

      {/* Chlorination Chamber */}
      <Tank
        position={[22, 1.5, 0]}
        radius={1}
        height={2}
        color="#14b8a6"
        label="Chlorination"
        waterLevel={90}
        isActive={controls.chlorinePump > 0}
      />

      {/* Final Storage Tank */}
      <Tank
        position={[26, 4, 0]}
        radius={3.5}
        height={7}
        color="#22c55e"
        label="Final Storage"
        waterLevel={tankLevels.final}
        isActive={true}
      />

      {/* ===== CONNECTING PIPES ===== */}
      
      {/* Primary Zone Pipes */}
      <Pipe start={[-19, 2, 0]} end={[-17, 2, -2]} flowActive={controls.screenFilter1} />
      <Pipe start={[-19, 2, 0]} end={[-17, 2, 2]} flowActive={controls.screenFilter2} />
      <Pipe start={[-15, 2, -2]} end={[-14, 2, 0]} flowActive={controls.screenFilter1} />
      <Pipe start={[-15, 2, 2]} end={[-14, 2, 0]} flowActive={controls.screenFilter2} />
      <Pipe start={[-12, 2, 0]} end={[-11.5, 2, 0]} flowActive={controls.flashMixerRpm > 0} />
      <Pipe start={[-6.5, 2, 0]} end={[-5, 2, 0]} flowActive={true} />
      <Pipe start={[-2.5, 2, 0]} end={[-4, 2, 0]} flowActive={true} />

      {/* Secondary Zone Pipes */}
      <Pipe start={[4, 2, 0]} end={[3, 2, 0]} flowActive={true} />
      <Pipe start={[9, 2, 0]} end={[8, 2, 0]} flowActive={true} />

      {/* Tertiary Zone Pipes */}
      <Pipe start={[9.5, 2, 0]} end={[11, 2, -2]} flowActive={controls.sandFilter1} />
      <Pipe start={[9.5, 2, 0]} end={[11, 2, 2]} flowActive={controls.sandFilter2} />
      <Pipe start={[12.5, 2, -2]} end={[13.5, 2, 0]} flowActive={controls.sandFilter1} />
      <Pipe start={[12.5, 2, 2]} end={[13.5, 2, 0]} flowActive={controls.sandFilter2} />
      <Pipe start={[16.5, 2, 0]} end={[17.5, 1.5, 0]} flowActive={controls.carbonFilter} />
      <Pipe start={[20.5, 1.5, 0]} end={[21, 1.5, 0]} flowActive={controls.uvIntensity > 0} />
      <Pipe start={[23, 1.5, 0]} end={[23.5, 2, 0]} flowActive={controls.chlorinePump > 0} />
    </>
  );
}

export function PlantScene({ controls, tankLevels, cameraPreset, onControlChange }: PlantSceneProps) {
  const controlsRef = useRef<any>(null);

  // Camera positions for different presets
  const cameraPositions: Record<string, [number, number, number]> = {
    overview: [25, 20, 25],
    primary: [-15, 10, 15],
    secondary: [0, 12, 18],
    tertiary: [18, 10, 15],
    tanks: [0, 25, 0.1],
    pipes: [20, 5, 20],
  };

  const position = cameraPositions[cameraPreset] || cameraPositions.overview;

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={position} fov={60} />
      <Suspense fallback={null}>
        <PlantContent
          controls={controls}
          tankLevels={tankLevels}
          onControlChange={onControlChange}
        />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
