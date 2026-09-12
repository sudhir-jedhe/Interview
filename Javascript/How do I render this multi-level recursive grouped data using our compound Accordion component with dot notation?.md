To render the recursive grouped data using our compound `<Accordion>` component (`Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`), we can build a self-referential recursive renderer component.

At each branch of the hierarchy, it renders an `<Accordion>` container and wraps each subgroup in an `<Accordion.Item>`. When it reaches a terminal leaf node (an array of `Todo` items), it renders the list.

---

### 1. Recursive Accordion Tree Renderer

This component inspects the current node:

* If it is an **Array** (leaf), it renders the todo items.
* If it is an **Object** (branch), it mounts an `<Accordion>` and creates an `<Accordion.Item>` for each group key, computing unique IDs along the path to avoid ID collisions.

```tsx
import React from 'react';
import { Accordion } from './Accordion';
import type { GroupedResult } from './groupByHierarchy';

export interface Todo {
  id: number;
  userId: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface RecursiveAccordionGroupProps {
  data: GroupedResult<Todo> | Todo[];
  /** Keeps track of the path to generate unique keys and ARIA IDs */
  pathPrefix?: string;
  /** Current depth in the tree for semantic heading levels */
  level?: number;
  /** Mapping user IDs or keys to human-friendly display labels */
  labelFormatters?: Record<string, (key: string) => string>;
}

// Maps tree depth level to semantic HTML heading levels
const HEADING_LEVELS: Array<'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
];

/**
 * Helper to recursively count leaf todos under any branch
 */
function countTodos(node: GroupedResult<Todo> | Todo[]): number {
  if (Array.isArray(node)) {
    return node.length;
  }
  return Object.values(node).reduce(
    (sum, child) => sum + countTodos(child),
    0
  );
}

export function RecursiveAccordionGroup({
  data,
  pathPrefix = 'group',
  level = 0,
  labelFormatters = {},
}: RecursiveAccordionGroupProps) {
  // Leaf Node: Terminal list of Todo items
  if (Array.isArray(data)) {
    return (
      <ul className="space-y-2 py-1">
        {data.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={todo.completed}
                readOnly
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className={
                  todo.completed
                    ? 'text-slate-400 line-through'
                    : 'text-slate-700 font-medium'
                }
              >
                {todo.title}
              </span>
            </label>

            {todo.priority && (
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                  todo.priority === 'high'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : todo.priority === 'medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}
              >
                {todo.priority}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // Pick semantic heading level capped at h6
  const currentHeading = HEADING_LEVELS[Math.min(level, HEADING_LEVELS.length - 1)];

  // Branch Node: Render an Accordion level
  return (
    <Accordion
      allowMultiple
      className={level > 0 ? 'mt-2 border-l-2 border-slate-200 pl-2 shadow-none border-t-0 border-r-0 border-b-0 rounded-none' : ''}
    >
      {Object.entries(data).map(([groupKey, subData]) => {
        const itemUniqueValue = `${pathPrefix}-${groupKey}`;
        const totalCount = countTodos(subData);

        // Allow custom label formatting per level (e.g. user names)
        const formatLabel = labelFormatters[level] || ((val: string) => val);
        const displayLabel = formatLabel(groupKey);

        return (
          <Accordion.Item
            key={itemUniqueValue}
            value={itemUniqueValue}
            unmountOnCollapse={true}
          >
            <Accordion.Trigger
              headingLevel={currentHeading}
              className="hover:bg-slate-50/80"
            >
              <div className="flex items-center gap-2">
                <span className="capitalize">{displayLabel}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {totalCount}
                </span>
              </div>
            </Accordion.Trigger>

            <Accordion.Content>
              <RecursiveAccordionGroup
                data={subData}
                pathPrefix={itemUniqueValue}
                level={level + 1}
                labelFormatters={labelFormatters}
              />
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

```

---

### 2. Integration Example: User $\rightarrow$ Status $\rightarrow$ Priority

