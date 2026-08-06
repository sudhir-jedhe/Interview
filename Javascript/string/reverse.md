```js
function reverseString(str) {
  const reversedString = str.split("").reduce((acc, char) => char + acc, "");
  console.log(reversedString);
}
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = str.split("").reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/***************************** */
// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*********************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reduce((x, y) => y.concat(x));
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */
// Function to reverse string
function reverseString(str) {
  let strRev = "";
  for (let i = str.length - 1; i >= 0; i--) {
    strRev += str[i];
  }
  console.log(strRev);
}



function reverseString(str) {
  // Base case: if the string is empty or has only one character, return the string
  if (str.length <= 1) {
    return str;
  }
  // Recursive case: return the last character + reverseString of all characters except the last
  return str.charAt(str.length - 1) + reverseString(str.substring(0, str.length - 1));
}
// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************************** */
function strReverse(str) {
  if (str === "") {
    return "";
  } else {
    return strReverse(str.substr(1)) + str.charAt(0);
  }
}
console.log(strReverse("GeeksforGeeks"));
console.log(strReverse("JavaScript"));
console.log(strReverse("TypeScript"));

/************************************* */
function reverseString(str) {
  return [...str].reduceRight((accumulator, current) => accumulator + current);
}


var reverseString = function (s) {
  for (let i = 0, j = s.length - 1; i < j; ++i, --j) {
      [s[i], s[j]] = [s[j], s[i]];
  }
};

// Given a string s and an integer k, reverse the first k characters for every 2k characters counting from the start of the string.


// Input: s = "abcdefg", k = 2
// Output: "bacdfeg"
// Example 2:

// Input: s = "abcd", k = 2
// Output: "bacd"



function reverseStr(s: string, k: number): string {
  const n = s.length;
  const cs = s.split('');
  for (let i = 0; i < n; i += 2 * k) {
      for (let l = i, r = Math.min(i + k - 1, n - 1); l < r; l++, r--) {
          [cs[l], cs[r]] = [cs[r], cs[l]];
      }
  }
  return cs.join('');
}
```
