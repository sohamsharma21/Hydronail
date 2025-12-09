import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="glass-card hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">{title}</CardTitle>
          <Icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="text-lg md:text-3xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 truncate">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={`flex items-center mt-1 md:mt-2 text-xs md:text-sm ${
                trend === "up" ? "text-secondary" : "text-destructive"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}