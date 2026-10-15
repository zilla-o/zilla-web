import { useState, useEffect, useRef } from "react";
import {
  X,
  ExternalLink,
  Loader2,
  ArrowLeft,
  RotateCw,
  Clock,
  AppWindow,
} from "lucide-react";
import type { AppEntry } from "../lib/supabase";
import { ZillaPlay } from "./ZillaPlay";

interface AppViewerProps {
  app: AppEntry | null;
  onClose: () => void;
}

export function AppViewer({ app, onClose }: AppViewerProps) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!app) return;
    setLoading(true);
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [app, onClose]);

  if (!app) return null;

  const isInternal = app.app_url?.startsWith("internal:");
  const internalType = isInternal ? app.app_url?.replace("internal:", "") : null;
  const hasExternalUrl = app.app_url && !isInternal;

  const openExternal = () => {
    if (app.app_url) {
      window.open(app.app_url, "_blank", "noopener,noreferrer");
    }
  };

  const reload = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = app.app_url || "";
    }
  };

  // Coming soon apps (no app_url, not embeddable)
  if (!app.app_url && !app.is_embeddable) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 bg-ink-800 border-b border-ink-500/50 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Zilla Labs</span>
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-ink-900">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border border-ink-400/50 bg-ink-700 flex items-center justify-center">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover opacity-40" />
              ) : (
                <AppWindow className="w-12 h-12 text-slate-600" />
              )}
            </div>
            <div className="absolute -inset-3 rounded-3xl bg-lime-500/5 blur-2xl -z-10" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-ink-800 border border-ink-400/50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">{app.name}</h2>
          <p className="text-slate-400 max-w-md mb-2">{app.tagline}</p>
          {app.description && (
            <p className="text-slate-600 text-sm max-w-md mb-8">{app.description}</p>
          )}

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-lime-500/20 mb-8">
            <Clock className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-mono text-lime-400">Coming Soon</span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-300 bg-ink-600/50 border border-ink-500/40 hover:bg-ink-500 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Zilla Labs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-ink-800 border-b border-ink-500/50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Zilla Labs</span>
          </button>
          <div className="w-px h-6 bg-ink-500/50" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-ink-400/50 bg-ink-700 flex items-center justify-center shrink-0">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[200px]">
              {app.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isInternal && hasExternalUrl && (
            <>
              <button
                onClick={reload}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
                title="Reload"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={openExternal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">New Tab</span>
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-ink-600 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 relative bg-ink-900 overflow-hidden">
        {isInternal && internalType === "zilla-play" ? (
          <ZillaPlay />
        ) : isInternal ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <AppWindow className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Unknown app type</p>
          </div>
        ) : hasExternalUrl && app.is_embeddable ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-ink-900">
                <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                <p className="mt-4 text-slate-400 text-sm">Launching {app.name}...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={app.app_url || undefined}
              title={app.name}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
              onLoad={() => setLoading(false)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          </>
        ) : hasExternalUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-ink-400/50 bg-ink-700 flex items-center justify-center mb-6">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                <AppWindow className="w-9 h-9 text-lime-500/60" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{app.name}</h2>
            {app.description && (
              <p className="text-slate-400 max-w-md mb-6">{app.description}</p>
            )}
            <p className="text-slate-500 text-sm mb-6 max-w-md">
              This app can't be embedded directly. Open it in a new tab to use it.
            </p>
            <button
              onClick={openExternal}
              className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold bg-lime-500 text-ink-900 hover:bg-lime-400 active:scale-95 transition-all glow-lime"
            >
              <ExternalLink className="w-5 h-5" />
              Open {app.name}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
