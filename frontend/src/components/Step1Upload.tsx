import { useRef, useState, useCallback } from 'react';
import { fileToDataUri } from '../services/api';

interface Step1UploadProps {
  onImageReady: (dataUri: string) => void;
}

export function Step1Upload({ onImageReady }: Step1UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const uri = await fileToDataUri(file);
    onImageReady(uri);
  }, [onImageReady]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  return (
    <div className="flex-1 flex items-center justify-center p-10 bg-surface-0">
      <div
        className={`w-full max-w-3xl border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver ? 'border-border-default bg-surface-1' : 'border-border-subtle bg-surface-1 hover:border-border-default'
        }`}
        style={{ borderRadius: '2px', aspectRatio: '16/9', maxHeight: '60vh' }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          {/* Upload icon */}
          <div className="relative">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400">
              <rect x="5" y="5" width="30" height="30" rx="3" />
              <circle cx="14" cy="15" r="3" />
              <polyline points="35 26 27 17 8 34" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-300 absolute -top-1 -right-2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>

          <div className="text-center">
            <p
              className="text-base font-normal text-zinc-300"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Upload First File or Drag and Drop
            </p>
            <p
              className="text-sm text-zinc-500 mt-1"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
        </div>

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