```tsx
import React, { useMemo } from 'react';
import { groupByHierarchy } from './groupByHierarchy';
import { RecursiveAccordionGroup, Todo } from './RecursiveAccordionGroup';

const sampleTodos: Todo[] = [
  { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false, priority: 'high' },
  { id: 2, userId: 'u2', title: 'Write unit tests', completed: true, priority: 'medium' },
  { id: 3, userId: 'u1', title: 'Configure ESLint', completed: true, priority: 'low' },
  { id: 4, userId: 'u3', title: 'Update README', completed: false, priority: 'low' },
  { id: 5, userId: 'u2', title: 'Deploy staging build', completed: false, priority: 'high' },
  { id: 6, userId: 'u1', title: 'Fix CSS Grid layout shift', completed: false, priority: 'medium' },
];

const USER_NAMES: Record<string, string> = {
  u1: 'Alex Rivera',
  u2: 'Jordan Lee',
  u3: 'Samira Patel',
};

export function TodoAccordionDashboard() {
  // Memoize multi-level grouping computation
  const groupedData = useMemo(() => {
    return groupByHierarchy(sampleTodos, [
      'userId',
      (todo) => (todo.completed ? 'Completed' : 'In Progress'),
      'priority',
    ]);
  }, []);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Project Backlog</h1>
        <p className="text-sm text-slate-500">Grouped by Developer &gt; Status &gt; Priority</p>
      </header>

      <RecursiveAccordionGroup
        data={groupedData}
        labelFormatters={{
          // Level 0: UserId -> Full Name
          0: (userId) => USER_NAMES[userId] ?? `User (${userId})`,
          // Level 2: Priority -> Custom Label
          2: (priority) => `${priority} Priority`,
        }}
      />
    </div>
  );
}

```

---

### Key Highlights of This Setup

* **Compound Dot-Notation Usage:** Directly uses `<Accordion>`, `<Accordion.Item>`, `<Accordion.Trigger>`, and `<Accordion.Content>` without cluttering named imports.
* **Compound Unique Path Values:** Values are generated via `pathPrefix-${groupKey}` (e.g., `group-u1-InProgress-high`), preventing collisions between different parents that have matching child keys (like `high` priority).
* **Dynamic Semantic Heading Hierarchy:** Headings step down semantically (`h2` $\rightarrow$ `h3` $\rightarrow$ `h4`) based on the recursive `level` depth, preserving valid WAI-ARIA document outlines.
* **Lazy DOM Cleanup:** Inherits `unmountOnCollapse={true}` so nested sub-accordions and heavy todo lists are pruned from the DOM when high-level sections are collapsed.

How do I add global 'Expand All' and 'Collapse All' buttons to programmatically control this recursive accordion tree?

To control the entire tree with global **"Expand All"** and **"Collapse All"** buttons, you need to lift the expanded keys into a shared controlled state.

Because the `<Accordion>` component accepts a controlled `value` and `onValueChange` prop, you can collect all unique hierarchical paths (`pathPrefix-groupKey`) across the tree and store them in a single `Set<string>` (or array) managed at the root dashboard level.

---

### 1. Collect All Expandable Node Keys

Write a recursive helper to traverse the tree and gather every path key that maps to an `<Accordion.Item>`.

```typescript
import type { GroupedResult } from './groupByHierarchy';
import type { Todo } from './RecursiveAccordionGroup';

/**
 * Traverses the grouped hierarchy to collect every branch key path.
 */
export function getAllExpandableKeys(
  data: GroupedResult<Todo> | Todo[],
  pathPrefix = 'group'
): string[] {
  if (Array.isArray(data)) {
    return [];
  }

  const keys: string[] = [];

  for (const [groupKey, subData] of Object.entries(data)) {
    const currentPath = `${pathPrefix}-${groupKey}`;
    keys.push(currentPath);

    // Recursively collect nested branch keys
    keys.push(...getAllExpandableKeys(subData, currentPath));
  }

  return keys;
}

```

---

### 2. Update `RecursiveAccordionGroup` to Accept Controlled Props

Pass down `expandedKeys` and an updater callback `onToggleKey` so every level of the tree reflects the unified expansion state.

