export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 shrink-0 drop-shadow-[0_2px_6px_rgba(245,181,10,0.35)]"
        role="img"
        aria-label="World Cup 2026 logo"
      >
        <defs>
          <linearGradient id="wc-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe28a" />
            <stop offset="45%" stopColor="#f5b50a" />
            <stop offset="100%" stopColor="#b9780a" />
          </linearGradient>
          <linearGradient id="wc-badge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0e9a4c" />
            <stop offset="55%" stopColor="#066a32" />
            <stop offset="100%" stopColor="#053f1f" />
          </linearGradient>
        </defs>

        {/* badge */}
        <circle cx="24" cy="24" r="22" fill="url(#wc-badge)" stroke="url(#wc-gold)" strokeWidth="1.6" />
        {/* faint pitch arc */}
        <circle cx="24" cy="24" r="14.5" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />

        {/* trophy */}
        <g fill="url(#wc-gold)">
          <path d="M15 11 H33 V14.5 C33 22.5 28.6 28 24 28 C19.4 28 15 22.5 15 14.5 Z" />
          <path d="M22.4 27.6 H25.6 V32 H22.4 Z" />
          <path d="M19.5 31.5 H28.5 V33.6 H19.5 Z" />
          <path d="M17 33.8 H31 L32.6 38 H15.4 Z" />
        </g>
        {/* handles */}
        <path d="M15 12.6 C9.2 12.6 9.4 21 16 20.4" fill="none" stroke="url(#wc-gold)" strokeWidth="2" strokeLinecap="round" />
        <path d="M33 12.6 C38.8 12.6 38.6 21 32 20.4" fill="none" stroke="url(#wc-gold)" strokeWidth="2" strokeLinecap="round" />

        {/* engraved 26 */}
        <text x="24" y="21.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#06351c" fontFamily="ui-sans-serif, system-ui, sans-serif">26</text>

        {/* sparkle */}
        <path d="M38.5 8.5 L39.4 11 L42 11.9 L39.4 12.8 L38.5 15.3 L37.6 12.8 L35 11.9 L37.6 11 Z" fill="#ffe28a" />
      </svg>

      <span className="leading-none">
        <span className="block font-display text-base font-extrabold tracking-tight sm:text-lg">
          World Cup
        </span>
        <span className="block text-[10px] font-extrabold tracking-[0.34em] text-gold">
          2026
        </span>
      </span>
    </span>
  );
}
