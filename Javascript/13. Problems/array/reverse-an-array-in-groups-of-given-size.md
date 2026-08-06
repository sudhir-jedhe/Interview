```js
/*
Input: arr = [1, 2, 3, 4, 5, 6], k=3
Output: [3, 2, 1, 6, 5, 4]

Input: arr = [1, 2, 3, 4, 5], k=2
Output: [2, 1, 3, 5, 4]
*/

function groupReverse(arr, n, k) {
  let leftStart = 0,
    leftEnd = k - 1;
  let rightStart = n - k,
    rightEnd = n - 1;
  while (leftStart < leftEnd) {
    let temp = arr[leftStart];
    arr[leftStart] = arr[leftEnd];
    arr[leftEnd] = temp;
    leftStart++;
    leftEnd--;
  }
  while (rightStart < rightEnd) {
    let temp = arr[rightStart];
    arr[rightStart] = arr[rightEnd];
    arr[rightEnd] = temp;
    rightStart++;
    rightEnd--;
  }
  console.log(arr);
}

let array = [1, 2, 3, 4, 5];
let array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
groupReverse(array, 5, 3);
groupReverse(array2, 9, 3);

/******************************************************* */
function groupReverse(arr, n, k, m) {
  let i = 0;
  while (i < n) {
    let leftStart = i;
    let leftEnd = Math.min(i + k - 1, n - 1);

    while (leftStart < leftEnd) {
      let temp = arr[leftStart];
      arr[leftStart] = arr[leftEnd];
      arr[leftEnd] = temp;
      leftStart++;
      leftEnd--;
    }
    i += k + m;
  }
  console.log(arr);
}

let array = [1, 2, 3, 4, 5, 6];
let array2 = [1, 2, 3, 4, 5, 6, 7, 8];
groupReverse(array, 6, 2, 2);
groupReverse(array2, 8, 2, 4);

/************************************************ */
/*
Input: arr = [1, 2, 3, 4, 5, 6, 7], k = 1
Output: [ [1], [3, 2], [7, 6, 5, 4] ]

Input:
arr = [1, 2, 3, 4, 5, 6], k = 2
Output: [ [2, 1], [6, 5, 4, 3] ]
*/

function groupReverse(arr, n, k) {
  let i = 0;
  while (i < n) {
    let leftStart = i;
    let leftEnd = Math.min(i + k - 1, n - 1);

    while (leftStart < leftEnd) {
      let temp = arr[leftStart];
      arr[leftStart] = arr[leftEnd];
      arr[leftEnd] = temp;
      leftStart++;
      leftEnd--;
    }
    k *= 2;
    i += k / 2;
  }
  console.log(arr);
}

let array = [1, 2, 3, 4, 5, 6];
let array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
groupReverse(array, 6, 2);
groupReverse(array2, 14, 3);