```tsx
import React from 'react';
import { Accordion } from './Accordion';
import type { GroupedResult } from './groupByHierarchy';
import type { Todo } from './RecursiveAccordionGroup';

interface ControlledRecursiveAccordionProps {
  data: GroupedResult<Todo> | Todo[];
  expandedKeys: string[];
  onToggleKey: (key: string) => void;
  pathPrefix?: string;
  level?: number;
  labelFormatters?: Record<number, (key: string) => string>;
}

const HEADING_LEVELS: Array<'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
];

export function ControlledRecursiveAccordion({
  data,
  expandedKeys,
  onToggleKey,
  pathPrefix = 'group',
  level = 0,
  labelFormatters = {},
}: ControlledRecursiveAccordionProps) {
  // Leaf: Render Todo items
  if (Array.isArray(data)) {
    return (
      <ul className="space-y-2 py-1">
        {data.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
          >
            <span
              className={
                todo.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-700 font-medium'
              }
            >
              {todo.title}
            </span>
            {todo.priority && (
              <span className="text-xs uppercase font-medium text-slate-500">
                {todo.priority}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  const currentHeading = HEADING_LEVELS[Math.min(level, HEADING_LEVELS.length - 1)];

  // Get keys belonging directly to this accordion instance
  const directChildKeys = Object.keys(data).map((k) => `${pathPrefix}-${k}`);
  const currentLevelActiveValues = directChildKeys.filter((k) =>
    expandedKeys.includes(k)
  );

  return (
    <Accordion
      allowMultiple
      value={currentLevelActiveValues}
      onValueChange={(nextValues) => {
        // Find which key was toggled at this level
        const added = nextValues.find((v) => !currentLevelActiveValues.includes(v));
        const removed = currentLevelActiveValues.find((v) => !nextValues.includes(v));
        if (added) onToggleKey(added);
        if (removed) onToggleKey(removed);
      }}
      className={
        level > 0
          ? 'mt-2 border-l-2 border-slate-200 pl-2 shadow-none border-t-0 border-r-0 border-b-0 rounded-none'
          : ''
      }
    >
      {Object.entries(data).map(([groupKey, subData]) => {
        const itemPath = `${pathPrefix}-${groupKey}`;
        const formatLabel = labelFormatters[level] || ((val: string) => val);

        return (
          <Accordion.Item
            key={itemPath}
            value={itemPath}
            unmountOnCollapse={true}
          >
            <Accordion.Trigger headingLevel={currentHeading}>
              <span className="capitalize">{formatLabel(groupKey)}</span>
            </Accordion.Trigger>

            <Accordion.Content>
              <ControlledRecursiveAccordion
                data={subData}
                expandedKeys={expandedKeys}
                onToggleKey={onToggleKey}
                pathPrefix={itemPath}
                level={level + 1}
                labelFormatters={labelFormatters}
              />
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

```

---

### 3. Build the Dashboard with Controls

Manage the state using a `Set` or an array, and wire the "Expand All" and "Collapse All" handlers.

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { groupByHierarchy } from './groupByHierarchy';
import {
  ControlledRecursiveAccordion,
} from './ControlledRecursiveAccordion';
import { getAllExpandableKeys } from './getAllExpandableKeys';

const SAMPLE_TODOS = [
  { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false, priority: 'high' },
  { id: 2, userId: 'u2', title: 'Write unit tests', completed: true, priority: 'medium' },
  { id: 3, userId: 'u1', title: 'Configure ESLint', completed: true, priority: 'low' },
  { id: 4, userId: 'u3', title: 'Update README', completed: false, priority: 'low' },
  { id: 5, userId: 'u2', title: 'Deploy staging build', completed: false, priority: 'high' },
  { id: 6, userId: 'u1', title: 'Fix CSS Grid layout shift', completed: false, priority: 'medium' },
];

export function GlobalAccordionDashboard() {
  const groupedData = useMemo(() => {
    return groupByHierarchy(SAMPLE_TODOS, [
      'userId',
      (t) => (t.completed ? 'Completed' : 'In Progress'),
      'priority',
    ]);
  }, []);

  // 1. Calculate all available node keys across all levels
  const allKeys = useMemo(() => {
    return getAllExpandableKeys(groupedData, 'group');
  }, [groupedData]);

  // 2. Track which keys are currently open
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 3. Handlers
  const handleExpandAll = () => setExpandedKeys(allKeys);
  const handleCollapseAll = () => setExpandedKeys([]);

  const handleToggleKey = useCallback((toggledKey: string) => {
    setExpandedKeys((prev) =>
      prev.includes(toggledKey)
        ? prev.filter((k) => k !== toggledKey)
        : [...prev, toggledKey]
    );
  }, []);

  const isAllExpanded = expandedKeys.length === allKeys.length && allKeys.length > 0;
  const isAllCollapsed = expandedKeys.length === 0;

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Header with Global Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Task Hierarchy</h1>
          <p className="text-xs text-slate-500">
            {expandedKeys.length} of {allKeys.length} sections expanded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExpandAll}
            disabled={isAllExpanded}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            disabled={isAllCollapsed}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Controlled Accordion Tree */}
      <ControlledRecursiveAccordion
        data={groupedData}
        expandedKeys={expandedKeys}
        onToggleKey={handleToggleKey}
        labelFormatters={{
          0: (id) => `Developer: ${id.toUpperCase()}`,
          2: (p) => `${p} Priority`,
        }}
      />
    </div>
  );
}

