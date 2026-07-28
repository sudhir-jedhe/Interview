```js
const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const mostCommonWord = mostCommon(words);
console.log(mostCommonWord); // "apple"

export const mostCommon = (arr) => {
  const map = {};
  let maxCount = 0;
  let mostCommon = null;

  for (const element of arr) {
    if (map[element]) {
      map[element]++;
    } else {
      map[element] = 1;
    }

    if (map[element] > maxCount) {
      maxCount = map[element];
      mostCommon = element;
    }
  }

  return mostCommon;
};
