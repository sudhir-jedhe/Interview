```js
areAnagrams("cinema", "iceman"); // Output: true
areAnagrams("restful", "fluster"); // Output: true
areAnagrams("hello", "world"); // Output: false
areAnagrams("eat", "ate"); // Output: false

export const areAnagrams = (strOne, strTwo) => {
  strOne = strOne.toLowerCase();
  strTwo = strTwo.toLowerCase();

  if (strOne.length !== strTwo.length) {
    return false;
  }

  const sortedStrOne = strOne.split("").sort().join("");
  const sortedStrTwo = strTwo.split("").sort().join("");

  return sortedStrOne === sortedStrTwo;
};
```
