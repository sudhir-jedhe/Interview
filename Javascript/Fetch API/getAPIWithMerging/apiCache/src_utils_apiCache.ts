type APIConfig = Record<string, any>;

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
}

function createGetAPIWithMerging<T>(getAPI: (path: string, config: APIConfig) => Promise<T>) {
  const cache = new Map<string, CacheEntry<T>>();
  const MAX_CACHE = 5;
  const CACHE_TTL = 1000;

  function hashRequest(path: string, config: APIConfig): string {
    const sortedConfig = Object.keys(config)
      .sort()
      .reduce((acc, key) => {
        acc[key] = config[key];
        return acc;
      }, {} as APIConfig);

    return `${path}:${JSON.stringify(sortedConfig)}`;
  }

  async function getAPIWithMerging(path: string, config: APIConfig): Promise<T> {
    const cacheKey = hashRequest(path, config);
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      return cachedEntry.promise;
    }

    if (cachedEntry) {
      cache.delete(cacheKey);
    }

    const promise = getAPI(path, config).catch(error => {
      cache.delete(cacheKey);
      throw error;
    });

    cache.set(cacheKey, { promise, timestamp: Date.now() });

    if (cache.size > MAX_CACHE) {
      const oldestKey = [...cache.keys()].sort((a, b) => 
        (cache.get(a)?.timestamp || 0) - (cache.get(b)?.timestamp || 0)
      )[0];
      cache.delete(oldestKey);
    }

    return promise;
  }

  getAPIWithMerging.clearCache = () => {
    cache.clear();
  };

  return getAPIWithMerging;
}

export default createGetAPIWithMerging;

