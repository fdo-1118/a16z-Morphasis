import { useState } from 'react';
import type { FusionStatus, FusionMode } from '../types';
import { downloadImage } from '../services/api';

interface PreviewPanelProps {
  status: FusionStatus;
  mode: FusionMode;
  outputUrl: string | null;
  error: string | null;
  onRetry: () => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

function DownloadBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 text-[11px] font-medium text-zinc-400 bg-surface-2 border border-border-subtle hover:border-border-default hover:text-zinc-300 transition-colors uppercase tracking-[0.08em]"
      style={{ ...sans, borderRadius: '2px' }}
    >
      {label}
    </button>
  );
}

export function PreviewPanel({ status, mode, outputUrl, error, onRetry }: PreviewPanelProps) {
  const [animationEnabled, setAnimationEnabled] = useState(false);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      {/* H4 — Domaine Text */}
      <h4
        className="text-lg font-normal text-zinc-300 shrink-0"
        style={{ fontFamily: "'domaine-text', Baskerville, Georgia, serif" }}
      >
        Preview
      </h4>

      {/* Preview image area */}
      <div className="flex-1 bg-surface-1 border border-border-subtle overflow-hidden relative" style={{ borderRadius: '2px', minHeight: '200px' }}>
        {status === 'idle' && !outputUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #E7E1D2 0, #E7E1D2 1px, transparent 0, transparent 50%)',
                backgroundSize: '10px 10px',
                opacity: 0.5,
              }}
            />
          </div>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border border-border-default" />
              <div className="absolute inset-0 rounded-full border border-transparent border-t-zinc-400 animate-spin" />
            </div>
            <p className="text-xs text-zinc-500 animate-pulse" style={sans}>Generating fusion…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-10 h-10 border border-red-200 bg-red-50 flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-xs text-red-400" style={sans}>{error ?? 'Fusion failed'}</p>
            <button
              onClick={onRetry}
              className="px-3 py-1.5 text-[11px] text-zinc-400 bg-surface-2 border border-border-subtle hover:border-border-default transition-colors uppercase tracking-wide"
              style={{ ...sans, borderRadius: '2px' }}
            >
              Try again
            </button>
          </div>
        )}

        {outputUrl && (
          <div className="absolute inset-0 animate-fade-in">
            <img src={outputUrl} alt="Fusion output" className="w-full h-full object-cover" />
            {/* Mode badge */}
            {mode && (
              <div className="absolute bottom-2 left-2">
                <span
                  className="px-2 py-1 text-[9px] font-medium uppercase tracking-wider"
                  style={{
                    ...sans,
                    background: mode === 'ai' ? 'rgba(0,45,45,0.85)' : 'rgba(51,109,93,0.85)',
                    color: 'white',
                    borderRadius: '1px',
                  }}
                >
                  {mode === 'ai' ? 'AI Fusion' : 'Local Preview'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download buttons */}
      <div className="flex gap-2 shrink-0">
        <DownloadBtn label="PNG" onClick={() => outputUrl && downloadImage(outputUrl, 'morphasis-output.png')} />
        <DownloadBtn label="JPG" onClick={() => outputUrl && downloadImage(outputUrl, 'morphasis-output.jpg')} />
        <DownloadBtn label="SVG" onClick={() => outputUrl && downloadImage(outputUrl, 'morphasis-output.svg')} />
      </div>

      {/* Add Animation toggle */}
      <div className="flex items-center justify-between shrink-0">
        <span className="text-xs text-zinc-400" style={sans}>Add Animation</span>
        <button
          onClick={() => setAnimationEnabled(v => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors ${animationEnabled ? 'bg-zinc-400' : 'bg-surface-4'}`}
          style={{ border: '1px solid', borderColor: animationEnabled ? '#ACA08D' : '#C7BDA9' }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${animationEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </button>
      </div>

      {/* Animation export buttons */}
      {animationEnabled && (
        <div className="flex gap-2 shrink-0 animate-fade-in">
          <DownloadBtn label="MP4" onClick={() => outputUrl && downloadImage(outputUrl, 'morphasis-output.mp4')} />
          <DownloadBtn label="GIF" onClick={() => outputUrl && downloadImage(outputUrl, 'morphasis-output.gif')} />
        </div>
      )}
    </div>
  );
}