```

---

### Key Technical Considerations

* **Deterministic Key Matching:** By prefixing each level (`group-u1-InProgress-high`), parent keys and nested child keys are guaranteed to be unique and consistent between runs.
* **Controlled Prop Forwarding:** Passing `value={currentLevelActiveValues}` ensures each nested `<Accordion>` only reacts to the keys that belong to its direct children, avoiding invalid state bleed across branches.
* **Unmount Performance:** Because `unmountOnCollapse` remains enabled, calling **"Collapse All"** clears the inactive DOM nodes from memory simultaneously across all levels.

How can I add granular controls like 'Expand to Level 1' or 'Expand to Level 2' instead of just all or nothing?

To support granular depth-based controls (e.g., "Collapse All (L0)", "Level 1 (User)", "Level 2 (Status)", "All (Priority)"), you can map every node path in the hierarchy to its corresponding numeric `depth` during collection.

---

### 1. Collect Keys Bucket-Mapped by Depth

Extend the key collector to index paths by their `0`-based tree level:

```typescript
import type { GroupedResult } from './groupByHierarchy';
import type { Todo } from './RecursiveAccordionGroup';

export interface KeysByLevel {
  [level: number]: string[];
}

/**
 * Traverses the hierarchy and maps keys to their depth level.
 * Level 0 = Top-level groups (e.g. userId)
 * Level 1 = Second-tier groups (e.g. status)
 * Level 2 = Third-tier groups (e.g. priority)
 */
export function getKeysByLevel(
  data: GroupedResult<Todo> | Todo[],
  pathPrefix = 'group',
  level = 0,
  acc: KeysByLevel = {}
): KeysByLevel {
  if (Array.isArray(data)) {
    return acc;
  }

  acc[level] ??= [];

  for (const [groupKey, subData] of Object.entries(data)) {
    const currentPath = `${pathPrefix}-${groupKey}`;
    acc[level].push(currentPath);

    // Recurse into deeper levels
    getKeysByLevel(subData, currentPath, level + 1, acc);
  }

  return acc;
}

```

---

### 2. Add Level-Expansion Logic

To expand up to a target depth (inclusive), combine all keys from level `0` through the chosen target depth:

```typescript
/**
 * Returns all keys from level 0 up to targetLevel (inclusive).
 * If targetLevel < 0, returns an empty array (Collapse All).
 */
export function getKeysUpToLevel(keysByLevel: KeysByLevel, targetLevel: number): string[] {
  const result: string[] = [];
  for (let lvl = 0; lvl <= targetLevel; lvl++) {
    if (keysByLevel[lvl]) {
      result.push(...keysByLevel[lvl]);
    }
  }
  return result;
}

```

---

### 3. Granular Control Bar Component

Build a segmented button group reflecting the grouping schema:

```tsx
import React, { useMemo, useState, useCallback } from 'react';
import { groupByHierarchy } from './groupByHierarchy';
import { ControlledRecursiveAccordion } from './ControlledRecursiveAccordion';
import { getKeysByLevel, getKeysUpToLevel } from './getKeysByLevel';

const LEVEL_LABELS = [
  { level: -1, label: 'Collapse' },
  { level: 0, label: 'Level 1 (User)' },
  { level: 1, label: 'Level 2 (Status)' },
  { level: 2, label: 'Level 3 (Priority)' },
];

