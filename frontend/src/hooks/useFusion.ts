import { useState, useCallback, useRef } from 'react';
import type { FusionRequest, FusionStatus } from '../types';
import { startFusion, getFusionStatus } from '../services/api';

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 300_000;

export function useFusion() {
  const [status, setStatus] = useState<FusionStatus>('idle');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestRef = useRef<FusionRequest | null>(null);

  const clearTimers = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const fuse = useCallback(async (request: FusionRequest) => {
    clearTimers();
    lastRequestRef.current = request;
    setStatus('loading');
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
          setStatus('success');
          return;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start fusion');
      setStatus('error');
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const result = await getFusionStatus(predictionId);

        if (result.status === 'succeeded' && result.outputUrl) {
          clearTimers();
          setOutputUrl(result.outputUrl);
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
  }, []);

  const retry = useCallback(() => {
    if (lastRequestRef.current) {
      fuse(lastRequestRef.current);
    }
  }, [fuse]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus('idle');
    setOutputUrl(null);
    setError(null);
  }, []);

  return { fuse, retry, reset, status, outputUrl, error };
}
