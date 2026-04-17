import type { Style } from '../types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

interface StyleEffect {
  overlayColor: [number, number, number];
  overlayOpacity: number;
  blendMode: GlobalCompositeOperation;
  grainAmount: number;
  vignetteStrength: number;
  glitchSlices: number;
}

const STYLE_EFFECTS: Record<string, StyleEffect> = {
  'frosted-glass': { overlayColor: [180, 220, 255], overlayOpacity: 0.3,  blendMode: 'screen',     grainAmount: 0.01,  vignetteStrength: 0.3, glitchSlices: 0 },
  'film-grain':    { overlayColor: [180, 130,  60], overlayOpacity: 0.22, blendMode: 'multiply',   grainAmount: 0.14,  vignetteStrength: 0.7, glitchSlices: 0 },
  'glitch-art':    { overlayColor: [124,  58, 237], overlayOpacity: 0.18, blendMode: 'hard-light', grainAmount: 0.025, vignetteStrength: 0.0, glitchSlices: 7 },
  'watercolor':    { overlayColor: [220, 200, 255], overlayOpacity: 0.18, blendMode: 'soft-light', grainAmount: 0.005, vignetteStrength: 0.2, glitchSlices: 0 },
  'neon-city':     { overlayColor: [ 76,  29, 149], overlayOpacity: 0.45, blendMode: 'screen',     grainAmount: 0.02,  vignetteStrength: 0.8, glitchSlices: 0 },
  'matte-pastel':  { overlayColor: [253, 164, 175], overlayOpacity: 0.22, blendMode: 'soft-light', grainAmount: 0.0,   vignetteStrength: 0.15, glitchSlices: 0 },
  'pixel-art':     { overlayColor: [ 22, 163,  74], overlayOpacity: 0.06, blendMode: 'multiply',   grainAmount: 0.0,   vignetteStrength: 0.0, glitchSlices: 0 },
  'infrared':      { overlayColor: [239,  68,  68], overlayOpacity: 0.25, blendMode: 'overlay',    grainAmount: 0.02,  vignetteStrength: 0.45, glitchSlices: 0 },
  'oil-paint':     { overlayColor: [150,  90,  40], overlayOpacity: 0.12, blendMode: 'multiply',   grainAmount: 0.01,  vignetteStrength: 0.55, glitchSlices: 0 },
  'chrome':        { overlayColor: [200, 210, 220], overlayOpacity: 0.18, blendMode: 'overlay',    grainAmount: 0.005, vignetteStrength: 0.35, glitchSlices: 0 },
};

const DEFAULT_EFFECT: StyleEffect = {
  overlayColor: [180, 180, 180], overlayOpacity: 0.15, blendMode: 'overlay',
  grainAmount: 0.01, vignetteStrength: 0.3, glitchSlices: 0,
};

export async function applyCanvasFusion(
  contentDataUri: string,
  style: Style,
  intensity: number
): Promise<string> {
  const img = await loadImage(contentDataUri);
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const { blurIntensity, pixelation, colorTemperature, saturation, contrast } = style.parameters;
  const t = intensity / 100;
  const fx = STYLE_EFFECTS[style.id] ?? DEFAULT_EFFECT;

  // 1. Pixelation (scale down → scale up with no smoothing)
  const pixelSize = Math.max(1, Math.floor(pixelation * t * 0.3));
  if (pixelSize > 1) {
    const sw = Math.max(1, Math.floor(W / pixelSize));
    const sh = Math.max(1, Math.floor(H / pixelSize));
    const tmp = document.createElement('canvas');
    tmp.width = sw; tmp.height = sh;
    const tctx = tmp.getContext('2d')!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(canvas, 0, 0, sw, sh);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(tmp, 0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
  }

  // 2. Blur (CSS filter on offscreen canvas)
  const blurPx = blurIntensity * t * 0.13;
  if (blurPx > 0.4) {
    const tmp = document.createElement('canvas');
    tmp.width = W; tmp.height = H;
    const tctx = tmp.getContext('2d')!;
    tctx.filter = `blur(${blurPx}px)`;
    tctx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(tmp, 0, 0);
  }

  // 3. Per-pixel: color temperature, saturation, contrast, grain
  const imageData = ctx.getImageData(0, 0, W, H);
  const d = imageData.data;
  const satMult  = 1 + (saturation / 100 - 1) * t;
  const contMult = 1 + (contrast  / 100 - 1) * t;
  const tempDelta = colorTemperature * t * 0.9;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];

    // Color temperature (shift R warm, B cool)
    r = clamp(r + tempDelta);
    b = clamp(b - tempDelta * 0.65);

    // Saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = clamp(gray + (r - gray) * satMult);
    g = clamp(gray + (g - gray) * satMult);
    b = clamp(gray + (b - gray) * satMult);

    // Contrast
    r = clamp(((r / 255 - 0.5) * contMult + 0.5) * 255);
    g = clamp(((g / 255 - 0.5) * contMult + 0.5) * 255);
    b = clamp(((b / 255 - 0.5) * contMult + 0.5) * 255);

    // Film grain
    if (fx.grainAmount > 0) {
      const noise = (Math.random() - 0.5) * 255 * fx.grainAmount * t;
      r = clamp(r + noise);
      g = clamp(g + noise);
      b = clamp(b + noise);
    }

    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  ctx.putImageData(imageData, 0, 0);

  // 4. Style color overlay
  const [or, og, ob] = fx.overlayColor;
  ctx.globalCompositeOperation = fx.blendMode;
  ctx.globalAlpha = fx.overlayOpacity * t;
  ctx.fillStyle = `rgb(${or},${og},${ob})`;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // 5. Vignette
  if (fx.vignetteStrength > 0) {
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.28, W / 2, H / 2, W * 0.78);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${(fx.vignetteStrength * t).toFixed(2)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // 6. Glitch slices (displace random horizontal bands)
  if (fx.glitchSlices > 0 && t > 0) {
    const snapshot = ctx.getImageData(0, 0, W, H);
    const numSlices = Math.ceil(fx.glitchSlices * t);
    for (let s = 0; s < numSlices; s++) {
      const sy = Math.floor(Math.random() * H);
      const sh2 = Math.max(2, Math.floor(Math.random() * 18 * t));
      const dx = (Math.random() - 0.5) * 60 * t;
      // Draw that band shifted
      const sliceData = snapshot.data;
      const rowW = W * 4;
      for (let row = sy; row < Math.min(sy + sh2, H); row++) {
        const srcRow = row * rowW;
        const dstY = row;
        const dstX = Math.round(dx);
        for (let col = 0; col < W; col++) {
          const srcCol = col;
          const dstCol = srcCol + dstX;
          if (dstCol >= 0 && dstCol < W) {
            const si = srcRow + srcCol * 4;
            const di = dstY * rowW + dstCol * 4;
            d[di] = sliceData[si];
            d[di + 1] = sliceData[si + 1];
            d[di + 2] = sliceData[si + 2];
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL('image/png');
}
