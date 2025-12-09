import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

interface FlowPipeProps {
  flowRate: string;
  isActive: boolean;
}

export function FlowPipe({ flowRate, isActive }: FlowPipeProps) {
  return (
    <div className="flex flex-col items-center justify-center mx-4">
      {/* Pipe */}
      <div className="relative w-32 h-4 bg-gradient-to-r from-border to-border/50 rounded-full overflow-hidden">
        {isActive && (
          <>
            {/* Animated water drops */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                initial={{ left: "-10%" }}
                animate={{ left: "110%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "linear",
                }}
              >
                <Droplets className="w-3 h-3 text-primary" />
              </motion.div>
            ))}
          </>
        )}
      </div>
      
      {/* Flow rate label */}
      <div className="mt-2 text-xs font-medium text-muted-foreground">
        {flowRate}
      </div>
    </div>
  );
}
