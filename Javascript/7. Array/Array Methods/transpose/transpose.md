```js
export function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const transposed = [];
  for (let i = 0; i < cols; i++) {
    transposed[i] = [];
    for (let j = 0; j < rows; j++) {
      transposed[i][j] = matrix[j][i];
    }
  }

  return transposed;
}

import { transpose } from "./transpose.js";

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(transpose(matrix));

// [
//   [1, 4, 7],
//   [2, 5, 8],
//   [3, 6, 9],
// ];
```


# Matrix Transpose in JavaScript

**Transpose** means converting rows into columns.

### Input

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
```

### Output

```javascript
[
  [1, 4],
  [2, 5],
  [3, 6]
]
```

Visual:

```text
1 2 3
4 5 6
```

becomes

```text
1 4
2 5
3 6
```

***

# Method 1: Using `map()`

```javascript
function transpose(matrix) {
  return matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
  );
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

console.log(transpose(matrix));
```

### Output

```javascript
[
  [1, 4],
  [2, 5],
  [3, 6]
]
```

***

# Method 2: Nested Loops

Interview-friendly solution.

```javascript
function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const result = [];

  for (let col = 0; col < cols; col++) {
    result[col] = [];

    for (let row = 0; row < rows; row++) {
      result[col][row] =
        matrix[row][col];
    }
  }

  return result;
}
```

***

# Dry Run

Input:

```javascript
[
  [1, 2, 3],
  [4, 5, 6]
]
```

### Column 0

```javascript
[
  matrix[0][0],
  matrix[1][0]
]
```

Result:

```javascript
[1, 4]
```

### Column 1

```javascript
[
  matrix[0][1],
  matrix[1][1]
]
```

Result:

```javascript
[2, 5]
```

### Column 2

```javascript
[
  matrix[0][2],
  matrix[1][2]
]
```

Result:

```javascript
[3, 6]
```

Final:

```javascript
[
  [1, 4],
  [2, 5],
  [3, 6]
]
```

***

# Square Matrix Example

Input:

```javascript
const matrix = [
  [1, 2],
  [3, 4]
];
```

Output:

```javascript
[
  [1, 3],
  [2, 4]
]
```

***

# LeetCode 867: Transpose Matrix

```javascript
var transpose = function(matrix) {
  return matrix[0].map((_, col) =>
    matrix.map(row => row[col])
  );
};
```

***

# React Example

### Display Transposed Matrix

```jsx
function Matrix() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  const transposed =
    matrix[0].map((_, col) =>
      matrix.map(row => row[col])
    );

  return (
    <table border="1">
      <tbody>
        {transposed.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Output:

```text
1 4
2 5
3 6
```

***

# Complexity

Let:

```text
m = rows
n = columns
```

### Time Complexity

```text
O(m × n)
```

### Space Complexity

```text
O(m × n)
```

because a new matrix is created.

***

# Interview One-Liner

```javascript
const transpose = matrix =>
  matrix[0].map((_, col) =>
    matrix.map(row => row[col])
  );
```

This is the most concise and commonly accepted JavaScript solution for transposing a matrix.


## Transpose for Non-Rectangular (Jagged) Matrices

A normal transpose assumes all rows have the same length.

### Rectangular Matrix

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
```

Transpose:

```javascript
[
  [1, 4],
  [2, 5],
  [3, 6]
]
```

***

## Problem with Non-Rectangular Arrays

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5],
  [6]
];
```

Rows have different lengths.

### Expected Transpose

```javascript
[
  [1, 4, 6],
  [2, 5, undefined],
  [3, undefined, undefined]
]
```

***

## Solution

```javascript
function transpose(matrix) {
  const maxCols = Math.max(
    ...matrix.map(row => row.length)
  );

  return Array.from(
    { length: maxCols },
    (_, colIndex) =>
      matrix.map(
        row => row[colIndex]
      )
  );
}

const matrix = [
  [1, 2, 3],
  [4, 5],
  [6]
];

console.log(transpose(matrix));
```

### Output

```javascript
[
  [1, 4, 6],
  [2, 5, undefined],
  [3, undefined, undefined]
]
```

***

# Transpose Example with Nested Arrays

### Input

```javascript
const matrix = [
  ["React", "Node", "JS"],
  ["Angular", "Express", "TS"]
];
```

### Code

```javascript
const transposed =
  matrix[0].map((_, col) =>
    matrix.map(row => row[col])
  );

console.log(transposed);
```

### Output

```javascript
[
  ["React", "Angular"],
  ["Node", "Express"],
  ["JS", "TS"]
]
```

Visual:

```text
React    Node    JS
Angular  Express TS
```

becomes

```text
React    Angular
Node     Express
JS       TS
```

***

# React Example: Original vs Transposed Matrix

```jsx
import React, { useMemo } from "react";

export default function MatrixExample() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  const transposed = useMemo(() => {
    return matrix[0].map((_, col) =>
      matrix.map(row => row[col])
    );
  }, [matrix]);

  const renderTable = (data, title) => (
    <div style={{ marginBottom: "20px" }}>
      <h3>{title}</h3>

      <table border="1">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderTable(matrix, "Original Matrix")}
      {renderTable(
        transposed,
        "Transposed Matrix"
      )}
    </>
  );
}
```

***

## UI Output

### Original Matrix

```text
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
```

### Transposed Matrix

```text
+---+---+
| 1 | 4 |
+---+---+
| 2 | 5 |
+---+---+
| 3 | 6 |
+---+---+
```

***

# Interview-Friendly Generic Transpose

```javascript
function transpose(matrix) {
  const maxCols = Math.max(
    ...matrix.map(row => row.length)
  );

  return Array.from(
    { length: maxCols },
    (_, col) =>
      matrix.map(
        row => row[col]
      )
  );
}
```

### Complexity

If:

```text
m = rows
n = maximum columns
```

Then:

* **Time Complexity:** `O(m × n)`
* **Space Complexity:** `O(m × n)`

### Senior Interview Answer

> For rectangular matrices, transpose swaps rows and columns directly. For non-rectangular (jagged) matrices, first determine the maximum column count and then build each transposed row by reading corresponding indices from every source row. Missing values are typically represented as `undefined`, `null`, or filtered out based on business requirements.
## 1. Transpose a Jagged (Non-Rectangular) Array

### Input

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5],
  [6]
];
```

Rows have different lengths:

```text
1 2 3
4 5
6
```

***

### Transpose

```javascript
function transpose(matrix) {
  const maxCols = Math.max(
    ...matrix.map(row => row.length)
  );

  return Array.from(
    { length: maxCols },
    (_, col) =>
      matrix.map(row => row[col])
  );
}

