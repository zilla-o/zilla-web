import { useState } from "react";
import { Play, ExternalLink, AppWindow, Clock } from "lucide-react";
import type { AppEntry } from "../lib/supabase";
import { supabase } from "../lib/supabase";

interface AppCardProps {
  app: AppEntry;
  onLaunch: (app: AppEntry) => void;
  index: number;
}

export function AppCard({ app, onLaunch, index }: AppCardProps) {
  const [launching, setLaunching] = useState(false);

  const isComingSoon = !app.app_url && !app.is_embeddable;

  const handleLaunch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (launching) return;

    if (!isComingSoon) {
      setLaunching(true);
      try {
        await supabase
          .from("apps")
          .update({ download_count: app.download_count + 1 })
          .eq("id", app.id);
      } catch {
        // continue even if count fails
      }
      setLaunching(false);
    }

    onLaunch(app);
  };

  return (
    <div
      onClick={() => onLaunch(app)}
      className="glass-card group relative cursor-pointer rounded-2xl border border-ink-500/50 overflow-hidden transition-all duration-300 hover:border-lime-500/40 hover:shadow-[0_8px_40px_rgba(132,204,22,0.12)] animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-0 grid-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-ink-400/50 bg-ink-700 flex items-center justify-center">
              {app.icon_url ? (
                <img
                  src={app.icon_url}
                  alt={app.name}
                  className={`w-full h-full object-cover ${isComingSoon ? "opacity-50" : ""}`}
                />
              ) : (
                <AppWindow className="w-7 h-7 text-lime-500/60" />
              )}
            </div>
            <div className="absolute -inset-1 rounded-xl bg-lime-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            {isComingSoon && (
              <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-ink-800 border border-lime-500/30 text-[8px] font-mono text-lime-400 uppercase tracking-wider">
                Soon
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-lime-400 transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-slate-400 truncate mt-0.5">
              {app.tagline}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {app.category && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {app.category}
                </span>
              )}
              {isComingSoon ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20">
                  Coming Soon
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  Available
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-500/40">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {app.version && (
              <span className="font-mono">v{app.version}</span>
            )}
            <span className="font-mono">
              {app.download_count.toLocaleString()} launches
            </span>
          </div>

          <button
            onClick={handleLaunch}
            disabled={launching}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-wait ${
              isComingSoon
                ? "bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:border-slate-400/40"
                : "bg-lime-500/10 text-lime-400 border border-lime-500/20 hover:bg-lime-500 hover:text-ink-900 hover:border-lime-500"
            }`}
          >
            {launching ? (
              <>
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                Opening...
              </>
            ) : isComingSoon ? (
              <>
                <Clock className="w-4 h-4" />
                Preview
              </>
            ) : app.app_url?.startsWith("internal:") || app.is_embeddable ? (
              <>
                <Play className="w-4 h-4" />
                Open App
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Open App
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
