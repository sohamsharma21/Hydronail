import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AlertEmailRequest {
  alertId: string;
  message: string;
  severity: string;
  type: string;
  sensorName?: string;
  currentValue?: number;
  thresholdValue?: number;
}

interface EmailResult {
  id?: string;
  error?: { message: string };
}

async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return { error: { message: "RESEND_API_KEY is not configured" } };
  }

  console.log(`Attempting to send email to: ${to}`);
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HydroNail Alerts <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    
    const responseText = await res.text();
    console.log(`Resend API response (${res.status}):`, responseText);
    
    if (!res.ok) {
      // Parse error for better feedback
      try {
        const errorData = JSON.parse(responseText);
        const errorMsg = errorData.message || responseText;
        console.error("Resend API error:", errorMsg);
        return { error: { message: `Resend error: ${errorMsg}. Note: Free tier only allows sending to verified email addresses.` } };
      } catch {
        return { error: { message: `Failed to send email: ${responseText}` } };
      }
    }
    
    return JSON.parse(responseText);
  } catch (err: any) {
    console.error("Email send exception:", err);
    return { error: { message: `Exception: ${err.message}` } };
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "#EF4444";
    case "warning":
      return "#F59E0B";
    case "info":
      return "#3B82F6";
    default:
      return "#10B981";
  }
};

const getSeverityEmoji = (severity: string) => {
  switch (severity) {
    case "critical":
      return "🚨";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return "✅";
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { alertId, message, severity, type, sensorName, currentValue, thresholdValue }: AlertEmailRequest = await req.json();

    console.log("Processing alert email for alert:", alertId);

    // Fetch active recipients who want this type of alert
    const { data: recipients, error: recipientError } = await supabase
      .from("alert_recipients")
      .select("id, email, name")
      .eq("is_active", true)
      .contains("alert_types", [type]);

    if (recipientError) {
      console.error("Error fetching recipients:", recipientError);
      throw recipientError;
    }

    if (!recipients || recipients.length === 0) {
      console.log("No active recipients found for alert type:", type);
      return new Response(
        JSON.stringify({ message: "No recipients configured", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending alert to ${recipients.length} recipients`);

    const color = getSeverityColor(severity);
    const emoji = getSeverityEmoji(severity);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background-color: ${color}; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">${emoji} HydroNail Alert</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">${severity.toUpperCase()} - ${type.toUpperCase()}</p>
              </div>
              
              <div style="padding: 32px;">
                <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">${message}</h2>
                
                ${sensorName ? `
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Sensor</p>
                  <p style="margin: 4px 0 0; color: #1f2937; font-weight: 600;">${sensorName}</p>
                </div>
                ` : ""}
                
                ${currentValue !== undefined && thresholdValue !== undefined ? `
                <div style="display: flex; gap: 16px;">
                  <div style="flex: 1; background-color: #fef2f2; border-radius: 8px; padding: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Current Value</p>
                    <p style="margin: 4px 0 0; color: #dc2626; font-weight: 600; font-size: 24px;">${currentValue}</p>
                  </div>
                  <div style="flex: 1; background-color: #f0fdf4; border-radius: 8px; padding: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Threshold</p>
                    <p style="margin: 4px 0 0; color: #16a34a; font-weight: 600; font-size: 24px;">${thresholdValue}</p>
                  </div>
                </div>
                ` : ""}
                
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Alert ID: ${alertId}<br>
                    Timestamp: ${timestamp}<br>
                    Sent to: ${recipient.email}
                  </p>
                </div>
              </div>
              
              <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  HydroNail Water Treatment Monitoring System<br>
                  <a href="#" style="color: #3b82f6;">View Dashboard</a> | <a href="#" style="color: #3b82f6;">Manage Alerts</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await sendEmail(
          recipient.email,
          `${emoji} [${severity.toUpperCase()}] ${message}`,
          html
        );

        // Log the email send
        await supabase.from("email_logs").insert({
          alert_id: alertId,
          recipient_email: recipient.email,
          status: emailResponse.error ? "failed" : "sent",
          sent_at: new Date().toISOString(),
          error_message: emailResponse.error?.message || null,
        });

        return { email: recipient.email, success: !emailResponse.error };
      })
    );

    const successful = results.filter(r => r.status === "fulfilled" && (r.value as any).success).length;
    const failed = results.length - successful;

    console.log(`Email results: ${successful} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ sent: successful, failed, total: recipients.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-alert-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
