```js
export const removeVowels = (str) => {
  const vowels = ["a", "e", "i", "o", "u"];

  const chars = str.split("");

  const filteredChars = chars.filter(
    (char) => !vowels.includes(char.toLowerCase()),
  );

  const result = filteredChars.join("");

  return result;
};

removeVowels("Hello, World!"); // Output: "Hll, Wrld!"
removeVowels("hello world"); // Output: "hll wrld"
removeVowels("programming is fun"); // Output: "prgrmmng s fn"
```
