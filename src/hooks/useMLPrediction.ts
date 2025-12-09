import { useState } from "react";
import { Client } from "@gradio/client";
import { toast } from "@/components/ui/use-toast";

// HydroNail ML API Space
const SPACE_ID = "sohamsharma21/hydronail-ml-api";

// Types for API inputs
export interface WaterQualityInput {
  ph: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  tds: number;
  conductivity: number;
  chlorine: number;
  hardness: number;
}

export interface ChemicalDosingInput {
  ph: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  tds: number;
  alkalinity: number;
  volumeM3: number;
}

export interface EquipmentFailureInput {
  vibration: number;
  temperature: number;
  pressure: number;
  current: number;
  runtimeHours: number;
}

export interface TreatmentProcessInput {
  ph: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  tds: number;
  conductivity: number;
  chlorine: number;
  hardness: number;
  flowRate: number;
  tank1Level: number;
  tank2Level: number;
  tank3Level: number;
  hourOfDay: number;
  prevStage: number;
  waterSource: number; // 0=River, 1=Ground, 2=Industrial
}

// Response types
export interface MLPrediction {
  score: number;
  status: "Excellent" | "Good" | "Fair" | "Poor";
  timestamp: string;
  rawResponse?: string;
}

export interface ChemicalDosingResult {
  result: string;
  timestamp: string;
}

export interface EquipmentFailureResult {
  result: string;
  timestamp: string;
}

export interface TreatmentProcessResult {
  result: string;
  timestamp: string;
}

// Cached client instance
let gradioClient: Client | null = null;

async function getGradioClient(): Promise<Client> {
  if (!gradioClient) {
    gradioClient = await Client.connect(SPACE_ID);
  }
  return gradioClient;
}

// Hook for Water Quality Prediction (Model 1)
export function useWaterQualityPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  const predictQuality = async (input: WaterQualityInput): Promise<MLPrediction | null> => {
    setIsLoading(true);
    try {
      const client = await getGradioClient();
      
      const result = await client.predict("/predict_water_quality", {
        pH: input.ph,
        turbidity: input.turbidity,
        temperature: input.temperature,
        dissolved_oxygen: input.dissolvedOxygen,
        tds: input.tds,
        conductivity: input.conductivity,
        chlorine: input.chlorine,
        hardness: input.hardness,
      });

      const rawResponse = result.data[0] as string;
      
      // Parse the response - extract quality score from markdown response
      const scoreMatch = rawResponse.match(/(\d+(?:\.\d+)?)\s*%/);
      const qualityScore = scoreMatch ? parseFloat(scoreMatch[1]) : calculateQualityManually(input);

      let status: MLPrediction["status"] = "Poor";
      if (qualityScore >= 85) status = "Excellent";
      else if (qualityScore >= 70) status = "Good";
      else if (qualityScore >= 50) status = "Fair";

      const predictionResult: MLPrediction = {
        score: qualityScore,
        status,
        timestamp: new Date().toISOString(),
        rawResponse,
      };

      setPrediction(predictionResult);
      
      toast({
        title: "ML Prediction Success",
        description: `Water Quality: ${qualityScore.toFixed(1)}% - ${status}`,
      });
      
      return predictionResult;
    } catch (error) {
      console.error("Water quality prediction failed:", error);
      
      // Fallback calculation
      const fallbackScore = calculateQualityManually(input);
      const fallbackPrediction: MLPrediction = {
        score: fallbackScore,
        status: fallbackScore >= 85 ? "Excellent" : fallbackScore >= 70 ? "Good" : fallbackScore >= 50 ? "Fair" : "Poor",
        timestamp: new Date().toISOString(),
      };
      setPrediction(fallbackPrediction);
      
      toast({
        title: "Using Fallback Calculation",
        description: `Score: ${fallbackScore.toFixed(1)}% (Rule-based)`,
        variant: "destructive",
      });
      
      return fallbackPrediction;
    } finally {
      setIsLoading(false);
    }
  };

  return { predictQuality, isLoading, prediction };
}

