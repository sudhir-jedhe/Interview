import React, { useState } from 'react';
import { userApi } from '../api/userApi';

const UserHead: React.FC = () => {
  const [id, setId] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHeaders({});

    try {
      const fetchedHeaders = await userApi.getUserHead(parseInt(id));
      const headersObject: Record<string, string> = {};
      fetchedHeaders.forEach((value, key) => {
        headersObject[key] = value;
      });
      setHeaders(headersObject);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Headers (HEAD)</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-indigo-500 text-white rounded" disabled={isLoading}>
          Get Headers
        </button>
      </form>
      {isLoading && <div>Loading headers...</div>}
      {error && <div>Error: {error}</div>}
      {Object.keys(headers).length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Headers:</h3>
          <ul>
            {Object.entries(headers).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserHead;

