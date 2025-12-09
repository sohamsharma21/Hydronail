import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Trophy, DollarSign, Clock, CheckCircle, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7D");
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const daysMap: Record<string, number> = {
        "24H": 1,
        "7D": 7,
        "30D": 30,
        "90D": 90,
        "1Y": 365,
      };
      
      const days = daysMap[timeRange] || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('water_readings')
        .select('quality_score, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        date: new Date(item.created_at).toLocaleDateString(),
        score: item.quality_score || 0,
        target: 85,
      })) || [];

      setQualityData(formattedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const efficiencyData = [
    { name: 'Mon', primary: 85, secondary: 88, tertiary: 95 },
    { name: 'Tue', primary: 87, secondary: 90, tertiary: 96 },
    { name: 'Wed', primary: 84, secondary: 87, tertiary: 94 },
    { name: 'Thu', primary: 86, secondary: 89, tertiary: 95 },
    { name: 'Fri', primary: 88, secondary: 91, tertiary: 97 },
    { name: 'Sat', primary: 85, secondary: 88, tertiary: 95 },
    { name: 'Sun', primary: 87, secondary: 90, tertiary: 96 },
  ];

  const costData = [
    { name: 'Week 1', chemical: 12000, energy: 8000, labor: 5000, maintenance: 3000 },
    { name: 'Week 2', chemical: 11500, energy: 7800, labor: 5000, maintenance: 2500 },
    { name: 'Week 3', chemical: 12200, energy: 8200, labor: 5000, maintenance: 4000 },
    { name: 'Week 4', chemical: 11800, energy: 7900, labor: 5000, maintenance: 3200 },
  ];

  const mlPerformanceData = [
    { name: 'True Positive', value: 70, color: '#10b981' },
    { name: 'True Negative', value: 25, color: '#86efac' },
    { name: 'False Positive', value: 3, color: '#f59e0b' },
    { name: 'False Negative', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Insights</h1>
            <p className="text-muted-foreground">Data-driven decisions for water treatment optimization</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAnalyticsData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs value={timeRange} onValueChange={setTimeRange} className="mb-6">
          <TabsList>
            <TabsTrigger value="24H">24 Hours</TabsTrigger>
            <TabsTrigger value="7D">7 Days</TabsTrigger>
            <TabsTrigger value="30D">30 Days</TabsTrigger>
            <TabsTrigger value="90D">90 Days</TabsTrigger>
            <TabsTrigger value="1Y">1 Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Water Quality Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Water Quality Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Quality Score" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Treatment Efficiency */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Treatment Stage Efficiency</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="primary" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Primary" />
                <Area type="monotone" dataKey="secondary" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Secondary" />
                <Area type="monotone" dataKey="tertiary" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Tertiary" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="chemical" fill="#3b82f6" name="Chemical" />
                <Bar dataKey="energy" fill="#f59e0b" name="Energy" />
                <Bar dataKey="labor" fill="#10b981" name="Labor" />
                <Bar dataKey="maintenance" fill="#ef4444" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* ML Model Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">ML Model Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mlPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {mlPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold text-primary">96.31%</p>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </div>
          </Card>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Performance</p>
                <p className="text-2xl font-bold">98.2%</p>
                <p className="text-xs text-muted-foreground">Nov 28, 2025</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Savings</p>
                <p className="text-2xl font-bold">₹18,450</p>
                <p className="text-xs text-muted-foreground">32% saved</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment Uptime</p>
                <p className="text-2xl font-bold">99.8%</p>
                <p className="text-xs text-muted-foreground">2,847 hours</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">24/24 standards met</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
