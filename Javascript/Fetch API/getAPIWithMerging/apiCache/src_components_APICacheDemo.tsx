import React, { useState, useEffect } from 'react';
import createGetAPIWithMerging from '../utils/apiCache';

// Mock API function with artificial delay
const mockGetAPI = <T extends unknown>(path: string, config: Record<string, any>): Promise<T> => {
  console.log(`API Call: ${path}`, config);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ path, config, data: 'Mocked response', timestamp: new Date().toISOString() } as T);
    }, 500);
  });
};

const getAPIWithMerging = createGetAPIWithMerging(mockGetAPI);

const APICacheDemo: React.FC = () => {
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const makeAPICall = async (path: string, config: Record<string, any>, key: string) => {
    setLoading(true);
    try {
      const response = await getAPIWithMerging(path, config);
      setResults(prev => ({ ...prev, [key]: JSON.stringify(response, null, 2) }));
    } catch (error) {
      setResults(prev => ({ ...prev, [key]: `Error: ${error}` }));
    } finally {
      setLoading(false);
    }
  };

  const makeMultipleCalls = async () => {
    await makeAPICall('/users', { id: 1 }, 'call1');
    await makeAPICall('/users', { id: 1 }, 'call2'); // Should use cache
    await makeAPICall('/posts', { userId: 1 }, 'call3');
    await makeAPICall('/users', { id: 2 }, 'call4');
  };

  const demonstrateCacheExpiration = async () => {
    await makeAPICall('/users', { id: 1 }, 'expiry1');
    setTimeout(async () => {
      await makeAPICall('/users', { id: 1 }, 'expiry2');
    }, 1100); // Just over the 1000ms cache TTL
  };

  useEffect(() => {
    makeMultipleCalls();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Cache Demo</h1>
      <div className="space-y-4">
        <button
          onClick={makeMultipleCalls}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Make Multiple API Calls'}
        </button>
        <button
          onClick={demonstrateCacheExpiration}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Demonstrate Cache Expiration
        </button>
        <button
          onClick={() => getAPIWithMerging.clearCache()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Clear Cache
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{key}</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {value}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APICacheDemo;

