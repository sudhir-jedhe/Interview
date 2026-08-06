```js
function nextGreater(num) {
  let i = num.length - 1;

  while (i >= 0) {
    if (num[i] === "0") {
      num = num.substring(0, i) + "1" + num.substring(i + 1);
      break;
    } else {
      num = num.substring(0, i) + "0" + num.substring(i + 1);
    }
    i--;
  }

  if (i < 0) {
    num = "1" + num;
  }

  return num;
}

// Driver program to test above
let num = "1101";
console.log("Binary representation of next number = " + nextGreater(num));

/****************************************** */

// JavaScript Code for the above approach
function nextGreater(num) {
  // Convert binary string to integer
  const n = parseInt(num, 2);

  // Increment integer by 1
  const nextNum = n + 1;

  // Convert integer back to binary string
  let result = nextNum.toString(2);

  // Remove leading zeros
  result = result.replace(/^0+/, "");

  return result;
}

// Driver code
const num = "110011";
console.log("Binary representation of next number =", nextGreater(num));
