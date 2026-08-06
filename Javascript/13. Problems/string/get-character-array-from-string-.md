```js
// Input array
let str = "GeeksforGeeks: A computer science portal";

// Getting char array
let arr = Array.from(str);

// Display output
console.log(arr);

/*************************** */
// Input string
let str = "GeeksforGeeks";

// Use string.split() to Get Character Array
let arr = str.split("");

// Display output
console.log(arr);

/********************************************************* */
//Input array
let str = "GeeksforGeeks";

//Display output using spread operator
console.log([...str]);

/************************************ */
const s = "12345";
const a = [];
for (const s1 of s) {
  a.push(s1);
}
console.log(a);
