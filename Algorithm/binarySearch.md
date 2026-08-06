function bsearch(arr, l, r, x) {
    if (r >= l) {
        let mid = l + Math.floor((r - l) / 2);
 
        if (arr[mid] == x)
            return mid;
 
        if (arr[mid] > x)
            return bsearch(arr, l, mid - 1, x);
 
        return bsearch(arr, mid + 1, r, x);
    }
 
    return -1;
 
}
 
let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
// To check if 85 is present or not
console.log("Is 85 present? " + (bsearch(num, 0, num.length, 85) != -1));
 
// To check if 1 is present or not
console.log("Is 1 present? " + (bsearch(num, 0, num.length, 1) != -1));


/***************************************************** */
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      start = mid + 1;
    }
    if (arr[mid] > target) {
      end = mid - 1;
    }
  }
  return false;
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));


/********************************************* */


/**
 * Problem: Binary Search: Search a sorted array for a target value.
 */

// Time: O(log n)
const binarySearch = (arr, target) => {
    return binarySearchHelper(arr, target, 0, arr.length - 1);
  };
  
  const binarySearchHelper = (arr, target, start, end) => {
    if (start > end) {
      return false;
    }
    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      return binarySearchHelper(arr, target, mid + 1, end);
    }
    if (arr[mid] > target) {
      return binarySearchHelper(arr, target, start, mid - 1);
    }
  };
  
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const target = 5;
  console.log(binarySearch(arr, target));