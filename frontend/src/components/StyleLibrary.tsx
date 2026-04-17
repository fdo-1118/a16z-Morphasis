import { useState, useMemo } from 'react';
import type { Style } from '../types';
import { StyleCard } from './StyleCard';
import { ALL_TAGS } from '../data/curatedStyles';

interface StyleLibraryProps {
  styles: Style[];
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function StyleLibrary({ styles, selectedStyle, onSelect }: StyleLibraryProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return styles.filter(s => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !activeTag || s.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [styles, query, activeTag]);

  const curated = filtered.filter(s => s.author === 'curated');
  const user = filtered.filter(s => s.author !== 'curated');

  return (
    <div className="flex flex-col gap-5">
      {/* Section header */}
      <div className="flex items-end justify-between border-b border-border-subtle pb-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 mb-1" style={sans}>
            Style Library
          </p>
          <h2
            className="text-xl font-normal text-zinc-300"
            style={{ fontFamily: "'orpheus-pro', 'Big Caslon', Georgia, serif" }}
          >
            Curated Visual Styles
          </h2>
        </div>
        <span className="text-xs text-zinc-700 pb-0.5" style={sans}>{filtered.length} styles</span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search styles..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-border-default transition-colors"
          style={sans}
        />
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-2.5 py-1 text-[11px] border transition-colors ${
            !activeTag
              ? 'border-zinc-400 bg-zinc-400 text-white'
              : 'border-border-subtle text-zinc-500 hover:border-border-default hover:text-zinc-400'
          }`}
          style={{ ...sans, borderRadius: '2px' }}
        >
          All
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              activeTag === tag
                ? 'border-zinc-400 bg-zinc-400 text-white'
                : 'border-border-subtle text-zinc-500 hover:border-border-default hover:text-zinc-400'
            }`}
            style={{ ...sans, borderRadius: '2px' }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Curated styles */}
      {curated.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 flex items-center gap-2" style={sans}>
            <span>Curated</span>
            <span className="h-px flex-1 bg-border-subtle" />
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {curated.map(style => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyle?.id === style.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* User styles */}
      {user.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 flex items-center gap-2" style={sans}>
            <span>Your Styles</span>
            <span className="h-px flex-1 bg-border-subtle" />
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
            {user.map(style => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyle?.id === style.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-12 text-center border border-dashed border-border-subtle rounded">
          <p className="text-sm text-zinc-500" style={sans}>No styles match your search.</p>
          <button
            onClick={() => { setQuery(''); setActiveTag(null); }}
            className="mt-2 text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-300"
            style={sans}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
