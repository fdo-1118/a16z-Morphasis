export function Header() {
  return (
    <header className="w-full border-b border-border-subtle bg-surface-0 flex items-center px-8 h-16">
      {/* a16z logomark */}
      <a href="/" className="flex items-center gap-3 shrink-0">
        <svg width="36" height="20" viewBox="0 0 72 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="a16z">
          {/* a */}
          <path d="M0 32V14.4C0 8.64 3.84 5.76 10.08 5.76C16.32 5.76 20.16 8.64 20.16 14.4V32H15.84V26.88C14.88 30.24 12.48 32.48 8.64 32.48C3.84 32.48 0 29.76 0 32ZM15.84 20.16V14.4C15.84 11.04 13.44 9.6 10.08 9.6C6.72 9.6 4.32 11.04 4.32 14.4V20.16H15.84ZM4.32 26.4C4.32 28.32 5.76 29.12 8.16 29.12C11.52 29.12 15.84 26.88 15.84 22.56V23.52H4.32V26.4Z" fill="white"/>
          {/* 1 */}
          <path d="M28 32V9.6H24.32V6.24H32.32V32H28Z" fill="white"/>
          {/* 6 */}
          <path d="M36.48 24.96C36.48 18.72 40.32 14.4 47.04 14.4C50.88 14.4 53.76 15.84 55.68 18.24L52.8 20.64C51.36 18.72 49.44 17.76 47.04 17.76C43.2 17.76 40.8 20.16 40.8 24C40.8 24.48 40.8 24.96 40.8 25.44C41.76 23.04 44.16 21.6 47.04 21.6C51.36 21.6 54.72 24 54.72 28.32C54.72 32.16 51.84 35.52 46.56 35.52C40.32 35.52 36.48 31.2 36.48 24.96ZM50.4 28.32C50.4 26.4 48.96 24.96 46.56 24.96C44.16 24.96 42.72 26.4 42.72 28.32C42.72 30.24 44.16 32.16 46.56 32.16C48.96 32.16 50.4 30.24 50.4 28.32Z" fill="white"/>
          {/* z */}
          <path d="M57.6 32V28.8L68.16 17.76H57.6V14.4H72.96V17.6L62.4 28.64H72.96V32H57.6Z" fill="white"/>
        </svg>
        <div className="w-px h-4 bg-border-subtle" />
        <span
          className="text-[11px] text-zinc-500 uppercase tracking-[0.12em]"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
        >
          Morphasis
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
