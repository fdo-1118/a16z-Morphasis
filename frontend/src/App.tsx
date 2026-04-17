import { useState, useCallback, useEffect } from 'react';
import type { Style } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1Upload } from './components/Step1Upload';
import { Step2Workspace } from './components/Step2Workspace';
import { useFusion } from './hooks/useFusion';

type Step = 'upload' | 'workspace';

export function App() {
  const [step, setStep] = useState<Step>('upload');
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const { fuse, retry, reset, status, mode, outputUrl, error } = useFusion();

  const triggerFusion = useCallback((
    content: string,
    style: Style | null,
    styleImg: string | null,
  ) => {
    if (!content || (!style && !styleImg)) return;
    fuse({
      contentImage: content,
      styleId: style?.id,
      style: style ?? undefined,
      styleImage: styleImg ?? style?.referenceImageUrl,
      intensity: 70,
    });
  }, [fuse]);

  const handleContentImage = useCallback((dataUri: string) => {
    setContentImage(dataUri);
    setStep('workspace');
    reset();
  }, [reset]);

  const handleSelectStyle = useCallback((style: Style) => {
    setSelectedStyle(style);
    if (contentImage) triggerFusion(contentImage, style, secondImage);
  }, [contentImage, secondImage, triggerFusion]);

  const handleSecondImage = useCallback((dataUri: string) => {
    setSecondImage(dataUri);
    if (contentImage) triggerFusion(contentImage, selectedStyle, dataUri);
  }, [contentImage, selectedStyle, triggerFusion]);

  useEffect(() => {
    if (contentImage && (selectedStyle || secondImage) && status === 'idle') {
      triggerFusion(contentImage, selectedStyle, secondImage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    /* h-screen + overflow-hidden keeps the entire page fixed — nothing shifts on image load */
    <div className="h-screen flex flex-col overflow-hidden bg-surface-0">
      <Header />

      {/* Teal section banner */}
      <div className="shrink-0" style={{ background: '#15627C' }}>
        <div className="px-8 py-5">
          <h1
            className="text-4xl font-normal text-white"
            style={{ fontFamily: "'orpheus-pro', 'Big Caslon', Georgia, serif" }}
          >
            Morphasis
          </h1>
        </div>
      </div>

      {/* Workspace — fills all remaining height, never resizes */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {step === 'upload' ? (
          <Step1Upload onImageReady={handleContentImage} />
        ) : (
          contentImage && (
            <Step2Workspace
              contentImage={contentImage}
              secondImage={secondImage}
              selectedStyle={selectedStyle}
              fusionStatus={status}
              fusionMode={mode}
              outputUrl={outputUrl}
              error={error}
              onSelectStyle={handleSelectStyle}
              onSecondImage={handleSecondImage}
              onRetry={retry}
            />
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
