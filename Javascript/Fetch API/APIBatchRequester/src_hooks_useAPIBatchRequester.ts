import { useState, useEffect, useRef } from 'react';
import { APIBatchRequester } from '../utils/APIBatchRequester';

export function useAPIBatchRequester(batchSize: number, interval: number, maxQueueSize = Infinity) {
  const [results, setResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const requesterRef = useRef<APIBatchRequester | null>(null);

  useEffect(() => {
    requesterRef.current = new APIBatchRequester(batchSize, interval, maxQueueSize);
  }, [batchSize, interval, maxQueueSize]);

  const addRequest = (apiCall: () => Promise<any>) => {
    if (requesterRef.current) {
      setIsProcessing(true);
      requesterRef.current.addRequest(async () => {
        const result = await apiCall();
        setResults(prev => [...prev, result]);
        return result;
      });
    }
  };

  return { addRequest, results, isProcessing };
}

