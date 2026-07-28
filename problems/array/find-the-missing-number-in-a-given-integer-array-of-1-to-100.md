```js
// Input: arr[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, /* Missing number */,12, /* ... */, 100];
// Size of an array is 100
// Output: 11
// Explanation: The missing number between 1 to 100 is 11

function findMissingNumber(arr) {
  const n = 100;
  const sumOfFirstN = (n * (n + 1)) / 2;

  const sumOfArray = arr.reduce((acc, num) => acc + num, 0);
  const missingNumber = sumOfFirstN - sumOfArray;

  return missingNumber;
}

const array = Array.from({ length: 99 }, (_, index) => index + 1);
const missingNumber = findMissingNumber(array);
console.log("Missing number is:", missingNumber);

/************************************************ */

function findMissingNumber(arr) {
  const n = 100;
  const allNumbers = new Set(Array.from({ length: n }, (_, i) => i + 1));

  for (const num of arr) {
    allNumbers.delete(num);
  }

  // At this point, the 'allNumbers'
  //set contains only the missing number(s).
  const missingNumbers = Array.from(allNumbers);
  return missingNumbers;
}

// Remove 66 value from this array
const array = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  100,
];
const missingNumber = findMissingNumber(array);
console.log("Missing number is:", missingNumber);

/*********************************************** */

function missingNumber(arr) {
  const numberObj = {};
  for (const num of arr) {
    numberObj[num] = true;
  }
  for (let i = 1; i <= 100; i++) {
    if (!numberObj[i]) {
      return i;
    }
  }
}

const integer = [1, 2, 3, 4 /* ... */, , 99, 100];
const result = missingNumber(integer);
console.log("Missing number:", result);
