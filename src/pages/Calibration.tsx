import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import {
  Settings,
  Target,
  Check,
  AlertTriangle,
  RefreshCw,
  Thermometer,
  Droplet,
  Gauge,
  Zap,
  Activity,
  History,
  Download,
  Upload,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface CalibrationPoint {
  standard: number;
  measured: number;
}

interface SensorCalibration {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  currentValue: number;
  offset: number;
  slope: number;
  lastCalibrated: Date | null;
  status: "calibrated" | "needs_calibration" | "calibrating";
  calibrationPoints: CalibrationPoint[];
}

const Calibration = () => {
  const [sensors, setSensors] = useState<SensorCalibration[]>([
    {
      id: "ph",
      name: "pH Sensor",
      shortName: "pH",
      unit: "pH",
      icon: Droplet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      currentValue: 7.2,
      offset: 0,
      slope: 1,
      lastCalibrated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "calibrated",
      calibrationPoints: [
        { standard: 4.0, measured: 4.02 },
        { standard: 7.0, measured: 7.01 },
        { standard: 10.0, measured: 9.98 },
      ],
    },
    {
      id: "turbidity",
      name: "Turbidity",
      shortName: "Turb",
      unit: "NTU",
      icon: Activity,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      currentValue: 25.5,
      offset: 0,
      slope: 1,
      lastCalibrated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: "needs_calibration",
      calibrationPoints: [
        { standard: 0, measured: 0.5 },
        { standard: 100, measured: 98 },
      ],
    },
    {
      id: "temperature",
      name: "Temperature",
      shortName: "Temp",
      unit: "°C",
      icon: Thermometer,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      currentValue: 28.5,
      offset: 0,
      slope: 1,
      lastCalibrated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: "needs_calibration",
      calibrationPoints: [
        { standard: 0, measured: 0.2 },
        { standard: 25, measured: 25.1 },
      ],
    },
    {
      id: "dissolved_oxygen",
      name: "DO Sensor",
      shortName: "DO",
      unit: "mg/L",
      icon: Gauge,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      currentValue: 7.8,
      offset: 0,
      slope: 1,
      lastCalibrated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "calibrated",
      calibrationPoints: [
        { standard: 0, measured: 0.1 },
        { standard: 8.26, measured: 8.25 },
      ],
    },
    {
      id: "tds",
      name: "TDS Sensor",
      shortName: "TDS",
      unit: "ppm",
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      currentValue: 450,
      offset: 0,
      slope: 1,
      lastCalibrated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "calibrated",
      calibrationPoints: [
        { standard: 0, measured: 5 },
        { standard: 500, measured: 498 },
      ],
    },
  ]);

  const [selectedSensor, setSelectedSensor] = useState<string>("ph");
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [standardValue, setStandardValue] = useState("");
  const [measuredValue, setMeasuredValue] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentSensor = sensors.find((s) => s.id === selectedSensor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "calibrated":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "needs_calibration":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "calibrating":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted";
    }
  };

  const getDaysSinceCalibration = (date: Date | null) => {
    if (!date) return "Never";
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d`;
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep(1);
    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor ? { ...s, status: "calibrating" as const } : s
      )
    );
    toast({
      title: "Calibration Started",
      description: `Starting calibration for ${currentSensor?.name}`,
    });
  };

  const addCalibrationPoint = () => {
    if (!standardValue || !measuredValue) {
      toast({
        title: "Error",
        description: "Enter both values",
        variant: "destructive",
      });
      return;
    }

    const newPoint: CalibrationPoint = {
      standard: parseFloat(standardValue),
      measured: parseFloat(measuredValue),
    };

    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor
          ? { ...s, calibrationPoints: [...s.calibrationPoints, newPoint] }
          : s
      )
    );

    setStandardValue("");
    setMeasuredValue("");
    setCalibrationStep((prev) => prev + 1);

    toast({
      title: "Point Added",
      description: `Std=${newPoint.standard}, Meas=${newPoint.measured}`,
    });
  };

  const finishCalibration = () => {
    const points = currentSensor?.calibrationPoints || [];
    if (points.length >= 2) {
      const n = points.length;
      const sumX = points.reduce((sum, p) => sum + p.measured, 0);
      const sumY = points.reduce((sum, p) => sum + p.standard, 0);
      const sumXY = points.reduce((sum, p) => sum + p.measured * p.standard, 0);
      const sumX2 = points.reduce((sum, p) => sum + p.measured * p.measured, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const offset = (sumY - slope * sumX) / n;

      setSensors((prev) =>
        prev.map((s) =>
          s.id === selectedSensor
            ? {
                ...s,
                slope,
                offset,
                status: "calibrated" as const,
                lastCalibrated: new Date(),
              }
            : s
        )
      );
    }

    setIsCalibrating(false);
    setCalibrationStep(0);
    setSheetOpen(false);

    toast({
      title: "Calibration Complete",
      description: `${currentSensor?.name} calibrated successfully`,
    });
  };

  const resetCalibration = () => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor
          ? { ...s, offset: 0, slope: 1, calibrationPoints: [], status: "needs_calibration" as const }
          : s
      )
    );
    setIsCalibrating(false);
    setCalibrationStep(0);
  };

  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensor(sensorId);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6 md:py-8 space-y-6 md:space-y-8 safe-area-inset">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
              <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Sensor Calibration
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Maintain accuracy with regular calibration
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Import</span>
            </Button>
          </div>
        </div>

        {/* Sensor Cards - Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedSensor === sensor.id ? "ring-2 ring-primary" : ""
                } ${sensor.bgColor} active:scale-95`}
                onClick={() => handleSensorSelect(sensor.id)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <sensor.icon className={`w-5 h-5 md:w-6 md:h-6 ${sensor.color}`} />
                    <Badge className={`${getStatusColor(sensor.status)} text-[10px] md:text-xs px-1.5`}>
                      {sensor.status === "calibrated" && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      {sensor.status === "needs_calibration" && <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      {sensor.status === "calibrating" && <RefreshCw className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-xs md:text-sm">{sensor.shortName}</h3>
                  <div className="text-lg md:text-2xl font-bold mt-1">
                    {sensor.currentValue}
                    <span className="text-[10px] md:text-sm text-muted-foreground ml-1">{sensor.unit}</span>
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2 flex items-center">
                    <History className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    {getDaysSinceCalibration(sensor.lastCalibrated)}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 ml-auto md:hidden" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Desktop Calibration Panel */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {currentSensor && (
            <>
              {/* Calibration Controls */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {currentSensor.name} Calibration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isCalibrating ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Instructions</AlertTitle>
                        <AlertDescription>
                          Use certified standard solutions. For pH: use pH 4, 7, and 10 buffers.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-4">
                        <Button onClick={startCalibration} className="flex-1">
                          <Target className="w-4 h-4 mr-2" />
                          Start Calibration
                        </Button>
                        <Button variant="outline" onClick={resetCalibration}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Progress value={(calibrationStep / 3) * 100} className="flex-1" />
                        <span className="text-sm text-muted-foreground">Step {calibrationStep}/3</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Standard ({currentSensor.unit})</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={standardValue}
                            onChange={(e) => setStandardValue(e.target.value)}
                            placeholder={currentSensor.id === "ph" ? "7.00" : "100"}
                          />
                        </div>
                        <div>
                          <Label>Measured ({currentSensor.unit})</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={measuredValue}
                            onChange={(e) => setMeasuredValue(e.target.value)}
                            placeholder="Reading"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button onClick={addCalibrationPoint} variant="outline" className="flex-1">
                          Add Point
                        </Button>
                        <Button onClick={finishCalibration} className="flex-1" disabled={currentSensor.calibrationPoints.length < 2}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Finish
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentSensor.calibrationPoints.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Calibration Points</h4>
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-4 py-2 text-left">Standard</th>
                              <th className="px-4 py-2 text-left">Measured</th>
                              <th className="px-4 py-2 text-left">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSensor.calibrationPoints.map((point, index) => (
                              <tr key={index} className="border-t">
                                <td className="px-4 py-2">{point.standard} {currentSensor.unit}</td>
                                <td className="px-4 py-2">{point.measured} {currentSensor.unit}</td>
                                <td className="px-4 py-2">
                                  <span className={Math.abs(point.standard - point.measured) < 0.5 ? "text-green-400" : "text-amber-400"}>
                                    {(point.measured - point.standard).toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calibration Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Offset</Label>
                    <div className="text-xl font-bold">{currentSensor.offset.toFixed(4)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Slope</Label>
                    <div className="text-xl font-bold">{currentSensor.slope.toFixed(4)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Calibrated</Label>
                    <div className="text-lg font-medium">
                      {currentSensor.lastCalibrated?.toLocaleDateString() || "Never"}
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <AlertTitle>Schedule</AlertTitle>
                    <AlertDescription className="text-xs">
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>pH: Every 7 days</li>
                        <li>Turbidity: Every 14 days</li>
                        <li>DO: Every 7 days</li>
                        <li>Temp: Every 30 days</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Mobile Sheet for Calibration */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            {currentSensor && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <currentSensor.icon className={`w-5 h-5 ${currentSensor.color}`} />
                    {currentSensor.name}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(85vh-100px)]">
                  {/* Current Value */}
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">
                      {currentSensor.currentValue} {currentSensor.unit}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Current Reading</div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Status</span>
                    <Badge className={getStatusColor(currentSensor.status)}>
                      {currentSensor.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Last Calibrated</span>
                    <span className="font-medium">
                      {currentSensor.lastCalibrated?.toLocaleDateString() || "Never"}
                    </span>
                  </div>

                  {/* Calibration Controls */}
                  {!isCalibrating ? (
                    <div className="space-y-3">
                      <Button onClick={startCalibration} className="w-full" size="lg">
                        <Target className="w-5 h-5 mr-2" />
                        Start Calibration
                      </Button>
                      <Button variant="outline" onClick={resetCalibration} className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Factory
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Progress value={(calibrationStep / 3) * 100} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Step {calibrationStep} of 3
                      </p>

                      <div className="space-y-3">
                        <div>
                          <Label>Standard Value ({currentSensor.unit})</Label>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={standardValue}
                            onChange={(e) => setStandardValue(e.target.value)}
                            placeholder={currentSensor.id === "ph" ? "7.00" : "100"}
                            className="h-12 text-lg"
                          />
                        </div>
                        <div>
                          <Label>Measured Value ({currentSensor.unit})</Label>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={measuredValue}
                            onChange={(e) => setMeasuredValue(e.target.value)}
                            placeholder="Sensor reading"
                            className="h-12 text-lg"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={addCalibrationPoint} variant="outline" className="flex-1 h-12">
                          Add Point
                        </Button>
                        <Button 
                          onClick={finishCalibration} 
                          className="flex-1 h-12" 
                          disabled={currentSensor.calibrationPoints.length < 2}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Done
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Calibration Points */}
                  {currentSensor.calibrationPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Points ({currentSensor.calibrationPoints.length})</h4>
                      <div className="space-y-2">
                        {currentSensor.calibrationPoints.map((point, index) => (
                          <div key={index} className="flex justify-between p-2 bg-muted/50 rounded text-sm">
                            <span>Std: {point.standard}</span>
                            <span>Meas: {point.measured}</span>
                            <span className={Math.abs(point.standard - point.measured) < 0.5 ? "text-green-400" : "text-amber-400"}>
                              Err: {(point.measured - point.standard).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coefficients */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">Offset</div>
                      <div className="font-mono font-bold">{currentSensor.offset.toFixed(4)}</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">Slope</div>
                      <div className="font-mono font-bold">{currentSensor.slope.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Calibration;
