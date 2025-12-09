import { Header } from "@/components/Header";
import { TreatmentTank } from "@/components/digitaltwin/TreatmentTank";
import { FlowPipe } from "@/components/digitaltwin/FlowPipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Square, RotateCcw, Download } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const DigitalTwin = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [currentStage, setCurrentStage] = useState(1);
  const [logs, setLogs] = useState<string[]>([
    "14:23:45 - System initialized",
    "14:23:50 - Ready to start simulation",
  ]);

  const costData = [
    { name: "Coagulant", value: 45, color: "hsl(var(--primary))" },
    { name: "Chlorine", value: 28, color: "hsl(var(--secondary))" },
    { name: "Lime", value: 12, color: "hsl(var(--warning))" },
    { name: "Energy", value: 35, color: "hsl(var(--destructive))" },
  ];

  const handleStart = () => {
    setIsRunning(true);
    addLog("Primary treatment started");
    setTimeout(() => {
      setCurrentStage(2);
      addLog("Moving to secondary treatment");
    }, 3000 / speed[0]);
    setTimeout(() => {
      setCurrentStage(3);
      addLog("Moving to tertiary treatment");
    }, 6000 / speed[0]);
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog("Simulation stopped");
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStage(1);
    setSpeed([1]);
    setLogs(["System reset", "Ready to start simulation"]);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp} - ${message}`]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">3-Stage Treatment Process Simulation</h1>
          <p className="text-muted-foreground">
            Real-time digital twin visualization of water treatment stages
          </p>
        </div>

        {/* Tank Visualization */}
        <div className="flex items-center justify-center flex-wrap gap-4 py-8">
          <TreatmentTank
            stage={1}
            label="Primary Treatment"
            sublabel="Sedimentation & Screening"
            efficiency={85}
            color="bg-gradient-to-b from-red-500/70 to-red-600/70"
            fillLevel={isRunning && currentStage >= 1 ? 75 : 20}
            isActive={currentStage === 1}
            details={["Removal of large solids", "Sedimentation: 2-3 hours"]}
          />

          <FlowPipe flowRate="1,250 L/min" isActive={isRunning && currentStage >= 2} />

          <TreatmentTank
            stage={2}
            label="Secondary Treatment"
            sublabel="Biological Treatment & Aeration"
            efficiency={88}
            color="bg-gradient-to-b from-yellow-500/70 to-yellow-600/70"
            fillLevel={isRunning && currentStage >= 2 ? 75 : 20}
            isActive={currentStage === 2}
            details={["Activated sludge process", "Aeration: 4-6 hours"]}
          />

          <FlowPipe flowRate="1,250 L/min" isActive={isRunning && currentStage >= 3} />

          <TreatmentTank
            stage={3}
            label="Tertiary Treatment"
            sublabel="Filtration & Disinfection"
            efficiency={95}
            color="bg-gradient-to-b from-green-500/70 to-green-600/70"
            fillLevel={isRunning && currentStage >= 3 ? 75 : 20}
            isActive={currentStage === 3}
            details={["Sand filtration", "Chlorination", "Quality: 96.31%"]}
          />
        </div>

        {/* Control Panel */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                size="lg"
                className="gap-2"
              >
                <Play className="h-5 w-5" />
                Start Simulation
              </Button>
              
              <Button
                onClick={handleStop}
                disabled={!isRunning}
                size="lg"
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
              
              <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  Speed Control: {speed[0]}x
                </label>
              </div>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>2x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>

            <div className="flex gap-4">
              {[1, 2, 3].map((stage) => (
                <div
                  key={stage}
                  className={`flex-1 p-3 rounded-lg border-2 text-center font-medium transition-colors ${
                    currentStage === stage
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/50"
                  }`}
                >
                  Stage {stage}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistics Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
                <div className="text-2xl font-bold">8-12 hours</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Water Recovered</div>
                <div className="text-2xl font-bold text-secondary">90%</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Chemical Usage Today</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Coagulant:</span>
                    <span className="font-bold">45 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chlorine:</span>
                    <span className="font-bold">28 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lime:</span>
                    <span className="font-bold">12 kg</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Energy Consumption</div>
                <div className="text-2xl font-bold">1,245 kWh</div>
              </div>

              <div className="pt-4">
                <div className="text-sm font-medium mb-3">Cost Breakdown</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Process Logs */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Process Logs</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-1 font-mono text-sm bg-muted/50 rounded-lg p-4">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-muted-foreground"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DigitalTwin;