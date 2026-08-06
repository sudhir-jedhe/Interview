```js
export function matrixReshape(mat, r, c) {
  const m = mat.length;
  const n = mat[0].length;

  // Check if reshape is possible
  if (m * n !== r * c) {
    return mat;
  }

  // Initialize new reshaped matrix
  const reshaped = new Array(r).fill(0).map(() => new Array(c));

  // Fill the reshaped matrix
  for (let i = 0; i < r * c; i++) {
    reshaped[Math.floor(i / c)][i % c] = mat[Math.floor(i / n)][i % n];
  }

  return reshaped;
}

import { matrixReshape } from "./matrixReshape.js";

const mat = [
  [1, 2],
  [3, 4],
];
const r = 1;
const c = 4;
console.log(matrixReshape(mat, r, c)); // Output: [[1, 2, 3, 4]]

// mat = [[1,2],[3,4]], r = 2, c = 4
// In this case, the provided r and c values are not legal for reshaping the matrix, so the output should be the original input matrix:

// [[1, 2],
// [3, 4]]
```
