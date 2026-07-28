# Dynamic Table Generator (React Machine Coding Interview)

A **Dynamic Table Generator** is a very common Frontend interview problem that tests:

✅ Dynamic rendering

✅ React state management

✅ Config-driven UI

✅ Column generation

✅ Sorting

✅ Filtering

✅ Pagination

✅ Reusable component design

Dynamic tables are typically generated from configuration and data rather than hardcoded rows/columns. Modern React table implementations often render columns dynamically from metadata and rows from data arrays. [\[dev.to\]](https://dev.to/labex/react-dynamic-table-programming-tutorial-558h), [\[material-r...-table.com\]](https://www.material-react-table.com/docs/examples/dynamic-columns)

---

# Problem Statement

Given:

```js
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
];

const data = [
  {
    id: 1,
    name: "Sudhir",
    email: "s@test.com",
  },
  {
    id: 2,
    name: "John",
    email: "j@test.com",
  },
];
```

Generate:

```text
------------------------------------
| ID | Name    | Email            |
------------------------------------
| 1  | Sudhir  | s@test.com       |
| 2  | John    | j@test.com       |
------------------------------------
```

---

# Basic React Component

```tsx
function DynamicTable({ columns, data }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Dynamic table rendering commonly uses column definitions and maps rows/columns to table elements. [\[dev.to\]](https://dev.to/labex/react-dynamic-table-programming-tutorial-558h), [\[hcoco1.github.io\]](https://hcoco1.github.io/hcoco1-blog/creating-a-dynamic-table-in-react/)

---

# Usage

```tsx
<DynamicTable columns={columns} data={data} />
```

---

# Config Driven Approach

```js
const columns = [
  {
    key: "name",
    label: "Name",
  },

  {
    key: "salary",
    label: "Salary",

    render: (value) => `₹${value}`,
  },

  {
    key: "status",

    label: "Status",

    render: (value) => <span>{value}</span>,
  },
];
```

Table:

```tsx
<td>{column.render ? column.render(row[column.key]) : row[column.key]}</td>
```

---

# Dynamic Columns

Sometimes API returns:

```js
[
  {
    id: 1,
    name: "Sudhir",
    city: "Pune",
  },
];
```

Generate columns automatically:

```js
const columns = Object.keys(data[0]).map((key) => ({
  key,
  label: key,
}));
```

Dynamic column generation from remote or unknown data structures is a common enterprise table pattern. [\[material-r...-table.com\]](https://www.material-react-table.com/docs/examples/dynamic-columns)

---

# Sorting

```tsx
const [sortKey, setSortKey] = useState("");

const sortedData = [...data].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
```

```tsx
<th onClick={() => setSortKey(column.key)}>{column.label}</th>
```

---

# Search

```tsx
const filteredData = data.filter((row) =>
  JSON.stringify(row).toLowerCase().includes(search.toLowerCase()),
);
```

---

# Pagination

```tsx
const pageSize = 10;

const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
```

---

# Column Visibility

```tsx
{
  columns
    .filter(
      col =>
        visibleColumns[
          col.key
        ]
    )
    .map(...)
}
```

---

# Editable Table

```tsx
<td>
  <input
    value={row.name}
    onChange={(e) => updateCell(row.id, "name", e.target.value)}
  />
</td>
```

---

# Generic TypeScript Version

```ts
interface Column<T> {
  key: keyof T;
  label: string;

  render?: (value: any, row: T) => React.ReactNode;
}
```

```ts
type User = {
  id: number;
  name: string;
};
```

```tsx
<DynamicTable<User> columns={columns} data={users} />
```

---

# Senior-Level Architecture

```text
Page
 │
 ▼
TableContainer
 │
 ├── Search
 ├── Filters
 ├── Pagination
 ├── Sorting
 │
 ▼
DynamicTable
 │
 ├── Header
 ├── Body
 └── Cell Renderer
```

---

# Complexity

### Rendering

```text
Rows = N
Columns = M

Time:
O(N × M)
```

### Sorting

```text
O(N log N)
```

### Searching

```text
O(N)
```

---

# Interview Follow-Ups

### 1. Virtualisation

```text
100,000 rows
```

Use:

```text
react-window
react-virtualized
```

### 2. Server-Side Pagination

```text
Only fetch current page
```

### 3. Resizable Columns

```text
Drag column width
```

### 4. Column Reordering

```text
Drag & Drop
```

### 5. CSV Export

```text
Export current table
```

---

## Senior Interview Answer

> I would create a reusable, configuration-driven table component where columns define metadata (label, key, renderer) and rows come from API data. The component should support dynamic column generation, sorting, filtering, pagination, custom cell renderers, and type-safe generics so it can be reused across multiple modules without duplicating logic. [\[material-r...-table.com\]](https://www.material-react-table.com/docs/examples/dynamic-columns), [\[hcoco1.github.io\]](https://hcoco1.github.io/hcoco1-blog/creating-a-dynamic-table-in-react/)
