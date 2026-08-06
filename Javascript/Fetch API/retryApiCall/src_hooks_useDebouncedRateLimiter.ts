import { useState, useCallback, useRef } from 'react';
import { DebouncedRateLimiter } from '../utils/DebouncedRateLimiter';

export function useDebouncedRateLimiter(maxRequests: number, interval: number, maxRetries: number) {
  const [results, setResults] = useState<any[]>([]);
  const [queueLength, setQueueLength] = useState(0);
  const limiterRef = useRef<DebouncedRateLimiter | null>(null);

  const updateProgress = useCallback((progress: number) => {
    setQueueLength(progress);
  }, []);

  if (!limiterRef.current) {
    limiterRef.current = new DebouncedRateLimiter(maxRequests, interval, maxRetries, updateProgress);
  }

  const addRequest = useCallback((apiCall: () => Promise<any>) => {
    if (limiterRef.current) {
      limiterRef.current.addRequest(async () => {
        const result = await apiCall();
        setResults(prev => [...prev, result]);
        return result;
      });
    }
  }, []);

  return { addRequest, results, queueLength };
}

