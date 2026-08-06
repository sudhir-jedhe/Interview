import React from 'react';
import { useTrendingStocks } from '../hooks/useTrendingStocks';

interface TrendingStocksProps {
  count: number;
}

const TrendingStocks: React.FC<TrendingStocksProps> = ({ count }) => {
  const { stocks, loading, error } = useTrendingStocks(count);

  if (loading) {
    return <div className="text-center p-4">Loading trending stocks...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Top {count} Trending Stocks</h2>
      {stocks.length === 0 ? (
        <p>No trending stocks available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {stocks.map((stock) => (
            <li key={stock.symbol} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{stock.symbol}</span>
                <span className="text-green-600">${stock.price.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Market Cap: ${stock.marketCap.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingStocks;

