Certainly! Here's the full code for each of the functions described earlier:

### 1. **`initialize2DArray(width, height, val = null)`**

```javascript
const initialize2DArray = (width, height, val = null) =>
  Array.from({ length: height }).map(() =>
    Array.from({ length: width }).fill(val)
  );

// Example usage:
console.log(initialize2DArray(2, 2, 0)); // [[0, 0], [0, 0]]
```

---

### 2. **`initializeNDArray(val, ...args)`**

```javascript
const initializeNDArray = (val, ...args) =>
  args.length === 0
    ? val
    : Array.from({ length: args[0] }).map(() =>
        initializeNDArray(val, ...args.slice(1))
      );

// Example usage:
console.log(initializeNDArray(1, 3)); // [1, 1, 1]
console.log(initializeNDArray(5, 2, 2, 2)); // [[[5, 5], [5, 5]], [[5, 5], [5, 5]]]
```

---

### 3. **`initializeMapped2DArray(width, height, mapFn = () => null)`**

```javascript
const initializeMapped2DArray = (width, height, mapFn = () => null) =>
  Array.from({ length: height }).map((_, i) =>
    Array.from({ length: width }).map((_, j) => mapFn(i, j))
  );

// Example usage:
console.log(initializeMapped2DArray(2, 2, (x, y) => `(${x}, ${y})`));
// [['(0, 0)', '(0, 1)'], ['(1, 0)', '(1, 1)']]
```

---

### 4. **`initializeSkewed2DArray(heigh, widthFn = () => h, mapFn = () => null)`**

```javascript
const initializeSkewed2DArray = (heigh, widthFn = () => h, mapFn = () => null) =>
  Array.from({ length: heigh }, (_, i) =>
    Array.from({ length: widthFn(i) }).map((_, j) => mapFn(i, j))
  );

// Example usage:
console.log(initializeSkewed2DArray(5, i => i + 1, (x, y) => x * y));
// [[0], [0, 1], [0, 2, 4], [0, 3, 6, 9], [0, 4, 8, 12, 16]]
```

---

### Explanation

1. **`initialize2DArray(2, 2, 0)`**:
   - Creates a 2x2 array where all elements are `0`.
   - Output: `[[0, 0], [0, 0]]`.

2. **`initializeNDArray(1, 3)`**:
   - Creates a 1-dimensional array with 3 elements, each initialized to `1`.
   - Output: `[1, 1, 1]`.

3. **`initializeNDArray(5, 2, 2, 2)`**:
   - Creates a 3-dimensional array with size `2x2x2`, each initialized to `5`.
   - Output: `[[[5, 5], [5, 5]], [[5, 5], [5, 5]]]`.

4. **`initializeMapped2DArray(2, 2, (x, y) => \`(${x}, ${y})\`)`**:
   - Creates a 2x2 array with each element being a string with its row and column indices.
   - Output: `[['(0, 0)', '(0, 1)'], ['(1, 0)', '(1, 1)']]`.

5. **`initializeSkewed2DArray(5, i => i + 1, (x, y) => x * y)`**:
   - Creates a skewed 2D array where the number of elements in each row increases with the row index and each element is the product of row and column indices.
   - Output: `[[0], [0, 1], [0, 2, 4], [0, 3, 6, 9], [0, 4, 8, 12, 16]]`.

These functions are flexible and can be used to generate multi-dimensional arrays with customized dimensions and initial values.

Manipulating multidimensional arrays (2D grids, 3D matrices, spatial coordinates) in JavaScript requires careful memory management, functional immutability, and index calculations.

---

## 1. Creating Multidimensional Arrays

### ❌ The Common Pitfall: `.fill()` Reference Bug

Passing an array or object into `.fill()` assigns the **same memory reference** to every row. Modifying one cell mutates the entire column across all rows.

```javascript
// ❌ BAD: All rows point to the SAME array in memory!
const grid = new Array(3).fill(new Array(3).fill(0));

grid[0][0] = 99;
console.log(grid[1][0]); // 99 (Unintended mutation!)

```

---

### ✅ Safe 2D Matrix Creation

Use `Array.from()` to execute a fresh factory callback for every row, ensuring independent memory allocations.

```javascript
// Creates a 3x4 grid initialized with zeros
function create2DArray(rows, cols, initialValue = 0) {
  return Array.from({ length: rows }, () => 
    new Array(cols).fill(initialValue)
  );
}

const grid2D = create2DArray(3, 4, 0);
grid2D[0][0] = 99;

console.log(grid2D[1][0]); // 0 (Rows are completely independent)

```

---

### ✅ Safe 3D Matrix Creation

