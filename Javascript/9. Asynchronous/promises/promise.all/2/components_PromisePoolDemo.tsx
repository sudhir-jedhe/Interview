import React, { useState } from 'react';
import { promisePool, allAsync, allReduce, allParallel } from '../utils/promiseUtils';

interface PromiseInput {
  id: number;
  value: string;
  delay: number;
}

interface Result {
  name: string;
  individual: number[];
  total: number;
}

const PromisePoolDemo: React.FC = () => {
  const [numFunctions, setNumFunctions] = useState(5);
  const [poolLimit, setPoolLimit] = useState(2);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    const functions = Array(numFunctions).fill(0).map((_, i) => 
      () => new Promise<void>(res => setTimeout(res, Math.random() * 1000 + 500))
    );

    const promises = functions.map(() => new Promise<number>(res => {
      const delay = Math.random() * 1000 + 500;
      setTimeout(() => res(delay), delay);
    }));

    try {
      const [poolResults, poolTotal] = await promisePool(functions, poolLimit);
      const [asyncResults, asyncTotal] = await allAsync(promises);
      const [reduceResults, reduceTotal] = await allReduce(promises);
      const [parallelResults, parallelTotal] = await allParallel(promises);

      setResults([
        { name: 'Promise Pool', individual: poolResults, total: poolTotal },
        { name: 'All Async', individual: asyncResults, total: asyncTotal },
        { name: 'All Reduce', individual: reduceResults, total: reduceTotal },
        { name: 'All Parallel', individual: parallelResults, total: parallelTotal },
      ]);
    } catch (error) {
      setError('Error executing promises: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Implementations Comparison</h1>
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
          {isLoading ? 'Running...' : 'Run Comparison'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result) => (
              <div key={result.name} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">{result.name}</h3>
                <p>Total execution time: {result.total.toFixed(2)} ms</p>
                <p>Individual promise times (ms):</p>
                <ul className="list-disc list-inside">
                  {result.individual.map((time, index) => (
                    <li key={index}>{time.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromisePoolDemo;

