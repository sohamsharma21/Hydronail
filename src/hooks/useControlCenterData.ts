import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = 'http://localhost:5000';

interface SensorData {
  value: number;
  status: string;
}

interface StageQuality {
  sensors: {
    ph?: SensorData;
    turbidity_ntu?: SensorData;
    temperature_c?: SensorData;
    dissolved_oxygen_mg_l?: SensorData;
    total_chlorine_mg_l?: SensorData;
  };
  machines?: {
    running: number;
    stopped: number;
  };
}

interface MachineData {
  machine_id: string;
  name: string;
  stage: string;
  status: 'running' | 'stopped' | 'maintenance';
  health_score: number;
  failure_risk_percent: number;
  power_kw: number;
  rated_power_kw: number;
  speed_percent: number;
  efficiency_percent: number;
  temperature_c: number;
  vibration_mm_s: number;
  pressure_bar: number;
  flow_m3_h: number;
  runtime_hours: number;
  maintenance_hours_remaining: number;
  last_maintenance_date: string;
  control_mode: string;
  auto_enabled: boolean;
  last_command?: {
    action: string;
    timestamp: string;
  };
}

interface TreatmentData {
  equipment_control: {
    primary_treatment: Record<string, { status: string }>;
    secondary_treatment: Record<string, { status: string }>;
    tertiary_treatment: Record<string, { status: string }>;
    disinfection: Record<string, { status: string }>;
    sludge_treatment: Record<string, { status: string }>;
    dewatering: Record<string, { status: string }>;
  };
  optimization_metrics: {
    final_quality_score: number;
    total_power_consumption_kw: number;
    total_cost_INR: number;
    efficiency_percent: number;
    treatment_time_hours: number;
  };
  plant_status: {
    flow_rate_m3_h: number;
    tank1_level_percent: number;
    tank2_level_percent: number;
    tank3_level_percent: number;
  };
  machine_analytics: {
    total_machines: number;
    running_machines: number;
    stopped_machines: number;
    maintenance_machines: number;
  };
  water_quality_tracking: {
    inlet: Record<string, number>;
    after_secondary: Record<string, number>;
    after_tertiary: Record<string, number>;
    outlet: Record<string, number>;
  };
  recommendations: string[];
}

interface MqttStatus {
  mqtt_connected: boolean;
  last_message_time: string;
}

export interface ControlCenterState {
  treatment: TreatmentData | null;
  mqtt: MqttStatus | null;
  machines: MachineData[];
  stageQuality: {
    screening: StageQuality | null;
    aeration: StageQuality | null;
    filtration: StageQuality | null;
    final: StageQuality | null;
  };
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export function useControlCenterData() {
  const [state, setState] = useState<ControlCenterState>({
    treatment: null,
    mqtt: null,
    machines: [],
    stageQuality: {
      screening: null,
      aeration: null,
      filtration: null,
      final: null,
    },
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      const [treatment, mqtt, machinesRes, screening, aeration, filtration, final] = await Promise.all([
        fetchWithRetry(`${BASE_URL}/api/treatment-process`).catch(() => null),
        fetchWithRetry(`${BASE_URL}/api/mqtt/status`).catch(() => ({ mqtt_connected: false, last_message_time: '' })),
        fetchWithRetry(`${BASE_URL}/api/machines/summary`).catch(() => ({ machines: [] })),
        fetchWithRetry(`${BASE_URL}/api/stage/screening`).catch(() => ({ data: null })),
        fetchWithRetry(`${BASE_URL}/api/stage/aeration`).catch(() => ({ data: null })),
        fetchWithRetry(`${BASE_URL}/api/stage/filtration`).catch(() => ({ data: null })),
        fetchWithRetry(`${BASE_URL}/api/stage/final`).catch(() => ({ data: null })),
      ]);

      setState(prev => ({
        ...prev,
        treatment: treatment || prev.treatment,
        mqtt: mqtt || prev.mqtt,
        machines: machinesRes?.machines || prev.machines,
        stageQuality: {
          screening: screening?.data || prev.stageQuality.screening,
          aeration: aeration?.data || prev.stageQuality.aeration,
          filtration: filtration?.data || prev.stageQuality.filtration,
          final: final?.data || prev.stageQuality.final,
        },
        loading: false,
        error: null,
        lastUpdate: new Date(),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, []);

  const controlMachine = useCallback(async (machineId: string, action: 'start' | 'stop') => {
    try {
      const response = await fetch(`${BASE_URL}/api/control/${machineId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Control failed: ${response.status}`);
      const result = await response.json();
      // Refresh data after control
      setTimeout(fetchAllData, 1000);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Control failed' };
    }
  }, [fetchAllData]);

  const refresh = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
    intervalRef.current = setInterval(fetchAllData, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAllData]);

  return { ...state, controlMachine, refresh };
}
