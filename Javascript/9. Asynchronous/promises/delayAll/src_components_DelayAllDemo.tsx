import React, { useState } from 'react';
import { delayAll } from '../utils/delayAll';

const DelayAllDemo: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const createPromise = (resolveTime: number, value: string) => {
    return () => new Promise<string>((resolve) => 
      setTimeout(() => resolve(value), resolveTime)
    );
  };

  const runExample = async (functions: Function[], ms: number) => {
    setLoading(true);
    setResults([]);

    const delayedFunctions = delayAll(functions, ms);
    const startTime = Date.now();

    for (const fn of delayedFunctions) {
      const result = await fn();
      const elapsedTime = Date.now() - startTime;
      setResults(prev => [...prev, `${result} (${elapsedTime}ms)`]);
    }

    setLoading(false);
  };

  const example1 = () => {
    const functions = [
      createPromise(30, "Function 1")
    ];
    runExample(functions, 50);
  };

  const example2 = () => {
    const functions = [
      createPromise(50, "Function 1"),
      createPromise(80, "Function 2")
    ];
    runExample(functions, 70);
  };

  const example3 = () => {
    const functions = [
      createPromise(10, "Function 1"),
      createPromise(20, "Function 2"),
      createPromise(30, "Function 3")
    ];
    runExample(functions, 100);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delay All Demo</h1>
      <div className="space-x-2 mb-4">
        <button
          onClick={example1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Example 1
        </button>
        <button
          onClick={example2}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Example 2
        </button>
        <button
          onClick={example3}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Example 3
        </button>
      </div>
      {loading && <p className="text-gray-600">Running example...</p>}
      <ul className="list-disc pl-5">
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default DelayAllDemo;

