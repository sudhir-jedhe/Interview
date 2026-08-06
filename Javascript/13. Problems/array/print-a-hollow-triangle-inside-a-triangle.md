```js
// Input: N = 9
// Output:
//                 *
//               *   *
//             *       *
//           *     *     *
//         *     * * *     *
//       *                   *
//     *                       *
//   *                           *
// * * * * * * * * * * * * * * * * *

// Let i be the index for rows and j be the index for columns. Then:

// For sides of outer triangle:
// If the index of column(j) is equals to (N – i + 1) or (N + i – 1), then ‘*’ is printed for equal sides of outer triangle.

// if(j == (N - i + 1)
//    || j == (N + i - 1) {
//   print('*')
// }

// For sides of inner triangle:
// If the (index of row(i) is less than (N – 4) and greater than (4) and index of column(j) is equals to (N – i + 4) or (N + i + 4), then ‘*’ is printed for equal sides of inner triangle.

// if(  (i >= 4
//      && i <= n - 4)
//   && (j == N - i + 4
//      || j == N + i - 4) ) {
//     print('*')
// }

// For bases of the outer triangle:
// If the index of row(i) is equal to N, then ‘*’ is printed for the base of outer triangle.

// if(i == N) {
//    print('*')
// }

// For bases of the inner triangle:
// If the index of row(i) is equals (N – 4) and the column index(j) must be greater than equals to (N – (N – 2*4)), and j is less than equals to (N + N – 2*4), then ‘*’ is printed for the base of inner triangle.

// if( (i == N - 4)
//  && (j >= N - (N - 2 * 4) )
//  && (j <= n + n - 2 * 4) ) ) {
//    print('*')
// }

// JavaScript implementation of the above approach

// Function to print the pattern
function printPattern(n) {
  var i, j;

  // Loop for rows
  for (i = 1; i <= n; i++) {
    // Loop for column
    for (j = 1; j < 2 * n; j++) {
      // For printing equal sides
      // of outer triangle
      if (j == n - i + 1 || j == n + i - 1) {
        document.write("* ");
      }

      // For printing equal sides
      // of inner triangle
      else if (i >= 4 && i <= n - 4 && (j == n - i + 4 || j == n + i - 4)) {
        document.write("* ");
      }

      // For printing base
      // of both triangle
      else if (
        i == n ||
        (i == n - 4 && j >= n - (n - 2 * 4) && j <= n + n - 2 * 4)
      ) {
        document.write("* ");
      }

      // For spacing between the triangle
      else {
        document.write("");
        document.write("");
      }
    }
    document.write("<br>");
  }
}

// Driver Code

var N = 9;

printPattern(N);
