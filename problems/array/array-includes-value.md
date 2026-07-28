```js
const array = [1, 2, 3, 4, 5];

array.includes(3); // true
array.includes(6); // false
array.includes(3, 3); // false

/************** */

const array = [{ a: 1 }, { a: 2 }, { a: 3 }];

const equals = (a, b) => Object.keys(a).every(key => a[key] === b[key]);

array.some(item => equals(item, { a: 2 })); // true
array.some(item => equals(item, { a: 4 })); // false