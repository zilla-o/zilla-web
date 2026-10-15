import { Package, Rocket, Layers } from "lucide-react";

interface StatsBarProps {
  totalApps: number;
  totalLaunches: number;
  categories: number;
}

export function StatsBar({ totalApps, totalLaunches, categories }: StatsBarProps) {
  return (
    <section id="stats" className="max-w-6xl mx-auto px-6 lg:px-12 py-8">
      <div className="grid grid-cols-3 gap-4">
        <StatTile
          icon={<Package className="w-5 h-5" />}
          label="Apps Available"
          value={totalApps.toString()}
        />
        <StatTile
          icon={<Rocket className="w-5 h-5" />}
          label="Total Launches"
          value={totalLaunches.toLocaleString()}
        />
        <StatTile
          icon={<Layers className="w-5 h-5" />}
          label="Categories"
          value={categories.toString()}
        />
      </div>
    </section>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl border border-ink-500/40 p-5 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-lime-500/10 text-lime-400 mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
