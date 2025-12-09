import React from 'react';
import { Activity, Droplets, Zap, IndianRupee } from 'lucide-react';

interface KPIMetricsProps {
  flowRate: number;
  qualityScore: number;
  totalPower: number;
  operatingCost: number;
  lastUpdate: Date | null;
}

const KPIMetrics: React.FC<KPIMetricsProps> = ({
  flowRate,
  qualityScore,
  totalPower,
  operatingCost,
  lastUpdate,
}) => {
  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-red-600 border-red-500 bg-red-50';
  };

  const metrics = [
    {
      label: 'Flow Rate',
      value: flowRate?.toFixed(1) || '--',
      unit: 'm³/h',
      icon: Activity,
      colorClass: 'text-blue-600 border-blue-500 bg-blue-50',
    },
    {
      label: 'Water Quality Score',
      value: qualityScore?.toFixed(1) || '--',
      unit: '%',
      icon: Droplets,
      colorClass: getQualityColor(qualityScore || 0),
    },
    {
      label: 'Total Power',
      value: totalPower?.toFixed(1) || '--',
      unit: 'kW',
      icon: Zap,
      colorClass: 'text-orange-600 border-orange-500 bg-orange-50',
    },
    {
      label: 'Operating Cost',
      value: operatingCost?.toFixed(0) || '--',
      unit: '₹',
      icon: IndianRupee,
      colorClass: 'text-purple-600 border-purple-500 bg-purple-50',
      prefix: '₹',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`p-4 rounded-lg border-l-4 ${metric.colorClass} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold font-mono mt-1">
                  {metric.prefix || ''}{metric.value}
                  <span className="text-sm font-normal ml-1 text-muted-foreground">
                    {!metric.prefix && metric.unit}
                  </span>
                </p>
              </div>
              <metric.icon className="h-8 w-8 opacity-60" />
            </div>
          </div>
        ))}
      </div>
      {lastUpdate && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default React.memo(KPIMetrics);
