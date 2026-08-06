```js
// an associative array does not have a length property
// Function to calculate the
// length of an array
sizeOfArray = function (array) {
  // A variable to store
  // the size of arrays
  let size = 0;

  // Traversing the array
  for (let key in array) {
    // Checking if key is present
    // in arrays or not
    if (array.hasOwnProperty(key)) {
      size++;
    }
  }

  // Return the size
  return size;
};

// Driver code
let arr = { apple: 10, grapes: 20 };
arr["guava"] = 30;
arr["banana"] = 40;

// Printing the array
console.log(arr);

// Printing the size
console.log("size = " + sizeOfArray(arr));

// Adding another element to array
arr["fruits"] = 100;

// Printing the array and size again
console.log(arr);
console.log("Size = " + sizeOfArray(arr));
/*
{ apple: 10, grapes: 20, guava: 30, banana: 40 }
size = 4
{ apple: 10, grapes: 20, guava: 30, banana: 40, fruits: 100 }
Size = 5
*/

/**************************************************** */

let arr = { apple: 10, grapes: 20 };
arr["guava"] = 30;
arr["banana"] = 40;

// Printing the array
// returned by keys() method
console.log(Object.keys(arr));

// printing the size
console.log("Size = " + Object.keys(arr).length);

/********************************************** */
let obj = {
  key1: "1",
  key2: "2",
  key3: "3",
};
let length = Object.entries(obj).length;
console.log(length);
