import React, { useState } from 'react';
import { promiseMerge, createDelayedPromise } from '../utils/promiseUtils';

const PromiseMergeDemo: React.FC = () => {
  const [customMergeResult, setCustomMergeResult] = useState<string | null>(null);
  const [promiseAllResult, setPromiseAllResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDemo = async () => {
    setIsLoading(true);
    setCustomMergeResult(null);
    setPromiseAllResult(null);

    const promises = [
      createDelayedPromise('First', 1000),
      createDelayedPromise('Second', 500),
      createDelayedPromise('Third', 1500),
    ];

    try {
      const customMergeStart = performance.now();
      const customResult = await promiseMerge(promises);
      const customMergeEnd = performance.now();
      setCustomMergeResult(`Custom Merge: ${JSON.stringify(customResult)} (${(customMergeEnd - customMergeStart).toFixed(2)}ms)`);

      const promiseAllStart = performance.now();
      const promiseAllResult = await Promise.all(promises);
      const promiseAllEnd = performance.now();
      setPromiseAllResult(`Promise.all: ${JSON.stringify(promiseAllResult)} (${(promiseAllEnd - promiseAllStart).toFixed(2)}ms)`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Merge Demo</h1>
      <button
        onClick={runDemo}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isLoading ? 'Running...' : 'Run Demo'}
      </button>
      {customMergeResult && (
        <div className="mb-2 p-2 bg-green-100 rounded">
          {customMergeResult}
        </div>
      )}
      {promiseAllResult && (
        <div className="mb-2 p-2 bg-blue-100 rounded">
          {promiseAllResult}
        </div>
      )}
    </div>
  );
};

export default PromiseMergeDemo;

