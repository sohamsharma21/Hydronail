import { Badge } from "@/components/ui/badge";
import { Droplet, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  waterQuality: number;
  equipmentHealth: number;
  chemicalEfficiency: number;
}

export function HeroSection({
  waterQuality,
  equipmentHealth,
  chemicalEfficiency,
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl p-8 mb-8"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to <span className="gradient-text">HydroNail</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Real-time Water Treatment Monitoring System
        </p>

        <div className="flex flex-wrap gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-base bg-secondary/10 border-secondary text-secondary-foreground"
            >
              <Droplet className="mr-2 h-5 w-5" />
              Water Quality: {waterQuality.toFixed(2)}%
            </Badge>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-base bg-primary/10 border-primary text-primary"
            >
              <Activity className="mr-2 h-5 w-5" />
              Equipment Health: {equipmentHealth.toFixed(2)}%
            </Badge>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-base bg-warning/10 border-warning text-warning-foreground"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Chemical Efficiency: {chemicalEfficiency}%
            </Badge>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}