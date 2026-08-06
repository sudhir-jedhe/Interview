```js
// Given N as the number of digits, the task is to find all the Autobiographical Numbers whose length is equal to N.

// An autobiographical number is a number such that the first digit of it counts how many zeroes are there in it,
// the second digit counts how many ones are there and so on.
// For example, 1210 has 1 zero, 2 ones, 1 two and 0 threes.

// Input: N = 4
// Output: 1210, 2020

// Input: N = 5
// Output: 21200

// JavaScript implementation to find
// Autobiographical numbers with length N

// Function to return if the
// number is autobiographical or not
function isAutoBio(num) {
  // Converting the integer
  // number to string
  let autoStr = num.toString();

  for (let i = 0; i < autoStr.length; i++) {
    // Extracting each character
    // from each index one by one
    // and converting into an integer
    let index = parseInt(autoStr[i]);

    // Initialize count as 0
    let cnt = 0;

    for (let j = 0; j < autoStr.length; j++) {
      let number = parseInt(autoStr[j]);

      // Check if it is equal to the
      // index i if true then
      // increment the count
      if (number == i) {
        // It is an
        // Autobiographical
        // number
        cnt += 1;
      }
    }

    // Return false if the count and
    // the index number are not equal
    if (cnt != index) {
      return false;
    }
  }

  return true;
}

// Function to print autobiographical number
// with given number of digits
function findAutoBios(n) {
  // Left boundary of interval
  let low = parseInt(Math.pow(10, n - 1));

  // Right boundary of interval
  let high = parseInt(Math.pow(10, n) - 1);

  let flag = 0;

  for (let i = low; i < high + 1; i++) {
    if (isAutoBio(i)) {
      flag = 1;
      document.write(i, ", ");
    }
  }

  // Flag = 0 implies that the number
  // is not an autobiographical no.
  if (flag == 0)
    document.write(
      "There is no Autobiographical Number with " + n + " digits",
      "</br>"
    );
}

// Driver Code

let N = 0;
findAutoBios(N);

N = 4;
findAutoBios(N);

// This code is contributed by shinjanpatra
