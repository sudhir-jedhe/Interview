Implementing accessible multi-row selection and batch action toolbars in TanStack Table (v8) requires:

1. **Indeterminate Checkbox Component**: Exposes correct native `indeterminate` DOM properties and `aria-checked="mixed"`.
2. **Row Selection State (`rowSelection`)**: Tracks selected row IDs.
3. **Floating / Sticky Action Bar**: Accessible via screen readers (`aria-live="polite"`), announce selection counts, and manage keyboard focus.
4. **Accessible Selection Cells**: Explicit `aria-label`s for both header "select all" and row-level checkboxes.

---

### 1. Accessible Indeterminate Checkbox (`IndeterminateCheckbox.tsx`)

HTML `<input type="checkbox">` elements cannot have an indeterminate state set via HTML attributes—it must be assigned directly to the underlying DOM node's `indeterminate` property.

```tsx
import React, { useEffect, useRef, HTMLProps } from 'react';

interface IndeterminateCheckboxProps extends HTMLProps<HTMLInputElement> {
  indeterminate?: boolean;
}

export const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
  ({ indeterminate, className = '', ...rest }, forwardedRef) => {
    const defaultRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (forwardedRef as React.RefObject<HTMLInputElement>) || defaultRef;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = !rest.checked && Boolean(indeterminate);
      }
    }, [resolvedRef, indeterminate, rest.checked]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        className={`cursor-pointer w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${className}`}
        aria-checked={indeterminate ? 'mixed' : Boolean(rest.checked)}
        {...rest}
      />
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

```

---

### 2. Selection Column Definition Helper

Prepend this column definition to your table schema. It generates the header toggle (all/page) and row-level selection inputs:

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';

export function getSelectionColumn<TData>(): ColumnDef<TData, any> {
  return {
    id: 'select',
    size: 40,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <IndeterminateCheckbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all rows on current page"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={`Select row ${row.index + 1}`}
        />
      </div>
    ),
  };
}

```

---

### 3. Batch Action Toolbar (`BatchActionBar.tsx`)

This component renders an interactive floating toolbar with an `aria-live` region so assistive technologies announce changes to the selected count automatically.

```tsx
import React from 'react';

interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onClearSelection,
  onDeleteSelected,
  onExportSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label="Batch actions for selected records"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 z-50 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="text-sm font-medium pr-2 border-r border-slate-700">
        <span className="text-blue-400 font-semibold">{selectedCount}</span> of {totalCount} selected
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExportSelected}
          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Export CSV
        </button>

        <button
          type="button"
          onClick={onDeleteSelected}
          className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete Selected
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus:underline"
          aria-label="Deselect all rows"
        >
          Deselect All
        </button>
      </div>
    </div>
  );
};

```

---

### 4. Integration into Table (`SelectableDataTable.tsx`)

```tsx
import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import { getSelectionColumn } from './getSelectionColumn';
import { BatchActionBar } from './BatchActionBar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function SelectableDataTable() {
  const [data, setData] = useState<User[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { id: '3', name: 'Charlie Lee', email: 'charlie@example.com', role: 'Viewer' },
    { id: '4', name: 'Dana Scully', email: 'dana@example.com', role: 'Editor' },
  ]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const userColumns = useMemo<ColumnDef<User>[]>(
    () => [
      getSelectionColumn<User>(),
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: userColumns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    getRowId: (row) => row.id, // Stable row ID matching database primary key
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().flatRows;
  const selectedCount = selectedRows.length;

  const handleDeleteSelected = () => {
    const selectedIds = new Set(selectedRows.map((r) => r.original.id));
    setData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setRowSelection({}); // Reset selection
  };

  const handleExportSelected = () => {
    const exportData = selectedRows.map((r) => r.original);
    console.log('Exporting data:', exportData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-sm font-semibold text-slate-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isSelected = row.getIsSelected();
              return (
                <tr
                  key={row.id}
                  aria-selected={isSelected}
                  className={`border-b border-slate-100 transition-colors ${
                    isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 text-sm text-slate-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Batch Action Toolbar */}
      <BatchActionBar
        selectedCount={selectedCount}
        totalCount={data.length}
        onClearSelection={() => setRowSelection({})}
        onDeleteSelected={handleDeleteSelected}
        onExportSelected={handleExportSelected}
      />
    </div>
  );
}

```

---

### Key Accessibility Requirements Met

* **`aria-selected="true"` on `<tr>`:** Exposes whether a table row is active/selected to screen reader virtual cursors.
* **`aria-checked="mixed"`:** Informs screen reader users that a subset of rows is selected when the header checkbox is partially checked.
* **`role="toolbar"` & `aria-label`:** Structures the floating batch actions as a standard ARIA toolbar container.
* **`aria-live="polite"` Status:** Dynamically notifies users of selection counter changes without cutting off current screen reader speech.
* **`getRowId: (row) => row.id`:** Anchors row selections to persistent database IDs rather than transient zero-based row indexes (`0, 1, 2`), preventing wrong row selections across pagination and sort updates.
