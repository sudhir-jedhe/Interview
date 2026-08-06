```js
let zigzagMatrix = (arr) => {
  //loop through the array
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 != 0) {
      //If it is odd row then print in reverse direction
      for (let j = arr[i].length - 1; j >= 0; j--) {
        console.log(arr[i][j]);
      }
    } else {
      //If it is even row then print in normal direction
      for (let j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
      }
    }
  }
};

Input: zigzagMatrix([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 0, 1, 2],
]);

Output: 1;
2;
3;
4;
8;
7;
6;
5;
9;
0;
1;
2;
