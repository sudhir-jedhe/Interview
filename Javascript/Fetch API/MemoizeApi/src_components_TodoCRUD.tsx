import React, { useState, useEffect } from 'react';
import { useMemoizedFetch } from '../hooks/useMemoizedFetch';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoCRUD: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { fetchWithCache, clearCache, loading, error } = useMemoizedFetch(30000); // 30 seconds TTL

  const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  const fetchTodos = async () => {
    try {
      const data = await fetchWithCache<Todo[]>(apiUrl);
      setTodos(data.slice(0, 10)); // Limit to 10 items for this example
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async () => {
    if (!newTodo.trim()) return;
    try {
      const createdTodo = await fetchWithCache<Todo>(apiUrl, 'POST', { title: newTodo, completed: false });
      setTodos([...todos, { ...createdTodo, id: todos.length + 1 }]); // Mocking ID as JSONPlaceholder doesn't actually create new items
      setNewTodo('');
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdate = async (todo: Todo) => {
    try {
      const updatedTodo = await fetchWithCache<Todo>(`${apiUrl}/${todo.id}`, 'PUT', todo);
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
      setEditingTodo(null);
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithCache(`${apiUrl}/${id}`, 'DELETE');
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo CRUD with Memoized Fetch</h1>
      
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      <div className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 mr-2"
          placeholder="New todo"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Todo
        </button>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between">
            {editingTodo?.id === todo.id ? (
              <input
                type="text"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                className="border p-1 mr-2"
              />
            ) : (
              <span>{todo.title}</span>
            )}
            <div>
              {editingTodo?.id === todo.id ? (
                <button
                  onClick={() => handleUpdate(editingTodo)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingTodo(todo)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      <button
        onClick={clearCache}
        className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Clear Cache
      </button>
      
      <button
        onClick={fetchTodos}
        className="mt-4 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh Todos
      </button>
    </div>
  );
};

export default TodoCRUD;

