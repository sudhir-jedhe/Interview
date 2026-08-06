```js
// Input : n = 15
// Output : 1 2 3 4 5
// 15 = 1 + 2 + 3 + 4 + 5

// Input : n = 18
// Output : -1

// JavaScript program to check if a number can
// be expressed as sum of five consecutive
// integers.

// function to check if a number can be
// expressed as sum of five consecutive
// integers.
function checksum(n) {
  // if n is 0
  if (n == 0) {
    document.write("-2 -1 0 1 2");
    return;
  }

  var inc;

  // if n is positive, increment loop by 1.
  if (n > 0) inc = 1;
  // if n is negative, decrement loop by 1.
  else inc = -1;

  // Running loop from 0 to n - 4
  for (i = 0; i <= n - 4; i += inc) {
    // check if sum of five consecutive
    // integer is equal to n.
    if (i + i + 1 + i + 2 + i + 3 + i + 4 == n) {
      document.write(
        i + " " + (i + 1) + " " + (i + 2) + " " + (i + 3) + " " + (i + 4)
      );
      return;
    }
  }

  document.write("-1");
}

// Driver Program

var n = 15;
checksum(n);

// This code contributed by gauravrajput1

/************************************ */

// javascript Program to check if a number can
// be expressed as sum of five consecutive
// integer.

// function to check if a number can
// be expressed as sum of five
// consecutive integers.
function checksum(n) {
  // if n is multiple of 5
  if (n % 5 == 0)
    document.write(
      n / 5 -
        2 +
        " " +
        (n / 5 - 1) +
        " " +
        n / 5 +
        " " +
        (n / 5 + 1) +
        " " +
        (n / 5 + 2)
    );
  // else print "-1".
  else document.write("-1");
}

// Driver Program

var n = 15;
checksum(n);

// This code is contributed by todaysgaurav
