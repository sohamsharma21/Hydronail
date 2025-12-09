import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import MachineCard from './MachineCard';

interface Machine {
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
  maintenance_hours_remaining: number;
}

interface MachineGridProps {
  machines: Machine[];
  onControl: (machineId: string, action: 'start' | 'stop') => Promise<{ success: boolean; message: string }>;
  onDetails: (machine: Machine) => void;
}

const STAGE_CONFIG: Record<string, { name: string; color: string }> = {
  screening: { name: 'Screening', color: '#3b82f6' },
  grit_removal: { name: 'Grit Removal', color: '#06b6d4' },
  aeration: { name: 'Aeration', color: '#eab308' },
  clarification: { name: 'Clarification', color: '#f59e0b' },
  filtration: { name: 'Filtration', color: '#10b981' },
  ro_system: { name: 'RO System', color: '#059669' },
  disinfection: { name: 'Disinfection', color: '#8b5cf6' },
  sludge_treatment: { name: 'Sludge Treatment', color: '#f97316' },
  dewatering: { name: 'Dewatering', color: '#f43f5e' },
};

const MACHINES_CONFIG = [
  { id: 'BAR_SCREEN_01', stage: 'screening', name: 'Bar Screen Rake' },
  { id: 'GRIT_PUMP_01', stage: 'grit_removal', name: 'Grit Pump' },
  { id: 'GRIT_AERATOR_01', stage: 'grit_removal', name: 'Grit Aerator' },
  { id: 'AERATION_BLOWER_01', stage: 'aeration', name: 'Aeration Blower #1' },
  { id: 'AERATION_BLOWER_02', stage: 'aeration', name: 'Aeration Blower #2' },
  { id: 'RAS_PUMP_01', stage: 'clarification', name: 'Return Sludge Pump' },
  { id: 'PSF_PUMP_01', stage: 'filtration', name: 'Sand Filter Pump' },
  { id: 'ACF_PUMP_01', stage: 'filtration', name: 'Carbon Filter Pump' },
  { id: 'UF_PUMP_01', stage: 'filtration', name: 'UF Feed Pump' },
  { id: 'RO_HP_PUMP_01', stage: 'ro_system', name: 'RO High Pressure Pump' },
  { id: 'UV_SYSTEM_01', stage: 'disinfection', name: 'UV Disinfection' },
  { id: 'OZONE_GEN_01', stage: 'disinfection', name: 'Ozone Generator' },
  { id: 'SLUDGE_PUMP_01', stage: 'sludge_treatment', name: 'Sludge Thickener Pump' },
  { id: 'THICKENER_RAKE_01', stage: 'sludge_treatment', name: 'Thickener Rake' },
  { id: 'SCREW_PRESS_01', stage: 'dewatering', name: 'Screw Press' },
  { id: 'BELT_PRESS_01', stage: 'dewatering', name: 'Belt Press' },
];

const MachineGrid: React.FC<MachineGridProps> = ({ machines, onControl, onDetails }) => {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(Object.keys(STAGE_CONFIG))
  );

  const toggleStage = (stage: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  // Group machines by stage with fallback to config
  const machinesByStage = Object.keys(STAGE_CONFIG).reduce((acc, stage) => {
    const stageConfig = MACHINES_CONFIG.filter(m => m.stage === stage);
    const stageMachines = stageConfig.map(config => {
      const liveData = machines.find(m => m.machine_id === config.id);
      return liveData || {
        machine_id: config.id,
        name: config.name,
        stage: config.stage,
        status: 'stopped' as const,
        health_score: 0,
        failure_risk_percent: 0,
        power_kw: 0,
        rated_power_kw: 0,
        speed_percent: 0,
        efficiency_percent: 0,
        temperature_c: 0,
        vibration_mm_s: 0,
        pressure_bar: 0,
        flow_m3_h: 0,
        maintenance_hours_remaining: 999,
      };
    });
    if (stageMachines.length > 0) {
      acc[stage] = stageMachines;
    }
    return acc;
  }, {} as Record<string, Machine[]>);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">All Machines (16)</h2>
      {Object.entries(machinesByStage).map(([stage, stageMachines]) => {
        const config = STAGE_CONFIG[stage];
        const isExpanded = expandedStages.has(stage);

        return (
          <div key={stage} className="bg-card rounded-lg border overflow-hidden">
            <button
              onClick={() => toggleStage(stage)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              style={{ borderLeft: `4px solid ${config.color}` }}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-semibold">{config.name}</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {stageMachines.length} machine{stageMachines.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-600">
                  {stageMachines.filter(m => m.status === 'running').length} running
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-gray-500">
                  {stageMachines.filter(m => m.status === 'stopped').length} stopped
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageMachines.map(machine => (
                  <MachineCard
                    key={machine.machine_id}
                    machine={machine}
                    stageColor={config.color}
                    onControl={onControl}
                    onDetails={onDetails}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(MachineGrid);
