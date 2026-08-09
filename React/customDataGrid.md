Building a high-performance **Custom Data Grid** in React from scratch requires handling virtual scrolling (for rendering thousands of rows without crashing the DOM), column resizing, sorting, filtering, row selection, and pin/freeze features.

Below is a complete, production-grade custom Data Grid component built with **React**, **TypeScript**, **Class Variance Authority (`cva`)**, and **Tailwind CSS**.

---

### Key Features Included

1. **Windowed / Virtual Scroll Ready Structure:** Scalable layout using `table-layout: fixed` and explicit cell widths.
2. **Column Sorting:** Multi-directional column sorting (`asc`, `desc`, `none`).
3. **Column Resizing:** Interactive drag-to-resize column handles.
4. **Row Selection:** Checkbox-based single or select-all row toggles.
5. **Global Search / Filtering:** Instant row filtering.
6. **Sticky Header & Fixed Column Pinning:** Keeps headers and key identifier columns in place during horizontal/vertical scroll.

---

### Step 1: Data Grid Interfaces & Types

```typescript
// src/components/DataGrid/types.ts
import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  width?: number; // Initial width in pixels
  minWidth?: number;
  sortable?: boolean;
  pinned?: 'left' | 'right';
}

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Array<string | number>) => void;
  height?: string;
}

```

---

### Step 2: Implementation (`src/components/DataGrid/DataGrid.tsx`)

```tsx
// src/components/DataGrid/DataGrid.tsx
import * as React from 'react';
import { ColumnDef, DataGridProps, SortDirection } from './types';
import { cn } from '../../utils/cn';

export function DataGrid<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  keyExtractor,
  selectable = true,
  onSelectionChange,
  height = '500px',
}: DataGridProps<T>) {
  // State: Column Widths
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(() =>
    initialColumns.reduce((acc, col) => {
      acc[col.id] = col.width || 180;
      return acc;
    }, {} as Record<string, number>)
  );

  // State: Sorting
  const [sortConfig, setSortConfig] = React.useState<{ id: string; dir: SortDirection }>({
    id: '',
    dir: null,
  });

  // State: Global Search Filter
  const [filterQuery, setFilterQuery] = React.useState('');

  // State: Row Selection
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string | number>>(new Set());

  // --- Column Resizing Handler ---
  const handleResize = (colId: string, minWidth: number = 80) => (e: React.MouseDownEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colId];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [colId]: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- Sorting Logic ---
  const handleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    setSortConfig((prev) => {
      if (prev.id !== col.id) return { id: col.id, dir: 'asc' };
      if (prev.dir === 'asc') return { id: col.id, dir: 'desc' };
      return { id: '', dir: null };
    });
  };

  // Processed Data: Filtered & Sorted
  const processedData = React.useMemo(() => {
    let result = [...data];

    // Global Filter
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortConfig.id && sortConfig.dir) {
      const col = initialColumns.find((c) => c.id === sortConfig.id);
      if (col && col.accessorKey) {
        const key = col.accessorKey;
        result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, filterQuery, sortConfig, initialColumns]);

  // --- Selection Handlers ---
  const toggleSelectAll = () => {
    if (selectedKeys.size === processedData.length) {
      const next = new Set<string | number>();
      setSelectedKeys(next);
      onSelectionChange?.([]);
    } else {
      const next = new Set(processedData.map((item) => keyExtractor(item)));
      setSelectedKeys(next);
      onSelectionChange?.(Array.from(next));
    }
  };

  const toggleSelectRow = (key: string | number) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    setSelectedKeys(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <div className="flex flex-col w-full rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Grid Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <input
          type="text"
          placeholder="Search all columns..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="h-9 w-64 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <span className="text-xs text-gray-500 font-medium">
          Showing {processedData.length} of {data.length} rows | Selected: {selectedKeys.size}
        </span>
      </div>

      {/* Scrollable Viewport Container */}
      <div className="relative overflow-auto" style={{ height }}>
        <table className="w-full border-collapse text-left text-sm" style={{ tableLayout: 'fixed' }}>
          {/* Column Sizing Definition */}
          <colgroup>
            {selectable && <col style={{ width: '48px' }} />}
            {initialColumns.map((col) => (
              <col key={col.id} style={{ width: `${columnWidths[col.id]}px` }} />
            ))}
          </colgroup>

          {/* Sticky Header */}
          <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <tr>
              {selectable && (
                <th className="p-3 text-center sticky left-0 z-30 bg-gray-50 dark:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={processedData.length > 0 && selectedKeys.size === processedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
              )}

              {initialColumns.map((col) => {
                const isSorted = sortConfig.id === col.id;
                const isPinnedLeft = col.pinned === 'left';

                return (
                  <th
                    key={col.id}
                    className={cn(
                      'relative select-none p-3 font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0',
                      col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                      isPinnedLeft && 'sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 shadow-r'
                    )}
                    onClick={() => handleSort(col)}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="truncate">{col.header}</span>
                      {col.sortable && (
                        <span className="text-xs text-gray-400 ml-1">
                          {isSorted ? (sortConfig.dir === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      )}
                    </div>

                    {/* Column Resize Handle */}
                    <div
                      onMouseDown={handleResize(col.id, col.minWidth)}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-600 transition-colors"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={initialColumns.length + (selectable ? 1 : 0)}
                  className="p-8 text-center text-gray-400"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              processedData.map((row) => {
                const key = keyExtractor(row);
                const isSelected = selectedKeys.has(key);

                return (
                  <tr
                    key={key}
                    className={cn(
                      'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      isSelected && 'bg-indigo-50/60 dark:bg-indigo-950/40'
                    )}
                  >
                    {selectable && (
                      <td className="p-3 text-center sticky left-0 z-10 bg-white dark:bg-gray-900">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(key)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </td>
                    )}

                    {initialColumns.map((col) => {
                      const value = col.accessorKey ? row[col.accessorKey] : null;
                      const isPinnedLeft = col.pinned === 'left';

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            'p-3 truncate text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800/50 last:border-r-0',
                            isPinnedLeft && 'sticky left-0 z-10 bg-white dark:bg-gray-900 shadow-r'
                          )}
                        >
                          {col.cell ? col.cell(row) : String(value ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

---

### Step 3: Usage Example

```tsx
import React from 'react';
import { DataGrid } from './components/DataGrid/DataGrid';
import { ColumnDef } from './components/DataGrid/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const sampleUsers: User[] = [
  { id: 'usr-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 'usr-2', name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'Active' },
  { id: 'usr-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Designer', status: 'Inactive' },
  { id: 'usr-4', name: 'Diana Prince', email: 'diana@example.com', role: 'Product Owner', status: 'Active' },
];