For 3D volumes (width $\times$ height $\times$ depth), nest `Array.from()` calls or use a recursive generator.

```javascript
// Creates a 3x3x3 cube
function create3DArray(dimX, dimY, dimZ, initialValue = 0) {
  return Array.from({ length: dimX }, () =>
    Array.from({ length: dimY }, () =>
      new Array(dimZ).fill(initialValue)
    )
  );
}

const cube = create3DArray(3, 3, 3, 0);
cube[0][1][2] = 42;

console.log(cube[0][1][2]); // 42
console.log(cube[1][1][2]); // 0

```

---

## 2. Iterating & Transforming Matrices

### Traversing 2D Grids

Avoid manual nested `for` loops when transforming data. Use `.map()` to return a fresh 2D array or `.forEach()` for inspection.

```javascript
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Double every value immutably
const doubledGrid = grid.map(row => 
  row.map(cell => cell * 2)
);

console.log(doubledGrid[0]); // [2, 4, 6]

```

### Transposing a Matrix (Rows $\leftrightarrow$ Columns)

Flipping a matrix along its main diagonal is a common task in image processing and game development:

```javascript
function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  return Array.from({ length: cols }, (_, colIndex) =>
    Array.from({ length: rows }, (_, rowIndex) => matrix[rowIndex][colIndex])
  );
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

console.log(transpose(matrix));
// Output:
// [ [ 1, 4 ], 
//   [ 2, 5 ], 
//   [ 3, 6 ] ]

```

---

## 3. Immutable Matrix State Updates

In frameworks like React or Redux, mutating nested array cells directly disables shallow equality checks and causes rendering bugs.

```javascript
const originalGrid = [
  [0, 0],
  [0, 0]
];

// Immutably updating cell (1, 0) to value 7
function updateCell2D(grid, targetRow, targetCol, newValue) {
  return grid.map((row, rIdx) => {
    if (rIdx !== targetRow) return row; // Preserve untouched row references
    
    return row.with(targetCol, newValue); // ES2023 non-mutating element replacement
  });
}

const updatedGrid = updateCell2D(originalGrid, 1, 0, 7);

console.log(updatedGrid[1][0]);    // 7
console.log(originalGrid[1][0]);   // 0 (Original preserved)
console.log(originalGrid[0] === updatedGrid[0]); // true (Reference preserved for unchanged rows)

```

---

## 4. Performance Optimization: Flat 1D Buffers

In high-performance domains (WebGL, physics engines, game grids), nested arrays (`arr[x][y][z]`) incur heavy pointer-chasing overhead and garbage collection penalties.

### 1D Array Mapping Formula

You can store a 2D or 3D grid inside a single contiguous 1D array or `TypedArray` (e.g., `Float32Array`, `Uint8Array`) using index arithmetic:

| Dimension                | Index Formula                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| **2D Index** (`x, y`)    | $\text{index} = (y \times \text{width}) + x$                                                |
| **3D Index** (`x, y, z`) | $\text{index} = (z \times \text{width} \times \text{height}) + (y \times \text{width}) + x$ |

### High-Performance 2D Grid Implementation

```javascript
class FlatGrid2D {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // Uses contiguous memory allocation (e.g., Float64Array or Int32Array)
    this.data = new Int32Array(width * height);
  }

  get(x, y) {
    return this.data[y * this.width + x];
  }

  set(x, y, value) {
    this.data[y * this.width + x] = value;
  }
}

const grid = new FlatGrid2D(100, 100);
grid.set(45, 82, 999);

console.log(grid.get(45, 82)); // 999

```

---

## Summary Best Practices

1. **Never use `new Array(r).fill([])**` to build nested matrices—rows will share references.
2. **Use `Array.from()**` for clean, independent multidimensional creation.
3. **Use `.map()` and `row.with(col, value)**` for immutable matrix state updates in UI frameworks.
4. **Use 1D `TypedArray` buffers** with coordinate arithmetic for performance-critical games, WebGL, or massive grid simulations.

Below is a production-ready, fully-typed generic `Matrix2D<T>` class in TypeScript. It supports clean instantiation, immutable updates, rotation, transposition, slicing, and boundary checks.

---

### Implementation

