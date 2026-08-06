import { useState, useEffect, useRef } from 'react';
import { DebouncedRateLimiter } from '../utils/DebouncedRateLimiter';

export function useDebouncedRateLimiter(maxRequests: number, interval: number) {
  const [results, setResults] = useState<any[]>([]);
  const [queueLength, setQueueLength] = useState(0);
  const limiterRef = useRef<DebouncedRateLimiter | null>(null);

  useEffect(() => {
    limiterRef.current = new DebouncedRateLimiter(maxRequests, interval);
  }, [maxRequests, interval]);

  const addRequest = (apiCall: () => Promise<any>) => {
    if (limiterRef.current) {
      setQueueLength(prev => prev + 1);
      limiterRef.current.addRequest(async () => {
        const result = await apiCall();
        setResults(prev => [...prev, result]);
        setQueueLength(prev => prev - 1);
        return result;
      });
    }
  };

  return { addRequest, results, queueLength };
}

