```js
Input:
const test1 = new Promise(function (resolve, reject) {
  setTimeout(reject, 500, 'one');
});

const test2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 600, 'two');
});

const test3 = new Promise(function (resolve, reject) {
  setTimeout(reject, 200, 'three');
});

any([test1, test2, test3]).then(function (value) {
  // first and third fails, 2nd resolves
  console.log(value);
}).catch(function (err){
  console.log(err);
});

// Output:
// "two"


/*********************************************** */
Input:
const test1 = new Promise(function (resolve, reject) {
  setTimeout(reject, 500, 'one');
});

const test2 = new Promise(function (resolve, reject) {
  setTimeout(reject, 600, 'two');
});

const test3 = new Promise(function (resolve, reject) {
  setTimeout(reject, 200, 'three');
});

any([test1, test2, test3]).then(function (value) {
  console.log(value);
}).catch(function (err){
  // all three fails
  console.log(err);
});

Output:
["one","two","three"]