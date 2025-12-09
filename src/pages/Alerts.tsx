import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, AlertTriangle, Info, CheckCircle, Search, Download, Eye, Check, X, Mail, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { RecipientManager } from "@/components/alerts/RecipientManager";
import { useAlertEmail } from "@/hooks/useAlertEmail";

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  sensor_name: string | null;
  threshold_value: number | null;
  current_value: number | null;
  is_read: boolean;
  created_at: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  
  const { sendAlertEmail, sendTestEmail } = useAlertEmail();

  useEffect(() => {
    fetchAlerts();
    
    // Real-time subscription
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, activeTab, searchQuery]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (activeTab !== "all") {
      filtered = filtered.filter(alert => alert.type === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.sensor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Alert marked as read",
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All alerts marked as read",
      });
    } catch (error) {
      console.error('Error updating alerts:', error);
    }
  };

  const handleSendEmail = async (alert: Alert) => {
    setSendingEmail(alert.id);
    try {
      await sendAlertEmail(alert);
    } finally {
      setSendingEmail(null);
    }
  };

  const handleTestEmail = async () => {
    try {
      await sendTestEmail();
    } catch (error) {
      // Error already handled in hook
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-destructive/10 border-destructive";
      case "warning":
        return "bg-warning/10 border-warning";
      case "resolved":
        return "bg-secondary/10 border-secondary";
      default:
        return "bg-primary/10 border-primary";
    }
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === "critical").length,
    warning: alerts.filter(a => a.type === "warning").length,
    info: alerts.filter(a => a.type === "info").length,
    unread: alerts.filter(a => !a.is_read).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 px-4 sm:py-8">
        {/* Header Section - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Alerts & Notifications</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Real-time system alerts and email notifications</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleTestEmail} size="sm" className="flex-1 sm:flex-none">
              <Send className="mr-2 h-4 w-4" />
              Test Email
            </Button>
            <Badge variant="destructive" className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2">
              {stats.unread} Unread
            </Badge>
          </div>
        </div>

        {/* Main Grid - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Filter Bar */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full h-auto">
                    <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
                      All <Badge className="ml-1 sm:ml-2 text-xs" variant="secondary">{stats.total}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="critical" className="text-xs sm:text-sm py-2">
                      Critical <Badge className="ml-1 sm:ml-2 text-xs hidden sm:inline" variant="destructive">{stats.critical}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="warning" className="text-xs sm:text-sm py-2">
                      Warning <Badge className="ml-1 sm:ml-2 text-xs hidden sm:inline bg-warning text-warning-foreground">{stats.warning}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="info" className="text-xs sm:text-sm py-2 hidden sm:flex">
                      Info <Badge className="ml-2 text-xs" variant="default">{stats.info}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs sm:text-sm py-2 hidden sm:flex">
                      Resolved
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={markAllAsRead} variant="secondary" size="sm" className="flex-1 sm:flex-none">
                      <Check className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Mark All as</span> Read
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Download className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export</span> CSV
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
              {loading ? (
                <Card className="p-6">
                  <p className="text-center text-muted-foreground">Loading alerts...</p>
                </Card>
              ) : filteredAlerts.length === 0 ? (
                <Card className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </Card>
              ) : (
              filteredAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`p-4 sm:p-6 border-l-4 ${getAlertBgColor(alert.type)} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="mt-1 flex-shrink-0">{getAlertIcon(alert.type)}</div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-base sm:text-lg break-words">{alert.message}</h3>
                              {!alert.is_read && (
                                <Badge variant="default" className="bg-primary text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {alert.sensor_name && <span className="block sm:inline">Sensor: {alert.sensor_name}</span>}
                              {alert.threshold_value && <span className="block sm:inline"> {alert.sensor_name && <span className="hidden sm:inline">| </span>}Threshold: {alert.threshold_value}</span>}
                              {alert.current_value && <span className="block sm:inline"> {(alert.sensor_name || alert.threshold_value) && <span className="hidden sm:inline">| </span>}Current: {alert.current_value}</span>}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs self-start flex-shrink-0">
                            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                          {!alert.is_read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs sm:text-sm"
                            >
                              <Check className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Mark as</span> Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(alert)}
                            disabled={sendingEmail === alert.id}
                            className="text-xs sm:text-sm"
                          >
                            <Mail className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            {sendingEmail === alert.id ? "..." : "Email"}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                            <Eye className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs sm:text-sm">
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Statistics Sidebar - Show first on mobile */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Alert Summary - Horizontal on mobile */}
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Alert Summary</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 sm:gap-4">
                <div className="flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                  <span className="text-xs lg:text-sm">Total</span>
                  <Badge variant="secondary" className="mt-1 lg:mt-0">{stats.total}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                  <span className="text-xs lg:text-sm">Critical</span>
                  <Badge variant="destructive" className="mt-1 lg:mt-0">{stats.critical}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                  <span className="text-xs lg:text-sm">Warning</span>
                  <Badge className="bg-warning text-warning-foreground mt-1 lg:mt-0">{stats.warning}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                  <span className="text-xs lg:text-sm">Info</span>
                  <Badge variant="default" className="mt-1 lg:mt-0">{stats.info}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                  <span className="text-xs lg:text-sm">Unread</span>
                  <Badge variant="outline" className="mt-1 lg:mt-0">{stats.unread}</Badge>
                </div>
              </div>
            </Card>

            {/* Response Metrics - Hidden on mobile, visible on larger screens */}
            <Card className="p-4 sm:p-6 hidden lg:block">
              <h3 className="font-semibold text-lg mb-4">Response Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Resolution Rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">12 min</p>
                </div>
              </div>
            </Card>

            {/* Recipient Manager */}
            <RecipientManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
