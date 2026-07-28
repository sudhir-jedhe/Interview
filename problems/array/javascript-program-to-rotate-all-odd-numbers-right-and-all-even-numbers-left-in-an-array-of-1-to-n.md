```js
// Input: A = {1, 2, 3, 4, 5, 6, 7, 8}
// Output: {7, 4, 1, 6, 3, 8, 5, 2}
// Explanation:
// Even element = {2, 4, 6, 8}
// Odd element = {1, 3, 5, 7}
// Left rotate of even number = {4, 6, 8, 2}
// Right rotate of odd number = {7, 1, 3, 5}
// Combining Both odd and even number alternatively.
// Input: A = {1, 2, 3, 4, 5, 6}
// Output: {5, 4, 1, 6, 3, 2}

// Javascript program to implement
// the above approach

// function to left rotate
function left_rotate(arr) {
  let last = arr[1];
  for (let i = 3; i < 6; i = i + 2) {
    arr[i - 2] = arr[i];
  }
  arr[6 - 1] = last;
}

// function to right rotate
function right_rotate(arr) {
  let start = arr[6 - 2];
  for (let i = 6 - 4; i >= 0; i = i - 2) {
    arr[i + 2] = arr[i];
  }
  arr[0] = start;
}

// Function to rotate the array
function rotate(arr) {
  left_rotate(arr);
  right_rotate(arr);
  for (let i = 0; i < 6; i++) {
    document.write(arr[i] + " ");
  }
}

let arr = [1, 2, 3, 4, 5, 6];

rotate(arr);
