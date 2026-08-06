function isMonotonic(array) {
    let isNonIncreasing = true;
    let isNonDecreasing = true;
    
    for (let i = 1; i < array.length; i++) {
        if (array[i] > array[i - 1]) {
            isNonIncreasing = false;
        }
        if (array[i] < array[i - 1]) {
            isNonDecreasing = false;
        }
    }
    
    return isNonIncreasing || isNonDecreasing;
}

// Test the function
const inputArray = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001];
console.log(isMonotonic(inputArray)); // Output: true



/****************************************** */

// Time: O(N + N)
const monotonicArray2 = (arr) => {
    let isIncreasing = true
    let isDecreasing = true
  
    isIncreasing = checkIncreasing(arr)
    isDecreasing = checkDecreasing(arr)
  
    return isIncreasing || isDecreasing
  }
  
  const checkIncreasing = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) {
        return false
      }
    }
    return true
  }
  const checkDecreasing = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[i - 1]) {
        return false
      }
    }
    return true
  }
  const arr = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]
  console.log('Second: ', monotonicArray2(arr))