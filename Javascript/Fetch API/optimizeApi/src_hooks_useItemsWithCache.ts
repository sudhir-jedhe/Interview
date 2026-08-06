import { useState, useEffect, useCallback } from 'react';
import { fetchItems } from '../utils/mockApi';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface CacheEntry {
  items: Item[];
  totalPages: number;
  timestamp: number;
}

const CACHE_DURATION = 60000; // 1 minute

export const useItemsWithCache = (initialPage: number, limit: number) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const fetchItemsWithCache = useCallback(async (currentPage: number) => {
    const cacheKey = `items_${currentPage}_${limit}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { items, totalPages, timestamp }: CacheEntry = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setItems(items);
        setTotalPages(totalPages);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const { items, totalPages } = await fetchItems(currentPage, limit);
      setItems(items);
      setTotalPages(totalPages);

      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({
        items,
        totalPages,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchItemsWithCache(page);
  }, [page, fetchItemsWithCache]);

  return { items, loading, error, page, setPage, totalPages };
};

