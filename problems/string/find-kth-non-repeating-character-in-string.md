```js
// Input: s = 'geeksforgeeks' , K = 2
// Output: o
// Explanation: In the given string, the 2nd non-repeating character is 'o' because 'f' is the first
// character that appears only once and 'o' is the next character following it.

// Input: 'javascript', K = 4
// Output: c
// Explanation: In the given string, the 4th non-repeating character is 'c' as 'j', 'v', and 's' are the characters
// that appears only once and 'c' is the next character following it.

function kthNonRepeating(s, K) {
  const n = s.length;
  let cnt = 0,
    ans = null;

  for (let i = 0; i < n; i++) {
    let flag = 0;
    for (let j = i + 1; j < n; j++) {
      if (s[i] == s[j]) {
        flag = 1;
        break;
      }
    }

    if (!flag) {
      cnt++;
      if (cnt == K) {
        ans = s[i];
        break;
      }
    }
  }
  return ans;
}

let s = "geeksforgeeks";
let K = 3;

let res = kthNonRepeating(s, K);

if (res == null) {
  console.log(-1);
} else {
  console.log(res);
}

/********************************* */
function KthNonRepeatingChar(s, K) {
  const n = s.length;

  // Create a map
  let mp = {};
  let ans = null;

  // Iterate through the string
  for (let i = 0; i < n; i++) {
    let ch = s[i];
    if (mp[ch] == undefined) {
      mp[ch] = 1;
    } else {
      mp[ch]++;
    }
  }

  // Iterate through the string again
  // and find the Kth non-repeating character
  for (let i = 0; i < n; i++) {
    let ch = s[i];
    if (mp[ch] == 1) {
      K--;
      if (K == 0) {
        ans = ch;
      }
    }
  }

  return ans;
}

let s = "geeksforgeeks";
const K = 3;

// Function call
let ans = KthNonRepeatingChar(s, K);
console.log(ans);
