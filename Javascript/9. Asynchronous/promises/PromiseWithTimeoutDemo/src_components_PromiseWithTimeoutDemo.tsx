import React, { useState } from 'react';
import { promiseWithTimeout, createDelayedPromise } from '../utils/promiseUtils';

const PromiseWithTimeoutDemo: React.FC = () => {
  const [promiseDelay, setPromiseDelay] = useState(1500);
  const [timeout, setTimeout] = useState(2000);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    const delayedPromise = createDelayedPromise(promiseDelay);

    try {
      const value = await promiseWithTimeout(delayedPromise, timeout);
      setResult(`Success: ${value}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise With Timeout Demo</h1>
      <div className="mb-4">
        <label className="block mb-2">
          Promise Delay (ms):
          <input
            type="number"
            value={promiseDelay}
            onChange={(e) => setPromiseDelay(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Timeout (ms):
          <input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Testing...' : 'Test Promise'}
      </button>
      {result && (
        <div className={`mt-4 p-2 rounded ${result.startsWith('Success') ? 'bg-green-100' : 'bg-red-100'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default PromiseWithTimeoutDemo;

