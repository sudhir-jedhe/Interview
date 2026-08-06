import React, { useState } from 'react';
import { useAPIBatchRequester } from '../hooks/useAPIBatchRequester';

const APIBatchRequesterDemo: React.FC = () => {
  const [requestId, setRequestId] = useState(1);
  const { addRequest, results, isProcessing } = useAPIBatchRequester(3, 2000, 10);

  const makeApiCall = (id: number) => {
    return async () => {
      console.log(`Making API call for ID: ${id}`);
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      if (!response.ok) throw new Error(`Request for ID ${id} failed`);
      return response.json();
    };
  };

  const handleAddRequest = () => {
    addRequest(makeApiCall(requestId));
    setRequestId(prev => prev + 1);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">API Batch Requester Demo</h1>
      <button
        onClick={handleAddRequest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Request
      </button>
      {isProcessing && <p className="text-gray-600 mb-2">Processing requests...</p>}
      <h2 className="text-xl font-semibold mb-2">Results:</h2>
      <ul className="list-disc pl-5">
        {results.map((result, index) => (
          <li key={index} className="mb-2">
            <strong>Todo {result.id}:</strong> {result.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default APIBatchRequesterDemo;

