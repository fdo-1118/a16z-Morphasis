import { useState, useCallback, useRef } from 'react';
import type { FusionRequest, FusionStatus, FusionMode } from '../types';
import { startFusion, getFusionStatus } from '../services/api';
import { applyCanvasFusion } from '../services/canvasFusion';

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 300_000;

function isBackendUnavailable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('REPLICATE_API_TOKEN') ||
    msg.includes('Load failed') ||
    msg.includes('fetch')
  );
}

export function useFusion() {
  const [status, setStatus]   = useState<FusionStatus>('idle');
  const [mode, setMode]       = useState<FusionMode>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestRef = useRef<FusionRequest | null>(null);

  const clearTimers = () => {
    if (pollRef.current)    clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const runCanvasFallback = useCallback(async (request: FusionRequest) => {
    if (!request.style) {
      setError('No style selected for local fusion');
      setStatus('error');
      return;
    }
    try {
      const dataUri = await applyCanvasFusion(request.contentImage, request.style, request.intensity);
      setOutputUrl(dataUri);
      setMode('local');
      setStatus('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Local fusion failed');
      setStatus('error');
    }
  }, []);

  const fuse = useCallback(async (request: FusionRequest) => {
    clearTimers();
    lastRequestRef.current = request;
    setStatus('loading');
    setMode(null);
    setOutputUrl(null);
    setError(null);

    let predictionId: string;
    try {
      const result = await startFusion(request);
      predictionId = result.predictionId;

      if (result.status === 'succeeded') {
        const final = await getFusionStatus(predictionId);
        if (final.outputUrl) {
          setOutputUrl(final.outputUrl);
          setMode('ai');
          setStatus('success');
          return;
        }
      }
    } catch (e) {
      if (isBackendUnavailable(e)) {
        await runCanvasFallback(request);
      } else {
        setError(e instanceof Error ? e.message : 'Failed to start fusion');
        setStatus('error');
      }
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const result = await getFusionStatus(predictionId);
        if (result.status === 'succeeded' && result.outputUrl) {
          clearTimers();
          setOutputUrl(result.outputUrl);
          setMode('ai');
          setStatus('success');
        } else if (result.status === 'failed' || result.status === 'canceled') {
          clearTimers();
          setError(result.error ?? 'Fusion failed');
          setStatus('error');
        }
      } catch (e) {
        clearTimers();
        setError(e instanceof Error ? e.message : 'Failed to check status');
        setStatus('error');
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setError('Fusion timed out. Please try again.');
      setStatus('error');
    }, TIMEOUT_MS);
  }, [runCanvasFallback]);

  const retry = useCallback(() => {
    if (lastRequestRef.current) fuse(lastRequestRef.current);
  }, [fuse]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus('idle');
    setMode(null);
    setOutputUrl(null);
    setError(null);
  }, []);

  return { fuse, retry, reset, status, mode, outputUrl, error };
}