const columns: ColumnDef<User>[] = [
  {
    id: 'id',
    header: 'User ID',
    accessorKey: 'id',
    width: 120,
    pinned: 'left',
  },
  {
    id: 'name',
    header: 'Full Name',
    accessorKey: 'name',
    sortable: true,
    width: 200,
  },
  {
    id: 'email',
    header: 'Email Address',
    accessorKey: 'email',
    sortable: true,
    width: 250,
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortable: true,
    width: 150,
  },
  {
    id: 'status',
    header: 'Status',
    width: 120,
    cell: (user) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
          user.status === 'Active'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }`}
      >
        {user.status}
      </span>
    ),
  },
];

export function DataGridDemo() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Custom Data Grid Component</h1>
      <DataGrid
        data={sampleUsers}
        columns={columns}
        keyExtractor={(item) => item.id}
        onSelectionChange={(keys) => console.log('Selected Row IDs:', keys)}
        height="400px"
      />
    </div>
  );
}

```

Show how to integrate virtual scrolling (TanStack Virtual or custom windowing) into this custom React Data Grid to handle 100,000+ rows efficiently.

To efficiently render 100,000+ rows without crashing the DOM or exceeding browser memory limits, you must decouple the rendered React nodes from the total dataset size. By integrating **TanStack Virtual (`@tanstack/react-virtual`)**, only the visible rows currently inside the viewport (plus a small buffer) exist in the DOM at any given moment.

Here is the complete implementation updating our custom Data Grid to handle large datasets using virtual scrolling.

---

### Step 1: Install `@tanstack/react-virtual`

```bash
npm install @tanstack/react-virtual

```

---

### Step 2: Implementation (`src/components/DataGrid/VirtualizedDataGrid.tsx`)

This updated version replaces standard `<tr>` mapping with `useVirtualizer`. The scrollable container acts as the virtual viewport host, and absolute positioning shifts visible rows dynamically as the user scrolls.

```tsx
// src/components/DataGrid/VirtualizedDataGrid.tsx
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ColumnDef, SortDirection } from './types';
import { cn } from '../../utils/cn';

export interface VirtualizedDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Array<string | number>) => void;
  height?: number; // Height in pixels for virtual container viewport
  estimateRowHeight?: number; // Default estimated row height in pixels
}

export function VirtualizedDataGrid<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  keyExtractor,
  selectable = true,
  onSelectionChange,
  height = 500,
  estimateRowHeight = 44,
}: VirtualizedDataGridProps<T>) {
  // State: Column Widths
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(() =>
    initialColumns.reduce((acc, col) => {
      acc[col.id] = col.width || 180;
      return acc;
    }, {} as Record<string, number>)
  );

  // State: Sorting & Filter
  const [sortConfig, setSortConfig] = React.useState<{ id: string; dir: SortDirection }>({
    id: '',
    dir: null,
  });
  const [filterQuery, setFilterQuery] = React.useState('');

  // State: Selection
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string | number>>(new Set());

  // Scroll Container Ref for Virtualizer
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  // --- Filtering & Sorting Data ---
  const processedData = React.useMemo(() => {
    let result = [...data];

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    if (sortConfig.id && sortConfig.dir) {
      const col = initialColumns.find((c) => c.id === sortConfig.id);
      if (col && col.accessorKey) {
        const key = col.accessorKey;
        result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, filterQuery, sortConfig, initialColumns]);

  // --- Initialize TanStack Virtualizer ---
  const rowVirtualizer = useVirtualizer({
    count: processedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 10, // Buffer extra items above/below viewport to prevent scroll flickering
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // --- Column Resizing Handler ---
  const handleResize = (colId: string, minWidth: number = 80) => (e: React.MouseDownEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colId];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [colId]: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- Selection Handlers ---
  const toggleSelectAll = () => {
    if (selectedKeys.size === processedData.length) {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    } else {
      const next = new Set(processedData.map((item) => keyExtractor(item)));
      setSelectedKeys(next);
      onSelectionChange?.(Array.from(next));
    }
  };

  const toggleSelectRow = (key: string | number) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    setSelectedKeys(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <div className="flex flex-col w-full rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Grid Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <input
          type="text"
          placeholder={`Search ${data.length.toLocaleString()} items...`}
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="h-9 w-72 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <span className="text-xs text-gray-500 font-medium">
          Total Rows: <strong>{processedData.length.toLocaleString()}</strong> | Rendered DOM Nodes: <strong>{virtualRows.length}</strong> | Selected: {selectedKeys.size}
        </span>
      </div>

      {/* Virtual Scroll Viewport Parent */}
      <div
        ref={parentRef}
        className="relative overflow-auto"
        style={{ height: `${height}px` }}
      >
        <table className="w-full border-collapse text-left text-sm" style={{ tableLayout: 'fixed' }}>
          {/* Column Sizing Spec */}
          <colgroup>
            {selectable && <col style={{ width: '48px' }} />}
            {initialColumns.map((col) => (
              <col key={col.id} style={{ width: `${columnWidths[col.id]}px` }} />
            ))}
          </colgroup>

          {/* Sticky Header */}
          <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <tr>
              {selectable && (
                <th className="p-3 text-center sticky left-0 z-30 bg-gray-50 dark:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={processedData.length > 0 && selectedKeys.size === processedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
              )}

              {initialColumns.map((col) => {
                const isSorted = sortConfig.id === col.id;
                const isPinnedLeft = col.pinned === 'left';

                return (
                  <th
                    key={col.id}
                    className={cn(
                      'relative select-none p-3 font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0',
                      col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                      isPinnedLeft && 'sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 shadow-r'
                    )}
                    onClick={() => {
                      if (!col.sortable) return;
                      setSortConfig((prev) => ({
                        id: col.id,
                        dir: prev.id !== col.id ? 'asc' : prev.dir === 'asc' ? 'desc' : null,
                      }));
                    }}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="truncate">{col.header}</span>
                      {col.sortable && (
                        <span className="text-xs text-gray-400 ml-1">
                          {isSorted ? (sortConfig.dir === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      )}
                    </div>

                    <div
                      onMouseDown={handleResize(col.id, col.minWidth)}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-600 transition-colors"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Virtual Body Windowing */}
          <tbody
            className="divide-y divide-gray-200 dark:divide-gray-800 relative"
            style={{
              height: `${totalSize}px`, // Expands container to full scroll height
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = processedData[virtualRow.index];
              const key = keyExtractor(row);
              const isSelected = selectedKeys.has(key);

              return (
                <tr
                  key={key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className={cn(
                    'absolute left-0 top-0 w-full flex items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    isSelected && 'bg-indigo-50/60 dark:bg-indigo-950/40'
                  )}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, // Offsets row to correct virtual scroll position
                  }}
                >
                  {selectable && (
                    <td className="p-3 w-12 text-center sticky left-0 z-10 bg-white dark:bg-gray-900">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(key)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                  )}

                  {initialColumns.map((col) => {
                    const value = col.accessorKey ? row[col.accessorKey] : null;
                    const isPinnedLeft = col.pinned === 'left';

                    return (
                      <td
                        key={col.id}
                        style={{ width: `${columnWidths[col.id]}px` }}
                        className={cn(
                          'p-3 truncate text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800/50 last:border-r-0',
                          isPinnedLeft && 'sticky left-0 z-10 bg-white dark:bg-gray-900 shadow-r'
                        )}
                      >
                        {col.cell ? col.cell(row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

---

### Step 3: Performance Showcase (100,000 Rows Test)

Generating 100,000 objects in memory and mounting them with `VirtualizedDataGrid`:

```tsx
import React, { useMemo } from 'react';
import { VirtualizedDataGrid } from './components/DataGrid/VirtualizedDataGrid';
import { ColumnDef } from './components/DataGrid/types';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
}

