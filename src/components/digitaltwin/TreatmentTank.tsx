import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TreatmentTankProps {
  stage: number;
  label: string;
  sublabel: string;
  efficiency: number;
  color: string;
  fillLevel: number;
  isActive: boolean;
  details: string[];
}

export function TreatmentTank({
  stage,
  label,
  sublabel,
  efficiency,
  color,
  fillLevel,
  isActive,
  details,
}: TreatmentTankProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: stage * 0.2 }}
    >
      <div className={cn("text-sm font-semibold", isActive && "text-primary")}>
        Stage {stage}
      </div>
      
      {/* Tank Container */}
      <div className="relative w-48 h-64 perspective-500">
        <div className={cn(
          "absolute inset-0 rounded-lg border-4 border-border",
          "transform-style-preserve-3d rotate-y-5",
          "shadow-2xl overflow-hidden"
        )}>
          {/* Tank Fill Animation */}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 right-0",
              color,
              "opacity-70"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${fillLevel}%` }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {/* Bubbling effect for Stage 2 */}
            {stage === 2 && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/40 rounded-full"
                    style={{ left: `${20 + i * 12}%`, bottom: 0 }}
                    animate={{
                      y: [-20, -200],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Wave effect */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-4 bg-white/20"
              animate={{
                x: [0, 20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Labels */}
      <div className="text-center space-y-1">
        <div className="font-bold text-lg">{label}</div>
        <div className="text-sm text-muted-foreground">{sublabel}</div>
        <div className="text-2xl font-bold text-primary">{efficiency}%</div>
        <div className="text-xs text-muted-foreground">Efficiency</div>
      </div>

      {/* Process Details */}
      <div className="text-xs text-muted-foreground space-y-1 text-center">
        {details.map((detail, i) => (
          <div key={i}>• {detail}</div>
        ))}
      </div>
    </motion.div>
  );
}
