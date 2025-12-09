import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWaterData } from "@/hooks/useWaterData";
import { Link } from "react-router-dom";
import {
  Droplet,
  Recycle,
  Factory,
  Thermometer,
  Zap,
  Leaf,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Waves,
  Filter,
  Sun,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const WaterReuse = () => {
  const { latestReading } = useWaterData();
  const [selectedUse, setSelectedUse] = useState<string | null>(null);

  const calculateReuseScore = (use: string) => {
    if (!latestReading) return 0;
    const { ph, turbidity, tds, dissolved_oxygen } = latestReading;
    
    switch (use) {
      case "cooling":
        return Math.min(100, 100 - (tds > 1500 ? 30 : 0) - (ph < 6 || ph > 9 ? 20 : 0));
      case "irrigation":
        return Math.min(100, 100 - (tds > 1000 ? 25 : 0) - (ph < 5.5 || ph > 8.5 ? 20 : 0) - (turbidity > 50 ? 15 : 0));
      case "process":
        return Math.min(100, 100 - (tds > 500 ? 30 : 0) - (turbidity > 30 ? 25 : 0) - (ph < 6.5 || ph > 8 ? 20 : 0));
      case "boiler":
        return Math.min(100, 100 - (tds > 100 ? 40 : 0) - (turbidity > 5 ? 30 : 0) - (dissolved_oxygen > 0.5 ? 20 : 0));
      case "drinking":
        return Math.min(100, 100 - (tds > 300 ? 40 : 0) - (turbidity > 1 ? 30 : 0) - (ph < 6.5 || ph > 8.5 ? 20 : 0));
      default:
        return 75;
    }
  };

  const reuseApplications = [
    {
      id: "cooling",
      name: "Cooling Tower",
      icon: Thermometer,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30",
      recovery: 95,
      requirements: "TDS < 1500 ppm, pH 6-9",
      treatment: "Basic filtration + Biocide",
      savings: "₹45,000/day",
    },
    {
      id: "irrigation",
      name: "Agriculture",
      icon: Leaf,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      recovery: 90,
      requirements: "TDS < 1000 ppm",
      treatment: "Sand filter + UV",
      savings: "₹25,000/day",
    },
    {
      id: "process",
      name: "Industrial",
      icon: Factory,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      recovery: 85,
      requirements: "TDS < 500 ppm",
      treatment: "UF + Carbon filter",
      savings: "₹60,000/day",
    },
    {
      id: "boiler",
      name: "Boiler Feed",
      icon: Zap,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      recovery: 75,
      requirements: "TDS < 100 ppm",
      treatment: "RO + Deaerator",
      savings: "₹80,000/day",
    },
    {
      id: "drinking",
      name: "Potable",
      icon: Droplet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      recovery: 70,
      requirements: "TDS < 300 ppm",
      treatment: "RO + UV + Cl₂",
      savings: "₹35,000/day",
    },
  ];

  const treatmentStages = [
    { name: "Raw Water", icon: Waves, color: "bg-red-500", quality: 20 },
    { name: "Primary", icon: Filter, color: "bg-orange-500", quality: 45 },
    { name: "Secondary", icon: Recycle, color: "bg-yellow-500", quality: 70 },
    { name: "Tertiary", icon: Sun, color: "bg-green-500", quality: 95 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6 md:py-8 space-y-6 md:space-y-8 safe-area-inset">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-3 md:space-y-4"
        >
          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
            <Recycle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Zero Liquid Discharge
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold">Water Reuse</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Maximize water recovery and minimize fresh water consumption
          </p>
        </motion.div>

        {/* Current Water Quality - Mobile Optimized */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Droplet className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Current Water Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
              {latestReading ? (
                <>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
                    <div className="text-lg md:text-2xl font-bold text-primary">{latestReading.ph.toFixed(1)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">pH</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
                    <div className="text-lg md:text-2xl font-bold text-secondary">{latestReading.turbidity.toFixed(0)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">NTU</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
                    <div className="text-lg md:text-2xl font-bold">{latestReading.tds.toFixed(0)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">TDS</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
                    <div className="text-lg md:text-2xl font-bold">{latestReading.dissolved_oxygen.toFixed(1)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">DO</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg hidden md:block">
                    <div className="text-2xl font-bold">{latestReading.temperature.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Temp</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg hidden md:block">
                    <div className="text-2xl font-bold">{latestReading.conductivity.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">EC</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg hidden md:block">
                    <div className="text-2xl font-bold">{latestReading.chlorine.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Cl₂</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg hidden md:block">
                    <div className="text-2xl font-bold">{latestReading.hardness.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Hard</div>
                  </div>
                </>
              ) : (
                <div className="col-span-4 md:col-span-8 text-center text-muted-foreground py-4">
                  Loading sensor data...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Process - Mobile Responsive */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Treatment Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              {treatmentStages.map((stage, index) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex-1 w-full"
                >
                  <div className="relative">
                    <div className={`p-3 md:p-4 rounded-xl ${stage.color} bg-opacity-20 border border-current/30 text-center`}>
                      <stage.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2" />
                      <h3 className="font-semibold text-xs md:text-sm">{stage.name}</h3>
                      <div className="mt-1 md:mt-2">
                        <Progress value={stage.quality} className="h-1.5 md:h-2" />
                        <span className="text-[10px] md:text-xs text-muted-foreground">{stage.quality}%</span>
                      </div>
                    </div>
                    {index < treatmentStages.length - 1 && (
                      <>
                        <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <ArrowDown className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 text-muted-foreground w-4 h-4" />
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reuse Applications - Mobile Grid */}
        <div>
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Reuse Applications</h2>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6"
          >
            {reuseApplications.map((app, index) => {
              const score = calculateReuseScore(app.id);
              const isViable = score >= 70;
              
              return (
                <motion.div
                  key={app.id}
                  variants={fadeInUp}
                >
                  <Card
                    className={`cursor-pointer transition-all active:scale-95 md:hover:scale-105 ${
                      selectedUse === app.id ? "ring-2 ring-primary" : ""
                    } ${app.bgColor} ${app.borderColor} h-full`}
                    onClick={() => setSelectedUse(app.id === selectedUse ? null : app.id)}
                  >
                    <CardContent className="p-3 md:p-6">
                      <div className="flex flex-col gap-2 md:gap-4">
                        <div className="flex items-center justify-between">
                          <app.icon className={`w-6 h-6 md:w-8 md:h-8 ${app.color}`} />
                          <div className="text-right">
                            <div className="text-lg md:text-2xl font-bold">{score}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm md:text-base">{app.name}</h3>
                          <Badge 
                            variant={isViable ? "default" : "destructive"} 
                            className="mt-1 text-[10px] md:text-xs"
                          >
                            {isViable ? (
                              <><CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" /> OK</>
                            ) : (
                              <><AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" /> Need Tx</>
                            )}
                          </Badge>
                        </div>
                        
                        {/* Expanded details on selection */}
                        {selectedUse === app.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2 text-xs md:text-sm border-t pt-2 mt-1"
                          >
                            <div>
                              <span className="text-muted-foreground">Recovery:</span>
                              <span className="ml-1 font-semibold text-secondary">{app.recovery}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Req:</span>
                              <p className="text-[10px] md:text-xs">{app.requirements}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Treatment:</span>
                              <p className="text-[10px] md:text-xs">{app.treatment}</p>
                            </div>
                            <div className="pt-1 border-t">
                              <span className="text-muted-foreground">Savings:</span>
                              <span className="ml-1 font-bold text-secondary">{app.savings}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Statistics - Mobile Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <Card className="bg-gradient-to-br from-sky-500/20 to-sky-600/10">
            <CardContent className="p-4 md:p-6 text-center">
              <Droplet className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-sky-400" />
              <div className="text-xl md:text-3xl font-bold">5,000</div>
              <div className="text-[10px] md:text-sm text-muted-foreground">m³/day In</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10">
            <CardContent className="p-4 md:p-6 text-center">
              <Recycle className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-green-400" />
              <div className="text-xl md:text-3xl font-bold">4,500</div>
              <div className="text-[10px] md:text-sm text-muted-foreground">m³ Reused</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10">
            <CardContent className="p-4 md:p-6 text-center">
              <Leaf className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-amber-400" />
              <div className="text-xl md:text-3xl font-bold">₹2.7Cr</div>
              <div className="text-[10px] md:text-sm text-muted-foreground">Annual Save</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10">
            <CardContent className="p-4 md:p-6 text-center">
              <Building2 className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-purple-400" />
              <div className="text-xl md:text-3xl font-bold">ZLD</div>
              <div className="text-[10px] md:text-sm text-muted-foreground">Compliant</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation - Mobile Touch Friendly */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Connected Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <Button variant="outline" className="h-16 md:h-24 flex-col gap-1 md:gap-2 text-xs md:text-sm" asChild>
                <Link to="/digital-twin">
                  <Recycle className="w-5 h-5 md:w-8 md:h-8" />
                  <span>Digital Twin</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-16 md:h-24 flex-col gap-1 md:gap-2 text-xs md:text-sm" asChild>
                <Link to="/plant-3d">
                  <Building2 className="w-5 h-5 md:w-8 md:h-8" />
                  <span>3D Plant</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-16 md:h-24 flex-col gap-1 md:gap-2 text-xs md:text-sm" asChild>
                <Link to="/control-center">
                  <Factory className="w-5 h-5 md:w-8 md:h-8" />
                  <span>Control</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WaterReuse;
