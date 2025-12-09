import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Droplets,
  Filter,
  Wind,
  Sun,
  Beaker,
  Waves,
  CheckCircle2,
  ArrowRight,
  Zap,
  Thermometer,
} from "lucide-react";

interface TreatmentStage {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  duration: string;
  efficiency: number;
  processes: string[];
  chemicals: string[];
  output: string;
}

const stages: TreatmentStage[] = [
  {
    id: "intake",
    name: "Water Intake",
    shortName: "Intake",
    description: "Raw water collection from industrial processes, cooling towers, or municipal sources",
    icon: Waves,
    color: "text-slate-400",
    bgColor: "from-slate-500/20 to-slate-600/20",
    duration: "Continuous",
    efficiency: 100,
    processes: ["Collection", "Screening", "Flow Meter"],
    chemicals: [],
    output: "Raw wastewater with suspended solids and contaminants",
  },
  {
    id: "screening",
    name: "Screening & Grit",
    shortName: "Screen",
    description: "Physical removal of large debris, plastics, and heavy particles",
    icon: Filter,
    color: "text-amber-400",
    bgColor: "from-amber-500/20 to-amber-600/20",
    duration: "5-10 min",
    efficiency: 30,
    processes: ["Bar Screens", "Grit Chamber", "Grease Trap"],
    chemicals: [],
    output: "Water free of large solids (>6mm)",
  },
  {
    id: "primary",
    name: "Primary Treatment",
    shortName: "Primary",
    description: "Sedimentation to remove settleable organic and inorganic solids",
    icon: Droplets,
    color: "text-blue-400",
    bgColor: "from-blue-500/20 to-blue-600/20",
    duration: "2-3 hrs",
    efficiency: 55,
    processes: ["Clarifier", "Sludge Collection", "Scum Removal"],
    chemicals: ["Coagulant", "Polymer"],
    output: "50-60% BOD reduction",
  },
  {
    id: "secondary",
    name: "Secondary Treatment",
    shortName: "Secondary",
    description: "Biological treatment using microorganisms",
    icon: Wind,
    color: "text-green-400",
    bgColor: "from-green-500/20 to-green-600/20",
    duration: "4-8 hrs",
    efficiency: 85,
    processes: ["Aeration", "Activated Sludge", "Clarifier"],
    chemicals: ["Nutrients"],
    output: "85-95% BOD reduction",
  },
  {
    id: "tertiary",
    name: "Tertiary Treatment",
    shortName: "Tertiary",
    description: "Advanced treatment for high-quality reuse water",
    icon: Sun,
    color: "text-purple-400",
    bgColor: "from-purple-500/20 to-purple-600/20",
    duration: "1-2 hrs",
    efficiency: 95,
    processes: ["Sand Filter", "Carbon", "UV"],
    chemicals: ["Chlorine"],
    output: "95-99% contaminant removal",
  },
  {
    id: "advanced",
    name: "Advanced (RO)",
    shortName: "RO",
    description: "Membrane filtration for ultra-pure water",
    icon: Zap,
    color: "text-cyan-400",
    bgColor: "from-cyan-500/20 to-cyan-600/20",
    duration: "30-60 min",
    efficiency: 99,
    processes: ["UF", "RO", "Ion Exchange"],
    chemicals: ["Antiscalant"],
    output: "TDS < 100 ppm",
  },
];

