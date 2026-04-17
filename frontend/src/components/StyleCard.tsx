import type { Style } from '../types';

interface StyleCardProps {
  style: Style;
  isSelected: boolean;
  onSelect: (style: Style) => void;
}

export function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/style-id', style.id);
    e.dataTransfer.setData('text/plain', style.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
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
          {style.author === 'curated' && (
            <span
              className="shrink-0 text-[9px] text-zinc-500 border border-border-default px-1 uppercase tracking-widest"
              style={{ borderRadius: '1px' }}
            >
              ✦
            </span>
          )}
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
  );
}
