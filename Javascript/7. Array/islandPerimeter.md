The problem you've described involves calculating the perimeter of an island in a grid. The grid consists of land (represented by `1`s) and water (represented by `0`s). The task is to determine the perimeter of the island formed by connected land cells.

### Approach:
To solve this problem, we can approach it step by step:

1. **Land Cells Count**: Each land cell (`1`) will contribute a potential perimeter of 4. However, the perimeter will be reduced if the land cell has neighboring land cells. The neighbors can be either above, below, left, or right.
  
2. **Neighboring Land Cells**: If a land cell has a neighboring land cell (horizontally or vertically), that shared edge should not count towards the perimeter. So, for each land cell, we subtract the number of neighboring land cells from the perimeter.

### Steps:
1. **Initialize Variables**:
   - `landCount`: To count how many land cells (`1`) are present.
   - `neighborCount`: To count how many neighboring land cells exist, i.e., how many shared edges there are between adjacent land cells.

2. **Iterate Over Each Cell**:
   - If the cell is land (`1`), increase the `landCount` (each land cell potentially adds 4 to the perimeter).
   - Check its neighbors (top, bottom, left, right). If the neighbor is land, increment the `neighborCount` (this subtracts from the perimeter since these edges are shared).

3. **Compute the Perimeter**:
   - The perimeter of the island can be calculated by:  
     `perimeter = landCount * 4 - neighborCount`

4. **Return the Result**.

### Code Implementation:

```javascript
export function islandPerimeter(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let landCount = 0;
  let neighborCount = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        landCount++;
        // Check top neighbor
        if (i > 0 && grid[i - 1][j] === 1) {
          neighborCount++; 
        }
        // Check bottom neighbor
        if (i < rows - 1 && grid[i + 1][j] === 1) {
          neighborCount++;
        }
        // Check left neighbor
        if (j > 0 && grid[i][j - 1] === 1) {
          neighborCount++;
        }
        // Check right neighbor
        if (j < cols - 1 && grid[i][j + 1] === 1) {
          neighborCount++;
        }
      }
    }
  }

  return landCount * 4 - neighborCount;
}
```

### Explanation:

- **Land Cell (1)**: Every land cell has four potential edges, contributing `4` to the perimeter.
- **Neighbors**: For every adjacent land cell (up, down, left, or right), we subtract `1` from the perimeter, as those two cells share an edge.
- **Final Perimeter**: The perimeter is the total possible perimeter (count of land cells * 4) minus the number of shared edges.

### Example Case 1:
**Input**: 
```javascript
const grid = [
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 0],
  [1, 1, 0, 0],
];
```

**Steps**:
- Land cells (`1`): There are 6 land cells.
- Shared edges between neighboring land cells: There are 4 such shared edges.
  
**Output**:
```javascript
console.log(islandPerimeter(grid)); // Output: 16
```

### Example Case 2:
**Input**: 
```javascript
const grid = [
  [1]
];
```

**Steps**:
- One land cell, so the perimeter is `4`.

**Output**:
```javascript
console.log(islandPerimeter(grid)); // Output: 4
```

### Example Case 3:
**Input**: 
```javascript
const grid = [
  [1, 0]
];
```

**Steps**:
- One land cell, so the perimeter is `4`.

**Output**:
```javascript
console.log(islandPerimeter(grid)); // Output: 4
```

### Time Complexity:
- The algorithm iterates over each cell in the grid once, so the time complexity is **O(m * n)**, where `m` is the number of rows and `n` is the number of columns in the grid.

### Space Complexity:
- The space complexity is **O(1)** because we are only using a few extra variables (like `landCount` and `neighborCount`), and we're not using any additional data structures that grow with the input size.

### Conclusion:
This approach efficiently computes the perimeter of the island in a grid by counting the land cells and their neighboring land cells, which results in the correct perimeter.