```typescript
export class Matrix2D<T> implements Iterable<[x: number, y: number, value: T]> {
  public readonly width: number;
  public readonly height: number;
  private readonly data: T[][];

  constructor(width: number, height: number, initialValue: T | ((x: number, y: number) => T)) {
    if (width <= 0 || height <= 0) {
      throw new Error("Matrix dimensions must be positive integers.");
    }

    this.width = width;
    this.height = height;

    this.data = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) =>
        typeof initialValue === "function"
          ? (initialValue as (x: number, y: number) => T)(x, y)
          : initialValue
      )
    );
  }

  /**
   * Creates a Matrix2D instance from an existing 2D array.
   */
  public static from2DArray<T>(array: T[][]): Matrix2D<T> {
    const height = array.length;
    if (height === 0) {
      throw new Error("Cannot create matrix from an empty array.");
    }
    const width = array[0].length;
    if (width === 0) {
      throw new Error("Cannot create matrix with 0 columns.");
    }

    return new Matrix2D<T>(width, height, (x, y) => {
      if (array[y].length !== width) {
        throw new Error(`Inconsistent row width at row index ${y}.`);
      }
      return array[y][x];
    });
  }

  /** Checks if the given coordinate is within bounds. */
  public inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /** Gets the value at coordinate (x, y). Returns undefined if out of bounds. */
  public get(x: number, y: number): T | undefined {
    if (!this.inBounds(x, y)) return undefined;
    return this.data[y][x];
  }

  /** Sets the value at coordinate (x, y) in-place. Throws error if out of bounds. */
  public set(x: number, y: number, value: T): this {
    if (!this.inBounds(x, y)) {
      throw new RangeError(`Coordinates (${x}, ${y}) are out of bounds for matrix size ${this.width}x${this.height}.`);
    }
    this.data[y][x] = value;
    return this;
  }

  /** Returns a new Matrix2D with the value updated at (x, y) without mutating the original. */
  public with(x: number, y: number, value: T): Matrix2D<T> {
    if (!this.inBounds(x, y)) {
      throw new RangeError(`Coordinates (${x}, ${y}) are out of bounds.`);
    }

    return new Matrix2D<T>(this.width, this.height, (currX, currY) => {
      if (currX === x && currY === y) return value;
      return this.data[currY][currX];
    });
  }

  /** Retrieves an entire row at index y as a new array. */
  public getRow(y: number): T[] | undefined {
    if (y < 0 || y >= this.height) return undefined;
    return [...this.data[y]];
  }

  /** Retrieves an entire column at index x as a new array. */
  public getColumn(x: number): T[] | undefined {
    if (x < 0 || x >= this.width) return undefined;
    return this.data.map(row => row[x]);
  }

  /** Applies a mapping function to transform elements into a new Matrix2D<U>. */
  public map<U>(fn: (value: T, x: number, y: number) => U): Matrix2D<U> {
    return new Matrix2D<U>(this.width, this.height, (x, y) => fn(this.data[y][x], x, y));
  }

  /** Transposes the matrix (swaps rows and columns). */
  public transpose(): Matrix2D<T> {
    return new Matrix2D<T>(this.height, this.width, (x, y) => this.data[x][y]);
  }

  /** Rotates the matrix 90 degrees clockwise. */
  public rotateClockwise(): Matrix2D<T> {
    return new Matrix2D<T>(this.height, this.width, (x, y) => {
      const origX = y;
      const origY = this.height - 1 - x;
      return this.data[origY][origX];
    });
  }

  /** Extracts a sub-matrix from the current matrix. */
  public subMatrix(startX: number, startY: number, width: number, height: number): Matrix2D<T> {
    if (!this.inBounds(startX, startY) || !this.inBounds(startX + width - 1, startY + height - 1)) {
      throw new RangeError("Sub-matrix boundaries exceed matrix bounds.");
    }
    return new Matrix2D<T>(width, height, (x, y) => this.data[startY + y][startX + x]);
  }

  /** Returns a 2D array representation (shallow copy). */
  public to2DArray(): T[][] {
    return this.data.map(row => [...row]);
  }

  /** Iterates over each element in row-major order: [x, y, value]. */
  public *[Symbol.iterator](): Iterator<[x: number, y: number, value: T]> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield [x, y, this.data[y][x]];
      }
    }
  }
}

```

---

### Usage Example

```typescript
// 1. Initialize a 3x3 matrix using a factory function
const matrix = new Matrix2D<number>(3, 3, (x, y) => y * 3 + x + 1);

console.log(matrix.to2DArray());
/*
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
*/

// 2. Immutable transformation with .map()
const doubled = matrix.map(val => val * 2);
console.log(doubled.get(0, 0)); // 2

// 3. Rotate 90 degrees clockwise
const rotated = matrix.rotateClockwise();
console.log(rotated.to2DArray());
/*
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
*/

// 4. Use with for...of loops (symbol iterator)
for (const [x, y, value] of matrix) {
  if (value === 5) {
    console.log(`Found value 5 at coordinate (${x}, ${y})`);
  }
}

```
