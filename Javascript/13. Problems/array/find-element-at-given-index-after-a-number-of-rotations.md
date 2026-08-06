```js
// Input : arr[] : {1, 2, 3, 4, 5}
//         ranges[] = { {0, 2}, {0, 3} }
//         index : 1
// Output : 3
// Explanation : After first given rotation {0, 2}
//                 arr[] = {3, 1, 2, 4, 5}
//               After second rotation {0, 3}
//                 arr[] = {4, 3, 1, 2, 5}
// After all rotations we have element 3 at given
// index 1.

// JavaScript code to rotate an array
// and answer the index query

// Function to compute the element at
// given index
let findElement = (arr, ranges, rotations, index) => {
  for (let i = rotations - 1; i >= 0; i--) {
    // Range[left...right]
    let left = ranges[i][0];
    let right = ranges[i][1];

    // Rotation will not have any effect
    if (left <= index && right >= index) {
      if (index == left) index = right;
      else index--;
    }
  }

  // Returning new element
  return arr[index];
};

// Driver Code
let arr = [1, 2, 3, 4, 5];

// No. of rotations
let rotations = 2;

// Ranges according to 0-based indexing
let ranges = [
  [0, 2],
  [0, 3],
];

let index = 1;

document.write(findElement(arr, ranges, rotations, index));
