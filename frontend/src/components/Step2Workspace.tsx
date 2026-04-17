import { useEffect, useState } from 'react';
import type { Style, FusionStatus, FusionMode } from '../types';
import { StyleSelector } from './StyleSelector';
import { CenterPanel } from './CenterPanel';
import { PreviewPanel } from './PreviewPanel';

interface Step2WorkspaceProps {
  contentImage: string;
  secondImage: string | null;
  selectedStyle: Style | null;
  fusionStatus: FusionStatus;
  fusionMode: FusionMode;
  outputUrl: string | null;
  error: string | null;
  onSelectStyle: (style: Style) => void;
  onSecondImage: (dataUri: string) => void;
  onRetry: () => void;
}

export function Step2Workspace({
  contentImage,
  secondImage,
  selectedStyle,
  fusionStatus,
  fusionMode,
  outputUrl,
  error,
  onSelectStyle,
  onSecondImage,
  onRetry,
}: Step2WorkspaceProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex-1 grid grid-cols-3 divide-x divide-border-subtle overflow-hidden">
      {/* Left — Curated Styles */}
      <div
        className={`overflow-y-auto transition-all duration-500 ease-out ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
      >
        <StyleSelector selectedStyle={selectedStyle} onSelect={onSelectStyle} />
      </div>

      {/* Center — Images */}
      <div
        className={`overflow-hidden transition-opacity duration-500 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CenterPanel
          contentImage={contentImage}
          secondImage={secondImage}
          onSecondImage={onSecondImage}
        />
      </div>

      {/* Right — Preview */}
      <div
        className={`overflow-y-auto transition-all duration-500 ease-out ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
      >
        <PreviewPanel
          status={fusionStatus}
          mode={fusionMode}
          outputUrl={outputUrl}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
