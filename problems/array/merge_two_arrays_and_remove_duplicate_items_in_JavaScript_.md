```js
let arr1 = [1, 2, 3, 4, 5, 6]; 
let arr2 = [3, 4, 5, 7];
let arr = [...arr1, ...arr2];
let mergedArr = [...new Set(arr)]
console.log(mergedArr);

/************************************* */


let arr1 = [1, 2, 3, 4, 5, 6]; 
let arr2 = [3, 4, 5, 7];
let arr = arr1.concat(arr2);
let mergedArr = [...new Set(arr)]
console.log(mergedArr);


/****************************** */

let arr1 = [1, 5, 3];
let arr2 = [4, 5, 6];
let newArr = arr1.concat(arr2.
    filter((item) => arr1.indexOf(item) < 0));
console.log(newArr);

