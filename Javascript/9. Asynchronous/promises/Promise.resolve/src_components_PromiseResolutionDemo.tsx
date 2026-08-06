import React, { useState, useEffect } from 'react';
import { createDelayedPromise } from '../utils/promiseUtils';

const PromiseResolutionDemo: React.FC = () => {
  const [thenResult, setThenResult] = useState<number | null>(null);
  const [awaitResult, setAwaitResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const runDemo = () => {
    setIsLoading(true);
    setThenResult(null);
    setAwaitResult(null);
    setLogs([]);

    addLog('Starting demo...');

    const promise = createDelayedPromise(2, 2000);

    // Using Promise.then()
    promise.then(val => {
      setThenResult(val);
      addLog(`Promise.then() resolved with: ${val}`);
    });

    // Using async/await
    const doWork = async () => {
      const res = await promise;
      setAwaitResult(res);
      addLog(`async/await resolved with: ${res}`);
      setIsLoading(false);
    };

    doWork();

    addLog('Finished setting up promises');
  };

  useEffect(() => {
    if (thenResult !== null && awaitResult !== null) {
      addLog('Both methods have resolved');
    }
  }, [thenResult, awaitResult]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Resolution Demo</h1>
      <button
        onClick={runDemo}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isLoading ? 'Running...' : 'Run Demo'}
      </button>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Results:</h2>
        <p>Promise.then() result: {thenResult !== null ? thenResult : 'Pending...'}</p>
        <p>async/await result: {awaitResult !== null ? awaitResult : 'Pending...'}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Execution Log:</h2>
        <ul className="list-disc pl-5">
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PromiseResolutionDemo;

