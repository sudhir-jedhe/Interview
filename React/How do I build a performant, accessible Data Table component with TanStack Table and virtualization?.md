Building a performant, accessible Data Table requires combining headless state and column management (**TanStack Table v8**), DOM node recycling for massive datasets (**TanStack Virtual v3**), and strict adherence to **WAI-ARIA grid/table patterns**.

---

### 1. Installation

```bash
npm install @tanstack/react-table @tanstack/react-virtual

```

---

### 2. Complete Virtualized Accessible Data Table Component (`DataTable.tsx`)

```tsx
import React, { useRef, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  estimateRowHeight?: number;
  tableHeight?: number | string;
  caption: string;
}

export function DataTable<TData>({
  data,
  columns,
  estimateRowHeight = 48,
  tableHeight = '500px',
  caption,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 1. Initialize TanStack Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();

  // 2. Initialize TanStack Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 10, // Buffer items rendered outside view
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Padding calculations for scroll positioning
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif' }}>
      {/* Global Filter Bar */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="search"
          aria-label="Filter all records"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            minWidth: '260px',
          }}
        />
        <div aria-live="polite" aria-atomic="true" style={{ fontSize: '13px', color: '#64748b' }}>
          Showing {rows.length.toLocaleString()} of {data.length.toLocaleString()} records
        </div>
      </div>

      {/* Scrollable Virtual Container */}
      <div
        ref={tableContainerRef}
        tabIndex={0}
        role="region"
        aria-label={caption}
        style={{
          height: tableHeight,
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <caption style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            {caption}
          </caption>

          {/* Sticky Accessible Header */}
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #cbd5e1',
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        padding: '12px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                      aria-sort={
                        sortDir === 'asc'
                          ? 'ascending'
                          : sortDir === 'desc'
                          ? 'descending'
                          : 'none'
                      }
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: '100%',
                            fontWeight: 'inherit',
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span aria-hidden="true" style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {sortDir === 'asc' ? ' ▲' : sortDir === 'desc' ? ' ▼' : ' ⇅'}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Virtualized Table Body */}
          <tbody>
            {/* Top Spacer for Unrendered Rows */}
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px`, padding: 0, border: 'none' }} colSpan={columns.length} />
              </tr>
            )}

            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <tr
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: virtualRow.index % 2 === 0 ? '#ffffff' : '#fafafa',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: '#0f172a',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Bottom Spacer for Unrendered Rows */}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px`, padding: 0, border: 'none' }} colSpan={columns.length} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

---

### 3. Usage Example with Column Definitions & 10,000 Rows

```tsx
import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  salary: number;
}

// Generate dummy data
const generateSampleData = (count: number): Employee[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Engineer', 'Product Manager', 'Designer', 'Data Analyst'][i % 4],
    status: i % 3 === 0 ? 'Inactive' : 'Active',
    salary: 60000 + (i % 50) * 1500,
  }));
};

export function EmployeeDashboard() {
  const data = useMemo(() => generateSampleData(10000), []);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Employee Name',
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
      },
      {
        accessorKey: 'role',
        header: 'Department / Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: status === 'Active' ? '#dcfce7' : '#f1f5f9',
                color: status === 'Active' ? '#15803d' : '#475569',
              }}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'salary',
        header: 'Annual Compensation',
        cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
      },
    ],
    []
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <DataTable
        data={data}
        columns={columns}
        caption="Employee Payroll and Directory Information"
        tableHeight="550px"
        estimateRowHeight={48}
      />
    </div>
  );
}

```

---

### Key Accessibility & Performance Highlights

* **WAI-ARIA `aria-sort`:** Header columns expose `"ascending"`, `"descending"`, or `"none"` dynamically, ensuring screen readers (NVDA, VoiceOver) announce sorting changes immediately.
* **Hidden `<caption>`:** Enables screen reader users jumping to the table to instantly know what tabular context they are viewing.
* **Scrollable Region Landmark:** The container `<div>` has `role="region"`, `tabIndex={0}`, and an accessible label so keyboard-only users can focus and scroll the virtual window using directional arrows.
* **Live Announcement (`aria-live="polite"`):** Filter state updates dynamically announce how many matching rows exist without stealing focus.
* **`paddingTop` / `paddingBottom` Spacers:** Maintains native browser scrollbar physics and momentum scrolling across 10,000+ rows while keeping DOM nodes under ~30 active elements.
