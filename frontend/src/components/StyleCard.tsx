import { useState } from 'react';
import type { Style } from '../types';

interface StyleCardProps {
  style: Style;
  isSelected: boolean;
  onSelect: (style: Style) => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/style-id', style.id);
    e.dataTransfer.setData('text/plain', style.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const hasMetadata = (style.whenToUse?.length ?? 0) > 0 || (style.doNotUseWhen?.length ?? 0) > 0;

  return (
    <div className="relative">
      <div
        className={`group relative overflow-hidden cursor-pointer border transition-all duration-200 select-none ${
          isSelected
            ? 'border-violet-500 shadow-sm'
            : 'border-border-subtle hover:border-border-default'
        }`}
        style={{ borderRadius: '2px' }}
        onClick={() => onSelect(style)}
        draggable
        onDragStart={handleDragStart}
        title={`Drag onto your image or click to select — ${style.name}`}
      >
        {/* Thumbnail */}
        <div
          className="w-full transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: '1', background: style.thumbnail }}
        />

        {/* Selected indicator */}
        {isSelected && (
          <div
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center shadow"
            style={{ background: '#002D2D', borderRadius: '2px' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* Drag hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
          <div className="text-center px-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="mx-auto mb-1">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </svg>
            <p className="text-white text-[10px] font-medium">drag or click</p>
          </div>
        </div>

        {/* Info */}
        <div className="px-2.5 py-2 bg-surface-2 border-t border-border-subtle">
          <div className="flex items-start justify-between gap-1">
            <p
              className="text-xs font-medium text-zinc-300 truncate leading-tight"
              style={{ fontFamily: "'domaine-text', Baskerville, Georgia, serif" }}
            >
              {style.name}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {hasMetadata && (
                <button
                  onClick={e => { e.stopPropagation(); setShowTooltip(v => !v); }}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  title="Usage guidelines"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </button>
              )}
              {style.author === 'curated' && (
                <span
                  className="text-[9px] text-zinc-500 border border-border-default px-1 uppercase tracking-widest"
                  style={{ borderRadius: '1px' }}
                >
                  ✦
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {style.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 bg-surface-3 text-zinc-500 border border-border-subtle"
                style={{ borderRadius: '1px' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Usage tooltip */}
      {showTooltip && hasMetadata && (
        <div
          className="absolute z-50 left-full ml-2 top-0 w-56 bg-surface-1 border border-border-default shadow-xl text-[10px]"
          style={{ borderRadius: '2px' }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <span className="text-zinc-300 font-medium uppercase tracking-[0.08em]" style={sans}>{style.name}</span>
            <button onClick={() => setShowTooltip(false)} className="text-zinc-500 hover:text-zinc-300">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {style.whenToUse && style.whenToUse.length > 0 && (
            <div className="px-3 py-2 border-b border-border-subtle">
              <p className="text-[9px] uppercase tracking-[0.1em] text-zinc-500 mb-1.5" style={sans}>When to use</p>
              <ul className="flex flex-col gap-1">
                {style.whenToUse.map((item, i) => (
                  <li key={i} className="flex gap-1.5 text-zinc-400 leading-snug" style={sans}>
                    <span className="text-jade-500 shrink-0" style={{ color: '#336D5D' }}>↗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {style.doNotUseWhen && style.doNotUseWhen.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-[9px] uppercase tracking-[0.1em] text-zinc-500 mb-1.5" style={sans}>Do not use when</p>
              <ul className="flex flex-col gap-1">
                {style.doNotUseWhen.map((item, i) => (
                  <li key={i} className="flex gap-1.5 text-zinc-400 leading-snug" style={sans}>
                    <span className="shrink-0" style={{ color: '#8B3A3A' }}>↘</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
