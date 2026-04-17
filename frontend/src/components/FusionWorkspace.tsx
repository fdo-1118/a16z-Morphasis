import type { Style, FusionStatus } from '../types';
import { ImageUploader } from './ImageUploader';
import { StyleIntensitySlider } from './StyleIntensitySlider';
import { OutputPreview } from './OutputPreview';

interface FusionWorkspaceProps {
  contentImage: string | null;
  selectedStyle: Style | null;
  intensity: number;
  fusionStatus: FusionStatus;
  outputUrl: string | null;
  error: string | null;
  onContentImageChange: (img: string | null) => void;
  onIntensityChange: (v: number) => void;
  onStyleDrop: (styleId: string) => void;
  onFuse: () => void;
  onRetry: () => void;
}

export function FusionWorkspace({
  contentImage,
  selectedStyle,
  intensity,
  fusionStatus,
  outputUrl,
  error,
  onContentImageChange,
  onIntensityChange,
  onStyleDrop,
  onFuse,
  onRetry,
}: FusionWorkspaceProps) {
  const canFuse = contentImage && selectedStyle && fusionStatus !== 'loading';

  return (
    <div className="flex flex-col gap-6">
      {/* Top: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Content + Controls */}
        <div className="flex flex-col gap-5">
          <ImageUploader
            image={contentImage}
            onImageChange={onContentImageChange}
            onStyleDrop={(styleId) => { onStyleDrop(styleId); }}
            label="Content Image"
          />

          {/* Selected style preview */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Selected Style</label>
            {selectedStyle ? (
              <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-border-subtle">
                <div
                  className="w-12 h-12 rounded-lg shrink-0"
                  style={{ background: selectedStyle.thumbnail }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{selectedStyle.name}</p>
                  <p className="text-xs text-zinc-600 truncate mt-0.5">{selectedStyle.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedStyle.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-3 text-zinc-600">{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-dashed border-border-subtle">
                <div className="w-12 h-12 rounded-lg bg-surface-3 shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-600">Select a style from the library below</p>
              </div>
            )}
          </div>

          <StyleIntensitySlider value={intensity} onChange={onIntensityChange} />

          {/* Fuse button */}
          <button
            onClick={onFuse}
            disabled={!canFuse}
            className={`relative w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 overflow-hidden ${
              canFuse
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-surface-3 text-zinc-600 cursor-not-allowed border border-border-subtle'
            }`}
          >
            {fusionStatus === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Fusing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
                  <polyline points="8,12 12,8 16,12" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                </svg>
                {!contentImage ? 'Upload an image first' : !selectedStyle ? 'Select a style first' : 'Fuse Images'}
              </span>
            )}
            {canFuse && (
              <div className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 pointer-events-none" />
            )}
          </button>

          {/* Tip */}
          <p className="text-xs text-zinc-700 text-center">
            Tip: drag any style directly onto your image to instantly fuse
          </p>
        </div>

        {/* Right: Output */}
        <OutputPreview
          status={fusionStatus}
          outputUrl={outputUrl}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
