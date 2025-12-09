import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AlertData {
  id: string;
  message: string;
  severity: string;
  type: string;
  sensor_name?: string | null;
  current_value?: number | null;
  threshold_value?: number | null;
}

export function useAlertEmail() {
  const sendAlertEmail = async (alert: AlertData) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-alert-email", {
        body: {
          alertId: alert.id,
          message: alert.message,
          severity: alert.severity,
          type: alert.type,
          sensorName: alert.sensor_name,
          currentValue: alert.current_value,
          thresholdValue: alert.threshold_value,
        },
      });

      if (error) throw error;

      if (data.sent > 0) {
        toast({
          title: "Email Sent",
          description: `Alert sent to ${data.sent} recipient(s)`,
        });
      } else if (data.sent === 0 && data.total === 0) {
        toast({
          title: "No Recipients",
          description: "No active recipients configured for this alert type",
          variant: "destructive",
        });
      }

      return data;
    } catch (error: any) {
      console.error("Error sending alert email:", error);
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send alert email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendTestEmail = async () => {
    try {
      const testAlert: AlertData = {
        id: "test-" + Date.now(),
        message: "Test Alert - This is a test notification from HydroNail",
        severity: "info",
        type: "info",
        sensor_name: "Test Sensor",
        current_value: 7.5,
        threshold_value: 8.0,
      };

      return await sendAlertEmail(testAlert);
    } catch (error) {
      throw error;
    }
  };

  return { sendAlertEmail, sendTestEmail };
}
