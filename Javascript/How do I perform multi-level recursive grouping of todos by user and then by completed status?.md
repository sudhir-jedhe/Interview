To perform multi-level grouping (e.g., first by `userId`, then by `completed` status, or any arbitrary sequence of keys), you can build a generic, reusable grouping utility that recursively partitions an array across an array of key-selector functions or property keys.

---

### 1. The Generic Recursive Grouping Utility

This utility accepts a list of items and an array of selector functions. At each level, it partitions items into buckets, recursing on child buckets until all grouping levels are consumed.

```typescript
type KeySelector<T> = (item: T) => string | number | boolean;
type PropertyOrSelector<T> = keyof T | KeySelector<T>;

// Recursive return type: maps keys to nested groupings or the final item list
export type GroupedResult<T> = {
  [key: string]: GroupedResult<T> | T[];
};

/**
 * Recursively groups an array of items by a sequential list of keys or selectors.
 *
 * @param items - The array to group
 * @param criteria - Ordered list of object keys or key-deriving callbacks
 */
export function groupByHierarchy<T>(
  items: T[],
  criteria: PropertyOrSelector<T>[]
): GroupedResult<T> | T[] {
  // Base case: No more criteria to group by, return the terminal item list
  if (!criteria || criteria.length === 0) {
    return items;
  }

  const [currentCriterion, ...remainingCriteria] = criteria;
  const getKey: KeySelector<T> =
    typeof currentCriterion === 'function'
      ? currentCriterion
      : (item: T) => String(item[currentCriterion] ?? 'unassigned');

  // Partition the current level into buckets
  const buckets: Record<string, T[]> = {};

  for (const item of items) {
    const rawKey = getKey(item);
    const key = String(rawKey);
    (buckets[key] ??= []).push(item);
  }

  // Recurse on each bucket with the remaining grouping criteria
  const result: GroupedResult<T> = {};

  for (const [key, subItems] of Object.entries(buckets)) {
    result[key] = groupByHierarchy(subItems, remainingCriteria);
  }

  return result;
}

```

---

### 2. Grouping Todos: By User $\rightarrow$ By Completed Status

```typescript
interface Todo {
  id: number;
  userId: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

const sampleTodos: Todo[] = [
  { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false, priority: 'high' },
  { id: 2, userId: 'u2', title: 'Write unit tests', completed: true, priority: 'medium' },
  { id: 3, userId: 'u1', title: 'Configure ESLint', completed: true, priority: 'low' },
  { id: 4, userId: 'u3', title: 'Update README', completed: false, priority: 'low' },
  { id: 5, userId: 'u2', title: 'Deploy staging build', completed: false, priority: 'high' },
  { id: 6, userId: 'u1', title: 'Fix CSS Grid alignment', completed: false, priority: 'medium' },
];

// Group first by 'userId', then by a label derived from 'completed'
const nestedTodos = groupByHierarchy(sampleTodos, [
  'userId',
  (todo) => (todo.completed ? 'completed' : 'pending'),
]);

console.log(JSON.stringify(nestedTodos, null, 2));

```

#### Output Structure

```json
{
  "u1": {
    "pending": [
      { "id": 1, "userId": "u1", "title": "Setup CI/CD pipeline", "completed": false, "priority": "high" },
      { "id": 6, "userId": "u1", "title": "Fix CSS Grid alignment", "completed": false, "priority": "medium" }
    ],
    "completed": [
      { "id": 3, "userId": "u1", "title": "Configure ESLint", "completed": true, "priority": "low" }
    ]
  },
  "u2": {
    "completed": [
      { "id": 2, "userId": "u2", "title": "Write unit tests", "completed": true, "priority": "medium" }
    ],
    "pending": [
      { "id": 5, "userId": "u2", "title": "Deploy staging build", "completed": false, "priority": "high" }
    ]
  },
  "u3": {
    "pending": [
      { "id": 4, "userId": "u3", "title": "Update README", "completed": false, "priority": "low" }
    ]
  }
}

```

---

### 3. Arbitrary N-Level Grouping

Because the function is recursive, you can pass any number of dimensions without modifying the engine. For instance, grouping by **User $\rightarrow$ Status $\rightarrow$ Priority**:

```typescript
const threeLevelGroup = groupByHierarchy(sampleTodos, [
  'userId',
  (t) => (t.completed ? 'done' : 'in_progress'),
  'priority',
]);

// Accessing: threeLevelGroup['u1']['in_progress']['high']

```

---

### 4. Rendering Recursive Groupings in React

You can render arbitrary nested groupings cleanly using a self-referential recursive view component:

```tsx
import React, { useMemo } from 'react';
import { groupByHierarchy, GroupedResult } from './groupByHierarchy';

interface Todo {
  id: number;
  userId: string;
  title: string;
  completed: boolean;
}

interface GroupViewProps {
  data: GroupedResult<Todo> | Todo[];
  level?: number;
}

function RecursiveGroupRenderer({ data, level = 0 }: GroupViewProps) {
  // Terminal Leaf: Array of items
  if (Array.isArray(data)) {
    return (
      <ul className="ml-4 space-y-1.5 border-l border-slate-200 pl-3">
        {data.map((todo) => (
          <li
            key={todo.id}
            className={`text-sm ${
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
            }`}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    );
  }

  // Branch Node: Render group header and recurse
  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-4' : ''}`}>
      {Object.entries(data).map(([groupKey, subData]) => (
        <div key={groupKey} className="rounded-md border border-slate-100 bg-white p-3 shadow-xs">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {groupKey}
          </div>
          <RecursiveGroupRenderer data={subData} level={level + 1} />
        </div>
      ))}
    </div>
  );
}

export function MultiLevelTodoList({ todos }: { todos: Todo[] }) {
  const grouped = useMemo(
    () =>
      groupByHierarchy(todos, [
        'userId',
        (t) => (t.completed ? 'Completed' : 'Pending Tasks'),
      ]),
    [todos]
  );

  return (
    <div className="max-w-xl p-4">
      <RecursiveGroupRenderer data={grouped} />
    </div>
  );
}

```

---

### Key Details & Complexity

* **Time Complexity:** $O(D \cdot N)$, where $N$ is the count of items and $D$ is the depth of grouping criteria. Every element is visited exactly once per dimension.
* **Space Complexity:** $O(N)$ auxiliary references to hold the tree structure.
* **Non-Mutating:** Original input objects and arrays remain pristine; new container objects are instantiated during partition.
