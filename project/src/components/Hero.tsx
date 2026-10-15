import { Logo } from "./Logo";
import { Zap, Shield, Play } from "lucide-react";

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <Logo size={44} />
        <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
          <a href="#apps" className="hover:text-lime-400 transition-colors">Browse</a>
          <a href="#stats" className="hover:text-lime-400 transition-colors">Stats</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg glass border border-ink-400/40 text-white hover:border-lime-500/40 transition-all"
          >
            About
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-lime-500/20 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-mono text-slate-300 tracking-wide">
            v3.0 — Launch apps right here
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up">
          Your apps.
          <br />
          <span className="text-gradient-lime">One click away.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
          Zilla Labs is your central hub for launching apps right inside your
          browser. No installs, no downloads — just click and go.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <a
            href="#apps"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-lime-500 text-ink-900 hover:bg-lime-400 active:scale-95 transition-all glow-lime"
          >
            <Play className="w-5 h-5" />
            Browse Apps
          </a>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-teal-400" />
            All apps run in a secure sandbox
          </div>
        </div>
      </div>
    </header>
  );
}
