// Move Element
// Given an array and a target value, move all instances of that target value to the end end of the array

// Example
// Input
// Input: [2, 1, 2, 2, 2, 3, 4, 2];
// Target: 2
// Output
// Output: [4, 1, 3, 2, 2, 2, 2, 2]
// Explanation
// All the occurences of 2 are moved at the end of the array.

// Example
// Input
// Input: [1, 1, 1, 1, 1, 4, 1, 1, 1, 1];
// Target: 1
// Output
// Output: [4, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// Explanation
// All the occurences of 1 are moved at the end of the array.

// Constraints
// 0 <= Input Array <= 10^3


// Time: O(N)
const moveElementToEnd = (arr, val) => {
    let left = 0;
    let right = arr.length - 1;
  
    while (left < right) {
      if (arr[left] === val) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        right--;
      } else {
        left++;
      }
    }
    return arr;
  };
  
  const arr = [2, 1, 2, 2, 2, 3, 4, 2];
  console.log(moveElementToEnd(arr, 2));


  const moveToEnd = (arr, element) => {

    let left = 0;
    let right = arr.length - 1

    while(left < right) {
      if(arr[left] === element) {
        arr.splice(left, 1)
        arr.push(element)
        left++;
        right++;
      } else { left++}
    }
  }
  

  const moveToEnd = (array, value) => {

    const filteredArray = array.filter(item => item !== value);
    const originalArrLength = array.length;
    const duplicateCountArrayLength = originalArrLength -filteredArray.length
    return duplicateCountArrayLength > 0 ?  [...filteredArray, ...Array(duplicateCountArrayLength).fill(value)] : array;

  }


  const moveToEnd = (arr, element) => {
    let count = 0;  // To track how many times `element` appears
  
    // Loop through the array and collect elements that are not `element`
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        count++;
      } else {
        // Move non-matching elements to the front
        arr[i - count] = arr[i];
      }
    }
  
    // Fill the end of the array with the `element`
    for (let i = arr.length - count; i < arr.length; i++) {
      arr[i] = element;
    }
  };
  

  const moveToEnd = (arr, element) => {
    // Use reduce to accumulate non-element items and count the element occurrences
    const result = arr.reduce((acc, curr) => {
      if (curr === element) {
        acc.count++;
      } else {
        acc.nonElementItems.push(curr);
      }
      return acc;
    }, { nonElementItems: [], count: 0 });
  
    // Concatenate the non-element items with the counted elements at the end
    return [...result.nonElementItems, ...Array(result.count).fill(element)];
  };
  
  const moveToEnd = (arr, element) => {
    let nonElementItems = [];
    let targetItems = [];
  
    // Iterate over the array using forEach and separate elements
    arr.forEach(item => {
      if (item === element) {
        targetItems.push(item);
      } else {
        nonElementItems.push(item);
      }
    });
  
    // Concatenate the non-element items with the target items at the end
    return [...nonElementItems, ...targetItems];
  };

  
  const moveToEnd = (arr, element) => {
    // Map the array to separate elements, then concatenate the target element
    let nonElementItems = arr.map(item => item === element ? null : item).filter(item => item !== null);
    let targetItems = arr.filter(item => item === element);
  
    return nonElementItems.concat(targetItems);
  };
  

  const moveToEnd = (arr, element) => {
    let count = 0;
  
    // Loop through the array and remove all occurrences of the target element
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        arr.splice(i, 1);  // Remove the target element
        count++;  // Increase the count of removed elements
        i--;  // Adjust the index since the array shrinks after splice
      }
    }
  
    // Append the target element to the end of the array
    while (count--) {
      arr.push(element);
    }
  };
  