export function GranularAccordionDashboard({ todos }: { todos: any[] }) {
  const groupedData = useMemo(() => {
    return groupByHierarchy(todos, [
      'userId',
      (t) => (t.completed ? 'Completed' : 'In Progress'),
      'priority',
    ]);
  }, [todos]);

  // Pre-calculate keys partitioned by their level
  const keysByLevel = useMemo(() => {
    return getKeysByLevel(groupedData, 'group');
  }, [groupedData]);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Expand or collapse up to a specific level depth
  const handleSetLevel = (targetLevel: number) => {
    const targetKeys = getKeysUpToLevel(keysByLevel, targetLevel);
    setExpandedKeys(targetKeys);
  };

  const handleToggleKey = useCallback((toggledKey: string) => {
    setExpandedKeys((prev) =>
      prev.includes(toggledKey)
        ? prev.filter((k) => k !== toggledKey)
        : [...prev, toggledKey]
    );
  }, []);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Task Hierarchy</h2>
          <p className="text-xs text-slate-500">
            {expandedKeys.length} section(s) currently open
          </p>
        </div>

        {/* Level Buttons / Segmented Control */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {LEVEL_LABELS.map(({ level, label }) => {
            const expectedKeys = getKeysUpToLevel(keysByLevel, level);
            const isActive =
              level === -1
                ? expandedKeys.length === 0
                : expectedKeys.length > 0 &&
                  expectedKeys.every((k) => expandedKeys.includes(k)) &&
                  !keysByLevel[level + 1]?.some((k) => expandedKeys.includes(k));

            return (
              <button
                key={level}
                type="button"
                onClick={() => handleSetLevel(level)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <ControlledRecursiveAccordion
        data={groupedData}
        expandedKeys={expandedKeys}
        onToggleKey={handleToggleKey}
        labelFormatters={{
          0: (id) => `Developer: ${id.toUpperCase()}`,
          2: (p) => `${p} Priority`,
        }}
      />
    </div>
  );
}

```

---

### How It Operates

* **Level `-1` ("Collapse"):** Evaluates `getKeysUpToLevel(keysByLevel, -1)`, returning `[]`. This immediately closes all nodes and triggers `unmountOnCollapse` teardown.
* **Level `0` ("User"):** Injects only `keysByLevel[0]`. Only the top-level developer headers expand; nested status sections remain closed and unmounted.
* **Level `1` ("Status"):** Unions `keysByLevel[0]` and `keysByLevel[1]`. Both developer headers and status groups open, keeping priority leaf-groups closed.
* **Level `2` ("Priority"):** Unrolls every branch down to the terminal items.

How do I implement a search filter that automatically expands only the accordion branches containing matching todos?

To implement a search filter that automatically expands matching branches, the system must accomplish three things simultaneously:

1. **Prune the Tree**: Filter out leaf items that do not match the query and prune any branch nodes that contain zero matches.
2. **Collect Ancestor Paths**: Identify every branch path prefix that leads to a matching leaf item.
3. **Auto-Expand on Search**: Synchronize `expandedKeys` with the matched path set whenever a query is active, while restoring user-controlled state when the query is cleared.

---

### 1. The Recursive Filter & Path Collector Utility

This single-pass recursive traversal filters the grouped hierarchy and returns both the **pruned tree** and the **set of ancestor keys** that need expansion.

```typescript
import type { GroupedResult } from './groupByHierarchy';
import type { Todo } from './RecursiveAccordionGroup';

export interface FilterResult {
  filteredData: GroupedResult<Todo> | Todo[] | null;
  matchedKeys: string[];
  totalMatches: number;
}

/**
 * Recursively filters a grouped todo tree by search term and collects
 * all ancestor accordion keys leading to matches.
 */
export function filterAndCollectMatchingPaths(
  node: GroupedResult<Todo> | Todo[],
  query: string,
  pathPrefix = 'group'
): FilterResult {
  const normalizedQuery = query.trim().toLowerCase();

  // Base Case: Leaf list of Todos
  if (Array.isArray(node)) {
    if (!normalizedQuery) {
      return { filteredData: node, matchedKeys: [], totalMatches: node.length };
    }

    const matchedTodos = node.filter((todo) =>
      todo.title.toLowerCase().includes(normalizedQuery)
    );

    return {
      filteredData: matchedTodos.length > 0 ? matchedTodos : null,
      matchedKeys: [],
      totalMatches: matchedTodos.length,
    };
  }

  // Recursive Branch Node
  const filteredBranch: GroupedResult<Todo> = {};
  const matchedKeys: string[] = [];
  let totalMatches = 0;

  for (const [groupKey, subData] of Object.entries(node)) {
    const currentPath = `${pathPrefix}-${groupKey}`;

    const childResult = filterAndCollectMatchingPaths(
      subData,
      normalizedQuery,
      currentPath
    );

    // If any descendant matched, keep this branch and record its key
    if (childResult.filteredData !== null && childResult.totalMatches > 0) {
      filteredBranch[groupKey] = childResult.filteredData;
      totalMatches += childResult.totalMatches;

      // When searching, expand this branch and all matching child paths
      if (normalizedQuery) {
        matchedKeys.push(currentPath, ...childResult.matchedKeys);
      }
    }
  }

  return {
    filteredData: Object.keys(filteredBranch).length > 0 ? filteredBranch : null,
    matchedKeys,
    totalMatches,
  };
}

```

---

### 2. Search Bar with Text Highlighting

A small helper component to highlight the matched substring inside the leaf item text:

```tsx
import React from 'react';

export function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-amber-200 px-0.5 text-slate-900">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

```

---

### 3. Integrated Dashboard Implementation

This component manages the search state, computes the filtered data via `useMemo`, and automatically overrides `expandedKeys` during an active query.

```tsx
import React, { useState, useMemo, useEffect } from 'react';
import { groupByHierarchy } from './groupByHierarchy';
import { ControlledRecursiveAccordion } from './ControlledRecursiveAccordion';
import { filterAndCollectMatchingPaths } from './filterAndCollectMatchingPaths';
import { HighlightMatch } from './HighlightMatch';

const SAMPLE_TODOS = [
  { id: 1, userId: 'u1', title: 'Setup CI/CD pipeline', completed: false, priority: 'high' },
  { id: 2, userId: 'u2', title: 'Write unit tests for Auth', completed: true, priority: 'medium' },
  { id: 3, userId: 'u1', title: 'Configure ESLint & Prettier', completed: true, priority: 'low' },
  { id: 4, userId: 'u3', title: 'Update README with API specs', completed: false, priority: 'low' },
  { id: 5, userId: 'u2', title: 'Deploy staging build to AWS', completed: false, priority: 'high' },
  { id: 6, userId: 'u1', title: 'Fix CSS Grid layout shift', completed: false, priority: 'medium' },
];

export function SearchableAccordionDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 1. Initial multi-level grouped tree
  const rawGroupedData = useMemo(() => {
    return groupByHierarchy(SAMPLE_TODOS, [
      'userId',
      (t) => (t.completed ? 'Completed' : 'In Progress'),
      'priority',
    ]);
  }, []);

  // 2. Filter tree and derive required expanded paths
  const { filteredData, matchedKeys, totalMatches } = useMemo(() => {
    return filterAndCollectMatchingPaths(rawGroupedData, searchQuery, 'group');
  }, [rawGroupedData, searchQuery]);

  // 3. Auto-expand matching branches when a search query is active
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setExpandedKeys(matchedKeys);
    } else {
      // Collapse when search is cleared (or restore previous default)
      setExpandedKeys([]);
    }
  }, [searchQuery, matchedKeys]);

  const handleToggleKey = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Search Input Bar */}
      <div className="mb-6 space-y-2">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks (e.g. 'CI/CD', 'CSS', 'Auth')..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pl-10 text-sm placeholder-slate-400 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {searchQuery.trim()
              ? `${totalMatches} match${totalMatches === 1 ? '' : 'es'} found`
              : 'All tasks displayed'}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Render Filtered Tree or Empty State */}
      {filteredData ? (
        <ControlledRecursiveAccordion
          data={filteredData}
          expandedKeys={expandedKeys}
          onToggleKey={handleToggleKey}
          labelFormatters={{
            0: (id) => `Developer: ${id.toUpperCase()}`,
            2: (p) => `${p} Priority`,
          }}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No tasks found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

```

---

### How This Works Behind the Scenes

1. **Bottom-Up Path Accumulation**: If a leaf node matches (e.g., `"Fix CSS Grid layout shift"` under `u1` $\rightarrow$ `In Progress` $\rightarrow$ `medium`), the function includes `group-u1`, `group-u1-In Progress`, and `group-u1-In Progress-medium` in `matchedKeys`.
2. **Dead Branch Pruning**: Non-matching groups return `null`, so only parents with matching items are mounted into the DOM.
3. **Transition Coordination**: Because the compound `<Accordion>` uses `unmountOnCollapse` with CSS Grid row animations, clearing the search collapses and unmounts the inactive subtrees without layout pops or orphaned elements.
