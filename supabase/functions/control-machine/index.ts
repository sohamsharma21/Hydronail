import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ControlRequest {
  machineId: string;
  action: "start" | "stop" | "set_speed" | "set_mode";
  value?: number;
}

const ALLOWED_ACTIONS = ["start", "stop", "set_speed", "set_mode"];
const MACHINE_API_BASE = Deno.env.get("MACHINE_API_URL") || "http://localhost:5000";

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with user's token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
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
      console.error("Role check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Forbidden - Operator or Admin role required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request body
    const body: ControlRequest = await req.json();
    
    // Validate machineId
    if (!body.machineId || typeof body.machineId !== "string" || body.machineId.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid machine ID" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate action
    if (!body.action || !ALLOWED_ACTIONS.includes(body.action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be: start, stop, set_speed, or set_mode" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate value for set_speed action
    if (body.action === "set_speed" && (body.value === undefined || body.value < 0 || body.value > 100)) {
      return new Response(
        JSON.stringify({ error: "Speed must be between 0 and 100" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`User ${user.email} (${roleData[0].role}) executing: ${body.action} on machine ${body.machineId}`);

    // Log the action to audit_logs
    const { error: auditError } = await supabaseClient
      .from("audit_logs")
      .insert({
        user_id: user.id,
        action: body.action,
        resource_type: "machine",
        resource_id: body.machineId,
        details: {
          value: body.value,
          user_email: user.email,
          user_role: roleData[0].role,
        },
      });

    if (auditError) {
      console.error("Failed to create audit log:", auditError);
      // Don't fail the request, just log the error
    }

    // Forward the control command to the machine API
    // In production, this should be an internal network call
    let machineResponse;
    try {
      const endpoint = body.action === "set_speed" || body.action === "set_mode"
        ? `${MACHINE_API_BASE}/api/control/${body.machineId}/${body.action}`
        : `${MACHINE_API_BASE}/api/control/${body.machineId}/${body.action}`;

      machineResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: body.value }),
      });

      if (!machineResponse.ok) {
        throw new Error(`Machine API returned ${machineResponse.status}`);
      }
    } catch (apiError) {
      console.error("Machine API error:", apiError);
      // For demo purposes, return success even if machine API is unavailable
      return new Response(
        JSON.stringify({
          success: true,
          message: `Command ${body.action} sent to machine ${body.machineId}`,
          demo_mode: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await machineResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Command ${body.action} executed on machine ${body.machineId}`,
        result,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in control-machine function:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
