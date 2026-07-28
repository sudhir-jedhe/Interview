```js
Count value occurrences in an array
Array.prototype.reduce() provides the most straightforward way to count the occurrences of a value in an array. Simply increment a counter each time the specific value is encountered inside the array and return the final count.

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
💬  Note
You can count the occurrences of all values in an array, as described in the previous article.

Count value occurrences in a string
Counting the occurrences of a value in a string is a bit more complex than in an array. You can use Array.prototype.indexOf() to look for the value in the string and increment a counter each time it's found. Update the index to the next position after the value is found and continue the search until the value is no longer found, using a while loop. The loop terminates when Array.prototype.indexOf() returns -1.

const countSubstrings = (str, searchValue) => {
  let count = 0,
    i = 0;
  while (true) {
    const r = str.indexOf(searchValue, i);
    if (r !== -1) [count, i] = [count + 1, r + 1];
    else return count;
  }
};

countSubstrings('tiktok tok tok tik tok tik', 'tik'); // 3
countSubstrings('tutut tut tut', 'tut'); // 4
