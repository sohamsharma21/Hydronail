import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SensorSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  tooltip: string;
  onChange: (value: number) => void;
  onReset: () => void;
}

export function SensorSlider({
  label,
  value,
  unit,
  min,
  max,
  step,
  defaultValue,
  tooltip,
  onChange,
  onReset,
}: SensorSliderProps) {
  return (
    <div className="space-y-3 p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="font-medium">{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span className="font-bold text-lg text-foreground">
            {value.toFixed(2)} {unit}
          </span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
