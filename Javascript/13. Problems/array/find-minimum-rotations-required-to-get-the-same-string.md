```js
// Input: str = "geeks"
// Output: 5
// Explanation:
// i=1 : substring ="eekgeeks"
// i=2 : substring ="ekgeeks"
// i=3 : substring ="kgeeks"
// i=4 : substring ="kgee"
// i=5 : substring ="geeks"
// Example 2:

// Input: str = "abc"
// Output: 3

function minRotations(str) {
  let temp = str + str;
  let n = str.length;

  for (let i = 1; i <= n; i++) {
    // Use i + n to get the correct substring
    let substr = temp.substring(i, i + n);
    if (str === substr) {
      return i;
    }
  }
  return n;
}

let str = "geeks";
console.log("Minimum Number of Rotations Required are:", minRotations(str));

let str2 = "zzzz";
console.log("Minimum Number of Rotations Required are:", minRotations(str2));

/********************************************* */
function minRotations(str) {
  let res = 0;
  let n = str.length;

  for (let i = 1; i < n; i++) {
    if (str.substring(i) + str.substring(0, i) === str) {
      res = i;
      break;
    }
  }

  if (res === 0) return n;

  return res;
}

let str = "Geeks";
console.log("Minimum Number of Rotations Required are:", minRotations(str));

let str2 = "aaa";
console.log("Minimum Number of Rotations Required are:", minRotations(str2));
