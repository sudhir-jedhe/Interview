This is a solution to the **LeetCode 2022: Convert 1D Array Into 2D Array** problem.

***

# Code Explanation

```javascript
export function construct2DArray(original, m, n) {
  const totalElements = m * n;

  if (original.length !== totalElements) {
    return [];
  }

  const result = [];
  let index = 0;

  for (let i = 0; i < m; i++) {
    const row = [];

    for (let j = 0; j < n; j++) {
      row.push(original[index]);
      index++;
    }

    result.push(row);
  }

  return result;
}
```

***

## Step 1: Validate Input Size

```javascript
const totalElements = m * n;

if (original.length !== totalElements) {
  return [];
}
```

Example:

```javascript
original = [1, 2, 3];
m = 2;
n = 2;
```

Required elements:

```javascript
2 * 2 = 4
```

Available:

```javascript
3
```

Since sizes don't match:

```javascript
return [];
```

Output:

```javascript
[]
```

***

## Step 2: Create Result Array

```javascript
const result = [];
let index = 0;
```

Example:

```javascript
result = []
index = 0
```

***

## Step 3: Create Rows

```javascript
for (let i = 0; i < m; i++) {
```

If:

```javascript
m = 2
```

Loop runs:

```text
i = 0
i = 1
```

Creating 2 rows.

***

## Step 4: Fill Each Row

```javascript
const row = [];

for (let j = 0; j < n; j++) {
  row.push(original[index]);
  index++;
}
```

If:

```javascript
original = [1,2,3,4,5,6]
m = 2
n = 3
```

### First Row

```text
row = []

push 1
push 2
push 3
```

Result:

```javascript
[1,2,3]
```

***

### Second Row

```text
row = []

push 4
push 5
push 6
```

Result:

```javascript
[4,5,6]
```

***

## Step 5: Add Row to Result

```javascript
result.push(row);
```

After first iteration:

```javascript
[
  [1,2,3]
]
```

After second iteration:

```javascript
[
  [1,2,3],
  [4,5,6]
]
```

***

# Dry Run

Input:

```javascript
original = [1,2,3,4,5,6];
m = 2;
n = 3;
```

### Iteration 1

```javascript
row = [1,2,3]
result = [[1,2,3]]
```

### Iteration 2

```javascript
row = [4,5,6]
result = [
  [1,2,3],
  [4,5,6]
]
```

Output:

```javascript
[
  [1,2,3],
  [4,5,6]
]
```

***

# Time Complexity

Outer loop:

```javascript
m
```

Inner loop:

```javascript
n
```

Total operations:

```javascript
m * n
```

Since:

```javascript
m * n = original.length
```

### Time Complexity

```text
O(m × n)
or
O(N)
```

where:

```javascript
N = original.length
```

***

# Space Complexity

Output array stores all elements:

```text
O(m × n)
```

which is:

```text
O(N)
```

***

# Optimised Solution Using `slice()`

Interviewers often like this approach because it's cleaner.

```javascript
function construct2DArray(original, m, n) {
  if (original.length !== m * n) {
    return [];
  }

  const result = [];

  for (let i = 0; i < m; i++) {
    result.push(
      original.slice(i * n, (i + 1) * n)
    );
  }

  return result;
}
```

Example:

```javascript
construct2DArray(
  [1,2,3,4,5,6],
  2,
  3
);
```

Output:

```javascript
[
  [1,2,3],
  [4,5,6]
]
```

***

# Modern JavaScript Solution (`Array.from`)

```javascript
function construct2DArray(original, m, n) {
  if (original.length !== m * n) {
    return [];
  }

  return Array.from(
    { length: m },
    (_, rowIndex) =>
      original.slice(
        rowIndex * n,
        rowIndex * n + n
      )
  );
}
```

### Interview Answer

> First validate that `m × n` equals the original array length. Then create `m` rows and place `n` elements in each row. The solution runs in **O(N)** time, where `N` is the number of elements, and uses **O(N)** space for the resulting 2D array. The `slice()` or `Array.from()` solution is often preferred in modern JavaScript because it is more concise and readable.


## React Example: Rendering a 2D Array

Assume your function returns:

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
```

***

# Example 1: Render as Rows and Columns

```jsx
function MatrixGrid() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  return (
    <div>
      {matrix.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px"
          }}
        >
          {row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                border: "1px solid black",
                padding: "10px"
              }}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MatrixGrid;
```

### UI Output

```text
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+

+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
```

***

# Example 2: Render as HTML Table

Most common interview answer.

```jsx
function MatrixTable() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  return (
    <table border="1">
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, colIndex) => (
              <td key={colIndex}>
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MatrixTable;
```

### Output

```text
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
```

***

# Example 3: Using Your `construct2DArray` Function

```jsx
import React from "react";

function construct2DArray(original, m, n) {
  if (original.length !== m * n) {
    return [];
  }

  const result = [];
  let index = 0;

  for (let i = 0; i < m; i++) {
    const row = [];

    for (let j = 0; j < n; j++) {
      row.push(original[index++]);
    }

    result.push(row);
  }

  return result;
}

export default function App() {
  const matrix = construct2DArray(
    [1, 2, 3, 4, 5, 6],
    2,
    3
  );

  return (
    <div>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <span
              key={colIndex}
              style={{
                marginRight: "15px"
              }}
            >
              {value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
```

***

# Example 4: Sudoku/Grid Style Rendering

```jsx
function Grid() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(3, 60px)",
        gap: "5px"
      }}
    >
      {matrix.flat().map((value, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            textAlign: "center",
            padding: "10px"
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
```

***

# Interview Tip

The standard React pattern for rendering a 2D array is:

```jsx
{
  matrix.map((row, rowIndex) =>
    row.map((value, colIndex) => (
      <Cell
        key={`${rowIndex}-${colIndex}`}
        value={value}
      />
    ))
  );
}
```

### Key Point

For a 2D array:

```javascript
[
  [1, 2, 3],
  [4, 5, 6]
]
```

use:

```jsx
outerArray.map(row =>
  row.map(cell => ...)
)
```

This nested `map()` approach is the most common React interview solution for tables, grids, matrix problems, calendars, Sudoku boards, and game boards.
