The given problem requires us to check if a given square matrix (2D array) is an X-Matrix. An X-Matrix is defined by two conditions:

1. **Non-zero elements on the diagonals**: The main diagonal (from top-left to bottom-right) and the anti-diagonal (from top-right to bottom-left) must contain only non-zero elements.
2. **Zero elements elsewhere**: All other elements outside the diagonals must be zero.

### Approach:
1. We will iterate through each element of the matrix.
2. For each element at position `(i, j)`:
   - If it's on the main diagonal (`i == j`) or the anti-diagonal (`i + j == n - 1`), the value must be non-zero.
   - For any other element, it must be zero.
3. If any element violates these conditions, we return `false`.
4. If all conditions are satisfied, we return `true`.

The following code implements this logic:

### TypeScript Code:

```typescript
function checkXMatrix(grid: number[][]): boolean {
    const n = grid.length;
    
    // Iterate over the grid to check the conditions
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            // Check if the current element is on one of the diagonals
            if (i === j || i + j === n - 1) {
                // If it's on the diagonal, it should be non-zero
                if (grid[i][j] === 0) {
                    return false;
                }
            } else {
                // If it's not on the diagonal, it should be zero
                if (grid[i][j] !== 0) {
                    return false;
                }
            }
        }
    }
    
    return true;
}
```

### Explanation:

1. **Outer Loops**: The outer two `for` loops iterate over each element in the matrix (`i` for rows and `j` for columns).
   
2. **Diagonal Conditions**: 
   - The **main diagonal** is where the row index (`i`) is equal to the column index (`j`), i.e., `i == j`.
   - The **anti-diagonal** is where the sum of the row index and column index equals `n - 1` (where `n` is the size of the matrix), i.e., `i + j == n - 1`.

3. **Element Check**:
   - If the element is on either diagonal, it should be non-zero. If it's zero, return `false`.
   - If the element is not on the diagonal, it should be zero. If it's non-zero, return `false`.

4. **Return**: If all checks pass, return `true` indicating that the matrix is an X-Matrix.

### Example Walkthrough:

#### Input 1:
```typescript
const grid1 = [
  [5, 7, 0],
  [0, 3, 1],
  [0, 5, 0]
];
console.log(checkXMatrix(grid1)); // Output: false
```

**Explanation**:
- The diagonals are: `5, 3, 0` and `7, 3, 5`.
- The element at position `(0, 2)` is `0`, which violates the rule that the diagonals should have non-zero values.
- Therefore, the matrix is **not** an X-Matrix.

#### Input 2:
```typescript
const grid2 = [
  [2, 0, 0, 1],
  [0, 3, 1, 0],
  [0, 5, 2, 0],
  [4, 0, 0, 2]
];
console.log(checkXMatrix(grid2)); // Output: true
```

**Explanation**:
- The diagonals are: `2, 3, 2` (main diagonal) and `1, 3, 5, 4` (anti-diagonal).
- All elements outside the diagonals are `0`.
- Therefore, the matrix **is** an X-Matrix.

### Time Complexity:
- The time complexity is **O(n²)** because we need to iterate through every element of the matrix (where `n` is the dimension of the matrix).

### Space Complexity:
- The space complexity is **O(1)** because we are only using a few extra variables for iteration and checks, and not storing any additional data structures.

### Conclusion:
This solution efficiently checks whether a given square matrix is an X-Matrix by leveraging simple checks on the diagonals and other elements. The code is optimal and works in linear time relative to the number of elements in the matrix.