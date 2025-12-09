import { Header } from "@/components/Header";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PHChart } from "@/components/dashboard/PHChart";
import { WaterProcessedChart } from "@/components/dashboard/WaterProcessedChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { Droplet, Activity, Waves, IndianRupee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useThingSpeak, parseThingSpeakReading } from "@/hooks/useThingSpeak";
import { format } from "date-fns";

const Index = () => {
  // Fetch ThingSpeak data
  const { data: thingSpeakData } = useThingSpeak(20);

  // Fetch alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  // Fetch equipment status
  const { data: equipment } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_status")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0];
    },
  });

  // Process pH chart data
  const phChartData =
    thingSpeakData?.feeds.map((feed) => {
      const parsed = parseThingSpeakReading(feed);
      return {
        time: format(new Date(feed.created_at), "HH:mm"),
        ph: parsed.ph,
      };
    }) || [];

  // Generate mock water processed data (last 7 days)
  const waterProcessedData = [
    { day: "Mon", volume: 2100 },
    { day: "Tue", volume: 2250 },
    { day: "Wed", volume: 2180 },
    { day: "Thu", volume: 2300 },
    { day: "Fri", volume: 2400 },
    { day: "Sat", volume: 2350 },
    { day: "Sun", volume: 2450 },
  ];

  // Calculate latest values
  const latestReading = thingSpeakData?.feeds?.[0];
  const waterQuality = latestReading ? parseThingSpeakReading(latestReading).ph * 13.71 : 96.31;
  const equipmentHealth = equipment?.health_score || 97.44;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-4 md:py-8 px-4 md:px-6">
        <HeroSection
          waterQuality={waterQuality}
          equipmentHealth={equipmentHealth}
          chemicalEfficiency={92}
        />

        {/* Metrics Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
          <MetricCard
            title="Water Quality Score"
            value={`${waterQuality.toFixed(2)}%`}
            subtitle="Excellent condition"
            icon={Droplet}
            trend="up"
            trendValue="+2.3%"
            delay={0.1}
          />
          <MetricCard
            title="Equipment Status"
            value="Healthy"
            subtitle={`Next maintenance: 7 days`}
            icon={Activity}
            delay={0.2}
          />
          <MetricCard
            title="Daily Processed Water"
            value="2,450 m³"
            subtitle="Compared to yesterday"
            icon={Waves}
            trend="up"
            trendValue="+8%"
            delay={0.3}
          />
          <MetricCard
            title="Cost Savings Today"
            value="₹12,450"
            subtitle="Savings percentage"
            icon={IndianRupee}
            trend="up"
            trendValue="+25.3%"
            delay={0.4}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 md:mb-8">
          <PHChart data={phChartData} />
          <WaterProcessedChart data={waterProcessedData} />
        </div>

        {/* Recent Alerts */}
        <RecentAlerts alerts={alerts} />
      </main>
    </div>
  );
};

export default Index;
