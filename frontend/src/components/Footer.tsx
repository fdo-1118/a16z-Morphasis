const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-0">
      {/* Questions row */}
      <div className="px-8 pt-5 pb-4 border-b border-border-subtle">
        <p className="text-xs text-zinc-400" style={sans}>
          <span className="font-semibold text-zinc-300">Questions?</span>{' '}
          Contact{' '}
          <a
            href="mailto:design@a16z.com"
            className="underline underline-offset-2"
            style={{ color: '#15627C' }}
          >
            design@a16z.com
          </a>
          .
        </p>
      </div>

      {/* Legal + Social */}
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5 text-[11px] text-zinc-500" style={sans}>
          <span>© 2025 Andreessen Horowitz</span>
          {['Terms of Use', 'Privacy Policy', 'Disclosures', 'Sitemap'].map(link => (
            <a key={link} href="#" className="hover:text-zinc-400 transition-colors">{link}</a>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {/* X / Twitter */}
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
