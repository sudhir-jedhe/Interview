```js
// array left rotation by d positions.
/*
Input: 
arr[] = {1, 2, 3, 4, 5, 6, 7}, d = 2
Output: 3 4 5 6 7 1 2

Input: arr[] = {3, 4, 5, 6, 7, 1, 2}, d=2
Output: 5 6 7 1 2 3 4
*/
function Rotate_and_Print(arr, d, n) {
  //Initializing array temp with size n
  var temp = new Array(n);

  let k = 0;

  // Storing the n - d elements of
  // array arr[] to the front of temp[]
  for (let i = d; i < n; i++) {
    temp[k] = arr[i];
    k++;
  }

  // Storing the first d elements of array arr[]
  // into temp
  for (let i = 0; i < d; i++) {
    temp[k] = arr[i];
    k++;
  }
  //Printing the temp array which stores the result
  for (let i = 0; i < n; i++) {
    console.log(temp[i] + " ");
  }
}

let arr = [1, 2, 3, 4, 5, 6, 7];
let n = arr.length;
let d = 2; //number of times rotating the array
Rotate_and_Print(arr, d, n);

//contributed by keerthikarathan123

/********************************************************* */

function printArray(arr, n, d) {
  let p = 1;
  while (p <= d) {
    let last = arr[0];
    for (let i = 0; i < n - 1; i++) {
      arr[i] = arr[i + 1];
    }
    arr[n - 1] = last;
    p++;
  }

  for (let i = 0; i < n; i++) {
    console.log(arr[i] + " ");
  }
}
let arr = [1, 2, 3, 4, 5, 6, 7];
let n = arr.length;
let d = 2; //number of times rotating the array

// Function calling
printArray(arr, n, d);

//contributed by keerthikarathan123

/*
Instead of moving one by one, divide the array into different sets where the number of sets is equal to the GCD of N and d (say X. So the elements which are X distance apart are part of a set) and rotate the elements within sets by 1 position to the left. 

Calculate the GCD between the length and the distance to be moved.
The elements are only shifted within the sets.
We start with temp = arr[0] and keep moving arr[I+d] to arr[I] and finally store temp at the right place.
*/

// Let arr[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14} and d = 10

// First step:
//        => First set is {0, 5, 10}.
//        => Rotate this set by d position in cyclic order
//        => arr[0] = arr[0+10]
//        => arr[10] = arr[(10+10)%15]
//        => arr[5] = arr[0]
//        => This set becomes {10,0,5}
//        => Array arr[] = {10, 1, 2, 3, 4, 0, 6, 7, 8, 9, 5, 11, 12, 13, 14}

// Second step:
//        => Second set is {1, 6, 11}.
//        => Rotate this set by d position in cyclic order.
//        => This set becomes {11, 1, 6}
//        => Array arr[] =  {10, 11, 2, 3, 4, 0, 1, 7, 8, 9, 5, 6, 12, 13, 14}

// Third step:
//        => Second set is {2, 7, 12}.
//        => Rotate this set by d position in cyclic order.
//        => This set becomes {12, 2, 7}
//        => Array arr[] =  {10, 11, 12, 3, 4, 0, 1, 2, 8, 9, 5, 6, 7, 13, 14}

// Fourth step:
//        => Second set is {3, 8, 13}.
//        => Rotate this set by d position in cyclic order.
//        => This set becomes {13, 3, 8}
//        => Array arr[] =  {10, 11, 12, 13, 4, 0, 1, 2, 3, 9, 5, 6, 7, 8, 14}

// Fifth step:
//        => Second set is {4, 9, 14}.
//        => Rotate this set by d position in cyclic order.
//        => This set becomes {14, 4, 9}
//        => Array arr[] =  {10, 11, 12, 13, 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9}

// JavaScript program to rotate an array by
// d elements

/*Function to get gcd of a and b*/
function gcd(a, b) {
  if (b == 0) return a;
  else return gcd(b, a % b);
}

/*Function to left rotate arr[] of size n by d*/
function leftRotate(arr, d, n) {
  /* To handle if d >= n */
  d = d % n;
  let g_c_d = gcd(d, n);
  for (let i = 0; i < g_c_d; i++) {
    /* move i-th values of blocks */
    let temp = arr[i];
    let j = i;

    while (1) {
      let k = j + d;
      if (k >= n) k = k - n;

      if (k == i) break;

      arr[j] = arr[k];
      j = k;
    }
    arr[j] = temp;
  }
}

// Function to print an array
function printArray(arr, size) {
  for (let i = 0; i < size; i++) document.write(arr[i] + " ");
}

/* Driver program to test above functions */
let arr = [1, 2, 3, 4, 5, 6, 7];
let n = arr.length;
// Function calling
leftRotate(arr, 2, n);
printArray(arr, n);
