interface HeaderProps {
  onCreateStyle: () => void;
}

export function Header({ onCreateStyle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border-subtle bg-surface-0/90 backdrop-blur-md flex items-center px-6">
      <div className="flex items-center gap-3 flex-1">
        {/* a16z Logobug — filled emerald hexagon */}
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" fill="#002D2D" />
          <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="#134F47" />
        </svg>
        <span
          className="font-semibold text-[15px] tracking-tight text-zinc-300"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
        >
          Morphasis
        </span>
        <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500 border border-border-default rounded bg-surface-3 tracking-widest uppercase">
          Beta
        </span>
      </div>

      <nav className="flex items-center gap-0.5">
        <button
          onClick={onCreateStyle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-surface-3 rounded-lg transition-colors"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.02em' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create Style
        </button>
        <a
          href="https://github.com/fdo-1118/a16z-Morphasis"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-surface-3 rounded-lg transition-colors"
          style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
      </nav>
    </header>
  );
}
