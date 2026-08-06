import React, { useState } from 'react';
import { userApi } from '../api/userApi';

const PatchUser: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userApi.patchUser(parseInt(id), { name });
      setSuccess(true);
      setId('');
      setName('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Patch User (PATCH)</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Name"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-yellow-500 text-white rounded" disabled={isLoading}>
          Patch User
        </button>
      </form>
      {isLoading && <div>Patching user...</div>}
      {error && <div>Error: {error}</div>}
      {success && <div>User patched successfully!</div>}
    </div>
  );
};

export default PatchUser;

