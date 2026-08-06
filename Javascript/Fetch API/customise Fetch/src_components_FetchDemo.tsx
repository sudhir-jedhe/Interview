import React, { useState } from 'react';
import { customFetch, fetchWithTimeout, useFetch } from '../utils/customFetch';

const FetchDemo: React.FC = () => {
  const [postResult, setPostResult] = useState<string>('');
  const [timeoutResult, setTimeoutResult] = useState<string>('');
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos/1');

  const handleCustomFetch = async () => {
    try {
      const result = await customFetch('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake_token'
        }
      });
      setPostResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setPostResult('Error fetching data');
    }
  };

  const handlePostRequest = async () => {
    try {
      const result = await customFetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1
        })
      });
      setPostResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setPostResult('Error posting data');
    }
  };

  const handleTimeoutFetch = async () => {
    try {
      const result = await fetchWithTimeout('https://jsonplaceholder.typicode.com/todos/1', {}, 100);
      setTimeoutResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTimeoutResult('Request timed out or error occurred');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fetch API Customization Demo</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Custom Fetch with Headers</h2>
        <button 
          onClick={handleCustomFetch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Fetch with Custom Headers
        </button>
        <pre className="bg-gray-100 p-2 mt-2 rounded">{postResult || 'Result will appear here'}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">POST Request</h2>
        <button 
          onClick={handlePostRequest}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Make POST Request
        </button>
        <pre className="bg-gray-100 p-2 mt-2 rounded">{postResult || 'Result will appear here'}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Fetch with Timeout</h2>
        <button 
          onClick={handleTimeoutFetch}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Fetch with Timeout
        </button>
        <pre className="bg-gray-100 p-2 mt-2 rounded">{timeoutResult || 'Result will appear here'}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Custom Hook: useFetch</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <pre className="bg-gray-100 p-2 mt-2 rounded">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default FetchDemo;

