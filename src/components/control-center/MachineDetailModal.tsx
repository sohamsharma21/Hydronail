import React, { useState } from 'react';
import { X, Info, Activity, Thermometer, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MachineDetailModalProps {
  machine: {
    machine_id: string;
    name: string;
    stage: string;
    status: string;
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
  };
  onClose: () => void;
}

const tabs = [
  { id: 'info', label: 'Information', icon: Info },
  { id: 'performance', label: 'Performance', icon: Activity },
  { id: 'sensors', label: 'Sensors', icon: Thermometer },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
];

const MachineDetailModal: React.FC<MachineDetailModalProps> = ({ machine, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  const statusColors: Record<string, string> = {
    running: 'bg-emerald-100 text-emerald-700',
    stopped: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">{machine.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{machine.machine_id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Machine ID</p>
                  <p className="font-mono font-medium">{machine.machine_id}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Stage</p>
                  <p className="font-medium capitalize">{machine.stage?.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={`text-sm px-2 py-1 rounded-full font-medium capitalize ${statusColors[machine.status]}`}>
                    {machine.status}
                  </span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Control Mode</p>
                  <p className="font-medium capitalize">{machine.control_mode || 'Manual'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Auto Enabled</p>
                  <p className="font-medium">{machine.auto_enabled ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Last Command</p>
                  <p className="font-medium">
                    {machine.last_command?.action || '--'} at{' '}
                    {machine.last_command?.timestamp
                      ? new Date(machine.last_command.timestamp).toLocaleTimeString()
                      : '--'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Health Score</p>
                  <p className="text-2xl font-bold font-mono">{machine.health_score?.toFixed(1) || '--'}%</p>
                  <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${machine.health_score >= 70 ? 'bg-emerald-500' : machine.health_score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${machine.health_score || 0}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Failure Risk</p>
                  <p className="text-2xl font-bold font-mono">{machine.failure_risk_percent?.toFixed(1) || '--'}%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Power Consumption</p>
                  <p className="text-2xl font-bold font-mono">
                    {machine.power_kw?.toFixed(1) || '--'} / {machine.rated_power_kw || '--'} kW
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Speed</p>
                  <p className="text-2xl font-bold font-mono">{machine.speed_percent?.toFixed(0) || '--'}%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground mb-2">Efficiency</p>
                  <p className="text-2xl font-bold font-mono">{machine.efficiency_percent?.toFixed(1) || '--'}%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sensors' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Temperature</p>
                  <p className="text-2xl font-bold font-mono">{machine.temperature_c?.toFixed(1) || '--'}°C</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Vibration</p>
                  <p className="text-2xl font-bold font-mono">{machine.vibration_mm_s?.toFixed(2) || '--'} mm/s</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Pressure</p>
                  <p className="text-2xl font-bold font-mono">{machine.pressure_bar?.toFixed(2) || '--'} bar</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Flow Rate</p>
                  <p className="text-2xl font-bold font-mono">{machine.flow_m3_h?.toFixed(1) || '--'} m³/h</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground mb-2">Runtime Hours</p>
                  <p className="text-2xl font-bold font-mono">{machine.runtime_hours?.toFixed(0) || '--'} hours</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Last Maintenance</p>
                  <p className="text-lg font-medium">
                    {machine.last_maintenance_date
                      ? new Date(machine.last_maintenance_date).toLocaleDateString()
                      : '--'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${machine.maintenance_hours_remaining < 100 ? 'bg-orange-100' : 'bg-muted/50'}`}>
                  <p className="text-xs text-muted-foreground mb-2">Hours Until Maintenance</p>
                  <p className={`text-2xl font-bold font-mono ${machine.maintenance_hours_remaining < 100 ? 'text-orange-600' : ''}`}>
                    {machine.maintenance_hours_remaining?.toFixed(0) || '--'} hours
                  </p>
                  {machine.maintenance_hours_remaining < 100 && (
                    <p className="text-sm text-orange-600 mt-2">Maintenance required soon</p>
                  )}
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Next Scheduled Service</p>
                  <p className="text-lg font-medium">
                    {machine.last_maintenance_date
                      ? new Date(
                          new Date(machine.last_maintenance_date).getTime() + 30 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()
                      : '--'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailModal;
