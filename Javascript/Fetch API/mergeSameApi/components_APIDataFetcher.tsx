import React, { useState, useEffect, useCallback } from 'react';
import { mergeIdenticalAPICalls } from '../utils/mergeIdenticalAPICalls';

// Mock API function
const fetchDataFromAPI = async (id: number): Promise<{ id: number; data: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id, data: `Data for ID ${id} (fetched at ${new Date().toISOString()})` };
};

// Create merged API function with 10 second TTL and max size of 5
const mergedFetchData = mergeIdenticalAPICalls(fetchDataFromAPI, 10000, 5);

const APIDataFetcher: React.FC = () => {
  const [data, setData] = useState<{ id: number; data: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mergedFetchData(id);
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Data Fetcher</h2>
      <div className="mb-4">
        <label htmlFor="id-input" className="block mb-2">ID:</label>
        <input
          id="id-input"
          type="number"
          value={id}
          onChange={(e) => setId(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch Data
      </button>
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {data && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Result:</h3>
          <p>{data.data}</p>
        </div>
      )}
    </div>
  );
};

export default APIDataFetcher;

