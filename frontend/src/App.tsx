import { useState, useCallback } from 'react';
import type { Style, CreateStyleForm } from './types';
import { CURATED_STYLES } from './data/curatedStyles';
import { Header } from './components/Header';
import { FusionWorkspace } from './components/FusionWorkspace';
import { StyleLibrary } from './components/StyleLibrary';
import { CreateStyleModal } from './components/CreateStyleModal';
import { useFusion } from './hooks/useFusion';
import { createStyle } from './services/api';

export function App() {
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [intensity, setIntensity] = useState(70);
  const [styles, setStyles] = useState<Style[]>(CURATED_STYLES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { fuse, retry, status, mode, outputUrl, error } = useFusion();

  const handleFuse = useCallback(() => {
    if (!contentImage || !selectedStyle) return;
    fuse({
      contentImage,
      styleId: selectedStyle.id,
      style: selectedStyle,
      styleImage: selectedStyle.referenceImageUrl,
      intensity,
    });
  }, [contentImage, selectedStyle, intensity, fuse]);

  const handleStyleDrop = useCallback((styleId: string) => {
    const style = styles.find(s => s.id === styleId);
    if (style) {
      setSelectedStyle(style);
      if (contentImage) {
        fuse({
          contentImage,
          styleId: style.id,
          style,
          styleImage: style.referenceImageUrl,
          intensity,
        });
      }
    }
  }, [styles, contentImage, intensity, fuse]);

  const handleCreateStyle = useCallback(async (form: CreateStyleForm) => {
    const newStyle = await createStyle(form);
    setStyles(prev => [...prev, newStyle]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-0">
      <Header onCreateStyle={() => setShowCreateModal(true)} />

      <main className="flex-1 pt-14">
        {/* Section banner — Sapphire editorial header */}
        <div
          className="border-b border-border-subtle"
          style={{ background: 'linear-gradient(135deg, #092344 0%, #002D2D 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
              backgroundSize: '14px 14px',
            }}
          />
          <div className="max-w-7xl mx-auto px-6 py-10 relative">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/50 mb-3"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Morphasis · AI Image Fusion
            </p>
            <h1
              className="text-3xl font-normal text-white mb-2 leading-tight"
              style={{ fontFamily: "'orpheus-pro', 'Big Caslon', Georgia, serif" }}
            >
              Blend any visual style with your image
            </h1>
            <p
              className="text-sm text-white/60 max-w-xl"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Upload a content image, select a style from the library, and let AI fuse them together.
            </p>
            <div className="flex gap-2 mt-5 text-[11px]" style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-white/70 tracking-wide">↑ Upload</span>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-white/70 tracking-wide">✦ Select Style</span>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-white/70 tracking-wide">◆ Fuse</span>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="border-b border-border-subtle bg-surface-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <FusionWorkspace
              contentImage={contentImage}
              selectedStyle={selectedStyle}
              intensity={intensity}
              fusionStatus={status}
              fusionMode={mode}
              outputUrl={outputUrl}
              error={error}
              onContentImageChange={setContentImage}
              onIntensityChange={setIntensity}
              onStyleDrop={handleStyleDrop}
              onFuse={handleFuse}
              onRetry={retry}
            />
          </div>
        </div>

        {/* Style Library */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <StyleLibrary
            styles={styles}
            selectedStyle={selectedStyle}
            onSelect={setSelectedStyle}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface-1 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" fill="#002D2D" />
              <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="#134F47" />
            </svg>
            <span
              className="text-xs text-zinc-500"
              style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Morphasis · Software Is Eating the World
            </span>
          </div>
          <span
            className="text-xs text-zinc-700"
            style={{ fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Powered by Replicate
          </span>
        </div>
      </footer>

      {showCreateModal && (
        <CreateStyleModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateStyle}
        />
      )}
    </div>
  );
}
