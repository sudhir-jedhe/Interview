import React, { useState } from 'react';
import { createRandomRejectingPromise, rejectPromise } from '../utils/promiseUtils';

const PromiseRejectionDemo: React.FC = () => {
  const [randomResult, setRandomResult] = useState<string | null>(null);
  const [alwaysRejectResult, setAlwaysRejectResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const runRandomDemo = async () => {
    setIsLoading(true);
    setRandomResult(null);
    setLogs([]);

    addLog('Starting random rejection demo...');

    try {
      const result = await createRandomRejectingPromise();
      setRandomResult(`Resolved with: ${result}`);
      addLog(`Promise resolved with: ${result}`);
    } catch (error) {
      setRandomResult(`Rejected with: ${error}`);
      addLog(`Promise rejected with: ${error}`);
    }

    setIsLoading(false);
    addLog('Random rejection demo finished');
  };

  const runAlwaysRejectDemo = () => {
    setIsLoading(true);
    setAlwaysRejectResult(null);
    setLogs([]);

    addLog('Starting always reject demo...');

    rejectPromise("This promise is always rejected!")
      .then((value) => {
        // This block will never be executed
        setAlwaysRejectResult(`Unexpectedly resolved with: ${value}`);
        addLog(`Promise unexpectedly resolved with: ${value}`);
      })
      .catch((reason) => {
        setAlwaysRejectResult(`Rejected with: ${reason}`);
        addLog(`Promise rejected with: ${reason}`);
      })
      .finally(() => {
        setIsLoading(false);
        addLog('Always reject demo finished');
      });

    addLog('Promise chain set up, waiting for rejection...');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Rejection Demo</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Random Rejection</h2>
        <button
          onClick={runRandomDemo}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Run Random Demo
        </button>
        <p className="mt-2">{randomResult || 'Not run yet'}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Always Reject</h2>
        <button
          onClick={runAlwaysRejectDemo}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Run Always Reject Demo
        </button>
        <p className="mt-2">{alwaysRejectResult || 'Not run yet'}</p>
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

export default PromiseRejectionDemo;

