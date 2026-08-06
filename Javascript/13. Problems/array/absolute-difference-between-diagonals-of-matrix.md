```js
Input:
1, 2, 2
4, 25, 6
7, 8, 9

Output:
(1 + 25 + 9) - (7 + 25 + 2) = 1


let matrixDiff = (arr) => {
    //Store the sum of the diagonals
    let d1 = 0;
    let d2 = 0;
  
    //Keep track of the diagonals
    let top = 0;
    let bottom = arr.length - 1;
  
    //Loop through the length of column 
    //and sum all the elements of the diagonals
    for(let i = 0; i < arr[0].length; i++){
      d1 += arr[top++][i];
      d2 += arr[bottom--][i];
    }
    
    //Return the absolute difference
    return Math.abs(d1 - d2);
  }

  Input:
let arr = [
  [1, 2, 2],
  [4, 25, 6],
  [7, 8, 9]
]

console.log(matrixDiff(arr));

Output:
1



1, 2, 2
4, 25, 6
7, 8, 9

d1 = 1;
d2 = 7;

/***************/

1, 2, 2
4, 25, 6
7, 8, 9

d1 = 26
d2 = 32

/**************/

1, 2, 2
4, 25, 6
7, 8, 9

d1 = 35
d2 = 34