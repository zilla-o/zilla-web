import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
}

export function SearchBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search apps..."
          className="w-full glass rounded-xl border border-ink-500/50 pl-12 pr-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-lime-500/40 focus:shadow-[0_0_20px_rgba(132,204,22,0.1)]"
        />
      </div>

      <div className="relative">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="glass rounded-xl border border-ink-500/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-lime-500/40 cursor-pointer appearance-none min-w-[160px]"
        >
          <option value="all" className="bg-ink-700">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-ink-700">{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
