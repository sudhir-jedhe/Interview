Here is a complete, production-ready Todo application built with **React**, **TypeScript**, and **CSS Modules**.

It includes features such as task filtering (All / Active / Completed), localStorage persistence, task editing, clear completed, and task statistics.

---

### 1. Styles (`Todo.module.css`)

Create `src/Todo.module.css` for clean, responsive, and locally-scoped styles:

```css
.container {
  max-width: 550px;
  margin: 50px auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
}

.title {
  text-align: center;
  margin: 0 0 24px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.inputForm {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.addButton {
  padding: 12px 20px;
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.addButton:hover {
  background-color: #4338ca;
}

.filterGroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.filterButtons {
  display: flex;
  gap: 6px;
}

.filterBtn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background-color: transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filterBtn:hover {
  border-color: #cbd5e1;
  color: #1e293b;
}

.activeFilter {
  background-color: #4f46e5;
  color: #ffffff;
  border-color: #4f46e5;
}

.activeFilter:hover {
  background-color: #4338ca;
  color: #ffffff;
}

.todoList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todoItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.todoItem:hover {
  background-color: #f1f5f9;
}

.todoContent {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.todoText {
  font-size: 1rem;
  word-break: break-word;
  cursor: pointer;
}

.completedText {
  text-decoration: line-through;
  color: #94a3b8;
}

.editInput {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #4f46e5;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 8px;
}

.iconBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.editBtn {
  color: #0284c7;
}

.editBtn:hover {
  background-color: #e0f2fe;
}

.deleteBtn {
  color: #ef4444;
}

.deleteBtn:hover {
  background-color: #fee2e2;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 12px;
  font-size: 0.875rem;
  color: #64748b;
}

.clearBtn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
}

.clearBtn:hover {
  color: #dc2626;
}

.emptyState {
  text-align: center;
  padding: 32px 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

```

---

### 2. Main Application Component (`TodoApp.tsx`)

Create `src/TodoApp.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import styles from './Todo.module.css';

// Type definitions
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

const LOCAL_STORAGE_KEY = 'react_todo_app_tasks';

export function TodoApp() {
  // 1. Initialize State with localStorage Persistence
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse todos from localStorage:', e);
      return [];
    }
  });

  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // 2. Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 3. Handlers
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
      );
    } else {
      // Delete if saved as empty
      handleDeleteTodo(id);
    }
    setEditingId(null);
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // 4. Derived Values & Filtered Items
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Manager</h1>

      {/* Input Form */}
      <form onSubmit={handleAddTodo} className={styles.inputForm}>
        <input
          type="text"
          className={styles.input}
          placeholder="What needs to be done?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className={styles.addButton}>
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className={styles.filterGroup}>
        <div className={styles.filterButtons}>
          {(['all', 'active', 'completed'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${
                filter === f ? styles.activeFilter : ''
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      {filteredTodos.length > 0 ? (
        <ul className={styles.todoList}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <div className={styles.todoContent}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  className={styles.checkbox}
                />

                {editingId === todo.id ? (
                  <input
                    type="text"
                    className={styles.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleSaveEdit(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(todo.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`${styles.todoText} ${
                      todo.completed ? styles.completedText : ''
                    }`}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              <div className={styles.actions}>
                {editingId !== todo.id && (
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className={`${styles.iconBtn} ${styles.editBtn}`}
                    title="Edit task"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className={`${styles.iconBtn} ${styles.deleteBtn}`}
                  title="Delete task"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          {filter === 'all'
            ? 'No tasks yet. Add one above!'
            : `No ${filter} tasks found.`}
        </div>
      )}

      {/* Footer / Stats */}
      {todos.length > 0 && (
        <div className={styles.footer}>
          <span>
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </span>
          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className={styles.clearBtn}
            >
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

```

---

### 3. Root Entry Point (`App.tsx`)

In `src/App.tsx`, simply render the `TodoApp`:

```tsx
import React from 'react';
import { TodoApp } from './TodoApp';

export function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px 0' }}>
      <TodoApp />
    </div>
  );
}

export default App;

```

---

### Features Included

1. **State Persistence:** Automatically saves tasks to browser `localStorage` and restores them on page refresh.
2. **Inline Editing:** Click "Edit" or press Enter/Escape on an item to update its text.
3. **Filtering:** Switch dynamically between **All**, **Active**, and **Completed** tasks.
4. **Batch Actions:** Clean up finished items at once with the **Clear completed** button.
5. **Accessible & Responsive:** Styled with modern CSS variables, flexbox, and CSS Modules to prevent global class collisions.
