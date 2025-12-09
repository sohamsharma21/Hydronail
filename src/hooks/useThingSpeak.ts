import { useQuery } from "@tanstack/react-query";

const THINGSPEAK_CHANNEL_ID = "3187167";
const THINGSPEAK_API_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json`;

export interface ThingSpeakReading {
  created_at: string;
  entry_id: number;
  field1: string; // pH
  field2: string; // Turbidity
  field3: string; // Temperature
  field4: string; // Dissolved Oxygen
  field5: string; // TDS
  field6: string; // Conductivity
  field7: string; // Chlorine
  field8: string; // Hardness
}

export interface ThingSpeakData {
  channel: {
    id: number;
    name: string;
    description: string;
    last_entry_id: number;
    created_at: string;
    updated_at: string;
  };
  feeds: ThingSpeakReading[];
}

export function useThingSpeak(results = 20) {
  return useQuery({
    queryKey: ["thingspeak", results],
    queryFn: async () => {
      const response = await fetch(`${THINGSPEAK_API_URL}?results=${results}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ThingSpeak data");
      }
      const data: ThingSpeakData = await response.json();
      return data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

export function parseThingSpeakReading(reading: ThingSpeakReading) {
  return {
    timestamp: new Date(reading.created_at).getTime(),
    ph: parseFloat(reading.field1) || 0,
    turbidity: parseFloat(reading.field2) || 0,
    temperature: parseFloat(reading.field3) || 0,
    dissolvedOxygen: parseFloat(reading.field4) || 0,
    tds: parseFloat(reading.field5) || 0,
    conductivity: parseFloat(reading.field6) || 0,
    chlorine: parseFloat(reading.field7) || 0,
    hardness: parseFloat(reading.field8) || 0,
  };
}