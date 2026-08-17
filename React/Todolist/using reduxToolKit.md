Here is the complete **React To-Do List application refactored to use Redux** (specifically `@reduxjs/toolkit` and `react-redux`), complete with authentication (login/logout), task management, and `localStorage` persistence.

### 1. Store & Slice Setup (`todoSlice.js`)

This file defines the Redux state, actions, and reducers for both user authentication and tasks, along with localStorage persistence helpers.

```javascript
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage safely
const loadInitialState = () => {
  try {
    const savedUser = localStorage.getItem('redux_todo_user');
    const savedTodos = localStorage.getItem('redux_todos');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      todos: savedTodos ? JSON.parse(savedTodos) : [],
    };
  } catch (e) {
    console.error('Failed to load from localStorage', e);
    return { user: null, todos: [] };
  }
};

const initialState = loadInitialState();

const todoSlice = createSlice({
  name: 'todoApp',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('redux_todo_user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('redux_todo_user');
    },
    addTodo: (state, action) => {
      if (!action.payload.trim()) return;
      state.todos.unshift({
        id: Date.now(),
        text: action.payload.trim(),
        completed: false,
      });
      localStorage.setItem('redux_todos', JSON.stringify(state.todos));
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('redux_todos', JSON.stringify(state.todos));
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      localStorage.setItem('redux_todos', JSON.stringify(state.todos));
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((t) => !t.completed);
      localStorage.setItem('redux_todos', JSON.stringify(state.todos));
    },
  },
});

export const { login, logout, addTodo, toggleTodo, deleteTodo, clearCompleted } = todoSlice.actions;

export const store = configureStore({
  reducer: todoSlice.reducer,
});

```

---

### 2. Main Component (`TodoAppWithRedux.jsx`)

This component uses `useSelector` to read from the Redux store and `useDispatch` to trigger actions.

```javascript
import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
  store,
  login,
  logout,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
} from './todoSlice';

// Main Dashboard Component
function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const todos = useSelector((state) => state.todos);

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addTodo(input));
    setInput('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      {/* Header Profile */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <span className="text-xs text-gray-400 block">Logged in as</span>
          <span className="text-sm font-semibold text-gray-800">{user}</span>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">My Tasks (Redux)</h1>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
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
                  onChange={() => dispatch(toggleTodo(todo.id))}
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
                onClick={() => dispatch(deleteTodo(todo.id))}
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
            onClick={() => dispatch(clearCompleted())}
            className="hover:text-gray-700 underline cursor-pointer"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

// Login Screen Component
function LoginScreen() {
  const dispatch = useDispatch();
  const [usernameInput, setUsernameInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    dispatch(login(usernameInput.trim()));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">Please enter your name to access Redux tasks.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter your username..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

// Wrapper Component with Redux Provider & Conditional Screen Rendering
function AppContent() {
  const user = useSelector((state) => state.user);
  return user ? <Dashboard /> : <LoginScreen />;
}

export default function TodoAppWithRedux() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

```
