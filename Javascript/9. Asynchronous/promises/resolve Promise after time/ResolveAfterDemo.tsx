import React, { useState, useEffect } from 'react';

// The resolveAfter function as provided
const resolveAfter = <T,>(value: T, delay: number): Promise<T> =>
  new Promise(resolve => {
    setTimeout(() => resolve(value), delay);
  });

const ResolveAfterDemo: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);

  // Helper function to log output
  const log = (message: string) => {
    setOutput(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  // Function to demonstrate basic usage
  const basicDemo = async () => {
    log('Starting basic demo...');
    const result = await resolveAfter('Hello', 1000);
    log(`Resolved value: ${result}`);
  };

  // Function to demonstrate chaining
  const chainingDemo = async () => {
    log('Starting chaining demo...');
    const result = await resolveAfter('Step 1', 1000)
      .then(value => {
        log(`Completed: ${value}`);
        return resolveAfter('Step 2', 500);
      })
      .then(value => {
        log(`Completed: ${value}`);
        return resolveAfter('Step 3', 800);
      });
    log(`Final result: ${result}`);
  };

  // Function to demonstrate parallel execution
  const parallelDemo = async () => {
    log('Starting parallel demo...');
    const promises = [
      resolveAfter('Fast', 500),
      resolveAfter('Medium', 1000),
      resolveAfter('Slow', 1500)
    ];
    const results = await Promise.all(promises);
    log(`All resolved: ${results.join(', ')}`);
  };

  // Function to demonstrate error handling
  const errorDemo = async () => {
    log('Starting error demo...');
    try {
      await resolveAfter('Success', 1000);
      throw new Error('Simulated error');
    } catch (error) {
      log(`Caught error: ${error.message}`);
    }
  };

  // Run all demos
  const runAllDemos = async () => {
    setOutput([]);
    await basicDemo();
    await chainingDemo();
    await parallelDemo();
    await errorDemo();
    log('All demos completed');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">resolveAfter Demonstration</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={runAllDemos}
      >
        Run All Demos
      </button>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Output:</h2>
        {output.map((line, index) => (
          <pre key={index} className="text-sm">{line}</pre>
        ))}
      </div>
    </div>
  );
};

export default ResolveAfterDemo;