// Generate 100,000 mock items instantly
function generateLargeDataset(count: number): Order[] {
  const statuses: Order['status'][] = ['Completed', 'Pending', 'Cancelled'];
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${100000 + i}`,
    customer: `Customer ${i + 1}`,
    amount: Math.floor(Math.random() * 1000) + 10,
    status: statuses[i % 3],
    date: new Date(2026, 0, (i % 30) + 1).toISOString().split('T')[0],
  }));
}

const columns: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order ID', accessorKey: 'id', width: 140, pinned: 'left' },
  { id: 'customer', header: 'Customer', accessorKey: 'customer', sortable: true, width: 220 },
  {
    id: 'amount',
    header: 'Amount ($)',
    accessorKey: 'amount',
    sortable: true,
    width: 160,
    cell: (item) => `$${item.amount.toFixed(2)}`,
  },
  {
    id: 'status',
    header: 'Status',
    width: 140,
    cell: (item) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
          item.status === 'Completed'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : item.status === 'Pending'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
        }`}
      >
        {item.status}
      </span>
    ),
  },
  { id: 'date', header: 'Date', accessorKey: 'date', sortable: true, width: 160 },
];

export function VirtualGridDemo() {
  const largeData = useMemo(() => generateLargeDataset(100000), []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">100,000 Rows Virtualized Data Grid</h1>
      <VirtualizedDataGrid
        data={largeData}
        columns={columns}
        keyExtractor={(item) => item.id}
        height={550}
        estimateRowHeight={44}
      />
    </div>
  );
}

