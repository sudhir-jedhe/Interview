import { useState, useEffect, useRef } from 'react';
import { RateLimiter } from '../utils/RateLimiter';

export function useRateLimiter(maxRequests: number, interval: number) {
  const [results, setResults] = useState<any[]>([]);
  const [queueLength, setQueueLength] = useState(0);
  const limiterRef = useRef<RateLimiter | null>(null);

  useEffect(() => {
    limiterRef.current = new RateLimiter(maxRequests, interval);
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

