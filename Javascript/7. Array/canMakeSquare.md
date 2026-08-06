function canMakeSquare(grid: string[][]): boolean {
    const dirs: number[] = [0, 0, 1, 1, 0];
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
            let [cnt1, cnt2] = [0, 0];
            for (let k = 0; k < 4; ++k) {
                const [x, y] = [i + dirs[k], j + dirs[k + 1]];
                if (grid[x][y] === 'W') {
                    ++cnt1;
                } else {
                    ++cnt2;
                }
            }
            if (cnt1 !== cnt2) {
                return true;
            }
        }
    }
    return false;
}


// You are given a 2D matrix grid of size 3 x 3 consisting only of characters 'B' and 'W'. Character 'W' represents the white color, and character 'B' represents the black color.

// Your task is to change the color of at most one cell so that the matrix has a 2 x 2 square where all cells are of the same color.

// Return true if it is possible to create a 2 x 2 square of the same color, otherwise, return false.

 
The task at hand is to determine whether it's possible to make a 2x2 square of the same color (either all 'B' or all 'W') in a 3x3 grid by changing at most one cell. 

### Problem Analysis:
Given the constraints, you need to check all possible 2x2 squares within the 3x3 grid. If you can change one cell in any of these 2x2 squares to make all cells the same color, return `true`. If no such modification is possible, return `false`.

### Approach:
1. **Grid Layout**: Since the grid is 3x3, you can have exactly four possible 2x2 squares:
   - (0,0), (0,1), (1,0), (1,1)
   - (0,1), (0,2), (1,1), (1,2)
   - (1,0), (1,1), (2,0), (2,1)
   - (1,1), (1,2), (2,1), (2,2)
   
   These squares are determined by their top-left corners, which can range from (0,0) to (1,1).

2. **Check if a Square can Become Uniform**: For each of these 2x2 squares, check how many 'B' and 'W' cells there are. If there are at least 3 cells of the same color, you can change one of the other cells to match the majority color.

### Steps:
1. Loop over the top-left corners of all possible 2x2 squares.
2. Count how many 'B' and 'W' cells are in each 2x2 square.
3. If for any square you can make all cells the same color by changing at most one, return `true`.
4. If no such square exists, return `false`.

### Solution Code:

```typescript
function canMakeSquare(grid: string[][]): boolean {
    // Iterate over all possible 2x2 square top-left corners
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            // Count occurrences of 'B' and 'W' in the 2x2 square
            let cntB = 0, cntW = 0;
            for (let x = 0; x < 2; x++) {
                for (let y = 0; y < 2; y++) {
                    if (grid[i + x][j + y] === 'B') {
                        cntB++;
                    } else {
                        cntW++;
                    }
                }
            }
            
            // If we can make all cells the same color by changing at most one cell
            if (cntB >= 3 || cntW >= 3) {
                return true;
            }
        }
    }
    return false;
}
```

### Explanation:
1. **Outer Loop**: We loop over the top-left corner of each 2x2 square, which can have indices `(i, j)` where `i` and `j` can be either 0 or 1. This ensures that all 2x2 subgrids are covered.
   
2. **Inner Loop**: For each 2x2 square, we count the number of 'B' and 'W' cells.
   
3. **Condition**: If a square has 3 or 4 cells of the same color, it's possible to make the square uniform by changing one of the remaining cells (if any).

4. **Return**: If any of the squares satisfies the condition, we return `true`. If none of them do, we return `false`.

### Time Complexity:
- **Time Complexity**: The time complexity of this solution is O(1), as the grid is always of size 3x3 and there are only a fixed number of 2x2 subgrids to check.
- **Space Complexity**: The space complexity is O(1), as we're only using a fixed amount of extra space for counting 'B' and 'W' cells.

### Example Walkthrough:

#### Example 1:
```typescript
const grid = [["B", "W", "B"], ["B", "W", "W"], ["B", "W", "B"]];
console.log(canMakeSquare(grid)); // Output: true
```
- For the 2x2 square starting at `(0,0)`:
  - The cells are: `['B', 'W', 'B', 'W']` → You can change one 'W' to 'B' to make it all 'B'.
  
Thus, the output is `true`.

#### Example 2:
```typescript
const grid = [["B", "W", "B"], ["W", "B", "W"], ["B", "W", "B"]];
console.log(canMakeSquare(grid)); // Output: false
```
- For all 2x2 squares, none of them can be converted to all 'B' or all 'W' by changing just one cell.

Thus, the output is `false`.

#### Example 3:
```typescript
const grid = [["B", "W", "B"], ["B", "W", "W"], ["B", "W", "W"]];
console.log(canMakeSquare(grid)); // Output: true
```
- The 2x2 square starting at `(1,1)` already contains all 'W' cells, so no change is needed.

Thus, the output is `true`.

---

This approach ensures that we can check for the possibility of creating a uniform 2x2 square efficiently, even when given different grid configurations.