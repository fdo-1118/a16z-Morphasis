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
        {/* Hero section */}
        <div className="border-b border-border-subtle bg-surface-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-end gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                  Image Fusion
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Blend the visual character of any style with your content image
                </p>
              </div>
              <div className="ml-auto flex gap-2 text-xs text-zinc-700">
                <span className="px-2 py-1 bg-surface-2 border border-border-subtle rounded-lg">↑ Upload</span>
                <span className="px-2 py-1 bg-surface-2 border border-border-subtle rounded-lg">✦ Select Style</span>
                <span className="px-2 py-1 bg-surface-2 border border-border-subtle rounded-lg">◆ Fuse</span>
              </div>
            </div>

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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <StyleLibrary
            styles={styles}
            selectedStyle={selectedStyle}
            onSelect={setSelectedStyle}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-zinc-700">
          <span>◆ Morphasis · AI-powered image fusion</span>
          <span>Powered by Replicate</span>
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
