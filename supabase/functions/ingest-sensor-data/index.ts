import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

// Validation ranges for sensor data
const SENSOR_RANGES = {
  ph: { min: 0, max: 14 },
  turbidity: { min: 0, max: 1000 },
  temperature: { min: -20, max: 100 },
  dissolved_oxygen: { min: 0, max: 20 },
  tds: { min: 0, max: 50000 },
  conductivity: { min: 0, max: 10000 },
  chlorine: { min: 0, max: 20 },
  hardness: { min: 0, max: 5000 },
};

interface SensorData {
  ph?: number;
  turbidity?: number;
  temperature?: number;
  dissolved_oxygen?: number;
  tds?: number;
  conductivity?: number;
  chlorine?: number;
  hardness?: number;
  source?: string;
}

function validateSensorValue(key: keyof typeof SENSOR_RANGES, value: number | undefined): string | null {
  if (value === undefined || value === null) return null;
  
  const range = SENSOR_RANGES[key];
  if (typeof value !== "number" || isNaN(value)) {
    return `${key} must be a valid number`;
  }
  if (value < range.min || value > range.max) {
    return `${key} must be between ${range.min} and ${range.max}`;
  }
  return null;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key (for IoT devices) or JWT (for authenticated users)
    const apiKey = req.headers.get("x-api-key");
    const authHeader = req.headers.get("authorization");
    
    // Get the expected API key from secrets
    const expectedApiKey = Deno.env.get("IOT_INGESTION_API_KEY");
    
    let userId: string | null = null;
    let source = "iot_device";

    if (apiKey) {
      // Validate API key for IoT devices
      if (!expectedApiKey || apiKey !== expectedApiKey) {
        console.error("Invalid API key provided");
        return new Response(
          JSON.stringify({ error: "Unauthorized - Invalid API key" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      source = "iot_device";
    } else if (authHeader) {
      // Validate JWT for authenticated users
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        console.error("Auth error:", userError);
        return new Response(
          JSON.stringify({ error: "Unauthorized - Invalid token" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if user has operator or admin role
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["operator", "admin"])
        .limit(1);

      if (roleError || !roleData || roleData.length === 0) {
        return new Response(
          JSON.stringify({ error: "Forbidden - Operator or Admin role required" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      userId = user.id;
      source = "manual_entry";
    } else {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No credentials provided" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    const body: SensorData = await req.json();

    // Validate all sensor values
    const validationErrors: string[] = [];
    for (const [key, range] of Object.entries(SENSOR_RANGES)) {
      const error = validateSensorValue(key as keyof typeof SENSOR_RANGES, body[key as keyof SensorData] as number);
      if (error) {
        validationErrors.push(error);
      }
    }

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validationErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create service role client for inserting data
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert the sensor reading
    const { data, error: insertError } = await serviceClient
      .from("water_readings")
      .insert({
        ph: body.ph,
        turbidity: body.turbidity,
        temperature: body.temperature,
        dissolved_oxygen: body.dissolved_oxygen,
        tds: body.tds,
        conductivity: body.conductivity,
        chlorine: body.chlorine,
        hardness: body.hardness,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save sensor data", details: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sensor data ingested from ${source}${userId ? ` (user: ${userId})` : ""}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sensor data saved successfully",
        id: data.id,
        timestamp: data.created_at,
      }),
      { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in ingest-sensor-data function:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
