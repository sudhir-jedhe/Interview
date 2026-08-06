import React, { useState, useCallback } from 'react';
import { debouncePromise } from '../utils/debounce';

const DebouncePromiseDemo: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const mockApiCall = (arg: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`API called with: ${arg}`);
      }, 1000);
    });
  };

  const debouncedApiCall = useCallback(
    debouncePromise(mockApiCall, 500),
    []
  );

  const handleClick = async (value: string) => {
    setLoading(true);
    try {
      const result = await debouncedApiCall(value);
      setResults((prev) => [...prev, result]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debounce Promise Demo</h1>
      <div className="space-x-2 mb-4">
        <button
          onClick={() => handleClick('A')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Call A
        </button>
        <button
          onClick={() => handleClick('B')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Call B
        </button>
        <button
          onClick={() => handleClick('C')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Call C
        </button>
      </div>
      {loading && <p className="text-gray-600">Loading...</p>}
      <ul className="list-disc pl-5">
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default DebouncePromiseDemo;

