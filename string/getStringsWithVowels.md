```js
getStringsWithVowels(["apple", "banana", "orange", "pear"]); // Output: ['apple', 'orange']
getStringsWithVowels(["Elephant", "Zebra", "Ostrich", "Umbrella"]); // Output: ['Elephant', 'Umbrella']
getStringsWithVowels(["cat", "dog", "elephant", "pig"]); // Output: ['elephant']
getStringsWithVowels([]); // Output: []

export const getStringsWithVowels = (array) => {
  const vowels = ["a", "e", "i", "o", "u"];
  return array.filter((string) => {
    return vowels.includes(string.charAt(0).toLowerCase());
  });
};
```
