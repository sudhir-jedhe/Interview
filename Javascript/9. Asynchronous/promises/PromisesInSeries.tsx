import React, { useState } from 'react';

const PromisesInSeries: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);

  // Function to run promises in series
  const runPromisesInSeries = (ps: (() => Promise<any>)[]) =>
    ps.reduce((p, next) => p.then(next), Promise.resolve());

  // Helper function to create a delay promise
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to log output
  const log = (message: string) => {
    setOutput(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  // Example promises
  const promise1 = () => delay(1000).then(() => log('Promise 1 completed'));
  const promise2 = () => delay(2000).then(() => log('Promise 2 completed'));
  const promise3 = () => delay(1500).then(() => log('Promise 3 completed'));

  // Function to demonstrate running promises in series
  const runDemo = async () => {
    setOutput([]);
    log('Starting demo...');

    const startTime = Date.now();

    await runPromisesInSeries([promise1, promise2, promise3]);

    const endTime = Date.now();
    log(`All promises completed in ${endTime - startTime}ms`);
  };

  // Function to demonstrate running promises in parallel (for comparison)
  const runParallelDemo = async () => {
    setOutput([]);
    log('Starting parallel demo...');

    const startTime = Date.now();

    await Promise.all([promise1(), promise2(), promise3()]);

    const endTime = Date.now();
    log(`All promises completed in parallel in ${endTime - startTime}ms`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Promises in Series Demonstration</h1>
      <div className="space-x-4 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={runDemo}
        >
          Run Promises in Series
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={runParallelDemo}
        >
          Run Promises in Parallel
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Output:</h2>
        {output.map((line, index) => (
          <pre key={index} className="text-sm">{line}</pre>
        ))}
      </div>
    </div>
  );
};

export default PromisesInSeries;