const WaterTreatmentProcess = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePrev = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleReset = () => {
    setCurrentStage(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stage = stages[currentStage];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6 md:py-8 space-y-6 md:space-y-8 safe-area-inset">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Beaker className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Interactive Learning
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold">Water Treatment</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Complete journey from raw water to reusable clean water
          </p>
        </motion.div>

        {/* Stage Progress - Mobile Optimized */}
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-max md:min-w-0 gap-1 md:gap-0">
            {stages.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center flex-1 px-1"
                onClick={() => setCurrentStage(index)}
              >
                <div
                  className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    index <= currentStage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } ${index === currentStage ? "ring-2 md:ring-4 ring-primary/30 scale-110" : ""}`}
                >
                  <s.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`text-[10px] md:text-xs mt-1 md:mt-2 text-center whitespace-nowrap ${
                  index === currentStage ? "text-primary font-semibold" : "text-muted-foreground"
                }`}>
                  {s.shortName}
                </span>
                {index < stages.length - 1 && (
                  <div
                    className={`absolute top-5 md:top-6 left-1/2 w-full h-0.5 md:h-1 ${
                      index < currentStage ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ transform: "translateX(50%)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls - Touch Optimized */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrev} 
            disabled={currentStage === 0}
            className="h-10 w-10 md:h-12 md:w-12"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Button onClick={togglePlay} className="px-6 md:px-8 h-10 md:h-12">
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden md:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden md:inline">Auto</span>
                <span className="md:hidden">Play</span>
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNext} 
            disabled={currentStage === stages.length - 1}
            className="h-10 w-10 md:h-12 md:w-12"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} className="h-10 w-10 md:h-12 md:w-12">
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* Stage Detail - Mobile First */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`bg-gradient-to-br ${stage.bgColor} border-none overflow-hidden`}>
              <CardContent className="p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                  {/* Visual */}
                  <div className="relative order-2 lg:order-1">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="aspect-video bg-background/50 rounded-xl flex items-center justify-center relative overflow-hidden"
                    >
                      {/* Animated water flow */}
                      <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-6 h-6 md:w-8 md:h-8 rounded-full ${stage.color} opacity-20`}
                            initial={{ x: -50, y: Math.random() * 100 + 20 }}
                            animate={{
                              x: ["-10%", "110%"],
                              y: [Math.random() * 80 + 20, Math.random() * 80 + 20],
                            }}
                            transition={{
                              duration: 3 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "linear",
                            }}
                          >
                            <Droplets className="w-full h-full" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Stage icon */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <stage.icon className={`w-20 h-20 md:w-32 md:h-32 ${stage.color}`} />
                      </motion.div>

                      {/* Efficiency indicator */}
                      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-background/80 px-2 py-1 md:px-4 md:py-2 rounded-lg">
                        <div className="text-[10px] md:text-sm text-muted-foreground">Efficiency</div>
                        <div className={`text-lg md:text-2xl font-bold ${stage.color}`}>{stage.efficiency}%</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                    <div>
                      <Badge className={`${stage.color} bg-current/10 border-current/30 mb-2 md:mb-4 text-xs`}>
                        Stage {currentStage + 1}/{stages.length}
                      </Badge>
                      <h2 className="text-xl md:text-3xl font-bold">{stage.name}</h2>
                      <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">{stage.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div className="bg-background/50 p-2 md:p-4 rounded-lg">
                        <div className="text-[10px] md:text-sm text-muted-foreground">Duration</div>
                        <div className="text-sm md:text-xl font-semibold">{stage.duration}</div>
                      </div>
                      <div className="bg-background/50 p-2 md:p-4 rounded-lg">
                        <div className="text-[10px] md:text-sm text-muted-foreground">Efficiency</div>
                        <div className={`text-sm md:text-xl font-semibold ${stage.color}`}>{stage.efficiency}%</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base">Processes</h4>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {stage.processes.map((process) => (
                          <Badge key={process} variant="outline" className="text-[10px] md:text-xs">
                            <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                            {process}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {stage.chemicals.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm md:text-base">Chemicals</h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {stage.chemicals.map((chemical) => (
                            <Badge key={chemical} className="bg-secondary/20 text-secondary text-[10px] md:text-xs">
                              <Beaker className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                              {chemical}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-background/50 p-2 md:p-4 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm md:text-base">Output</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{stage.output}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(((currentStage + 1) / stages.length) * 100)}%</span>
          </div>
          <Progress value={((currentStage + 1) / stages.length) * 100} className="h-2" />
        </div>

        {/* Quick Links - Touch Friendly */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Button variant="outline" className="h-14 md:h-16 flex-col gap-1 text-xs md:text-sm" asChild>
            <Link to="/digital-twin">
              <Droplets className="w-5 h-5 md:w-6 md:h-6" />
              <span>Digital Twin</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-14 md:h-16 flex-col gap-1 text-xs md:text-sm" asChild>
            <Link to="/water-reuse">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              <span>Water Reuse</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-14 md:h-16 flex-col gap-1 text-xs md:text-sm" asChild>
            <Link to="/calibration">
              <Thermometer className="w-5 h-5 md:w-6 md:h-6" />
              <span>Calibration</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WaterTreatmentProcess;
