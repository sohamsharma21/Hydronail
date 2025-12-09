import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import MLDashboard from "./pages/MLDashboard";
import Monitoring from "./pages/Monitoring";
import DigitalTwin from "./pages/DigitalTwin";
import PlantDigitalTwin from "./pages/PlantDigitalTwin";
import PlantControlCenter from "./pages/PlantControlCenter";
import Simulator from "./pages/Simulator";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import WaterReuse from "./pages/WaterReuse";
import Calibration from "./pages/Calibration";
import WaterTreatmentProcess from "./pages/WaterTreatmentProcess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InstallPrompt />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - require login */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/ml-dashboard" element={
              <ProtectedRoute>
                <MLDashboard />
              </ProtectedRoute>
            } />
            <Route path="/monitoring" element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            } />
            <Route path="/digital-twin" element={
              <ProtectedRoute>
                <DigitalTwin />
              </ProtectedRoute>
            } />
            <Route path="/plant-3d" element={
              <ProtectedRoute>
                <PlantDigitalTwin />
              </ProtectedRoute>
            } />
            <Route path="/control-center" element={
              <ProtectedRoute>
                <PlantControlCenter />
              </ProtectedRoute>
            } />
            <Route path="/simulator" element={
              <ProtectedRoute>
                <Simulator />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/water-reuse" element={
              <ProtectedRoute>
                <WaterReuse />
              </ProtectedRoute>
            } />
            <Route path="/calibration" element={
              <ProtectedRoute>
                <Calibration />
              </ProtectedRoute>
            } />
            <Route path="/water-treatment" element={
              <ProtectedRoute>
                <WaterTreatmentProcess />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;