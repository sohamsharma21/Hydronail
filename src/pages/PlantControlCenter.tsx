import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Clock, Settings, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useControlCenterData } from '@/hooks/useControlCenterData';
import KPIMetrics from '@/components/control-center/KPIMetrics';
import TreatmentFlow from '@/components/control-center/TreatmentFlow';
import SystemOverview from '@/components/control-center/SystemOverview';
import MachineGrid from '@/components/control-center/MachineGrid';
import MachineDetailModal from '@/components/control-center/MachineDetailModal';
import StatusBar from '@/components/control-center/StatusBar';

const PlantControlCenter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMachine, setSelectedMachine] = useState<any>(null);

  const {
    treatment,
    mqtt,
    machines,
    stageQuality,
    loading,
    error,
    lastUpdate,
    controlMachine,
    refresh,
  } = useControlCenterData();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMachineControl = useCallback(async (machineId: string, action: 'start' | 'stop') => {
    const result = await controlMachine(machineId, action);
    if (result.success) {
      toast.success(`Machine ${action === 'start' ? 'started' : 'stopped'} successfully`);
    } else {
      toast.error(result.message || `Failed to ${action} machine`);
    }
    return result;
  }, [controlMachine]);

  const handleMachineDetails = useCallback((machine: any) => {
    setSelectedMachine(machine);
  }, []);

  if (loading && !treatment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">Loading Plant Data</p>
          <p className="text-sm text-muted-foreground">Connecting to control systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-xl font-bold">Plant Control Center</h1>
              <p className="text-sm text-muted-foreground">Real-time Water Treatment Monitoring</p>
            </div>

            {/* Current Time */}
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{currentTime.toLocaleTimeString()}</span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* MQTT Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                {mqtt?.mqtt_connected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Wifi className="h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline text-emerald-600">Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="hidden sm:inline text-red-600">Disconnected</span>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border-b border-red-200 px-4 py-2 text-sm text-red-700">
            <span>Connection Error: {error}</span>
            <Button variant="link" size="sm" onClick={refresh} className="ml-2 text-red-700">
              Retry
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Metrics */}
        <KPIMetrics
          flowRate={treatment?.plant_status?.flow_rate_m3_h || 0}
          qualityScore={treatment?.optimization_metrics?.final_quality_score || 0}
          totalPower={treatment?.optimization_metrics?.total_power_consumption_kw || 0}
          operatingCost={treatment?.optimization_metrics?.total_cost_INR || 0}
          lastUpdate={lastUpdate}
        />

        {/* Treatment Flow */}
        <TreatmentFlow
          screening={stageQuality.screening}
          aeration={stageQuality.aeration}
          filtration={stageQuality.filtration}
          final={stageQuality.final}
        />

        {/* System Overview */}
        <SystemOverview
          equipmentControl={treatment?.equipment_control || null}
          metrics={treatment?.optimization_metrics || null}
          flowRate={treatment?.plant_status?.flow_rate_m3_h || 0}
          machineAnalytics={treatment?.machine_analytics || null}
          recommendations={treatment?.recommendations || []}
        />

        {/* Machine Grid */}
        <MachineGrid
          machines={machines}
          onControl={handleMachineControl}
          onDetails={handleMachineDetails}
        />
      </main>

      {/* Status Bar */}
      <StatusBar
        tankLevels={{
          tank1: treatment?.plant_status?.tank1_level_percent || 0,
          tank2: treatment?.plant_status?.tank2_level_percent || 0,
          tank3: treatment?.plant_status?.tank3_level_percent || 0,
        }}
        mqttConnected={mqtt?.mqtt_connected || false}
        lastUpdate={lastUpdate}
        hasAlerts={false}
      />

      {/* Machine Detail Modal */}
      {selectedMachine && (
        <MachineDetailModal
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}
    </div>
  );
};

export default PlantControlCenter;
