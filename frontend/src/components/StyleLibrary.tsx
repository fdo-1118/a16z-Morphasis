import { useState, useMemo } from 'react';
import type { Style } from '../types';
import { StyleCard } from './StyleCard';
import { ALL_TAGS } from '../data/curatedStyles';

interface StyleLibraryProps {
  styles: Style[];
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">Style Library</h2>
        <span className="text-xs text-zinc-600">{filtered.length} styles</span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search styles..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-600/60 focus:ring-1 focus:ring-violet-600/30 transition-colors"
        />
      </div>

      {/* Tags filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
            !activeTag
              ? 'border-violet-600 bg-violet-950/60 text-violet-300'
              : 'border-border-subtle text-zinc-500 hover:border-border-default hover:text-zinc-400'
          }`}
        >
          All
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              activeTag === tag
                ? 'border-violet-600 bg-violet-950/60 text-violet-300'
                : 'border-border-subtle text-zinc-500 hover:border-border-default hover:text-zinc-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Curated styles */}
      {curated.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Curated</p>
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
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Your Styles</p>
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
        <div className="py-12 text-center">
          <p className="text-sm text-zinc-600">No styles match your search.</p>
          <button onClick={() => { setQuery(''); setActiveTag(null); }} className="mt-2 text-xs text-violet-500 hover:text-violet-400">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
