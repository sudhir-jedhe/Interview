```js
isPalindrome(123321); // Output: true
isPalindrome(12321); // Output: true
isPalindrome(123); // Output: false

export const isPalindrome = (number) => {
  const stringNum = number.toString();
  return (stringNum === stringNum.split("").reverse().join("")) === true
    ? true
    : false;
};

export const isPalindrome = (str) => {
  str = str.toLowerCase();
  return str === str.split("").reverse().join("");
};

export const isPalindrome = (str) => {
  str = str.toLowerCase();
  let start = 0,
    end = str.length - 1;
  while (start < end) {
    if (str[start] !== str[end]) return false;
    start++;
    end--;
  }
  return true;
};

// palindromeArray

let palindromeArray = (arr) => {
  //initialize to true
  let isPalindrome = true;

  //loop through half length of the array
  for (let i = 0; i < arr.length / 2; i++) {
    //check if first half is equal to the second half
    if (arr[i] !== arr[arr.length - i - 1]) {
      isPalindrome = false;
      break;
    }
  }

  return isPalindrome;
};

Input: console.log(palindromeArray([1, 2, 2, 1]));
console.log(palindromeArray([1, 2, 2, 2]));

Output: true;
false;

let palindromeArray = (arr, start = 0, end = arr.length - 1) => {
  //if array has only element
  if (start >= end) {
    return true;
  }

  //if start is equal to end
  if (arr[start] === arr[end]) {
    //call the same function
    return palindromeArray(arr, start + 1, end - 1);
  } else {
    //else not palindrome
    return false;
  }
};

Input: console.log(palindromeArray([1, 2, 2, 1]));
console.log(palindromeArray([1, 2, 2, 2]));

Output: true;
false;
```
