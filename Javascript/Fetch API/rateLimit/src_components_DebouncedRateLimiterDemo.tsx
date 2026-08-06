import React, { useState } from 'react';
import { useDebouncedRateLimiter } from '../hooks/useDebouncedRateLimiter';
import { makeApiCall } from '../utils/mockApi';

const DebouncedRateLimiterDemo: React.FC = () => {
  const [requestId, setRequestId] = useState(1);
  const { addRequest, results, queueLength } = useDebouncedRateLimiter(5, 3000);

  const handleAddRequest = () => {
    addRequest(makeApiCall(requestId));
    setRequestId(prev => prev + 1);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Debounced Rate Limiter Demo</h2>
      <button
        onClick={handleAddRequest}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Request
      </button>
      <p className="mb-2">Requests in queue: {queueLength}</p>
      <h3 className="text-xl font-semibold mb-2">Results:</h3>
      <ul className="list-disc pl-5">
        {results.map((result, index) => (
          <li key={index} className="mb-2">
            ID: {result.id}, Data: {result.data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebouncedRateLimiterDemo;

