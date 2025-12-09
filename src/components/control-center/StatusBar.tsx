import React from 'react';
import { CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface StatusBarProps {
  tankLevels: {
    tank1: number;
    tank2: number;
    tank3: number;
  };
  mqttConnected: boolean;
  lastUpdate: Date | null;
  hasAlerts: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ tankLevels, mqttConnected, lastUpdate, hasAlerts }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t px-4 py-2 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        {/* Tank Levels */}
        <div className="flex items-center gap-4 font-mono">
          <span className="text-muted-foreground">Tank 1:</span>
          <span className="font-medium">{tankLevels.tank1?.toFixed(0) || '--'}%</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">Tank 2:</span>
          <span className="font-medium">{tankLevels.tank2?.toFixed(0) || '--'}%</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">Tank 3:</span>
          <span className="font-medium">{tankLevels.tank3?.toFixed(0) || '--'}%</span>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          {hasAlerts ? (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-amber-600">Alerts Active</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600">All Systems Operational</span>
            </>
          )}
        </div>

        {/* Update Time & MQTT Status */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Last Updated: {lastUpdate?.toLocaleTimeString() || '--'}</span>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            {mqttConnected ? (
              <>
                <Wifi className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatusBar);
