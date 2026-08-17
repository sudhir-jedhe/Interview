Here is a complete, production-ready React To-Do List application built using **Classic / Old Redux** (pre-Toolkit, using `createStore`, action creators, switch-case reducers, and `react-redux` hooks like `useSelector` and `useDispatch`), featuring user authentication (login/logout), task management, and `localStorage` persistence.

### 1. Old Redux Setup (`store.js`)

This file defines the action types, action creators, initial state, reducer with a `switch` statement, and configures the Redux store using `createStore`.

```javascript
import { legacy_createStore as createStore } from 'redux';

// 1. Action Types
const TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

// 2. Action Creators
export const login = (username) => ({ type: TYPES.LOGIN, payload: username });
export const logout = () => ({ type: TYPES.LOGOUT });
export const addTodo = (text) => ({ type: TYPES.ADD_TODO, payload: text });
export const toggleTodo = (id) => ({ type: TYPES.TOGGLE_TODO, payload: id });
export const deleteTodo = (id) => ({ type: TYPES.DELETE_TODO, payload: id });
export const clearCompleted = () => ({ type: TYPES.CLEAR_COMPLETED });

// 3. Load Initial State Safely from localStorage
const loadInitialState = () => {
  try {
    const savedUser = localStorage.getItem('old_redux_user');
    const savedTodos = localStorage.getItem('old_redux_todos');
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

// 4. Reducer Function (Classic Switch Case)
function rootReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case TYPES.LOGIN:
      newState = { ...state, user: action.payload };
      localStorage.setItem('old_redux_user', JSON.stringify(newState.user));
      return newState;

    case TYPES.LOGOUT:
      newState = { ...state, user: null };
      localStorage.removeItem('old_redux_user');
      return newState;

    case TYPES.ADD_TODO:
      if (!action.payload.trim()) return state;
      const newTodo = {
        id: Date.now(),
        text: action.payload.trim(),
        completed: false,
      };
      newState = { ...state, todos: [newTodo, ...state.todos] };
      localStorage.setItem('old_redux_todos', JSON.stringify(newState.todos));
      return newState;

    case TYPES.TOGGLE_TODO:
      newState = {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
      localStorage.setItem('old_redux_todos', JSON.stringify(newState.todos));
      return newState;

    case TYPES.DELETE_TODO:
      newState = {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
      localStorage.setItem('old_redux_todos', JSON.stringify(newState.todos));
      return newState;

    case TYPES.CLEAR_COMPLETED:
      newState = {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
      localStorage.setItem('old_redux_todos', JSON.stringify(newState.todos));
      return newState;

    default:
      return state;
  }
}

// 5. Create Store
export const store = createStore(rootReducer);

```

---

### 2. Main Component & Views (`TodoAppOldRedux.jsx`)

This component uses `useSelector` to access store data and `useDispatch` to trigger classic action creators.

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
} from './store';

// Dashboard View
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

      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">My Tasks (Old Redux)</h1>

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

// Login Screen View
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
      <p className="text-sm text-gray-500 mb-6 text-center">Please enter your name to access your account.</p>
      
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

// App Wrapper with Redux Provider
function AppContent() {
  const user = useSelector((state) => state.user);
  return user ? <Dashboard /> : <LoginScreen />;
}

export default function TodoAppOldRedux() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

```
