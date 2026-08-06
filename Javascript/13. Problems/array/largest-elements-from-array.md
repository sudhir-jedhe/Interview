```js
/*
Input: arr = [1, 2, 3, 4, 5, 6], n = 3;
Output: 4, 5, 6
Explanation: Here we will see the 3 largest elements in the given array are 4, 5, 6.

Input: arr = [5, 76, 32, 98, 52, 57] n = 2;
Output: 98 , 76
*/

let largArr = new Array();
let arr = new Array(93, 17, 56, 91, 98, 33, 9, 38, 55, 78, 29, 81, 60);

function largest() {
  largArr[0] = 0;
  largArr[1] = 0;
  largArr[2] = 0;

  for (i = 0; i < arr.length; i++) {
    if (arr[i] > largArr[0]) {
      largArr[0] = arr[i];
    }
  }

  for (i = 0; i < arr.length; i++) {
    if (arr[i] > largArr[1] && arr[i] < largArr[0]) {
      largArr[1] = arr[i];
    }
  }

  for (i = 0; i < arr.length; i++) {
    if (arr[i] > largArr[2] && arr[i] < largArr[1]) {
      largArr[2] = arr[i];
    }
  }

  console.log(largArr[0]);
  console.log(largArr[1]);
  console.log(largArr[2]);
}

largest();

/********************************************* */
let largArr = new Array();
let arr = new Array(93, 17, 56, 91, 98, 33, 9, 38, 55, 78, 29, 81, 60);

findLargest3();

function findLargest3() {
  arr.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

  console.log(arr[0]);
  console.log(arr[1]);
  console.log(arr[2]);

  console.log(arr.slice(0, 3));
}
