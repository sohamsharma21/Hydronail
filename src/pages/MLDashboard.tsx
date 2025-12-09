import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Droplet, Beaker, Wrench, Cpu, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import {
  useWaterQualityPrediction,
  useChemicalDosingPrediction,
  useEquipmentFailurePrediction,
  useTreatmentProcessPrediction,
  WaterQualityInput,
  ChemicalDosingInput,
  EquipmentFailureInput,
  TreatmentProcessInput,
} from "@/hooks/useMLPrediction";
import ReactMarkdown from "react-markdown";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Water Quality Card Component
function WaterQualityCard() {
  const { predictQuality, isLoading, prediction } = useWaterQualityPrediction();
  const [input, setInput] = useState<WaterQualityInput>({
    ph: 7,
    turbidity: 20,
    temperature: 25,
    dissolvedOxygen: 7,
    tds: 300,
    conductivity: 400,
    chlorine: 1,
    hardness: 150,
  });

  const handlePredict = () => {
    predictQuality(input);
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Droplet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Water Quality Prediction</CardTitle>
            <CardDescription>XGBoost • 96.31% accuracy</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">pH Level ({input.ph.toFixed(1)})</Label>
            <Slider
              value={[input.ph]}
              onValueChange={([v]) => setInput({ ...input, ph: v })}
              min={0}
              max={14}
              step={0.1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Turbidity (NTU)</Label>
            <Input
              type="number"
              value={input.turbidity}
              onChange={(e) => setInput({ ...input, turbidity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Temperature (°C)</Label>
            <Slider
              value={[input.temperature]}
              onValueChange={([v]) => setInput({ ...input, temperature: v })}
              min={0}
              max={50}
              step={1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">DO (mg/L)</Label>
            <Slider
              value={[input.dissolvedOxygen]}
              onValueChange={([v]) => setInput({ ...input, dissolvedOxygen: v })}
              min={0}
              max={15}
              step={0.1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">TDS (ppm)</Label>
            <Input
              type="number"
              value={input.tds}
              onChange={(e) => setInput({ ...input, tds: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Conductivity (µS/cm)</Label>
            <Input
              type="number"
              value={input.conductivity}
              onChange={(e) => setInput({ ...input, conductivity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Chlorine (mg/L)</Label>
            <Slider
              value={[input.chlorine]}
              onValueChange={([v]) => setInput({ ...input, chlorine: v })}
              min={0}
              max={5}
              step={0.1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Hardness (mg/L)</Label>
            <Input
              type="number"
              value={input.hardness}
              onChange={(e) => setInput({ ...input, hardness: +e.target.value })}
              className="h-8"
            />
          </div>
        </div>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Predicting..." : "Predict Water Quality"}
        </Button>

        {prediction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-muted"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Quality Score</span>
              <Badge
                variant={prediction.status === "Excellent" || prediction.status === "Good" ? "default" : "destructive"}
                className={prediction.status === "Excellent" || prediction.status === "Good" ? "bg-secondary" : ""}
              >
                {prediction.status}
              </Badge>
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{prediction.score.toFixed(1)}%</div>
            {prediction.rawResponse && (
              <div className="text-xs text-muted-foreground mt-3 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{prediction.rawResponse}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Chemical Dosing Card Component
function ChemicalDosingCard() {
  const { predictDosing, isLoading, result } = useChemicalDosingPrediction();
  const [input, setInput] = useState<ChemicalDosingInput>({
    ph: 6.5,
    turbidity: 45,
    temperature: 28,
    dissolvedOxygen: 5.5,
    tds: 420,
    alkalinity: 150,
    volumeM3: 500,
  });

  const handlePredict = () => {
    predictDosing(input);
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Beaker className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-lg">Chemical Dosing Optimizer</CardTitle>
            <CardDescription>Optimal dosing with cost analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Current pH ({input.ph.toFixed(1)})</Label>
            <Slider
              value={[input.ph]}
              onValueChange={([v]) => setInput({ ...input, ph: v })}
              min={0}
              max={14}
              step={0.1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Turbidity (NTU)</Label>
            <Input
              type="number"
              value={input.turbidity}
              onChange={(e) => setInput({ ...input, turbidity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Temperature (°C)</Label>
            <Slider
              value={[input.temperature]}
              onValueChange={([v]) => setInput({ ...input, temperature: v })}
              min={0}
              max={50}
              step={1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">DO (mg/L)</Label>
            <Slider
              value={[input.dissolvedOxygen]}
              onValueChange={([v]) => setInput({ ...input, dissolvedOxygen: v })}
              min={0}
              max={15}
              step={0.1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">TDS (ppm)</Label>
            <Input
              type="number"
              value={input.tds}
              onChange={(e) => setInput({ ...input, tds: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Alkalinity (mg/L)</Label>
            <Input
              type="number"
              value={input.alkalinity}
              onChange={(e) => setInput({ ...input, alkalinity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="text-xs">Treatment Volume (m³)</Label>
            <Input
              type="number"
              value={input.volumeM3}
              onChange={(e) => setInput({ ...input, volumeM3: +e.target.value })}
              className="h-8"
            />
          </div>
        </div>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full bg-secondary hover:bg-secondary/90">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Calculating..." : "Calculate Optimal Dosing"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-muted prose prose-sm dark:prose-invert max-w-none"
          >
            <ReactMarkdown>{result.result}</ReactMarkdown>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Equipment Failure Card Component
function EquipmentFailureCard() {
  const { predictFailure, isLoading, result } = useEquipmentFailurePrediction();
  const [input, setInput] = useState<EquipmentFailureInput>({
    vibration: 0.5,
    temperature: 45,
    pressure: 100,
    current: 15,
    runtimeHours: 150,
  });

  const handlePredict = () => {
    predictFailure(input);
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Wrench className="h-6 w-6 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Equipment Failure Prediction</CardTitle>
            <CardDescription>LSTM Deep Learning • 97.44% accuracy</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Vibration (mm/s RMS) ({input.vibration.toFixed(2)})</Label>
            <Slider
              value={[input.vibration]}
              onValueChange={([v]) => setInput({ ...input, vibration: v })}
              min={0}
              max={5}
              step={0.05}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Equipment Temp (°C)</Label>
            <Slider
              value={[input.temperature]}
              onValueChange={([v]) => setInput({ ...input, temperature: v })}
              min={0}
              max={120}
              step={1}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">System Pressure (PSI)</Label>
            <Slider
              value={[input.pressure]}
              onValueChange={([v]) => setInput({ ...input, pressure: v })}
              min={0}
              max={200}
              step={5}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Current Draw (Amps)</Label>
            <Slider
              value={[input.current]}
              onValueChange={([v]) => setInput({ ...input, current: v })}
              min={0}
              max={50}
              step={0.5}
              className="py-2"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="text-xs">Runtime Hours</Label>
            <Input
              type="number"
              value={input.runtimeHours}
              onChange={(e) => setInput({ ...input, runtimeHours: +e.target.value })}
              className="h-8"
            />
          </div>
        </div>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full bg-warning hover:bg-warning/90 text-warning-foreground">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Analyzing..." : "Predict Failure Risk"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-muted prose prose-sm dark:prose-invert max-w-none"
          >
            <ReactMarkdown>{result.result}</ReactMarkdown>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Treatment Process Card Component
function TreatmentProcessCard() {
  const { predictProcess, isLoading, result } = useTreatmentProcessPrediction();
  const [input, setInput] = useState<TreatmentProcessInput>({
    ph: 7,
    turbidity: 45,
    temperature: 28,
    dissolvedOxygen: 5.5,
    tds: 420,
    conductivity: 600,
    chlorine: 0.8,
    hardness: 180,
    flowRate: 1200,
    tank1Level: 75,
    tank2Level: 60,
    tank3Level: 80,
    hourOfDay: 14,
    prevStage: 0,
    waterSource: 2,
  });

  const handlePredict = () => {
    predictProcess(input);
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Cpu className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Treatment Process Controller</CardTitle>
            <CardDescription>Multi-parameter AI optimization</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">pH</Label>
            <Input
              type="number"
              value={input.ph}
              onChange={(e) => setInput({ ...input, ph: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Turbidity</Label>
            <Input
              type="number"
              value={input.turbidity}
              onChange={(e) => setInput({ ...input, turbidity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Temp (°C)</Label>
            <Input
              type="number"
              value={input.temperature}
              onChange={(e) => setInput({ ...input, temperature: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">DO (mg/L)</Label>
            <Input
              type="number"
              value={input.dissolvedOxygen}
              onChange={(e) => setInput({ ...input, dissolvedOxygen: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">TDS</Label>
            <Input
              type="number"
              value={input.tds}
              onChange={(e) => setInput({ ...input, tds: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Conductivity</Label>
            <Input
              type="number"
              value={input.conductivity}
              onChange={(e) => setInput({ ...input, conductivity: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Chlorine</Label>
            <Input
              type="number"
              value={input.chlorine}
              onChange={(e) => setInput({ ...input, chlorine: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hardness</Label>
            <Input
              type="number"
              value={input.hardness}
              onChange={(e) => setInput({ ...input, hardness: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Flow Rate</Label>
            <Input
              type="number"
              value={input.flowRate}
              onChange={(e) => setInput({ ...input, flowRate: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tank 1 %</Label>
            <Input
              type="number"
              value={input.tank1Level}
              onChange={(e) => setInput({ ...input, tank1Level: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tank 2 %</Label>
            <Input
              type="number"
              value={input.tank2Level}
              onChange={(e) => setInput({ ...input, tank2Level: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tank 3 %</Label>
            <Input
              type="number"
              value={input.tank3Level}
              onChange={(e) => setInput({ ...input, tank3Level: +e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hour (0-23)</Label>
            <Input
              type="number"
              value={input.hourOfDay}
              onChange={(e) => setInput({ ...input, hourOfDay: +e.target.value })}
              className="h-8"
              min={0}
              max={23}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Prev Stage</Label>
            <Input
              type="number"
              value={input.prevStage}
              onChange={(e) => setInput({ ...input, prevStage: +e.target.value })}
              className="h-8"
              min={0}
              max={3}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Source (0-2)</Label>
            <Input
              type="number"
              value={input.waterSource}
              onChange={(e) => setInput({ ...input, waterSource: +e.target.value })}
              className="h-8"
              min={0}
              max={2}
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Source: 0=River, 1=Ground, 2=Industrial
        </div>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full bg-purple-500 hover:bg-purple-600">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Processing..." : "Optimize Treatment Process"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-muted prose prose-sm dark:prose-invert max-w-none"
          >
            <ReactMarkdown>{result.result}</ReactMarkdown>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MLDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-20">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">AI Prediction Dashboard</h1>
          <p className="text-muted-foreground">
            4 Machine Learning models for comprehensive water treatment optimization
          </p>
        </motion.div>

        {/* Model Overview Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: Droplet, title: "Water Quality", accuracy: "96.31%", color: "primary" },
            { icon: Beaker, title: "Chemical Dosing", accuracy: "R² 0.98", color: "secondary" },
            { icon: Wrench, title: "Equipment Health", accuracy: "97.44%", color: "warning" },
            { icon: Cpu, title: "Process Control", accuracy: "Active", color: "purple" },
          ].map((model, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <model.icon
                  className={`h-8 w-8 ${
                    model.color === "primary" ? "text-primary" :
                    model.color === "secondary" ? "text-secondary" :
                    model.color === "warning" ? "text-warning" : "text-purple-500"
                  }`}
                />
                <div>
                  <p className="text-xs text-muted-foreground">{model.title}</p>
                  <p className="font-semibold">{model.accuracy}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs for Mobile, Grid for Desktop */}
        <div className="block md:hidden">
          <Tabs defaultValue="quality" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="quality" className="text-xs px-2">
                <Droplet className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="dosing" className="text-xs px-2">
                <Beaker className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="failure" className="text-xs px-2">
                <Wrench className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="process" className="text-xs px-2">
                <Cpu className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quality">
              <WaterQualityCard />
            </TabsContent>
            <TabsContent value="dosing">
              <ChemicalDosingCard />
            </TabsContent>
            <TabsContent value="failure">
              <EquipmentFailureCard />
            </TabsContent>
            <TabsContent value="process">
              <TreatmentProcessCard />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <WaterQualityCard />
          <ChemicalDosingCard />
          <EquipmentFailureCard />
          <TreatmentProcessCard />
        </div>
      </main>
    </div>
  );
}
