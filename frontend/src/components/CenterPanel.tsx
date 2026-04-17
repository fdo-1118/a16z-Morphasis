import { useRef, useState, useCallback } from 'react';
import { fileToDataUri } from '../services/api';

interface CenterPanelProps {
  contentImage: string;
  secondImage: string | null;
  onSecondImage: (dataUri: string) => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function CenterPanel({ contentImage, secondImage, onSecondImage }: CenterPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const uri = await fileToDataUri(file);
    onSecondImage(uri);
  }, [onSecondImage]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  return (
    <div className="flex flex-col h-full">
      {/* First image */}
      <div className="flex-1 overflow-hidden">
        <img
          src={contentImage}
          alt="Content"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Second upload zone */}
      <div
        className={`border-t border-border-subtle cursor-pointer transition-colors flex-shrink-0 ${
          isDragOver ? 'bg-surface-3' : 'bg-surface-1 hover:bg-surface-2'
        }`}
        style={{ minHeight: '160px' }}
        onClick={() => !secondImage && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {secondImage ? (
          <div className="relative w-full h-full" style={{ minHeight: '160px' }}>
            <img src={secondImage} alt="Style" className="w-full h-full object-cover" style={{ minHeight: '160px' }} />
            <button
              onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
              className="absolute bottom-2 right-2 px-2.5 py-1 text-[10px] font-medium bg-black/40 text-white border border-white/20 backdrop-blur-sm uppercase tracking-wide"
              style={{ ...sans, borderRadius: '2px' }}
            >
              Replace
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ minHeight: '160px' }}>
            <div className="relative">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                <rect x="5" y="5" width="30" height="30" rx="3" />
                <circle cx="14" cy="15" r="3" />
                <polyline points="35 26 27 17 8 34" />
              </svg>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 absolute -top-1 -right-1.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-400" style={sans}>Upload Second File or Drag and Drop</p>
              <p className="text-xs text-zinc-500 mt-0.5" style={sans}>PNG, JPG, WebP up to 10MB</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
