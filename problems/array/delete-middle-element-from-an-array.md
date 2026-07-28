```js
// Input array
let Arr = [1, 2, 3, 4, 5, 6];

// Index of deleting element
let middleIndex = Math.floor(Arr.length / 2);
let newArray = [...Arr.slice(0, middleIndex), ...Arr.slice(middleIndex + 1)];

console.log(newArray);

/*********************************************** */

// Input array
let Arr = [1, 2, 3, 4, 5, 6];

// Index of deleting element
let middleIndex = Math.floor(Arr.length / 2);
Arr.splice(middleIndex, 1);

console.log(Arr);

/********************************************************** */

// Input array
let Arr = [1, 2, 3, 4, 5, 6];

// Index of deleting element
let index = Math.floor(Arr.length / 2);
delete Arr[index];

console.log(Arr);

/***************************************************************** */
// Input array
let Arr = [1, 2, 3, 4, 5, 6];

// Index of deleting element
let middleIndex = Math.floor(Arr.length / 2);
let newArray = Arr.filter((e, i) => i !== middleIndex);

console.log(newArray);
