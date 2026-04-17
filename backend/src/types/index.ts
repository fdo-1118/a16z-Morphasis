export interface StyleParameters {
  blurIntensity: number;
  pixelation: number;
  colorTemperature: number;
  opacity: number;
  saturation: number;
  contrast: number;
}

export interface Style {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  aiPrompt: string;
  referenceImageUrl?: string;
  parameters: StyleParameters;
  author: 'curated' | string;
  tags: string[];
  visibility: 'public' | 'community' | 'private';
  createdAt: string;
}

export interface FusionRequest {
  contentImage: string;
  styleId?: string;
  styleImage?: string;
  intensity: number;
  parameters?: Partial<StyleParameters>;
}

export interface PredictionStatus {
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  outputUrl?: string;
  error?: string;
}
