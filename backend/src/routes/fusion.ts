import { Router } from 'express';
import { CURATED_STYLES } from '../data/styles.js';
import { createFusionPrediction, getPrediction } from '../services/replicate.js';

export const fusionRouter = Router();

fusionRouter.post('/', async (req, res) => {
  try {
    const { contentImage, styleId, styleImage, intensity = 70 } = req.body;

    if (!contentImage) {
      res.status(400).json({ error: 'contentImage is required' });
      return;
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      res.status(503).json({ error: 'REPLICATE_API_TOKEN not configured. Add it to backend/.env' });
      return;
    }

    const style = styleId ? CURATED_STYLES.find(s => s.id === styleId) : null;
    const stylePrompt = style
      ? `${style.aiPrompt}`
      : 'artistic style transfer, high quality visual transformation';

    const prediction = await createFusionPrediction(
      contentImage,
      styleImage ?? null,
      stylePrompt,
      intensity
    );

    res.json({ predictionId: prediction.id, status: prediction.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Fusion error:', message);
    res.status(500).json({ error: message });
  }
});

fusionRouter.get('/:id', async (req, res) => {
  try {
    const prediction = await getPrediction(req.params.id);

    const outputUrl = Array.isArray(prediction.output)
      ? (prediction.output as string[])[0]
      : (prediction.output as string | null);

    res.json({
      status: prediction.status,
      outputUrl: outputUrl ?? null,
      error: prediction.error ?? null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Get prediction error:', message);
    res.status(500).json({ error: message });
  }
});
