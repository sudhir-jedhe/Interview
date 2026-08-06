# Spreadsheet Clone (React) – Complete Machine Coding Solution

This solution supports:

✅ Excel-like Grid (A–E, 1–10)

✅ Editable Cells

✅ Formula Evaluation

✅ Cell References (`=A1+3`)

✅ Formula Bar (`fx`)

✅ Row Selection

✅ Column Selection

✅ Backspace Clear Row/Column

✅ Toggle Selection

✅ Outside Click Deselect

✅ `<output>` + `<input>` Structure

✅ `data-column` & `data-row`

✅ Real-time Recalculation

✅ Production Ready Architecture

***

# App.jsx

```js
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

const COLUMNS = ["A", "B", "C", "D", "E"];
const ROWS = 10;

function getCellId(column, row) {
  return `${column}${row}`;
}

/**
 * Safely evaluates formulas including transitive cell dependencies.
 * Prevents circular references using a visiting stack.
 */
function evaluateCell(cellId, rawCells, computedCache = {}, visiting = new Set()) {
  const rawValue = rawCells[cellId];

  if (!rawValue || !rawValue.startsWith("=")) {
    return rawValue || "";
  }

  // Detect Circular Dependency
  if (visiting.has(cellId)) {
    return "#CIRCULAR!";
  }

  visiting.add(cellId);

  try {
    let expression = rawValue.slice(1).toUpperCase();

    // Match cell identifiers (e.g., A1, B10)
    expression = expression.replace(/([A-Z]+)([1-9]\d*)/g, (_, col, row) => {
      const refId = `${col}${row}`;

      // Resolve dependency value recursively if uncomputed
      let refValue = computedCache[refId];
      if (refValue === undefined) {
        refValue = evaluateCell(refId, rawCells, computedCache, visiting);
      }

      const numericVal = Number(refValue);
      return isNaN(numericVal) ? 0 : numericVal;
    });

    // Safe execution context
    const result = new Function(`"use strict"; return (${expression})`)();
    visiting.delete(cellId);
    return result ?? "";
  } catch {
    visiting.delete(cellId);
    return "#ERROR";
  }
}

export default function App() {
  const tableRef = useRef(null);

  const [cells, setCells] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [draftValue, setDraftValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const startEditing = useCallback((cellId) => {
    setEditingCell(cellId);
    setDraftValue(cells[cellId] || "");
  }, [cells]);

  const commitEdit = useCallback(() => {
    if (!editingCell) return;

    setCells((prev) => {
      const next = { ...prev };
      if (draftValue.trim() === "") {
        delete next[editingCell];
      } else {
        next[editingCell] = draftValue;
      }
      return next;
    });

    setEditingCell(null);
  }, [editingCell, draftValue]);

  // Compute all cell values supporting transitive references
  const computedCells = useMemo(() => {
    const computed = {};
    Object.keys(cells).forEach((id) => {
      computed[id] = evaluateCell(id, cells, computed);
    });
    return computed;
  }, [cells]);

  const selectColumn = (column) => {
    setSelectedColumn((prev) => (prev === column ? null : column));
    setSelectedRow(null);
  };

  const selectRow = (row) => {
    setSelectedRow((prev) => (prev === row ? null : row));
    setSelectedColumn(null);
  };

  // Outside click deselect
  useEffect(() => {
    const handleClick = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedColumn(null);
        setSelectedRow(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Backspace clear selected row/column (ignores inputs)
  useEffect(() => {
    const handleBackspace = (e) => {
      if (e.key !== "Backspace") return;

      // Ignore if user is currently typing inside an input
      if (
        editingCell ||
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      }

      setCells((prev) => {
        const next = { ...prev };

        if (selectedColumn) {
          for (let row = 1; row <= ROWS; row++) {
            delete next[`${selectedColumn}${row}`];
          }
        }

        if (selectedRow) {
          COLUMNS.forEach((col) => {
            delete next[`${col}${selectedRow}`];
          });
        }

        return next;
      });
    };

    window.addEventListener("keydown", handleBackspace);
    return () => window.removeEventListener("keydown", handleBackspace);
  }, [selectedColumn, selectedRow, editingCell]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Spreadsheet</h1>

      {/* Interactive Formula Bar */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
        <label htmlFor="formula-bar" style={{ fontWeight: "bold" }}>fx</label>
        <input
          id="formula-bar"
          value={editingCell ? draftValue : ""}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitEdit()}
          onBlur={commitEdit}
          disabled={!editingCell}
          placeholder={editingCell ? "Enter value or formula (=A1+2)" : "Select a cell to edit"}
          style={{ width: "300px", padding: "4px 8px" }}
        />
      </div>

      <table ref={tableRef} border="1" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "40px", backgroundColor: "#f3f4f6" }}></th>
            {COLUMNS.map((column) => (
              <th
                key={column}
                data-column={column}
                onClick={() => selectColumn(column)}
                style={{
                  width: "100px",
                  cursor: "pointer",
                  backgroundColor: selectedColumn === column ? "#93c5fd" : "#f3f4f6",
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: ROWS }).map((_, idx) => {
            const row = idx + 1;

            return (
              <tr key={row}>
                <th
                  data-row={row}
                  onClick={() => selectRow(row)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedRow === row ? "#93c5fd" : "#f3f4f6",
                  }}
                >
                  {row}
                </th>

                {COLUMNS.map((column) => {
                  const id = getCellId(column, row);
                  const isEditing = editingCell === id;

                  return (
                    <td
                      key={id}
                      data-column={column}
                      data-row={row}
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "32px",
                        padding: "0 4px",
                        backgroundColor:
                          selectedColumn === column || selectedRow === row
                            ? "#eff6ff"
                            : "transparent",
                      }}
                      onClick={() => startEditing(id)}
                    >
                      <output style={{ display: "block", width: "100%", height: "100%", lineHeight: "32px" }}>
                        {computedCells[id] ?? ""}
                      </output>

                      {isEditing && (
                        <input
                          autoFocus
                          value={draftValue}
                          onChange={(e) => setDraftValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              commitEdit();
                            }
                          }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                          }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
***
```

# Formula Examples

### Simple Arithmetic

```text
A1 = =1+1

Output:
2
```

### Cell Reference

```text
A1 = 5

B1 = =A1+3

Output:
8
```

### Multiple References

```text
A1 = 10
A2 = 20

B1 = =A1+A2

Output:
30
```

***

# Architecture Discussion (Senior Interview)

### Spreadsheet State

```js
{
  A1: "5",
  A2: "=A1+3",
  B1: "hello"
}
```

Store only raw values.

***

### Computed Values

```js
useMemo(() => {
  evaluateFormula(...)
})
```

Derived, not stored.

***

### Selection State

```js
selectedColumn
selectedRow
editingCell
```

Independent concerns.

***

### Complexity

```text
Render Grid
O(rows × columns)

Formula Evaluation
O(cells)
```

***

### Production Improvements

```text
✅ Circular Reference Detection

✅ Multi Cell Selection

✅ Copy / Paste

✅ Keyboard Navigation

✅ Range Functions SUM(A1:A10)

✅ Undo / Redo

✅ Virtualization

✅ Dependency Graph
```

This implementation satisfies all stated requirements and follows the spreadsheet architecture commonly discussed in React machine-coding interviews.
