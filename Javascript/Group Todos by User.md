Here are clean, idiomatic patterns to group a flat list of todos by user across JavaScript/TypeScript and React, handling empty values, sorting, and edge cases.

---

### 1. Modern JavaScript (ES2024+ `Object.groupBy`)

`Object.groupBy` is the native standard in ECMAScript:

```javascript
const todos = [
  { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false },
  { id: 2, userId: 'u2', title: 'Write unit tests', completed: true },
  { id: 3, userId: 'u1', title: 'Configure ESLint', completed: true },
  { id: 4, userId: 'u3', title: 'Update README', completed: false },
  { id: 5, userId: 'u2', title: 'Deploy staging build', completed: false },
];

const todosByUser = Object.groupBy(todos, (todo) => todo.userId);

console.log(todosByUser);
/*
Output:
{
  u1: [
    { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false },
    { id: 3, userId: 'u1', title: 'Configure ESLint', completed: true }
  ],
  u2: [
    { id: 2, userId: 'u2', title: 'Write unit tests', completed: true },
    { id: 5, userId: 'u2', title: 'Deploy staging build', completed: false }
  ],
  u3: [
    { id: 4, userId: 'u3', title: 'Update README', completed: false }
  ]
}
*/

```

---

### 2. Universal JavaScript (`Array.prototype.reduce`)

Use `reduce` for older Node.js/browser environments or when grouping keys might include non-string/numeric types (using `Map`):

```javascript
// Plain object accumulator
const todosByUser = todos.reduce((acc, todo) => {
  const key = todo.userId ?? 'unassigned';
  (acc[key] ??= []).push(todo);
  return acc;
}, {});

```

```javascript
// Map accumulator (preserves object identity or insertion order)
const todosByUserMap = todos.reduce((map, todo) => {
  const key = todo.userId ?? 'unassigned';
  if (!map.has(key)) {
    map.set(key, []);
  }
  map.get(key).push(todo);
  return map;
}, new Map());

```

---

### 3. Type-Safe Helper with Metadata Join (TypeScript)

In real applications, you typically join the grouped todos with user profile metadata (e.g., name, avatar):

```typescript
export interface Todo {
  id: string | number;
  userId: string;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface UserTodoGroup {
  user: User;
  todos: Todo[];
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export function groupTodosWithUsers(
  todos: Todo[],
  users: User[]
): UserTodoGroup[] {
  const userMap = new Map<string, User>(users.map((u) => [u.id, u]));
  const todoGroups = new Map<string, Todo[]>();

  for (const todo of todos) {
    const list = todoGroups.get(todo.userId);
    if (list) {
      list.push(todo);
    } else {
      todoGroups.set(todo.userId, [todo]);
    }
  }

  return Array.from(userMap.values()).map((user) => {
    const userTodos = todoGroups.get(user.id) ?? [];
    const completed = userTodos.filter((t) => t.completed).length;

    return {
      user,
      todos: userTodos,
      stats: {
        total: userTodos.length,
        completed,
        pending: userTodos.length - completed,
      },
    };
  });
}

```

---

### 4. React Component Pattern (Memoized Grouping)

When grouping in React, compute the grouping inside `useMemo` so re-renders don't re-traverse the list on unrelated state changes:

```tsx
import React, { useMemo } from 'react';

interface Todo {
  id: number;
  userId: string;
  title: string;
  completed: boolean;
}

interface Props {
  todos: Todo[];
  userNamesById?: Record<string, string>;
}

export function UserTodoList({ todos, userNamesById = {} }: Props) {
  const groupedTodos = useMemo(() => {
    return todos.reduce<Record<string, Todo[]>>((acc, todo) => {
      const key = todo.userId || 'Unassigned';
      if (!acc[key]) acc[key] = [];
      acc[key].push(todo);
      return acc;
    }, {});
  }, [todos]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTodos).map(([userId, userTodos]) => {
        const displayName = userNamesById[userId] ?? `User ${userId}`;
        const completedCount = userTodos.filter((t) => t.completed).length;

        return (
          <section
            key={userId}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <header className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-slate-800">{displayName}</h3>
              <span className="text-xs font-medium text-slate-500">
                {completedCount} / {userTodos.length} done
              </span>
            </header>

            <ul className="space-y-2">
              {userTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center gap-2 text-sm ${
                    todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{todo.title}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

```
