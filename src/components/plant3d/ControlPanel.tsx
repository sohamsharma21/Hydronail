import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, BarChart3, RotateCcw, Zap, DollarSign, Droplets, Gauge } from "lucide-react";

interface ControlPanelProps {
  controls: {
    screenFilter1: boolean;
    screenFilter2: boolean;
    flashMixerRpm: number;
    coagulantPump: number;
    blower1: boolean;
    blower2: boolean;
    blower3: boolean;
    sandFilter1: boolean;
    sandFilter2: boolean;
    carbonFilter: boolean;
    uvIntensity: number;
    chlorinePump: number;
  };
  onControlChange: (key: string, value: boolean | number) => void;
  metrics: {
    power: number;
    cost: number;
    flowRate: number;
    quality: number;
  };
  onGetRecommendations: () => void;
  onViewAnalytics: () => void;
  onResetView: () => void;
}

export function ControlPanel({
  controls,
  onControlChange,
  metrics,
  onGetRecommendations,
  onViewAnalytics,
  onResetView,
}: ControlPanelProps) {
  return (
    <Card className="w-80 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-primary" />
          Plant Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Treatment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="font-semibold text-sm">Primary Treatment</span>
          </div>
          
          <div className="space-y-2 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Screen Filter 1</span>
              <Switch
                checked={controls.screenFilter1}
                onCheckedChange={(v) => onControlChange("screenFilter1", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Screen Filter 2</span>
              <Switch
                checked={controls.screenFilter2}
                onCheckedChange={(v) => onControlChange("screenFilter2", v)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Flash Mixer</span>
                <Badge variant="secondary">{controls.flashMixerRpm} RPM</Badge>
              </div>
              <Slider
                value={[controls.flashMixerRpm]}
                onValueChange={([v]) => onControlChange("flashMixerRpm", v)}
                min={0}
                max={150}
                step={5}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coagulant Pump</span>
                <Badge variant="secondary">{controls.coagulantPump}%</Badge>
              </div>
              <Slider
                value={[controls.coagulantPump]}
                onValueChange={([v]) => onControlChange("coagulantPump", v)}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>
        </div>

        {/* Secondary Treatment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="font-semibold text-sm">Secondary Treatment</span>
          </div>
          
          <div className="space-y-2 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aeration Blower 1</span>
              <Switch
                checked={controls.blower1}
                onCheckedChange={(v) => onControlChange("blower1", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aeration Blower 2</span>
              <Switch
                checked={controls.blower2}
                onCheckedChange={(v) => onControlChange("blower2", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aeration Blower 3</span>
              <Switch
                checked={controls.blower3}
                onCheckedChange={(v) => onControlChange("blower3", v)}
              />
            </div>
          </div>
        </div>

        {/* Tertiary Treatment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-semibold text-sm">Tertiary Treatment</span>
          </div>
          
          <div className="space-y-2 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sand Filter 1</span>
              <Switch
                checked={controls.sandFilter1}
                onCheckedChange={(v) => onControlChange("sandFilter1", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sand Filter 2</span>
              <Switch
                checked={controls.sandFilter2}
                onCheckedChange={(v) => onControlChange("sandFilter2", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Carbon Filter</span>
              <Switch
                checked={controls.carbonFilter}
                onCheckedChange={(v) => onControlChange("carbonFilter", v)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">UV Intensity</span>
                <Badge variant="secondary">{controls.uvIntensity}%</Badge>
              </div>
              <Slider
                value={[controls.uvIntensity]}
                onValueChange={([v]) => onControlChange("uvIntensity", v)}
                min={0}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chlorine Pump</span>
                <Badge variant="secondary">{controls.chlorinePump}%</Badge>
              </div>
              <Slider
                value={[controls.chlorinePump]}
                onValueChange={([v]) => onControlChange("chlorinePump", v)}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Real-time Metrics</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pl-5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">Power</div>
                <div className="font-medium">{metrics.power} kWh</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">Cost</div>
                <div className="font-medium">₹{metrics.cost}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">Flow</div>
                <div className="font-medium">{metrics.flowRate} m³/hr</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">Quality</div>
                <div className="font-medium">{metrics.quality}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t">
          <Button
            onClick={onGetRecommendations}
            className="w-full"
            variant="default"
          >
            <Bot className="w-4 h-4 mr-2" />
            Get AI Recommendations
          </Button>
          <Button
            onClick={onViewAnalytics}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button
            onClick={onResetView}
            className="w-full"
            variant="ghost"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
