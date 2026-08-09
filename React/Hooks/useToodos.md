Here is a complete, production-ready Todo application powered by a custom React hook (`useTodos`).

Abstracting the state management and local storage persistence into a custom hook isolates the business logic from the UI. This allows `App.tsx` to remain a clean, declarative view component.

---

### 1. Custom Hook (`useTodos.ts`)

Create `src/useTodos.ts`. This hook manages all state, derived filtering, inline editing, and `localStorage` persistence:

```typescript
// src/useTodos.ts
import { useState, useEffect, useMemo } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type Filter = 'all' | 'active' | 'completed';

const LOCAL_STORAGE_KEY = 'react_custom_hook_todos';

export function useTodos() {
  // 1. State initialized from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // 2. Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 3. Actions
  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: Date.now().toString(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    } else {
      deleteTodo(id);
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // 4. Derived state using useMemo for optimal performance
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter((t) => !t.completed).length;
  }, [todos]);

  const completedCount = todos.length - activeCount;

  return {
    todos,
    filteredTodos,
    filter,
    activeCount,
    completedCount,
    editingId,
    editText,
    setFilter,
    setEditText,
    addTodo,
    toggleTodo,
    deleteTodo,
    startEditing,
    saveEdit,
    cancelEditing,
    clearCompleted,
  };
}

```

---

### 2. Styles (`TodoApp.module.css`)

Create `src/TodoApp.module.css`:

```css
.container {
  max-width: 520px;
  margin: 50px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.title {
  margin: 0 0 20px 0;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.addBtn {
  padding: 10px 18px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.filterGroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.filterButtons {
  display: flex;
  gap: 6px;
}

.filterBtn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: transparent;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
}

.activeFilter {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #ffffff;
}

.itemContent {
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

.completed {
  text-decoration: line-through;
  color: #94a3b8;
}

.actionBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.editBtn {
  color: #0284c7;
}

.deleteBtn {
  color: #ef4444;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  font-size: 0.85rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
}

.clearBtn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  text-decoration: underline;
}

.emptyState {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
}

```

---

### 3. Application Component (`App.tsx`)

`App.tsx` calls `useTodos()` and renders the UI using the state and methods returned by the custom hook:

```tsx
// src/App.tsx
import React, { useState } from 'react';
import { useTodos, Filter } from './useTodos';
import styles from './TodoApp.module.css';

export function App() {
  const [inputText, setInputText] = useState('');

  // Consume the custom hook
  const {
    filteredTodos,
    filter,
    activeCount,
    completedCount,
    editingId,
    editText,
    setFilter,
    setEditText,
    addTodo,
    toggleTodo,
    deleteTodo,
    startEditing,
    saveEdit,
    cancelEditing,
    clearCompleted,
  } = useTodos();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addTodo(inputText);
    setInputText('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Manager</h1>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="What needs to be done?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className={styles.addBtn}>
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className={styles.filterGroup}>
        <div className={styles.filterButtons}>
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${
                filter === f ? styles.activeFilter : ''
              }`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      {filteredTodos.length > 0 ? (
        <ul className={styles.list}>
          {filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <li key={todo.id} className={styles.item}>
                <div className={styles.itemContent}>
                  {!isEditing && (
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className={styles.checkbox}
                    />
                  )}

                  {isEditing ? (
                    <input
                      className={styles.input}
                      style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={todo.completed ? styles.completed : ''}
                      onClick={() => toggleTodo(todo.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {isEditing ? (
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(todo)}
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.emptyState}>No tasks found.</div>
      )}

      {/* Footer Stats */}
      <div className={styles.footer}>
        <span>
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
        </span>
        {completedCount > 0 && (
          <button onClick={clearCompleted} className={styles.clearBtn}>
            Clear completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

```

---

### Key Advantages of Custom Hook Abstraction

1. **Testability:** You can write unit tests directly against `useTodos` using `@testing-library/react-hooks` without needing to render UI or mock DOM inputs.
2. **Reusability:** The `useTodos` hook can be shared across different views (e.g., a desktop UI, a mobile drawer, or a widget) while reusing the exact same business logic.
3. **Clean UI Components:** All state setters, handlers, and side effects are kept out of `App.tsx`, keeping the component render logic straightforward.
