Here is a complete, production-ready **Searchable Data Table** built with React and TypeScript. It includes client-side searching, column-based sorting, pagination, and status filtering without relying on external UI libraries.

---

### Implementation (`SearchableDataTable.tsx`)

```tsx
import React, { useState, useMemo } from 'react';

// --- Type Definitions ---
export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  filterKey?: keyof T;
  filterOptions?: string[];
  initialPageSize?: number;
}

type SortOrder = 'asc' | 'desc';

export function SearchableDataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  filterKey,
  filterOptions = [],
  initialPageSize = 5,
}: TableProps<T>) {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. FILTER & SEARCH
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status/Category Dropdown Filter
      if (filterKey && selectedFilter !== 'ALL') {
        if (String(item[filterKey]).toUpperCase() !== selectedFilter.toUpperCase()) {
          return false;
        }
      }

      // Multi-column Global Search
      if (searchTerm.trim() === '') return true;

      return searchKeys.some((key) => {
        const val = item[key];
        return val ? String(val).toLowerCase().includes(searchTerm.toLowerCase()) : false;
      });
    });
  }, [data, searchTerm, selectedFilter, filterKey, searchKeys]);

  // 2. SORT
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  // 3. PAGINATION
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // --- Handlers ---
  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {/* Controls Header: Search, Filter & Page Size */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ padding: '8px 12px', minWidth: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Category/Status Filter */}
          {filterKey && filterOptions.length > 0 && (
            <select value={selectedFilter} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px' }}>
              <option value="ALL">All Categories</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {/* Rows per page */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f5', borderBottom: '2px solid #ddd' }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => handleSort(col.key, col.sortable)}
                style={{
                  padding: '12px',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                {col.label}
                {col.sortable && (
                  <span style={{ marginLeft: '6px', fontSize: '12px', color: '#888' }}>
                    {sortKey === col.key ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map((col) => (
                  <td key={String(col.key)} style={{ padding: '12px' }}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                No records found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '14px', color: '#555' }}>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ padding: '6px 12px', fontWeight: 'bold' }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

```

---

### Example Usage (`App.tsx`)

```tsx
import React from 'react';
import { SearchableDataTable, Column } from './SearchableDataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const USERS_DATA: User[] = [
  { id: 1, name: 'Sudhir Jedhe', email: 'sudhir@example.com', role: 'UI Lead', status: 'Active' },
  { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'Developer', status: 'Active' },
  { id: 3, name: 'Bob Jones', email: 'bob@example.com', role: 'Designer', status: 'Inactive' },
  { id: 4, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Product Manager', status: 'Active' },
  { id: 5, name: 'David Miller', email: 'david@example.com', role: 'Developer', status: 'Inactive' },
  { id: 6, name: 'Eva Green', email: 'eva@example.com', role: 'QA Lead', status: 'Active' },
];

const columns: Column<User>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: false },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          backgroundColor: value === 'Active' ? '#dcfce7' : '#fee2e2',
          color: value === 'Active' ? '#15803d' : '#b91c1c',
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        {String(value)}
      </span>
    ),
  },
];

export default function App() {
  return (
    <div>
      <SearchableDataTable
        data={USERS_DATA}
        columns={columns}
        searchKeys={['name', 'email', 'role']}
        filterKey="status"
        filterOptions={['Active', 'Inactive']}
        initialPageSize={5}
      />
    </div>
  );
}

```
