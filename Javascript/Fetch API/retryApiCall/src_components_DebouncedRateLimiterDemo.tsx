import React, { useState } from 'react';
import { useDebouncedRateLimiter } from '../hooks/useDebouncedRateLimiter';

const DebouncedRateLimiterDemo: React.FC = () => {
  const [postId, setPostId] = useState(1);
  const { addRequest, results, queueLength } = useDebouncedRateLimiter(5, 3000, 3);

  const makeApiCall = (id: number) => {
    return async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      if (!response.ok) throw new Error(`Request failed for ID: ${id}`);
      return response.json();
    };
  };

  const handleAddRequest = () => {
    addRequest(makeApiCall(postId));
    setPostId(prev => prev + 1);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Debounced Rate Limiter Demo</h1>
      <button
        onClick={handleAddRequest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Request
      </button>
      <p className="mb-2">Requests in queue: {queueLength}</p>
      <h2 className="text-xl font-semibold mb-2">Results:</h2>
      <ul className="list-disc pl-5">
        {results.map((result, index) => (
          <li key={index} className="mb-2">
            <strong>Post {result.id}:</strong> {result.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebouncedRateLimiterDemo;

