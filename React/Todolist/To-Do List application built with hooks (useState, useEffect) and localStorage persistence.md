Here is a complete, production-ready **React To-Do List** application built with hooks (`useState`, `useEffect`) and **localStorage persistence**.

This component features task addition, completion toggling, deletion, filtering (All, Active, Completed), local storage synchronization, and a clean modern UI styled with Tailwind CSS.

### `TodoList.jsx`

```jsx
import React, { useState, useEffect } from 'react';

export default function TodoList() {
  // 1. Initialize state from localStorage if available
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('react_todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // 2. Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('react_todos', JSON.stringify(todos));
  }, [todos]);

  // Handler: Add Task
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  // Handler: Toggle Completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handler: Delete Task
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filtered Todos computation
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Tasks</h1>

      {/* Input Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
        >
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-4 bg-gray-50 p-1 rounded-lg">
        {['all', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">No tasks found.</p>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={`text-sm truncate ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span>{activeCount} items left</span>
        {todos.length > activeCount && (
          <button
            onClick={() => setTodos(todos.filter((t) => !t.completed))}
            className="hover:text-gray-700 underline cursor-pointer"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

```

---

### Key Features Implemented

1. **`useState` with Lazy Initializer:** `useState(() => { ... })` reads from `localStorage` only on the initial page load to avoid unnecessary synchronous reads on every render.
2. **`useEffect` Persistence:** Automatically serializes and saves the `todos` array to browser `localStorage` (`react_todos`) whenever the state changes.
3. **Filtering Engine:** Easily toggle between **All**, **Active**, and **Completed** tasks dynamically.
4. **Interactive UI:** Includes hover-reveal delete buttons, responsive checkbox state handling, cross-through typography for completed items, and an active item counter.
