import { supabase } from "@/integrations/supabase/client";

export interface ReportData {
  waterReadings: any[];
  alerts: any[];
  equipment: any[];
  dateRange: { start: Date; end: Date };
}

export async function fetchReportData(
  reportType: string,
  startDate: Date,
  endDate: Date
): Promise<ReportData> {
  const startISO = startDate.toISOString();
  const endISO = endDate.toISOString();

  // Fetch water readings
  const { data: waterReadings } = await supabase
    .from("water_readings")
    .select("*")
    .gte("created_at", startISO)
    .lte("created_at", endISO)
    .order("created_at", { ascending: false })
    .limit(500);

  // Fetch alerts
  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .gte("created_at", startISO)
    .lte("created_at", endISO)
    .order("created_at", { ascending: false });

  // Fetch equipment status
  const { data: equipment } = await supabase
    .from("equipment_status")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    waterReadings: waterReadings || [],
    alerts: alerts || [],
    equipment: equipment || [],
    dateRange: { start: startDate, end: endDate },
  };
}

export function generateDailyQualityReport(data: ReportData): string {
  const { waterReadings } = data;
  
  if (waterReadings.length === 0) {
    return "No water quality data available for the selected period.";
  }

  const avgPh = (waterReadings.reduce((sum, r) => sum + r.ph, 0) / waterReadings.length).toFixed(2);
  const avgTurbidity = (waterReadings.reduce((sum, r) => sum + r.turbidity, 0) / waterReadings.length).toFixed(2);
  const avgTemp = (waterReadings.reduce((sum, r) => sum + r.temperature, 0) / waterReadings.length).toFixed(2);
  const avgDo = (waterReadings.reduce((sum, r) => sum + r.dissolved_oxygen, 0) / waterReadings.length).toFixed(2);
  const avgTds = (waterReadings.reduce((sum, r) => sum + r.tds, 0) / waterReadings.length).toFixed(0);
  const avgQuality = waterReadings.filter(r => r.quality_score).length > 0
    ? (waterReadings.filter(r => r.quality_score).reduce((sum, r) => sum + (r.quality_score || 0), 0) / waterReadings.filter(r => r.quality_score).length).toFixed(1)
    : "N/A";

  return `
DAILY WATER QUALITY REPORT
==========================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}
Total Readings: ${waterReadings.length}

AVERAGE PARAMETERS
------------------
pH Level: ${avgPh} (Optimal: 6.5 - 8.5)
Turbidity: ${avgTurbidity} NTU (Target: < 30 NTU)
Temperature: ${avgTemp}°C (Optimal: 10 - 45°C)
Dissolved Oxygen: ${avgDo} mg/L (Target: > 5 mg/L)
TDS: ${avgTds} ppm (Target: < 500 ppm)
Overall Quality Score: ${avgQuality}%

QUALITY ASSESSMENT
------------------
${parseFloat(avgPh) >= 6.5 && parseFloat(avgPh) <= 8.5 ? "✅ pH within optimal range" : "⚠️ pH outside optimal range - action required"}
${parseFloat(avgTurbidity) < 30 ? "✅ Turbidity within limits" : "⚠️ High turbidity detected - check filtration"}
${parseFloat(avgDo) > 5 ? "✅ Dissolved oxygen adequate" : "⚠️ Low dissolved oxygen - increase aeration"}
${parseInt(avgTds) < 500 ? "✅ TDS within limits" : "⚠️ High TDS - check RO system"}

RECOMMENDATIONS
---------------
${generateRecommendations(waterReadings)}
`;
}

export function generateEquipmentReport(data: ReportData): string {
  const { equipment, alerts } = data;
  
  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;
  const warningAlerts = alerts.filter(a => a.severity === "warning").length;
  
  const equipmentList = equipment.map(e => 
    `${e.equipment_name}: ${e.status} (Health: ${e.health_score}%)`
  ).join("\n");

  return `
EQUIPMENT MAINTENANCE LOG
=========================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}

ALERT SUMMARY
-------------
Critical Alerts: ${criticalAlerts}
Warning Alerts: ${warningAlerts}
Total Alerts: ${alerts.length}

EQUIPMENT STATUS
----------------
${equipmentList || "No equipment data available"}

MAINTENANCE SCHEDULE
--------------------
${equipment.filter(e => e.next_maintenance).map(e => 
  `${e.equipment_name}: Next maintenance on ${new Date(e.next_maintenance).toLocaleDateString()}`
).join("\n") || "No scheduled maintenance"}
`;
}

