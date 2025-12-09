import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PlantScene } from "@/components/plant3d/PlantScene";
import { ControlPanel } from "@/components/plant3d/ControlPanel";
import { BottomHUD } from "@/components/plant3d/BottomHUD";
import { CameraPresets } from "@/components/plant3d/CameraPresets";
import { useThingSpeak, parseThingSpeakReading } from "@/hooks/useThingSpeak";
import { useToast } from "@/hooks/use-toast";

export default function PlantDigitalTwin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: thingSpeakData } = useThingSpeak(5);

  const [cameraPreset, setCameraPreset] = useState("overview");

  const [controls, setControls] = useState({
    screenFilter1: true,
    screenFilter2: true,
    flashMixerRpm: 80,
    coagulantPump: 65,
    blower1: true,
    blower2: true,
    blower3: false,
    sandFilter1: true,
    sandFilter2: true,
    carbonFilter: true,
    uvIntensity: 85,
    chlorinePump: 40,
  });

  const [tankLevels, setTankLevels] = useState({
    intake: 75,
    aeration: 60,
    final: 85,
  });

  const [sensorData, setSensorData] = useState({
    ph: 7.2,
    turbidity: 18,
    dissolvedOxygen: 6.8,
  });

  const [metrics, setMetrics] = useState({
    power: 245,
    cost: 1240,
    flowRate: 1200,
    quality: 94,
  });

  // Update sensor data from ThingSpeak
  useEffect(() => {
    if (thingSpeakData?.feeds?.length) {
      const latest = thingSpeakData.feeds[thingSpeakData.feeds.length - 1];
      const parsed = parseThingSpeakReading(latest);
      setSensorData({
        ph: parsed.ph || 7.2,
        turbidity: parsed.turbidity || 18,
        dissolvedOxygen: parsed.dissolvedOxygen || 6.8,
      });

      // Simulate tank levels based on sensor data
      setTankLevels({
        intake: Math.round(Math.min(95, 70 + Math.random() * 20)),
        aeration: Math.round(Math.min(90, 55 + Math.random() * 25)),
        final: Math.round(Math.min(95, 80 + Math.random() * 15)),
      });
    }
  }, [thingSpeakData]);

  // Calculate metrics based on control settings
  useEffect(() => {
    const activeBlowers = [controls.blower1, controls.blower2, controls.blower3].filter(Boolean).length;
    const activeFilters = [controls.sandFilter1, controls.sandFilter2, controls.carbonFilter].filter(Boolean).length;
    
    const basePower = 100;
    const blowerPower = activeBlowers * 45;
    const filterPower = activeFilters * 15;
    const uvPower = (controls.uvIntensity / 100) * 30;
    const mixerPower = (controls.flashMixerRpm / 150) * 25;
    
    const totalPower = Math.round(basePower + blowerPower + filterPower + uvPower + mixerPower);
    const totalCost = Math.round(totalPower * 5.2);
    
    const baseQuality = 70;
    const filterBonus = activeFilters * 5;
    const uvBonus = (controls.uvIntensity / 100) * 10;
    const blowerBonus = activeBlowers * 3;
    
    const quality = Math.min(99, Math.round(baseQuality + filterBonus + uvBonus + blowerBonus));

    setMetrics({
      power: totalPower,
      cost: totalCost,
      flowRate: 1200,
      quality,
    });
  }, [controls]);

  const handleControlChange = (key: string, value: boolean | number) => {
    setControls((prev) => ({ ...prev, [key]: value }));
    
    toast({
      title: "Control Updated",
      description: `${key.replace(/([A-Z])/g, " $1").trim()} set to ${value}`,
    });
  };

  const handleGetRecommendations = () => {
    toast({
      title: "AI Analysis",
      description: "Analyzing plant performance... Recommendations: Increase Blower 3 for better DO levels.",
    });
  };

  const handleViewAnalytics = () => {
    navigate("/analytics");
  };

  const handleResetView = () => {
    setCameraPreset("overview");
  };

  const getSystemStatus = () => {
    if (sensorData.ph < 6.5 || sensorData.ph > 8.5 || sensorData.turbidity > 50) {
      return "critical";
    }
    if (sensorData.turbidity > 30 || sensorData.dissolvedOxygen < 5) {
      return "warning";
    }
    return "operational";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 relative">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <PlantScene
            controls={controls}
            tankLevels={tankLevels}
            cameraPreset={cameraPreset}
            onControlChange={handleControlChange}
          />
        </div>

        {/* Camera Presets (Top Left) */}
        <div className="absolute top-4 left-4 z-10">
          <CameraPresets
            activePreset={cameraPreset}
            onPresetChange={setCameraPreset}
          />
        </div>

        {/* Control Panel (Right Side) */}
        <div className="absolute top-4 right-4 z-10">
          <ControlPanel
            controls={controls}
            onControlChange={handleControlChange}
            metrics={metrics}
            onGetRecommendations={handleGetRecommendations}
            onViewAnalytics={handleViewAnalytics}
            onResetView={handleResetView}
          />
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <BottomHUD
            tankLevels={tankLevels}
            sensorData={sensorData}
            systemStatus={getSystemStatus()}
          />
        </div>
      </div>
    </div>
  );
}
