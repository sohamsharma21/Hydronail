import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Share2, Trash2, Calendar, FileSpreadsheet, File } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Report {
  id: string;
  report_type: string;
  file_url: string | null;
  generated_by: string | null;
  generated_at: string;
  file_size: number | null;
  status: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [reportType, setReportType] = useState("daily_quality");
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Fetch actual data for the report
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const { fetchReportData, getReportContent, downloadReport } = await import("@/lib/reportGenerator");
      const reportData = await fetchReportData(reportType, startDate, endDate);
      const reportContent = getReportContent(reportType, reportData);

      // Download the report
      const filename = `${reportType}_${new Date().toISOString().split('T')[0]}`;
      downloadReport(reportContent, filename, format);

      // Save to database
      const { error } = await supabase.from('reports').insert({
        report_type: reportType,
        status: 'ready',
        generated_by: 'Admin User',
        file_size: new Blob([reportContent]).size,
      });

      if (error) throw error;

      toast({ title: "Success", description: "Report generated and downloaded!" });
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      toast({ title: "Error", description: "Failed to generate report", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });

      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-destructive" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-secondary" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports & Documentation</h1>
            <p className="text-muted-foreground">Generate compliance reports and export data</p>
          </div>
        </div>

        {/* Report Generator */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <h2 className="text-xl font-semibold mb-6">Generate Custom Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_quality">📊 Daily Water Quality Report</SelectItem>
                  <SelectItem value="equipment">🔧 Equipment Maintenance Log</SelectItem>
                  <SelectItem value="chemical">💊 Chemical Usage Report</SelectItem>
                  <SelectItem value="compliance">✅ Regulatory Compliance Report</SelectItem>
                  <SelectItem value="cost">💰 Cost Analysis Report</SelectItem>
                  <SelectItem value="efficiency">⚡ Treatment Efficiency Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">📄 PDF</SelectItem>
                  <SelectItem value="excel">📊 Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">📋 CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <label htmlFor="charts" className="text-sm">Include charts</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="raw-data"
                  checked={includeRawData}
                  onCheckedChange={(checked) => setIncludeRawData(checked as boolean)}
                />
                <label htmlFor="raw-data" className="text-sm">Include raw data</label>
              </div>
            </div>
          </div>

          <Button 
            onClick={generateReport} 
            disabled={generating}
            size="lg"
            className="w-full md:w-auto"
          >
            {generating ? "Generating..." : "Generate Report"}
          </Button>
        </Card>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Today's Summary</h3>
                <p className="text-sm text-muted-foreground">Complete daily operations</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <FileSpreadsheet className="h-8 w-8 text-secondary" />
              <div>
                <h3 className="font-semibold">Weekly Overview</h3>
                <p className="text-sm text-muted-foreground">Last 7 days metrics</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Monthly Compliance</h3>
                <p className="text-sm text-muted-foreground">Standards adherence</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </Card>
        </div>

        {/* Recent Reports Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Report History</h2>
          
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading reports...</p>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reports generated yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold">Report</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Generated</th>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {getFormatIcon('pdf')}
                          <span className="font-medium">
                            {report.report_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">{report.report_type}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(report.generated_at), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm">{report.file_size ? formatBytes(report.file_size) : 'N/A'}</span>
                      </td>
                      <td className="py-4">
                        <span className={`text-sm px-2 py-1 rounded ${
                          report.status === 'ready' ? 'bg-secondary/20 text-secondary' : 'bg-warning/20 text-warning'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Reports;
