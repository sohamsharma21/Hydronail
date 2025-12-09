import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface SensorCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  unit: string;
  status: "optimal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  sparklineData?: number[];
  delay?: number;
}

export function SensorCard({
  icon: Icon,
  title,
  value,
  unit,
  status,
  trend,
  sparklineData = [],
  delay = 0,
}: SensorCardProps) {
  const statusColors = {
    optimal: "bg-secondary text-secondary-foreground",
    warning: "bg-warning text-warning-foreground",
    critical: "bg-destructive text-destructive-foreground",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-secondary" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="glass-card hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">{title}</CardTitle>
          <Icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className="text-xl md:text-3xl font-bold">{value.toFixed(2)}</span>
            <span className="text-xs md:text-sm text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-3">
            <Badge className={`${statusColors[status]} text-[10px] md:text-xs px-1.5 md:px-2`} variant="secondary">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </div>
          {sparklineData.length > 0 && (
            <div className="mt-2 md:mt-3 h-6 md:h-8 hidden sm:flex items-end gap-0.5 md:gap-1">
              {sparklineData.slice(-10).map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-sm"
                  style={{ height: `${(val / Math.max(...sparklineData)) * 100}%` }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
