import type { FusionRequest, Style, CreateStyleForm } from '../types';

const API = '/api';

export async function startFusion(request: FusionRequest): Promise<{ predictionId: string; status: string }> {
  const res = await fetch(`${API}/fuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Failed to start fusion');
  }
  return res.json();
}

export async function getFusionStatus(predictionId: string): Promise<{
  status: string;
  outputUrl: string | null;
  error: string | null;
}> {
  const res = await fetch(`${API}/fuse/${predictionId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Failed to get status');
  }
  return res.json();
}

export async function fetchStyles(): Promise<Style[]> {
  const res = await fetch(`${API}/styles`);
  if (!res.ok) throw new Error('Failed to fetch styles');
  const data = await res.json();
  return data.styles;
}

export async function createStyle(form: CreateStyleForm): Promise<Style> {
  const res = await fetch(`${API}/styles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Failed to create style');
  }
  return res.json();
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadImage(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
