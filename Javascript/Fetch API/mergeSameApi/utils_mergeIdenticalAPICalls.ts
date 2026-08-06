export function mergeIdenticalAPICalls<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  ttl: number = 60000,
  maxSize: number = 50
) {
  const cache = new Map<string, { result: T; expiry: number }>();

  return async function (...args: any[]): Promise<T> {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const { result, expiry } = cache.get(key)!;
      if (now < expiry) {
        console.log(`Returning cached result for key: ${key}`);
        return result;
      }
      cache.delete(key);
    }

    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    console.log(`Making API call for key: ${key}`);
    const result = await apiFunction(...args);
    cache.set(key, { result, expiry: now + ttl });
    return result;
  };
}

