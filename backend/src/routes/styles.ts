import { Router } from 'express';
import { CURATED_STYLES } from '../data/styles.js';
import type { Style } from '../types/index.js';

export const stylesRouter = Router();

const userStyles: Style[] = [];

stylesRouter.get('/', (_req, res) => {
  const allStyles = [...CURATED_STYLES, ...userStyles];
  res.json({ styles: allStyles });
});

stylesRouter.get('/:id', (req, res) => {
  const style = [...CURATED_STYLES, ...userStyles].find(s => s.id === req.params.id);
  if (!style) {
    res.status(404).json({ error: 'Style not found' });
    return;
  }
  res.json(style);
});

stylesRouter.post('/', (req, res) => {
  const { name, description, referenceImage, parameters, tags, visibility } = req.body;

  if (!name || !parameters) {
    res.status(400).json({ error: 'name and parameters are required' });
    return;
  }

  const newStyle: Style = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    description: description || '',
    thumbnail: 'linear-gradient(135deg, #1e1e2e 0%, #4c1d95 50%, #1e1e2e 100%)',
    aiPrompt: `${name} style. ${description || ''}`,
    referenceImageUrl: referenceImage,
    parameters: {
      blurIntensity: parameters.blurIntensity ?? 0,
      pixelation: parameters.pixelation ?? 0,
      colorTemperature: parameters.colorTemperature ?? 0,
      opacity: parameters.opacity ?? 100,
      saturation: parameters.saturation ?? 100,
      contrast: parameters.contrast ?? 100,
    },
    author: 'user',
    tags: tags || [],
    visibility: visibility || 'private',
    createdAt: new Date().toISOString(),
  };

  userStyles.push(newStyle);
  res.status(201).json(newStyle);
});
