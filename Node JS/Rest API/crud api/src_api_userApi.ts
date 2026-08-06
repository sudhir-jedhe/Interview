import { User } from '../types/User';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  updateUser: async (user: User): Promise<User> => {
    const response = await fetch(`${API_URL}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  patchUser: async (id: number, partialUser: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partialUser),
    });
    if (!response.ok) throw new Error('Failed to patch user');
    return response.json();
  },

  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  getUserOptions: async (id: number): Promise<string[]> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'OPTIONS' });
    if (!response.ok) throw new Error('Failed to get user options');
    return response.headers.get('allow')?.split(', ') || [];
  },

  getUserHead: async (id: number): Promise<Headers> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'HEAD' });
    if (!response.ok) throw new Error('Failed to get user head');
    return response.headers;
  }
};

