```js
// Input  : n = 10
// Output : true
// It can be expressed as sum of two consecutive
// numbers 1 + 2 + 3 + 4.
// Input  : n = 16
// Output : false
// It cannot be expressed as sum of two consecutive
// numbers.
// Input  : n = 5
// Output : true
// 2 + 3 = 5

// Javascript program to check if a number can
// be expressed as sum of consecutive numbers

// This function returns true if n can be
// expressed sum of consecutive.
function canBeSumofConsec(n) {
  // We basically return true if n is a
  // power of two
  return (n & (n - 1)) != 0 && n != 0;
}

// function call

let n = 15;
document.write(canBeSumofConsec(n) ? "true" : "false");
