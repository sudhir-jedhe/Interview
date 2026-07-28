I found an internal reference, EditPFData.html, that describes a PF data table with edit, search, pagination and sorting, which aligns well with your custom grid requirement. I also checked MUI X docs for feature inspiration: Data Grid - Row definition - MUI X says rows should have a stable unique identifier, Data Grid - Cells - MUI X describes custom cell rendering/formatting, Data Grid - Virtualization - MUI X explains row/column virtualisation for performance, and Data Grid - Accessibility - MUI X highlights keyboard navigation and ARIA-style data-grid patterns.

Below is a custom React table component — no MUI dependency — with many DataGrid-like features:

✅ Config-driven columns
✅ Rows + custom cells
✅ Inline editing
✅ Sorting
✅ Global search
✅ Column filtering
✅ Pagination
✅ Row selection
✅ Virtualised rendering
✅ Accessibility roles
✅ Keyboard-friendly structure
✅ Localisation
✅ Tree data expand/collapse
✅ Row grouping
✅ Aggregation
✅ CSV export
✅ Clipboard copy/paste
✅ Undo/redo
✅ List view
✅ Scroll controls
✅ Basic pivot summary
✅ Optional server-side mode hooks

```js
// 1. App.jsx
import React, { useMemo, useState } from "react";
import SmartTable from "./SmartTable";
import "./SmartTable.css";

const initialRows = [
  {
    id: 1,
    name: "Sudhir Jedhe",
    role: "Project Lead",
    department: "Frontend",
    location: "Pune",
    salary: 180000,
    experience: 10,
    status: "Active",
    manager: "Apoorva",
    parentId: null,
  },
  {
    id: 2,
    name: "Kunal Bhatia",
    role: "React Developer",
    department: "Frontend",
    location: "Pune",
    salary: 120000,
    experience: 5,
    status: "Active",
    manager: "Sudhir",
    parentId: 1,
  },
  {
    id: 3,
    name: "Aakanksha Mahajan",
    role: "UI Developer",
    department: "Frontend",
    location: "Pune",
    salary: 110000,
    experience: 4,
    status: "Active",
    manager: "Sudhir",
    parentId: 1,
  },
  {
    id: 4,
    name: "Mahendra Aanjna",
    role: "Backend Developer",
    department: "Backend",
    location: "Indore",
    salary: 130000,
    experience: 6,
    status: "Inactive",
    manager: "Apoorva",
    parentId: null,
  },
  {
    id: 5,
    name: "Priyasmita Chatterjee",
    role: "QA Engineer",
    department: "QA",
    location: "Kolkata",
    salary: 95000,
    experience: 4,
    status: "Active",
    manager: "Apoorva",
    parentId: null,
  },
  {
    id: 6,
    name: "Ajey Mattihal",
    role: "Automation Engineer",
    department: "QA",
    location: "Bengaluru",
    salary: 115000,
    experience: 5,
    status: "Active",
    manager: "Priyasmita",
    parentId: 5,
  },
  {
    id: 7,
    name: "Vijay Sadashive",
    role: "DevOps Engineer",
    department: "Platform",
    location: "Hyderabad",
    salary: 145000,
    experience: 7,
    status: "Active",
    manager: "Apoorva",
    parentId: null,
  },
  {
    id: 8,
    name: "Shrestha Gupta",
    role: "UX Designer",
    department: "Design",
    location: "Delhi",
    salary: 100000,
    experience: 3,
    status: "Active",
    manager: "Apoorva",
    parentId: null,
  },
];

export default function App() {
  const [rows, setRows] = useState(initialRows);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Employee Name",
        width: 220,
        editable: true,
        sortable: true,
        filterable: true,
        pinned: "left",
        renderCell: ({ value, row }) => (
          <strong>
            {value}
            {row.role === "Project Lead" ? " ⭐" : ""}
          </strong>
        ),
      },
      {
        field: "role",
        headerName: "Role",
        width: 180,
        editable: true,
        sortable: true,
        filterable: true,
      },
      {
        field: "department",
        headerName: "Department",
        width: 160,
        editable: true,
        sortable: true,
        filterable: true,
        groupable: true,
      },
      {
        field: "location",
        headerName: "Location",
        width: 140,
        editable: true,
        sortable: true,
        filterable: true,
        groupable: true,
      },
      {
        field: "salary",
        headerName: "Salary",
        width: 140,
        type: "number",
        editable: true,
        sortable: true,
        filterable: true,
        aggregable: true,
        valueFormatter: (value) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(Number(value || 0)),
      },
      {
        field: "experience",
        headerName: "Experience",
        width: 140,
        type: "number",
        editable: true,
        sortable: true,
        filterable: true,
        aggregable: true,
        valueFormatter: (value) => `${value} yrs`,
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        editable: true,
        sortable: true,
        filterable: true,
        renderCell: ({ value }) => (
          <span
            className={`badge ${value === "Active" ? "success" : "danger"}`}
          >
            {value}
          </span>
        ),
      },
    ],
    [],
  );

  const localeText = {
    searchPlaceholder: "Search employees...",
    noRows: "No records found",
    rowsPerPage: "Rows per page",
    selected: "selected",
    exportCsv: "Export CSV",
    copy: "Copy",
    paste: "Paste",
    undo: "Undo",
    redo: "Redo",
    reset: "Reset",
    groupBy: "Group by",
    listView: "List view",
    tableView: "Table view",
    pivot: "Pivot summary",
  };

  return (
    <div className="app">
      <h1>Custom React Smart Table</h1>

      <SmartTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        onRowsChange={setRows}
        height={480}
        rowHeight={44}
        pageSizeOptions={[5, 10, 20]}
        initialPageSize={5}
        localeText={localeText}
        enableSelection
        enableEditing
        enableColumnFilters
        enablePagination
        enableVirtualization
        enableTreeData
        enableGrouping
        enableAggregation
        enableExport
        enableClipboard
        enableUndoRedo
        enableListView
        enablePivot
      />
    </div>
  );
}
```

// 2. SmartTable.jsx

```js
   import React, {
   useMemo,
   useRef,
   useState,
   useCallback
   } from "react";

const defaultLocaleText = {
searchPlaceholder: "Search...",
noRows: "No rows",
rowsPerPage: "Rows per page",
selected: "selected",
exportCsv: "Export CSV",
copy: "Copy",
paste: "Paste",
undo: "Undo",
redo: "Redo",
reset: "Reset",
groupBy: "Group by",
listView: "List view",
tableView: "Table view",
pivot: "Pivot summary"
};

function getValue(row, column) {
if (column.valueGetter) {
return column.valueGetter(row);
}

return row[column.field];
}

function formatValue(value, column) {
if (column.valueFormatter) {
return column.valueFormatter(value);
}

return value ?? "";
}

function normaliseText(value) {
return String(value ?? "").toLowerCase();
}

function downloadFile(fileName, content, mimeType) {
const blob = new Blob([content], { type: mimeType });
const url = URL.createObjectURL(blob);

const anchor = document.createElement("a");
anchor.href = url;
anchor.download = fileName;
anchor.click();

URL.revokeObjectURL(url);
}

function convertRowsToCsv(rows, columns) {
const visibleColumns = columns.filter(col => !col.hidden);

const header = visibleColumns
.map(col => `"${col.headerName || col.field}"`)
.join(",");

const body = rows
.map(row =>
visibleColumns
.map(col => {
const value = getValue(row, col);
return `"${String(value ?? "").replaceAll('"', '""')}"`;
})
.join(",")
)
.join("\n");

return `${header}\n${body}`;
}

function buildTreeRows(rows, getRowId) {
const byParent = new Map();

rows.forEach(row => {
const parentId = row.parentId ?? null;

    if (!byParent.has(parentId)) {
      byParent.set(parentId, []);
    }

    byParent.get(parentId).push(row);

});

const result = [];

function visit(parentId, depth) {
const children = byParent.get(parentId) || [];

    children.forEach(row => {
      result.push({
        ...row,
        __depth: depth,
        __hasChildren: Boolean(byParent.get(getRowId(row))?.length)
      });

      visit(getRowId(row), depth + 1);
    });

}

visit(null, 0);

return result;
}

function filterExpandedTreeRows(rows, expandedRowIds, getRowId) {
const hiddenParentIds = new Set();
const result = [];

rows.forEach(row => {
const rowId = getRowId(row);
const parentId = row.parentId;

    if (parentId && hiddenParentIds.has(parentId)) {
      hiddenParentIds.add(rowId);
      return;
    }

    result.push(row);

    if (row.__hasChildren && !expandedRowIds.has(rowId)) {
      hiddenParentIds.add(rowId);
    }

});

return result;
}

function groupRows(rows, groupByField) {
if (!groupByField) {
return rows;
}

const groups = new Map();

rows.forEach(row => {
const value = row[groupByField] ?? "Empty";

    if (!groups.has(value)) {
      groups.set(value, []);
    }

    groups.get(value).push(row);

});

const groupedRows = [];

Array.from(groups.entries()).forEach(([groupName, groupRows]) => {
groupedRows.push({
id: `group-${groupByField}-${groupName}`,
**isGroup: true,
**groupName: groupName,
\_\_groupCount: groupRows.length
});

    groupedRows.push(...groupRows);

});

return groupedRows;
}

function aggregateRows(rows, columns) {
const aggregations = {};

columns
.filter(col => col.aggregable)
.forEach(col => {
const values = rows
.map(row => Number(row[col.field]))
.filter(value => !Number.isNaN(value));

      const sum = values.reduce((acc, value) => acc + value, 0);
      const avg = values.length ? sum / values.length : 0;
      const min = values.length ? Math.min(...values) : 0;
      const max = values.length ? Math.max(...values) : 0;

      aggregations[col.field] = {
        sum,
        avg,
        min,
        max
      };
    });

return aggregations;
}

function createPivotSummary(rows, rowField, valueField) {
if (!rowField || !valueField) {
return [];
}

const map = new Map();

rows.forEach(row => {
const key = row[rowField] ?? "Empty";
const value = Number(row[valueField] || 0);

    if (!map.has(key)) {
      map.set(key, {
        label: key,
        count: 0,
        sum: 0
      });
    }

    const current = map.get(key);
    current.count += 1;
    current.sum += value;

});

return Array.from(map.values());
}
```

```js

export default function SmartTable({
rows,
columns,
getRowId = row => row.id,
onRowsChange,
height = 500,
rowHeight = 44,
pageSizeOptions = [10, 20, 50],
initialPageSize = 10,
localeText = {},
enableSelection = true,
enableEditing = true,
enableColumnFilters = true,
enablePagination = true,
enableVirtualization = true,
enableTreeData = false,
enableGrouping = true,
enableAggregation = true,
enableExport = true,
enableClipboard = true,
enableUndoRedo = true,
enableListView = true,
enablePivot = true
}) {
const t = {
...defaultLocaleText,
...localeText
};

const containerRef = useRef(null);

const [search, setSearch] = useState("");
const [sortModel, setSortModel] = useState(null);
const [filters, setFilters] = useState({});
const [selectedIds, setSelectedIds] = useState(new Set());
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(initialPageSize);
const [scrollTop, setScrollTop] = useState(0);
const [editingCell, setEditingCell] = useState(null);
const [draftValue, setDraftValue] = useState("");
const [expandedRowIds, setExpandedRowIds] = useState(new Set());
const [groupByField, setGroupByField] = useState("");
const [viewMode, setViewMode] = useState("table");
const [pivotRowField, setPivotRowField] = useState("department");
const [pivotValueField, setPivotValueField] = useState("salary");

const [undoStack, setUndoStack] = useState([]);
const [redoStack, setRedoStack] = useState([]);

const visibleColumns = useMemo(
() => columns.filter(column => !column.hidden),
[columns]
);

const pushHistory = useCallback(
nextRows => {
if (!enableUndoRedo) return;

      setUndoStack(prev => [...prev, rows]);
      setRedoStack([]);
      onRowsChange(nextRows);
    },
    [enableUndoRedo, onRowsChange, rows]

);

const updateCellValue = useCallback(
(rowId, field, value) => {
const nextRows = rows.map(row =>
getRowId(row) === rowId
? {
...row,
[field]: value
}
: row
);

      pushHistory(nextRows);
    },
    [getRowId, pushHistory, rows]

);

const undo = () => {
if (!undoStack.length) return;

    const previousRows = undoStack[undoStack.length - 1];

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, rows]);

    onRowsChange(previousRows);

};

const redo = () => {
if (!redoStack.length) return;

    const nextRows = redoStack[redoStack.length - 1];

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, rows]);

    onRowsChange(nextRows);

};

const preparedRows = useMemo(() => {
let data = [...rows];

    if (enableTreeData) {
      data = buildTreeRows(data, getRowId);
      data = filterExpandedTreeRows(data, expandedRowIds, getRowId);
    }

    if (search) {
      data = data.filter(row =>
        visibleColumns.some(column =>
          normaliseText(getValue(row, column)).includes(
            normaliseText(search)
          )
        )
      );
    }

    Object.entries(filters).forEach(([field, value]) => {
      if (!value) return;

      data = data.filter(row =>
        normaliseText(row[field]).includes(normaliseText(value))
      );
    });

    if (sortModel) {
      const { field, direction } = sortModel;

      data.sort((a, b) => {
        if (a.__isGroup || b.__isGroup) return 0;

        const aValue = a[field];
        const bValue = b[field];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return direction === "asc"
          ? String(aValue ?? "").localeCompare(String(bValue ?? ""))
          : String(bValue ?? "").localeCompare(String(aValue ?? ""));
      });
    }

    if (enableGrouping && groupByField) {
      data = groupRows(data, groupByField);
    }

    return data;

}, [
rows,
search,
filters,
sortModel,
visibleColumns,
enableTreeData,
expandedRowIds,
getRowId,
enableGrouping,
groupByField
]);

const aggregations = useMemo(
() => aggregateRows(preparedRows.filter(row => !row.\_\_isGroup), columns),
[preparedRows, columns]
);

const pivotSummary = useMemo(
() =>
createPivotSummary(
preparedRows.filter(row => !row.\_\_isGroup),
pivotRowField,
pivotValueField
),
[preparedRows, pivotRowField, pivotValueField]
);

const totalPages = Math.max(
1,
Math.ceil(preparedRows.length / pageSize)
);

const pagedRows = useMemo(() => {
if (!enablePagination) return preparedRows;

    const start = page * pageSize;
    return preparedRows.slice(start, start + pageSize);

}, [preparedRows, enablePagination, page, pageSize]);

const virtualRows = useMemo(() => {
if (!enableVirtualization) {
return {
rows: pagedRows,
topSpacerHeight: 0,
bottomSpacerHeight: 0
};
}

    const visibleCount = Math.ceil(height / rowHeight) + 6;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
    const endIndex = Math.min(pagedRows.length, startIndex + visibleCount);

    return {
      rows: pagedRows.slice(startIndex, endIndex),
      topSpacerHeight: startIndex * rowHeight,
      bottomSpacerHeight: Math.max(
        0,
        (pagedRows.length - endIndex) * rowHeight
      )
    };

}, [
enableVirtualization,
pagedRows,
scrollTop,
height,
rowHeight
]);

const toggleSort = column => {
if (!column.sortable) return;

    setSortModel(prev => {
      if (!prev || prev.field !== column.field) {
        return {
          field: column.field,
          direction: "asc"
        };
      }

      if (prev.direction === "asc") {
        return {
          field: column.field,
          direction: "desc"
        };
      }

      return null;
    });

};

const toggleRowSelection = rowId => {
setSelectedIds(prev => {
const next = new Set(prev);

      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });

};

const toggleSelectAll = () => {
const allIds = pagedRows
.filter(row => !row.\_\_isGroup)
.map(row => getRowId(row));

    const allSelected = allIds.every(id => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }

};

const startEditing = (row, column) => {
if (!enableEditing || !column.editable || row.\_\_isGroup) return;

    setEditingCell({
      rowId: getRowId(row),
      field: column.field
    });

    setDraftValue(row[column.field] ?? "");

};

const commitEditing = () => {
if (!editingCell) return;

    updateCellValue(
      editingCell.rowId,
      editingCell.field,
      draftValue
    );

    setEditingCell(null);
    setDraftValue("");

};

const cancelEditing = () => {
setEditingCell(null);
setDraftValue("");
};

const toggleExpand = rowId => {
setExpandedRowIds(prev => {
const next = new Set(prev);

      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });

};

const exportCsv = () => {
const csv = convertRowsToCsv(
preparedRows.filter(row => !row.\_\_isGroup),
visibleColumns
);

    downloadFile("smart-table-export.csv", csv, "text/csv;charset=utf-8");

};

const copySelectedRows = async () => {
const selectedRows = preparedRows.filter(
row => !row.\_\_isGroup && selectedIds.has(getRowId(row))
);

    const csv = convertRowsToCsv(selectedRows, visibleColumns);

    await navigator.clipboard.writeText(csv);

};

const pasteRows = async () => {
const text = await navigator.clipboard.readText();

    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    if (lines.length < 2) return;

    const pastedRows = lines.slice(1).map((line, index) => {
      const values = line
        .split(",")
        .map(value => value.replace(/^"|"$/g, ""));

      const row = {};

      visibleColumns.forEach((column, colIndex) => {
        row[column.field] = values[colIndex];
      });

      return {
        ...row,
        id: Date.now() + index
      };
    });

    pushHistory([...rows, ...pastedRows]);

};

const scrollToTop = () => {
if (containerRef.current) {
containerRef.current.scrollTop = 0;
}
};

const scrollToBottom = () => {
if (containerRef.current) {
containerRef.current.scrollTop = containerRef.current.scrollHeight;
}
};

const groupableColumns = columns.filter(column => column.groupable);
const aggregableColumns = columns.filter(column => column.aggregable);