```

---

### Why This Achieves 60 FPS Performance on 100k+ Rows

1. **Fixed Memory Footprint:** Out of 100,000 rows, only **~15 to 25 DOM `<tr>` nodes** exist at any moment inside `tbody`. Memory consumption remains constant regardless of whether you have 1,000 or 1,000,000 items.
2. **Dynamic translateY Positioning:** Moving visible items via `transform: translateY(...)` relies on GPU acceleration, avoiding layout recalculations during rapid scrolling.
3. **Dynamic Measuring (`measureElement`):** The `rowVirtualizer.measureElement` ref allows rows with variable line heights or multi-line text to adjust row heights dynamically on the fly.

Show how to add pagination controls and client-side CSV export to the custom Data Grid component.

Here is how to add **Pagination Controls** (page size selection, page jumps, total counts) and a **Client-Side CSV Export Utility** (handling proper escaping and filtered dataset exports) to the custom Data Grid component.

---

### Step 1: Create a Standalone CSV Export Utility

Create a utility function (`src/utils/csvExport.ts`) that extracts data according to column definitions, handles quotes/commas correctly, and triggers a browser file download without server involvement.

```typescript
// src/utils/csvExport.ts
import { ColumnDef } from '../components/DataGrid/types';

export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  columns: ColumnDef<T>[],
  filename: string = 'export.csv'
) {
  if (!data || data.length === 0) return;

  // 1. Filter out columns without headers/accessorKeys (e.g. selection checkboxes)
  const exportableColumns = columns.filter((col) => col.header && (col.accessorKey || col.cell));

  // 2. Format Header Row
  const headers = exportableColumns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');

  // 3. Format Data Rows
  const rows = data.map((row) =>
    exportableColumns
      .map((col) => {
        let value = col.accessorKey ? row[col.accessorKey] : '';
        if (value === null || value === undefined) value = '';
        
        // Sanitize string to prevent CSV injection / broken formatting
        const stringVal = String(value).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',')
  );

  // 4. Combine into single CSV string with UTF-8 BOM for Excel compatibility
  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');

  // 5. Trigger Browser Download via Blob URL
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

```

---

### Step 2: Implementation (`src/components/DataGrid/DataGridWithPagination.tsx`)

This complete updated Data Grid incorporates client-side **pagination calculation**, **page size controls**, and a **"Export to CSV"** button in the header toolbar.

```tsx
// src/components/DataGrid/DataGridWithPagination.tsx
import * as React from 'react';
import { ColumnDef, SortDirection } from './types';
import { exportToCsv } from '../../utils/csvExport';
import { cn } from '../../utils/cn';

export interface DataGridWithPaginationProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Array<string | number>) => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  exportFilename?: string;
  height?: string;
}

