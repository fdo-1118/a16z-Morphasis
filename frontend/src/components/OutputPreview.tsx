import type { FusionStatus, FusionMode } from '../types';
import { downloadImage } from '../services/api';

interface OutputPreviewProps {
  status: FusionStatus;
  mode: FusionMode;
  outputUrl: string | null;
  error: string | null;
  onRetry: () => void;
}

export function OutputPreview({ status, mode, outputUrl, error, onRetry }: OutputPreviewProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Output</label>
        {outputUrl && (
          <div className="flex gap-2">
            <button
              onClick={() => downloadImage(outputUrl, 'morphasis-output.png')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-3 hover:bg-surface-4 text-zinc-300 hover:text-white rounded-lg border border-border-subtle hover:border-border-default transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PNG
            </button>
            <button
              onClick={() => downloadImage(outputUrl, 'morphasis-output.jpg')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-3 hover:bg-surface-4 text-zinc-300 hover:text-white rounded-lg border border-border-subtle hover:border-border-default transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        className="relative flex-1 rounded-xl border border-border-subtle bg-surface-1 overflow-hidden"
        style={{ minHeight: '320px' }}
      >
        {status === 'idle' && !outputUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-surface-3 border border-border-subtle flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
                    <defs>
                      <linearGradient id="output-g" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="url(#output-g)" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Your fusion will appear here</p>
                <p className="text-xs text-zinc-700 mt-1">Upload an image and select a style to begin</p>
              </div>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-violet-600/30" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-cyan-500/20 border-t-cyan-400/60 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-400 animate-pulse-glow">Fusing images</p>
              <p className="text-xs text-zinc-600 mt-1">This may take 10–30 seconds</p>
            </div>
            <div className="w-48 h-1 bg-surface-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 animate-shimmer rounded-full"
                style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Fusion failed</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">{error ?? 'An unexpected error occurred'}</p>
            </div>
            <button
              onClick={onRetry}
              className="px-4 py-2 text-xs font-medium bg-surface-3 hover:bg-surface-4 text-zinc-300 rounded-lg border border-border-subtle hover:border-border-default transition-colors"
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
                <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-lg backdrop-blur-sm">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Local preview · add REPLICATE_API_TOKEN for AI
                </span>
              ) : mode === 'ai' ? (
                <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/25 rounded-lg backdrop-blur-sm">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 7 22 17 12 22 2 17 2 7"/></svg>
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
