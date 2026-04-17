import type { FusionStatus, FusionMode } from '../types';
import { downloadImage } from '../services/api';

interface OutputPreviewProps {
  status: FusionStatus;
  mode: FusionMode;
  outputUrl: string | null;
  error: string | null;
  onRetry: () => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function OutputPreview({ status, mode, outputUrl, error, onRetry }: OutputPreviewProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <label
          className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]"
          style={sans}
        >
          Output
        </label>
        {outputUrl && (
          <div className="flex gap-1.5">
            <button
              onClick={() => downloadImage(outputUrl, 'morphasis-output.png')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium bg-surface-2 hover:bg-surface-3 text-zinc-400 hover:text-zinc-300 rounded border border-border-subtle hover:border-border-default transition-colors"
              style={sans}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PNG
            </button>
            <button
              onClick={() => downloadImage(outputUrl, 'morphasis-output.jpg')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium bg-surface-2 hover:bg-surface-3 text-zinc-400 hover:text-zinc-300 rounded border border-border-subtle hover:border-border-default transition-colors"
              style={sans}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              JPG
            </button>
          </div>
        )}
      </div>

      <div
        className="relative flex-1 border border-border-subtle bg-surface-1 overflow-hidden"
        style={{ minHeight: '320px', borderRadius: '2px' }}
      >
        {status === 'idle' && !outputUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            {/* Subtle crosshatch */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #727069 0, #727069 1px, transparent 0, transparent 50%)',
                backgroundSize: '12px 12px',
              }}
            />
            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 border border-border-default bg-surface-2 flex items-center justify-center" style={{ borderRadius: '2px' }}>
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" fill="#C7BDA9" />
                  <polygon points="16,8 25,13 25,19 16,24 7,19 7,13" fill="#E7E1D2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400" style={sans}>Your fusion will appear here</p>
                <p className="text-xs text-zinc-500 mt-1" style={sans}>Upload an image and select a style to begin</p>
              </div>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-border-default" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-border-subtle border-t-zinc-500 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-400 animate-pulse" style={sans}>Fusing images</p>
              <p className="text-xs text-zinc-500 mt-1" style={sans}>This may take 10–30 seconds</p>
            </div>
            <div className="w-48 h-0.5 bg-surface-3 overflow-hidden">
              <div className="h-full animate-shimmer"
                style={{ background: 'linear-gradient(90deg, #E7E1D2 0%, #002D2D 40%, #336D5D 60%, #E7E1D2 100%)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-11 h-11 border border-red-300/30 bg-red-50 flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-500" style={sans}>Fusion failed</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs" style={sans}>{error ?? 'An unexpected error occurred'}</p>
            </div>
            <button
              onClick={onRetry}
              className="px-4 py-1.5 text-xs font-medium bg-surface-2 hover:bg-surface-3 text-zinc-400 hover:text-zinc-300 border border-border-subtle hover:border-border-default transition-colors"
              style={{ ...sans, borderRadius: '2px' }}
            >
              Try again
            </button>
          </div>
        )}

        {outputUrl && (
          <div className="absolute inset-0 animate-fade-in">
            <img
              src={outputUrl}
              alt="Fusion output"
              className="w-full h-full object-contain"
            />
            {/* Mode badge */}
            <div className="absolute bottom-2 left-2">
              {mode === 'local' ? (
                <span
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium backdrop-blur-sm"
                  style={{ ...sans, background: 'rgba(51,109,93,0.15)', color: '#336D5D', border: '1px solid rgba(51,109,93,0.3)', borderRadius: '2px' }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Local preview · add REPLICATE_API_TOKEN for AI
                </span>
              ) : mode === 'ai' ? (
                <span
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium backdrop-blur-sm"
                  style={{ ...sans, background: 'rgba(0,45,45,0.15)', color: '#002D2D', border: '1px solid rgba(0,45,45,0.25)', borderRadius: '2px' }}
                >
                  <svg width="9" height="9" viewBox="0 0 32 32" fill="currentColor"><polygon points="16,3 29,10 29,22 16,29 3,22 3,10"/></svg>
                  AI fusion
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
