import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink-600/50 mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size={36} />
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#apps" className="hover:text-lime-400 transition-colors">Browse</a>
            <a href="#stats" className="hover:text-lime-400 transition-colors">Stats</a>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-xs">Built with precision</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-ink-600/30 text-center text-xs text-slate-600 font-mono">
          © {new Date().getFullYear()} Zilla Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
