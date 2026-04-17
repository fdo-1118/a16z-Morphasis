import type { Style } from '../types';
import { CURATED_STYLES } from '../data/curatedStyles';

interface StyleSelectorProps {
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <h2
        className="text-base font-semibold text-zinc-300 mb-5"
        style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
      >
        Curated Styles
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {CURATED_STYLES.map(style => {
          const isSelected = selectedStyle?.id === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style)}
              className={`py-2.5 px-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] border transition-all ${
                isSelected
                  ? 'bg-zinc-300 text-white border-zinc-300'
                  : 'bg-surface-2 text-zinc-400 border-border-subtle hover:border-border-default hover:text-zinc-300'
              }`}
              style={{ ...sans, borderRadius: '2px' }}
              title={style.description}
            >
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
