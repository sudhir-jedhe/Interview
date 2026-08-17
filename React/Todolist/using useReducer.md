Here is the refactored **To-Do List** application converted from `useState` to **`useReducer`**. Using `useReducer` keeps all state-transition logic centralized and predictable, making the component cleaner and much easier to scale as your app grows.

### `TodoListReducer.jsx`

```jsx
import React, { useReducer, useState, useEffect } from 'react';

// 1. Define Action Types
const ACTIONS = {
  ADD_TODO: 'add_todo',
  TOGGLE_TODO: 'toggle_todo',
  DELETE_TODO: 'delete_todo',
  CLEAR_COMPLETED: 'clear_completed',
};

// 2. Define the Reducer Function
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      if (!action.payload.text.trim()) return state;
      return [
        {
          id: Date.now(),
          text: action.payload.text.trim(),
          completed: false,
        },
        ...state,
      ];

    case ACTIONS.TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case ACTIONS.DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload.id);

    case ACTIONS.CLEAR_COMPLETED:
      return state.filter((todo) => !todo.completed);

    default:
      return state;
  }
}

// 3. Initializer function to load from localStorage safely
const initLocalStorage = () => {
  const savedTodos = localStorage.getItem('react_todos_reducer');
  if (savedTodos) {
    try {
      return JSON.parse(savedTodos);
    } catch (e) {
      console.error('Failed to parse todos from localStorage', e);
      return [];
    }
  }
  return [];
};

export default function TodoListReducer() {
  // Initialize useReducer with lazy local storage loading
  const [todos, dispatch] = useReducer(todoReducer, [], initLocalStorage);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('react_todos_reducer', JSON.stringify(todos));
  }, [todos]);

  // Handle Form Submission
  const handleAddTodo = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.ADD_TODO, payload: { text: input } });
    setInput('');
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My Tasks (useReducer)
      </h1>

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
                  onChange={() =>
                    dispatch({
                      type: ACTIONS.TOGGLE_TODO,
                      payload: { id: todo.id },
                    })
                  }
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
                onClick={() =>
                  dispatch({
                    type: ACTIONS.DELETE_TODO,
                    payload: { id: todo.id },
                  })
                }
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
            onClick={() => dispatch({ type: ACTIONS.CLEAR_COMPLETED })}
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

### Why Use `useReducer` Here?

1. **Separation of Concerns:** Business logic (state transitions) lives in the `todoReducer` function outside the component, making it pure and very easy to unit test.
2. **Predictable Updates:** Instead of scattering `setTodos` logic with array methods across multiple handlers, actions (`dispatch`) explicitly declare *what happened*.
3. **Easily Scalable:** Adding new actions (like *Edit Todo*, *Reorder*, or *Mark All Complete*) just requires adding a new `case` inside the reducer function.
