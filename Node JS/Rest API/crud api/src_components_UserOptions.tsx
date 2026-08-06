import React, { useState } from 'react';
import { userApi } from '../api/userApi';

const UserOptions: React.FC = () => {
  const [id, setId] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOptions([]);

    try {
      const fetchedOptions = await userApi.getUserOptions(parseInt(id));
      setOptions(fetchedOptions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Options (OPTIONS)</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded" disabled={isLoading}>
          Get Options
        </button>
      </form>
      {isLoading && <div>Loading options...</div>}
      {error && <div>Error: {error}</div>}
      {options.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Allowed Methods:</h3>
          <ul>
            {options.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserOptions;