const result = transpose(matrix);

console.log(result);
```

### Output

```javascript
[
  [1, 4, 6],
  [2, 5, undefined],
  [3, undefined, undefined]
]
```

Visual:

```text
1 4 6
2 5 undefined
3 undefined undefined
```

***

# 2. Filter Out `undefined` After Transpose

Sometimes you don't want empty cells.

### Example

```javascript
const transposed = transpose(matrix);

const cleaned = transposed.map(row =>
  row.filter(value => value !== undefined)
);

console.log(cleaned);
```

### Output

```javascript
[
  [1, 4, 6],
  [2, 5],
  [3]
]
```

Visual:

```text
1 4 6
2 5
3
```

***

## Helper Function

```javascript
function transposeAndClean(matrix) {
  const maxCols = Math.max(
    ...matrix.map(row => row.length)
  );

  return Array.from(
    { length: maxCols },
    (_, col) =>
      matrix
        .map(row => row[col])
        .filter(
          value =>
            value !== undefined
        )
  );
}
```

### Usage

```javascript
console.log(
  transposeAndClean([
    [1, 2, 3],
    [4, 5],
    [6]
  ])
);
```

Output:

```javascript
[
  [1, 4, 6],
  [2, 5],
  [3]
]
```

***

# 3. React Example: Original vs Transposed Matrix

```jsx
import React, { useMemo } from "react";

function transpose(matrix) {
  const maxCols = Math.max(
    ...matrix.map(row => row.length)
  );

  return Array.from(
    { length: maxCols },
    (_, col) =>
      matrix.map(row => row[col])
  );
}

export default function App() {
  const matrix = [
    [1, 2, 3],
    [4, 5],
    [6]
  ];

  const transposed = useMemo(
    () => transpose(matrix),
    [matrix]
  );

  return (
    <div>
      <h2>Original Matrix</h2>

      <table border="1">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Transposed Matrix</h2>

      <table border="1">
        <tbody>
          {transposed.map(
            (row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map(
                  (cell, colIndex) => (
                    <td key={colIndex}>
                      {String(cell)}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
```

***

## UI Output

### Original Matrix

```text
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 4 | 5 |
+---+---+
| 6 |
+---+
```

### Transposed Matrix

```text
+---+---+---+
| 1 | 4 | 6 |
+---+---+---+

+---+---+-----------+
| 2 | 5 | undefined |
+---+---+-----------+

+---+-----------+-----------+
| 3 | undefined | undefined |
+---+-----------+-----------+
```

***

# React Example: Hide `undefined`

```jsx
const cleanedTransposed =
  transposed.map(row =>
    row.filter(
      value =>
        value !== undefined
    )
  );
```

Render:

```jsx
<tbody>
  {cleanedTransposed.map((row, i) => (
    <tr key={i}>
      {row.map((cell, j) => (
        <td key={j}>{cell}</td>
      ))}
    </tr>
  ))}
</tbody>
```

### Output

```text
+---+---+---+
| 1 | 4 | 6 |
+---+---+---+

+---+---+
| 2 | 5 |
+---+---+

+---+
| 3 |
+---+
```

***

## Interview Answer

For jagged arrays:

1. Find the maximum row length.
2. Create transposed rows using column indexes.
3. Missing values become `undefined`.
4. Optionally remove them with:

```javascript
row.filter(
  item => item !== undefined
)
```

### Complexity

```text
Time:  O(rows × maxColumns)
Space: O(rows × maxColumns)
```

This is the standard approach expected in JavaScript interview questions involving matrix transpose and jagged arrays.