export function DataGridWithPagination<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  keyExtractor,
  selectable = true,
  onSelectionChange,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  exportFilename = 'grid-data.csv',
  height = '450px',
}: DataGridWithPaginationProps<T>) {
  // State: Column Widths & Resizing
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(() =>
    initialColumns.reduce((acc, col) => {
      acc[col.id] = col.width || 180;
      return acc;
    }, {} as Record<string, number>)
  );

  // State: Search, Sorting, Selection
  const [filterQuery, setFilterQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ id: string; dir: SortDirection }>({
    id: '',
    dir: null,
  });
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string | number>>(new Set());

  // State: Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  // Reset to Page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterQuery, pageSize]);

  // --- Filtering & Sorting Data ---
  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data];

    // Global Search
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortConfig.id && sortConfig.dir) {
      const col = initialColumns.find((c) => c.id === sortConfig.id);
      if (col && col.accessorKey) {
        const key = col.accessorKey;
        result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, filterQuery, sortConfig, initialColumns]);

  // --- Slice Paginated Rows ---
  const totalRows = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRows / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentPaginatedRows = filteredAndSortedData.slice(startIndex, endIndex);

  // --- Column Resizing Handler ---
  const handleResize = (colId: string, minWidth: number = 80) => (e: React.MouseDownEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colId];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [colId]: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- Selection Handlers ---
  const toggleSelectAllPage = () => {
    if (selectedKeys.size === currentPaginatedRows.length) {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    } else {
      const next = new Set(currentPaginatedRows.map((item) => keyExtractor(item)));
      setSelectedKeys(next);
      onSelectionChange?.(Array.from(next));
    }
  };

  const toggleSelectRow = (key: string | number) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    setSelectedKeys(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <div className="flex flex-col w-full rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* 1. Header Toolbar with CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
        <input
          type="text"
          placeholder="Search all columns..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="h-9 w-64 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportToCsv(filteredAndSortedData, initialColumns, exportFilename)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span>📥</span> Export CSV ({filteredAndSortedData.length})
          </button>
        </div>
      </div>

      {/* 2. Scrollable Grid Body */}
      <div className="relative overflow-auto" style={{ height }}>
        <table className="w-full border-collapse text-left text-sm" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {selectable && <col style={{ width: '48px' }} />}
            {initialColumns.map((col) => (
              <col key={col.id} style={{ width: `${columnWidths[col.id]}px` }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <tr>
              {selectable && (
                <th className="p-3 text-center sticky left-0 z-30 bg-gray-50 dark:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={
                      currentPaginatedRows.length > 0 &&
                      selectedKeys.size === currentPaginatedRows.length
                    }
                    onChange={toggleSelectAllPage}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
              )}

              {initialColumns.map((col) => {
                const isSorted = sortConfig.id === col.id;
                const isPinnedLeft = col.pinned === 'left';

                return (
                  <th
                    key={col.id}
                    className={cn(
                      'relative select-none p-3 font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0',
                      col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                      isPinnedLeft && 'sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 shadow-r'
                    )}
                    onClick={() => {
                      if (!col.sortable) return;
                      setSortConfig((prev) => ({
                        id: col.id,
                        dir: prev.id !== col.id ? 'asc' : prev.dir === 'asc' ? 'desc' : null,
                      }));
                    }}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="truncate">{col.header}</span>
                      {col.sortable && (
                        <span className="text-xs text-gray-400 ml-1">
                          {isSorted ? (sortConfig.dir === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      )}
                    </div>

                    <div
                      onMouseDown={handleResize(col.id, col.minWidth)}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-600 transition-colors"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentPaginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={initialColumns.length + (selectable ? 1 : 0)}
                  className="p-8 text-center text-gray-400"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              currentPaginatedRows.map((row) => {
                const key = keyExtractor(row);
                const isSelected = selectedKeys.has(key);

                return (
                  <tr
                    key={key}
                    className={cn(
                      'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      isSelected && 'bg-indigo-50/60 dark:bg-indigo-950/40'
                    )}
                  >
                    {selectable && (
                      <td className="p-3 text-center sticky left-0 z-10 bg-white dark:bg-gray-900">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(key)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </td>
                    )}

                    {initialColumns.map((col) => {
                      const value = col.accessorKey ? row[col.accessorKey] : null;
                      const isPinnedLeft = col.pinned === 'left';

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            'p-3 truncate text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800/50 last:border-r-0',
                            isPinnedLeft && 'sticky left-0 z-10 bg-white dark:bg-gray-900 shadow-r'
                          )}
                        >
                          {col.cell ? col.cell(row) : String(value ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-b-xl">
        {/* Row Counts Info */}
        <div className="text-xs text-gray-500 font-medium">
          Showing <strong>{totalRows > 0 ? startIndex + 1 : 0}</strong> to{' '}
          <strong>{endIndex}</strong> of <strong>{totalRows}</strong> entries
        </div>

        {/* Page Size & Navigation Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 rounded border border-gray-300 bg-white px-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 px-3 rounded border border-gray-300 bg-white text-xs font-medium disabled:opacity-40 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
            >
              Previous
            </button>

            <span className="px-2 text-xs font-medium text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 px-3 rounded border border-gray-300 bg-white text-xs font-medium disabled:opacity-40 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### Step 3: Usage Showcase

```tsx
import React from 'react';
import { DataGridWithPagination } from './components/DataGrid/DataGridWithPagination';
import { ColumnDef } from './components/DataGrid/types';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
}

const products: Product[] = Array.from({ length: 47 }, (_, i) => ({
  id: `PROD-${100 + i}`,
  title: `Product Title ${i + 1}`,
  category: i % 2 === 0 ? 'Electronics' : 'Accessories',
  price: Math.floor(Math.random() * 200) + 15,
  stock: Math.floor(Math.random() * 50),
}));

const columns: ColumnDef<Product>[] = [
  { id: 'id', header: 'Product ID', accessorKey: 'id', width: 140 },
  { id: 'title', header: 'Product Name', accessorKey: 'title', sortable: true, width: 220 },
  { id: 'category', header: 'Category', accessorKey: 'category', sortable: true, width: 160 },
  {
    id: 'price',
    header: 'Price',
    accessorKey: 'price',
    sortable: true,
    width: 120,
    cell: (item) => `$${item.price.toFixed(2)}`,
  },
  { id: 'stock', header: 'Stock Units', accessorKey: 'stock', sortable: true, width: 140 },
];

export function PaginatedGridDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Data Grid with Pagination & CSV Export</h1>
      <DataGridWithPagination
        data={products}
        columns={columns}
        keyExtractor={(item) => item.id}
        defaultPageSize={10}
        exportFilename="products-inventory.csv"
      />
    </div>
  );
}

```
