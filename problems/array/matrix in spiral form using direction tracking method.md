```js
// Input: mat[][] = {
//     {1, 2, 3, 4},
//     {5, 6, 7, 8},
//     {9, 10, 11, 12},
//     {13, 14, 15, 16}}
//     Output: 1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10
//     Input: mat[][] = {
//     {1, 2, 3, 4, 5, 6},
//     {7, 8, 9, 10, 11, 12},
//     {13, 14, 15, 16, 17, 18}}
//     Output: 1 2 3 4 5 6 12 18 17 16 15 14 13 7 8 9 10 11

// Javascript implementation of the approach

var R = 5;
var C = 5;

// Function to set the new direction on turning
// right from the current direction
function turnright(c_direction) {
  switch (c_direction) {
    case "east":
      return "south";
    case "west":
      return "north";
    case "north":
      return "east";
    case "south":
      return "west";
  }
  // returnin null value to avoid the error
  return "";
}
// Function to return the next possible cell
// indexes with current direction
function next(i, j, c_direction) {
  switch (c_direction) {
    case "east":
      j++;
      break;
    case "west":
      j--;
      break;
    case "north":
      i--;
      break;
    case "south":
      i++;
      break;
  }
  var arr = [i, j];
  return arr;
}
// Function that returns true
// if arr[i][j] is a valid index
function isvalid(i, j) {
  if (i < R && i >= 0 && j >= 0 && j < C) return true;
  return false;
}
// Function that returns true if arr[i][j]
// has already been visited
function alreadyVisited(i, j, mini, minj, maxi, maxj) {
  // If inside the current bounds then
  // it has not been visited earlier
  if (i >= mini && i <= maxi && j >= minj && j <= maxj) return false;
  return true;
}
// Function to update the constraints of the matrix
function ConstraintWalls(mini, minj, maxi, maxj, c_direction) {
  // Update the constraints according
  // to the direction
  switch (c_direction) {
    case "east":
      mini++;
      break;
    case "west":
      maxi--;
      break;
    case "north":
      minj++;
      break;
    case "south":
      maxj--;
      break;
  }
  var store = [mini, minj, maxi, maxj];
  return store;
}

// Function to print the given matrix in the spiral form
function printspiral(arr) {
  // To store the count of all the indexes
  var count = 0;

  // Starting direction is East
  var current_direction = "east";

  // Boundary constraints in the matrix
  var mini = 0,
    minj = 0,
    maxi = R - 1,
    maxj = C - 1;
  var i = 0,
    j = 0;
  // string to store the answer
  var ans = "";
  // While there are elements remaining
  while (count < R * C) {
    // Print the current element
    // and increment the count
    ans += arr[i][j] + " ";
    count += 1;

    // Next possible cell if direction remains the same
    var p = next(i, j, current_direction);
    // If current cell is already visited or is invalid
    if (
      !isvalid(p[0], p[1]) ||
      alreadyVisited(p[0], p[1], mini, minj, maxi, maxj)
    ) {
      // If not visited earlier then only change the constraint
      if (!alreadyVisited(i, j, mini, minj, maxi, maxj)) {
        var store = ConstraintWalls(mini, minj, maxi, maxj, current_direction);
        mini = store[0];
        minj = store[1];
        maxi = store[2];
        maxj = store[3];
      }

      // Change the direction
      current_direction = turnright(current_direction);

      // Next indexes with new direction
      p = next(i, j, current_direction);
    }

    // Next row and next column
    i = p[0];
    j = p[1];
  }
  console.log(ans);
}

// Fill the matrix
var counter = 1;
var arr = new Array(R);
for (var i = 0; i < R; i++) {
  arr[i] = new Array(C);
  for (var j = 0; j < C; j++) {
    arr[i][j] = counter;
    counter += 1;
  }
}
// Print the spiral form
printspiral(arr);
