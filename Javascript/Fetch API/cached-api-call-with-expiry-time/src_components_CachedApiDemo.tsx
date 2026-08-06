import React, { useState, useEffect } from 'react';
import { useCachedApiCall } from '../hooks/useCachedApiCall';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const CachedApiDemo: React.FC = () => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cachedApiCall = useCachedApiCall(5000); // Cache for 5 seconds

  const fetchTodo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cachedApiCall<Todo>('https://jsonplaceholder.typicode.com/todos/1');
      setTodo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Cached API Demo</h1>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {todo && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Todo Item:</h2>
          <p><strong>ID:</strong> {todo.id}</p>
          <p><strong>Title:</strong> {todo.title}</p>
          <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
        </div>
      )}
      <button
        onClick={fetchTodo}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Todo Again
      </button>
    </div>
  );
};

export default CachedApiDemo;

