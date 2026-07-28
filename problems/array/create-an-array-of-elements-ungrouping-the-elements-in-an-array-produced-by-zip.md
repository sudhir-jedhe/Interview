```js
// Zip creates an array of elements, grouped based on their position in the original arrays

const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));

  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, j) => arrays[j][i]);
  });
};
console.log(
  zip(
    [1, "GFG", 0.1],
    [2, "GeeksForGeeks", 0.2],
    [3, "Geeks", 0.3],
    [4, "For", 0.4],
    [5, "Geeks", 0.5]
  )
);
/*
[1,2,3,4,5]
['GFG', ...]
[0.1,0.2,0.3,0.4,0.5]


*/

// /******************************************************** */
// Now let us look at how we can implement unzip:

// Math.max(): Get the longest subarray in the array.
// Array.prototype.map(): Make each array element into an array.
// Array.prototype.reduce() and Array.prototype.forEach(): Map the grouped values to individual arrays.
// Lastly, Array.prototype.map() and the spread operator (…) are used to apply the f parameter
// in the unzip function to each individual group of elements.

const unzip = (arr, f) =>
  arr
    .reduce(
      (a, myValue) => (myValue.forEach((val, i) => a[i].push(val)), a),
      Array.from({
        length: Math.max(...arr.map((myArr) => myArr.length)),
      }).map((myArr) => [])
    )
    .map((v) => f(...v));
console.log(
  unzip(
    [
      [1, 3, 5],
      [2, 6, 10],
      [3, 9, 15],
    ],
    (...arguments) => arguments.reduce((acc, j) => acc + j, 0)
  )
);

// [3,6,18]
