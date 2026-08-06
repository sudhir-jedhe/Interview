```js
sortStrings(["apple", "banana", "pear", "banana", "orange", "apple"]); // Output: ['aelpp', 'aaabnn', 'aepr', 'aaabnn', 'aegnor', 'aelpp']
sortStrings(["Orange", "apple", "Banana", "pear"]); // Output: ['aegnor', 'aelpp', 'aaabnn', 'aepr']
sortStrings(["orange", "apple", "123", "!banana", "pear"]); // Output: ['aegnor', 'aelpp', '123', 'aabnn!', 'aepr']

export const sortStrings = (array) => {
  const newArray = array.slice();

  newArray.forEach((string, index) => {
    const sortedChars = string.split("").sort().join("");
    newArray[index] = sortedChars;
  });

  return newArray;
};
