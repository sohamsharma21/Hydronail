import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone, Droplet, Wifi, Bell } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 5 seconds
      setTimeout(() => setShowPrompt(true), 5000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show iOS instructions after delay
    if (isIOS && !sessionStorage.getItem("iosPromptDismissed")) {
      setTimeout(() => setShowIOSInstructions(true), 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isIOS, isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    sessionStorage.setItem("pwaPromptDismissed", "true");
    sessionStorage.setItem("iosPromptDismissed", "true");
  };

  if (sessionStorage.getItem("pwaPromptDismissed")) return null;
  if (isInstalled) return null;

  // iOS Instructions
  if (showIOSInstructions && isIOS) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:bottom-4 md:left-auto md:right-4 md:w-96"
        >
          <Card className="bg-card/95 backdrop-blur-xl border-primary/20 shadow-2xl">
            <CardContent className="p-4 md:p-5">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 shrink-0">
                  <Droplet className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-base">Install HydroNail</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add to your home screen for the best experience
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg">1.</span>
                      <span>Tap the <strong>Share</strong> button below</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg">2.</span>
                      <span>Scroll and tap <strong>Add to Home Screen</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg">3.</span>
                      <span>Tap <strong>Add</strong> to install</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" onClick={handleDismiss} className="w-full">
                    Got it
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Android/Desktop Install Prompt
  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:bottom-4 md:left-auto md:right-4 md:w-96"
        >
          <Card className="bg-card/95 backdrop-blur-xl border-primary/20 shadow-2xl">
            <CardContent className="p-4 md:p-5">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 shrink-0">
                  <Droplet className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-base">Install HydroNail</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get the full app experience on your device
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex gap-4 text-[10px] md:text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <span>Offline</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      <span>Alerts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      <span>Native</span>
                    </div>
                  </div>

                  <Button size="sm" onClick={handleInstall} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Install Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
