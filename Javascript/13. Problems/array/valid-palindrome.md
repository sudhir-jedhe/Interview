```js
"abca";
"abc";
"ymdadmt";

Output: true; // removing 'c' will make the string palindrome "aba"
false;
false;

const solution = (s) => {
  //split the string to array of characters
  const arr = s.split("");

  //iterate array and check if palindrome can be found
  for (let i = 0; i < arr.length; i++) {
    //if palindrome is found
    if (isPalindrome(arr, i)) {
      return true;
    }
  }

  //if no palindrome found
  return false;
};

const isPalindrome = (arr, index) => {
  // remove the character from the array
  const filtered = arr.filter((e, i) => i !== index);

  //length of the filtered array
  const n = filtered.length;

  //check if filtered array is palindrome
  for (let i = 0; i < n / 2; i++) {
    if (filtered[i] !== filtered[n - i - 1]) {
      return false;
    }
  }

  return true;
};

/********************************** */
// remove the i'th character from the string
const cut = (s, i) => s.substr(0, i) + s.substr(i + 1);

const solution = (s, n = s.length) => {
  // revesed string
  const reversed = s.split("").reverse().join("");

  //base case
  if (reversed === s) {
    return true;
  }

  //iterate array and check if palindrome can be found
  for (let i = 0; i < n; i++) {
    //index from start
    const start = i;

    //index from rear
    const end = n - i - 1;

    //get the updated string by removing the characters
    const nTransformed = cut(s, start);
    const rTransformed = cut(reversed, end);

    //if both string match, then it is palindrome
    if (nTransformed === rTransformed) {
      return true;
    }
  }

  //if no palindrome found
  return false;
};