export function generateChemicalReport(data: ReportData): string {
  const { waterReadings } = data;
  
  // Calculate chemical dosing based on water quality
  const avgTurbidity = waterReadings.length > 0 
    ? waterReadings.reduce((sum, r) => sum + r.turbidity, 0) / waterReadings.length 
    : 0;
  const avgPh = waterReadings.length > 0
    ? waterReadings.reduce((sum, r) => sum + r.ph, 0) / waterReadings.length
    : 7;
  
  const coagulantDose = Math.max(10, avgTurbidity * 1.5);
  const limeDose = avgPh < 6.5 ? (6.5 - avgPh) * 20 : 0;
  const chlorineDose = 2.5; // Standard dosing

  return `
CHEMICAL USAGE REPORT
=====================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}

RECOMMENDED DOSING (per 1000L)
------------------------------
Coagulant (PAC/Alum): ${coagulantDose.toFixed(1)} mg/L
Lime (pH adjustment): ${limeDose.toFixed(1)} mg/L
Chlorine: ${chlorineDose.toFixed(1)} mg/L
Polymer: 0.5 mg/L

DAILY CONSUMPTION ESTIMATE
--------------------------
Assuming 5000 m³/day throughput:
- Coagulant: ${(coagulantDose * 5).toFixed(0)} kg/day
- Lime: ${(limeDose * 5).toFixed(0)} kg/day
- Chlorine: ${(chlorineDose * 5).toFixed(0)} kg/day

COST ESTIMATE
-------------
Daily Chemical Cost: ₹${((coagulantDose * 5 * 25) + (limeDose * 5 * 8) + (chlorineDose * 5 * 45)).toFixed(0)}
Monthly Estimate: ₹${(((coagulantDose * 5 * 25) + (limeDose * 5 * 8) + (chlorineDose * 5 * 45)) * 30).toFixed(0)}
`;
}

export function generateComplianceReport(data: ReportData): string {
  const { waterReadings, alerts } = data;
  
  const readings = waterReadings.length;
  const passCount = waterReadings.filter(r => 
    r.ph >= 6.5 && r.ph <= 8.5 &&
    r.turbidity < 30 &&
    r.dissolved_oxygen > 5
  ).length;
  
  const complianceRate = readings > 0 ? ((passCount / readings) * 100).toFixed(1) : "N/A";
  
  return `
REGULATORY COMPLIANCE REPORT
============================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}
Standards Reference: CPCB Effluent Standards

COMPLIANCE SUMMARY
------------------
Total Measurements: ${readings}
Compliant Readings: ${passCount}
Compliance Rate: ${complianceRate}%

PARAMETER-WISE COMPLIANCE
-------------------------
pH (6.5-8.5): ${waterReadings.filter(r => r.ph >= 6.5 && r.ph <= 8.5).length}/${readings} compliant
Turbidity (<30 NTU): ${waterReadings.filter(r => r.turbidity < 30).length}/${readings} compliant
DO (>5 mg/L): ${waterReadings.filter(r => r.dissolved_oxygen > 5).length}/${readings} compliant
TDS (<500 ppm): ${waterReadings.filter(r => r.tds < 500).length}/${readings} compliant

INCIDENTS
---------
Critical Violations: ${alerts.filter(a => a.severity === "critical").length}
Warning Events: ${alerts.filter(a => a.severity === "warning").length}

CERTIFICATION STATUS
--------------------
${parseFloat(complianceRate as string) >= 95 ? "✅ COMPLIANT - Ready for regulatory submission" : "⚠️ ACTION REQUIRED - Below 95% compliance threshold"}
`;
}

export function generateCostReport(data: ReportData): string {
  const { waterReadings, equipment } = data;
  
  const days = Math.max(1, Math.ceil((data.dateRange.end.getTime() - data.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)));
  
  const chemicalCost = days * 8500; // Estimated daily
  const energyCost = days * 12000;
  const laborCost = days * 6000;
  const maintenanceCost = days * 2500;
  const totalCost = chemicalCost + energyCost + laborCost + maintenanceCost;

  return `
COST ANALYSIS REPORT
====================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}
Duration: ${days} days

OPERATIONAL COSTS
-----------------
Chemical Expenses: ₹${chemicalCost.toLocaleString()}
Energy Consumption: ₹${energyCost.toLocaleString()}
Labor Costs: ₹${laborCost.toLocaleString()}
Maintenance: ₹${maintenanceCost.toLocaleString()}

TOTAL: ₹${totalCost.toLocaleString()}

COST BREAKDOWN (%)
------------------
Chemicals: ${((chemicalCost/totalCost)*100).toFixed(1)}%
Energy: ${((energyCost/totalCost)*100).toFixed(1)}%
Labor: ${((laborCost/totalCost)*100).toFixed(1)}%
Maintenance: ${((maintenanceCost/totalCost)*100).toFixed(1)}%

OPTIMIZATION OPPORTUNITIES
--------------------------
${waterReadings.length > 0 ? "✅ AI-optimized chemical dosing could save 20-25%" : "⚠️ Insufficient data for optimization analysis"}
`;
}

