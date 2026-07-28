```js
const longestPalindrome = (s) => {
  let max = Number.MIN_SAFE_INTEGER;
  let palindromeStr = "";

  for (let i = 0; i < s.length; i++) {
    //If we have already have palindrome string
    //Greater than remaining string to be checked
    //Then break
    if (max > s.length - i) {
      break;
    }

    let forward = "";
    let reverse = "";

    for (let j = i; j < s.length; j++) {
      //Forward substring
      forward = forward + s[j];

      //Reverse substring
      reverse = s[j] + reverse;

      //If forward === reverse then it is a palindrome
      //So store if it is greater than max
      if (forward === reverse && max < forward.length) {
        max = forward.length;
        palindromeStr = forward;
      }
    }
  }

  return palindromeStr;
};

Input: console.log(longestPalindrome("abbc"));
console.log(longestPalindrome("babad"));
console.log(longestPalindrome("adccda"));

Output: "bb";
("bab");
("adccda");



/***************************** */

function longestPalindrome(s) {
  if (s.length < 1) return "";
  
  let start = 0;
  let end = 0;
  
  for (let i = 0; i < s.length; i++) {
      // Expand around center for odd-length palindromes (single character center)
      let len1 = expandAroundCenter(s, i, i);
      // Expand around center for even-length palindromes (two adjacent characters center)
      let len2 = expandAroundCenter(s, i, i + 1);
      
      // Find the maximum length palindrome centered at current position
      let maxLength = Math.max(len1, len2);
      
      // Update the start and end indices if we found a longer palindrome
      if (maxLength > end - start) {
          start = i - Math.floor((maxLength - 1) / 2);
          end = i + Math.floor(maxLength / 2);
      }
  }
  
  return s.substring(start, end + 1);
}

function expandAroundCenter(s, left, right) {
  // Expand around the center defined by indices left and right
  while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
  }
  // Return the length of the palindrome found
  return right - left - 1;
}

// Test cases
console.log(longestPalindrome("babad")); // Output: "bab" or "aba"
console.log(longestPalindrome("cbbd")); // Output: "bb"


/*************************************** */


function longestPalindrome(s) {
  const n = s.length;
  // Create a boolean table to store dp results (is s[i:j+1] a palindrome)
  const dp = Array.from({ length: n }, () => Array(n).fill(false));

  // Base cases: single character and adjacent characters are palindromes
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
    if (i < n - 1 && s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
    }
  }

  // Find the longest palindrome using dynamic programming
  let maxLen = 1;
  let start = 0;
  for (let l = 2; l <= n; l++) {  // Length of the substring
    for (let i = 0; i < n - l + 1; i++) {  // Starting index of the substring
      const j = i + l - 1; // Ending index of the substring
      if (s[i] === s[j] && (dp[i + 1][j - 1] || l === 2)) {
        dp[i][j] = true;
        if (l > maxLen) {
          maxLen = l;
          start = i;
        }
      }
    }
  }

  return s.substring(start, start + maxLen);
}

// Examples
console.log(longestPalindrome("babad")); // Output: "bab"
console.log(longestPalindrome("cbbd")); // Output: "bb"
