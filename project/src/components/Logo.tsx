interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            <linearGradient id="logoLime" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
            <linearGradient id="logoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="100" rx="24" fill="#0a0c14" />
          <rect
            width="100"
            height="100"
            rx="24"
            fill="none"
            stroke="url(#logoLime)"
            strokeWidth="1.5"
            opacity="0.3"
          />

          {/* Stylized Z shape */}
          <path
            d="M30 22 L70 22 L70 33 L42 33 L42 47 L62 47 L62 58 L42 58 L42 78 L30 78 Z"
            fill="url(#logoLime)"
            filter="url(#logoGlow)"
          />

          {/* Accent dot - the "lava/labs" element */}
          <circle cx="70" cy="72" r="9" fill="url(#logoTeal)" filter="url(#logoGlow)" />
          <circle cx="70" cy="72" r="4" fill="#0a0c14" />
        </svg>
        <div
          className="absolute inset-0 rounded-3xl opacity-40 blur-lg animate-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(132,204,22,0.4) 0%, transparent 70%)",
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight text-white">
            ZILLA<span className="text-gradient-lime">LABS</span>
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
            Download Hub
          </span>
        </div>
      )}
    </div>
  );
}
