import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Droplets,
  Factory,
  Leaf,
  Home,
  Building2,
  Car,
  Waves,
  Sparkles,
  IndianRupee,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface WaterData {
  ph: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  tds: number;
  conductivity: number;
  chlorine: number;
  hardness: number;
}

interface UsageCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  requirements: {
    ph: [number, number];
    turbidity: number;
    tds: number;
    chlorine: [number, number];
    hardness: number;
  };
  treatmentCost: number; // ₹ per 1000L
  priority: number;
}

const usageCategories: UsageCategory[] = [
  {
    id: "drinking",
    name: "Drinking Water",
    icon: Droplets,
    description: "Safe for human consumption after proper treatment",
    requirements: { ph: [6.5, 8.5], turbidity: 5, tds: 500, chlorine: [0.2, 1.0], hardness: 200 },
    treatmentCost: 8,
    priority: 1,
  },
  {
    id: "domestic",
    name: "Domestic Use",
    icon: Home,
    description: "Bathing, washing, cleaning purposes",
    requirements: { ph: [6.0, 9.0], turbidity: 10, tds: 1000, chlorine: [0.1, 2.0], hardness: 300 },
    treatmentCost: 5,
    priority: 2,
  },
  {
    id: "agriculture",
    name: "Agriculture/Irrigation",
    icon: Leaf,
    description: "Crop irrigation and farming needs",
    requirements: { ph: [5.5, 9.0], turbidity: 50, tds: 2000, chlorine: [0, 3.0], hardness: 500 },
    treatmentCost: 2,
    priority: 3,
  },
  {
    id: "industrial",
    name: "Industrial Process",
    icon: Factory,
    description: "Manufacturing, cooling, processing",
    requirements: { ph: [6.0, 9.0], turbidity: 25, tds: 1500, chlorine: [0, 2.5], hardness: 400 },
    treatmentCost: 3,
    priority: 4,
  },
  {
    id: "construction",
    name: "Construction",
    icon: Building2,
    description: "Concrete mixing, curing, dust suppression",
    requirements: { ph: [6.0, 9.5], turbidity: 100, tds: 3000, chlorine: [0, 5.0], hardness: 600 },
    treatmentCost: 1,
    priority: 5,
  },
  {
    id: "vehicle",
    name: "Vehicle Washing",
    icon: Car,
    description: "Car and vehicle cleaning",
    requirements: { ph: [6.0, 9.0], turbidity: 30, tds: 1500, chlorine: [0, 2.0], hardness: 350 },
    treatmentCost: 2,
    priority: 6,
  },
  {
    id: "aquaculture",
    name: "Aquaculture/Fish Farming",
    icon: Waves,
    description: "Fish and aquatic life cultivation",
    requirements: { ph: [6.5, 9.0], turbidity: 25, tds: 1000, chlorine: [0, 0.05], hardness: 300 },
    treatmentCost: 4,
    priority: 7,
  },
  {
    id: "recreational",
    name: "Recreational/Pools",
    icon: Sparkles,
    description: "Swimming pools, fountains, water parks",
    requirements: { ph: [7.0, 7.8], turbidity: 1, tds: 1500, chlorine: [1.0, 3.0], hardness: 250 },
    treatmentCost: 6,
    priority: 8,
  },
];

function checkCompatibility(data: WaterData, category: UsageCategory): { compatible: boolean; issues: string[]; additionalCost: number } {
  const issues: string[] = [];
  let additionalCost = 0;

  // Check pH
  if (data.ph < category.requirements.ph[0]) {
    issues.push(`pH too low (need ≥${category.requirements.ph[0]})`);
    additionalCost += 1;
  } else if (data.ph > category.requirements.ph[1]) {
    issues.push(`pH too high (need ≤${category.requirements.ph[1]})`);
    additionalCost += 1;
  }

  // Check turbidity
  if (data.turbidity > category.requirements.turbidity) {
    issues.push(`Turbidity too high (need <${category.requirements.turbidity} NTU)`);
    additionalCost += 2;
  }

  // Check TDS
  if (data.tds > category.requirements.tds) {
    issues.push(`TDS too high (need <${category.requirements.tds} ppm)`);
    additionalCost += 3;
  }

  // Check chlorine
  if (data.chlorine < category.requirements.chlorine[0]) {
    issues.push(`Chlorine too low (need ≥${category.requirements.chlorine[0]} mg/L)`);
    additionalCost += 0.5;
  } else if (data.chlorine > category.requirements.chlorine[1]) {
    issues.push(`Chlorine too high (need ≤${category.requirements.chlorine[1]} mg/L)`);
    additionalCost += 1;
  }

  // Check hardness
  if (data.hardness > category.requirements.hardness) {
    issues.push(`Hardness too high (need <${category.requirements.hardness} mg/L)`);
    additionalCost += 2;
  }

  return {
    compatible: issues.length === 0,
    issues,
    additionalCost,
  };
}

interface WaterUsageRecommendationProps {
  data: WaterData;
}

export function WaterUsageRecommendation({ data }: WaterUsageRecommendationProps) {
  const recommendations = usageCategories
    .map((category) => {
      const result = checkCompatibility(data, category);
      return {
        ...category,
        ...result,
        totalCost: category.treatmentCost + result.additionalCost,
      };
    })
    .sort((a, b) => {
      // Sort by compatibility first, then by cost
      if (a.compatible && !b.compatible) return -1;
      if (!a.compatible && b.compatible) return 1;
      return a.totalCost - b.totalCost;
    });

  const bestOption = recommendations.find((r) => r.compatible) || recommendations[0];
  const compatibleCount = recommendations.filter((r) => r.compatible).length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Optimal Water Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Best Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <bestOption.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{bestOption.name}</h4>
              <p className="text-xs text-muted-foreground">{bestOption.description}</p>
            </div>
            <Badge variant={bestOption.compatible ? "default" : "secondary"}>
              {bestOption.compatible ? "Ready" : "Needs Treatment"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="h-4 w-4 text-secondary" />
            <span className="font-medium">₹{bestOption.totalCost}/1000L</span>
            <span className="text-muted-foreground">treatment cost</span>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm px-2">
          <span className="text-muted-foreground">Compatible uses:</span>
          <Badge variant="outline">{compatibleCount}/{usageCategories.length}</Badge>
        </div>

        {/* All Options */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border transition-all ${
                rec.compatible
                  ? "bg-secondary/5 border-secondary/20 hover:bg-secondary/10"
                  : "bg-muted/30 border-border/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <rec.icon className={`h-4 w-4 ${rec.compatible ? "text-secondary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${!rec.compatible && "text-muted-foreground"}`}>
                      {rec.name}
                    </span>
                    {rec.compatible ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  {!rec.compatible && rec.issues.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {rec.issues[0]}
                      {rec.issues.length > 1 && ` +${rec.issues.length - 1} more`}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium">₹{rec.totalCost}</div>
                  <div className="text-xs text-muted-foreground">/1000L</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cost Legend */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <p>💡 Costs include base treatment + additional adjustments needed for your current water quality</p>
        </div>
      </CardContent>
    </Card>
  );
}
