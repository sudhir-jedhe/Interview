```js
// Size of chunk
let chunk = 4;

// Input array
let arr = [1, 2, 3, 4, 5, 6, 7, 8];

// Spiltted arrays
let arr1 = arr.slice(0, chunk);
let arr2 = arr.slice(chunk, chunk + arr.length);

// Display Output
console.log("Array1: " + arr1 + "\nArray2: " + arr2);

/************************** */

// Size of aaray chunks
let chunk = 2;

// Input array
let arr = [1, 2, 3, 4, 5, 6, 7, 8];

// Splitted arrays
let arr1 = arr.splice(0, chunk);
let arr2 = arr.splice(0, chunk);
let arr3 = arr.splice(0, chunk);
let arr4 = arr.splice(0, chunk);

// Display output
console.log("Array1: " + arr1);
console.log("Array2: " + arr2);
console.log("Array3: " + arr3);
console.log("Array4: " + arr4);

/************************************* */
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let chunkSize = 3;
let chunks = [];

for (let i = 0; i < numbers.length; i += chunkSize) {
  chunks.push(numbers.slice(i, i + chunkSize));
}
console.log(chunks); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

/************************************ */
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let chunkSize = 3;
let chunks = Array.from(
  { length: Math.ceil(numbers.length / chunkSize) },
  (_, i) => numbers.slice(i * chunkSize, i * chunkSize + chunkSize)
);
console.log(chunks); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
