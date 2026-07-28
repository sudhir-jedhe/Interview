```js
// Input: mat[][] = {{1, 0, 0}, {0, 0, 0}, {0, 0, 1}}
// Output: P1
// Explanation:
// P1 chooses mat[1][1], then the matrix becomes {{1, 0, 0}, {0, 1, 0}, {0, 0,1}}.
// P2 has no 0 left to choose from. So, P1 finishes last.

// Input: mat[][] = {{0, 0}, {0, 0}}
// Output: P2
// Explanation:
// No matter P1 chooses which 0 P2 will always have a 0 to choose and
// after P2 picks a 0 there will not be any other 0 to choose from.

// Javascript program for the above approach

// Function to find the person
// who will finish last
function findLast(mat) {
  let m = mat.length;
  let n = mat[0].length;

  // To keep track of rows
  // and columns having 1
  let rows = new Set();
  let cols = new Set();

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j]) {
        rows.add(i);
        cols.add(j);
      }
    }
  }

  // Available rows and columns
  let avRows = m - rows.size;
  let avCols = n - cols.size;

  // Minimum number of choices we have
  let choices = Math.min(avRows, avCols);

  // If number of choices are odd
  if (choices & 1)
    // P1 will finish last
    document.write("P1");
  // Otherwise, P2 will finish last
  else document.write("P2");
}

// Given matrix

let mat = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];

findLast(mat);

// This code is contributed by Hritik
