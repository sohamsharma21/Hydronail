import React from 'react';
import { Zap, Gauge, IndianRupee, Clock, Lightbulb } from 'lucide-react';

interface EquipmentStatus {
  [key: string]: { status: string };
}

interface SystemOverviewProps {
  equipmentControl: {
    primary_treatment?: EquipmentStatus;
    secondary_treatment?: EquipmentStatus;
    tertiary_treatment?: EquipmentStatus;
    disinfection?: EquipmentStatus;
    sludge_treatment?: EquipmentStatus;
    dewatering?: EquipmentStatus;
  } | null;
  metrics: {
    total_power_consumption_kw: number;
    efficiency_percent: number;
    total_cost_INR: number;
    treatment_time_hours: number;
  } | null;
  flowRate: number;
  machineAnalytics: {
    total_machines: number;
    running_machines: number;
    stopped_machines: number;
    maintenance_machines: number;
  } | null;
  recommendations: string[];
}

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    running: 'bg-emerald-500',
    stopped: 'bg-gray-400',
    maintenance: 'bg-red-500',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colorMap[status.toLowerCase()] || 'bg-gray-400'}`} />
  );
};

const EquipmentSection: React.FC<{ title: string; equipment: EquipmentStatus | undefined }> = ({ title, equipment }) => {
  if (!equipment) return null;
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</h4>
      <div className="space-y-1">
        {Object.entries(equipment).map(([name, data]) => (
          <div key={name} className="flex items-center gap-2 text-sm">
            <StatusDot status={data.status} />
            <span className="truncate">{name.replace(/_/g, ' ')}</span>
            <span className="text-xs text-muted-foreground ml-auto capitalize">{data.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemOverview: React.FC<SystemOverviewProps> = ({
  equipmentControl,
  metrics,
  flowRate,
  machineAnalytics,
  recommendations,
}) => {
  const costPerM3 = metrics && flowRate > 0 
    ? (metrics.total_cost_INR / flowRate).toFixed(2) 
    : '--';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Equipment Control Status */}
      <div className="bg-card rounded-lg p-4 border lg:col-span-1">
        <h3 className="font-semibold mb-4">Equipment Control Status</h3>
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <EquipmentSection title="Primary Treatment" equipment={equipmentControl?.primary_treatment} />
          <EquipmentSection title="Secondary Treatment" equipment={equipmentControl?.secondary_treatment} />
          <EquipmentSection title="Tertiary Treatment" equipment={equipmentControl?.tertiary_treatment} />
          <EquipmentSection title="Disinfection" equipment={equipmentControl?.disinfection} />
          <EquipmentSection title="Sludge Treatment" equipment={equipmentControl?.sludge_treatment} />
          <EquipmentSection title="Dewatering" equipment={equipmentControl?.dewatering} />
        </div>
      </div>

      {/* System Metrics & Machine Analytics */}
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-semibold mb-4">System Metrics</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" /> Total Power
            </div>
            <p className="font-mono font-bold">{metrics?.total_power_consumption_kw?.toFixed(1) || '--'} kW</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Gauge className="h-3 w-3" /> Efficiency
            </div>
            <p className="font-mono font-bold">{metrics?.efficiency_percent?.toFixed(1) || '--'}%</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <IndianRupee className="h-3 w-3" /> Cost/m³
            </div>
            <p className="font-mono font-bold">₹{costPerM3}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" /> Treatment Time
            </div>
            <p className="font-mono font-bold">{metrics?.treatment_time_hours?.toFixed(1) || '--'} hrs</p>
          </div>
        </div>

        <h4 className="text-sm font-semibold mb-3">Machine Analytics</h4>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-emerald-100 rounded-lg">
            <p className="text-lg font-bold text-emerald-700">{machineAnalytics?.running_machines ?? '--'}</p>
            <p className="text-xs text-emerald-600">Running</p>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded-lg">
            <p className="text-lg font-bold text-gray-700">{machineAnalytics?.stopped_machines ?? '--'}</p>
            <p className="text-xs text-gray-600">Stopped</p>
          </div>
          <div className="text-center p-2 bg-red-100 rounded-lg">
            <p className="text-lg font-bold text-red-700">{machineAnalytics?.maintenance_machines ?? '--'}</p>
            <p className="text-xs text-red-600">Maintenance</p>
          </div>
          <div className="text-center p-2 bg-blue-100 rounded-lg">
            <p className="text-lg font-bold text-blue-700">{machineAnalytics?.total_machines ?? '--'}</p>
            <p className="text-xs text-blue-600">Total</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">System Recommendations</h3>
        </div>
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 5).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg text-sm">
                <span className="text-blue-500 mt-0.5">•</span>
                <p className="text-blue-900">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SystemOverview);
