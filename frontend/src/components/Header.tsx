export function Header() {
  return (
    <header className="w-full border-b border-border-subtle bg-surface-0 flex items-center px-8 h-16">
      {/* ANDREESSEN HOROWITZ stacked wordmark */}
      <a href="/" className="flex flex-col leading-none shrink-0">
        <span
          className="text-[11px] font-bold tracking-[0.12em] text-zinc-200 uppercase"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
        >
          Andreessen
        </span>
        <span
          className="text-[11px] font-bold tracking-[0.12em] text-zinc-200 uppercase"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
        >
          Horowitz
        </span>
      </a>

      {/* Nav */}
      <nav className="flex items-center gap-6 ml-12 flex-1">
        {['Brands', 'Resources', 'Learn More'].map(item => (
          <button
            key={item}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
            style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
          >
            {item}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {/* START A PROJECT CTA */}
        <button
          className="px-4 py-2 text-[11px] font-semibold text-white uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
          style={{
            background: '#15627C',
            fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif",
            borderRadius: '2px',
          }}
        >
          Start a Project
        </button>

        {/* Search */}
        <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Login */}
        <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
