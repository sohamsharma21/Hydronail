import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface BottomHUDProps {
  tankLevels: {
    intake: number;
    aeration: number;
    final: number;
  };
  sensorData: {
    ph: number;
    turbidity: number;
    dissolvedOxygen: number;
  };
  systemStatus: "operational" | "warning" | "critical";
}

export function BottomHUD({ tankLevels, sensorData, systemStatus }: BottomHUDProps) {
  const statusConfig = {
    operational: {
      icon: CheckCircle2,
      text: "All Systems Operational",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    warning: {
      icon: AlertTriangle,
      text: "System Warning",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    critical: {
      icon: AlertTriangle,
      text: "Critical Alert",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  };

  const status = statusConfig[systemStatus];
  const StatusIcon = status.icon;

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl px-6 py-3">
      <div className="flex items-center justify-between gap-8">
        {/* Tank Levels */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Intake Tank:</span>
            <Badge variant={tankLevels.intake > 80 ? "default" : tankLevels.intake > 50 ? "secondary" : "destructive"}>
              {tankLevels.intake}%
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Aeration Tank:</span>
            <Badge variant={tankLevels.aeration > 80 ? "default" : tankLevels.aeration > 50 ? "secondary" : "destructive"}>
              {tankLevels.aeration}%
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Final Tank:</span>
            <Badge variant={tankLevels.final > 80 ? "default" : tankLevels.final > 50 ? "secondary" : "destructive"}>
              {tankLevels.final}%
            </Badge>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* Sensor Data */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">pH:</span>
            <span className="font-medium text-sm">{sensorData.ph.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Turbidity:</span>
            <span className="font-medium text-sm">{sensorData.turbidity.toFixed(0)} NTU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">DO:</span>
            <span className="font-medium text-sm">{sensorData.dissolvedOxygen.toFixed(1)} mg/L</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* System Status */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
        </div>
      </div>
    </div>
  );
}
