// JavaScript program to solve N Queen
// Problem using backtracking
const N = 4;

function printSolution(board) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] == 1) document.write("Q ");
      else document.write(". ");
    }
    document.write("</br>");
  }
}

// A utility function to check if a queen can
// be placed on board[row][col]. Note that this
// function is called when "col" queens are
// already placed in columns from 0 to col -1.
// So we need to check only left side for
// attacking queens
function isSafe(board, row, col) {
  // Check this row on left side
  for (let i = 0; i < col; i++) {
    if (board[row][i] == 1) return false;
  }

  // Check upper diagonal on left side
  for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
    if (board[i][j]) return false;

  // Check lower diagonal on left side
  for (i = row, j = col; j >= 0 && i < N; i++, j--)
    if (board[i][j]) return false;

  return true;
}

function solveNQUtil(board, col) {
  // base case: If all queens are placed
  // then return true
  if (col >= N) return true;

  // Consider this column and try placing
  // this queen in all rows one by one
  for (let i = 0; i < N; i++) {
    if (isSafe(board, i, col) == true) {
      // Place this queen in board[i][col]
      board[i][col] = 1;

      // recur to place rest of the queens
      if (solveNQUtil(board, col + 1) == true) return true;

      // If placing queen in board[i][col
      // doesn't lead to a solution, then
      // queen from board[i][col]
      board[i][col] = 0;
    }
  }
  // if the queen can not be placed in any row in
  // this column col then return false
  return false;
}

// This function solves the N Queen problem using
// Backtracking. It mainly uses solveNQUtil() to
// solve the problem. It returns false if queens
// cannot be placed, otherwise return true and
// placement of queens in the form of 1s.
// note that there may be more than one
// solutions, this function prints one of the
// feasible solutions.
function solveNQ() {
  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (solveNQUtil(board, 0) == false) {
    document.write("Solution does not exist");
    return false;
  }

  printSolution(board);
  return true;
}

// Driver Code
solveNQ();

// This code is contributed by shinjanpatra

/***************************************************************** */
// JavaScript code to implement the approach

let N = 4;

// ld is an array where its indices indicate row-col+N-1
// (N-1) is for shifting the difference to store negative
// indices
let ld = new Array(30);

// rd is an array where its indices indicate row+col
// and used to check whether a queen can be placed on
// right diagonal or not
let rd = new Array(30);

// Column array where its indices indicates column and
// used to check whether a queen can be placed in that
// row or not
let cl = new Array(30);

// A utility function to print solution
function printSolution(board) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) document.write(board[i][j] + " ");
    document.write("<br/>");
  }
}

// A recursive utility function to solve N
// Queen problem
function solveNQUtil(board, col) {
  // Base case: If all queens are placed
  // then return true
  if (col >= N) return true;

  // Consider this column and try placing
  // this queen in all rows one by one
  for (let i = 0; i < N; i++) {
    // Check if the queen can be placed on
    // board[i][col]

    // To check if a queen can be placed on
    // board[row][col].We just need to check
    // ld[row-col+n-1] and rd[row+coln] where
    // ld and rd are for left and right
    // diagonal respectively
    if (ld[i - col + N - 1] != 1 && rd[i + col] != 1 && cl[i] != 1) {
      // Place this queen in board[i][col]
      board[i][col] = 1;
      ld[i - col + N - 1] = rd[i + col] = cl[i] = 1;

      // Recur to place rest of the queens
      if (solveNQUtil(board, col + 1)) return true;

      // If placing queen in board[i][col]
      // doesn't lead to a solution, then
      // remove queen from board[i][col]
      board[i][col] = 0; // BACKTRACK
      ld[i - col + N - 1] = rd[i + col] = cl[i] = 0;
    }
  }

  // If the queen cannot be placed in any row in
  // this column col then return false
  return false;
}

// This function solves the N Queen problem using
// Backtracking. It mainly uses solveNQUtil() to
// solve the problem. It returns false if queens
// cannot be placed, otherwise, return true and
// prints placement of queens in the form of 1s.
// Please note that there may be more than one
// solutions, this function prints one of the
// feasible solutions.
function solveNQ() {
  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (solveNQUtil(board, 0) == false) {
    document.write("Solution does not exist");
    return false;
  }

  printSolution(board);
  return true;
}

// Driver code
solveNQ();
