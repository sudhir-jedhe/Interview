# Scenario: A Shared Data Table Used Across Three Different Domains

Your team has near-identical table components for displaying users, orders, and products — each hardcoded to its own row type with duplicated column-rendering and sorting logic. Product wants a fourth table (for invoices) and the team wants to consolidate into one reusable, type-safe component before adding more copies.

**Approach:**

This is a direct application of generic components. The key design decision is how much of the "column" concept to make generic alongside the row type, since columns need to know both the row shape *and* which specific field of that row they render.

```tsx
interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortKey?: keyof T;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
}

function DataTable<T>({ rows, columns, getRowId }: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getRowId(row)}>
            {columns.map((col) => (
              <td key={col.header}>{col.accessor(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Each domain then defines its own typed columns without touching `DataTable` itself:

```tsx
interface Order {
  id: string;
  customerName: string;
  total: number;
  placedAt: Date;
}

const orderColumns: Column<Order>[] = [
  { header: "Customer", accessor: (o) => o.customerName, sortKey: "customerName" },
  { header: "Total", accessor: (o) => `$${o.total.toFixed(2)}`, sortKey: "total" },
  { header: "Date", accessor: (o) => o.placedAt.toLocaleDateString() },
];

function OrdersTable({ orders }: { orders: Order[] }) {
  return <DataTable rows={orders} columns={orderColumns} getRowId={(o) => o.id} />;
}
```

`sortKey?: keyof T` is worth calling out specifically: rather than typing it as a plain `string` (which would allow specifying a sort key that doesn't exist on `T`, only catchable at runtime), `keyof T` restricts it to an actual property name of the row type, so `sortKey: "customrName"` (a typo) fails to compile immediately instead of silently sorting on `undefined` values at runtime.

The invoice table for the new feature request is now just a fourth set of typed columns, not a fourth copy of table-rendering logic — and if `DataTable` later needs a new feature (e.g., row selection, pagination), it's added once and every consumer gets it for free, fully typed per their own row shape via the shared `T` parameter.

**Lesson:** generic components pay off exactly in this situation — near-identical components differing only in row shape. The main design cost is deciding how much structure (`Column<T>`, `accessor`, `sortKey`) to standardize across domains; too little and consumers reimplement logic per table, too much and the generic component becomes a leaky abstraction fighting domain-specific needs.
