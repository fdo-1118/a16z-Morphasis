import type { Style, FusionStatus, FusionMode } from '../types';
import { ImageUploader } from './ImageUploader';
import { StyleIntensitySlider } from './StyleIntensitySlider';
import { OutputPreview } from './OutputPreview';

interface FusionWorkspaceProps {
  contentImage: string | null;
  selectedStyle: Style | null;
  intensity: number;
  fusionStatus: FusionStatus;
  fusionMode: FusionMode;
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
  fusionMode,
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
            <label
              className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Selected Style
            </label>
            {selectedStyle ? (
              <div className="flex items-center gap-3 p-3 bg-surface-2 rounded border border-border-subtle">
                <div
                  className="w-12 h-12 rounded shrink-0"
                  style={{ background: selectedStyle.thumbnail }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-zinc-300 truncate"
                    style={{ fontFamily: "'domaine-text', Baskerville, Georgia, serif" }}
                  >
                    {selectedStyle.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{selectedStyle.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedStyle.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-4 text-zinc-500 border border-border-subtle">{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-surface-2 rounded border border-dashed border-border-subtle">
                <div className="w-12 h-12 rounded bg-surface-3 shrink-0 flex items-center justify-center border border-border-subtle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-700">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-500">Select a style from the library below</p>
              </div>
            )}
          </div>

          <StyleIntensitySlider value={intensity} onChange={onIntensityChange} />

          {/* Fuse button — a16z Emerald CTA */}
          <button
            onClick={onFuse}
            disabled={!canFuse}
            className={`relative w-full py-3.5 rounded text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 overflow-hidden ${
              canFuse
                ? 'text-white hover:opacity-90 active:scale-[0.99] shadow-md'
                : 'bg-surface-3 text-zinc-500 cursor-not-allowed border border-border-subtle'
            }`}
            style={canFuse ? { background: 'linear-gradient(135deg, #002D2D 0%, #134F47 100%)', fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" } : { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
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
                <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
                  <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" />
                </svg>
                {!contentImage ? 'Upload an image first' : !selectedStyle ? 'Select a style first' : 'Fuse Images'}
              </span>
            )}
          </button>

          <p className="text-[11px] text-zinc-700 text-center">
            Tip: drag any style directly onto your image to instantly fuse
          </p>
        </div>

        {/* Right: Output */}
        <OutputPreview
          status={fusionStatus}
          mode={fusionMode}
          outputUrl={outputUrl}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