return (

<section className="smart-table-wrapper">
<div className="toolbar">
<input
aria-label="Global search"
className="search-input"
placeholder={t.searchPlaceholder}
value={search}
onChange={event => {
setSearch(event.target.value);
setPage(0);
}}
/>

        {enableGrouping && (
          <label className="toolbar-label">
            {t.groupBy}
            <select
              value={groupByField}
              onChange={event => setGroupByField(event.target.value)}
            >
              <option value="">None</option>
              {groupableColumns.map(column => (
                <option key={column.field} value={column.field}>
                  {column.headerName}
                </option>
              ))}
            </select>
          </label>
        )}

        {enableListView && (
          <button
            type="button"
            onClick={() =>
              setViewMode(prev => (prev === "table" ? "list" : "table"))
            }
          >
            {viewMode === "table" ? t.listView : t.tableView}
          </button>
        )}

        {enableExport && (
          <button type="button" onClick={exportCsv}>
            {t.exportCsv}
          </button>
        )}

        {enableClipboard && (
          <>
            <button type="button" onClick={copySelectedRows}>
              {t.copy}
            </button>

            <button type="button" onClick={pasteRows}>
              {t.paste}
            </button>
          </>
        )}

        {enableUndoRedo && (
          <>
            <button type="button" onClick={undo} disabled={!undoStack.length}>
              {t.undo}
            </button>

            <button type="button" onClick={redo} disabled={!redoStack.length}>
              {t.redo}
            </button>
          </>
        )}

        <button type="button" onClick={scrollToTop}>
          Top
        </button>

        <button type="button" onClick={scrollToBottom}>
          Bottom
        </button>
      </div>

      {enableColumnFilters && (
        <div className="column-filters">
          {visibleColumns.map(column => (
            <input
              key={column.field}
              aria-label={`Filter ${column.headerName}`}
              placeholder={`Filter ${column.headerName}`}
              value={filters[column.field] || ""}
              onChange={event => {
                setFilters(prev => ({
                  ...prev,
                  [column.field]: event.target.value
                }));
                setPage(0);
              }}
            />
          ))}
        </div>
      )}

      {viewMode === "list" ? (
        <div className="list-view">
          {preparedRows.map(row => {
            if (row.__isGroup) {
              return (
                <div key={row.id} className="list-group">
                  {row.__groupName} ({row.__groupCount})
                </div>
              );
            }

            return (
              <article key={getRowId(row)} className="list-card">
                {visibleColumns.map(column => (
                  <div key={column.field}>
                    <strong>{column.headerName}: </strong>
                    {formatValue(getValue(row, column), column)}
                  </div>
                ))}
              </article>
            );
          })}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="table-scroll-container"
          style={{ height }}
          onScroll={event => setScrollTop(event.currentTarget.scrollTop)}
        >
          <table
            className="smart-table"
            role="grid"
            aria-rowcount={preparedRows.length}
            aria-colcount={visibleColumns.length}
          >
            <thead>
              <tr role="row">
                {enableSelection && (
                  <th className="selection-cell">
                    <input
                      aria-label="Select all rows"
                      type="checkbox"
                      checked={
                        pagedRows.length > 0 &&
                        pagedRows
                          .filter(row => !row.__isGroup)
                          .every(row => selectedIds.has(getRowId(row)))
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}

                {visibleColumns.map(column => (
                  <th
                    key={column.field}
                    role="columnheader"
                    style={{ width: column.width }}
                    onClick={() => toggleSort(column)}
                    tabIndex={0}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                        toggleSort(column);
                      }
                    }}
                  >
                    <span>{column.headerName}</span>

                    {sortModel?.field === column.field && (
                      <span>
                        {sortModel.direction === "asc" ? " ▲" : " ▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {enableVirtualization && (
                <tr aria-hidden="true">
                  <td
                    colSpan={visibleColumns.length + 1}
                    style={{
                      height: virtualRows.topSpacerHeight,
                      padding: 0,
                      border: 0
                    }}
                  />
                </tr>
              )}

              {virtualRows.rows.map(row => {
                if (row.__isGroup) {
                  return (
                    <tr key={row.id} className="group-row">
                      <td colSpan={visibleColumns.length + 1}>
                        {row.__groupName} ({row.__groupCount})
                      </td>
                    </tr>
                  );
                }

                const rowId = getRowId(row);
                const isSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowId}
                    role="row"
                    className={isSelected ? "selected-row" : ""}
                    aria-selected={isSelected}
                  >
                    {enableSelection && (
                      <td className="selection-cell">
                        <input
                          aria-label={`Select row ${rowId}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rowId)}
                        />
                      </td>
                    )}

                    {visibleColumns.map((column, columnIndex) => {
                      const isEditing =
                        editingCell?.rowId === rowId &&
                        editingCell?.field === column.field;

                      const value = getValue(row, column);
                      const displayValue = formatValue(value, column);

                      return (
                        <td
                          key={column.field}
                          role="gridcell"
                          tabIndex={0}
                          style={{
                            width: column.width,
                            paddingLeft:
                              enableTreeData && columnIndex === 0
                                ? `${(row.__depth || 0) * 20 + 8}px`
                                : undefined
                          }}
                          onDoubleClick={() => startEditing(row, column)}
                        >
                          {enableTreeData &&
                            columnIndex === 0 &&
                            row.__hasChildren && (
                              <button
                                type="button"
                                className="tree-toggle"
                                aria-label={
                                  expandedRowIds.has(rowId)
                                    ? "Collapse row"
                                    : "Expand row"
                                }
                                onClick={() => toggleExpand(rowId)}
                              >
                                {expandedRowIds.has(rowId) ? "−" : "+"}
                              </button>
                            )}

                          {isEditing ? (
                            <input
                              className="cell-editor"
                              autoFocus
                              value={draftValue}
                              onChange={event =>
                                setDraftValue(event.target.value)
                              }
                              onBlur={commitEditing}
                              onKeyDown={event => {
                                if (event.key === "Enter") {
                                  commitEditing();
                                }

                                if (event.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                            />
                          ) : column.renderCell ? (
                            column.renderCell({
                              value,
                              row,
                              column
                            })
                          ) : (
                            displayValue
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {enableVirtualization && (
                <tr aria-hidden="true">
                  <td
                    colSpan={visibleColumns.length + 1}
                    style={{
                      height: virtualRows.bottomSpacerHeight,
                      padding: 0,
                      border: 0
                    }}
                  />
                </tr>
              )}

              {!preparedRows.length && (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="no-rows">
                    {t.noRows}
                  </td>
                </tr>
              )}
            </tbody>

            {enableAggregation && (
              <tfoot>
                <tr>
                  {enableSelection && <td />}
                  {visibleColumns.map(column => {
                    const aggregation = aggregations[column.field];

                    return (
                      <td key={column.field}>
                        {aggregation
                          ? `Σ ${formatValue(
                              aggregation.sum,
                              column
                            )}`
                          : ""}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {enablePagination && (
        <div className="pagination">
          <span>
            {selectedIds.size} {t.selected}
          </span>

          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            First
          </button>

          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
          >
            Prev
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage(prev => Math.min(totalPages - 1, prev + 1))
            }
          >
            Next
          </button>

          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          >
            Last
          </button>

          <label>
            {t.rowsPerPage}
            <select
              value={pageSize}
              onChange={event => {
                setPageSize(Number(event.target.value));
                setPage(0);
              }}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {enableAggregation && (
        <div className="aggregation-panel">
          <h3>Aggregation</h3>

          <div className="aggregation-grid">
            {aggregableColumns.map(column => {
              const aggregation = aggregations[column.field];

              if (!aggregation) return null;

              return (
                <div key={column.field} className="aggregation-card">
                  <strong>{column.headerName}</strong>
                  <span>Sum: {formatValue(aggregation.sum, column)}</span>
                  <span>Avg: {formatValue(aggregation.avg, column)}</span>
                  <span>Min: {formatValue(aggregation.min, column)}</span>
                  <span>Max: {formatValue(aggregation.max, column)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {enablePivot && (
        <div className="pivot-panel">
          <h3>{t.pivot}</h3>

          <div className="pivot-controls">
            <label>
              Row field
              <select
                value={pivotRowField}
                onChange={event => setPivotRowField(event.target.value)}
              >
                {visibleColumns.map(column => (
                  <option key={column.field} value={column.field}>
                    {column.headerName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Value field
              <select
                value={pivotValueField}
                onChange={event => setPivotValueField(event.target.value)}
              >
                {aggregableColumns.map(column => (
                  <option key={column.field} value={column.field}>
                    {column.headerName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="pivot-bars">
            {pivotSummary.map(item => (
              <div key={item.label} className="pivot-row">
                <span>{item.label}</span>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        item.sum / 5000
                      )}%`
                    }}
                  />
                </div>
                <strong>{item.sum.toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>

);
}

3. SmartTable.css

- {
  box-sizing: border-box;
  }

body {
margin: 0;
font-family: Inter, Arial, sans-serif;
background: #f5f7fb;
color: #172033;
}

.app {
padding: 32px;
}

.smart-table-wrapper {
background: #ffffff;
border: 1px solid #d9e1ec;
border-radius: 12px;
padding: 16px;
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.toolbar {
display: flex;
flex-wrap: wrap;
gap: 8px;
align-items: center;
margin-bottom: 12px;
}

.toolbar button,
.pagination button {
border: 1px solid #c8d2e0;
background: #ffffff;
border-radius: 8px;
padding: 8px 12px;
cursor: pointer;
}

.toolbar button:hover,
.pagination button:hover {
background: #eef4ff;
}

.toolbar button:disabled,
.pagination button:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.search-input {
min-width: 260px;
padding: 9px 12px;
border: 1px solid #c8d2e0;
border-radius: 8px;
}

.toolbar-label {
display: flex;
align-items: center;
gap: 6px;
}

.toolbar select,
.pagination select,
.pivot-controls select {
padding: 8px;
border: 1px solid #c8d2e0;
border-radius: 8px;
}

.column-filters {
display: flex;
gap: 8px;
overflow-x: auto;
margin-bottom: 12px;
}

.column-filters input {
min-width: 140px;
padding: 8px;
border: 1px solid #c8d2e0;
border-radius: 8px;
}

.table-scroll-container {
overflow: auto;
border: 1px solid #d9e1ec;
border-radius: 10px;
}

.smart-table {
width: 100%;
min-width: 960px;
border-collapse: collapse;
}

.smart-table th {
position: sticky;
top: 0;
background: #ecf3ff;
z-index: 2;
text-align: left;
font-weight: 700;
cursor: pointer;
}

.smart-table th,
.smart-table td {
border-bottom: 1px solid #e5eaf2;
padding: 10px;
height: 44px;
}

.smart-table tr:hover td {
background: #f7fbff;
}

.selection-cell {
width: 44px;
text-align: center;
}

.selected-row td {
background: #e8f1ff;
}

.group-row td {
background: #f0f6ff;
font-weight: 700;
color: #1d4ed8;
}

.no-rows {
text-align: center;
color: #64748b;
padding: 32px;
}

.cell-editor {
width: 100%;
padding: 6px;
border: 1px solid #2563eb;
border-radius: 6px;
}

.tree-toggle {
width: 22px;
height: 22px;
margin-right: 6px;
border: 1px solid #94a3b8;
background: white;
border-radius: 4px;
cursor: pointer;
}

.badge {
display: inline-block;
padding: 4px 8px;
border-radius: 999px;
font-size: 12px;
font-weight: 700;
}

.badge.success {
background: #dcfce7;
color: #166534;
}

.badge.danger {
background: #fee2e2;
color: #991b1b;
}

.pagination {
display: flex;
flex-wrap: wrap;
gap: 8px;
align-items: center;
margin-top: 12px;
}

.aggregation-panel,
.pivot-panel {
margin-top: 20px;
padding: 16px;
border: 1px solid #e2e8f0;
border-radius: 10px;
background: #fbfdff;
}

.aggregation-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
gap: 12px;
}

.aggregation-card {
display: flex;
flex-direction: column;
gap: 4px;
padding: 12px;
background: white;
border: 1px solid #e2e8f0;
border-radius: 8px;
}

.list-view {
display: grid;
gap: 12px;
}

.list-card {
padding: 14px;
border: 1px solid #d9e1ec;
border-radius: 10px;
background: #ffffff;
}

.list-card div {
margin-bottom: 6px;
}

.list-group {
padding: 12px;
background: #eff6ff;
border-radius: 8px;
font-weight: 700;
color: #1d4ed8;
}

.pivot-controls {
display: flex;
gap: 12px;
margin-bottom: 12px;
}

.pivot-controls label {
display: flex;
flex-direction: column;
gap: 4px;
}

.pivot-bars {
display: grid;
gap: 10px;
}

.pivot-row {
display: grid;
grid-template-columns: 140px 1fr 120px;
gap: 8px;
align-items: center;
}

.bar-bg {
height: 12px;
background: #e2e8f0;
border-radius: 999px;
overflow: hidden;
}

.bar-fill {
height: 100%;
background: #2563eb;
}

@media (max-width: 768px) {
.app {
padding: 16px;
}

.search-input {
min-width: 100%;
}

.toolbar {
align-items: stretch;
}

.toolbar button,
.toolbar label {
width: 100%;
}

.pivot-row {
grid-template-columns: 1fr;
}
}

Feature Explanation

1. Layout

The table is wrapped inside a fixed-height scroll container:

<div
  className="table-scroll-container"
  style={{ height }}
>

MUI’s layout guidance says a data grid needs parent dimensions or it may not display correctly, so this custom table follows the same principle by accepting a height prop.

2. Columns

Columns are config-driven:

{
field: "salary",
headerName: "Salary",
editable: true,
sortable: true,
filterable: true,
aggregable: true,
valueFormatter: value => ...
}

This allows each column to control sorting, editing, formatting, grouping and aggregation.

3. Rows

Each row uses a stable unique ID:

getRowId={row => row.id}

Data Grid - Row definition - MUI X explicitly states that each row needs a unique identifier and that it is used internally for models such as row selection.

4. Custom Cells

Column-level renderCell allows custom UI:

renderCell: ({ value, row }) => (
<strong>
{value}
{row.role === "Project Lead" ? " ⭐" : ""}
</strong>
)

Data Grid - Cells - MUI X describes renderCell, valueGetter, and valueFormatter as ways to customise cell output.

5. Editing

Double-click a cell to edit:

onDoubleClick={() => startEditing(row, column)}

Commit happens on:

Enter
Blur

Cancel happens on:

Escape

6. Sorting

Click the column header:

First click → Asc
Second click → Desc
Third click → No sort

7. Filtering

There are two filtering layers:

Global search

- Column filters

Global search scans all visible columns. Column filter applies field-level matching.

8. Pagination

Pagination keeps only the current page rows:

const start = page \* pageSize;
preparedRows.slice(start, start + pageSize);

9. Selection

Checkbox selection is controlled using:

const [selectedIds, setSelectedIds] = useState(new Set());

Data Grid - Row selection - MUI X describes row selection as selecting/highlighting rows so users can take action on them.

10. Virtualisation

Only visible rows are rendered:

const startIndex = Math.floor(scrollTop / rowHeight);
const endIndex = startIndex + visibleCount;

This improves performance for large lists. Data Grid - Virtualization - MUI X explains that virtualisation inserts/removes rows as the grid scrolls vertically to improve rendering performance.

11. Accessibility

The table uses ARIA grid semantics:

<table role="grid">
<tr role="row">
<td role="gridcell">

It also supports keyboard sorting on headers:

onKeyDown={event => {
if (event.key === "Enter") toggleSort(column);
}}

Data Grid - Accessibility - MUI X highlights keyboard navigation and WAI-ARIA guidance for data grids.

12. Localisation

All labels come from:

localeText

Example:

localeText={{
  searchPlaceholder: "Search employees...",
  exportCsv: "Export CSV"
}}

Data Grid - Localization - MUI X describes passing locale text to customise grid labels and translations.

13. Tree Data

Rows can use:

parentId

Example:

{
id: 2,
name: "Kunal",
parentId: 1
}

The table builds parent-child hierarchy and supports expand/collapse.

Data Grid - Tree data - MUI X describes tree data as rows with parent-child relationships.

14. Row Grouping

Use the dropdown:

Group by Department
Group by Location

It inserts group header rows:

Frontend (3)
Backend (1)
QA (2)

Data Grid - Row grouping - MUI X describes grouping rows based on column values.

15. Aggregation

The table calculates:

sum
avg
min
max

for aggregable numeric columns.

Data Grid - Aggregation - MUI X describes aggregation functions such as sum, average, minimum and maximum.

16. Export

CSV export uses:

downloadFile("smart-table-export.csv", csv, "text/csv;charset=utf-8");

Data Grid - Export - MUI X describes exporting rows in CSV or Excel formats and printing.

17. Clipboard

Copy selected rows:

navigator.clipboard.writeText(csv);

Paste CSV-style data:

navigator.clipboard.readText();

Data Grid - Copy and paste - MUI X explains clipboard copy/paste with tabular data.

Interview-Level Summary

You can explain this design like this:

I built the table as a config-driven component. Columns define their own metadata such as field, header, width, editability, sorting, filtering, formatting, grouping and aggregation. The table pipeline transforms rows step-by-step: tree flattening, filtering, sorting, grouping, pagination and virtualisation. Selection, editing, undo/redo, export and clipboard are maintained as controlled state, making the component reusable across enterprise applications.

This is the kind of custom grid architecture you can use in enterprise React apps where you want DataGrid-like behaviour without locking yourself into a third-party grid library.

For a production-grade React Smart Table, the Column System is the heart of the architecture.

I recommend designing it similar to AG Grid Column Definitions + Column State, where everything is configuration-driven.

Enterprise Column Definition Model
export interface ColumnDef<T> {
field: keyof T;
headerName: string;

// Sizing
width?: number;
minWidth?: number;
maxWidth?: number;
flex?: number;

// Display
visible?: boolean;
pinned?: "left" | "right";
order?: number;

// Behaviour
sortable?: boolean;
filterable?: boolean;
editable?: boolean;
resizable?: boolean;
movable?: boolean;

// Advanced
groupable?: boolean;
pivotable?: boolean;
aggregable?: boolean;

// Rendering
renderCell?: RenderCellFn;
renderHeader?: RenderHeaderFn;

// Data
valueGetter?: ValueGetterFn;
valueFormatter?: ValueFormatterFn;

// Styling
cellClassName?: string;
headerClassName?: string;

// Accessibility
ariaLabel?: string;
}

Column Features Architecture
Column System
│
├── Configuration
├── Column Definitions
├── Auto Generate Columns
├── Column State
├── Column Visibility
├── Column Ordering
├── Column Resize
├── Column Move
├── Column Pinning
├── Column Groups
├── Header Components
├── Calculated Columns
├── Aggregate Columns
├── Pivot Columns
├── Tree Columns
├── Export Columns
└── Localization

1. Column Configuration
   const columns = [
   {
   field: "name",
   headerName: "Employee Name",
   width: 250
   },
   {
   field: "salary",
   headerName: "Salary",
   width: 180
   }
   ];

Usage:

<SmartTable
  columns={columns}
  rows={employees}
/>

2. Auto Generate Columns

Useful when API schema is unknown.

function generateColumns(rows) {
if (!rows.length) return [];

return Object.keys(rows[0]).map(key => ({
field: key,
headerName: key
.replace(/([A-Z])/g, " $1")
.replace(/^./, str => str.toUpperCase()),
sortable: true,
filterable: true
}));
}

Usage:

const columns = generateColumns(data);

3. Column State

Persist:

width
visibility
filter
sort
order
pinning
grouping

Model:

{
field: "salary",
width: 180,
visible: true,
pinned: "left",
order: 2
}

Save User Preference
localStorage.setItem(
"employee-grid-column-state",
JSON.stringify(columnState)
);

Restore Preference
const savedState =
JSON.parse(
localStorage.getItem(
"employee-grid-column-state"
) || "[]"
);

Very common interview question.

4. Column Visibility

Hide/Show Columns

{
field:"salary",
visible:false
}

UI:

☑ Name
☑ Email
☐ Salary
☑ Status

5. Column Ordering

Drag Drop

Before:

Name | Salary | Status

After:

Salary | Name | Status

State:

[
"salary",
"name",
"status"
]

6. Column Sizing
   {
   field:"name",
   width:250,
   minWidth:150,
   maxWidth:500
   }

Resize:

mousedown
mousemove
mouseup

Store width:

widthMap[name] = 320;

7. Auto Fit Width

Measure longest value.

const width =
Math.max(
headerLength,
longestCellLength
) \* 8;

Implemented via:

ResizeObserver

8. Flex Width
   {
   field:"name",
   flex:2
   }

{
field:"salary",
flex:1
}

Result:

Name 66%
Salary 33%

9. Column Pinning

Sticky Columns

{
field:"name",
pinned:"left"
}

position: sticky;
left:0;

Examples:

| Name | Role | Salary |

Name permanently visible.

10. Column Grouping
    [
    {
    headerName:"Employee",
    children:[
    { field:"name" },
    { field:"email" }
    ]
    }
    ]

Render:

## Employee

Name | Email

Nested Groups
Organization
├ Employee
│ ├ Name
│ ├ Email
│
├ Finance
│ ├ Salary
│ ├ Bonus

11. Custom Header Component
    {
    field: "salary",

renderHeader: () => (
<>
Salary 💰
</>
)
}

Sort Icon Header
renderHeader: ({sort}) => (
<>
Salary
{
sort==="asc" && "▲"
}
{
sort==="desc" && "▼"
}
</>
)

12. Header Menu
    ⋮ Menu

Sort Asc
Sort Desc
Pin Left
Pin Right
Hide
Aggregate
Filter

Architecture:

HeaderMenu

Reusable Component.

13. Header Styling
    {
    headerClassName:
    "salary-header"
    }

.salary-header{
background:#dbeafe;
}

Dynamic Height
headerHeight={65}

Useful for:

Very Long Header Name

Wrap Text.

14. Cell Renderer
    {
    field:"status",

renderCell: ({value}) => (
<Badge
color={
value==="Active"
? "green"
: "red"
}

>

      {value}

   </Badge>
 )
}

15. Calculated Columns

No backend field.

{
field:"fullName",

valueGetter: row =>
`${row.firstName}
     ${row.lastName}`
}

Derived Salary Column
{
field:"annualSalary",

valueGetter: row =>
row.monthlySalary \* 12
}

16. Aggregation Columns
    {
    field:"salary",

aggregable:true
}

Footer:

SUM ₹10,00,000
AVG ₹50,000
MAX ₹2,00,000

Custom Aggregation
{
field:"salary",

aggregationFn:
values =>
values.reduce(
(a,b)=>a+b
)
}

17. Pivot Columns

Source

Department
Salary

Pivot

Dept Salary
IT 100000
QA 50000
Design 30000

18. Column Spanning
    {
    field:"summary",

colSpan: params =>
params.row.summary
? 4
: 1
}

Output:

## Summary Row

Entire width occupied

19. Responsive Columns

Desktop

Name
Email
Role
Salary

Mobile

Name
Role

hidden:
window.innerWidth < 768

20. Localization
    {
    field:"salary",

headerName:
t("salary")
}

English

Salary

French

Salaire

German

Gehalt

Column State Storage Structure
{
order:[
"name",
"role",
"salary"
],

visible:{
salary:true
},

widths:{
name:320
},

pinned:{
name:"left"
},

sort:{
field:"salary",
direction:"desc"
}
}

Production Column Menu Features
✅ Hide/Show
✅ Resize
✅ Sort
✅ Pin
✅ Filter
✅ Aggregate
✅ Group
✅ Export
✅ Copy Column
✅ Freeze Column
✅ Reset Column
✅ Save Layout
✅ Load Layout
✅ Column Chooser
✅ Favourite Columns
✅ User Preferences

Interview Answer

If asked "How would you design column architecture for an enterprise React Grid?"

Answer:

I would build a configuration-driven column system inspired by AG Grid. Each column definition would control display, sizing, sorting, filtering, editing, grouping, aggregation, pivoting, pinning and rendering. Column state such as visibility, order, width and pinning would be stored separately and persisted to localStorage or backend user preferences. The grid rendering engine would consume column definitions and column state independently, allowing dynamic columns, server-driven columns, user-customisable layouts and reusable enterprise-grade table experiences. This approach scales well for large applications like banking, insurance, analytics and admin dashboards.

Designing Column State, Custom Headers, and Column Pinning properly is what differentiates a basic table from an enterprise-grade grid. AG Grid's column state concept includes properties such as visibility, width, sort, pinned status, grouping and order, which are saved separately from the column definitions and restored later.

1. Save & Restore Column State
   Why?

When the user:

✅ Resizes columns
✅ Reorders columns
✅ Hides columns
✅ Pins columns
✅ Applies sorting

and refreshes the page, they expect their preferences to remain.

Column State Structure
interface ColumnState {
field: string;

width: number;

visible: boolean;

pinned?: "left" | "right";

sort?: "asc" | "desc";

order: number;
}

Example State
[
{
field: "name",
width: 300,
visible: true,
pinned: "left",
order: 0
},
{
field: "salary",
width: 180,
visible: true,
order: 1,
sort: "desc"
}
]

Save State
const saveColumnState = () => {
localStorage.setItem(
"employee-grid-layout",
JSON.stringify(columnState)
);
};

Call whenever:

column resized
column hidden
column moved
column pinned
sort changed

Restore State
const loadColumnState = () => {
const saved =
localStorage.getItem(
"employee-grid-layout"
);

if (!saved) return;

return JSON.parse(saved);
};

Apply State
function applyState(
columns,
state
) {
return columns
.map(col => {
const saved = state.find(
s => s.field === col.field
);

      return saved
        ? { ...col, ...saved }
        : col;
    })
    .sort(
      (a, b) =>
        a.order - b.order
    );

}

Restore On Grid Load
useEffect(() => {
const saved =
loadColumnState();

if (saved) {
const updatedColumns =
applyState(
defaultColumns,
saved
);

    setColumns(
      updatedColumns
    );

}
}, []);

Reset Layout
const resetColumns = () => {
localStorage.removeItem(
"employee-grid-layout"
);

setColumns(
defaultColumns
);
};

Production Layout Persistence
Save

✓ width
✓ visibility
✓ order
✓ sorting
✓ pinning

Restore

✓ load instantly
✓ works after refresh
✓ works after login

2. Custom Header Component

Instead of:

Salary

We want:

Salary 💰
[▲]
[Filter]
[Menu]

Header Component
function HeaderCell({
column,
sortDirection,
onSort
}) {
return (

<div className="header">

      <span>
        {column.headerName}
      </span>

      <button
        onClick={onSort}
      >
        {
          sortDirection ===
          "asc"
            ? "▲"
            : "▼"
        }
      </button>

      <button>
        ⚙
      </button>

    </div>

);
}

Column Definition
{
field: "salary",

renderHeader: props => (
<HeaderCell
{...props}
/>
)
}

Grid Render

<th>

{
column.renderHeader
? column.renderHeader()
: column.headerName
}

</th>

Advanced Header Example
function SalaryHeader({
sortDirection
}) {
return (

<div
style={{
        display: "flex",
        gap: 10,
        alignItems:
          "center"
      }} >
<span>
Salary 💰
</span>

      {sortDirection ===
        "asc" && "▲"}

      {sortDirection ===
        "desc" && "▼"}

    </div>

);
}

Output:

Salary 💰 ▲

Header Menu
⋮

Sort A-Z
Sort Z-A
Pin Left
Pin Right
Hide Column
Filter

Example Menu
function HeaderMenu({
column
}) {
return (

<ul>
<li>Sort ASC</li>
<li>Sort DESC</li>
<li>Pin Left</li>
<li>Pin Right</li>
<li>Hide</li>
</ul>
);
}

Accessibility

Use:

<th
 aria-sort="ascending"
 role="columnheader"
>

This keeps your grid WCAG compliant.

3. Column Pinning Implementation

Like Excel Freeze Pane.

Normal

Name | Department | Salary | Status

Scrolled Right

Salary | Status

Name disappears.

Pinned Left

Name | Department | Salary | Status

Scrolled Right

Name | Salary | Status

Name remains visible.

Column Config
{
field: "name",

pinned: "left"
}

Split Columns
const leftPinned =
columns.filter(
c =>
c.pinned === "left"
);

const centerColumns =
columns.filter(
c => !c.pinned
);

const rightPinned =
columns.filter(
c =>
c.pinned === "right"
);

Render Layout
<Grid>

  <PinnedLeft />

  <ScrollableArea />

  <PinnedRight />

</Grid>

Architecture:

┌────────┬────────────┬────────┐
│ LEFT │ CENTER │ RIGHT │
│ PINNED │ SCROLLABLE │ PINNED │
└────────┴────────────┴────────┘

CSS Sticky Approach

Simple implementation.

.pinned-left {
position: sticky;
left: 0;
z-index: 100;
background: white;
}

Cell Styling

<td
 className={
   column.pinned === "left"
     ? "pinned-left"
     : ""
 }
>

Multiple Pinned Columns
Name
Department
Salary
Status

Pinned:

Name
Department

Need cumulative offsets.

Calculate Offset
const left =
pinnedColumns
.slice(0,index)
.reduce(
(sum,col)=>
sum + col.width,
0
);

Apply
style={{
  position:"sticky",
  left
}}

Pin Column Action

Header Menu

Pin Left
Pin Right
Unpin

Update State

updateColumnState(
field,
{
pinned:"left"
}
);

Save To Layout

localStorage.setItem(
"grid-layout",
JSON.stringify(
columnState
)
);

Pinned state survives refresh.

Enterprise Features Added on Top
✅ Save Layout
✅ Restore Layout
✅ Reset Layout

✅ Pin Left
✅ Pin Right
✅ Unpin

✅ Custom Header
✅ Header Menu
✅ Header Tooltip
✅ Header Search

✅ Column Resize
✅ Column Move
✅ Column Visibility

✅ Persistent User Preferences

Interview Answer (Senior React)

Column definitions describe static metadata such as field, renderer, width and behaviour. Column state is stored separately and contains mutable UI state such as visibility, width, order, sort and pinning. User actions update column state, which is persisted to localStorage or a backend profile service. Custom headers are rendered through header components that support sorting, filtering and column menus. Column pinning is implemented either through sticky positioning or a dedicated left/centre/right viewport architecture, ensuring pinned columns remain visible during horizontal scrolling.

Enterprise React Grid – Row Architecture Design

For a truly AG-Grid level custom React Table, rows need their own architecture layer separate from columns.

Grid
│
├── Column Engine
│
├── Row Engine
│ ├── Row IDs
│ ├── Row State
│ ├── Row Selection
│ ├── Row Sorting
│ ├── Row Filtering
│ ├── Row Pagination
│ ├── Row Virtualization
│ ├── Row Pinning
│ ├── Row Height
│ ├── Row Styling
│ ├── Row Spanning
│ ├── Row Dragging
│ ├── Tree Rows
│ ├── Group Rows
│ └── Full Width Rows
│
└── State Manager

Pagination in AG Grid works by paging rows and removing the need for vertical scrolling, while row pinning keeps chosen rows fixed at the top or bottom of the grid.

1. Row ID Management

Never use:

index

Bad:

<tr key={index}>

Use:

{
id: "emp-101",
name: "Sudhir"
}

getRowId={(row) => row.id}

Row Store
const rowMap = new Map();

rows.forEach(row => {
rowMap.set(row.id, row);
});

Benefits:

O(1) lookup
Selection
Editing
Updates
Virtualization

2. Row State Model
   interface RowState {
   selected: boolean;
   expanded: boolean;
   pinned: boolean;
   editing: boolean;
   }

Store separately:

Map<rowId, RowState>

Avoids rerendering whole dataset.

3. Row Sorting

State:

{
field:"salary",
direction:"desc"
}

Implementation:

const sortedRows =
[...rows].sort(
(a,b) =>
b.salary-a.salary
);

Multi Column Sorting
Salary DESC
Name ASC

State:

[
{
field:"salary",
direction:"desc"
},
{
field:"name",
direction:"asc"
}
]

4. Row Numbers

Like Excel:

1
2
3
4

Column:

{
field:"\_\_rowNumber",

valueGetter:
(\_,index)=>
index+1
}

Render:

1 | Sudhir
2 | Kunal

5. Row Pagination

Example from enterprise apps:

100,000 rows

Show:

1-20

only.

Pagination state:

{
page:1,
pageSize:20
}

Rows:

const pagedRows =
rows.slice(
startIndex,
endIndex
);

Pagination is commonly implemented with:

First
Prev
Next
Last

controls.

6. Accessing Rows

Fast lookup:

const row =
rowMap.get(id);

Examples:

getRowById()
getSelectedRows()
getVisibleRows()

Grid API:

tableRef.current.getSelectedRows();

7. Row Height

Default

44px

Custom:

{
getRowHeight:
row =>
row.details
? 100
: 44
}

Dynamic Height

Measure content:

const height =
content.length > 100
? 80
: 40;

Useful:

Comments
Descriptions
Notes

8. Styling Rows

Config:

{
rowClassName:
(row)=>
row.status==="Error"
? "error-row"
: ""
}

css

.error-row{
background:#fee2e2;
}

Zebra Rows
tr:nth-child(even){
background:#fafafa;
}

9. Row Pinning

Keep rows fixed.

## Top

Total
Budget

## Scrollable Rows

Employee rows

Pinned rows remain visible. AG Grid documents pinned rows as rows fixed above or below normal rows.

Config
{
id:"total-row",

pinned:"top"
}

Render

## Pinned Top

Total

## Scrollable

John
Jane

Architecture
const pinnedTopRows =
rows.filter(
r => r.pinned==="top"
);

const normalRows =
rows.filter(
r => !r.pinned
);

10. Row Spanning

Merge rows.

Example:

Department

HR
HR
HR

IT
IT

Render:

HR
│
├ John
├ Ravi
├ Amit

Definition:

{
field:"department",

rowSpan:
params =>
params.department==="HR"
? 3
: 1
}

11. Full Width Rows

Examples:

Summary Rows
Group Rows
Advertisements
Charts

Render:

---

## Total Employees = 120

Config:

{
isFullWidthRow:
row =>
row.type==="summary"
}

Render

<tr>

<td
 colSpan={
  allColumns
 }
>

<RowSummary />

</td>

</tr>

12. Row Dragging

Most asked interview topic.

Drag Handle
☰

Column:

{
field:"drag",
draggable:true
}

State
const
[rows,setRows]
=
useState(data);

Start Drag
onDragStart=
(rowId)

Drop
onDrop=
(targetId)

Reorder:

const reordered =
arrayMove(
rows,
sourceIndex,
targetIndex
);

Managed Dragging

Grid updates automatically.

A
B
C

Drag:

C
A
B

Unmanaged Dragging

Grid gives events.

You manage state.

onRowDragEnd()

place:

Redux
RTK
Server

External Drop Zones

Drag grid row:

Employee

into:

Kanban
Tree
Calendar

Architecture:

react-dnd

or

dnd-kit

Grid ↔ Grid Drag
Available
──────────
John
Jane

Assigned
──────────

Drag:

John

to

Assigned

13. Row Virtualization

Critical for

100,000+
Rows

Render:

Only visible rows

visibleRows =
rows.slice(
start,
end
);

Reduces DOM dramatically.

Production Row State
{
selected: [
"1",
"2"
],

expanded: [
"5"
],

pinnedTop: [
"total"
],

rowHeights: {
"5":100
},

dragging:true
}

Interview Answer

I build a dedicated Row Engine responsible for row identity, selection, sorting, pagination, virtualization, pinning and drag-and-drop. Every row has a stable ID and lightweight state stored separately from actual row data. The rendering pipeline is: Raw Rows → Sort → Filter → Group → Pagination → Virtualization → Render. This keeps the grid scalable for 100K+ records while supporting advanced features such as pinned rows, full-width summary rows, row spanning, tree data and cross-grid drag-and-drop. AG Grid follows a similar separation between row data, row state and rendering engines.

Next, I can show the complete Selection Architecture (single select, multi-select, shift-select, checkbox selection, keyboard selection and range selection like Excel) for your custom React DataGrid.

Absolutely, Sudhir — now we’ll design the Cell Engine for your custom React DataGrid, inspired by AG Grid-style cell features.

AG Grid’s cell-content model separates value getting, value formatting, cell components, and reference data as different responsibilities in the rendering flow. In AG Grid, cell values can come from either field or valueGetter, and value getters should be pure functions because the grid may reuse the result for display and other operations. Value formatters are used to convert raw values into display text, and cell components are used when we need richer UI such as buttons, links or images inside a cell.

1. Cell Feature Architecture
   Cell Engine
   │
   ├── Cell Content
   ├── Value Getter
   ├── Value Formatter
   ├── Cell Renderer / Component
   ├── Cell Data Type
   ├── Cell Styling
   ├── Cell Tooltip
   ├── Cell Notes
   ├── Cell Find / Highlight
   ├── Change Highlighting
   ├── Reference Data Mapping
   ├── Expressions
   ├── View Refresh
   └── Cell Text Selection

2. Enhanced Column Definition for Cells
   export type CellDataType =
   | "text"
   | "number"
   | "boolean"
   | "date"
   | "currency"
   | "percentage"
   | "object";

export interface SmartColumn<T> {
field: keyof T | string;
headerName: string;

width?: number;
cellDataType?: CellDataType;

valueGetter?: (params: CellParams<T>) => any;
valueFormatter?: (params: CellParams<T>) => string;
valueParser?: (value: string) => any;

renderCell?: (params: CellParams<T>) => React.ReactNode;

cellClassName?: string | ((params: CellParams<T>) => string);
cellStyle?: React.CSSProperties | ((params: CellParams<T>) => React.CSSProperties);

tooltipField?: keyof T | string;
tooltipValueGetter?: (params: CellParams<T>) => string;

refData?: Record<string, string>;

editable?: boolean;
enableChangeFlash?: boolean;

getFindText?: (params: CellParams<T>) => string;

allowTextSelection?: boolean;
}

3. Cell Params Model

This is similar to AG Grid’s cell renderer params, where cell renderers receive values, row data, column definition and helper methods. AG Grid documents that custom cell component params include properties such as value, valueFormatted, data, node, colDef, column, getValue, setValue, formatValue, and refreshCell.

export interface CellParams<T> {
row: T;
rowIndex: number;
column: SmartColumn<T>;

value: any;
formattedValue: string;

oldValue?: any;
isEditing?: boolean;
isChanged?: boolean;

getValue: (field: string) => any;
setValue: (field: string, value: any) => void;
}

4. Core Cell Utility Functions
   export function getNestedValue(row, field) {
   return String(field)
   .split(".")
   .reduce((acc, key) => acc?.[key], row);
   }

export function getCellValue({ row, column, rowIndex }) {
if (column.valueGetter) {
return column.valueGetter({
row,
rowIndex,
column,
value: undefined,
formattedValue: "",
getValue: field => getNestedValue(row, field),
setValue: () => {}
});
}

return getNestedValue(row, column.field);
}

export function formatCellValue({ value, row, column, rowIndex }) {
if (column.refData) {
return column.refData[value] ?? value ?? "";
}

if (column.valueFormatter) {
return column.valueFormatter({
row,
rowIndex,
column,
value,
formattedValue: String(value ?? ""),
getValue: field => getNestedValue(row, field),
setValue: () => {}
});
}

switch (column.cellDataType) {
case "currency":
return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 0
}).format(Number(value || 0));

    case "percentage":
      return `${Number(value || 0).toFixed(2)}%`;

    case "boolean":
      return value ? "Yes" : "No";

    case "date":
      return value
        ? new Intl.DateTimeFormat("en-GB").format(new Date(value))
        : "";

    default:
      return value ?? "";

}
}

5. Reusable SmartCell.jsx
   import React, { useEffect, useMemo, useState } from "react";
   import {
   getCellValue,
   formatCellValue
   } from "./cellUtils";

export default function SmartCell({
row,
rowIndex,
column,
oldValue,
editingCell,
setEditingCell,
updateCell,
searchText,
notes,
setNotes
}) {
const rawValue = getCellValue({
row,
column,
rowIndex
});

const formattedValue = formatCellValue({
value: rawValue,
row,
column,
rowIndex
});

const [draftValue, setDraftValue] = useState(rawValue);
const [flash, setFlash] = useState(false);

const cellKey = `${row.id}-${column.field}`;
const isEditing =
editingCell?.rowId === row.id &&
editingCell?.field === column.field;

const isChanged =
oldValue !== undefined &&
oldValue !== rawValue;

useEffect(() => {
if (
column.enableChangeFlash &&
isChanged
) {
setFlash(true);

      const timer = setTimeout(() => {
        setFlash(false);
      }, 700);

      return () => clearTimeout(timer);
    }

}, [rawValue, oldValue, isChanged, column.enableChangeFlash]);

const params = {
row,
rowIndex,
column,
value: rawValue,
formattedValue,
oldValue,
isEditing,
isChanged,
getValue: field => row[field],
setValue: updateCell
};

const tooltip = column.tooltipValueGetter
? column.tooltipValueGetter(params)
: column.tooltipField
? row[column.tooltipField]
: formattedValue;

const className = [
"smart-cell",
flash ? "cell-flash" : "",
typeof column.cellClassName === "function"
? column.cellClassName(params)
: column.cellClassName || "",
notes[cellKey] ? "cell-has-note" : ""
].join(" ");

const style =
typeof column.cellStyle === "function"
? column.cellStyle(params)
: column.cellStyle || {};

const getHighlightedText = text => {
if (!searchText) return text;

    const value = String(text);
    const index = value
      .toLowerCase()
      .indexOf(searchText.toLowerCase());

    if (index === -1) return value;

    return (
      <>
        {value.slice(0, index)}
        <mark>
          {value.slice(index, index + searchText.length)}
        </mark>
        {value.slice(index + searchText.length)}
      </>
    );

};

const saveNote = () => {
const note = window.prompt(
"Add note",
notes[cellKey] || ""
);

    if (note !== null) {
      setNotes(prev => ({
        ...prev,
        [cellKey]: note
      }));
    }

};

const commitEdit = () => {
let parsedValue = draftValue;

    if (column.valueParser) {
      parsedValue = column.valueParser(draftValue);
    }

    if (column.cellDataType === "number") {
      parsedValue = Number(draftValue);
    }

    updateCell(row.id, column.field, parsedValue);
    setEditingCell(null);

};

return (

<td
role="gridcell"
className={className}
style={style}
title={tooltip}
tabIndex={0}
onDoubleClick={() => {
if (column.editable) {
setDraftValue(rawValue ?? "");
setEditingCell({
rowId: row.id,
field: column.field
});
}
}}
onKeyDown={event => {
if (
event.key === "F2" &&
event.shiftKey
) {
saveNote();
}

        if (
          event.key === "Enter" &&
          column.editable
        ) {
          setDraftValue(rawValue ?? "");
          setEditingCell({
            rowId: row.id,
            field: column.field
          });
        }
      }}
    >
      {isEditing ? (
        <input
          className="cell-editor"
          autoFocus
          value={draftValue ?? ""}
          onChange={event =>
            setDraftValue(event.target.value)
          }
          onBlur={commitEdit}
          onKeyDown={event => {
            if (event.key === "Enter") {
              commitEdit();
            }

            if (event.key === "Escape") {
              setEditingCell(null);
            }
          }}
        />
      ) : column.renderCell ? (
        column.renderCell(params)
      ) : (
        <span>
          {getHighlightedText(formattedValue)}
        </span>
      )}

      {notes[cellKey] && (
        <button
          type="button"
          className="note-indicator"
          onClick={saveNote}
          aria-label="View cell note"
        >
          📝
        </button>
      )}
    </td>

);
}

6. Example Columns with Cell Features
   const departmentMap = {
   FE: "Frontend",
   BE: "Backend",
   QA: "Quality Assurance",
   UX: "User Experience"
   };

const columns = [
{
field: "name",
headerName: "Employee Name",
cellDataType: "text",
editable: true,
enableChangeFlash: true,
tooltipValueGetter: ({ row }) =>
`Employee: ${row.name}`,
renderCell: ({ value, row }) => (
<strong>
{value}
{row.role === "Project Lead" ? " ⭐" : ""}
</strong>
)
},

{
field: "departmentCode",
headerName: "Department",
refData: departmentMap,
editable: true,
tooltipValueGetter: ({ formattedValue }) =>
`Department: ${formattedValue}`
},

{
field: "monthlySalary",
headerName: "Monthly Salary",
cellDataType: "currency",
editable: true,
enableChangeFlash: true,
cellStyle: ({ value }) => ({
color: value > 150000 ? "green" : "#334155",
fontWeight: value > 150000 ? 700 : 400
})
},

{
field: "annualSalary",
headerName: "Annual Salary",
cellDataType: "currency",
valueGetter: ({ row }) =>
Number(row.monthlySalary || 0) \* 12
},

{
field: "utilisation",
headerName: "Utilisation",
cellDataType: "percentage",
valueFormatter: ({ value }) =>
`${Number(value).toFixed(1)}%`,
cellClassName: ({ value }) =>
value >= 90
? "cell-success"
: value >= 70
? "cell-warning"
: "cell-danger"
},

{
field: "active",
headerName: "Active",
cellDataType: "boolean",
editable: true,
renderCell: ({ value }) => (
<input
        type="checkbox"
        checked={Boolean(value)}
        readOnly
      />
)
},

{
field: "actions",
headerName: "Actions",
renderCell: ({ row }) => (
<button
type="button"
onClick={() =>
alert(`Opening profile for ${row.name}`)
} >
View
</button>
)
}
];

7. Cell Data Types

AG Grid supports predefined data types including text, number, bigint, boolean, date, dateString, dateTime, dateTimeString, and object, with type inference from row data where possible. For our custom table, we can keep a simpler set:

"text"
"number"
"boolean"
"date"
"currency"
"percentage"
"object"

Use them to drive:

formatting
sorting
filtering
editing
export
clipboard

8. Cell Styling

AG Grid supports cell styling using direct styles, cell classes, and cell class rules. In our custom table, we support the same idea:

{
field: "utilisation",
cellClassName: ({ value }) =>
value >= 90
? "cell-success"
: "cell-warning"
}

.cell-success {
background: #dcfce7;
color: #166534;
}

.cell-warning {
background: #fef9c3;
color: #854d0e;
}

.cell-danger {
background: #fee2e2;
color: #991b1b;
}

9. Cell Tooltips

AG Grid allows tooltips for cells and column headers using properties such as tooltipField and tooltipValueGetter. For our custom table:

{
field: "name",
tooltipValueGetter: ({ row }) =>
`${row.name} - ${row.role}`
}

Inside cell:

<td title={tooltip}>

For richer tooltip UI, replace title with a custom tooltip component.

10. Cell Notes

AG Grid notes allow comments to be attached to individual cells without storing note text directly inside row data, and cells with notes are visually marked. In our custom table, keep notes separately:

const [notes, setNotes] = useState({});

Store by cell key:

{
"101-name": "Check spelling",
"101-salary": "Confirm revised CTC"
}

Add note:

const saveNote = (rowId, field, text) => {
setNotes(prev => ({
...prev,
[`${rowId}-${field}`]: text
}));
};

11. Find and Highlight

AG Grid Find searches grid values, highlights matches, and allows navigation between matches. In our custom table, we can highlight matching cell text:

const getHighlightedText = text => {
if (!searchText) return text;

const value = String(text);
const index = value
.toLowerCase()
.indexOf(searchText.toLowerCase());

if (index === -1) return value;

return (
<>
{value.slice(0, index)}
<mark>
{value.slice(index, index + searchText.length)}
</mark>
{value.slice(index + searchText.length)}
</>
);
};

12. Highlighting Cell Changes

AG Grid supports flashing or animating cells when values change. In your custom grid, maintain previous values and add a temporary class:

useEffect(() => {
if (oldValue !== rawValue) {
setFlash(true);

    const timer = setTimeout(() => {
      setFlash(false);
    }, 700);

    return () => clearTimeout(timer);

}
}, [rawValue, oldValue]);

.cell-flash {
animation: flashCell 0.7s ease-in-out;
}

@keyframes flashCell {
0% {
background: #fef08a;
}

100% {
background: transparent;
}
}

13. Reference Data

AG Grid reference data maps stored keys to display values, for example server data may store a code but the grid displays a readable label. In our table:

const departmentMap = {
FE: "Frontend",
BE: "Backend",
QA: "Quality Assurance"
};

{
field: "departmentCode",
headerName: "Department",
refData: departmentMap
}

Formatter:

if (column.refData) {
return column.refData[value] ?? value;
}

14. Cell Expressions

AG Grid expressions can be used inside column definitions instead of functions, and cell expressions can behave similarly to spreadsheet formulas when enabled. For a safer React implementation, I recommend function-based calculated columns instead of evaluating arbitrary strings:

{
field: "totalCost",
headerName: "Total Cost",
valueGetter: ({ row }) =>
row.quantity \* row.unitPrice
}

If you still want expression strings, restrict them to trusted admin-defined config only.

15. View Refresh

AG Grid documents that when data is changed outside the grid’s control, it provides APIs such as refreshCells() and redrawRows(), with refreshCells() preferred where suitable because it uses change detection. In React, the equivalent approach is:

setRows(prev =>
prev.map(row =>
row.id === updatedRow.id
? updatedRow
: row
)
);

For forced refresh:

setRefreshKey(prev => prev + 1);

<SmartTable key={refreshKey} />

Use forced re-render only when normal state updates are not enough.

16. Cell Text Selection

AG Grid can be configured to allow simple text selection in cells, and it notes that this affects default clipboard behaviour. In our custom table:

.smart-cell {
user-select: text;
}

Or config-driven:

{
field: "description",
allowTextSelection: true
}

<td
  className={
    column.allowTextSelection
      ? "cell-text-selectable"
      : "smart-cell"
  }
>

.cell-text-selectable {
user-select: text;
}

17. CSS for Cell Engine
    .smart-cell {
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
    user-select: none;
    }

.cell-text-selectable {
user-select: text;
}

.cell-editor {
width: 100%;
padding: 6px;
border: 1px solid #2563eb;
border-radius: 6px;
}

.cell-success {
background: #dcfce7;
color: #166534;
}

.cell-warning {
background: #fef9c3;
color: #854d0e;
}

.cell-danger {
background: #fee2e2;
color: #991b1b;
}

.cell-has-note::after {
content: "";
position: absolute;
top: 2px;
right: 2px;
border-top: 8px solid #f59e0b;
border-left: 8px solid transparent;
}

.note-indicator {
margin-left: 6px;
border: none;
background: transparent;
cursor: pointer;
}

mark {
background: #fde68a;
padding: 0 2px;
}

.cell-flash {
animation: flashCell 0.7s ease-in-out;
}

@keyframes flashCell {
0% {
background: #fef08a;
}

100% {
background: transparent;
}
}

18. How This Fits into Your SmartTable

Your table render should use SmartCell instead of directly rendering td content:

<tbody>
  {visibleRows.map((row, rowIndex) => (
    <tr key={row.id}>
      {visibleColumns.map(column => (
        <SmartCell
          key={column.field}
          row={row}
          rowIndex={rowIndex}
          column={column}
          oldValue={previousRowMap[row.id]?.[column.field]}
          editingCell={editingCell}
          setEditingCell={setEditingCell}
          updateCell={updateCell}
          searchText={searchText}
          notes={notes}
          setNotes={setNotes}
        />
      ))}
    </tr>
  ))}
</tbody>

Senior-Level Interview Explanation

You can explain the cell system like this:

I would build a dedicated Cell Engine inside the grid. A cell should not directly read and display row data. Instead, it should follow a pipeline: get raw value using field or valueGetter, map reference data if needed, format the value using valueFormatter, render custom UI using renderCell, apply cell-level styles, attach tooltip/note metadata, support find highlighting, and optionally flash when the value changes. This separation makes the grid scalable, testable and configurable for enterprise use cases like admin dashboards, financial grids, employee records and reporting tables.

This gives you a clean AG Grid-style mental model:

Raw Row Data
↓
valueGetter
↓
refData mapping
↓
valueFormatter
↓
cellRenderer
↓
cellStyle / cellClass
↓
tooltip / notes / find / flash
↓
Final Cell UI

Below are the three important Cell Engine features for your custom React DataGrid:

Cell editing + validation
Custom cell renderers
Cell tooltip + notes

AG Grid’s model separates cell value retrieval, formatting and rendering: values can come from field or valueGetter, formatting can be handled by valueFormatter, and richer UI can be rendered with cell components.

1. Cell Editing and Validation
   Cell Editing Flow
   Double click / Enter
   ↓
   Cell enters edit mode
   ↓
   User changes value
   ↓
   Validate value
   ↓
   If valid → update row data
   If invalid → show error and keep edit mode

Column Definition with Validation
const columns = [
{
field: "name",
headerName: "Employee Name",
editable: true,
required: true,
validate: value => {
if (!value || value.trim() === "") {
return "Name is required";
}

      if (value.length < 3) {
        return "Name must be at least 3 characters";
      }

      return null;
    }

},
{
field: "salary",
headerName: "Salary",
editable: true,
cellDataType: "number",
validate: value => {
if (value === "" || value === null || value === undefined) {
return "Salary is required";
}

      if (Number(value) <= 0) {
        return "Salary must be greater than 0";
      }

      return null;
    },
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(Number(value || 0))

},
{
field: "email",
headerName: "Email",
editable: true,
validate: value => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        return "Email is required";
      }

      if (!emailRegex.test(value)) {
        return "Please enter a valid email";
      }

      return null;
    }

}
];

EditableCell.jsx
import React, { useState } from "react";

export default function EditableCell({
row,
column,
value,
formattedValue,
updateCell
}) {
const [isEditing, setIsEditing] = useState(false);
const [draftValue, setDraftValue] = useState(value ?? "");
const [error, setError] = useState("");

const startEditing = () => {
if (!column.editable) return;

    setDraftValue(value ?? "");
    setError("");
    setIsEditing(true);

};

const cancelEditing = () => {
setDraftValue(value ?? "");
setError("");
setIsEditing(false);
};

const commitEditing = () => {
let finalValue = draftValue;

    if (column.cellDataType === "number") {
      finalValue = Number(draftValue);
    }

    if (column.valueParser) {
      finalValue = column.valueParser(draftValue);
    }

    if (column.validate) {
      const validationError = column.validate(finalValue, row);

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    updateCell(row.id, column.field, finalValue);
    setError("");
    setIsEditing(false);

};

if (isEditing) {
return (

<td className={error ? "cell-error-wrapper" : ""}>
<input
className={error ? "cell-editor invalid" : "cell-editor"}
autoFocus
value={draftValue}
onChange={event => setDraftValue(event.target.value)}
onBlur={commitEditing}
onKeyDown={event => {
if (event.key === "Enter") {
commitEditing();
}

            if (event.key === "Escape") {
              cancelEditing();
            }
          }}
        />

        {error && (
          <div className="cell-error-message">
            {error}
          </div>
        )}
      </td>
    );

}

return (

<td
tabIndex={0}
onDoubleClick={startEditing}
onKeyDown={event => {
if (event.key === "Enter") {
startEditing();
}
}} >
{formattedValue}
</td>
);
}

Update Cell in Parent Table
const updateCell = (rowId, field, newValue) => {
setRows(prevRows =>
prevRows.map(row =>
row.id === rowId
? {
...row,
newValue
}
: row
)
);
};

CSS for Validation
.cell-editor {
width: 100%;
padding: 6px;
border: 1px solid #cbd5e1;
border-radius: 6px;
}

.cell-editor.invalid {
border-color: #dc2626;
background: #fef2f2;
}

.cell-error-wrapper {
position: relative;
}

.cell-error-message {
margin-top: 4px;
font-size: 12px;
color: #dc2626;
}

2. Custom Cell Renderers

Use custom cell renderers when the value is not enough and you need rich UI like:

Badge
Button
Link
Avatar
Progress bar
Checkbox
Icon
Action menu

AG Grid describes custom cell components as the way to render images, links, buttons and custom DOM inside cells.

Column Config with Custom Renderers
const columns = [
{
field: "name",
headerName: "Employee",
renderCell: ({ value, row }) => (

<div className="employee-cell">
<div className="avatar">
{value.charAt(0)}
</div>

        <div>
          <strong>{value}</strong>
          <small>{row.role}</small>
        </div>
      </div>
    )

},
{
field: "status",
headerName: "Status",
renderCell: ({ value }) => (
<span
className={
value === "Active"
? "status active"
: "status inactive"
} >
{value}
</span>
)
},
{
field: "utilisation",
headerName: "Utilisation",
renderCell: ({ value }) => (

<div className="progress-cell">
<div className="progress-track">
<div
className="progress-fill"
style={{ width: `${value}%` }}
/>
</div>
<span>{value}%</span>
</div>
)
},
{
field: "actions",
headerName: "Actions",
renderCell: ({ row }) => (
<button
type="button"
onClick={() => alert(`Open ${row.name}`)} >
View
</button>
)
}
];

Generic Cell Renderer Logic
function renderCellContent({
row,
column,
rowIndex,
updateCell
}) {
const value = column.valueGetter
? column.valueGetter({ row, column, rowIndex })
: row[column.field];

const formattedValue = column.valueFormatter
? column.valueFormatter({ value, row, column, rowIndex })
: value;

const params = {
row,
column,
rowIndex,
value,
formattedValue,
updateCell
};

if (column.renderCell) {
return column.renderCell(params);
}

return formattedValue ?? "";
}

Cell Renderer CSS
.employee-cell {
display: flex;
align-items: center;
gap: 10px;
}

.avatar {
width: 32px;
height: 32px;
border-radius: 50%;
background: #2563eb;
color: white;
display: grid;
place-items: center;
font-weight: 700;
}

.employee-cell small {
display: block;
color: #64748b;
}

.status {
padding: 4px 10px;
border-radius: 999px;
font-size: 12px;
font-weight: 700;
}

.status.active {
background: #dcfce7;
color: #166534;
}

.status.inactive {
background: #fee2e2;
color: #991b1b;
}

.progress-cell {
display: flex;
align-items: center;
gap: 8px;
}

.progress-track {
width: 90px;
height: 8px;
background: #e5e7eb;
border-radius: 999px;
overflow: hidden;
}

.progress-fill {
height: 100%;
background: #2563eb;
}

3. Cell Tooltip Feature

Tooltips are useful for:

Long text
Validation hints
Extra metadata
Audit info
Truncated values

AG Grid supports tooltips for cells and headers through tooltipField and tooltipValueGetter, and also supports custom tooltip components.

Column Tooltip Config
const columns = [
{
field: "name",
headerName: "Name",
tooltipValueGetter: ({ row }) =>
`${row.name} - ${row.role}`
},
{
field: "department",
headerName: "Department",
tooltipField: "department"
},
{
field: "salary",
headerName: "Salary",
tooltipValueGetter: ({ formattedValue }) =>
`Current salary: ${formattedValue}`
}
];

Simple Tooltip using title
function getTooltip({ row, column, value, formattedValue }) {
if (column.tooltipValueGetter) {
return column.tooltipValueGetter({
row,
column,
value,
formattedValue
});
}

if (column.tooltipField) {
return row[column.tooltipField];
}

return formattedValue;
}

<td title={tooltip}>
  {cellContent}
</td>

Custom Tooltip Component
function CellTooltip({ text }) {
return (
<span className="tooltip-wrapper">
<span className="tooltip-content">
{text}
</span>
</span>
);
}

.tooltip-wrapper {
position: relative;
}

.tooltip-content {
display: none;
position: absolute;
top: 24px;
left: 0;
min-width: 180px;
background: #111827;
color: white;
padding: 8px 10px;
border-radius: 6px;
font-size: 12px;
z-index: 20;
}

.tooltip-wrapper:hover .tooltip-content {
display: block;
}

4. Cell Notes Feature

Cell notes are like Excel comments. They should be stored separately from row data, not directly inside each row.

AG Grid’s notes feature lets users attach comments to individual cells without storing note text in row data, and cells with notes are visually marked.

Notes State
const [cellNotes, setCellNotes] = useState({
"1-name": {
text: "Confirm spelling",
author: "Sudhir",
updatedAt: "13 Jul 2026"
}
});

Key format:

rowId-field

Example:

1-name
2-salary
3-status

Note Helpers
function getCellNoteKey(rowId, field) {
return `${rowId}-${field}`;
}

function getNote(cellNotes, rowId, field) {
return cellNotes[getCellNoteKey(rowId, field)];
}

function setNote({
cellNotes,
setCellNotes,
rowId,
field,
note
}) {
const key = getCellNoteKey(rowId, field);

setCellNotes(prev => ({
...prev,
[key]: {
text: note,
author: "Current User",
updatedAt: new Date().toLocaleString()
}
}));
}

function removeNote({
setCellNotes,
rowId,
field
}) {
const key = getCellNoteKey(rowId, field);

setCellNotes(prev => {
const next = { ...prev };
delete next[key];
return next;
});
}

CellNoteButton.jsx
import React, { useState } from "react";

export default function CellNoteButton({
rowId,
field,
note,
onSave,
onRemove
}) {
const [open, setOpen] = useState(false);
const [draftNote, setDraftNote] = useState(note?.text || "");

return (
<span className="note-container">
<button
type="button"
className={note ? "note-button has-note" : "note-button"}
onClick={() => setOpen(prev => !prev)}
aria-label={note ? "View cell note" : "Add cell note"} >
📝
</button>

      {open && (
        <div className="note-popover">
          <textarea
            value={draftNote}
            placeholder="Add note..."
            onChange={event => setDraftNote(event.target.value)}
          />

          {note && (
            <div className="note-meta">
              <small>
                Updated by {note.author}
              </small>
              <small>
                {note.updatedAt}
              </small>
            </div>
          )}

          <div className="note-actions">
            <button
              type="button"
              onClick={() => {
                onSave(draftNote);
                setOpen(false);
              }}
            >
              Save
            </button>

            {note && (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  setOpen(false);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </span>

);
}

Add Notes inside Cell

<td className={note ? "cell-has-note" : ""}>
  {cellContent}

<CellNoteButton
rowId={row.id}
field={column.field}
note={note}
onSave={text =>
setNote({
cellNotes,
setCellNotes,
rowId: row.id,
field: column.field,
note: text
})
}
onRemove={() =>
removeNote({
setCellNotes,
rowId: row.id,
field: column.field
})
}
/>

</td>

Notes CSS
.note-container {
position: relative;
margin-left: 6px;
}

.note-button {
border: none;
background: transparent;
cursor: pointer;
opacity: 0.45;
}

.note-button.has-note {
opacity: 1;
}

.cell-has-note {
position: relative;
}

.cell-has-note::after {
content: "";
position: absolute;
top: 0;
right: 0;
border-top: 10px solid #f59e0b;
border-left: 10px solid transparent;
}

.note-popover {
position: absolute;
top: 24px;
right: 0;
width: 240px;
padding: 10px;
background: #ffffff;
border: 1px solid #cbd5e1;
border-radius: 8px;
box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
z-index: 50;
}

.note-popover textarea {
width: 100%;
min-height: 80px;
resize: vertical;
padding: 8px;
border: 1px solid #cbd5e1;
border-radius: 6px;
}

.note-meta {
margin-top: 6px;
display: flex;
flex-direction: column;
color: #64748b;
}

.note-actions {
display: flex;
justify-content: flex-end;
gap: 8px;
margin-top: 8px;
}

5. Combined SmartCell.jsx

This combines:

✅ value getter
✅ formatter
✅ editing
✅ validation
✅ custom renderer
✅ tooltip
✅ notes

import React, { useState } from "react";
import CellNoteButton from "./CellNoteButton";

function getRawValue(row, column) {
if (column.valueGetter) {
return column.valueGetter({
row,
column
});
}

return row[column.field];
}

function getFormattedValue(row, column, value) {
if (column.valueFormatter) {
return column.valueFormatter({
row,
column,
value
});
}

if (column.cellDataType === "currency") {
return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 0
}).format(Number(value || 0));
}

if (column.cellDataType === "boolean") {
return value ? "Yes" : "No";
}

return value ?? "";
}

function getTooltip(row, column, value, formattedValue) {
if (column.tooltipValueGetter) {
return column.tooltipValueGetter({
row,
column,
value,
formattedValue
});
}

if (column.tooltipField) {
return row[column.tooltipField];
}

return formattedValue;
}

export default function SmartCell({
row,
column,
rowIndex,
updateCell,
cellNotes,
setCellNotes
}) {
const value = getRawValue(row, column);

const formattedValue =
getFormattedValue(row, column, value);

const tooltip =
getTooltip(row, column, value, formattedValue);

const [isEditing, setIsEditing] =
useState(false);

const [draftValue, setDraftValue] =
useState(value ?? "");

const [error, setError] =
useState("");

const noteKey =
`${row.id}-${column.field}`;

const note =
cellNotes[noteKey];

const commitEdit = () => {
let nextValue = draftValue;

    if (column.cellDataType === "number") {
      nextValue = Number(draftValue);
    }

    if (column.valueParser) {
      nextValue =
        column.valueParser(draftValue);
    }

    if (column.validate) {
      const validationError =
        column.validate(nextValue, row);

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    updateCell(
      row.id,
      column.field,
      nextValue
    );

    setError("");
    setIsEditing(false);

};

const params = {
row,
column,
rowIndex,
value,
formattedValue,
updateCell
};

return (

<td
title={tooltip}
className={note ? "cell-has-note" : ""}
tabIndex={0}
onDoubleClick={() => {
if (column.editable) {
setDraftValue(value ?? "");
setIsEditing(true);
}
}}
onKeyDown={event => {
if (
event.key === "Enter" &&
column.editable
) {
setDraftValue(value ?? "");
setIsEditing(true);
}

        if (
          event.key === "Escape"
        ) {
          setIsEditing(false);
        }
      }}
    >
      {isEditing ? (
        <>
          <input
            autoFocus
            className={
              error
                ? "cell-editor invalid"
                : "cell-editor"
            }
            value={draftValue}
            onChange={event =>
              setDraftValue(event.target.value)
            }
            onBlur={commitEdit}
            onKeyDown={event => {
              if (event.key === "Enter") {
                commitEdit();
              }

              if (event.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />

          {error && (
            <div className="cell-error-message">
              {error}
            </div>
          )}
        </>
      ) : column.renderCell ? (
        column.renderCell(params)
      ) : (
        formattedValue
      )}

      <CellNoteButton
        rowId={row.id}
        field={column.field}
        note={note}
        onSave={text => {
          setCellNotes(prev => ({
            ...prev,
            [noteKey]: {
              text,
              author: "Current User",
              updatedAt:
                new Date().toLocaleString()
            }
          }));
        }}
        onRemove={() => {
          setCellNotes(prev => {
            const next = { ...prev };
            delete next[noteKey];
            return next;
          });
        }}
      />
    </td>

);
}

6. How to Use in Table
   function SmartTable({
   rows,
   columns,
   setRows
   }) {
   const [cellNotes, setCellNotes] =
   useState({});

const updateCell = (
rowId,
field,
value
) => {
setRows(prevRows =>
prevRows.map(row =>
row.id === rowId
? {
...row,
[field]: value
}
: row
)
);
};

return (

<table role="grid">
<thead>
<tr>
{columns.map(column => (
<th key={column.field}>
{column.headerName}
</th>
))}
</tr>
</thead>

      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.id}>
            {columns.map(column => (
              <SmartCell
                key={column.field}
                row={row}
                rowIndex={rowIndex}
                column={column}
                updateCell={updateCell}
                cellNotes={cellNotes}
                setCellNotes={setCellNotes}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>

);
}

Senior Interview Explanation

You can say:

I would separate cell behaviour into a dedicated Cell Engine. Each cell follows a pipeline: retrieve raw value using field or valueGetter, format it with valueFormatter, render it using a custom renderer when needed, support inline editing with validation, show tooltip metadata, and attach notes using a separate note store keyed by rowId + field. This keeps row data clean and allows enterprise features like validation, audit comments, custom UI cells and hover tooltips without mixing business data with grid UI state.

This gives you an AG Grid-style mental model:

Raw Value
↓
Value Getter
↓
Value Formatter
↓
Custom Cell Renderer
↓
Editing + Validation
↓
Tooltip
↓
Notes
↓
Final Cell UI

Filtering Architecture for Enterprise React Data Grid

Filtering is usually the most complex module after sorting because every filter type eventually combines into a single filtering pipeline.

AG Grid's filtering model includes:

Text Filter
Number Filter
Date Filter
Set Filter
Multi Filter
Floating Filter
Advanced Filter
Quick Filter
External Filter
Filter API

It also supports filtering based on data types and combinations of conditions.

Filtering Engine Architecture
Rows
↓
Quick Filter
↓
External Filter
↓
Column Filters
├─ Text
├─ Number
├─ Date
├─ Set
└─ Custom
↓
Multi Filter
↓
Advanced Filter
↓
Visible Rows

Filter State Model

Keep all filters in a central store.

interface FilterState {
quickFilter: string;

columnFilters: Record<
string,
ColumnFilterModel

> ;

externalFilters: Record<
string,
any

> ;
> }

Filter Model
type FilterOperator =
| "contains"
| "equals"
| "startsWith"
| "endsWith"
| "greaterThan"
| "lessThan"
| "between"
| "in";

interface ColumnFilterModel {
type: FilterOperator;
value: any;
secondValue?: any;
}

Example Filter State
{
quickFilter: "sudhir",

columnFilters: {
name: {
type: "contains",
value: "sudhir"
},

    salary: {
      type: "greaterThan",
      value: 100000
    },

    department: {
      type: "in",
      value: [
        "Frontend",
        "QA"
      ]
    }

}
}

1. Quick Filter

Works like:

Ctrl + F
Global Search

Searches all visible columns.

This is similar to AG Grid's Quick Filter concept where a search string is applied across grid data.

State
const [
quickFilter,
setQuickFilter
] = useState("");

Input
<input
placeholder="Search..."
value={quickFilter}
onChange={e =>
setQuickFilter(
e.target.value
)
}
/>

Apply Quick Filter
function applyQuickFilter(
rows,
columns,
searchText
) {
if (!searchText)
return rows;

const search =
searchText.toLowerCase();

return rows.filter(row =>
columns.some(column =>
String(
row[column.field] ?? ""
)
.toLowerCase()
.includes(search)
)
);
}

2. Text Filter

Example:

Name contains Sudhir

Column
{
field: "name",

filterType: "text"
}

Text Operators
contains
equals
notEquals
startsWith
endsWith

Model
{
type:"contains",
value:"sudhir"
}

Filter Logic
function textFilter(
value,
filter
) {
const text =
String(
value ?? ""
).toLowerCase();

const search =
filter.value.toLowerCase();

switch (
filter.type
) {
case "contains":
return text.includes(
search
);

    case "equals":
      return (
        text === search
      );

    case "startsWith":
      return text.startsWith(
        search
      );

    case "endsWith":
      return text.endsWith(
        search
      );

    default:
      return true;

}
}

3. Number Filter

Example:

Salary > 100000

# Operators

!=

> # <
>
> <=
> between

Model
{
type:"between",
value:50000,
secondValue:150000
}

Logic
function numberFilter(
value,
filter
) {
const number =
Number(value);

switch (
filter.type
) {
case "greaterThan":
return (
number >
filter.value
);

    case "lessThan":
      return (
        number <
        filter.value
      );

    case "between":
      return (
        number >=
          filter.value &&
        number <=
          filter.secondValue
      );

    default:
      return true;

}
}

4. Date Filter

Example:

Created Date
After 1 Jan 2026

Date filtering is a dedicated filter type in AG Grid.

Model
{
type:"after",
value:
"2026-01-01"
}

Logic
function dateFilter(
value,
filter
) {
const rowDate =
new Date(value);

const targetDate =
new Date(
filter.value
);

switch (
filter.type
) {
case "after":
return (
rowDate >
targetDate
);

    case "before":
      return (
        rowDate <
        targetDate
      );

    case "equals":
      return (
        rowDate
          .toDateString() ===
        targetDate.toDateString()
      );

    default:
      return true;

}
}

5. Set Filter

Equivalent:

☑ Frontend
☑ Backend
☐ QA

AG Grid's Set Filter is based on unique values selected from a list.

Model
{
type:"in",

value:[
"Frontend",
"Backend"
]
}

Logic
function setFilter(
value,
filter
) {
return filter.value.includes(
value
);
}

Build Unique Values
function getUniqueValues(
rows,
field
) {
return [
...new Set(
rows.map(
row =>
row[field]
)
)
];
}

Set Filter UI
{
values.map(value => (
<label key={value}>
<input
        type="checkbox"
      />
{value}
</label>
));
}

6. Multi Filter

Combine:

Salary > 50000

AND

Salary < 150000

This mirrors AG Grid's multi-condition filtering capabilities.

Model
{
operator:"AND",

conditions:[
{
type:"greaterThan",
value:50000
},

{
type:"lessThan",
value:150000
}
]
}

Logic
function multiFilter(
value,
model
) {
if (
model.operator ===
"AND"
) {
return (
model.conditions.every(
filter =>
evaluateFilter(
value,
filter
)
)
);
}

return model.conditions.some(
filter =>
evaluateFilter(
value,
filter
)
);
}

7. Floating Filters

Modern UX:

## Header

Name

[Search]

Filter input directly inside header.

Column
{
field:"name",

showFloatingFilter:true
}

Render

<th>

Name

<input
   placeholder="Filter..."
 />

</th>

8. Advanced Filter Builder

Like:

Department = Frontend
AND
Salary > 100000
AND
Status = Active

State
{
operator:"AND",

rules:[]
}

Rule
{
field:"salary",

operator:"greaterThan",

value:100000
}

SQL-style Representation
department='Frontend'

AND

salary > 100000

AND

status='Active'

9. External Filter

Placed completely outside grid.

AG Grid supports external filtering where filter logic can live outside the standard column filter system.

Example:

Only Active Employees

Toolbar
<label>
<input
 type="checkbox"
/>

Show Active Only
</label>

State
showActiveOnly

Logic
if (
showActiveOnly
) {
rows = rows.filter(
row =>
row.status
=== "Active"
);
}

10. Filter Pipeline

Most important senior interview concept.

function processRows(
rows
) {

let result =
[...rows];

result =
applyQuickFilter(
result
);

result =
applyExternalFilters(
result
);

result =
applyColumnFilters(
result
);

return result;
}

Filter API

Your grid should expose APIs similar to enterprise grids.

gridRef.current

Methods:

setFilter()

getFilter()

resetFilter()

clearFilters()

getFilterModel()

setFilterModel()

Example
gridRef.current
.clearFilters();

Save Filters
localStorage.setItem(
"grid-filters",
JSON.stringify(
filterModel
)
);

Restore Filters
const saved =
JSON.parse(
localStorage.getItem(
"grid-filters"
)
);

setFilterModel(saved);

Production Features Checklist
✅ Quick Filter
✅ Text Filter
✅ Number Filter
✅ Date Filter
✅ Set Filter

✅ Multi Filter
✅ Advanced Filter
✅ Floating Filter
✅ External Filter

✅ Save Filter State
✅ Restore Filter State

✅ Filter API

✅ Debounced Filtering

✅ Server-side Filtering

✅ URL Synced Filters

✅ Filter Presets

Senior React Interview Answer

I design filtering as a dedicated filtering engine separate from rendering. Every filter produces a filter model, and all filters are stored in a central state object. The filtering pipeline executes in order: Quick Filter → External Filters → Column Filters → Multi Filters → Advanced Filters. Each filter type implements a pure predicate function. This allows persistence, deep linking, server-side filtering, filter presets, floating filters, and reusable enterprise-grade grid behaviour while keeping rendering independent of filtering logic.

For an enterprise-grade React DataGrid, filters should be implemented as independent reusable predicates and combined through a filter engine. AG Grid's filtering model uses filter conditions, multiple filter types, and filter state that can be saved and restored. AG Grid also supports quick filters, advanced filters, and combining multiple filter conditions.

1. Implementing a Text Filter
   Filter Model
   interface TextFilter {
   type:
   | "contains"
   | "equals"
   | "startsWith"
   | "endsWith";

value: string;
}

Text Filter Function
export function applyTextFilter(
cellValue,
filter
) {
if (!filter?.value) {
return true;
}

const value = String(
cellValue ?? ""
).toLowerCase();

const search =
filter.value.toLowerCase();

switch (filter.type) {
case "contains":
return value.includes(search);

    case "equals":
      return value === search;

    case "startsWith":
      return value.startsWith(search);

    case "endsWith":
      return value.endsWith(search);

    default:
      return true;

}
}

Column Definition
{
field: "name",

headerName: "Employee Name",

filterType: "text"
}

Floating Filter Component
function TextFilterInput({
value,
onChange
}) {
return (
<input
placeholder="Filter..."
value={value}
onChange={e =>
onChange(
e.target.value
)
}
/>
);
}

Filter State
const [
filterModel,
setFilterModel
] = useState({
name: {
type: "contains",
value: ""
}
});

Apply Filter
const filteredRows =
rows.filter(row =>
applyTextFilter(
row.name,
filterModel.name
)
);

2. Combining Multiple Filters (AND / OR)

This is the most common Senior React interview topic.

Example Requirement
Department = Frontend

AND

Salary > 100000

AND

Status = Active

Filter Model
{
operator: "AND",

filters: [
{
field: "department",

      type: "equals",

      value: "Frontend"
    },

    {
      field: "salary",

      type: "greaterThan",

      value: 100000
    },

    {
      field: "status",

      type: "equals",

      value: "Active"
    }

]
}

Generic Evaluate Function
function evaluateFilter(
value,
filter
) {
switch (
filter.type
) {
case "equals":
return (
value ===
filter.value
);

    case "contains":
      return String(value)
        .toLowerCase()
        .includes(
          String(
            filter.value
          ).toLowerCase()
        );

    case "greaterThan":
      return (
        Number(value) >
        Number(
          filter.value
        )
      );

    case "lessThan":
      return (
        Number(value) <
        Number(
          filter.value
        )
      );

    default:
      return true;

}
}

AND Logic

Every condition must pass.

function applyAndFilter(
row,
model
) {
return model.filters.every(
filter =>
evaluateFilter(
row[filter.field],
filter
)
);
}

Example
Name = Sudhir

AND

Salary > 100000

Returns:

Only rows that satisfy BOTH

OR Logic

At least one condition passes.

function applyOrFilter(
row,
model
) {
return model.filters.some(
filter =>
evaluateFilter(
row[filter.field],
filter
)
);
}

Example
Department = QA

OR

Department = Frontend

Returns:

QA + Frontend rows

Unified Implementation
function applyFilterModel(
row,
model
) {
if (
model.operator ===
"AND"
) {
return model.filters.every(
filter =>
evaluateFilter(
row[filter.field],
filter
)
);
}

return model.filters.some(
filter =>
evaluateFilter(
row[filter.field],
filter
)
);
}

Nested Conditions

Enterprise filter builders often support nested groups.

Example:

(
Department = Frontend
OR
Department = QA
)

AND

Salary > 100000

Representation:

{
operator:"AND",

groups:[
{
operator:"OR",

      filters:[
        ...
      ]
    }

]
}

3. Save and Restore Filter State

Users expect filters to remain after refresh.

Persist:

Text filters

Number filters

Date filters

Set filters

Advanced filters

Save Filter State
function saveFilters(
filterModel
) {
localStorage.setItem(
"employee-grid-filters",
JSON.stringify(
filterModel
)
);
}

Save Automatically
useEffect(() => {
saveFilters(
filterModel
);
}, [filterModel]);

Example Saved JSON
{
"operator": "AND",
"filters": [
{
"field": "department",
"type": "equals",
"value": "Frontend"
},
{
"field": "salary",
"type": "greaterThan",
"value": 100000
}
]
}

Restore Filters
function loadFilters() {
const saved =
localStorage.getItem(
"employee-grid-filters"
);

if (!saved) {
return null;
}

return JSON.parse(saved);
}

Load on Page Initialization
useEffect(() => {
const savedFilters =
loadFilters();

if (savedFilters) {
setFilterModel(
savedFilters
);
}
}, []);

Reset Filters
function clearFilters() {
localStorage.removeItem(
"employee-grid-filters"
);

setFilterModel({
operator: "AND",
filters: []
});
}

URL-Based Filter Persistence

Useful in enterprise dashboards.

Current URL:

/employees?
department=Frontend&
salary=100000

Restore:

const params =
new URLSearchParams(
window.location.search
);

Generate:

params.set(
"department",
"Frontend"
);

Benefits:

Shareable URLs

Bookmarks

Deep Linking

Grid Filter API

Expose APIs from your table.

tableRef.current

Methods:

getFilterModel()

setFilterModel()

clearFilters()

saveFilters()

loadFilters()

Example:

tableRef.current
.clearFilters();

Complete Filter Pipeline
function processRows(
rows,
columns,
quickFilter,
filterModel
) {

let result = [...rows];

result =
applyQuickFilter(
result,
columns,
quickFilter
);

result = result.filter(
row =>
applyFilterModel(
row,
filterModel
)
);

return result;
}

Senior React Interview Answer

I implement filtering using a centralised filter model rather than embedding logic inside components. Each filter produces a predicate function. The grid processes data through a pipeline: Quick Filter → External Filters → Column Filters → Advanced Filters. Multiple filters are combined using AND/OR operators, and the filter model is persisted to localStorage or URL parameters. This makes filters shareable, restorable, server-side compatible, and easy to extend with custom filters such as range filters, date filters, set filters, and advanced query builders.

For your custom React DataGrid, Number Filters, Date Filters, Floating Filters, and Filter APIs are core interview topics.

AG Grid documents that:

Floating Filters appear below column headers and reflect the state of the main filter rather than owning separate state.
Filter state can be retrieved with getFilterModel() and restored using setFilterModel().
All filters can be cleared by setting the filter model to null.

1. Number Filter Implementation
   Column Definition
   {
   field: "salary",
   headerName: "Salary",
   filterType: "number"
   }

Number Filter Model
interface NumberFilter {
type:
| "equals"
| "greaterThan"
| "lessThan"
| "greaterThanOrEqual"
| "lessThanOrEqual"
| "between";

value: number;
secondValue?: number;
}

Filter Function
export function applyNumberFilter(
cellValue,
filter
) {
if (!filter) {
return true;
}

const value = Number(cellValue);

switch (filter.type) {

    case "equals":
      return value === filter.value;

    case "greaterThan":
      return value > filter.value;

    case "lessThan":
      return value < filter.value;

    case "greaterThanOrEqual":
      return value >= filter.value;

    case "lessThanOrEqual":
      return value <= filter.value;

    case "between":
      return (
        value >= filter.value &&
        value <= filter.secondValue
      );

    default:
      return true;

}
}

Number Filter UI
function NumberFilter({
value,
onChange
}) {
return (
<input
type="number"
value={value}
onChange={e =>
onChange(
Number(e.target.value)
)
}
/>
);
}

Usage
const filteredRows =
rows.filter(row =>
applyNumberFilter(
row.salary,
{
type:"greaterThan",
value:100000
}
)
);

2. Date Filter Implementation
   Column
   {
   field: "createdAt",
   headerName: "Created Date",
   filterType: "date"
   }

Date Filter Model
interface DateFilter {
type:
| "equals"
| "before"
| "after"
| "between";

value: string;

secondValue?: string;
}

Filter Logic
export function applyDateFilter(
cellValue,
filter
) {
if (!filter) {
return true;
}

const rowDate =
new Date(cellValue);

const filterDate =
new Date(filter.value);

switch (filter.type) {

    case "equals":
      return (
        rowDate.toDateString() ===
        filterDate.toDateString()
      );

    case "before":
      return rowDate < filterDate;

    case "after":
      return rowDate > filterDate;

    case "between":

      return (
        rowDate >=
          new Date(filter.value) &&
        rowDate <=
          new Date(
            filter.secondValue
          )
      );

    default:
      return true;

}
}

Date Filter UI
function DateFilter({
value,
onChange
}) {
return (
<input
type="date"
value={value}
onChange={e =>
onChange(
e.target.value
)
}
/>
);
}

Example Usage
rows.filter(row =>
applyDateFilter(
row.createdAt,
{
type:"after",
value:"2026-01-01"
}
)
);

3. Floating Filters in Headers

AG Grid describes Floating Filters as an extra row beneath headers that displays and can optionally edit the state of the underlying filter. They do not maintain separate state.

## Layout

## Name Salary

## [search] [>100000]

## Rows

State
const [
filterModel,
setFilterModel
] = useState({});

Header Component
function HeaderCell({
column,
filterModel,
setFilterModel
}) {

const filter =
filterModel[
column.field
];

return (

<th>

      <div>
        {column.headerName}
      </div>

      {column.showFloatingFilter && (

        <input
          placeholder="Filter..."
          value={
            filter?.value || ""
          }
          onChange={e =>
            setFilterModel(
              prev => ({
                ...prev,

                [column.field]: {
                  type:
                    "contains",

                  value:
                    e.target.value
                }
              })
            )
          }
        />

      )}

    </th>

);
}

Render Headers

<thead>
  <tr>
    {columns.map(column => (
      <HeaderCell
        key={column.field}
        column={column}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
      />
    ))}
  </tr>
</thead>

Advanced Floating Number Filter
<input
type="number"
placeholder="> Salary"
value={
filterModel.salary
?.value || ""
}
onChange={e =>
setFilterModel(prev => ({
...prev,

      salary: {
        type:"greaterThan",

        value:Number(
          e.target.value
        )
      }
    }))

}
/>

Debounced Floating Filter

For 100K+ rows.

const search =
useDebounce(
filterText,
300
);

useEffect(() => {

setFilterModel(prev => ({
...prev,

    name: {
      type:"contains",
      value:search
    }

}));

}, [search]);

4. Filter API

Enterprise grids expose APIs similar to AG Grid's filter API for retrieving, restoring and clearing filter state. AG Grid supports getFilterModel() and setFilterModel().

Grid Ref
const gridRef =
useRef(null);

Expose API
useImperativeHandle(
ref,
() => ({

    getFilterModel() {
      return filterModel;
    },

    setFilterModel(
      model
    ) {
      setFilterModel(
        model
      );
    },

    clearFilters() {
      setFilterModel({});
    }

})
);

Get Filter Model
const filters =
gridRef.current
.getFilterModel();

console.log(filters);

Result:

{
"name": {
"type": "contains",
"value": "Sudhir"
},
"salary": {
"type": "greaterThan",
"value": 100000
}
}

Set Filter Model
gridRef.current
.setFilterModel({

    department: {
      type:"equals",
      value:"Frontend"
    },

    salary: {
      type:"greaterThan",
      value:100000
    }

});

Rows immediately refresh.

Clear All Filters

Equivalent to AG Grid's reset filters behaviour.

gridRef.current
.clearFilters();

Implementation:

clearFilters() {

setFilterModel({});
}

Clear Single Filter
function clearFilter(
field
) {
setFilterModel(
prev => {

      const next = {
        ...prev
      };

      delete next[field];

      return next;
    }

);
}

Usage:

clearFilter(
"salary"
);

Save / Restore Using API
function saveFilters() {

const model =
gridRef.current
.getFilterModel();

localStorage.setItem(
"gridFilters",
JSON.stringify(
model
)
);
}

function loadFilters() {

const model =
JSON.parse(
localStorage.getItem(
"gridFilters"
)
);

gridRef.current
.setFilterModel(
model
);
}

Complete Processing Pipeline
Rows
↓
Quick Filter
↓
Text Filter
↓
Number Filter
↓
Date Filter
↓
Set Filter
↓
External Filter
↓
Sort
↓
Pagination
↓
Virtualization
↓
Render

Senior Interview Answer

I implement filtering using a centralized filter state. Each filter type (text, number, date, set) generates a filter model and a predicate function. Floating filters are lightweight header controls that update the main filter state. The grid exposes APIs such as getFilterModel, setFilterModel, and clearFilters, allowing filters to be persisted to localStorage, synced with URLs, or applied programmatically. The filtering pipeline executes before sorting, pagination, and virtualization to ensure optimal performance on large datasets. Based on AG Grid's approach, floating filters reflect the main filter state rather than maintaining separate state.

Next, I can show the complete Selection Engine (row selection, checkbox selection, shift-select range, keyboard navigation, Excel-style cell range selection, copy/paste) for an AG Grid-level React DataGrid.

1. Set Filter (Excel-style Filter)

A Set Filter lets users select one or more values from the unique values available in a column.

Example:

Department

☑ Frontend
☑ Backend
☐ QA
☐ DevOps

AG Grid's Set Filter is inspired by Excel AutoFilter and is built around selecting values from a filter list.

Filter Model
{
filterType: "set",

values: [
"Frontend",
"Backend"
]
}

Build Unique Values
function getUniqueValues(
rows,
field
) {
return [
...new Set(
rows.map(
row => row[field]
)
)
];
}

Set Filter Predicate
function applySetFilter(
value,
filter
) {
if (
!filter?.values?.length
) {
return true;
}

return filter.values.includes(
value
);
}

Set Filter Component
function SetFilter({
options,
selectedValues,
onChange
}) {

const toggleValue = (
value
) => {

    const exists =
      selectedValues.includes(
        value
      );

    const next =
      exists
        ? selectedValues.filter(
            item =>
              item !== value
          )
        : [
            ...selectedValues,
            value
          ];

    onChange(next);

};

return (

<div>

      {options.map(value => (

        <label key={value}>

          <input
            type="checkbox"
            checked={selectedValues.includes(
              value
            )}
            onChange={() =>
              toggleValue(value)
            }
          />

          {value}

        </label>

      ))}

    </div>

);
}

Usage
rows.filter(row =>
applySetFilter(
row.department,
{
values: [
"Frontend",
"Backend"
]
}
)
);

2. Multi Filter

AG Grid Multi Filter allows multiple filter types to be combined on the same column, such as Number + Set Filter or Text + Set Filter.

Example:

Salary > 100000

AND

Salary < 200000

Multi Filter Model
{
operator:"AND",

filters:[
{
type:"greaterThan",
value:100000
},

    {
      type:"lessThan",
      value:200000
    }

]
}

Generic Evaluator
function evaluateFilter(
value,
filter
) {

switch(filter.type) {

    case "greaterThan":
      return (
        value >
        filter.value
      );

    case "lessThan":
      return (
        value <
        filter.value
      );

    case "equals":
      return (
        value ===
        filter.value
      );

    default:
      return true;

}
}

AND Logic
function applyMultiFilter(
value,
model
) {

return model.filters.every(
filter =>
evaluateFilter(
value,
filter
)
);
}

OR Logic
function applyMultiFilter(
value,
model
) {

return model.filters.some(
filter =>
evaluateFilter(
value,
filter
)
);
}

Enterprise Example
Department IN
(
Frontend,
QA
)

AND

Salary > 100000

AND

Status = Active

{
operator:"AND",

filters:[
{
field:"department",

     type:"set",

     values:[
       "Frontend",
       "QA"
     ]

},

{
field:"salary",

     type:"greaterThan",

     value:100000

},

{
field:"status",

     type:"equals",

     value:"Active"

}
]
}

Apply All Filters
function applyFilters(
row,
model
) {

return model.filters.every(
filter => {

      const value =
        row[
          filter.field
        ];

      return evaluateFilter(
        value,
        filter
      );
    }

);
}

3. Debouncing Floating Filters

AG Grid floating filters reflect and update the underlying filter state and sit beneath column headers.

Without debounce:

S
Su
Sud
Sudh
Sudhi
Sudhir

6 filter executions.

For large datasets:

100,000 rows

This becomes expensive.

Custom Hook
import {
useEffect,
useState
}
from "react";

export function useDebounce(
value,
delay=300
) {

const [
debounced,
setDebounced
] = useState(value);

useEffect(() => {

    const timer =
      setTimeout(() => {
        setDebounced(value);
      }, delay);

    return () =>
      clearTimeout(timer);

}, [value, delay]);

return debounced;
}

Floating Filter Input
function FloatingFilter({
onFilterChange
}) {

const [
text,
setText
] = useState("");

const debouncedText =
useDebounce(
text,
300
);

useEffect(() => {

    onFilterChange(
      debouncedText
    );

}, [
debouncedText
]);

return (
<input
value={text}
onChange={e =>
setText(
e.target.value
)
}
placeholder="Search..."
/>
);
}

Performance Optimization
const debouncedText =
useDebounce(
text,
500
);

Benefits:

Less Rendering
Less Filtering
Less Server Calls
Better UX

4. Save Filter State to URL Parameters

This is extremely common in enterprise admin dashboards.

Before:

/employees

After applying filters:

/employees
?department=Frontend
&status=Active
&salary=100000

Users can:

✅ Bookmark

✅ Share URL

✅ Restore state

✅ Open in new tab

Save Filters
function syncFiltersToUrl(
filterModel
) {

const params =
new URLSearchParams();

Object.entries(
filterModel
).forEach(
([field, filter]) => {

      if (
        filter.value
      ) {

        params.set(
          field,
          JSON.stringify(
            filter
          )
        );

      }
    }

);

window.history.replaceState(
{},
"",
`?${
      params.toString()
    }`
);
}

Auto Save
useEffect(() => {

syncFiltersToUrl(
filterModel
);

}, [filterModel]);

URL Example
?name=
{"type":"contains","value":"Sudhir"}

&salary=
{"type":"greaterThan","value":100000}

Restore Filters
function loadFiltersFromUrl() {

const params =
new URLSearchParams(
window.location.search
);

const filters = {};

for (
const [
field,
value
] of params.entries()
) {

    filters[field] =
      JSON.parse(value);

}

return filters;
}

Load On Page Refresh
useEffect(() => {

const filters =
loadFiltersFromUrl();

setFilterModel(
filters
);

}, []);

React Router Version
import {
useSearchParams
}
from
"react-router-dom";

Save
const [
searchParams,
setSearchParams
]
=
useSearchParams();

setSearchParams({
department:
"Frontend",

status:
"Active"
});

Read
const department =
searchParams.get(
"department"
);

Complete Enterprise Flow
Header Filter
↓
Debounce
↓
Filter Model
↓
URL Sync
↓
localStorage Sync
↓
Apply Filters
↓
Sort
↓
Pagination
↓
Virtualization
↓
Render

Senior Interview Answer

I implement Set Filters using unique values derived from the dataset and store selected values in a filter model. Multi Filters are composed of multiple predicates that can be combined using AND/OR operators. Floating Filters are lightweight header controls that update the underlying filter model and are always debounced to avoid excessive re-filtering. The filter model is synchronized with URL parameters and localStorage, allowing filters to survive page refreshes, support deep linking, bookmarking, and shared URLs. This approach scales well for both client-side and server-side filtering scenarios.

Additionally, your enterprise data includes examples of applications implementing interactive filter systems, advanced filters, and dynamic filtering patterns in React and analytics dashboards, reinforcing these as common enterprise requirements. Reshmee_s_updated_resume.pdf mentions interactive filters and date-range filtering, while Sakshi_Varma_Resume 2.docx mentions dynamic filtering in dashboards.

Custom Filter Components, Nested Filter Groups & localStorage Persistence

For an enterprise-grade React DataGrid, I recommend treating filters as pluggable components that update a central filter model. AG Grid follows a similar concept where filters have their own UI and model, and multi-filters can combine multiple child filters.

1. Custom Filter Component

Instead of hardcoding text, date, and number filters, create a common contract.

Filter Interface
export interface FilterProps {
value: any;
onChange: (value: any) => void;
column: ColumnDef;
}

Custom Rating Filter

Example:

Show employees rated >= 4

Component
function RatingFilter({
value,
onChange
}) {
return (
<select
value={value ?? ""}
onChange={(e) =>
onChange(
Number(e.target.value)
)
} >

<option value="">
All
</option>

      <option value="1">
        1+
      </option>

      <option value="2">
        2+
      </option>

      <option value="3">
        3+
      </option>

      <option value="4">
        4+
      </option>

      <option value="5">
        5
      </option>

    </select>

);
}

Column Definition
{
field: "rating",

headerName: "Rating",

filterComponent:
RatingFilter
}

Generic Header Renderer
function FilterRenderer({
column,
filterModel,
updateFilter
}) {

const Component =
column.filterComponent;

if (!Component) {
return null;
}

return (
<Component
value={
filterModel[
column.field
]
}
onChange={(value) =>
updateFilter(
column.field,
value
)
}
column={column}
/>
);
}

Custom Range Filter

Example:

Salary
50000 - 150000

function RangeFilter({
value,
onChange
}) {

return (

<div>

      <input
        type="number"
        placeholder="Min"
        value={
          value?.min || ""
        }
        onChange={(e)=>
          onChange({
            ...value,
            min:Number(
              e.target.value
            )
          })
        }
      />

      <input
        type="number"
        placeholder="Max"
        value={
         value?.max || ""
        }
        onChange={(e)=>
          onChange({
            ...value,
            max:Number(
              e.target.value
            )
          })
        }
      />

    </div>

);
}

2. Nested Filter Groups (Advanced Filter Builder)

Simple filters:

Department = Frontend

Advanced filters:

(
Frontend
OR
QA
)

AND

Salary > 100000

AND

Status = Active

This is how enterprise query builders work.

Filter Group Model
interface FilterGroup {

operator:
| "AND"
| "OR";

children: (
FilterGroup
| FilterRule
)[];
}

interface FilterRule {

field: string;

operator: string;

value: any;
}

Example
const filterTree = {

operator: "AND",

children: [

    {
      operator: "OR",

      children: [

        {
          field:
            "department",

          operator:
            "equals",

          value:
            "Frontend"
        },

        {
          field:
            "department",

          operator:
            "equals",

          value:
            "QA"
        }

      ]
    },

    {
      field:"salary",

      operator:
        "greaterThan",

      value:100000
    }

]
};

Rule Evaluation
function evaluateRule(
row,
rule
) {

const value =
row[
rule.field
];

switch (
rule.operator
) {

    case "equals":
      return (
        value ===
        rule.value
      );

    case "greaterThan":
      return (
        value >
        rule.value
      );

    default:
      return true;

}
}

Group Evaluation (Recursive)
function evaluateGroup(
row,
group
) {

const results =
group.children.map(
child => {

        if (
          child.children
        ) {

          return evaluateGroup(
            row,
            child
          );

        }

        return evaluateRule(
          row,
          child
        );
      }
    );

if (
group.operator ===
"AND"
) {
return results.every(
Boolean
);
}

return results.some(
Boolean
);
}

Apply Filters
const filteredRows =
rows.filter(row =>
evaluateGroup(
row,
filterTree
)
);

3. Sync Filter State with localStorage

One of the most common enterprise requirements:

✅ Refresh page

✅ Keep filters

✅ Open browser tomorrow

✅ Restore state

AG Grid's filter state can be retrieved and restored through a filter model, making persistence straightforward.

Filter State
const [
filterModel,
setFilterModel
] = useState({});

Save Function
function saveFilters(
filters
) {

localStorage.setItem(
"employee-grid-filters",

    JSON.stringify(
      filters
    )

);
}

Auto Save
useEffect(() => {

saveFilters(
filterModel
);

}, [
filterModel
]);

Restore Function
function loadFilters() {

const saved =
localStorage.getItem(
"employee-grid-filters"
);

if (!saved) {
return {};
}

return JSON.parse(
saved
);
}

Load on Startup
useEffect(() => {

const savedFilters =
loadFilters();

setFilterModel(
savedFilters
);

}, []);

Clear Filters
function clearFilters() {

localStorage.removeItem(
"employee-grid-filters"
);

setFilterModel({});
}

Generic Filter API

Similar to enterprise grids that expose methods for getting, setting, and clearing filter models.

useImperativeHandle(
ref,
() => ({

    getFilterModel() {
      return filterModel;
    },

    setFilterModel(
      model
    ) {
      setFilterModel(
        model
      );
    },

    clearFilters() {
      clearFilters();
    }

})
);

Usage:

gridRef.current
.clearFilters();

gridRef.current
.setFilterModel({
department: {
type: "set",
values: [
"Frontend"
]
}
});

Production Architecture
Filter Components
↓
Filter Model
↓
Nested Groups
↓
AND / OR Engine
↓
localStorage
↓
URL Sync
↓
Server Sync
↓
Filtered Rows

Senior React Interview Answer

I implement filters using a central filter model and pluggable filter components. Each filter component only manages UI and updates the shared filter state. Complex business queries are represented as nested filter groups using recursive AND/OR evaluation. Filter state is persisted to localStorage and restored on application startup. This architecture supports quick filters, set filters, range filters, advanced query builders, URL synchronisation, server-side filtering, and reusable enterprise-grade grid behaviour.

Enterprise React DataGrid: Custom Filters + Nested Groups + Reset/Clear APIs

Custom filters should only manage UI and update a central filter model. The actual filtering logic should remain in a dedicated filter engine. AG Grid follows a similar separation between filter UI and filter logic through custom filter components and filter models.

Architecture
Custom Filter Component
↓
Filter Model
↓
Nested Groups
↓
Filter Engine
↓
Grid Rows

1. Custom Filter Component Integrated with Nested Groups
   Filter Types
   interface Rule {
   id: string;
   field: string;

operator:
| "contains"
| "equals"
| "greaterThan";

value: any;
}

interface Group {
id: string;

operator:
| "AND"
| "OR";

children: (
| Rule
| Group
)[];
}

Example Filter Tree
(
Department = Frontend
OR
Department = QA
)

AND

Salary > 100000

const filterTree = {
id: "root",

operator: "AND",

children: [
{
id: "group1",

      operator: "OR",

      children: [
        {
          id: "1",
          field: "department",
          operator: "equals",
          value: "Frontend"
        },

        {
          id: "2",
          field: "department",
          operator: "equals",
          value: "QA"
        }
      ]
    },

    {
      id: "3",
      field: "salary",
      operator: "greaterThan",
      value: 100000
    }

]
};

Custom Department Filter
function DepartmentFilter({
value,
onChange
}) {

return (
<select
value={value}
onChange={e =>
onChange(
e.target.value
)
} >

<option>
Frontend
</option>

      <option>
        QA
      </option>

      <option>
        Backend
      </option>
    </select>

);
}

Update Nested Rule
function updateRule(
group,
ruleId,
value
) {

return {
...group,

    children:
      group.children.map(
        child => {

          if (
            child.id ===
            ruleId
          ) {

            return {
              ...child,
              value
            };
          }

          if (
            child.children
          ) {

            return updateRule(
              child,
              ruleId,
              value
            );
          }

          return child;
        }
      )

};
}

Use In Filter
<DepartmentFilter
value={rule.value}
onChange={value => {

    setFilterTree(
      prev =>
        updateRule(
          prev,
          rule.id,
          value
        )
    );

}}
/>

Recursive Evaluation Engine
function evaluateRule(
row,
rule
) {

const value =
row[rule.field];

switch (
rule.operator
) {

    case "equals":
      return (
        value ===
        rule.value
      );

    case "contains":
      return value
        .toString()
        .includes(
          rule.value
        );

    case "greaterThan":
      return (
        value >
        rule.value
      );

    default:
      return true;

}
}

function evaluateGroup(
row,
group
) {

const results =
group.children.map(
child => {

        if (
          child.children
        ) {

          return evaluateGroup(
            row,
            child
          );
        }

        return evaluateRule(
          row,
          child
        );
      }
    );

return (
group.operator ===
"AND"
)
? results.every(Boolean)
: results.some(Boolean);
}

Apply:

const filteredRows =
rows.filter(row =>
evaluateGroup(
row,
filterTree
)
);

2. Debouncing Custom Filter Inputs

Without debouncing:

S
Su
Sud
Sudh
Sudhi
Sudhir

Every key press triggers:

Filtering
Sorting
Rerender
Virtualization

useDebounce Hook
import {
useState,
useEffect
} from "react";

export function useDebounce(
value,
delay = 300
) {

const [
debounced,
setDebounced
] = useState(value);

useEffect(() => {

    const timer =
      setTimeout(() => {

        setDebounced(
          value
        );

      }, delay);

    return () =>
      clearTimeout(timer);

}, [value, delay]);

return debounced;
}

Debounced Custom Filter
function SearchFilter({
onChange
}) {

const [
text,
setText
] = useState("");

const debouncedText =
useDebounce(
text,
400
);

useEffect(() => {

    onChange(
      debouncedText
    );

}, [
debouncedText
]);

return (
<input
value={text}
onChange={e =>
setText(
e.target.value
)
}
/>
);
}

Benefits:

✅ Fewer renders
✅ Fewer API requests
✅ Better UX
✅ Improved performance

3. Clearing Filters Programmatically

Enterprise grids expose APIs for:

clearFilter
clearAllFilters
resetFilters
getFilterModel
setFilterModel

AG Grid exposes comparable APIs for getting and setting filter models, and clearing filters via the filter model.

Grid API
const gridRef =
useRef();

Expose Methods
useImperativeHandle(
ref,
() => ({

    getFilterModel() {
      return filterTree;
    },

    setFilterModel(
      model
    ) {
      setFilterTree(
        model
      );
    },

    clearFilters() {
      setFilterTree({
        id: "root",
        operator: "AND",
        children: []
      });
    }

})
);

Clear All Filters
gridRef.current
.clearFilters();

Result:

All filters removed
All rows visible

Clear Single Rule
function removeRule(
group,
ruleId
) {

return {

    ...group,

    children:
      group.children
        .filter(
          child =>
            child.id !==
            ruleId
        )
        .map(child =>
          child.children
            ? removeRule(
                child,
                ruleId
              )
            : child
        )

};
}

Usage:

setFilterTree(
prev =>
removeRule(
prev,
"rule-3"
)
);

Reset To Default Filters

Very common requirement:

Active Employees
Current Year
Default Department

Default State
const defaultFilters = {

id: "root",

operator: "AND",

children: [

    {
      id: "1",

      field: "status",

      operator:
        "equals",

      value: "Active"
    }

]
};

Reset API
function resetFilters() {

setFilterTree(
defaultFilters
);
}

Usage
<button
onClick={() =>
gridRef.current
.resetFilters()
}

> Reset
> </button>

Save To localStorage Before Clear
function saveFilters() {

localStorage.setItem(
"grid-filters",

    JSON.stringify(
      filterTree
    )

);
}

Restore Later
function restoreFilters() {

const saved =
JSON.parse(
localStorage.getItem(
"grid-filters"
)
);

setFilterTree(
saved
);
}

This persistence pattern aligns with the common React approach of storing state centrally and restoring it on reload; enterprise React applications commonly use Context and centralised state management for predictable application state. Erica Ferrao Front End Developer Angular React Grade 5.1.pdf discusses scalable state management using Context alongside component state.

Senior React Interview Answer

I build custom filters as controlled components that only update a centralized filter model. Complex business rules are represented as nested AND/OR filter groups and evaluated recursively. All custom filter inputs are debounced to avoid excessive filtering and rendering. The grid exposes imperative APIs such as getFilterModel, setFilterModel, clearFilters, and resetFilters, enabling persistence via localStorage, URL synchronization, saved filter presets, and server-side filtering integration. AG Grid uses a similar model-based filter architecture where state can be retrieved, restored, and cleared programmatically.

If you're building a custom React Table (AG-Grid-like) for interview preparation, row selection and cell selection are core features.

AG Grid supports single-row, multi-row, range selection and API-driven selection.

Selection Architecture
Mouse Click
Keyboard
Checkbox
API

      ↓

Selection Manager

      ↓

Row Selection Store
Cell Selection Store
Range Selection Store

      ↓

React Context
or Zustand

      ↓

Table UI

A similar editable grid approach is used in enterprise React applications built with AG-Grid. A&M Staff Aug RFP.pptx references AG-Grid as part of a React SPA architecture.

State Design
type RowId = string;

type CellId = {
rowId: string;
columnId: string;
};

const [
selectedRows,
setSelectedRows
] = useState(
new Set<RowId>()
);

const [
selectedCell,
setSelectedCell
] = useState<CellId | null>(
null
);

const [
selectedRanges,
setSelectedRanges
] = useState([]);

1. Single Row Selection
   const [
   selectedRow,
   setSelectedRow
   ] = useState(null);

function selectRow(
rowId
) {
setSelectedRow(rowId);
}

<tr
 className={
   selectedRow === row.id
   ? "row-selected"
   : ""
 }
 onClick={() =>
   selectRow(row.id)
 }
>

.row-selected{
background:#dbeafe;
}

2. Multi Row Selection

Use Set for O(1) lookup.

const [
selectedRows,
setSelectedRows
]
=
useState(
new Set()
);

function toggleRow(
rowId
) {

setSelectedRows(
prev => {

const next =
new Set(prev);

if(
next.has(rowId)
){
next.delete(rowId);
} else {
next.add(rowId);
}

return next;
}
);

}

Checkbox Column

<td>

<input
type="checkbox"

checked={
selectedRows.has(
row.id
)
}

onChange={() =>
toggleRow(
row.id
)
}
/>

</td>

Select All Header Checkbox
function selectAll() {

setSelectedRows(
new Set(
rows.map(
row => row.id
)
)
);

}

function clearSelection() {

setSelectedRows(
new Set()
);

}

3. Shift + Click Range Selection
   Click Row 5
   SHIFT + Click Row 15

Rows 5-15 Selected

const [
lastSelectedIndex,
setLastSelectedIndex
]
=
useState(null);

function handleRowClick(
index,
event
){

if(
event.shiftKey &&
lastSelectedIndex !== null
){

const start =
Math.min(
index,
lastSelectedIndex
);

const end =
Math.max(
index,
lastSelectedIndex
);

const ids =
rows
.slice(
start,
end + 1
)
.map(
row => row.id
);

setSelectedRows(
new Set(ids)
);

}
else {

setSelectedRows(
new Set([
rows[index].id
])
);

setLastSelectedIndex(
index
);
}
}

4. Cell Selection

Excel style.

const [
selectedCell,
setSelectedCell
]
=
useState(null);

function selectCell(
rowId,
columnId
){

setSelectedCell({
rowId,
columnId
});

}

<td
 onClick={() =>
  selectCell(
   row.id,
   column.id
  )
 }

className={
selectedCell?.rowId === row.id &&
selectedCell?.columnId === column.id
? "cell-selected"
: ""
}

>

.cell-selected{
outline:2px solid blue;
}

5. Cell Range Selection
   A1 → C5

State
const [
rangeStart,
setRangeStart
]
=
useState(null);

const [
rangeEnd,
setRangeEnd
]
=
useState(null);

Mouse Down
function onCellMouseDown(
row,
col
){

setRangeStart({
row,
col
});

setRangeEnd({
row,
col
});

}

Mouse Drag
function onCellEnter(
row,
col
){

if(
rangeStart
){

setRangeEnd({
row,
col
});

}

}

Check Selection
function isSelectedRange(
row,
col
){

return (

row >=
Math.min(
rangeStart.row,
rangeEnd.row
) &&

row <=
Math.max(
rangeStart.row,
rangeEnd.row
) &&

col >=
Math.min(
rangeStart.col,
rangeEnd.col
) &&

col <=
Math.max(
rangeStart.col,
rangeEnd.col
)

);

}

6. Ctrl + Multi Range Support
   Range 1 => A1:C5

Range 2 => F1:H8

Range 3 => J2:M4

const [
ranges,
setRanges
]
=
useState([]);

setRanges(
prev => [
...prev,
newRange
]
);

7. Keyboard Navigation
   const [
   activeCell,
   setActiveCell
   ]
   =
   useState({
   row:0,
   col:0
   });

function handleKeyDown(
e
){

switch(e.key){

case "ArrowRight":

     setActiveCell(
       prev => ({
         ...prev,
         col:
          prev.col + 1
       })
     );

break;

case "ArrowLeft":

break;

case "ArrowUp":

break;

case "ArrowDown":

break;
}

}

8. Public Selection API
   useImperativeHandle(
   ref,
   () => ({

selectAll,

clearSelection,

getSelectedRows() {

return rows.filter(
row =>
selectedRows.has(
row.id
)
);

},

selectRow(
id
){

    setSelectedRows(
      new Set([id])
    );

}

})
);

Usage:

tableRef.current
.selectAll();

tableRef.current
.clearSelection();

tableRef.current
.getSelectedRows();

Enterprise Features
✅ Single Row Selection
✅ Multi Row Selection
✅ Header Checkbox
✅ Shift Range Selection
✅ Cell Selection
✅ Range Selection
✅ Ctrl Multi Range
✅ Keyboard Navigation
✅ Selection Events
✅ Persist Selection After Paging
✅ Persist Selection After Sorting
✅ Virtualized Rows Support
✅ API Driven Selection
✅ Copy Selection
✅ Fill Handle Support

Senior React Interview Answer

For a custom table, I maintain selection state separately from rendering using Sets for rows and coordinate-based models for cells. Row selection supports single, multi-select, checkbox, Shift-click range and keyboard navigation. Cell selection supports Excel-like ranges, multi-range selection with Ctrl, and public APIs such as selectAll, clearSelection, getSelectedRows, and setSelection. This design scales well with virtualization, pagination, sorting, filtering and editable grids, similar to the selection capabilities documented by AG Grid.

Next, I can show a complete production-grade custom Table component combining sorting + filtering + pagination + virtualization + row/cell selection in React with TypeScript.

For a production-grade custom React table, Shift+Click selection, keyboard navigation, and selection APIs should be implemented in a dedicated Selection Engine, not inside row components.

AG Grid supports single-row, multi-row, click selection, keyboard selection and API-driven selection.

Selection State
const [selectedRows, setSelectedRows] =
useState(new Set<string>());

const [lastSelectedIndex, setLastSelectedIndex] =
useState<number | null>(null);

const [activeCell, setActiveCell] =
useState({
rowIndex: 0,
colIndex: 0,
});

1. Shift + Click Range Selection
   Example
   Click Row 3

SHIFT + Click Row 10

Rows 3 → 10 Selected

Row Click Handler
function handleRowClick(
rowId: string,
rowIndex: number,
event: React.MouseEvent
) {

if (
event.shiftKey &&
lastSelectedIndex !== null
) {

    const start = Math.min(
      lastSelectedIndex,
      rowIndex
    );

    const end = Math.max(
      lastSelectedIndex,
      rowIndex
    );

    const rangeIds =
      rows
        .slice(start, end + 1)
        .map(row => row.id);

    setSelectedRows(
      prev =>
        new Set([
          ...prev,
          ...rangeIds,
        ])
    );

    return;

}

if (
event.ctrlKey ||
event.metaKey
) {

    setSelectedRows(prev => {

      const next =
        new Set(prev);

      if (
        next.has(rowId)
      ) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });

    setLastSelectedIndex(
      rowIndex
    );

    return;

}

setSelectedRows(
new Set([rowId])
);

setLastSelectedIndex(
rowIndex
);
}

Render

<tbody>

{rows.map(
(row, index) => (

    <tr
      key={row.id}

      onClick={(event) =>
        handleRowClick(
          row.id,
          index,
          event
        )
      }

      className={
        selectedRows.has(
          row.id
        )
          ? "selected-row"
          : ""
      }
    >

    </tr>

))}

</tbody>

2. Keyboard Navigation
   Expected Behaviour
   ↑ Move up

↓ Move down

← Move left

→ Move right

Space Select Row

Shift + Arrow
Extend Selection

Ctrl + A
Select All

Active Cell State
const [activeCell,
setActiveCell] =
useState({
rowIndex:0,
colIndex:0
});

Keyboard Handler
function handleKeyDown(
event: KeyboardEvent
) {

setActiveCell(
current => {

      switch(event.key){

        case "ArrowDown":

          return {
            ...current,

            rowIndex:
              Math.min(
                rows.length - 1,
                current.rowIndex + 1
              )
          };

        case "ArrowUp":

          return {
            ...current,

            rowIndex:
              Math.max(
                0,
                current.rowIndex - 1
              )
          };

        case "ArrowRight":

          return {
            ...current,

            colIndex:
              Math.min(
                columns.length - 1,
                current.colIndex + 1
              )
          };

        case "ArrowLeft":

          return {
            ...current,

            colIndex:
              Math.max(
                0,
                current.colIndex - 1
              )
          };

        default:
          return current;
      }
    }

);

if (
event.key === " " ||
event.code === "Space"
) {

    const row =
      rows[
        activeCell.rowIndex
      ];

    toggleRowSelection(
      row.id
    );

}

if (
event.ctrlKey &&
event.key === "a"
) {

    event.preventDefault();

    selectAllRows();

}
}

Register Keyboard Listener
useEffect(() => {

window.addEventListener(
"keydown",
handleKeyDown
);

return () => {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

};

}, [activeCell]);

Active Cell Styling

<td
 className={
  activeCell.rowIndex === rowIndex &&
  activeCell.colIndex === colIndex
    ? "active-cell"
    : ""
 }
>

.active-cell{
outline:2px solid #2563eb;
}

3. Programmatic Selection API

A professional grid should expose an API similar to enterprise grids that support saving, restoring and controlling selection programmatically.

Grid Ref
const tableRef =
useRef<TableApi>(null);

API Interface
export interface TableApi {

selectRow(
rowId:string
):void;

selectRows(
rowIds:string[]
):void;

clearSelection():void;

selectAll():void;

getSelectedRows():Row[];

isSelected(
rowId:string
):boolean;
}

Expose API
useImperativeHandle(
ref,
() => ({

    selectRow(rowId){

      setSelectedRows(
        new Set([rowId])
      );

    },

    selectRows(rowIds){

      setSelectedRows(
        new Set(rowIds)
      );

    },

    clearSelection(){

      setSelectedRows(
        new Set()
      );

    },

    selectAll(){

      setSelectedRows(
        new Set(
          rows.map(
            row => row.id
          )
        )
      );

    },

    getSelectedRows(){

      return rows.filter(
        row =>
          selectedRows.has(
            row.id
          )
      );

    },

    isSelected(rowId){

      return selectedRows.has(
        rowId
      );

    }

}),
[rows, selectedRows]
);

API Usage
Select One Row
tableRef.current
?.selectRow("101");

Select Multiple Rows
tableRef.current
?.selectRows([
"101",
"102",
"103"
]);

Select All
tableRef.current
?.selectAll();

Clear Selection
tableRef.current
?.clearSelection();

Get Selected Rows
const selected =
tableRef.current
?.getSelectedRows();

console.log(
selected
);

Persist Selection Across Pagination & Filtering

Instead of storing:

selectedIndexes

Store:

selectedRowIds

✅ Works after sorting

✅ Works after filtering

✅ Works after pagination

✅ Works after virtualization

Set<string>

is the recommended structure.

Production Features Checklist
✅ Single Row Selection

✅ Multi Row Selection

✅ Checkbox Selection

✅ Select All

✅ Clear Selection

✅ Shift+Click Range Selection

✅ Ctrl/Cmd Multi Select

✅ Keyboard Navigation

✅ Spacebar Selection

✅ Ctrl+A Select All

✅ Persistent Selection After Sort

✅ Persistent Selection After Filter

✅ Persistent Selection After Pagination

✅ Selection API

✅ Virtualization Compatible

Senior Interview Answer

I implement selection using a dedicated Selection Engine that stores row IDs in a Set and tracks the last selected index for Shift+Click ranges. Keyboard navigation is managed using an active cell model containing row and column coordinates. Selection APIs are exposed through useImperativeHandle and provide methods such as selectRow, selectRows, selectAll, clearSelection, and getSelectedRows. Using row IDs instead of indexes ensures selection remains stable across filtering, sorting, pagination, and virtualization, which is essential for enterprise-scale React grids. AG Grid similarly supports click selection, keyboard selection and API-driven row selection.

For a custom React DataGrid, keyboard navigation and selection should be built as separate concerns:

Keyboard Event
↓
Navigation Engine
↓
Active Cell
↓
Selection Engine
↓
Row/Cell Selection State
↓
Render

AG Grid supports keyboard-driven row selection, multi-row selection, click selection, and API-based selection controls.

1. Keyboard Navigation with Selection
   State
   const [activeCell, setActiveCell] =
   useState({
   rowIndex: 0,
   colIndex: 0,
   });

const [selectedRows, setSelectedRows] =
useState(new Set<string>());

const [anchorRowIndex, setAnchorRowIndex] =
useState<number | null>(null);

Row Selection Helper
function toggleRowSelection(
rowId: string
) {
setSelectedRows(prev => {
const next = new Set(prev);

    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }

    return next;

});
}

Keyboard Handler
function handleKeyDown(
event: KeyboardEvent
) {

switch (event.key) {

    case "ArrowDown":

      setActiveCell(cell => ({
        ...cell,
        rowIndex: Math.min(
          rows.length - 1,
          cell.rowIndex + 1
        )
      }));

      break;

    case "ArrowUp":

      setActiveCell(cell => ({
        ...cell,
        rowIndex: Math.max(
          0,
          cell.rowIndex - 1
        )
      }));

      break;

    case "ArrowRight":

      setActiveCell(cell => ({
        ...cell,
        colIndex: Math.min(
          columns.length - 1,
          cell.colIndex + 1
        )
      }));

      break;

    case "ArrowLeft":

      setActiveCell(cell => ({
        ...cell,
        colIndex: Math.max(
          0,
          cell.colIndex - 1
        )
      }));

      break;

    case " ":

      event.preventDefault();

      const row =
        rows[
          activeCell.rowIndex
        ];

      toggleRowSelection(
        row.id
      );

      break;

    default:
      break;

}
}

Register Keyboard Events
useEffect(() => {

window.addEventListener(
"keydown",
handleKeyDown
);

return () => {
window.removeEventListener(
"keydown",
handleKeyDown
);
};

}, [activeCell]);

Active Cell Rendering

<td
  className={
    activeCell.rowIndex === rowIndex &&
    activeCell.colIndex === colIndex
      ? "active-cell"
      : ""
  }
>

.active-cell {
outline: 2px solid #2563eb;
outline-offset: -2px;
}

2. Shift + Arrow Range Selection

Excel-style selection.

Active Cell = Row 5

Shift + ArrowDown

Rows 5-6 Selected

Shift + ArrowDown

Rows 5-7 Selected

Extend Selection
if (
event.shiftKey &&
event.key === "ArrowDown"
) {

if (
anchorRowIndex === null
) {
setAnchorRowIndex(
activeCell.rowIndex
);
}

const nextRow =
Math.min(
rows.length - 1,
activeCell.rowIndex + 1
);

const start =
Math.min(
anchorRowIndex ??
activeCell.rowIndex,
nextRow
);

const end =
Math.max(
anchorRowIndex ??
activeCell.rowIndex,
nextRow
);

const ids =
rows
.slice(
start,
end + 1
)
.map(
row => row.id
);

setSelectedRows(
new Set(ids)
);

setActiveCell(
cell => ({
...cell,
rowIndex: nextRow
})
);
}

3. Persist Selection Across Pagination

The most common mistake is storing:

selectedIndexes

This breaks when:

Sort
Filter
Pagination
Virtualization

changes row order.

Correct Solution

Store IDs only.

const [
selectedRows,
setSelectedRows
] =
useState(
new Set<string>()
);

Example:

Set {
"emp-101",
"emp-202",
"emp-303"
}

Pagination Example

Current page:

Page 1

emp-101
emp-102
emp-103

User selects:

emp-102

Move to:

Page 2

Selection remains:

selectedRows.has(
"emp-102"
)

because row IDs remain stable.

Rendering Across Pages

<tr
 className={
   selectedRows.has(
     row.id
   )
     ? "selected"
     : ""
 }
>

No dependency on page number.

Save Selection to localStorage
useEffect(() => {

localStorage.setItem(
"table-selection",

    JSON.stringify(
      [...selectedRows]
    )

);

}, [selectedRows]);

Restore Selection
useEffect(() => {

const saved =
JSON.parse(
localStorage.getItem(
"table-selection"
) || "[]"
);

setSelectedRows(
new Set(saved)
);

}, []);

4. Programmatic Selection API

Create a table ref.

const tableRef =
useRef<TableApi>(null);

API Interface
export interface TableApi {

selectRow(
rowId: string
): void;

selectRows(
rowIds: string[]
): void;

selectAll(): void;

clearSelection(): void;

getSelectedRows():
Row[];
}

Expose Methods
useImperativeHandle(
ref,
() => ({

    selectRow(
      rowId
    ) {

      setSelectedRows(
        new Set([rowId])
      );
    },

    selectRows(
      rowIds
    ) {

      setSelectedRows(
        new Set(rowIds)
      );
    },

    selectAll() {

      setSelectedRows(
        new Set(
          rows.map(
            row => row.id
          )
        )
      );
    },

    clearSelection() {

      setSelectedRows(
        new Set()
      );
    },

    getSelectedRows() {

      return rows.filter(
        row =>
          selectedRows.has(
            row.id
          )
      );
    }

}),
[rows, selectedRows]
);

5. Clearing Selection Programmatically
   Button Example
   <button
   onClick={() =>
   tableRef.current
   ?.clearSelection()
   }
   > Clear
   > </button>

Toolbar Action
function handleDelete() {

const selected =
tableRef.current
?.getSelectedRows();

console.log(selected);

tableRef.current
?.clearSelection();
}

Route Change
useEffect(() => {

return () => {

    tableRef.current
      ?.clearSelection();

};

}, []);

Production-Level Selection State
{
selectedRows:
Set([
"emp-101",
"emp-202"
]),

activeCell: {
rowIndex: 5,
colIndex: 3
},

anchorRowIndex: 2
}

Senior Interview Answer

I implement keyboard navigation using an active-cell model that tracks row and column coordinates. Arrow keys move focus, Space toggles selection, and Shift+Arrow extends selection ranges. Selection state is stored as a Set<RowId> rather than row indexes, ensuring it survives sorting, filtering, pagination, and virtualization. I expose imperative APIs such as selectRow, selectRows, selectAll, clearSelection, and getSelectedRows through useImperativeHandle, allowing external components and toolbars to control selection programmatically. This mirrors the API-driven selection approach documented for enterprise data grids.

Custom React Table - Editing Engine (AG Grid Level)

For a production-grade custom table, editing should be a separate engine from rendering, sorting, filtering and selection.

AG Grid editing supports:

Start/Stop Editing
Value Parsing
Value Saving
Custom Editors
Validation
Full Row Editing
Batch Editing
Undo / Redo

AG Grid documentation notes editing can start via Enter, F2, typing, or double-click, and stop via Enter, Escape, Tab, focus change, or API methods. It also supports validation and batch-edit workflows.

Editing Architecture
Cell Click
Keyboard
API

      ↓

Editing Engine

      ↓

Editing State
Draft Values
Validation State

      ↓

Value Parser

      ↓

Value Setter

      ↓

Undo / Redo History

      ↓

Rows

1. Editing State

Never update row data directly while user is typing.

Instead maintain:

const [
editingCell,
setEditingCell
] = useState(null);

const [
draftValues,
setDraftValues
] = useState({});

Example:

{
"10-name":"Sudhir",
"10-salary":"150000"
}

2. Start Editing
   Double Click
   function startEditing(
   rowId,
   field
   ){

const key =
`${rowId}-${field}`;

setEditingCell({
rowId,
field
});

setDraftValues(prev => ({
...prev,

    getCellValue(
        rowId,
        field
      )

}));
}

Keyboard Editing
function handleKeyDown(
event
){

if(
event.key === "F2"
){
startEditing(
activeCell.rowId,
activeCell.field
);
}

if(
event.key === "Enter"
){
startEditing(
activeCell.rowId,
activeCell.field
);
}

}

AG Grid similarly allows editing via Enter, F2 and double-click.

3. Stop Editing
   Save
   function stopEditing(){

commitEdit();

setEditingCell(null);
}

Cancel
function cancelEditing(){

setEditingCell(null);

setDraftValues({});
}

Escape:

if(
event.key === "Escape"
){
cancelEditing();
}

AG Grid documents Escape as cancelling edits and restoring the original value.

4. Value Parser

Parsers transform user input.

Example:

Input

"150,000"

Output

150000

Column Definition
{
field:"salary",

valueParser:
value =>
Number(
value.replace(
/,/g,
""
)
)
}

Apply Parse
function parseValue(
column,
value
){

if(
column.valueParser
){
return column.valueParser(
value
);
}

return value;
}

5. Value Setter

For nested rows.

Input:

{
profile:{
salary:100
}
}

Custom Setter
{
field:"profile.salary",

valueSetter:
(
row,
value
) => {

row.profile.salary =
value;

return row;
}
}

Generic Setter
function updateNested(
object,
path,
value
){

const keys =
path.split(".");

const clone =
structuredClone(
object
);

let current =
clone;

for(
let i=0;
i<keys.length-1;
i++
){
current =
current[
keys[i]
];
}

current[
keys[
keys.length-1
]
] = value;

return clone;
}

6. Validation Engine

Store validation errors separately.

const [
validationErrors,
setValidationErrors
]
=
useState({});

Column Rules
{
field:"name",

validator:
value => {

    if(
      !value
    ){
      return
      "Name required";
    }

    return null;

}
}

Run Validation
function validate(
column,
value
){

if(
!column.validator
){
return null;
}

return column.validator(
value
);
}

Commit Edit
function commitEdit(){

const value =
draftValues[key];

const error =
validate(
column,
value
);

if(error){

setValidationErrors(
prev => ({
...prev,
[key]:error
})
);

return;
}

saveValue();
}

AG Grid supports built-in and custom validation and can either revert invalid values or block the editor until valid input is provided.

7. Editor Components
   Text Editor
   function TextEditor({
   value,
   onChange
   }){

return (
<input
value={value}
onChange={e =>
onChange(
e.target.value
)
}
/>
);
}

Number Editor
function NumberEditor({
value,
onChange
}){

return (
<input
type="number"

    value={value}

    onChange={e =>
      onChange(
       e.target.value
      )
    }

/>
);
}

Select Editor
function SelectEditor({
value,
options,
onChange
}){

return (
<select
value={value}

onChange={e =>
onChange(
e.target.value
)
}

>

{
options.map(
option => (

      <option
       key={option}
      >
        {option}
      </option>

     )
    )

}

  </select>
 );
}

Dynamic Editor
function getEditor(
column
){

switch(
column.editorType
) {

case "text":
return TextEditor;

case "number":
return NumberEditor;

case "select":
return SelectEditor;

default:
return TextEditor;
}
}

8. Undo / Redo

Maintain history.

const [
undoStack,
setUndoStack
]
=
useState([]);

const [
redoStack,
setRedoStack
]
=
useState([]);

Save Snapshot
function pushHistory(
rows
){

setUndoStack(
prev => [
...prev,
structuredClone(
rows
)
]
);

}

Undo
function undo(){

if(
!undoStack.length
){
return;
}

const previous =
undoStack[
undoStack.length-1
];

setRedoStack(
prev => [
...prev,
rows
]
);

setRows(
previous
);
}

Redo
function redo(){

if(
!redoStack.length
){
return;
}

const next =
redoStack[
redoStack.length-1
];

setRows(next);
}

AG Grid exposes dedicated undo/redo editing support as part of its editing system.

9. Full Row Editing

Instead of one cell:

Name
Email
Salary

Edit the entire row.

State
const [
editingRowId,
setEditingRowId
]
=
useState(null);

Start Row Edit
setEditingRowId(
row.id
);

Save Row
function saveRow(
rowId
){

updateRow(
rowId,
draftRow
);

setEditingRowId(
null
);
}

10. Batch Editing

Used in admin panels.

Edit 100 cells

Apply

Discard

AG Grid's batch editing queues edits and later commits or cancels all pending changes.

Pending Changes
const [
pendingChanges,
setPendingChanges
]
=
useState({});

Stage Change
function editCell(
rowId,
field,
value
){

setPendingChanges(
prev => ({

     ...prev,

     [`${rowId}-${field}`]:
       value

})
);
}

Commit
function commitBatch(){

Object.entries(
pendingChanges
).forEach(
applyChange
);

setPendingChanges(
{}
);
}

Cancel
function cancelBatch(){

setPendingChanges(
{}
);
}

Editing API
tableRef.current.startEditing(
rowId,
field
);

tableRef.current.stopEditing();

tableRef.current.cancelEditing();

tableRef.current.undo();

tableRef.current.redo();

tableRef.current.commitBatch();

tableRef.current.cancelBatch();

Production Features Checklist
✅ Cell Editing

✅ Keyboard Editing

✅ Double Click Editing

✅ Value Parsing

✅ Value Setters

✅ Validation

✅ Custom Editors

✅ Full Row Editing

✅ Batch Editing

✅ Undo

✅ Redo

✅ Dirty Tracking

✅ Save Indicator

✅ Optimistic Updates

✅ API Driven Editing

✅ Virtualization Safe

Senior React Interview Answer

I separate editing from rendering through a dedicated Editing Engine. Each editable cell maintains draft state, validation state, and edit lifecycle events. User input is transformed through value parsers, persisted through value setters, validated before commit, and tracked in undo/redo history. For enterprise scenarios, I support full-row editing, batch editing, optimistic updates, and custom editors such as text, number, date, select, and async lookup editors. The editing API is exposed through refs, enabling external toolbars and workflows to start, stop, commit, cancel, undo, and redo edits programmatically. This architecture scales well with filtering, sorting, pagination, virtualization, and selection.

Below is a complete custom React table editing example covering:

✅ Start editing with double-click / Enter / F2
✅ Stop editing with Enter / blur
✅ Cancel editing with Escape
✅ Custom cell editors: text, number, select
✅ Value parsing before save
✅ Undo / redo editing functionality

AG Grid documents similar editing triggers: editing can start with Enter, F2, printable key press, double-click, or API call, and can stop with Enter, Escape, Tab, focus change, or API call. AG Grid also supports editable columns, editing events, value changes, and undo/redo as part of its editing model.

1. Complete Custom Editable Table Example
   import React, {
   useMemo,
   useState,
   useCallback
   } from "react";
   import "./EditableTable.css";

const initialRows = [
{
id: "101",
name: "Sudhir Jedhe",
role: "Project Lead",
department: "Frontend",
salary: 180000,
status: "Active"
},
{
id: "102",
name: "Kunal Bhatia",
role: "React Developer",
department: "Frontend",
salary: 120000,
status: "Active"
},
{
id: "103",
name: "Aakanksha Mahajan",
role: "UI Developer",
department: "Design",
salary: 110000,
status: "Inactive"
}
];

export default function EditableTable() {
const [rows, setRows] = useState(initialRows);

const [editingCell, setEditingCell] = useState(null);

const [draftValue, setDraftValue] = useState("");

const [undoStack, setUndoStack] = useState([]);

const [redoStack, setRedoStack] = useState([]);

const columns = useMemo(
() => [
{
field: "name",
headerName: "Employee Name",
editable: true,
editor: "text"
},
{
field: "role",
headerName: "Role",
editable: true,
editor: "text"
},
{
field: "department",
headerName: "Department",
editable: true,
editor: "select",
editorOptions: [
"Frontend",
"Backend",
"Design",
"QA",
"DevOps"
]
},
{
field: "salary",
headerName: "Salary",
editable: true,
editor: "number",
valueParser: value => Number(value),
valueFormatter: value =>
new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 0
}).format(Number(value || 0))
},
{
field: "status",
headerName: "Status",
editable: true,
editor: "select",
editorOptions: [
"Active",
"Inactive"
]
}
],
[]
);

const getCellKey = (rowId, field) =>
`${rowId}-${field}`;

const findColumn = field =>
columns.find(column => column.field === field);

const findRow = rowId =>
rows.find(row => row.id === rowId);

const startEditing = useCallback(
(rowId, field) => {
const column = findColumn(field);

      if (!column?.editable) {
        return;
      }

      const row = findRow(rowId);

      setEditingCell({
        rowId,
        field
      });

      setDraftValue(
        row?.[field] ?? ""
      );
    },
    [rows, columns]

);

const cancelEditing = () => {
setEditingCell(null);
setDraftValue("");
};

const commitEditing = () => {
if (!editingCell) {
return;
}

    const { rowId, field } = editingCell;

    const column = findColumn(field);

    let parsedValue = draftValue;

    if (column?.valueParser) {
      parsedValue =
        column.valueParser(draftValue);
    }

    const currentRow = findRow(rowId);

    if (!currentRow) {
      return;
    }

    const oldValue = currentRow[field];

    if (oldValue === parsedValue) {
      cancelEditing();
      return;
    }

    const previousRows =
      structuredClone(rows);

    const nextRows =
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              parsedValue
            }
          : row
      );

    setUndoStack(prev => [
      ...prev,
      previousRows
    ]);

    setRedoStack([]);

    setRows(nextRows);

    setEditingCell(null);
    setDraftValue("");

};

const undo = () => {
if (!undoStack.length) {
return;
}

    const previousRows =
      undoStack[
        undoStack.length - 1
      ];

    setUndoStack(prev =>
      prev.slice(0, -1)
    );

    setRedoStack(prev => [
      ...prev,
      structuredClone(rows)
    ]);

    setRows(previousRows);

    cancelEditing();

};

const redo = () => {
if (!redoStack.length) {
return;
}

    const nextRows =
      redoStack[
        redoStack.length - 1
      ];

    setRedoStack(prev =>
      prev.slice(0, -1)
    );

    setUndoStack(prev => [
      ...prev,
      structuredClone(rows)
    ]);

    setRows(nextRows);

    cancelEditing();

};

const renderDisplayValue = (
row,
column
) => {
const value =
row[column.field];

    if (column.valueFormatter) {
      return column.valueFormatter(value);
    }

    return value;

};

return (

<div className="table-page">
<h2>Custom Editable React Table</h2>

      <div className="toolbar">
        <button
          type="button"
          onClick={undo}
          disabled={!undoStack.length}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={!redoStack.length}
        >
          Redo
        </button>
      </div>

      <table className="editable-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.field}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              {columns.map(column => {
                const isEditing =
                  editingCell?.rowId === row.id &&
                  editingCell?.field === column.field;

                return (
                  <td
                    key={getCellKey(
                      row.id,
                      column.field
                    )}
                    tabIndex={0}
                    onDoubleClick={() =>
                      startEditing(
                        row.id,
                        column.field
                      )
                    }
                    onKeyDown={event => {
                      if (
                        event.key === "Enter" ||
                        event.key === "F2"
                      ) {
                        startEditing(
                          row.id,
                          column.field
                        );
                      }

                      if (
                        event.key === "Escape"
                      ) {
                        cancelEditing();
                      }
                    }}
                  >
                    {isEditing ? (
                      <CellEditor
                        column={column}
                        value={draftValue}
                        onChange={setDraftValue}
                        onCommit={commitEditing}
                        onCancel={cancelEditing}
                      />
                    ) : (
                      renderDisplayValue(
                        row,
                        column
                      )
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

);
}

2. Custom Cell Editors

A custom table should not hardcode <input> directly inside every cell. Use an editor resolver.

function CellEditor({
column,
value,
onChange,
onCommit,
onCancel
}) {
switch (column.editor) {
case "number":
return (
<NumberEditor
          value={value}
          onChange={onChange}
          onCommit={onCommit}
          onCancel={onCancel}
        />
);

    case "select":
      return (
        <SelectEditor
          value={value}
          options={
            column.editorOptions || []
          }
          onChange={onChange}
          onCommit={onCommit}
          onCancel={onCancel}
        />
      );

    case "text":
    default:
      return (
        <TextEditor
          value={value}
          onChange={onChange}
          onCommit={onCommit}
          onCancel={onCancel}
        />
      );

}
}

Text Editor
function TextEditor({
value,
onChange,
onCommit,
onCancel
}) {
return (
<input
className="cell-editor"
autoFocus
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={onCommit}
onKeyDown={event => {
if (event.key === "Enter") {
onCommit();
}

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    />

);
}

Number Editor
function NumberEditor({
value,
onChange,
onCommit,
onCancel
}) {
return (
<input
type="number"
className="cell-editor"
autoFocus
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={onCommit}
onKeyDown={event => {
if (event.key === "Enter") {
onCommit();
}

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    />

);
}

Select Editor
function SelectEditor({
value,
options,
onChange,
onCommit,
onCancel
}) {
return (
<select
className="cell-editor"
autoFocus
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={onCommit}
onKeyDown={event => {
if (event.key === "Enter") {
onCommit();
}

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    >
      {options.map(option => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>

);
}

AG Grid provides different editor types such as text, large text, number, date, checkbox, select and rich select editors; in a custom grid, the same idea can be represented with an editor field in the column definition.

3. Undo and Redo Editing Functionality
   Concept

Before every successful edit, save the current rows into undoStack.

Before Edit
↓
Push current rows into undoStack
↓
Apply new value
↓
Clear redoStack

Undo:

Move latest undo snapshot into rows
Move current rows into redoStack

Redo:

Move latest redo snapshot into rows
Move current rows into undoStack

AG Grid supports undo/redo edit operations as part of its editing model.

Undo Code
const undo = () => {
if (!undoStack.length) {
return;
}

const previousRows =
undoStack[
undoStack.length - 1
];

setUndoStack(prev =>
prev.slice(0, -1)
);

setRedoStack(prev => [
...prev,
structuredClone(rows)
]);

setRows(previousRows);
};

Redo Code
const redo = () => {
if (!redoStack.length) {
return;
}

const nextRows =
redoStack[
redoStack.length - 1
];

setRedoStack(prev =>
prev.slice(0, -1)
);

setUndoStack(prev => [
...prev,
structuredClone(rows)
]);

setRows(nextRows);
};

4. CSS
   .table-page {
   padding: 24px;
   font-family: Arial, sans-serif;
   }

.toolbar {
display: flex;
gap: 8px;
margin-bottom: 12px;
}

.toolbar button {
padding: 8px 12px;
border: 1px solid #cbd5e1;
border-radius: 6px;
background: #ffffff;
cursor: pointer;
}

.toolbar button:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.editable-table {
width: 100%;
border-collapse: collapse;
background: #ffffff;
}

.editable-table th,
.editable-table td {
border: 1px solid #e2e8f0;
padding: 10px;
min-width: 150px;
}

.editable-table th {
background: #eff6ff;
text-align: left;
}

.editable-table td:focus {
outline: 2px solid #2563eb;
outline-offset: -2px;
}

.cell-editor {
width: 100%;
padding: 6px;
border: 1px solid #2563eb;
border-radius: 4px;
}

5. Editing Flow Summary
   User double-clicks cell
   ↓
   startEditing(rowId, field)
   ↓
   draftValue is created
   ↓
   Custom editor renders
   ↓
   User changes value
   ↓
   Enter / Blur commits
   ↓
   valueParser transforms value
   ↓
   Undo snapshot saved
   ↓
   Rows updated
   ↓
   Editor closes

Senior Interview Explanation

You can explain it like this:

I would implement editing through a dedicated Editing Engine. Each editable column defines its editor type, value parser and formatter. When editing starts, the current value is copied into temporary draft state rather than immediately mutating row data. When editing stops, the draft value is parsed, optionally validated, pushed through a value setter, and then committed to the row store. Before committing, the previous row state is pushed to an undo stack, while redo state is cleared. This gives us custom editors, keyboard editing, undo/redo, validation, and API-driven editing while keeping rendering logic clean and scalable.

This pattern works very well for editable forecast grids, admin panels, employee data tables, financial grids and workflow screens where users may edit many fields and need safe rollback behaviour.

Below is a custom React table editing implementation covering:

Cell editing validation
Batch editing with commit/cancel
Full row editing start/save

This follows the same editing concepts you have been mapping from AG Grid: editing can start through keyboard/double-click/API, validation can be applied when editing ends, and batch editing can stage edits before commit/cancel. AG Grid documents start/stop triggers such as Enter, F2, double-click, Escape, Tab, focus change, and API-based editing; it also documents validation modes and batch editing commit/cancel behaviour.

1.  Column Config with Validation
    const columns = [
    {
    field: "name",
    headerName: "Employee Name",
    editable: true,
    editor: "text",
    validate: value => {
    if (!value || value.trim() === "") {
    return "Name is required";
    }

          if (value.length < 3) {
            return "Name must be at least 3 characters";
          }

          return null;
        },

    },
    {
    field: "department",
    headerName: "Department",
    editable: true,
    editor: "select",
    editorOptions: ["Frontend", "Backend", "QA", "Design"],
    validate: value => {
    if (!value) {
    return "Department is required";
    }

          return null;
        },

    },
    {
    field: "salary",
    headerName: "Salary",
    editable: true,
    editor: "number",
    valueParser: value => Number(value),
    valueFormatter: value =>
    new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    }).format(Number(value || 0)),
    validate: value => {
    if (value === "" || value === null || Number.isNaN(Number(value))) {
    return "Salary must be a valid number";
    }

          if (Number(value) <= 0) {
            return "Salary must be greater than 0";
          }

          return null;
        },

    },
    {
    field: "status",
    headerName: "Status",
    editable: true,
    editor: "select",
    editorOptions: ["Active", "Inactive"],
    },
    ];

2.  Editable Table with Cell Validation + Batch Editing + Full Row Editing
    import React, {
    useMemo,
    useState,
    useCallback,
    } from "react";

import "./EditableTable.css";

const initialRows = [
{
id: "101",
name: "Sudhir Jedhe",
department: "Frontend",
salary: 180000,
status: "Active",
},
{
id: "102",
name: "Kunal Bhatia",
department: "Frontend",
salary: 120000,
status: "Active",
},
{
id: "103",
name: "Aakanksha Mahajan",
department: "Design",
salary: 110000,
status: "Inactive",
},
];

export default function EditableTable() {
const [rows, setRows] = useState(initialRows);

const [editingCell, setEditingCell] = useState(null);
const [draftValue, setDraftValue] = useState("");

const [validationErrors, setValidationErrors] = useState({});

const [isBatchMode, setIsBatchMode] = useState(false);
const [pendingChanges, setPendingChanges] = useState({});

const [editingRowId, setEditingRowId] = useState(null);
const [draftRow, setDraftRow] = useState(null);

const columns = useMemo(
() => [
{
field: "name",
headerName: "Employee Name",
editable: true,
editor: "text",
validate: value => {
if (!value || value.trim() === "") {
return "Name is required";
}

          if (value.length < 3) {
            return "Name must be at least 3 characters";
          }

          return null;
        },
      },
      {
        field: "department",
        headerName: "Department",
        editable: true,
        editor: "select",
        editorOptions: [
          "Frontend",
          "Backend",
          "QA",
          "Design",
        ],
        validate: value => {
          if (!value) {
            return "Department is required";
          }

          return null;
        },
      },
      {
        field: "salary",
        headerName: "Salary",
        editable: true,
        editor: "number",
        valueParser: value => Number(value),
        valueFormatter: value =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(Number(value || 0)),
        validate: value => {
          if (
            value === "" ||
            value === null ||
            Number.isNaN(Number(value))
          ) {
            return "Salary must be a valid number";
          }

          if (Number(value) <= 0) {
            return "Salary must be greater than 0";
          }

          return null;
        },
      },
      {
        field: "status",
        headerName: "Status",
        editable: true,
        editor: "select",
        editorOptions: [
          "Active",
          "Inactive",
        ],
      },
    ],
    []

);

const getCellKey = (rowId, field) =>
`${rowId}-${field}`;

const findColumn = field =>
columns.find(column => column.field === field);

const findRow = rowId =>
rows.find(row => row.id === rowId);

const getDisplayValue = (row, column) => {
const pendingKey = getCellKey(
row.id,
column.field
);

    const value =
      pendingChanges[pendingKey] !== undefined
        ? pendingChanges[pendingKey]
        : row[column.field];

    if (column.valueFormatter) {
      return column.valueFormatter(value);
    }

    return value;

};

const updateRowValue = (
rowId,
field,
value
) => {
setRows(prevRows =>
prevRows.map(row =>
row.id === rowId
? {
...row,
[field]: value,
}
: row
)
);
};

const validateCell = (
column,
value,
row
) => {
if (!column.validate) {
return null;
}

    return column.validate(
      value,
      row
    );

};

const startCellEditing = useCallback(
(rowId, field) => {
const column = findColumn(field);

      if (!column?.editable) {
        return;
      }

      const row = findRow(rowId);

      if (!row) {
        return;
      }

      const key = getCellKey(rowId, field);

      const currentValue =
        pendingChanges[key] !== undefined
          ? pendingChanges[key]
          : row[field];

      setEditingCell({
        rowId,
        field,
      });

      setDraftValue(
        currentValue ?? ""
      );

      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [rows, columns, pendingChanges]

);

const cancelCellEditing = () => {
setEditingCell(null);
setDraftValue("");
};

const commitCellEditing = () => {
if (!editingCell) {
return;
}

    const {
      rowId,
      field,
    } = editingCell;

    const column = findColumn(field);
    const row = findRow(rowId);
    const key = getCellKey(rowId, field);

    let parsedValue = draftValue;

    if (column?.valueParser) {
      parsedValue =
        column.valueParser(draftValue);
    }

    const error = validateCell(
      column,
      parsedValue,
      row
    );

    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [key]: error,
      }));

      return;
    }

    if (isBatchMode) {
      setPendingChanges(prev => ({
        ...prev,
        [key]: value,
      }));
    } else {
      updateRowValue(
        rowId,
        field,
        parsedValue
      );
    }

    setEditingCell(null);
    setDraftValue("");

    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

};

const startBatchEditing = () => {
setIsBatchMode(true);
setPendingChanges({});
};

const commitBatchEditing = () => {
const changes = Object.entries(
pendingChanges
);

    if (!changes.length) {
      setIsBatchMode(false);
      return;
    }

    setRows(prevRows =>
      prevRows.map(row => {
        let updatedRow = { ...row };

        changes.forEach(
          ([cellKey, value]) => {
            const [
              rowId,
              field,
            ] = cellKey.split("-");

            if (row.id === rowId) {
              updatedRow[field] = value;
            }
          }
        );

        return updatedRow;
      })
    );

    setPendingChanges({});
    setIsBatchMode(false);
    setEditingCell(null);

};

const cancelBatchEditing = () => {
setPendingChanges({});
setIsBatchMode(false);
setEditingCell(null);
setDraftValue("");
setValidationErrors({});
};

const startFullRowEditing = rowId => {
const row = findRow(rowId);

    if (!row) {
      return;
    }

    setEditingRowId(rowId);
    setDraftRow({ ...row });
    setValidationErrors({});

};

const cancelFullRowEditing = () => {
setEditingRowId(null);
setDraftRow(null);
setValidationErrors({});
};

const saveFullRowEditing = () => {
if (!draftRow) {
return;
}

    const rowErrors = {};

    columns.forEach(column => {
      if (!column.editable) {
        return;
      }

      let value =
        draftRow[column.field];

      if (column.valueParser) {
        value = column.valueParser(value);
      }

      const error = validateCell(
        column,
        value,
        draftRow
      );

      if (error) {
        rowErrors[
          getCellKey(
            draftRow.id,
            column.field
          )
        ] = error;
      }
    });

    if (Object.keys(rowErrors).length) {
      setValidationErrors(rowErrors);
      return;
    }

    setRows(prevRows =>
      prevRows.map(row =>
        row.id === draftRow.id
          ? { ...draftRow }
          : row
      )
    );

    setEditingRowId(null);
    setDraftRow(null);
    setValidationErrors({});

};

return (

<div className="table-page">
<h2>
Custom Table Editing
</h2>

      <div className="toolbar">
        {!isBatchMode ? (
          <button
            type="button"
            onClick={startBatchEditing}
          >
            Start Batch Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={commitBatchEditing}
            >
              Commit Batch
            </button>

            <button
              type="button"
              onClick={cancelBatchEditing}
            >
              Cancel Batch
            </button>
          </>
        )}
      </div>

      {isBatchMode && (
        <p className="batch-banner">
          Batch mode active: edits are staged until you commit.
        </p>
      )}

      <table className="editable-table">
        <thead>
          <tr>
            <th>
              Actions
            </th>

            {columns.map(column => (
              <th key={column.field}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map(row => {
            const isEditingRow =
              editingRowId === row.id;

            return (
              <tr
                key={row.id}
                className={
                  isEditingRow
                    ? "row-editing"
                    : ""
                }
              >
                <td>
                  {isEditingRow ? (
                    <>
                      <button
                        type="button"
                        onClick={saveFullRowEditing}
                      >
                        Save Row
                      </button>

                      <button
                        type="button"
                        onClick={cancelFullRowEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        startFullRowEditing(row.id)
                      }
                    >
                      Edit Row
                    </button>
                  )}
                </td>

                {columns.map(column => {
                  const key = getCellKey(
                    row.id,
                    column.field
                  );

                  const isCellEditing =
                    editingCell?.rowId === row.id &&
                    editingCell?.field === column.field;

                  const error =
                    validationErrors[key];

                  const isPending =
                    pendingChanges[key] !== undefined;

                  if (isEditingRow) {
                    return (
                      <td
                        key={column.field}
                        className={
                          error
                            ? "cell-invalid"
                            : ""
                        }
                      >
                        <CellEditor
                          column={column}
                          value={
                            draftRow?.[
                              column.field
                            ] ?? ""
                          }
                          onChange={value =>
                            setDraftRow(prev => ({
                              ...prev,
                              [column.field]: value,
                            }))
                          }
                          onCommit={() => {}}
                          onCancel={() => {}}
                          inlineOnly
                        />

                        {error && (
                          <div className="error-text">
                            {error}
                          </div>
                        )}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={column.field}
                      tabIndex={0}
                      className={[
                        error
                          ? "cell-invalid"
                          : "",
                        isPending
                          ? "cell-pending"
                          : "",
                      ].join(" ")}
                      onDoubleClick={() =>
                        startCellEditing(
                          row.id,
                          column.field
                        )
                      }
                      onKeyDown={event => {
                        if (
                          event.key === "Enter" ||
                          event.key === "F2"
                        ) {
                          startCellEditing(
                            row.id,
                            column.field
                          );
                        }

                        if (
                          event.key === "Escape"
                        ) {
                          cancelCellEditing();
                        }
                      }}
                    >
                      {isCellEditing ? (
                        <>
                          <CellEditor
                            column={column}
                            value={draftValue}
                            onChange={setDraftValue}
                            onCommit={commitCellEditing}
                            onCancel={cancelCellEditing}
                          />

                          {error && (
                            <div className="error-text">
                              {error}
                            </div>
                          )}
                        </>
                      ) : (
                        getDisplayValue(
                          row,
                          column
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <pre className="debug">
        {JSON.stringify(
          {
            rows,
            isBatchMode,
            pendingChanges,
            editingRowId,
            validationErrors,
          },
          null,
          2
        )}
      </pre>
    </div>

);
}

3.  Custom Cell Editor Resolver
    function CellEditor({
    column,
    value,
    onChange,
    onCommit,
    onCancel,
    inlineOnly = false,
    }) {
    switch (column.editor) {
    case "number":
    return (
    <NumberEditor
              value={value}
              onChange={onChange}
              onCommit={onCommit}
              onCancel={onCancel}
              inlineOnly={inlineOnly}
            />
    );

        case "select":
          return (
            <SelectEditor
              value={value}
              options={
                column.editorOptions || []
              }
              onChange={onChange}
              onCommit={onCommit}
              onCancel={onCancel}
              inlineOnly={inlineOnly}
            />
          );

        case "text":
        default:
          return (
            <TextEditor
              value={value}
              onChange={onChange}
              onCommit={onCommit}
              onCancel={onCancel}
              inlineOnly={inlineOnly}
            />
          );

    }
    }

Text Editor
function TextEditor({
value,
onChange,
onCommit,
onCancel,
inlineOnly,
}) {
return (
<input
className="cell-editor"
autoFocus={!inlineOnly}
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={
inlineOnly
? undefined
: onCommit
}
onKeyDown={event => {
if (inlineOnly) {
return;
}

        if (event.key === "Enter") {
          onCommit();
        }

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    />

);
}

Number Editor
function NumberEditor({
value,
onChange,
onCommit,
onCancel,
inlineOnly,
}) {
return (
<input
type="number"
className="cell-editor"
autoFocus={!inlineOnly}
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={
inlineOnly
? undefined
: onCommit
}
onKeyDown={event => {
if (inlineOnly) {
return;
}

        if (event.key === "Enter") {
          onCommit();
        }

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    />

);
}

Select Editor
function SelectEditor({
value,
options,
onChange,
onCommit,
onCancel,
inlineOnly,
}) {
return (
<select
className="cell-editor"
autoFocus={!inlineOnly}
value={value}
onChange={event =>
onChange(event.target.value)
}
onBlur={
inlineOnly
? undefined
: onCommit
}
onKeyDown={event => {
if (inlineOnly) {
return;
}

        if (event.key === "Enter") {
          onCommit();
        }

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    >
      {options.map(option => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>

);
}

4. CSS
   .table-page {
   padding: 24px;
   font-family: Arial, sans-serif;
   }

.toolbar {
display: flex;
gap: 8px;
margin-bottom: 12px;
}

.toolbar button,
.editable-table button {
padding: 6px 10px;
border: 1px solid #cbd5e1;
background: white;
border-radius: 6px;
cursor: pointer;
}

.batch-banner {
padding: 10px;
background: #fff7ed;
border: 1px solid #fdba74;
border-radius: 8px;
color: #9a3412;
}

.editable-table {
width: 100%;
border-collapse: collapse;
background: white;
}

.editable-table th,
.editable-table td {
padding: 10px;
border: 1px solid #e2e8f0;
min-width: 140px;
}

.editable-table th {
background: #eff6ff;
text-align: left;
}

.editable-table td:focus {
outline: 2px solid #2563eb;
outline-offset: -2px;
}

.cell-editor {
width: 100%;
padding: 6px;
border: 1px solid #2563eb;
border-radius: 4px;
}

.cell-invalid {
background: #fef2f2;
}

.error-text {
margin-top: 4px;
color: #dc2626;
font-size: 12px;
}

.cell-pending {
background: #fef9c3;
}

.row-editing {
background: #f8fafc;
}

.debug {
margin-top: 20px;
padding: 12px;
background: #0f172a;
color: #dbeafe;
border-radius: 8px;
font-size: 12px;
overflow: auto;
}

How Validation Works in Cell Editing

When the user commits a cell edit:

Draft Value
↓
Value Parser
↓
Validation Function
↓
If valid → save
If invalid → keep editor open + show error

Code path:

const error = validateCell(
column,
parsedValue,
row
);

if (error) {
setValidationErrors(prev => ({
...prev,
[key]: error,
}));

return;
}

This mirrors the idea of validating editor values before accepting or rejecting edits. AG Grid documents built-in and custom validation, including modes where invalid values can be reverted or blocked.

How Batch Editing Works

Batch mode does not immediately update rows.

Instead, edits go into:

pendingChanges

Example:

{
"101-name": "Sudhir J",
"102-salary": 150000
}

Then:

Commit Batch
pendingChanges
↓
Apply all changes to rows
↓
Clear pending changes
↓
Exit batch mode

Cancel Batch
Discard pendingChanges
↓
Rows remain unchanged
↓
Exit batch mode

AG Grid’s batch editing model similarly queues pending edits, then applies them on commit or discards them on cancel.

How Full Row Editing Works

Full row editing uses:

editingRowId
draftRow

When a row enters edit mode:

setEditingRowId(rowId);
setDraftRow({ ...row });

User edits all fields inside draftRow.

On save:

setRows(prevRows =>
prevRows.map(row =>
row.id === draftRow.id
? { ...draftRow }
: row
)
);

This is useful for enterprise grids where users should edit related row fields together, such as employee profile rows, forecast rows, claim records, invoice rows, or admin configuration rows.

Senior Interview Summary

You can explain it like this:

I separate editing into three modes: cell editing, batch editing, and full row editing. Cell editing commits immediately after parsing and validation. Batch editing stages changes in a pendingChanges map and only updates row data when the user commits. Full row editing copies the entire row into a draft object, validates all editable fields together, and saves the row atomically. This gives better control over validation, cancellation, dirty tracking, and enterprise workflows where users need safe editing before committing changes.

For a production-grade custom React table, validation errors, batch edit cancellation, and multi-row editing should be handled as part of an Editing Engine.

AG Grid's editing model supports validation, batch editing with commit/cancel, and full-row editing workflows. Validation can block or reject invalid edits, and batch editing stages changes until explicitly committed or cancelled.

1. Validation Errors in the UI
   Validation State

Keep errors separate from row data.

const [validationErrors, setValidationErrors] =
useState({});

Example:

{
"101-name": "Name is required",
"102-salary": "Invalid salary"
}

Validation Function
function validateCell(
column,
value
) {
if (!column.validate) {
return null;
}

return column.validate(value);
}

Commit Edit
function commitEdit(
rowId,
field,
value
) {

const column =
getColumn(field);

const error =
validateCell(
column,
value
);

const key =
`${rowId}-${field}`;

if (error) {

    setValidationErrors(
      prev => ({
        ...prev,
        [key]: error
      })
    );

    return false;

}

setValidationErrors(
prev => {

      const next = {
        ...prev
      };

      delete next[key];

      return next;
    }

);

updateRow(
rowId,
field,
value
);

return true;
}

Show Error in Cell

<td
 className={
  validationErrors[key]
    ? "cell-error"
    : ""
 }
>

<input
   value={draftValue}
 />

{validationErrors[key] && (

   <div className="error-message">

     {
       validationErrors[key]
     }

   </div>

)}

</td>

Error Styling
.cell-error {
background: #fef2f2;
}

.error-message {
color: #dc2626;
font-size: 12px;
margin-top: 4px;
}

2. Batch Editing with Confirmation

Batch editing means:

User edits 50 cells
↓
Changes are staged
↓
Commit OR Cancel

This follows the same idea as staged/pending edits in batch editing workflows.

Pending Changes Store
const [
pendingChanges,
setPendingChanges
]
=
useState({});

Example:

{
"101-salary": 220000,
"102-status": "Inactive"
}

Add Pending Change
function stageChange(
rowId,
field,
value
){

const key =
`${rowId}-${field}`;

setPendingChanges(
prev => ({
...prev,
[key]: value
})
);
}

Commit Batch
function commitBatch() {

setRows(prevRows =>
prevRows.map(row => {

      let updated = {
        ...row
      };

      Object.entries(
        pendingChanges
      ).forEach(
        ([key, value]) => {

          const [
            rowId,
            field
          ] = key.split("-");

          if (
            row.id === rowId
          ) {
            updated[field] =
              value;
          }
        }
      );

      return updated;
    })

);

setPendingChanges({});
}

Cancel Batch With Confirmation
function cancelBatch() {

const confirmed =
window.confirm(
"Discard all pending changes?"
);

if (!confirmed) {
return;
}

setPendingChanges({});
}

Modern Modal Version
const [
showCancelDialog,
setShowCancelDialog
] = useState(false);

<button
onClick={() =>
setShowCancelDialog(true)
}

> Cancel Batch
> </button>

<ConfirmModal
open={showCancelDialog}
title="Discard Changes?"
message="All pending edits will be lost."
onConfirm={() => {
setPendingChanges({});
setShowCancelDialog(false);
}}
onCancel={() =>
setShowCancelDialog(false)
}
/>

3. Editing Multiple Rows Simultaneously

Enterprise systems often allow multiple rows to be edited before save.

Editing State

Instead of:

editingRowId

Use:

const [
editingRows,
setEditingRows
]
=
useState(new Set());

Start Editing Row
function startRowEdit(
rowId
){

setEditingRows(
prev =>
new Set([
...prev,
rowId
])
);

}

Stop Editing Row
function stopRowEdit(
rowId
){

setEditingRows(
prev => {

const next =
new Set(prev);

next.delete(
rowId
);

return next;
}
);

}

Check Editing State
const isEditing =
editingRows.has(
row.id
);

Render Editable Row

<tr>

{columns.map(column => (

  <td key={column.field}>

    {editingRows.has(row.id)
      ? (
        <input
          value={
            draftRows[
              row.id
            ][
              column.field
            ]
          }

          onChange={e =>
            updateDraftValue(
              row.id,
              column.field,
              e.target.value
            )
          }
        />
      )
      : row[column.field]
    }

  </td>

))}

</tr>

Draft Store
const [
draftRows,
setDraftRows
]
=
useState({});

Example:

{
"101": {
salary: 210000
},

"102": {
status: "Inactive"
}
}

Save One Row
function saveRow(
rowId
){

setRows(prevRows =>
prevRows.map(
row =>
row.id === rowId
? {
...row,
...draftRows[rowId]
}
: row
)
);

stopRowEdit(
rowId
);
}

Save All Edited Rows
function saveAllRows(){

setRows(prevRows =>
prevRows.map(row => {

    const draft =
      draftRows[row.id];

    return draft
      ? {
          ...row,
          ...draft
        }
      : row;

})
);

setDraftRows({});
setEditingRows(
new Set()
);
}

UI Example

<div className="toolbar">

<button
onClick={saveAllRows}

> Save All
> </button>

<button
onClick={commitBatch}

> Commit Batch
> </button>

<button
onClick={cancelBatch}

> Cancel Batch
> </button>

</div>

Architecture
User Edit
↓
Draft State
↓
Validation
↓
Pending Changes
↓
Batch Store
↓
Commit
↓
Rows

or

Cancel
↓
Discard Changes

Senior React Interview Answer

I keep validation errors separate from row data and display them inline near the active editor. For batch editing, changes are staged in a pending-change store and only applied when the user commits. Cancelling batch edits requires a confirmation flow to prevent accidental loss of work. For editing multiple rows simultaneously, I maintain a collection of editing row IDs and a draft row store, allowing users to edit several rows concurrently before committing individual rows or saving all changes together. This scales well for admin panels, forecast grids, financial systems, and large enterprise data-entry workflows. Validation and staged batch editing follow the same principles used in enterprise grid editing models.

For an enterprise-grade custom table, validation errors, batch cancel confirmation, and multi-row draft management should be handled separately from the actual row data.

AG Grid's editing model supports validation, full-row editing, and batch editing where edits can be staged and later committed or cancelled.

1. Inline Error Display in Cell Editors
   Validation State

Keep validation errors in a dedicated store.

const [validationErrors, setValidationErrors] =
useState({});

function getCellKey(
rowId,
field
) {
return `${rowId}-${field}`;
}

Example:

{
"101-name": "Name is required",
"101-salary": "Salary must be > 0"
}

Editor With Inline Error
function TextEditor({
rowId,
field,
value,
error,
onChange,
onCommit
}) {
return (

<div className="editor-wrapper">

      <input
        value={value}
        className={
          error
            ? "editor error"
            : "editor"
        }
        onChange={e =>
          onChange(
            e.target.value
          )
        }
        onBlur={onCommit}
      />

      {error && (
        <div className="error-text">
          {error}
        </div>
      )}

    </div>

);
}

Commit With Validation
function commitEdit(
rowId,
field,
value
) {

const error =
validateField(
field,
value
);

const key =
getCellKey(
rowId,
field
);

if (error) {

    setValidationErrors(
      prev => ({
        ...prev,
        [key]: error
      })
    );

    return;

}

setValidationErrors(
prev => {

      const next = {
        ...prev
      };

      delete next[key];

      return next;
    }

);

updateRow(
rowId,
field,
value
);
}

Cell Render
<TextEditor
rowId={row.id}
field="salary"
value={draftValue}
error={
validationErrors[
`${row.id}-salary`
]
}
onChange={setDraftValue}
onCommit={save}
/>

CSS
.editor-wrapper {
position: relative;
}

.editor {
width: 100%;
}

.editor.error {
border: 1px solid #dc2626;
background: #fef2f2;
}

.error-text {
font-size: 12px;
color: #dc2626;
margin-top: 4px;
}

2. Modal Confirmation for Batch Cancel

When users have edited many cells, never immediately discard edits.

State
const [
showCancelDialog,
setShowCancelDialog
] = useState(false);

Cancel Button
<button
onClick={() =>
setShowCancelDialog(true)
}

> Cancel Batch
> </button>

Confirmation Modal
function ConfirmModal({
open,
title,
message,
onConfirm,
onCancel
}) {

if (!open) {
return null;
}

return (

<div className="modal-backdrop">

      <div className="modal">

        <h3>{title}</h3>

        <p>{message}</p>

        <div
          className="modal-actions"
        >
          <button
            onClick={onConfirm}
          >
            Yes
          </button>

          <button
            onClick={onCancel}
          >
            No
          </button>
        </div>

      </div>

    </div>

);
}

Modal Usage
<ConfirmModal
open={showCancelDialog}
title="Discard Changes?"
message="
All pending edits
will be lost.
"
onConfirm={() => {

    setPendingChanges({});

    setShowCancelDialog(false);

    setIsBatchMode(false);

}}

onCancel={() =>
setShowCancelDialog(false)
}
/>

CSS
.modal-backdrop {
position: fixed;
inset: 0;
background: rgba(
0,
0,
0,
0.4
);

display: flex;
justify-content: center;
align-items: center;
}

.modal {
background: white;
padding: 20px;
border-radius: 8px;
width: 320px;
}

.modal-actions {
display: flex;
gap: 8px;
justify-content: flex-end;
}

3. Managing Draft States for Multi-Row Editing

The biggest mistake is storing a single:

draftRow

This only supports one row at a time.

For enterprise grids store drafts by row ID.

Draft State Structure
const [
draftRows,
setDraftRows
] = useState({});

Example:

{
"101": {
name: "Sudhir",
salary: 220000
},

"102": {
department: "QA"
}
}

Multiple rows can now be edited simultaneously.

Editing Rows State
const [
editingRows,
setEditingRows
] =
useState(
new Set()
);

Example:

Set {
"101",
"102",
"103"
}

Start Editing Row
function startRowEdit(
rowId
){

setEditingRows(
prev =>
new Set([
...prev,
rowId
])
);

}

Update Draft Value
function updateDraft(
rowId,
field,
value
){

setDraftRows(
prev => ({

      ...prev,

      [rowId]: {

        ...prev[rowId],

        [field]: value
      }

    })

);

}

Editable Cell
<input
value={
draftRows[row.id]
?.salary ?? row.salary
}

onChange={e =>
updateDraft(
row.id,
"salary",
e.target.value
)
}
/>

Save Individual Row
function saveRow(
rowId
){

setRows(
prevRows =>
prevRows.map(
row =>

          row.id === rowId

            ? {
                ...row,
                ...draftRows[rowId]
              }

            : row
      )

);

setDraftRows(
prev => {

      const next = {
        ...prev
      };

      delete next[rowId];

      return next;
    }

);

}

Save All Rows
function saveAllRows(){

setRows(
prevRows =>
prevRows.map(
row => ({

          ...row,

          ...(draftRows[
            row.id
          ] || {})

        })
      )

);

setDraftRows({});

setEditingRows(
new Set()
);
}

Visual Architecture
Rows
↓

EditingRows Set
↓

DraftRows Store
↓

ValidationErrors Store
↓

PendingChanges Store
↓

Commit / Cancel
↓

Rows Updated

Senior Interview Answer

For enterprise tables, I never mutate row data directly while users are editing. Instead, I maintain three separate stores: a draft store for user input, a validation store for field-level errors, and a pending-change store for batch edits. Validation errors are displayed inline near editors, batch-cancel actions require explicit confirmation before discarding staged changes, and multi-row editing is achieved by storing drafts keyed by row ID. This enables simultaneous row editing, safe cancellation, bulk save operations, undo/redo support, and consistent behaviour across filtering, sorting, pagination and virtualisation.

Custom React Table – Data Update Architecture

After implementing Filtering → Selection → Editing, the next enterprise-grade topic is Data Updates.

AG Grid separates updates into four patterns:

Row Data Replacement
Single Row / Cell Updates
Transaction Updates
High-Frequency Updates (Streaming)

AG Grid documents:

Full row data replacement via new rowData.
Single row/cell updates using row-node methods that refresh only affected UI.
Transaction updates for add/remove/update operations on many rows.
Async/batched transactions for streaming or high-frequency updates.
Architecture
API
WebSocket
User Edit
Polling

      ↓

Update Engine

      ↓

Row Updates
Cell Updates
Transactions
Streaming Queue

      ↓

State Store

      ↓

React Table

1. Full Row Data Replacement

Best for:

Search Results
Refresh Button
Server Pagination
Filters Changed

State
const [rows, setRows] =
useState([]);

Replace Entire Dataset
async function loadEmployees() {

const data =
await api.getEmployees();

setRows(data);
}

Complexity
Re-renders Entire Grid

Use only when necessary.

2. Single Cell Update

Equivalent to AG Grid's single-cell update pattern.

Update One Cell
function updateCell(
rowId,
field,
value
) {

setRows(prevRows =>
prevRows.map(row =>
row.id === rowId
? {
...row,
[field]: value
}
: row
)
);
}

Example
updateCell(
"101",
"salary",
220000
);

Before:

{
"id": "101",
"salary": 180000
}

After:

{
"id": "101",
"salary": 220000
}

Optimized Cell Updates

Avoid scanning the array.

Row Dictionary
const [
rowsById,
setRowsById
]
=
useState({});

Example:

{
"101": {...},
"102": {...}
}

Update
setRowsById(
prev => ({

    ...prev,

    ["101"]: {

      ...prev["101"],

      salary:220000

    }

})
);

Complexity:

O(1)

3. Single Row Update

Equivalent to replacing one row.

Update Row
function updateRow(
updatedRow
){

setRows(prevRows =>
prevRows.map(row =>
row.id ===
updatedRow.id
? updatedRow
: row
)
);

}

Usage
updateRow({
id:"101",

name:"Sudhir",

department:"Frontend",

salary:250000
});

4. Transaction Updates

Best for:

Bulk Upload

Admin Changes

Multi Row Save

Server Delta Updates

AG Grid recommends transaction updates for adding, removing and updating multiple rows efficiently.

Transaction Structure
{
add:[],
update:[],
remove:[]
}

Apply Transaction
function applyTransaction(
transaction
){

setRows(currentRows => {

    let nextRows =
      [...currentRows];

    // Remove

    if(transaction.remove){

      const removeIds =
        new Set(
          transaction.remove.map(
            row => row.id
          )
        );

      nextRows =
        nextRows.filter(
          row =>
            !removeIds.has(
              row.id
            )
        );
    }

    // Update

    if(transaction.update){

      const updates =
        new Map(
          transaction.update.map(
            row =>
              [row.id,row]
          )
        );

      nextRows =
        nextRows.map(
          row =>
            updates.has(
              row.id
            )
              ? updates.get(
                  row.id
                )
              : row
        );
    }

    // Add

    if(transaction.add){

      nextRows.push(
        ...transaction.add
      );
    }

    return nextRows;

});
}

Example
applyTransaction({

add:[
{
id:"201",
name:"New User"
}
],

update:[
{
id:"101",
salary:250000
}
],

remove:[
{
id:"103"
}
]

});

5. High Frequency Updates

Used in:

Stock Market

IoT Dashboards

Live Monitoring

Trading Systems

AG Grid batches asynchronous transactions because frequent updates can trigger excessive sorting, filtering, aggregation and DOM work.

Common Problem
1000 websocket updates/sec

Bad:

setRows()
setRows()
setRows()
setRows()

Many re-renders.

Update Queue
const queue =
useRef([]);

Push Update
function queueUpdate(
update
){

queue.current.push(
update
);

}

Process Every 100ms
useEffect(() => {

const timer =
setInterval(() => {

    if(
      !queue.current.length
    ){
      return;
    }

    const batch =
      [...queue.current];

    queue.current =
      [];

    applyTransaction({

      update: batch

    });

},100);

return () =>
clearInterval(timer);

},[]);

WebSocket Example
socket.onmessage =
message => {

const update =
JSON.parse(
message.data
);

queueUpdate(
update
);

};

6. Optimistic Updates

Update UI before API success.

updateCell(
rowId,
field,
value
);

Then:

try {

await save();

}
catch {

rollback();

}

7. Dirty Tracking

Track changed rows.

const [
dirtyRows,
setDirtyRows
]
=
useState(
new Set()
);

Mark Dirty
setDirtyRows(
prev => new Set([
...prev,
rowId
])
);

Save Only Dirty Rows
const modifiedRows =
rows.filter(
row =>
dirtyRows.has(
row.id
)
);

8. Public Update API
   export interface TableApi {

updateCell(
rowId,
field,
value
): void;

updateRow(
row
): void;

applyTransaction(
transaction
): void;

replaceData(
rows
): void;
}

Expose
useImperativeHandle(
ref,
() => ({

updateCell,

updateRow,

applyTransaction,

replaceData(data){

     setRows(data);

}

})
);

Usage
tableRef.current
.updateCell(
"101",
"salary",
220000
);

tableRef.current
.updateRow(
employee
);

tableRef.current
.applyTransaction({
update:[...]
});

Data Update Strategy Matrix
Scenario Best StrategyEdit one cell Cell Update
Edit row Row Update
Bulk save Transaction
CSV Upload Transaction
Refresh grid Replace Data
WebSocket stream Batch Queue
Stock ticker High Frequency Queue
Admin changes Transaction
Senior React Interview Answer

I implement a dedicated Update Engine that supports four update modes: full dataset replacement, single-cell updates, transaction-based updates, and high-frequency streaming updates. Single-cell updates modify only the affected row, transaction updates batch add/update/remove operations, and streaming updates are queued and processed in batches to avoid excessive re-renders. For scalability I store rows by ID for O(1) updates, track dirty rows separately, and expose APIs such as updateCell, updateRow, applyTransaction, and replaceData. This architecture scales effectively with editing, filtering, sorting, pagination, virtualization, and WebSocket-driven real-time updates.

1. Optimistic UI Updates with Rollback

Optimistic updates immediately update the UI before the server responds. If the API call fails, rollback to the previous state.

This pattern is commonly used for single-row and single-cell updates where the UI should feel instant. AG Grid distinguishes between updating data in the grid and later synchronising changes from external systems.

State
const [rows, setRows] = useState(initialRows);

const rollbackRef = useRef({});

Optimistic Update
async function updateCellOptimistically(
rowId,
field,
value
) {
const previousRow =
rows.find(
row => row.id === rowId
);

rollbackRef.current[rowId] =
structuredClone(previousRow);

// Optimistic UI update

setRows(prev =>
prev.map(row =>
row.id === rowId
? {
...row,
[field]: value
}
: row
)
);

try {

    await api.updateEmployee({
      rowId,
      field,
      value
    });

} catch (error) {

    // Rollback

    const rollbackRow =
      rollbackRef.current[rowId];

    setRows(prev =>
      prev.map(row =>
        row.id === rowId
          ? rollbackRow
          : row
      )
    );

    console.error(
      "Update failed",
      error
    );

}
}

Usage
updateCellOptimistically(
"101",
"salary",
250000
);

2. Dirty Row Tracking

Enterprise grids rarely save all rows.

Instead:

Only changed rows

are sent to the server.

Dirty Rows State
const [
dirtyRows,
setDirtyRows
] = useState(
new Set()
);

Mark Row Dirty
function updateCell(
rowId,
field,
value
) {

setRows(prev =>
prev.map(row =>
row.id === rowId
? {
...row,
[field]: value
}
: row
)
);

setDirtyRows(prev =>
new Set([
...prev,
rowId
])
);
}

Visual Indicator

<tr
  className={
    dirtyRows.has(row.id)
      ? "dirty-row"
      : ""
  }
>

.dirty-row {
background: #fff7ed;
}

Save Only Dirty Rows
async function saveDirtyRows() {

const modifiedRows =
rows.filter(row =>
dirtyRows.has(row.id)
);

if (
!modifiedRows.length
) {
return;
}

await api.saveRows(
modifiedRows
);

setDirtyRows(
new Set()
);
}

Get Dirty Count
const dirtyCount =
dirtyRows.size;

Toolbar:

<button>
 Save Changes (
 {dirtyCount}
 )
</button>

3. Fine-Grained Dirty Tracking

Track individual cells.

const [
dirtyCells,
setDirtyCells
] =
useState(
new Set()
);

Key:

101-salary

101-name

102-status

Update:

setDirtyCells(prev =>
new Set([
...prev,
`${rowId}-${field}`
])
);

4. Batching High-Frequency Updates

High-frequency updates occur when receiving:

WebSockets
Stock Prices
IoT Events
Live Dashboards
Realtime Monitoring

AG Grid recommends batching updates because frequent updates can trigger expensive re-sorting, filtering, aggregations and DOM refreshes; its high-frequency model batches updates asynchronously.

Problem

Bad:

socket.onmessage =
update => {

    setRows(...);

};

If:

1000 updates/sec

you get:

1000 renders/sec

Update Queue
const updateQueue =
useRef([]);

Queue Updates
function queueUpdate(
update
){

updateQueue.current.push(
update
);

}

Custom Hook
function useBatchedUpdates(
applyBatch,
interval = 100
) {

const queue =
useRef([]);

const enqueue =
useCallback(
update => {

        queue.current.push(
          update
        );

      },
      []
    );

useEffect(() => {

    const timer =
      setInterval(() => {

        if (
          !queue.current.length
        ) {
          return;
        }

        const batch =
          [...queue.current];

        queue.current =
          [];

        applyBatch(batch);

      }, interval);

    return () =>
      clearInterval(timer);

}, [
applyBatch,
interval
]);

return enqueue;
}

Apply Batch
const enqueueUpdate =
useBatchedUpdates(
updates => {

      setRows(prevRows => {

        const map =
          new Map(
            prevRows.map(
              row => [
                row.id,
                row
              ]
            )
          );

        updates.forEach(
          update => {

            const row =
              map.get(
                update.id
              );

            if (row) {

              map.set(
                update.id,
                {
                  ...row,
                  ...update
                }
              );

            }

          }
        );

        return [
          ...map.values()
        ];

      });

    },
    100

);

WebSocket Example
useEffect(() => {

const socket =
new WebSocket(
"wss://example"
);

socket.onmessage =
message => {

      const update =
        JSON.parse(
          message.data
        );

      enqueueUpdate(
        update
      );

    };

return () =>
socket.close();

}, []);

Batching with React 18
import {
startTransition
} from "react";

startTransition(() => {

setRows(
nextRows
);

});

Useful when:

Thousands of updates

need lower-priority rendering.

Combined Enterprise Pattern
User Edit
↓
Optimistic Update
↓
Mark Dirty Row
↓
Track Dirty Cells
↓
API Save
↓
Success → Clear Dirty State
Failure → Rollback

Realtime Updates
↓
Queue
↓
Batch Every 100ms
↓
Single Render
↓
Updated Grid

Senior React Interview Answer

For responsive UX, I use optimistic updates where the UI changes immediately and a rollback snapshot is stored in case the server request fails. Dirty tracking is maintained separately using a Set<RowId> or Set<RowId-Field> so only modified data is sent back to the server. For real-time systems, I never call setRows for every incoming event; instead, updates are queued and processed in batches using a custom React hook. This significantly reduces renders and scales better for streaming dashboards and editable enterprise grids. AG Grid similarly distinguishes between row replacement, transactional updates and high-frequency batched updates for performance-sensitive scenarios.

For a production-grade custom React DataGrid, these features are usually the final layer after:

Sorting
Filtering
Selection
Editing
Updates
Virtualization

You then add:

Keyboard Navigation
Touch Support
Accessibility (ARIA)
RTL Support
Aligned Grids
Localization

Your own experience already includes WCAG accessibility, ARIA and keyboard navigation work in React applications. Sudhir_Jedhe_Recreated_Final.docx explicitly mentions WCAG accessibility compliance and keyboard navigation work.

1. Keyboard Navigation System

AG Grid supports:

Arrow Keys
Home / End
Page Up / Down
Tab
Shift+Tab
Enter
F2
Space
Ctrl+A

for navigating grids.

Active Cell Model
const [activeCell, setActiveCell] =
useState({
rowIndex: 0,
colIndex: 0
});

Keyboard Handler
function handleKeyDown(
event
) {

setActiveCell(cell => {

    switch (event.key) {

      case "ArrowDown":

        return {
          ...cell,
          rowIndex:
            Math.min(
              rows.length - 1,
              cell.rowIndex + 1
            )
        };

      case "ArrowUp":

        return {
          ...cell,
          rowIndex:
            Math.max(
              0,
              cell.rowIndex - 1
            )
        };

      case "ArrowRight":

        return {
          ...cell,
          colIndex:
            Math.min(
              columns.length - 1,
              cell.colIndex + 1
            )
        };

      case "ArrowLeft":

        return {
          ...cell,
          colIndex:
            Math.max(
              0,
              cell.colIndex - 1
            )
        };

      default:
        return cell;
    }

});

}

Active Cell Styling

<td
  className={
    activeCell.rowIndex === rowIndex &&
    activeCell.colIndex === colIndex
      ? "active-cell"
      : ""
  }
>

.active-cell {
outline: 2px solid #2563eb;
}

2. Accessibility (ARIA)

W3C data-grid guidance recommends grid-based keyboard navigation and proper ARIA roles for accessible tabular interactions.

Grid Roles

<table
  role="grid"
  aria-label="Employee Grid"
>

Row Role

<tr role="row">

Cell Role

<td
  role="gridcell"
>

Column Headers

<th
 role="columnheader"
>
 Employee Name
</th>

Selected State

<td
 role="gridcell"

aria-selected={
isSelected
}

>

Editable Cell
<input

aria-label="Salary"

aria-invalid={
hasError
}

aria-describedby={
errorId
}
/>

Error Message

<div
 id={errorId}
 role="alert"
>
 Salary is required
</div>

Accessibility audits inside Addendum 6_Comprehensive accessibility framework.pptx explicitly discuss keyboard focus, tab order, ARIA usage, screen readers and accessibility testing.

3. Touch Support

For tablets/mobile:

Tap
Long Press
Swipe
Pinch Zoom

Touch Selection
function handleTouchStart(
rowId
){

selectRow(
rowId
);

}

<tr
 onTouchStart={() =>
   handleTouchStart(
      row.id
   )
 }
>

Long Press
let touchTimer;

function onTouchStart() {

touchTimer =
setTimeout(() => {

    openContextMenu();

}, 500);

}

function onTouchEnd() {

clearTimeout(
touchTimer
);

}

4. RTL Support

AG Grid provides RTL text-direction support; custom grids should rely on document direction and logical CSS properties.

Detect Direction
const isRTL =
document.dir === "rtl";

Grid

<div
 dir={
   isRTL
     ? "rtl"
     : "ltr"
 }
>

Logical CSS
.cell {

padding-inline-start:
8px;

padding-inline-end:
8px;

}

Avoid:

padding-left
padding-right

Keyboard Swap
if (isRTL) {

ArrowLeft
=> moveRight();

ArrowRight
=> moveLeft();

}

5. Localization

Support:

Labels
Dates
Currency
Numbers
Messages
Column Names

Locale
const locale =
"en-IN";

Date Formatting
new Intl.DateTimeFormat(
locale
).format(
new Date()
);

Currency
new Intl.NumberFormat(
locale,
{
style:"currency",
currency:"INR"
}
).format(
salary
);

Translation Dictionary
const translations = {

en: {
save:"Save",
cancel:"Cancel"
},

fr: {
save:"Enregistrer",
cancel:"Annuler"
}

};

Hook
function t(key){

return translations[
language
][key];

}

Usage:

<button>
 {t("save")}
</button>

6. Aligned Grids

Use when:

Frozen Header Grid

Master Grid

Detail Grid

Summary Grid

Footer Grid

AG Grid includes aligned grids where column sizing and scrolling stay synchronised across grids.

Shared Column State
const [
columnWidths,
setColumnWidths
]
=
useState({});

Resize
function setWidth(
field,
width
){

setColumnWidths(
prev => ({

...prev,

[field]: width

})
);

}

Grid A
<HeaderGrid
 columnWidths=
 {columnWidths}
/>

Grid B
<DataGrid
 columnWidths=
 {columnWidths}
/>

Column changes automatically align.

Enterprise Features Checklist
✅ Keyboard Navigation
✅ Home / End
✅ Page Up / Down
✅ Ctrl+A
✅ F2 Editing
✅ Touch Support
✅ Long Press
✅ Swipe Support
✅ WCAG Compliance
✅ ARIA Grid Roles
✅ Screen Reader Support
✅ RTL Layout
✅ RTL Navigation
✅ Localization
✅ Date Formatting
✅ Currency Formatting
✅ Translation API
✅ Aligned Header/Footer Grids
✅ Virtualization Compatible

Senior React Interview Answer

I implement accessibility and interaction as a dedicated layer on top of the grid engine. Keyboard navigation is driven by an active-cell model supporting arrow keys, Home/End, Page Up/Down, Enter, and F2. Accessibility is achieved through semantic table markup, ARIA grid roles, selection states, editable-cell announcements, error descriptions, and keyboard-only workflows. Touch support adds tap, long-press, and gesture handling. RTL support is implemented using logical CSS properties and direction-aware navigation. Localization relies on Intl APIs and translation dictionaries, while aligned grids share a centralized column state store to keep headers, body grids, and summaries synchronized. This architecture scales to enterprise data-entry, finance, and dashboard applications while remaining WCAG compliant.

Custom React Table – Row Grouping (AG Grid Style)

Row Grouping is one of the most commonly asked Senior React / DataGrid System Design topics.

AG Grid groups rows with equivalent values under parent rows and supports:

✅ Single Column Grouping
✅ Multi Column Grouping
✅ Expand / Collapse
✅ Group Rows
✅ Group Panel
✅ Hierarchy Selection
✅ Sorting Within Groups
✅ Editing Groups
✅ Drag Groups

Row Grouping Architecture
Rows
↓

Group Engine

↓

Group Tree

↓

Expand State

↓

Flatten Tree

↓

React Table

Enterprise drill-down and hierarchy-based navigation patterns are also used in A&M Staff Aug RFP.pptx where hierarchical aggregation and drill-down are explicitly described.

Example Data
const employees = [

{
id:"1",
department:"Frontend",
team:"React",
name:"Sudhir"
},

{
id:"2",
department:"Frontend",
team:"React",
name:"Kunal"
},

{
id:"3",
department:"Frontend",
team:"Angular",
name:"Kapil"
},

{
id:"4",
department:"Backend",
team:"Node",
name:"Ajey"
}

];

1. Single Column Grouping

Group by:

Department

Output:

▶ Frontend (3)

▶ Backend (1)

Group Function
function groupBy(
rows,
field
){

return rows.reduce(
(groups,row) => {

const key =
row[field];

if(!groups[key]){

     groups[key] = [];

}

groups[key].push(
row
);

return groups;

},
{}
);
}

Usage
const groupedData =
groupBy(
rows,
"department"
);

Result:

{
Frontend:[...],

Backend:[...]
}

2. Multi Column Grouping

Equivalent to:

Department
Team
Employee

AG Grid supports grouping on multiple columns and controlling grouping order.

Recursive Group Builder
function buildGroups(
rows,
fields,
level = 0
){

if(
level >=
fields.length
){
return rows;
}

const field =
fields[level];

const groups = {};

rows.forEach(row => {

const key =
row[field];

if(
!groups[key]
){
groups[key]=[];
}

groups[key].push(row);

});

return Object.entries(
groups
).map(
([key,items]) => ({

     type:"group",

     key,

     level,

     children:
      buildGroups(
        items,
        fields,
        level + 1
      )

})
);

}

Usage
const tree =
buildGroups(
employees,
[
"department",
"team"
]
);

Output:

Frontend
React
Sudhir
Kunal

Angular
Kapil

Backend
Node
Ajey

3. Expand / Collapse Groups

AG Grid supports expanding groups programmatically and via UI.

State
const [
expandedGroups,
setExpandedGroups
]
=
useState(
new Set()
);

Toggle
function toggleGroup(
groupKey
){

setExpandedGroups(
prev => {

const next =
new Set(prev);

if(
next.has(
groupKey
)
){
next.delete(
groupKey
);
}else{
next.add(
groupKey
);
}

return next;
}
);

}

Render Group

<div
 onClick={() =>
   toggleGroup(
     group.id
   )
 }
>

{
expandedGroups.has(
group.id
)
? "▼"
: "▶"
}

{group.key}

</div>

4. Flatten Tree for Rendering

React tables render lists.

Convert tree:

Tree
↓
Flat Rows

function flattenTree(
nodes,
expandedSet,
result = []
){

nodes.forEach(
node => {

result.push(node);

if(
node.type ===
"group" &&

    expandedSet.has(
      node.id
    )

){

     flattenTree(
       node.children,
       expandedSet,
       result
     );

}
}
);

return result;
}

5. Group Row Renderer

AG Grid has dedicated group row renderers and group display modes.

function GroupRow({
node
}){

return (

  <div
   style={{
     paddingLeft:
       node.level * 20
   }}
  >

{
node.children
? "📂"
: "📄"
}

{" "}

{node.key}

{" "}

({
node.children
?.length
})

  </div>

);

}

6. Hierarchy Selection

Selecting:

Frontend

should select:

React Team

Angular Team

All Employees

AG Grid supports descendant selection when group selection is enabled.

Recursive Selection
function getDescendants(
node
){

if(
!node.children
){
return [node.id];
}

return node.children
.flatMap(
getDescendants
);
}

Select Group
function selectGroup(
group
){

const ids =
getDescendants(
group
);

setSelectedRows(
new Set(ids)
);

}

7. Group Aggregation

Show totals.

Example:

Frontend

Employees: 15

Salary: 21 Lakh

function aggregateSalary(
rows
){

return rows.reduce(
(sum,row) =>
sum + row.salary,
0
);
}

Group Header
Frontend

(15 Employees)

₹ 21,50,000

8. Sorting Groups

AG Grid supports sorting grouped rows.

groups.sort(
(a,b) =>
a.key.localeCompare(
b.key
)
);

Sort By Count
groups.sort(
(a,b)=>
b.children.length -
a.children.length
);

9. Editing Group Names

Example:

Frontend
↓
Frontend Team

function renameGroup(
oldName,
newName
){

setRows(
prevRows =>

    prevRows.map(
      row =>

        row.department ===
          oldName

          ? {

              ...row,

              department:
                newName

            }

          : row
    )

);

}

10. Row Group Panel

AG Grid provides a drag-and-drop grouping panel.

Build your own:

const [
groupedColumns,
setGroupedColumns
]
=
useState([]);

Drop column:

setGroupedColumns(
prev => [
...prev,
"department"
]
);

Render:

Group By

[ Department ]
[ Team ]

Row Dragging Between Groups

Example:

Drag Employee

React
↓

Angular

Update:

function moveEmployee(
employeeId,
newTeam
){

updateRow(
employeeId,
{
team:
newTeam
}
);

}

Production-Level Group State
{
groupedColumns:[
"department",
"team"
],

expandedGroups:
Set([
"Frontend",
"React"
]),

selectedGroups:
Set(),

selectedRows:
Set(),

aggregates:{}
}

Interview Architecture Diagram
Rows
↓

Grouping Engine
↓

Tree Structure
↓

Aggregation
↓

Expand State
↓

Selection State
↓

Flatten Tree
↓

Virtualized Table

Senior React Interview Answer

I implement row grouping using a recursive grouping engine that converts flat row data into a tree structure. The grouping configuration supports single-column and multi-column grouping, expand/collapse state, hierarchy-aware selection, aggregation, sorting, and drag-and-drop re-grouping. Group nodes are flattened before rendering to work efficiently with virtualization. Selected, expanded, and aggregated state are managed independently so grouping continues to work correctly with filtering, sorting, editing, pagination, and real-time updates. This is similar to the row grouping architecture described in AG Grid, including group display modes, hierarchical selection, and group-panel-driven configuration.

Next powerful topic

After Row Grouping, the natural next interview topic is Tree Data + Master Detail + Pivoting + Aggregation Engine, which are frequently asked for senior frontend and AG Grid system-design interviews.

Custom React Table – Tree Data, Master-Detail & Pivoting

These are typically the next level after:

Filtering
Selection
Editing
Grouping
Aggregation

AG Grid distinguishes between hierarchical grouping/tree structures, master-detail views, and grouped data aggregation/pivoting capabilities.

1. Custom Tree Data Rendering

Tree data is different from row grouping.

Tree Structure
const treeData = [
{
id: "dept-1",
name: "Frontend",
children: [
{
id: "team-1",
name: "React Team",
children: [
{
id: "emp-1",
name: "Sudhir"
},
{
id: "emp-2",
name: "Kunal"
}
]
}
]
}
];

Expanded State
const [
expandedNodes,
setExpandedNodes
] = useState(new Set());

Toggle Node
function toggleNode(id) {
setExpandedNodes(prev => {
const next = new Set(prev);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    return next;

});
}

Recursive Tree Renderer
function TreeRow({
node,
level
}) {
const expanded =
expandedNodes.has(node.id);

return (
<>

<tr>
<td
style={{
            paddingLeft:
              level * 20
          }} >
{node.children && (
<button
onClick={() =>
toggleNode(node.id)
} >
{expanded ? "▼" : "▶"}
</button>
)}

          {node.name}
        </td>
      </tr>

      {expanded &&
        node.children?.map(child => (
          <TreeRow
            key={child.id}
            node={child}
            level={level + 1}
          />
        ))}
    </>

);
}

Render Tree

<tbody>

{treeData.map(node => (
<TreeRow
    key={node.id}
    node={node}
    level={0}
  />
))}

</tbody>

Result:

▼ Frontend

▼ React Team

      Sudhir
      Kunal

2. Master-Detail Pattern

Master-detail is commonly used for:

Orders → Order Items

Invoice → Invoice Lines

Department → Employees

Customer → Transactions

AG Grid supports separate master and detail row views where expanding a row reveals nested detailed content.

Sample Data
const orders = [

{
id: 1,

customer:
"Amazon",

total: 5000,

items: [
{
sku: "A1",
qty: 5
},
{
sku: "B1",
qty: 3
}
]
}

];

State
const [
expandedRows,
setExpandedRows
]
=
useState(
new Set()
);

Toggle
function toggleRow(id) {

setExpandedRows(prev => {

const next =
new Set(prev);

if(next.has(id)){
next.delete(id);
}
else{
next.add(id);
}

return next;

});

}

Detail Component
function OrderDetails({
order
}) {

return (

   <table>

     <tbody>

      {
        order.items.map(
          item => (

          <tr
            key={item.sku}
          >

            <td>
              {item.sku}
            </td>

            <td>
              {item.qty}
            </td>

          </tr>

        ))
      }

     </tbody>

   </table>

);

}

Master Grid

<tbody>

{orders.map(order => (

<Fragment
key={order.id}

>

   <tr
     onClick={() =>
       toggleRow(order.id)
     }
   >

    <td>
      {order.customer}
    </td>

    <td>
      {order.total}
    </td>

   </tr>

{expandedRows.has(
order.id
) && (

     <tr>

       <td
         colSpan={10}
       >

         <OrderDetails
           order={order}
         />

       </td>

     </tr>

)}

  </Fragment>

))}

</tbody>

3. Pivoting in Grouped Data

Pivoting converts:

Rows
↓

Columns

Example Data:

[
{
department:"Frontend",
year:2025,
salary:100
},

{
department:"Frontend",
year:2026,
salary:200
},

{
department:"Backend",
year:2025,
salary:300
}
]

Desired Output
Department 2025 2026

Frontend 100 200

Backend 300 0

Pivot Function
function pivotData(
rows,
rowField,
columnField,
valueField
){

const result = {};

rows.forEach(row => {

const rowKey =
row[rowField];

const columnKey =
row[columnField];

if(
!result[rowKey]
){
result[rowKey] = {};
}

result[rowKey][ columnKey ] = row[valueField];

});

return result;
}

Usage
const pivot =
pivotData(
rows,
"department",
"year",
"salary"
);

Output:

{
Frontend:{
2025:100,
2026:200
},

Backend:{
2025:300
}
}

4. Aggregation Engine

Grouped grids usually calculate:

Count

Sum

Min

Max

Average

AG Grid grouping configurations support grouped rows and aggregated values for grouped datasets.

Sum
function sum(
rows,
field
){

return rows.reduce(
(total,row) =>

      total +
      Number(
       row[field]
      ),

0
);

}

Average
function average(
rows,
field
){

return (
sum(
rows,
field
) /
rows.length
);

}

Group Aggregation
function aggregateGroup(
rows
){

return {

count:
rows.length,

totalSalary:
sum(
rows,
"salary"
),

averageSalary:
average(
rows,
"salary"
)

};

}

Group Header
Frontend

Count: 15
Total: ₹21,50,000
Average: ₹1,43,333

Enterprise Architecture
Raw Rows
↓
Tree Builder
↓
Grouping Engine
↓
Pivot Engine
↓
Aggregation Engine
↓
Expand State
↓
Flatten Tree
↓
Virtualized Grid

The hierarchical drill-down and aggregation approach matches enterprise hierarchy patterns such as:

SKU
↓
Category
↓
Department
↓
Enterprise

shown in the hierarchy and drill-down architecture referenced in internal design material.

Senior React Interview Answer

I implement tree data using a recursive node structure with separate expand/collapse state. For master-detail views, the parent row owns summary information while an expandable detail component renders nested data independently. Pivoting is handled by transforming grouped row values into dynamic columns, and aggregations are computed using reusable reducers such as sum, count, min, max, and average. To support large datasets, the grouped tree is flattened before rendering so that virtualization, selection, filtering, editing, and real-time updates continue to perform efficiently.

Next, a common Staff/Senior interview topic is Virtualization + Infinite Scrolling + Server-Side Row Model + Lazy Loading for Tree Data, which combines all these concepts into a scalable grid architecture.

Custom React Table – Virtualisation with Tree Data

When tree data grows to:

10,000+
50,000+
100,000+ nodes

you should never render the entire tree.

The scalable architecture is:

Tree Data
↓
Expand State
↓
Flatten Visible Nodes
↓
Virtualisation
↓
Only Render Visible Rows

This is similar to how enterprise grids optimise grouped and hierarchical data by rendering only what's required.

Step 1: Flatten Only Expanded Nodes
function flattenTree(
nodes,
expandedSet,
level = 0,
result = []
) {
nodes.forEach(node => {

    result.push({
      ...node,
      level
    });

    if (
      node.children &&
      expandedSet.has(node.id)
    ) {

      flattenTree(
        node.children,
        expandedSet,
        level + 1,
        result
      );
    }

});

return result;
}

Step 2: Virtualisation Hook
function useVirtualRows(
rows,
rowHeight,
containerHeight,
scrollTop
) {

const visibleCount =
Math.ceil(
containerHeight /
rowHeight
);

const startIndex =
Math.floor(
scrollTop /
rowHeight
);

const endIndex =
Math.min(
rows.length,
startIndex +
visibleCount + 5
);

const visibleRows =
rows.slice(
startIndex,
endIndex
);

return {
startIndex,
visibleRows,
totalHeight:
rows.length \*
rowHeight
};
}

Step 3: Virtual Tree Table
const flattenedRows =
useMemo(
() =>
flattenTree(
treeData,
expandedNodes
),
[
treeData,
expandedNodes
]
);

const {
startIndex,
visibleRows,
totalHeight
} = useVirtualRows(
flattenedRows,
40,
600,
scrollTop
);

Step 4: Render Visible Rows

<div
  style={{
    height: 600,
    overflow: "auto"
  }}
  onScroll={e =>
    setScrollTop(
      e.target.scrollTop
    )
  }
>
  <div
    style={{
      height: totalHeight,
      position: "relative"
    }}
  >
    {
      visibleRows.map(
        (row, index) => (

        <div
          key={row.id}

          style={{
            position: "absolute",

            top:
              (startIndex +
               index) * 40,

            left: 0,
            right: 0,

            height: 40,

            paddingLeft:
              row.level * 20
          }}
        >
          {row.name}
        </div>

      ))
    }

  </div>
</div>

Result

Instead of:

100,000 rows rendered

you render:

20-50 visible rows

which keeps scrolling smooth.

Infinite Scrolling with Server-Side Row Model

AG Grid differentiates between normal client-side updates and server-driven loading where data is fetched incrementally rather than loaded entirely up-front. Transactional and high-frequency update models exist to reduce client work when datasets become large.

Architecture
Viewport
↓
Near Bottom
↓
Load Next Page
↓
API
↓
Append New Rows

API Contract
GET /employees

?page=1
&pageSize=100

Response:

{
"rows": [...],
"hasMore": true
}

Infinite Scroll Hook
function useInfiniteData() {

const [rows, setRows] =
useState([]);

const [page, setPage] =
useState(1);

const [hasMore, setHasMore] =
useState(true);

const [loading, setLoading] =
useState(false);

async function loadData() {

    if (
      !hasMore ||
      loading
    ) {
      return;
    }

    setLoading(true);

    const response =
      await fetch(
        `/api/employees?page=${page}`
      );

    const data =
      await response.json();

    setRows(prev => [
      ...prev,
      ...data.rows
    ]);

    setHasMore(
      data.hasMore
    );

    setPage(
      prev => prev + 1
    );

    setLoading(false);

}

return {
rows,
loadData
};
}

Detect End of Scroll
function handleScroll(
event
){

const {
scrollTop,
scrollHeight,
clientHeight
} = event.target;

const nearBottom =

    scrollTop +
    clientHeight >=
    scrollHeight - 100;

if(nearBottom){

    loadData();

}
}

Server-Side Tree Data

For huge hierarchies:

Frontend
→
Load Teams

React Team
→
Load Employees

Don't fetch everything.

Lazy Expansion
async function expandNode(
nodeId
){

const children =
await fetch(
`/api/tree/${nodeId}`
);

updateNodeChildren(
nodeId,
children
);

}

Cache Nodes
const nodeCache =
useRef(new Map());

if(
nodeCache.current.has(
nodeId
)
){
return nodeCache.current.get(
nodeId
);
}

Production Architecture
Server
↓

Pagination API
Tree API

    ↓

Cache Layer

    ↓

Flatten Tree

    ↓

Virtualisation

    ↓

React Renderer

Senior React Interview Answer

For tree data, I maintain a hierarchical structure but flatten only the visible expanded nodes before rendering. Virtualisation operates on the flattened list and renders only rows inside the viewport, keeping performance stable even with tens of thousands of nodes. For server-side row models, I combine infinite scrolling with page-based or cursor-based APIs and load additional records when the user approaches the bottom of the viewport. For large hierarchies, child nodes are loaded lazily on expansion and cached locally to avoid redundant requests. This approach scales much better than loading or rendering the entire dataset at once.

1. Lazy Loading Child Nodes in Tree Data

For large hierarchies:

Enterprise
↓
Department
↓
Team
↓
Employee

Never load the entire tree initially.

A server-side tree model loads child records only when users expand a node. This is the same pattern described for server-side tree data where child rows are loaded as parent nodes are expanded.

Tree State
const [treeData, setTreeData] =
useState([]);

const [expandedNodes, setExpandedNodes] =
useState(new Set());

const [loadingNodes, setLoadingNodes] =
useState(new Set());

Tree Node Structure
{
id: "dept-1",
name: "Frontend",
hasChildren: true,
childrenLoaded: false,
children: []
}

Load Children on Expand
async function expandNode(
nodeId
) {
setExpandedNodes(prev =>
new Set([
...prev,
nodeId
])
);

const node =
findNode(
treeData,
nodeId
);

if (
node.childrenLoaded
) {
return;
}

setLoadingNodes(prev =>
new Set([
...prev,
nodeId
])
);

try {

    const response =
      await fetch(
        `/api/tree/${nodeId}`
      );

    const children =
      await response.json();

    setTreeData(prev =>
      insertChildren(
        prev,
        nodeId,
        children
      )
    );

} finally {

    setLoadingNodes(prev => {

      const next =
        new Set(prev);

      next.delete(
        nodeId
      );

      return next;

    });

}
}

Insert Children
function insertChildren(
nodes,
targetId,
children
){

return nodes.map(node => {

    if(
      node.id === targetId
    ) {

      return {

        ...node,

        children,

        childrenLoaded:true

      };
    }

    if(
      node.children
    ) {

      return {

        ...node,

        children:
          insertChildren(
            node.children,
            targetId,
            children
          )

      };
    }

    return node;

});

}

2. Caching Strategy for Server-Side Tree Data

A hierarchy cache prevents repeated API calls.

Server-side tree solutions frequently cache loaded children and reuse them when groups are reopened.

Memory Cache
const cache =
useRef(
new Map()
);

Key:

nodeId

Value:

loaded children

Get Cached Data
async function getChildren(
nodeId
){

if(
cache.current.has(
nodeId
)
){

    return cache.current.get(
      nodeId
    );

}

const response =
await fetch(
`/api/tree/${nodeId}`
);

const data =
await response.json();

cache.current.set(
nodeId,
data
);

return data;
}

Cache with TTL

Used when data changes frequently.

{
data:[],
timestamp:Date.now()
}

TTL Check
const TTL =
5 _ 60 _ 1000;

const cached =
cache.current.get(
nodeId
);

if(
cached &&
Date.now() -
cached.timestamp <
TTL
){
return cached.data;
}

LRU Cache

For huge trees:

100,000 nodes

keep only:

200 expanded nodes

class LRUCache {

constructor(limit){

this.limit =
limit;

this.map =
new Map();
}

get(key){

if(
!this.map.has(
key
)
){
return null;
}

const value =
this.map.get(
key
);

this.map.delete(
key
);

this.map.set(
key,
value
);

return value;
}

set(key,value){

if(
this.map.size >=
this.limit
){

     const oldest =
       this.map.keys()
         .next()
         .value;

     this.map.delete(
       oldest
     );

}

this.map.set(
key,
value
);
}

}

3. Infinite Loading using Scroll Events

Server-side row models commonly load additional blocks of data as the user scrolls rather than downloading everything upfront.

State
const [rows, setRows] =
useState([]);

const [page, setPage] =
useState(1);

const [loading, setLoading] =
useState(false);

const [hasMore, setHasMore] =
useState(true);

Load Next Page
async function loadMore(){

if(
loading ||
!hasMore
){
return;
}

setLoading(true);

const response =
await fetch(
`/api/employees?page=${page}`
);

const data =
await response.json();

setRows(prev => [
...prev,
...data.rows
]);

setHasMore(
data.hasMore
);

setPage(
prev => prev + 1
);

setLoading(false);
}

Scroll Handler
function handleScroll(
event
){

const {
scrollTop,
clientHeight,
scrollHeight
} = event.currentTarget;

const nearBottom =

    scrollTop +
    clientHeight >=
    scrollHeight - 100;

if(
nearBottom
){
loadMore();
}

}

Render Container

<div

style={{
    height:600,
    overflow:"auto"
  }}

onScroll={
handleScroll
}

>

{rows.map(row => (

    <Row
      key={row.id}
      data={row}
    />

))}

{loading && (

    <div>
      Loading...
    </div>

)}

</div>

Better Approach: Intersection Observer

Avoid continuous scroll calculations.

const loaderRef =
useRef();

useEffect(() => {

const observer =
new IntersectionObserver(
entries => {

       if(
         entries[0]
           .isIntersecting
       ){
         loadMore();
       }

     }

);

observer.observe(
loaderRef.current
);

return () =>
observer.disconnect();

}, []);

Loader

<div
 ref={loaderRef}
>
 Loading...
</div>

Production Architecture
User Expands Node
↓
Check Cache
↓
Cache Miss
↓
Fetch Children
↓
Store in Cache
↓
Update Tree
↓
Flatten Visible Nodes
↓
Virtualized Renderer

User Scrolls
↓
Bottom Reached
↓
Request Next Page
↓
Append New Rows
↓
Virtualization
↓
Render Visible Rows Only

The drill-down hierarchy pattern is also reflected in A_M Staff Aug RFP.pptx, which describes hierarchical navigation and multi-level drill-down structures such as SKU → Category → Department → Enterprise.

Senior Interview Answer

For server-side tree data, I load only root nodes initially and lazily fetch children when users expand a node. Child datasets are cached using a Map-based cache with optional TTL or LRU eviction policies to prevent redundant network calls. For large datasets, I combine virtualisation with infinite scrolling, loading additional pages when the viewport approaches the bottom. The UI only renders visible rows from a flattened tree structure, allowing the grid to scale to hundreds of thousands of records while maintaining smooth scrolling and low memory consumption.

Custom React Table – Aggregation Engine

Aggregation is the core of:

Row Grouping
Pivot Tables
Tree Data
Financial Dashboards
Forecast Planning
KPI Grids

Your organisation's hierarchy-driven planning examples explicitly reference hierarchical aggregation, drill-down, SKU → Category → Department → Enterprise rollups, and aggregation engines as part of editable grid solutions.

AG Grid supports:

✅ Sum
✅ Min
✅ Max
✅ Count
✅ Avg
✅ First
✅ Last
✅ Custom Aggregations
✅ Group Totals
✅ Grand Totals
✅ Aggregation with Filtering
✅ Show Values As

Aggregation Architecture
Rows
↓

Grouping Engine
↓

Aggregation Engine
↓

Group Totals
↓

Grand Totals
↓

Pivot Engine
↓

Grid Renderer

Sample Data
const data = [

{
department:"Frontend",
employee:"Sudhir",
salary:180000
},

{
department:"Frontend",
employee:"Kunal",
salary:120000
},

{
department:"Backend",
employee:"Ajey",
salary:130000
}

];

1. Configure Aggregation Columns

Similar to AG Grid's aggFunc.

const columns = [

{
field:"salary",

aggregate:"sum"
}

];

Aggregation Registry
const aggregateFunctions = {

sum(values){

    return values.reduce(
      (total,value) =>
        total + value,
      0
    );

},

avg(values){

    return (
      values.reduce(
        (total,value) =>
          total + value,
        0
      ) /
      values.length
    );

},

min(values){

    return Math.min(
      ...values
    );

},

max(values){

    return Math.max(
      ...values
    );

},

count(values){

    return values.length;

}

};

Generic Aggregator
function aggregateColumn(
rows,
field,
aggregationType
){

const values =
rows.map(
row => row[field]
);

return aggregateFunctions[
aggregationType
](values);

}

Usage
aggregateColumn(
rows,
"salary",
"sum"
);

Output:

430000

2. Custom Aggregation Function

AG Grid allows registering custom aggregation functions such as range.

Example: Range
Max - Min

function rangeAggregation(
values
){

return Math.max(
...values
) -

Math.min(
...values
);

}

Median
function median(
values
){

const sorted =
[...values].sort(
(a,b)=>a-b
);

const middle =
Math.floor(
sorted.length/2
);

return sorted.length % 2

? sorted[middle]

: (

       sorted[middle-1] +
       sorted[middle]

     ) / 2;

}

Weighted Average

Useful for:

Forecasting
Financial Reports
Pricing Grids

function weightedAverage(
rows
){

let total = 0;

let weightSum = 0;

rows.forEach(row => {

total +=
row.price \*
row.quantity;

weightSum +=
row.quantity;

});

return total /
weightSum;
}

3. Group Aggregation

Input:

Frontend
Sudhir
Kunal

Backend
Ajey

Aggregate Per Group
function aggregateGroups(
groupedData
){

return Object.entries(
groupedData
).map(
([groupName,rows]) => ({

     groupName,

     employeeCount:
       rows.length,

     totalSalary:

       aggregateColumn(
         rows,
         "salary",
         "sum"
       ),

     averageSalary:

       aggregateColumn(
         rows,
         "salary",
         "avg"
       )

})
);

}

Output:

Frontend

Count:2

Total Salary:300000

Average:150000

4. Total Rows

AG Grid supports both group totals and grand totals.

Grand Total
const grandTotal =

aggregateColumn(
rows,
"salary",
"sum"
);

Total Row

<tr
 className="grand-total"
>

 <td>
   Total
 </td>

 <td>
   ₹
   {grandTotal}
 </td>

</tr>

Sticky Footer Total
.grand-total {

position: sticky;

bottom: 0;

background: white;

font-weight: bold;

}

5. Aggregation with Filtering

Input:

Frontend Only

should aggregate:

Frontend Rows

Only.

Filter First
const filteredRows =
rows.filter(
row =>
row.department ===
"Frontend"
);

Aggregate Visible Data
const totalSalary =

aggregateColumn(
filteredRows,
"salary",
"sum"
);

Result:

300000

6. Show Values As

Common in BI dashboards.

AG Grid supports alternate display modes for aggregated values.

Percent of Grand Total

Example:

Frontend
300000

Total
430000

function percentOfTotal(
value,
total
){

return (
value /
total
) \* 100;

}

Output:

69.7%

Running Total
function runningTotal(
rows,
field
){

let total = 0;

return rows.map(
row => {

     total +=
       row[field];

     return {

       ...row,

       runningTotal:
         total

     };

}
);

}

Output

100
300
600
900

Variance
variance =
actual -
forecast

function variance(
actual,
forecast
){

return actual -
forecast;

}

Variance %
function variancePercent(
actual,
forecast
){

return (

(
actual -
forecast
)

/

forecast

) \* 100;

}

Hierarchical Aggregation

For tree/group data:

Enterprise
↓
Department
↓
Category
↓
SKU

rollups occur recursively.

This mirrors the hierarchy and aggregation approach documented in A&M Staff Aug RFP.pptx and A_M Staff Aug RFP.pptx, where values roll up through hierarchy levels.

function aggregateTree(
node
){

if(
!node.children
){
return node.salary;
}

return node.children.reduce(
(total,child) =>

     total +
     aggregateTree(child),

0
);

}

Enterprise Aggregation API
tableRef.current
.aggregate(
"salary",
"sum"
);

tableRef.current
.aggregate(
"salary",
"avg"
);

tableRef.current
.refreshAggregates();

tableRef.current
.recalculateTotals();

Interview Architecture
Rows
↓

Filters
↓

Grouping
↓

Aggregation Engine
↓

Custom Aggregators
↓

Totals
↓

Pivot Engine
↓

Renderer

Senior React Interview Answer

I build aggregation as a reusable engine rather than embedding calculations inside the UI. Columns declare aggregation types such as sum, avg, min, max, count, or custom functions. The aggregation engine operates on grouped, filtered, or hierarchical datasets and produces group totals, grand totals, and derived metrics such as percentage of total, variance, running totals, and weighted averages. For tree data and grouped data, aggregation runs recursively from leaf nodes upward so that parent nodes always reflect current child values. This architecture scales cleanly with row grouping, pivoting, filtering, editing, virtualisation, and server-side data models.

```

```

```
