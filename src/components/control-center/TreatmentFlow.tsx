import React from 'react';
import { ArrowRight, Beaker, Wind, Filter, Database } from 'lucide-react';

interface StageData {
  sensors?: {
    ph?: { value: number; status: string };
    turbidity_ntu?: { value: number; status: string };
    temperature_c?: { value: number; status: string };
    dissolved_oxygen_mg_l?: { value: number; status: string };
    total_chlorine_mg_l?: { value: number; status: string };
  };
  machines?: { running: number; stopped: number };
  quality_score?: number;
}

interface TreatmentFlowProps {
  screening: StageData | null;
  aeration: StageData | null;
  filtration: StageData | null;
  final: StageData | null;
}

const StageCard: React.FC<{
  title: string;
  subtitle: string;
  data: StageData | null;
  colorClass: string;
  bgClass: string;
  icon: React.ElementType;
  showDO?: boolean;
  showChlorine?: boolean;
  showQuality?: boolean;
}> = ({ title, subtitle, data, colorClass, bgClass, icon: Icon, showDO, showChlorine, showQuality }) => {
  const sensors = data?.sensors;

  return (
    <div className={`flex-1 rounded-lg p-4 ${bgClass} border ${colorClass} min-w-[200px]`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${colorClass.replace('border-', 'text-')}`} />
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {sensors?.ph && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">pH</span>
            <span className="font-mono font-medium">{sensors.ph.value?.toFixed(1) || '--'}</span>
          </div>
        )}
        {sensors?.turbidity_ntu && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Turbidity</span>
            <span className="font-mono font-medium">{sensors.turbidity_ntu.value?.toFixed(0) || '--'} NTU</span>
          </div>
        )}
        {sensors?.temperature_c && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temperature</span>
            <span className="font-mono font-medium">{sensors.temperature_c.value?.toFixed(1) || '--'}°C</span>
          </div>
        )}
        {showDO && sensors?.dissolved_oxygen_mg_l && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">DO</span>
            <span className="font-mono font-medium">{sensors.dissolved_oxygen_mg_l.value?.toFixed(1) || '--'} mg/L</span>
          </div>
        )}
        {showChlorine && sensors?.total_chlorine_mg_l && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chlorine</span>
            <span className="font-mono font-medium">{sensors.total_chlorine_mg_l.value?.toFixed(2) || '--'} mg/L</span>
          </div>
        )}
        {showQuality && data?.quality_score !== undefined && (
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-medium">Quality</span>
            <span className="font-mono font-bold text-emerald-600">{data.quality_score?.toFixed(0) || '--'}%</span>
          </div>
        )}
      </div>

      {data?.machines && (
        <div className="mt-3 pt-2 border-t border-current/10 text-xs">
          <span className="text-emerald-600 font-medium">{data.machines.running} Running</span>
          <span className="mx-2">|</span>
          <span className="text-muted-foreground">{data.machines.stopped} Stopped</span>
        </div>
      )}
    </div>
  );
};

const TreatmentFlow: React.FC<TreatmentFlowProps> = ({ screening, aeration, filtration, final }) => {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <h2 className="font-semibold mb-4">Treatment Process Flow</h2>
      <div className="flex flex-col lg:flex-row items-stretch gap-2">
        <StageCard
          title="Primary Treatment"
          subtitle="Screening & Coagulation"
          data={screening}
          colorClass="border-blue-400"
          bgClass="bg-blue-50/50"
          icon={Beaker}
        />
        
        <div className="hidden lg:flex items-center">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <StageCard
          title="Secondary Treatment"
          subtitle="Aeration & Biological"
          data={aeration}
          colorClass="border-amber-400"
          bgClass="bg-amber-50/50"
          icon={Wind}
          showDO
        />
        
        <div className="hidden lg:flex items-center">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <StageCard
          title="Tertiary Treatment"
          subtitle="Filtration & Polishing"
          data={filtration}
          colorClass="border-emerald-400"
          bgClass="bg-emerald-50/50"
          icon={Filter}
          showChlorine
        />
        
        <div className="hidden lg:flex items-center">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <StageCard
          title="Final Storage"
          subtitle="Quality Verified Water"
          data={final}
          colorClass="border-teal-400"
          bgClass="bg-teal-50/50"
          icon={Database}
          showChlorine
          showQuality
        />
      </div>
    </div>
  );
};

export default React.memo(TreatmentFlow);
