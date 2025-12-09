import { Button } from "@/components/ui/button";
import { Eye, Layers, Droplets, Wind, Filter, Box } from "lucide-react";

interface CameraPresetsProps {
  onPresetChange: (preset: string) => void;
  activePreset: string;
}

const presets = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "primary", label: "Primary Zone", icon: Droplets },
  { id: "secondary", label: "Secondary Zone", icon: Wind },
  { id: "tertiary", label: "Tertiary Zone", icon: Filter },
  { id: "tanks", label: "Tank View", icon: Box },
  { id: "pipes", label: "Pipe Network", icon: Layers },
];

export function CameraPresets({ onPresetChange, activePreset }: CameraPresetsProps) {
  return (
    <div className="flex gap-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-2 shadow-xl">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onPresetChange(preset.id)}
            className="flex items-center gap-1.5"
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{preset.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
