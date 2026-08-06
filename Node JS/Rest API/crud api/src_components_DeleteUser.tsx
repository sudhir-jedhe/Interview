import React, { useState } from 'react';
import { userApi } from '../api/userApi';

const DeleteUser: React.FC = () => {
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userApi.deleteUser(parseInt(id));
      setSuccess(true);
      setId('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Delete User (DELETE)</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-red-500 text-white rounded" disabled={isLoading}>
          Delete User
        </button>
      </form>
      {isLoading && <div>Deleting user...</div>}
      {error && <div>Error: {error}</div>}
      {success && <div>User deleted successfully!</div>}
    </div>
  );
};

export default DeleteUser;

