import React, { useState } from 'react';
import { promisePool } from '../utils/promisePool';

const PromisePoolDemo: React.FC = () => {
  const [numFunctions, setNumFunctions] = useState(5);
  const [poolLimit, setPoolLimit] = useState(2);
  const [results, setResults] = useState<{ individual: number[], total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);

    const functions = Array(numFunctions).fill(0).map((_, i) => 
      () => new Promise<void>(res => setTimeout(res, Math.random() * 1000 + 500))
    );

    try {
      const [individual, total] = await promisePool(functions, poolLimit);
      setResults({ individual, total });
    } catch (error) {
      console.error('Error executing promise pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Pool Demo</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="numFunctions" className="block mb-1">Number of Functions:</label>
          <input
            type="number"
            id="numFunctions"
            value={numFunctions}
            onChange={(e) => setNumFunctions(Number(e.target.value))}
            min="1"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="poolLimit" className="block mb-1">Pool Limit:</label>
          <input
            type="number"
            id="poolLimit"
            value={poolLimit}
            onChange={(e) => setPoolLimit(Number(e.target.value))}
            min="1"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Promise Pool'}
        </button>
      </form>

      {results && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <p>Individual promise resolution times (ms):</p>
          <ul className="list-disc list-inside mb-2">
            {results.individual.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
          <p>Total execution time: {results.total} ms</p>
        </div>
      )}
    </div>
  );
};

export default PromisePoolDemo;

