import { Header } from "@/components/Header";
import { SensorCard } from "@/components/monitoring/SensorCard";
import { WaterUsageRecommendation } from "@/components/monitoring/WaterUsageRecommendation";
import { useThingSpeak, parseThingSpeakReading } from "@/hooks/useThingSpeak";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Zap,
  CircleDot,
  FlaskConical,
  Waves,
  Download,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Monitoring = () => {
  const { data: thingSpeakData, isLoading } = useThingSpeak(20);
  const { predictQuality, isLoading: isPredicting, prediction } = useMLPrediction();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("15");
  const [chartData, setChartData] = useState<any[]>([]);

  const latestReading = thingSpeakData?.feeds?.[thingSpeakData.feeds.length - 1];
  const latestData = latestReading ? parseThingSpeakReading(latestReading) : null;

  useEffect(() => {
    if (latestData && !isPredicting) {
      predictQuality(latestData);
    }
  }, [latestData?.timestamp]);

  useEffect(() => {
    if (thingSpeakData?.feeds) {
      const formattedData = thingSpeakData.feeds.map((feed) => {
        const parsed = parseThingSpeakReading(feed);
        return {
          time: format(new Date(feed.created_at), "HH:mm"),
          ...parsed,
        };
      });
      setChartData(formattedData);
    }
  }, [thingSpeakData]);

  const getSensorStatus = (value: number, min: number, max: number): "optimal" | "warning" | "critical" => {
    if (value >= min && value <= max) return "optimal";
    if (value >= min * 0.8 && value <= max * 1.2) return "warning";
    return "critical";
  };

  const getTrend = (currentVal: number, previousVal: number): "up" | "down" | "stable" => {
    const diff = currentVal - previousVal;
    if (Math.abs(diff) < 0.1) return "stable";
    return diff > 0 ? "up" : "down";
  };

  const previousReading = thingSpeakData?.feeds?.[thingSpeakData.feeds.length - 2];
  const previousData = previousReading ? parseThingSpeakReading(previousReading) : null;

  if (isLoading || !latestData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 md:py-8 px-4 md:px-6 space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Real-Time Water Quality</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Last updated: {format(new Date(latestReading.created_at), "PPpp")}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
            </div>
            
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className="w-24 md:w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10s</SelectItem>
                <SelectItem value="15">15s</SelectItem>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="60">1min</SelectItem>
                <SelectItem value="300">5min</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Export Data</span>
            </Button>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <SensorCard
            icon={Activity}
            title="pH Level"
            value={latestData.ph}
            unit=""
            status={getSensorStatus(latestData.ph, 6.5, 8.5)}
            trend={previousData ? getTrend(latestData.ph, previousData.ph) : "stable"}
            sparklineData={chartData.map((d) => d.ph)}
            delay={0}
          />
          
          <SensorCard
            icon={Droplets}
            title="Turbidity"
            value={latestData.turbidity}
            unit="NTU"
            status={getSensorStatus(latestData.turbidity, 0, 30)}
            trend={previousData ? getTrend(latestData.turbidity, previousData.turbidity) : "stable"}
            sparklineData={chartData.map((d) => d.turbidity)}
            delay={0.1}
          />
          
          <SensorCard
            icon={Thermometer}
            title="Temperature"
            value={latestData.temperature}
            unit="°C"
            status={getSensorStatus(latestData.temperature, 15, 35)}
            trend={previousData ? getTrend(latestData.temperature, previousData.temperature) : "stable"}
            sparklineData={chartData.map((d) => d.temperature)}
            delay={0.2}
          />
          
          <SensorCard
            icon={Wind}
            title="Dissolved Oxygen"
            value={latestData.dissolvedOxygen}
            unit="mg/L"
            status={getSensorStatus(latestData.dissolvedOxygen, 5, 15)}
            trend={previousData ? getTrend(latestData.dissolvedOxygen, previousData.dissolvedOxygen) : "stable"}
            sparklineData={chartData.map((d) => d.dissolvedOxygen)}
            delay={0.3}
          />
          
          <SensorCard
            icon={Zap}
            title="TDS"
            value={latestData.tds}
            unit="ppm"
            status={getSensorStatus(latestData.tds, 0, 500)}
            trend={previousData ? getTrend(latestData.tds, previousData.tds) : "stable"}
            sparklineData={chartData.map((d) => d.tds)}
            delay={0.4}
          />
          
          <SensorCard
            icon={CircleDot}
            title="Conductivity"
            value={latestData.conductivity}
            unit="µS/cm"
            status={getSensorStatus(latestData.conductivity, 200, 800)}
            trend={previousData ? getTrend(latestData.conductivity, previousData.conductivity) : "stable"}
            sparklineData={chartData.map((d) => d.conductivity)}
            delay={0.5}
          />
          
          <SensorCard
            icon={FlaskConical}
            title="Chlorine"
            value={latestData.chlorine}
            unit="mg/L"
            status={getSensorStatus(latestData.chlorine, 0.2, 2.0)}
            trend={previousData ? getTrend(latestData.chlorine, previousData.chlorine) : "stable"}
            sparklineData={chartData.map((d) => d.chlorine)}
            delay={0.6}
          />
          
          <SensorCard
            icon={Waves}
            title="Hardness"
            value={latestData.hardness}
            unit="mg/L"
            status={getSensorStatus(latestData.hardness, 0, 300)}
            trend={previousData ? getTrend(latestData.hardness, previousData.hardness) : "stable"}
            sparklineData={chartData.map((d) => d.hardness)}
            delay={0.7}
          />
        </div>

        {/* Water Usage Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <WaterUsageRecommendation data={latestData} />
          </div>

          {/* ML Prediction Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card h-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">AI Quality Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 pt-0 md:p-6 md:pt-0">
                {prediction ? (
                  <>
                    <div className="text-center space-y-2">
                      <motion.div
                        className="text-4xl md:text-6xl font-bold text-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {prediction.score.toFixed(1)}%
                      </motion.div>
                      <Badge
                        variant={
                          prediction.status === "Excellent"
                            ? "default"
                            : prediction.status === "Good"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-sm md:text-lg px-3 md:px-4 py-0.5 md:py-1"
                      >
                        {prediction.status}
                      </Badge>
                      <p className="text-xs md:text-sm text-muted-foreground">Confidence: 94%</p>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <h4 className="font-semibold text-sm md:text-base">Recommendations:</h4>
                      <ul className="space-y-2 text-xs md:text-sm">
                        {latestData.ph < 6.5 || latestData.ph > 8.5 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-warning">⚠️</span>
                            <span>pH adjustment needed</span>
                          </li>
                        ) : null}
                        {latestData.turbidity > 30 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-warning">⚠️</span>
                            <span>Increase filtration</span>
                          </li>
                        ) : null}
                        {latestData.dissolvedOxygen < 5 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-warning">⚠️</span>
                            <span>Enhance aeration</span>
                          </li>
                        ) : null}
                        {latestData.chlorine < 0.2 || latestData.chlorine > 2.0 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-warning">⚠️</span>
                            <span>Adjust chlorine dosing</span>
                          </li>
                        ) : null}
                        {prediction.status === "Excellent" && (
                          <li className="flex items-start gap-2">
                            <span className="text-secondary">✅</span>
                            <span>All parameters optimal</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button className="w-full" variant="outline" size="sm">
                      View Full Report
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6 md:py-8">
                    <RefreshCw className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mx-auto mb-3 md:mb-4" />
                    <p className="text-sm text-muted-foreground">Analyzing water quality...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {/* Real-time Chart */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Real-Time Trends (Last Hour)</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-6 pt-0">
              <ResponsiveContainer width="100%" height={250} className="md:!h-[400px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="ph" stroke="hsl(var(--primary))" name="pH" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="turbidity" stroke="hsl(var(--secondary))" name="Turbidity" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="temperature" stroke="hsl(var(--warning))" name="Temperature" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Monitoring;