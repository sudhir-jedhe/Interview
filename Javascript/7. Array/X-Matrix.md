
### implementing a function to check if a given square matrix is an X-Matrix

// An X-Matrix has the following conditions:

// All the elements in the diagonals of the matrix are non-zero.
// All other elements are 0. javascript

```js
function isXMatrix(matrix) {
    const n = matrix.length;

    // Check diagonals
    for (let i = 0; i < n; i++) {
        if (matrix[i][i] === 0) {
            return false; // Diagonal element is zero
        }
    }

    // Check non-diagonal elements
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j && matrix[i][j] !== 0) {
                return false; // Non-diagonal element is non-zero
            }
        }
    }

    return true; // All conditions satisfied
}

// Test cases
const matrix1 = [
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 3]
];
console.log(isXMatrix(matrix1)); // Output: true

const matrix2 = [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 3]
];
console.log(isXMatrix(matrix2)); // Output: false
