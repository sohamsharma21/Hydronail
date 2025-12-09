import React, { useState } from 'react';
import { Play, Square, Info, AlertTriangle, Thermometer, Activity, Gauge, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MachineCardProps {
  machine: {
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
  };
  stageColor: string;
  onControl: (machineId: string, action: 'start' | 'stop') => Promise<{ success: boolean; message: string }>;
  onDetails: (machine: any) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, stageColor, onControl, onDetails }) => {
  const [controlling, setControlling] = useState(false);

  const handleControl = async (action: 'start' | 'stop') => {
    setControlling(true);
    await onControl(machine.machine_id, action);
    setControlling(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRiskBadge = (risk: number) => {
    if (risk > 50) return 'bg-red-100 text-red-700';
    if (risk > 20) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const getTempColor = (temp: number) => {
    if (temp > 65) return 'text-red-600';
    if (temp > 50) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getVibrationColor = (vib: number) => {
    if (vib > 1.5) return 'text-red-600';
    if (vib > 1.0) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const statusColors: Record<string, string> = {
    running: 'bg-emerald-100 text-emerald-700',
    stopped: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className={`p-3 border-l-4`} style={{ borderLeftColor: stageColor }}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-sm">{machine.name}</h4>
            <p className="text-xs text-muted-foreground font-mono">{machine.machine_id}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[machine.status]}`}>
            {machine.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Health & Risk */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Health</span>
              <span className="font-mono font-medium">{machine.health_score?.toFixed(0) || '--'}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${getHealthColor(machine.health_score || 0)}`}
                style={{ width: `${machine.health_score || 0}%` }}
              />
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-mono ${getRiskBadge(machine.failure_risk_percent || 0)}`}>
            {machine.failure_risk_percent?.toFixed(0) || '--'}% Risk
          </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded">
            <Zap className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Power</p>
            <p className="text-xs font-mono font-medium">
              {machine.power_kw?.toFixed(1) || '--'}/{machine.rated_power_kw || '--'}
            </p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <Activity className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Speed</p>
            <p className="text-xs font-mono font-medium">{machine.speed_percent?.toFixed(0) || '--'}%</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <Gauge className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Efficiency</p>
            <p className="text-xs font-mono font-medium">{machine.efficiency_percent?.toFixed(0) || '--'}%</p>
          </div>
        </div>

        {/* Operational Parameters */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Thermometer className={`h-3 w-3 ${getTempColor(machine.temperature_c || 0)}`} />
            <span className="text-muted-foreground">Temp:</span>
            <span className={`font-mono ${getTempColor(machine.temperature_c || 0)}`}>
              {machine.temperature_c?.toFixed(1) || '--'}°C
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className={`h-3 w-3 ${getVibrationColor(machine.vibration_mm_s || 0)}`} />
            <span className="text-muted-foreground">Vib:</span>
            <span className={`font-mono ${getVibrationColor(machine.vibration_mm_s || 0)}`}>
              {machine.vibration_mm_s?.toFixed(2) || '--'} mm/s
            </span>
          </div>
        </div>

        {/* Maintenance Warning */}
        {machine.maintenance_hours_remaining < 100 && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
            <AlertTriangle className="h-3 w-3" />
            <span>Maintenance in {machine.maintenance_hours_remaining?.toFixed(0)} hrs</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30 flex gap-2">
        {machine.status === 'stopped' && (
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleControl('start')}
            disabled={controlling}
          >
            {controlling ? 'Processing...' : <><Play className="h-3 w-3 mr-1" /> Start</>}
          </Button>
        )}
        {machine.status === 'running' && (
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => handleControl('stop')}
            disabled={controlling}
          >
            {controlling ? 'Processing...' : <><Square className="h-3 w-3 mr-1" /> Stop</>}
          </Button>
        )}
        {machine.status === 'maintenance' && (
          <Button size="sm" variant="outline" className="flex-1" disabled>
            In Maintenance
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onDetails(machine)}>
          <Info className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(MachineCard);
