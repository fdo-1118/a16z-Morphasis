import { useRef, useState, useCallback } from 'react';
import { fileToDataUri } from '../services/api';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (dataUri: string | null) => void;
  onStyleDrop?: (styleId: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({ image, onImageChange, onStyleDrop, label = 'Content Image', className = '' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isStyleDragOver, setIsStyleDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const uri = await fileToDataUri(file);
    onImageChange(uri);
  }, [onImageChange]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsStyleDragOver(false);

    const styleId = e.dataTransfer.getData('text/style-id');
    if (styleId && onStyleDrop) {
      onStyleDrop(styleId);
      return;
    }

    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }, [handleFile, onStyleDrop]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const styleId = e.dataTransfer.types.includes('text/style-id') ||
      e.dataTransfer.types.includes('text/plain');
    if (styleId) {
      setIsStyleDragOver(true);
    } else {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
    setIsStyleDragOver(false);
  }, []);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  const ringColor = isStyleDragOver
    ? 'border-cyan-400 bg-cyan-500/5'
    : isDragOver
    ? 'border-violet-500 bg-violet-500/5'
    : image
    ? 'border-border-subtle hover:border-border-default'
    : 'border-border-subtle hover:border-violet-600/60';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
      <div
        className={`relative group rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${ringColor}`}
        style={{ aspectRatio: '4/3' }}
        onClick={() => !image && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Content"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
                >
                  Replace
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
                  className="px-3 py-1.5 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg backdrop-blur-sm border border-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            {isStyleDragOver && (
              <div className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">✦</div>
                  <p className="text-sm font-medium text-cyan-300">Drop to apply style</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {isDragOver ? (
              <>
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-violet-400">Release to upload</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center group-hover:bg-violet-950/60 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500 group-hover:text-violet-400 transition-colors">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    Drop your image here
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">or <span className="text-violet-500 hover:text-violet-400">click to browse</span></p>
                </div>
                <p className="text-xs text-zinc-700">PNG, JPG, WEBP up to 20MB</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
