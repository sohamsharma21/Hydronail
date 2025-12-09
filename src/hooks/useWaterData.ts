import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface WaterReading {
  id: string;
  ph: number;
  turbidity: number;
  temperature: number;
  dissolved_oxygen: number;
  tds: number;
  conductivity: number;
  chlorine: number;
  hardness: number;
  quality_score: number | null;
  timestamp: number;
  created_at: string;
}

export function useWaterData() {
  const [latestReading, setLatestReading] = useState<WaterReading | null>(null);

  const { data: readings, isLoading } = useQuery({
    queryKey: ["water-readings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as WaterReading[];
    },
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel("water_readings_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "water_readings",
        },
        (payload) => {
          setLatestReading(payload.new as WaterReading);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    readings: readings || [],
    latestReading: latestReading || (readings?.[0] ?? null),
    isLoading,
  };
}