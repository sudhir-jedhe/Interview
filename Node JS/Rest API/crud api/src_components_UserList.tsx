import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { User } from '../types/User';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await userApi.getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User List (GET)</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="bg-gray-100 p-2 rounded">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