// Hook for Chemical Dosing Prediction (Model 2)
export function useChemicalDosingPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChemicalDosingResult | null>(null);

  const predictDosing = async (input: ChemicalDosingInput): Promise<ChemicalDosingResult | null> => {
    setIsLoading(true);
    try {
      const client = await getGradioClient();
      
      const response = await client.predict("/predict_chemical_dosing", {
        pH: input.ph,
        turbidity: input.turbidity,
        temperature: input.temperature,
        dissolved_oxygen: input.dissolvedOxygen,
        tds: input.tds,
        alkalinity: input.alkalinity,
        volume_m3: input.volumeM3,
      });

      const rawResponse = response.data[0] as string;
      
      const dosingResult: ChemicalDosingResult = {
        result: rawResponse,
        timestamp: new Date().toISOString(),
      };

      setResult(dosingResult);
      
      toast({
        title: "Chemical Dosing Prediction",
        description: "Optimal dosing calculated successfully",
      });
      
      return dosingResult;
    } catch (error) {
      console.error("Chemical dosing prediction failed:", error);
      
      toast({
        title: "Prediction Failed",
        description: "Could not calculate chemical dosing",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { predictDosing, isLoading, result };
}

// Hook for Equipment Failure Prediction (Model 3)
export function useEquipmentFailurePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EquipmentFailureResult | null>(null);

  const predictFailure = async (input: EquipmentFailureInput): Promise<EquipmentFailureResult | null> => {
    setIsLoading(true);
    try {
      const client = await getGradioClient();
      
      const response = await client.predict("/predict_equipment_failure", {
        vibration: input.vibration,
        temperature: input.temperature,
        pressure: input.pressure,
        current: input.current,
        runtime_hours: input.runtimeHours,
      });

      const rawResponse = response.data[0] as string;
      
      const failureResult: EquipmentFailureResult = {
        result: rawResponse,
        timestamp: new Date().toISOString(),
      };

      setResult(failureResult);
      
      toast({
        title: "Equipment Failure Prediction",
        description: "Risk assessment completed",
      });
      
      return failureResult;
    } catch (error) {
      console.error("Equipment failure prediction failed:", error);
      
      toast({
        title: "Prediction Failed",
        description: "Could not assess equipment failure risk",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { predictFailure, isLoading, result };
}

// Hook for Treatment Process Prediction (Model 4)
export function useTreatmentProcessPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TreatmentProcessResult | null>(null);

  const predictProcess = async (input: TreatmentProcessInput): Promise<TreatmentProcessResult | null> => {
    setIsLoading(true);
    try {
      const client = await getGradioClient();
      
      const response = await client.predict("/predict_treatment_process", {
        pH: input.ph,
        turbidity: input.turbidity,
        temperature: input.temperature,
        dissolved_oxygen: input.dissolvedOxygen,
        tds: input.tds,
        conductivity: input.conductivity,
        chlorine: input.chlorine,
        hardness: input.hardness,
        flow_rate: input.flowRate,
        tank1_level: input.tank1Level,
        tank2_level: input.tank2Level,
        tank3_level: input.tank3Level,
        hour_of_day: input.hourOfDay,
        prev_stage: input.prevStage,
        water_source: input.waterSource,
      });

      const rawResponse = response.data[0] as string;
      
      const processResult: TreatmentProcessResult = {
        result: rawResponse,
        timestamp: new Date().toISOString(),
      };

      setResult(processResult);
      
      toast({
        title: "Treatment Process Prediction",
        description: "Process optimization complete",
      });
      
      return processResult;
    } catch (error) {
      console.error("Treatment process prediction failed:", error);
      
      toast({
        title: "Prediction Failed",
        description: "Could not optimize treatment process",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { predictProcess, isLoading, result };
}

// Legacy hook for backward compatibility
export function useMLPrediction() {
  const { predictQuality, isLoading, prediction } = useWaterQualityPrediction();
  
  // Adapter for old interface
  const legacyPredict = async (sensorData: WaterQualityInput) => {
    return predictQuality(sensorData);
  };

  return { predictQuality: legacyPredict, isLoading, prediction };
}

// Fallback calculation for water quality
function calculateQualityManually(data: WaterQualityInput): number {
  let score = 100;
  
  // pH scoring (optimal: 6.5-8.5)
  if (data.ph < 6.5 || data.ph > 8.5) score -= 15;
  else if (data.ph < 7.0 || data.ph > 8.0) score -= 5;
  
  // Turbidity scoring (optimal: <30)
  if (data.turbidity > 50) score -= 20;
  else if (data.turbidity > 30) score -= 10;
  
  // Temperature scoring (optimal: 15-35)
  if (data.temperature < 10 || data.temperature > 45) score -= 10;
  
  // DO scoring (optimal: >5)
  if (data.dissolvedOxygen < 3) score -= 20;
  else if (data.dissolvedOxygen < 5) score -= 10;
  
  // TDS scoring (optimal: <500)
  if (data.tds > 800) score -= 15;
  else if (data.tds > 500) score -= 8;
  
  // Chlorine scoring (optimal: 0.2-2.0)
  if (data.chlorine < 0.2 || data.chlorine > 2.0) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

// Export types for SensorData (legacy compatibility)
export type SensorData = WaterQualityInput;
