```js
findIndexOf("hello world", "world"); // Output: 6
findIndexOf("testing", "ing"); // Output: 4
findIndexOf("abcdef", "xyz"); // Output: -1

export const findIndexOf = (string, substring) => {
  return string.indexOf(substring);
};

export const findIndexOf = (string, substring) => {
  const stringLength = string.length;
  const substringLength = substring.length;
  let matchIndex = -1;

  for (let i = 0; i <= stringLength - substringLength; i++) {
    let j;
    for (j = 0; j < substringLength; j++) {
      if (string[i + j] !== substring[j]) {
        break;
      }
    }
    if (j === substringLength) {
      matchIndex = i;
      break;
    }
  }

  return matchIndex;
};
