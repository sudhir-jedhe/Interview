import React, { useState } from 'react';
import { customAllSettled, createPromise } from '../utils/promiseUtils';

const PromiseAllSettledDemo: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runDemo = async () => {
    setLoading(true);
    const promises = [
      createPromise('Quick success', 100),
      createPromise('Slow failure', 300, true),
      createPromise('Slow success', 200),
      'Not a promise',
      createPromise('Quick failure', 50, true)
    ];

    try {
      const builtInResults = await Promise.allSettled(promises);
      const customResults = await customAllSettled(promises);

      setResults(JSON.stringify({
        builtIn: builtInResults,
        custom: customResults
      }, null, 2));
    } catch (error) {
      setResults(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise.allSettled() Demo</h1>
      <button
        onClick={runDemo}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'Running...' : 'Run Demo'}
      </button>
      {results && (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {results}
        </pre>
      )}
    </div>
  );
};

export default PromiseAllSettledDemo;