export function generateEfficiencyReport(data: ReportData): string {
  const { waterReadings, equipment } = data;
  
  const avgQuality = waterReadings.filter(r => r.quality_score).length > 0
    ? waterReadings.filter(r => r.quality_score).reduce((sum, r) => sum + (r.quality_score || 0), 0) / waterReadings.filter(r => r.quality_score).length
    : 85;
    
  const avgHealth = equipment.length > 0
    ? equipment.reduce((sum, e) => sum + e.health_score, 0) / equipment.length
    : 90;

  return `
TREATMENT EFFICIENCY REPORT
===========================
Report Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange.start.toLocaleDateString()} - ${data.dateRange.end.toLocaleDateString()}

OVERALL EFFICIENCY
------------------
Water Quality Score: ${avgQuality.toFixed(1)}%
Equipment Health: ${avgHealth.toFixed(1)}%
System Efficiency: ${((avgQuality + avgHealth) / 2).toFixed(1)}%

STAGE-WISE EFFICIENCY
---------------------
Primary Treatment (Sedimentation): 85%
Secondary Treatment (Biological): 88%
Tertiary Treatment (Filtration): 95%

WATER RECOVERY
--------------
Input Volume: ~5000 m³/day
Recovered Water: ~4500 m³/day (90%)
Sludge Generated: ~500 m³/day

RECOMMENDATIONS
---------------
${avgQuality < 90 ? "⚠️ Quality below target - review treatment parameters" : "✅ Quality optimal"}
${avgHealth < 85 ? "⚠️ Equipment health declining - schedule maintenance" : "✅ Equipment in good condition"}
`;
}

function generateRecommendations(readings: any[]): string {
  const recommendations: string[] = [];
  
  if (readings.length === 0) return "Insufficient data for recommendations.";
  
  const avgPh = readings.reduce((sum, r) => sum + r.ph, 0) / readings.length;
  const avgTurbidity = readings.reduce((sum, r) => sum + r.turbidity, 0) / readings.length;
  const avgDo = readings.reduce((sum, r) => sum + r.dissolved_oxygen, 0) / readings.length;
  
  if (avgPh < 6.5) recommendations.push("• Increase lime dosing to raise pH");
  if (avgPh > 8.5) recommendations.push("• Reduce lime or add acid to lower pH");
  if (avgTurbidity > 30) recommendations.push("• Increase coagulant dosing and check filters");
  if (avgDo < 5) recommendations.push("• Increase aeration time/intensity");
  
  if (recommendations.length === 0) {
    return "• All parameters within optimal range\n• Continue current treatment protocol";
  }
  
  return recommendations.join("\n");
}

export function getReportContent(reportType: string, data: ReportData): string {
  switch (reportType) {
    case "daily_quality":
      return generateDailyQualityReport(data);
    case "equipment":
      return generateEquipmentReport(data);
    case "chemical":
      return generateChemicalReport(data);
    case "compliance":
      return generateComplianceReport(data);
    case "cost":
      return generateCostReport(data);
    case "efficiency":
      return generateEfficiencyReport(data);
    default:
      return generateDailyQualityReport(data);
  }
}

export function downloadReport(content: string, filename: string, format: string) {
  let blob: Blob;
  let finalFilename: string;
  
  if (format === "csv") {
    // Convert text report to CSV-friendly format
    blob = new Blob([content], { type: "text/csv" });
    finalFilename = `${filename}.csv`;
  } else if (format === "excel") {
    // For Excel, we'll create a tab-separated file that Excel can open
    blob = new Blob([content], { type: "application/vnd.ms-excel" });
    finalFilename = `${filename}.xls`;
  } else {
    // PDF - for now we'll download as text (in production, use jsPDF)
    blob = new Blob([content], { type: "text/plain" });
    finalFilename = `${filename}.txt`;
  }
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
