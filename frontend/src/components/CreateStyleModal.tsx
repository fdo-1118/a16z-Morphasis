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

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

function ParamSlider({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-xs text-zinc-500 shrink-0" style={sans}>{label}</span>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-0.5 appearance-none bg-surface-4 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border-default"
      />
      <span className="w-8 text-xs font-mono text-zinc-500 text-right">{value}</span>
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

  const inputClass = "w-full px-3 py-2 text-sm bg-surface-2 border border-border-subtle rounded text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-border-default transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-surface-1 border border-border-subtle shadow-xl animate-slide-up overflow-hidden"
        style={{ borderRadius: '4px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2
            className="text-base font-normal text-zinc-300"
            style={{ fontFamily: "'orpheus-pro', 'Big Caslon', Georgia, serif" }}
          >
            Create New Style
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-3 rounded text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Reference image */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]" style={sans}>
              Reference Image (optional)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-border-subtle hover:border-border-default cursor-pointer transition-colors overflow-hidden bg-surface-2"
              style={{ aspectRatio: '3/1', borderRadius: '2px' }}
            >
              {referenceImage ? (
                <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center gap-2 text-zinc-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs" style={sans}>Upload style reference image</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]" style={sans}>Style Name *</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Moody Noir"
              className={inputClass}
              style={sans}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]" style={sans}>Description</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the visual character of this style..."
              rows={2}
              className={`${inputClass} resize-none`}
              style={sans}
            />
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]" style={sans}>Effect Parameters</label>
            <div className="flex flex-col gap-3 p-3 bg-surface-2 border border-border-subtle" style={{ borderRadius: '2px' }}>
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
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]" style={sans}>Tags (comma separated)</label>
            <input
              type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="e.g. dark, moody, cinematic"
              className={inputClass}
              style={sans}
            />
          </div>

          {/* Visibility */}
          <div className="flex gap-2">
            {(['private', 'community'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex-1 py-2 text-[11px] font-medium border transition-colors ${
                  visibility === v
                    ? 'text-white'
                    : 'border-border-subtle text-zinc-500 hover:border-border-default bg-surface-2'
                }`}
                style={{
                  ...sans,
                  borderRadius: '2px',
                  ...(visibility === v ? { background: '#002D2D', borderColor: '#002D2D' } : {}),
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {v === 'private' ? 'Private' : 'Share with Community'}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2" style={{ ...sans, borderRadius: '2px' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-400 bg-surface-2 hover:bg-surface-3 border border-border-subtle transition-colors uppercase tracking-[0.06em]"
            style={{ ...sans, borderRadius: '2px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2 text-xs font-medium text-white disabled:opacity-50 transition-opacity uppercase tracking-[0.08em]"
            style={{ ...sans, background: '#002D2D', borderRadius: '2px' }}
          >
            {saving ? 'Saving…' : 'Save Style'}
          </button>
        </div>
      </div>
    </div>
  );
}
