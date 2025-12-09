import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplet,
  Menu,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Users,
  Link2,
  Beaker,
  Wrench,
  Cpu,
  ArrowRight,
  Recycle,
  Factory,
  Building2,
  Pill,
  FlaskConical,
  UtensilsCrossed,
  Landmark,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-sky-400" />
              <span className="text-xl font-bold">HydroNail</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("features")} className="text-slate-300 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection("industries")} className="text-slate-300 hover:text-white transition-colors">Industries</button>
              <button onClick={() => scrollToSection("pricing")} className="text-slate-300 hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection("faq")} className="text-slate-300 hover:text-white transition-colors">FAQ</button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
              </Link>
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => scrollToSection("cta")}>
                Book Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection("features")} className="block w-full text-left py-2 text-slate-300">Features</button>
              <button onClick={() => scrollToSection("industries")} className="block w-full text-left py-2 text-slate-300">Industries</button>
              <button onClick={() => scrollToSection("pricing")} className="block w-full text-left py-2 text-slate-300">Pricing</button>
              <button onClick={() => scrollToSection("faq")} className="block w-full text-left py-2 text-slate-300">FAQ</button>
              <Link to="/auth" className="block">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Button className="w-full bg-green-500 hover:bg-green-600">Book Demo</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-30">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-sky-500/20"
                style={{
                  width: 200 + i * 100,
                  height: 200 + i * 100,
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 5}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 mb-6">
                🇮🇳 Made for Indian Industries • CPCB Compliant
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Turn Your Water Treatment Plant
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-green-400 bg-clip-text text-transparent">
                Into An AI-Powered System
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-8"
            >
              Predict quality. Optimize chemicals. Prevent failures. Reuse 90%+ water with Zero Liquid Discharge.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>96.31% Prediction Accuracy</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>25-30% Cost Savings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Up to 90% Water Reuse</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6" onClick={() => scrollToSection("cta")}>
                Book Live Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Video
              </Button>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-sm text-slate-400">
              Trusted by sugar mills, textile plants & municipal STPs across India. MQTT, SCADA, PLC compatible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Traditional Plants Waste{" "}
              <span className="text-red-400">₹25-50 Lakhs</span> Annually
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Droplet,
                title: "Chemical Overdosing",
                description: "Manual guesswork leads to 18-22% excess chemical usage. No accurate dosing calculations.",
                impact: "Loss: ₹4-7L/year per plant",
              },
              {
                icon: AlertTriangle,
                title: "Reactive Maintenance",
                description: "Equipment failures detected only AFTER breakdown. No predictive alerts.",
                impact: "Emergency repairs: ₹25-45L/incident",
              },
              {
                icon: Users,
                title: "Manual Monitoring",
                description: "8-10 operators manually track parameters. 30-40% human error rate.",
                impact: "Labor inefficiency: ₹12-18L/year",
              },
              {
                icon: Link2,
                title: "Siloed Systems",
                description: "SCADA, IoT, logbooks not integrated. No unified intelligence for optimization.",
                impact: "Missed savings: ₹15-22L/year",
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-red-950/30 border-red-900/50 hover:border-red-700/50 transition-colors h-full">
                  <CardContent className="p-6">
                    <problem.icon className="h-10 w-10 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">{problem.title}</h3>
                    <p className="text-slate-300 mb-4">{problem.description}</p>
                    <p className="text-red-400 font-semibold">{problem.impact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Water Cycle Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Water Reuse Cycle
            </h2>
            <p className="text-slate-300 text-lg">
              Minimize Fresh Water, Maximize Efficiency
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { stage: "Raw Water", icon: "🌊", color: "sky", desc: "Fresh water intake" },
                { stage: "Treatment", icon: "🔵", color: "blue", desc: "3-stage purification" },
                { stage: "Industrial Use", icon: "🏭", color: "amber", desc: "Cooling, Boiler, Process" },
                { stage: "Reuse (90%)", icon: "♻️", color: "green", desc: "Back to Cooling/Process" },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative p-6 rounded-xl bg-${step.color}-500/10 border border-${step.color}-500/30 text-center`}
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--${step.color === "sky" ? "primary" : step.color === "green" ? "secondary" : "warning"}) / 0.1), transparent)`,
                    borderColor: `hsl(var(--${step.color === "sky" ? "primary" : step.color === "green" ? "secondary" : "warning"}) / 0.3)`,
                  }}
                >
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{step.stage}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-slate-500 h-8 w-8" />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 grid md:grid-cols-2 gap-6"
            >
              <Card className="bg-red-950/20 border-red-900/30">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-red-400 mb-2">❌ Traditional Approach</h4>
                  <p className="text-2xl font-bold">100% fresh water daily</p>
                  <p className="text-slate-400">₹3 Cr/year water cost</p>
                </CardContent>
              </Card>
              <Card className="bg-green-950/20 border-green-900/30">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-green-400 mb-2">✅ With HydroNail</h4>
                  <p className="text-2xl font-bold">10% fresh + 90% reused</p>
                  <p className="text-slate-400">₹30L/year = <span className="text-green-400 font-bold">₹2.7 Cr saved!</span></p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How HydroNail Works
            </h2>
            <p className="text-slate-300 text-lg">4 Steps to Smart Water Management</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: "📡",
                title: "Sensors",
                desc: "10-11 industrial sensors (pH, turbidity, TDS, DO, vibration, etc.)",
                detail: "Real-time data every 1-10 seconds",
              },
              {
                step: 2,
                icon: "🔌",
                title: "MQTT Integration",
                desc: "Connects to existing SCADA, PLC, or standalone IoT",
                detail: "Latency: <100ms",
              },
              {
                step: 3,
                icon: "🧠",
                title: "AI Models (4 Parallel)",
                desc: "Water Quality, Chemical Dosing, Equipment Health, Process Control",
                detail: "96.31% accuracy",
              },
              {
                step: 4,
                icon: "📊",
                title: "Live Dashboard",
                desc: "Real-time monitoring + 3D digital twin",
                detail: "Mobile + Desktop responsive",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 h-full hover:border-sky-500/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
                      {item.icon}
                    </div>
                    <Badge className="mb-3 bg-sky-500/20 text-sky-400">Step {item.step}</Badge>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-2">{item.desc}</p>
                    <p className="text-sky-400 text-sm font-medium">{item.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-slate-300 text-lg">AI-Powered Intelligence for Every Aspect</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Droplet,
                title: "Water Quality AI",
                desc: "Predicts pass/fail + quality score (0-100%) based on 8 parameters.",
                metric: "96.31% accuracy validated on 4,500+ samples",
                color: "sky",
              },
              {
                icon: Beaker,
                title: "Chemical Cost Optimizer",
                desc: "Calculates exact coagulant, lime, chlorine, polymer dose. No guesswork.",
                metric: "20-25% chemical cost reduction = ₹7-9L/year",
                color: "green",
              },
              {
                icon: Wrench,
                title: "Predictive Maintenance",
                desc: "LSTM model analyzes vibration, temp, pressure. Warns 36-60 hours before failure.",
                metric: "60-75% downtime reduction = ₹12-18L saved",
                color: "amber",
              },
              {
                icon: Cpu,
                title: "3D Digital Twin",
                desc: "Interactive 3D plant view. Color-coded equipment status. Control center integration.",
                metric: "Real-time operator dashboard",
                color: "purple",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 h-full hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <feature.icon className={`h-10 w-10 mb-4 ${
                      feature.color === "sky" ? "text-sky-400" :
                      feature.color === "green" ? "text-green-400" :
                      feature.color === "amber" ? "text-amber-400" : "text-purple-400"
                    }`} />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{feature.desc}</p>
                    <p className={`text-sm font-medium ${
                      feature.color === "sky" ? "text-sky-400" :
                      feature.color === "green" ? "text-green-400" :
                      feature.color === "amber" ? "text-amber-400" : "text-purple-400"
                    }`}>{feature.metric}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Water Reuse Impact */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Achieve <span className="text-green-400">90%+</span> Water Reuse
            </h2>
            <p className="text-slate-300 text-lg">Zero Liquid Discharge Made Affordable</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Cooling Tower Blowdown → Cooling Reuse",
                desc: "TDS 1000-1500 ppm → Simple cooling + biocide",
                recovery: "95%",
              },
              {
                title: "Process Wastewater → Utility Reuse",
                desc: "Turbidity 50 NTU → Clarifier + sand filter + UV",
                recovery: "85%",
              },
              {
                title: "Heavy Contaminated → High Purity",
                desc: "TDS 4000 ppm → ASP + UF + RO",
                recovery: "75%",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-green-950/30 border-green-900/50 h-full">
                  <CardContent className="p-6">
                    <Recycle className="h-8 w-8 text-green-400 mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                    <p className="text-2xl font-bold text-green-400">{item.recovery} recovery</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-900/50 to-sky-900/50 rounded-2xl p-8 text-center border border-green-500/30"
          >
            <p className="text-lg mb-4">
              <span className="text-red-400">Traditional: 15,000 m³/day fresh water = ₹3 Cr/year</span>
            </p>
            <p className="text-2xl font-bold">
              With HydroNail: 1,500 m³/day fresh + 13,500 reused ={" "}
              <span className="text-green-400">₹2.7 Cr saved!</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Proven ROI: Typical 2-5 MLD Plant Savings
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: "Chemical Optimization", value: "₹7-9 Lakh/year", desc: "23-28% reduction on daily processing" },
              { title: "Manpower Efficiency", value: "₹6-8.5 Lakh/year", desc: "8-10 operators → 3-4 needed" },
              { title: "Downtime Prevention", value: "₹12-16 Lakh/year", desc: "60-75% fewer breakdowns" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-3xl font-bold text-sky-400 mb-2">{item.value}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-green-600 border-green-500">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-3xl font-bold mb-4">₹25-34 Lakh Annual Savings</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="opacity-80">Investment</p>
                    <p className="font-semibold">₹22-32L setup + ₹9-14L/year</p>
                  </div>
                  <div>
                    <p className="opacity-80">Payback Period</p>
                    <p className="font-semibold">10-13 months</p>
                  </div>
                  <div>
                    <p className="opacity-80">Year 1 ROI</p>
                    <p className="font-semibold">120-160%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Industries Served */}
      <section id="industries" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for Multiple Industries</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🍬", name: "Sugar Mills" },
              { icon: "👕", name: "Textile Plants" },
              { icon: "💊", name: "Pharmaceutical" },
              { icon: "⚗️", name: "Chemical Processing" },
              { icon: "🍔", name: "Food & Beverage" },
              { icon: "🏛️", name: "Municipal STP/ETP" },
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-sky-500/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{industry.icon}</div>
                    <p className="text-sm font-medium">{industry.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why HydroNail vs Traditional SCADA/IoT
            </h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Traditional SCADA</th>
                  <th className="text-center py-4 px-4">Generic IoT</th>
                  <th className="text-center py-4 px-4 bg-green-900/30">HydroNail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Real-time Monitoring", scada: true, iot: true, hydronail: "✅" },
                  { feature: "AI Prediction & Optimization", scada: false, iot: false, hydronail: "✅ 4 ML Models" },
                  { feature: "Chemical Dosing Calculator", scada: false, iot: false, hydronail: "✅ 25% Savings" },
                  { feature: "Equipment Failure Prediction", scada: false, iot: false, hydronail: "✅ 48hr Warning" },
                  { feature: "3D Digital Twin", scada: false, iot: false, hydronail: "✅" },
                  { feature: "ROI Payback", scada: "3-5 years", iot: "2-3 years", hydronail: "10-13 months" },
                  { feature: "Cost", scada: "₹50L+ setup", iot: "₹15L+", hydronail: "₹25L + ₹10L/yr" },
                  { feature: "Made in India 🇮🇳", scada: false, iot: "⚠️", hydronail: "✅" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.scada === "boolean" ? (
                        row.scada ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        <span className="text-slate-400">{row.scada}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.iot === "boolean" ? (
                        row.iot ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        <span className="text-slate-400">{row.iot}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-green-900/20 font-semibold text-green-400">{row.hydronail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Transparent, Affordable Pricing</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Small Plant",
                capacity: "1-2 MLD",
                price: "₹40,000",
                annual: "₹4.8L/year",
                features: ["All 4 AI models", "Dashboard access", "90-day history", "Email alerts"],
              },
              {
                tier: "Medium Plant",
                capacity: "2-5 MLD",
                price: "₹80,000",
                annual: "₹9.6L/year",
                features: ["All Small features", "Multi-plant support", "1-year history", "Priority support"],
                popular: true,
              },
              {
                tier: "Large Plant",
                capacity: "5-10 MLD",
                price: "₹1,20,000",
                annual: "₹14.4L/year",
                features: ["All Medium features", "Custom integrations", "Dedicated support", "SLA guarantee"],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${plan.popular ? "bg-sky-900/30 border-sky-500/50 scale-105" : "bg-slate-800 border-slate-700"}`}>
                  <CardHeader>
                    {plan.popular && <Badge className="w-fit mb-2 bg-sky-500">Most Popular</Badge>}
                    <CardTitle className="text-xl">{plan.tier}</CardTitle>
                    <p className="text-slate-400">{plan.capacity}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-slate-400">/month</span>
                      <p className="text-sm text-slate-400">{plan.annual}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.popular ? "bg-sky-500 hover:bg-sky-600" : ""}`}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8 text-slate-400">
            Setup Cost: ₹22-32L (one-time, includes sensors + integration)
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Does it work with my existing SCADA?",
                a: "Yes! HydroNail integrates via MQTT/REST. No need to replace current systems.",
              },
              {
                q: "What if the AI model fails?",
                a: "Built-in fallback: Rule-based predictions ensure continuous operation. Reconnects automatically.",
              },
              {
                q: "How accurate is the water quality prediction?",
                a: "96.31% validated accuracy on 4,500+ real plant samples using XGBoost.",
              },
              {
                q: "Can I control equipment remotely?",
                a: "Yes! Control center allows remote operation with role-based permissions and safety interlocks.",
              },
              {
                q: "What's included in the setup cost?",
                a: "Sensors, MQTT gateway, installation, training, 3-month pilot support.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="bg-slate-800 border-slate-700 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{faq.q}</h3>
                      {openFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    {openFaq === index && (
                      <p className="mt-3 text-slate-400">{faq.a}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Water Treatment Plant?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join the AI revolution. Save ₹25-50 Lakhs annually. Achieve 90% water reuse.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6">
                Book a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Download Technical Brochure
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-green-100">
              <a href="mailto:team@hydronail.io" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-5 w-5" /> team@hydronail.io
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-5 w-5" /> +91-99999-99999
              </a>
              <a href="https://github.com/nova-minds/hydronail" className="flex items-center gap-2 hover:text-white">
                <Github className="h-5 w-5" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="h-6 w-6 text-sky-400" />
                <span className="font-bold">HydroNail</span>
              </div>
              <p className="text-slate-400 text-sm">
                India's first AI-driven water treatment platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white">Features</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => scrollToSection("industries")} className="hover:text-white">Industries</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Video Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            © 2025 HydroNail. Made with 💚 in India for Indian Industries.
          </div>
        </div>
      </footer>
    </div>
  );
}
