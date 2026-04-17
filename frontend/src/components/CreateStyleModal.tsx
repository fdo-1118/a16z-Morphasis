import { useState, useRef, useCallback } from 'react';
import type { CreateStyleForm, StyleParameters } from '../types';
import { fileToDataUri } from '../services/api';

interface CreateStyleModalProps {
  onClose: () => void;
  onSave: (form: CreateStyleForm) => Promise<void>;
}

const DEFAULT_PARAMS: StyleParameters = {
  blurIntensity: 0,
  pixelation: 0,
  colorTemperature: 0,
  opacity: 100,
  saturation: 100,
  contrast: 100,
};

function ParamSlider({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-xs text-zinc-500 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1 appearance-none bg-surface-3 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500"
      />
      <span className="w-8 text-xs font-mono text-zinc-400 text-right">{value}</span>
    </div>
  );
}

export function CreateStyleModal({ onClose, onSave }: CreateStyleModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'community'>('private');
  const [params, setParams] = useState<StyleParameters>(DEFAULT_PARAMS);
  const [referenceImage, setReferenceImage] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const uri = await fileToDataUri(file);
    setReferenceImage(uri);
  }, []);

  const setParam = (key: keyof StyleParameters, value: number) =>
    setParams(p => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        referenceImage,
        parameters: params,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        visibility,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save style');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-surface-1 border border-border-subtle rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-white">Create New Style</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-3 rounded-lg text-zinc-500 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Reference image */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Reference Image (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative rounded-xl border-2 border-dashed border-border-subtle hover:border-violet-600/60 cursor-pointer transition-colors overflow-hidden"
              style={{ aspectRatio: '3/1' }}
            >
              {referenceImage ? (
                <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center gap-2 text-zinc-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs">Upload style reference image</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Style Name *</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Moody Noir"
              className="w-full px-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-600/60 focus:ring-1 focus:ring-violet-600/30"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the visual character of this style..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-600/60 focus:ring-1 focus:ring-violet-600/30 resize-none"
            />
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Effect Parameters</label>
            <div className="flex flex-col gap-2.5 p-3 bg-surface-2 rounded-lg border border-border-subtle">
              <ParamSlider label="Blur Intensity" value={params.blurIntensity} min={0} max={100} onChange={v => setParam('blurIntensity', v)} />
              <ParamSlider label="Pixelation" value={params.pixelation} min={0} max={100} onChange={v => setParam('pixelation', v)} />
              <ParamSlider label="Color Temp" value={params.colorTemperature} min={-100} max={100} onChange={v => setParam('colorTemperature', v)} />
              <ParamSlider label="Opacity" value={params.opacity} min={0} max={100} onChange={v => setParam('opacity', v)} />
              <ParamSlider label="Saturation" value={params.saturation} min={0} max={200} onChange={v => setParam('saturation', v)} />
              <ParamSlider label="Contrast" value={params.contrast} min={0} max={200} onChange={v => setParam('contrast', v)} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tags (comma separated)</label>
            <input
              type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="e.g. dark, moody, cinematic"
              className="w-full px-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-600/60 focus:ring-1 focus:ring-violet-600/30"
            />
          </div>

          {/* Visibility */}
          <div className="flex gap-2">
            {(['private', 'community'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                  visibility === v
                    ? 'border-violet-600 bg-violet-950/60 text-violet-300'
                    : 'border-border-subtle text-zinc-500 hover:border-border-default'
                }`}
              >
                {v === 'private' ? '🔒 Private' : '🌐 Share with Community'}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border-subtle">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-zinc-400 hover:text-white bg-surface-2 hover:bg-surface-3 rounded-lg border border-border-subtle transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : 'Save Style'}
          </button>
        </div>
      </div>
    </div>
  );
}
