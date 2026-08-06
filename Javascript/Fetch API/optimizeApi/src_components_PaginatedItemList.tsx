import React from 'react';
import { useItemsWithCache } from '../hooks/useItemsWithCache';

const PaginatedItemList: React.FC = () => {
  const { items, loading, error, page, setPage, totalPages } = useItemsWithCache(1, 10);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paginated Item List</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="border p-4 rounded-md">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginatedItemList;

