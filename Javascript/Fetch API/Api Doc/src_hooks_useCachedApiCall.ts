import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  value: T;
  expiryTime: number;
}

const generateKey = (path: string, config: Record<string, any>): string => {
  const sortedConfig = Object.keys(config)
    .sort()
    .reduce((acc, key) => {
      acc[key] = config[key];
      return acc;
    }, {} as Record<string, any>);
  return `${path}:${JSON.stringify(sortedConfig)}`;
};

const makeApiCall = async <T>(path: string, config: RequestInit): Promise<T> => {
  const response = await fetch(path, config);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

export const useCachedApiCall = (cacheTime: number) => {
  const [cache] = useState<Map<string, CacheEntry<any>>>(new Map());

  const cachedApiCall = useCallback(async <T>(path: string, config: RequestInit = {}): Promise<T> => {
    const key = generateKey(path, config);
    const cachedEntry = cache.get(key);

    if (cachedEntry && Date.now() < cachedEntry.expiryTime) {
      console.log("Returning cached response");
      return cachedEntry.value;
    }

    console.log("Making a new API call...");
    try {
      const value = await makeApiCall<T>(path, config);
      cache.set(key, { value, expiryTime: Date.now() + cacheTime });
      return value;
    } catch (error) {
      console.error("Error caching the API response:", error);
      throw error;
    }
  }, [cache, cacheTime]);

  return cachedApiCall;
};

