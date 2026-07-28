```js
// Input: matrix = [[1, 2, 3],
//                  [4, 5, 6],
//                  [7, 8, 9]]
// Output: [1 2 3 6 9 8 7 4 5]

// Input: matrix = [[1, 2, 3, 4],
//                  [12, 13, 14, 5],
//                  [11, 16, 15, 6],
// [10, 9, 8, 7]]
// Output: [1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16]

// Boundary Traversal  for the above approach

// To print a given matrix in a spiral form we initialize boundaries to track the matrix’s edges.
// Then iterate through the matrix, printing elements in a clockwise spiral pattern: top row, right column, bottom row, left column. Adjust boundaries after each step and continue until all elements are printed.

// Initialize four variables to represent the boundaries of the matrix:
// top: The topmost row.
// bottom: The bottommost row.
// left: The leftmost column.
// right: The rightmost column.

function printSpiral(matrix) {
  let result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  // Loop while the elements
  // are within the boundaries.
  while (top <= bottom && left <= right) {
    // Print top row
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    // Move the top boundary down.
    top++;

    // Print right column
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    // Move the right boundary to the left.
    right--;

    // Check if there are more rows
    if (top <= bottom) {
      // Print bottom row
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      // Move the bottom boundary up.
      bottom--;
    }

    // Check if there are more columns
    if (left <= right) {
      // Print left column
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      // Move the left boundary to the right.
      left++;
    }
  }

  // Print the result
  console.log(result.join(" "));
}

// Example
const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
printSpiral(matrix);

/******************************************************** */
// Simulation Approach
// We are given a matrix of ‘N’ rows and ‘M’ columns.
// Use a visited array where vis[n][m] indicates whether the cell at row ‘n’ and column ‘m’ has been visited.
// Our current position is denoted by (n, m), and we’re facing a certain direction d. We have to visit
// all the N x M cells in the matrix.
// As we traverse through the matrix, we continuously calculate a cell’s next position, denoted as (nrow, ncol).
// If the cell’s position is within the bounds of the matrix and has not been visited (!vis[nrow][nrow]),
// it becomes our next position.
// If the cell’s position is out of bounds or has already been visited, we change our next position
// to the one by performing a clockwise turn.
// JavaScript code for the above approach

function spiralOrder(matrix) {
  let result = [];

  if (matrix.length === 0) {
    return result;
  }

  let N = matrix.length;
  let M = matrix[0].length;
  // Create a visited matrix
  let vis = new Array(N);
  for (let n = 0; n < N; n++) {
    vis[n] = new Array(M).fill(false);
  }

  let dx = [0, 1, 0, -1];
  let dy = [1, 0, -1, 0];
  let n = 0,
    m = 0,
    d = 0;

  // Traverse through the matrix
  for (let i = 0; i < N * M; i++) {
    result.push(matrix[n][m]);
    vis[n][m] = true;

    // Calculate the next
    // cell's position
    let nrow = n + dx[d];
    let ncol = m + dy[d];

    // Check the valid positions
    // of the cell
    if (nrow >= 0 && nrow < N && ncol >= 0 && ncol < M && !vis[nrow][ncol]) {
      n = nrow;
      m = ncol;
    } else {
      // Perform a clockwise
      // turn to change direction
      d = (d + 1) % 4;
      n += dx[d];
      m += dy[d];
    }
  }

  return result.join(" ");
}

// Example
const matrix = [
  [1, 2, 3, 4],
  [12, 13, 14, 5],
  [11, 16, 15, 6],
  [10, 9, 8, 7],
];

let spiralResult = spiralOrder(matrix);
console.log(spiralResult);

/*************************************************************s */
// Recursion in JavaScript
// Create a recursive function that takes a matrix and four variables: k (starting row index), m (ending row index),
// l (starting column index), and n (ending column index) as the parameters.
// As a base case, the starting index should be less than or equal to the ending index for both rows and columns.
// Now print the boundary elements in a clockwise manner as given in below steps:
// First, print the top row elements. This means print the elements of the k-th row from column
// index l to n. Then increment the value of k.
// Next, print the right column elements. Print the last column from row index k to m. Then decrease the value of n.
// If k is greater than m, print the bottom row elements. That is, the elements of the (m-1)th row from
// column n-1 to l and decrement the value of m.
// If l is less than n, print the left column elements of the l-th column from the (m-1)th row to k
// and increment the value of l.
// Recursively call the function with the updated values of starting and ending indices for rows and columns.
// JavaScript code for the above approach

function printSpiralRecursive(matrix, k, m, l, n) {
  // Base case
  if (k > m || l > n) {
    return "";
  }

  let result = "";
  // Print the top row from left to right
  for (let i = l; i <= n; i++) {
    result += matrix[k][i] + " ";
  }
  // Increment the row index from start
  k++;

  // Print the right column from top to bottom
  for (let i = k; i <= m; i++) {
    result += matrix[i][n] + " ";
  }
  // Decrement the column index from end
  n--;

  // Check if there is a bottom row to print
  if (k <= m) {
    for (let i = n; i >= l; i--) {
      result += matrix[m][i] + " ";
    }
    // Decrement the row index from end
    m--;
  }

  // Check if there is a left column to print
  if (l <= n) {
    for (let i = m; i >= k; i--) {
      result += matrix[i][l] + " ";
    }
    // Increment the column index from start
    l++;
  }

  // Recursive Call
  return result + printSpiralRecursive(matrix, k, m, l, n);
}

// Function to print the matrix in spiral form
function printSpiral(matrix) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const spiralResult = printSpiralRecursive(
    matrix,
    0,
    rows - 1,
    0,
    columns - 1
  );
  console.log(spiralResult);
}

// Example
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

printSpiral(matrix);

/**************************************************************** */
// Depth First Search (DFS)
// Create an array of N*M for marking the visited cells so far. Initially, all the cells will be unvisited.
// Create arrays called dx (for rows) and dy (for columns) to represent the four possible adjacent directions
// for each cell.
// Now, in the recursive DFS function, the current row, column and the direction will be the parameters.
// As a base case, check if the current cell is within the bounds of the given matrix and if
// the cell has not been visited earlier.
// If not, then mark it as visited and print its value.
// Calculate the value of the next row and column by adding the respective values from dx and dy
// arrays. Make a recursive call in the new indices of those directions.
// When one traversal gets complete, change the direction to the next clockwise direction to print the matrix spirally.
// Start the DFS from the top-left corner of the given matrix which will be the first cell.
// JavaScript code for the above approach

function spiralDFS(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;

  // Initialize a visited array
  let vis = new Array(N);
  for (let n = 0; n < N; n++) {
    vis[n] = new Array(M).fill(false);
  }

  // Row and column directions for
  // right, down, left, and up
  const dx = [0, 1, 0, -1];
  const dy = [1, 0, -1, 0];

  let i = 0;
  let row = 0;
  let col = 0;

  const result = [];

  // DFS function
  function dfs(row, col) {
    // Base case: Check if the current
    // cell is within bounds and unvisited
    if (row < 0 || row >= N || col < 0 || col >= M || vis[row][col]) {
      return;
    }

    // Mark the cell as visited
    // and add it to the result
    result.push(matrix[row][col]);
    vis[row][col] = true;

    // Calculate the next row and column
    const nrow = row + dx[i];
    const ncol = col + dy[i];

    // Recursively call DFS with the new indices
    dfs(nrow, ncol);

    // If DFS completes in the current
    // direction, change direction clockwise
    if (nrow < 0 || nrow >= N || ncol < 0 || ncol >= M || vis[nrow][ncol]) {
      i = (i + 1) % 4;
      const nrow = row + dx[i];
      const ncol = col + dy[i];
      dfs(nrow, ncol);
    }
  }

  // Start DFS from the top-left
  // corner of the matrix
  dfs(row, col);

  console.log(result.join(" "));
}

// Example
const matrix = [
  [1, 2, 3],
  [6, 5, 7],
  [4, 8, 11],
  [12, 0, 16],
];

spiralDFS(matrix);

/********************************** */
const spiralTraversal = (arr) => {
  let result = [];
  let startRow = 0;
  let endRow = arr.length - 1;
  let startCol = 0;
  let endCol = arr[0].length - 1;

  while (startRow <= endRow && startCol <= endCol) {
    // top row
    for (let i = startCol; i <= endCol; i++) {
      result.push(arr[startRow][i]);
    }
    startRow++;

    // right col
    for (let i = startRow; i <= endRow; i++) {
      result.push(arr[i][endCol]);
    }
    endCol--;

    // bottom row
    for (let i = endCol; i >= startCol; i--) {
      result.push(arr[endRow][i]);
    }
    endRow--;

    // left col
    for (let i = endRow; i >= startRow; i--) {
      result.push(arr[i][startCol]);
    }
    startCol++;
  }

  return result;
};

const arr = [
  [1, 2, 3, 4],
  [12, 13, 14, 5],
  [11, 16, 15, 6],
  [10, 9, 8, 7],
];

console.log(spiralTraversal(arr));


/********************************************************** */
const spiralTraversalRecursive = (arr) => {
  let result = [];
  let startRow = 0;
  let endRow = arr.length - 1;
  let startCol = 0;
  let endCol = arr[0].length - 1;

  spiralTraversalRecursiveHelper(
    arr,
    startRow,
    endRow,
    startCol,
    endCol,
    result
  );

  return result;
};

const spiralTraversalRecursiveHelper = (
  arr,
  startRow,
  endRow,
  startCol,
  endCol,
  result
) => {
  if (startRow > endRow || startCol > endCol) {
    return;
  }

  // top row
  for (let i = startCol; i <= endCol; i++) {
    result.push(arr[startRow][i]);
  }
  startRow++;

  // right col
  for (let i = startRow; i <= endRow; i++) {
    result.push(arr[i][endCol]);
  }
  endCol--;

  // bottom row
  for (let i = endCol; i >= startCol; i--) {
    result.push(arr[endRow][i]);
  }
  endRow--;

  // left col
  for (let i = endRow; i >= startRow; i--) {
    result.push(arr[i][startCol]);
  }
  startCol++;

  spiralTraversalRecursiveHelper(
    arr,
    startRow,
    endRow,
    startCol,
    endCol,
    result
  );
};

const arr = [
  [1, 2, 3, 4],
  [12, 13, 14, 5],
  [11, 16, 15, 6],
  [10, 9, 8, 7],
];

console.log(spiralTraversalRecursive(arr));
