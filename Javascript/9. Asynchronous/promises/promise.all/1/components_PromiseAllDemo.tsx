import React, { useState } from 'react';
import promiseAll from '../utils/promiseAll';

interface PromiseInput {
  id: number;
  value: string;
  delay: number;
}

const PromiseAllDemo: React.FC = () => {
  const [promiseInputs, setPromiseInputs] = useState<PromiseInput[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPromise = () => {
    setPromiseInputs([
      ...promiseInputs,
      { id: Date.now(), value: '', delay: 1000 },
    ]);
  };

  const updatePromise = (id: number, field: keyof PromiseInput, value: string | number) => {
    setPromiseInputs(
      promiseInputs.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const removePromise = (id: number) => {
    setPromiseInputs(promiseInputs.filter((p) => p.id !== id));
  };

  const runPromiseAll = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    const promises = promiseInputs.map(
      ({ value, delay }) =>
        new Promise<string>((resolve, reject) => {
          setTimeout(() => {
            if (value.toLowerCase() === 'error') {
              reject(new Error(`Promise rejected: ${value}`));
            } else {
              resolve(value);
            }
          }, delay);
        })
    );

    try {
      const result = await promiseAll(promises);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise.all Demo</h1>
      <button
        onClick={addPromise}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Promise
      </button>
      {promiseInputs.map((promise) => (
        <div key={promise.id} className="flex items-center mb-2">
          <input
            type="text"
            value={promise.value}
            onChange={(e) => updatePromise(promise.id, 'value', e.target.value)}
            placeholder="Promise value"
            className="border rounded px-2 py-1 mr-2"
          />
          <input
            type="number"
            value={promise.delay}
            onChange={(e) => updatePromise(promise.id, 'delay', e.target.value)}
            placeholder="Delay (ms)"
            className="border rounded px-2 py-1 mr-2 w-24"
          />
          <button
            onClick={() => removePromise(promise.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={runPromiseAll}
        disabled={isLoading || promiseInputs.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 disabled:bg-gray-400"
      >
        {isLoading ? 'Running...' : 'Run Promise.all'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          <ul className="list-disc list-inside">
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PromiseAllDemo;

