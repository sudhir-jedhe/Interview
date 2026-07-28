```js
// Input:  {{1,    2,   3,   4},
//           {5,    6,   7,   8},
//           {9,   10,  11,  12},
//           {13,  14,  15,  16 }}
// Output: 1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10

// JavaScript program for the above approach

// Function to print in spiral order
function spiralOrder(matrix) {
  let ans = [];

  if (matrix.length == 0) return ans;

  let R = matrix.length,
    C = matrix[0].length;
  let seen = new Array(R);
  for (let i = 0; i < R; i++) {
    seen[i] = new Array(C);
    for (let j = 0; j < C; j++) {
      seen[i][j] = false;
    }
  }

  let dr = [0, 1, 0, -1];
  let dc = [1, 0, -1, 0];
  let r = 0,
    c = 0,
    di = 0;

  // Iterate from 0 to R * C - 1
  for (let i = 0; i < R * C; i++) {
    ans.push(matrix[r]);
    seen[r] = true;
    let cr = r + dr[di];
    let cc = c + dc[di];

    if (0 <= cr && cr < R && 0 <= cc && cc < C && !seen[cr][cc]) {
      r = cr;
      c = cc;
    } else {
      di = (di + 1) % 4;
      r += dr[di];
      c += dc[di];
    }
  }
  return ans;
}

// Driver Code
let a = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
document.write(spiralOrder(a));

/********************************************* */

// JavaScript Program to print a matrix spirally

function spiralPrint(m, n, arr) {
  let i,
    k = 0,
    l = 0;
  /*
		k - starting row index
		m - ending row index
		l - starting column index
		n - ending column index
		i - iterator 
	*/

  while (k < m && l < n) {
    // print the first row from the remaining rows
    for (i = l; i < n; ++i) {
      document.write(arr[k][i] + " ");
    }
    k++;

    // print the last column from the remaining columns
    for (i = k; i < m; ++i) {
      document.write(arr[i][n - 1] + " ");
    }
    n--;

    // print the last row from the remaining rows
    if (k < m) {
      for (i = n - 1; i >= l; --i) {
        document.write(arr[m - 1][i] + " ");
      }
      m--;
    }

    // print the first column from the remaining columns
    if (l < n) {
      for (i = m - 1; i >= k; --i) {
        document.write(arr[i][l] + " ");
      }
      l++;
    }
  }
}

// function call
let arr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
let r = arr.length;
let c = arr[0].length;

spiralPrint(r, c, arr);

// This code is contributed by karthiksrinivasprasad
