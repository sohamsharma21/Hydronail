import { Header } from "@/components/Header";
import { SensorSlider } from "@/components/simulator/SensorSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useState, useEffect } from "react";
import { Loader2, PlayCircle, StopCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const DEFAULT_VALUES = {
  ph: 7.0,
  turbidity: 20,
  temperature: 25,
  dissolvedOxygen: 7.0,
  tds: 300,
  conductivity: 400,
  chlorine: 1.0,
  hardness: 150,
};

const GOOD_QUALITY = {
  ph: 7.2,
  turbidity: 15,
  temperature: 25,
  dissolvedOxygen: 8.0,
  tds: 250,
  conductivity: 350,
  chlorine: 1.2,
  hardness: 120,
};

const POOR_QUALITY = {
  ph: 5.5,
  turbidity: 65,
  temperature: 38,
  dissolvedOxygen: 3.0,
  tds: 850,
  conductivity: 950,
  chlorine: 0.1,
  hardness: 420,
};

const Simulator = () => {
  const [sensorValues, setSensorValues] = useState(DEFAULT_VALUES);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [readingsSent, setReadingsSent] = useState(0);
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { predictQuality, isLoading: isPredicting, prediction } = useMLPrediction();

  useEffect(() => {
    if (!isAutoGenerating) return;

    const interval = setInterval(() => {
      generateRandomValues();
      handleSubmit();
    }, 15000);

    return () => clearInterval(interval);
  }, [isAutoGenerating]);

  const generateRandomValues = () => {
    setSensorValues({
      ph: 6.5 + Math.random() * 2,
      turbidity: 10 + Math.random() * 40,
      temperature: 20 + Math.random() * 15,
      dissolvedOxygen: 5 + Math.random() * 5,
      tds: 200 + Math.random() * 400,
      conductivity: 300 + Math.random() * 400,
      chlorine: 0.5 + Math.random() * 2,
      hardness: 100 + Math.random() * 250,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Call ML API
      await predictQuality(sensorValues);
      
      setReadingsSent((prev) => prev + 1);
      setLastSent(new Date());
      
      toast({
        title: "Reading Submitted",
        description: "Data sent to ML API successfully",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit reading",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (field: keyof typeof DEFAULT_VALUES) => {
    setSensorValues((prev) => ({ ...prev, [field]: DEFAULT_VALUES[field] }));
  };

  const handleResetAll = () => {
    setSensorValues(DEFAULT_VALUES);
    toast({ title: "Reset Complete", description: "All values reset to defaults" });
  };

  const loadSample = (sample: typeof GOOD_QUALITY) => {
    setSensorValues(sample);
    toast({
      title: "Sample Loaded",
      description: "Sensor values updated",
    });
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "Excellent":
        return "✅";
      case "Good":
        return "✅";
      case "Fair":
        return "⚠️";
      case "Poor":
        return "❌";
      default:
        return "❓";
    }
  };

  const estimatedCost = prediction
    ? Math.round((100 - prediction.score) * 50)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">IoT Simulator</h1>
          <p className="text-muted-foreground">
            Simulate real-time sensor data and test ML predictions
          </p>
        </div>

        {/* Instructions */}
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Adjust sliders manually or enable auto-generation to simulate realistic sensor readings every 15 seconds
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensor Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SensorSlider
                label="pH Level"
                value={sensorValues.ph}
                unit=""
                min={0}
                max={14}
                step={0.1}
                defaultValue={DEFAULT_VALUES.ph}
                tooltip="Optimal range: 6.5-8.5. Measures acidity/alkalinity of water."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, ph: val }))}
                onReset={() => handleReset("ph")}
              />

              <SensorSlider
                label="Turbidity"
                value={sensorValues.turbidity}
                unit="NTU"
                min={0}
                max={100}
                step={1}
                defaultValue={DEFAULT_VALUES.turbidity}
                tooltip="Optimal: <30 NTU. Measures water clarity and suspended particles."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, turbidity: val }))}
                onReset={() => handleReset("turbidity")}
              />

              <SensorSlider
                label="Temperature"
                value={sensorValues.temperature}
                unit="°C"
                min={10}
                max={45}
                step={0.5}
                defaultValue={DEFAULT_VALUES.temperature}
                tooltip="Optimal range: 15-35°C. Affects chemical reactions and biological processes."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, temperature: val }))}
                onReset={() => handleReset("temperature")}
              />

              <SensorSlider
                label="Dissolved Oxygen"
                value={sensorValues.dissolvedOxygen}
                unit="mg/L"
                min={0}
                max={15}
                step={0.1}
                defaultValue={DEFAULT_VALUES.dissolvedOxygen}
                tooltip="Optimal: >5 mg/L. Essential for aquatic life and biological treatment."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, dissolvedOxygen: val }))}
                onReset={() => handleReset("dissolvedOxygen")}
              />

              <SensorSlider
                label="TDS"
                value={sensorValues.tds}
                unit="ppm"
                min={0}
                max={1000}
                step={10}
                defaultValue={DEFAULT_VALUES.tds}
                tooltip="Optimal: <500 ppm. Total Dissolved Solids - minerals and salts in water."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, tds: val }))}
                onReset={() => handleReset("tds")}
              />

              <SensorSlider
                label="Conductivity"
                value={sensorValues.conductivity}
                unit="µS/cm"
                min={0}
                max={2000}
                step={10}
                defaultValue={DEFAULT_VALUES.conductivity}
                tooltip="Measures water's ability to conduct electricity, related to dissolved ions."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, conductivity: val }))}
                onReset={() => handleReset("conductivity")}
              />

              <SensorSlider
                label="Chlorine"
                value={sensorValues.chlorine}
                unit="mg/L"
                min={0}
                max={5}
                step={0.1}
                defaultValue={DEFAULT_VALUES.chlorine}
                tooltip="Optimal: 0.2-2.0 mg/L. Disinfectant to kill harmful microorganisms."
                onChange={(val) => setSensorValues((prev) => ({ ...prev, chlorine: val }))}
                onReset={() => handleReset("chlorine")}
              />

              <SensorSlider
                label="Hardness"
                value={sensorValues.hardness}
                unit="mg/L"
                min={0}
                max={500}
                step={5}
                defaultValue={DEFAULT_VALUES.hardness}
                tooltip="Measures calcium and magnesium content. <150: Soft, 150-300: Moderate, >300: Hard"
                onChange={(val) => setSensorValues((prev) => ({ ...prev, hardness: val }))}
                onReset={() => handleReset("hardness")}
              />
            </div>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isAutoGenerating}
                    size="lg"
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <PlayCircle className="h-5 w-5 mr-2" />
                    )}
                    Submit Reading
                  </Button>

                  <Button onClick={handleResetAll} variant="outline" size="lg">
                    Reset All
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isAutoGenerating}
                      onCheckedChange={setIsAutoGenerating}
                      id="auto-gen"
                    />
                    <Label htmlFor="auto-gen" className="font-medium">
                      Auto-Generate Mode
                    </Label>
                    {isAutoGenerating && (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  {isAutoGenerating && (
                    <Button
                      onClick={() => setIsAutoGenerating(false)}
                      variant="destructive"
                      size="sm"
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => loadSample(GOOD_QUALITY)}
                    variant="outline"
                    className="flex-1"
                  >
                    Load Good Quality
                  </Button>
                  <Button
                    onClick={() => loadSample(POOR_QUALITY)}
                    variant="outline"
                    className="flex-1"
                  >
                    Load Poor Quality
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {/* ThingSpeak Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ThingSpeak Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Readings Sent:</span>
                  <span className="font-bold">{readingsSent}</span>
                </div>
                {lastSent && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Sent:</span>
                    <span className="text-xs">{lastSent.toLocaleTimeString()}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href="https://thingspeak.com/channels/3187167"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Dashboard
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* ML Prediction Result */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass-card bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader>
                    <CardTitle>ML Prediction Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <motion.div
                        className="text-5xl font-bold text-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {prediction.score.toFixed(1)}%
                      </motion.div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl">{getStatusEmoji(prediction.status)}</span>
                        <Badge variant="outline" className="text-lg">
                          {prediction.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recommendations:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {sensorValues.ph < 6.5 || sensorValues.ph > 8.5 ? (
                          <li>• pH adjustment required</li>
                        ) : null}
                        {sensorValues.turbidity > 30 ? (
                          <li>• Increase filtration capacity</li>
                        ) : null}
                        {sensorValues.dissolvedOxygen < 5 ? (
                          <li>• Enhance aeration system</li>
                        ) : null}
                        {sensorValues.tds > 500 ? (
                          <li>• Consider reverse osmosis</li>
                        ) : null}
                        {prediction.status === "Excellent" && (
                          <li className="text-secondary">• All parameters optimal!</li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Estimated Treatment Cost:</span>
                        <span className="font-bold">₹{estimatedCost}</span>
                      </div>
                    </div>

                    <Button variant="secondary" className="w-full">
                      Get Chemical Dosing Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Simulator;