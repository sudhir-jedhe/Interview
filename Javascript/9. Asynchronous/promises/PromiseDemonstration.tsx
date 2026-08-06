import React, { useState, useEffect } from 'react';

// Simulated API call
const fetchData = (id: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id % 2 === 0) {
        resolve(`Data for ID ${id}`);
      } else {
        reject(`Error: Could not fetch data for ID ${id}`);
      }
    }, 1000);
  });
};

const PromiseDemonstration: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    demonstratePromises();
  }, []);

  const demonstratePromises = async () => {
    setLoading(true);
    setResult('');

    // Basic Promise usage
    try {
      const data = await fetchData(2);
      setResult(prev => prev + `Basic Promise: ${data}\n`);
    } catch (error) {
      setResult(prev => prev + `Basic Promise Error: ${error}\n`);
    }

    // Promise chaining
    fetchData(4)
      .then(data => {
        setResult(prev => prev + `Chain step 1: ${data}\n`);
        return fetchData(6);
      })
      .then(data => {
        setResult(prev => prev + `Chain step 2: ${data}\n`);
      })
      .catch(error => {
        setResult(prev => prev + `Chain Error: ${error}\n`);
      });

    // Promise.all
    const promises = [fetchData(8), fetchData(10), fetchData(12)];
    try {
      const results = await Promise.all(promises);
      setResult(prev => prev + `Promise.all: ${results.join(', ')}\n`);
    } catch (error) {
      setResult(prev => prev + `Promise.all Error: ${error}\n`);
    }

    // Demonstrating a rejected promise
    try {
      await fetchData(3);
    } catch (error) {
      setResult(prev => prev + `Rejected Promise: ${error}\n`);
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Demonstration</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded">{result}</pre>
      )}
      <button 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={demonstratePromises}
      >
        Run Demonstration
      </button>
    </div>
  );
};

export default PromiseDemonstration;

