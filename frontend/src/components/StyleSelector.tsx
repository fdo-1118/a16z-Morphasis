import { useState } from 'react';
import type { Style } from '../types';
import { CURATED_STYLES } from '../data/curatedStyles';

interface StyleSelectorProps {
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

const domaine = { fontFamily: "'domaine-text', Baskerville, Georgia, serif" };
const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

function StyleTooltip({ style, onClose }: { style: Style; onClose: () => void }) {
  return (
    <div
      className="absolute z-50 left-0 right-0 mx-4 mt-1 bg-surface-1 border border-border-default shadow-xl text-[10px]"
      style={{ borderRadius: '2px' }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
        <span className="text-zinc-300 font-medium uppercase tracking-[0.08em]" style={sans}>{style.name}</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="px-3 py-2 border-b border-border-subtle">
        <p className="text-zinc-400 leading-relaxed" style={sans}>{style.description}</p>
      </div>
      {style.whenToUse && style.whenToUse.length > 0 && (
        <div className="px-3 py-2 border-b border-border-subtle">
          <p className="text-[9px] uppercase tracking-[0.1em] text-zinc-500 mb-1.5" style={sans}>When to use</p>
          <ul className="flex flex-col gap-1">
            {style.whenToUse.map((item, i) => (
              <li key={i} className="flex gap-1.5 text-zinc-400 leading-snug" style={sans}>
                <span className="shrink-0" style={{ color: '#336D5D' }}>↗</span>
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
  );
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  const [tooltipStyleId, setTooltipStyleId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto overflow-x-hidden">
      {/* H4 — Domaine Text */}
      <h4
        className="text-lg font-normal text-zinc-300 mb-5"
        style={domaine}
      >
        Curated Styles
      </h4>

      <div className="flex flex-col gap-2">
        {CURATED_STYLES.map(style => {
          const isSelected = selectedStyle?.id === style.id;
          const isTooltipOpen = tooltipStyleId === style.id;
          const hasMetadata = (style.whenToUse?.length ?? 0) > 0 || (style.doNotUseWhen?.length ?? 0) > 0;

          return (
            <div key={style.id} className="relative">
              <button
                onClick={() => onSelect(style)}
                className={`flex items-center gap-3 w-full border transition-all text-left ${
                  isSelected
                    ? 'border-zinc-400 bg-surface-2'
                    : 'border-border-subtle bg-surface-2 hover:border-border-default'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {/* Style thumbnail preview */}
                <div
                  className="w-14 h-14 shrink-0"
                  style={{ background: style.thumbnail }}
                />
                {/* Name */}
                <span
                  className={`text-[11px] font-medium uppercase tracking-[0.08em] flex-1 ${
                    isSelected ? 'text-zinc-200' : 'text-zinc-400'
                  }`}
                  style={sans}
                >
                  {style.name}
                </span>
                {/* Info button */}
                {hasMetadata && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setTooltipStyleId(isTooltipOpen ? null : style.id);
                    }}
                    className={`p-2 mr-1 transition-colors ${
                      isTooltipOpen ? 'text-zinc-300' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                    title="Usage guidelines"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </button>
                )}
                {/* Selected check */}
                {isSelected && !hasMetadata && (
                  <div className="mr-3 shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>

              {isTooltipOpen && (
                <StyleTooltip style={style} onClose={() => setTooltipStyleId(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
