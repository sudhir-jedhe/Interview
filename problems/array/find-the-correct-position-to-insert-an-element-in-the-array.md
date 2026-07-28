```js
Input: [1, 3, 5, 6];
(5)[(1, 3, 5, 6)];
(2)[(1, 3, 5, 6)];
(7)[(1, 3, 5, 6)];
0;

Output: 2; //5 is present at index 2 in [1, 3, 5, 6]
1; //2 can be inserted after 1 and before 3 at position 1 in [1, 3, 5, 6]
4; //7 can be inserted after 6 at position 4
0; //0 can be inserted before 1 at position 0

let searchInsert = (nums, target) => {
  //keep track of the element
  let found = 0;
  let isFound = false;

  //check if element is already present
  for (let i = 0; i < nums.length; i++) {
    //if element is found then return its position
    if (target === nums[i]) {
      found = i;
      isFound = true;
      break;
    }
  }

  //if an element is not found then find the position where it can be inserted
  if (!isFound) {
    for (let i = 0; i < nums.length; i++) {
      //if the target element is less than the element in the array then add it before
      if (target < nums[i]) {
        found = i;
        isFound = true;
        break;
      }
    }
  }

  //if position is found then return it else return the position after the last element in the array
  return isFound ? found : nums.length;
};

Input: console.log(searchInsert([1, 3, 5, 6], 5));
console.log(searchInsert([1, 3, 5, 6], 2));
console.log(searchInsert([1, 3, 5, 6], 7));
console.log(searchInsert([1, 3, 5, 6], 0));

Output: 2;
1;
4;
0;



var searchInsert = function (nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
      const mid = (left + right) >> 1;
      if (nums[mid] >= target) {
          right = mid;
      } else {
          left = mid + 1;
      }
  }
  return left;
};