import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const MODEL = (process.env.REPLICATE_MODEL ?? 'stability-ai/sdxl') as `${string}/${string}`;

export async function createFusionPrediction(
  contentImageDataUri: string,
  styleImageDataUri: string | null,
  stylePrompt: string,
  intensity: number
) {
  const strength = Math.max(0.1, Math.min(1.0, intensity / 100));

  const input: Record<string, unknown> = {
    prompt: `${stylePrompt}. Ultra high quality, detailed, professional photography.`,
    negative_prompt: 'low quality, blurry, distorted, watermark, text, ugly, bad anatomy',
    image: contentImageDataUri,
    strength,
    num_outputs: 1,
    guidance_scale: 7.5,
    num_inference_steps: 30,
  };

  if (styleImageDataUri) {
    input.style_image = styleImageDataUri;
  }

  const prediction = await replicate.predictions.create({
    model: MODEL,
    input,
  });

  return prediction;
}

export async function getPrediction(id: string) {
  return replicate.predictions.get(id);
}
