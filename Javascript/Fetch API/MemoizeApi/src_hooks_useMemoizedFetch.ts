import { useState, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function useMemoizedFetch(defaultTtl = 60000) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWithCache = useCallback(async <T>(url: string, method: HttpMethod = 'GET', body?: any, ttl = defaultTtl): Promise<T> => {
    setLoading(true);
    setError(null);
    const now = Date.now();
    const cacheKey = `${method}:${url}`;

    try {
      if (method === 'GET' && cache.has(cacheKey)) {
        const { data, expiry } = cache.get(cacheKey) as CacheEntry<T>;
        if (now < expiry) {
          console.log('Returning cached data for:', url);
          setLoading(false);
          return data;
        }
        console.log('Cache expired for:', url);
        cache.delete(cacheKey);
      }

      console.log(`${method} request to:`, url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok for URL: ${url}`);
      }

      const data = await response.json();
      
      if (method === 'GET') {
        cache.set(cacheKey, { data, expiry: now + ttl });
      } else {
        // Invalidate GET cache for this URL after POST, PUT, DELETE
        cache.delete(`GET:${url}`);
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setLoading(false);
      throw err;
    }
  }, [defaultTtl]);

  const clearCache = useCallback(() => {
    cache.clear();
    console.log('Cache cleared.');
  }, []);

  const removeCache = useCallback((url: string, method: HttpMethod = 'GET') => {
    const cacheKey = `${method}:${url}`;
    if (cache.delete(cacheKey)) {
      console.log(`Cache removed for ${method} ${url}`);
    } else {
      console.log(`No cache found for ${method} ${url}`);
    }
  }, []);

  return { fetchWithCache, clearCache, removeCache, loading, error };
}

