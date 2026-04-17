import type { Style } from '../types';
import { CURATED_STYLES } from '../data/curatedStyles';

interface StyleSelectorProps {
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

const domaine = { fontFamily: "'domaine-text', Baskerville, Georgia, serif" };
const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
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
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style)}
              className={`flex items-center gap-3 w-full border transition-all text-left ${
                isSelected
                  ? 'border-zinc-400 bg-surface-2'
                  : 'border-border-subtle bg-surface-2 hover:border-border-default'
              }`}
              style={{ borderRadius: '2px' }}
              title={style.description}
            >
              {/* Style thumbnail preview */}
              <div
                className="w-14 h-14 shrink-0"
                style={{ background: style.thumbnail }}
              />
              {/* Name */}
              <span
                className={`text-[11px] font-medium uppercase tracking-[0.08em] ${
                  isSelected ? 'text-zinc-200' : 'text-zinc-400'
                }`}
                style={sans}
              >
                {style.name}
              </span>
              {/* Selected check */}
              {isSelected && (
                <div className="ml-auto mr-3 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
