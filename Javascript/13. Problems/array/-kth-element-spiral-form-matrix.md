```js
// Input: mat[][] =
//           {{1, 2, 3, 4}
//            {5, 6, 7, 8}
//            {9, 10, 11, 12}
//            {13, 14, 15, 16}}
//        k = 6
// Output: 12
// Explanation: The elements in spiral order is
// 1, 2, 3, 4, 8, 12, 16, 15...
// so the 6th element is 12

// Input: mat[][] =
//        {{1, 2, 3, 4, 5, 6}
//         {7, 8, 9, 10, 11, 12}
//         {13, 14, 15, 16, 17, 18}}
//        k = 17
// Output: 10
// Explanation: The elements in spiral order is
// 1, 2, 3, 4, 5, 6, 12, 18, 17,
// 16, 15, 14, 13, 7, 8, 9, 10, 11
// so the 17 th element is 10.

let R = 3;
let C = 6;

function spiralPrint(m, n, a, c) {
  let i,
    k = 0,
    l = 0;
  let count = 0;

  /* k - starting row index
        m - ending row index
        l - starting column index
        n - ending column index
        i - iterator
    */

  while (k < m && l < n) {
    /* check the first row from
            the remaining rows */
    for (i = l; i < n; ++i) {
      count++;

      if (count == c) document.write(a[k][i] + " ");
    }
    k++;

    /* check the last column
        from the remaining columns */
    for (i = k; i < m; ++i) {
      count++;

      if (count == c) document.write(a[i][n - 1] + " ");
    }
    n--;

    /* check the last row from
                the remaining rows */
    if (k < m) {
      for (i = n - 1; i >= l; --i) {
        count++;

        if (count == c) document.write(a[m - 1][i] + " ");
      }
      m--;
    }

    /* check the first column from
                the remaining columns */
    if (l < n) {
      for (i = m - 1; i >= k; --i) {
        count++;

        if (count == c) document.write(a[i][l] + " ");
      }
      l++;
    }
  }
}

let a = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18],
  ],
  k = 17;

spiralPrint(R, C, a, k);

/**************************************************** */

// JavaScript program for Kth element in spiral
// form of matrix
let MAX = 100;

/* function for Kth element */
function findK(A, i, j, n, m, k) {
  if (n < 1 || m < 1) return -1;

  /*.....If element is in outermost ring ....*/
  /* Element is in first row */
  if (k <= m) return A[i + 0][j + k - 1];

  /* Element is in last column */
  if (k <= m + n - 1) return A[i + (k - m)][j + m - 1];

  /* Element is in last row */
  if (k <= m + n - 1 + m - 1)
    return A[i + n - 1][j + m - 1 - (k - (m + n - 1))];

  /* Element is in first column */
  if (k <= m + n - 1 + m - 1 + n - 2)
    return A[i + n - 1 - (k - (m + n - 1 + m - 1))][j + 0];

  /*.....If element is NOT in outermost ring ....*/
  /* Recursion for sub-matrix. &A[1][1] is
	address to next inside sub matrix.*/
  return findK(A, i + 1, j + 1, n - 2, m - 2, k - (2 * n + 2 * m - 4));
}

/* Driver code */

let a = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18],
];
let k = 17;
document.write(findK(a, 0, 0, 3, 6, k));

// This code is contributed by sravan kumar
