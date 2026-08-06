import React, { useState, useEffect } from 'react';
import { fetchPaginatedData } from '../utils/fetchPaginatedData';

type Item = {
  id: string;
  name: string;
};

const PaginatedList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const newItems = await fetchPaginatedData(amount);
      setItems(prevItems => [...prevItems, ...newItems]);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(10);
  }, []);

  const handleLoadMore = () => {
    loadItems(10);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paginated Item List</h1>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="bg-white p-2 rounded shadow">
            {item.name}
          </li>
        ))}
      </ul>
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {!loading && !error && items.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default PaginatedList;

