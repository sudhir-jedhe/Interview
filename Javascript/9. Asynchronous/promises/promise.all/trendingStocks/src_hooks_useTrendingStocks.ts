import { useState, useEffect } from 'react';

// Define the structure of a stock
interface Stock {
  symbol: string;
  marketCap: number;
  price: number;
}

// Define API endpoints for different types of stock information
const SYMBOLS_API_BASE_URL = 'api_1';
const MARKET_CAPS_API_BASE_URL = 'api_2';
const PRICES_API_BASE_URL = 'api_3';

async function trendingStocks(n: number): Promise<Stock[]> {
  try {
    // Fetch data from each API endpoint asynchronously
    const [symbolsResponse, marketCapsResponse, pricesResponse] = await Promise.all([
      fetch(SYMBOLS_API_BASE_URL),
      fetch(MARKET_CAPS_API_BASE_URL),
      fetch(PRICES_API_BASE_URL)
    ]);

    // Check if all responses are successful
    if (!symbolsResponse.ok || !marketCapsResponse.ok || !pricesResponse.ok) {
      throw new Error('Failed to fetch data from one or more API endpoints');
    }

    // Parse response data
    const symbolsData: string[] = await symbolsResponse.json();
    const marketCapsData: Record<string, number> = await marketCapsResponse.json();
    const pricesData: Record<string, number> = await pricesResponse.json();

    // Process data to determine trending stocks
    const trendingStocks = symbolsData.map(symbol => ({
      symbol,
      marketCap: marketCapsData[symbol],
      price: pricesData[symbol]
    })).sort((a, b) => b.marketCap - a.marketCap).slice(0, n);

    return trendingStocks;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array if there's an error
  }
}

export function useTrendingStocks(n: number) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingStocks() {
      try {
        setLoading(true);
        const result = await trendingStocks(n);
        setStocks(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch trending stocks');
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingStocks();
  }, [n]);

  return { stocks, loading, error };
}

