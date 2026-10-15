import { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, PackageX } from "lucide-react";
import { supabase, type AppEntry } from "./lib/supabase";
import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
import { AppCard } from "./components/AppCard";
import { AppViewer } from "./components/AppViewer";
import { StatsBar } from "./components/StatsBar";
import { Footer } from "./components/Footer";

export default function App() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [launchedApp, setLaunchedApp] = useState<AppEntry | null>(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setApps(data as AppEntry[] | []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleLaunch = useCallback((app: AppEntry) => {
    setLaunchedApp(app);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(apps.map((a) => a.category).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (query) {
        const q = query.toLowerCase();
        const matches =
          app.name.toLowerCase().includes(q) ||
          (app.tagline?.toLowerCase().includes(q) ?? false) ||
          (app.category?.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }
      if (category !== "all" && app.category !== category) return false;
      return true;
    });
  }, [apps, query, category]);

  const totalLaunches = useMemo(
    () => apps.reduce((sum, a) => sum + a.download_count, 0),
    [apps]
  );

  return (
    <div className="min-h-screen">
      <Hero />

      <main id="apps" className="max-w-6xl mx-auto px-6 lg:px-12 scroll-mt-8">
        <StatsBar
          totalApps={apps.length}
          totalLaunches={totalLaunches}
          categories={categories.length}
        />

        <div className="mt-8 mb-8">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
            <p className="mt-4 text-slate-500 text-sm">Loading apps...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-400 mb-2">Couldn't load apps</p>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchApps}
              className="px-4 py-2 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20 hover:bg-lime-500 hover:text-ink-900 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageX className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium">No apps found</p>
            <p className="text-slate-600 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map((app, i) => (
              <AppCard
                key={app.id}
                app={app}
                onLaunch={handleLaunch}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <AppViewer
        app={launchedApp}
        onClose={() => setLaunchedApp(null)}
      />
    </div>
  );
}
