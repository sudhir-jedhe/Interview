import React, { useState } from 'react';
import { userApi } from '../api/userApi';
import { User } from '../types/User';

const UpdateUser: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userApi.updateUser({ id: parseInt(id), name, email } as User);
      setSuccess(true);
      setId('');
      setName('');
      setEmail('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Update User (PUT)</h2>
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
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New Email"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded" disabled={isLoading}>
          Update User
        </button>
      </form>
      {isLoading && <div>Updating user...</div>}
      {error && <div>Error: {error}</div>}
      {success && <div>User updated successfully!</div>}
    </div>
  );
};

export default UpdateUser;

