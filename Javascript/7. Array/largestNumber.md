```js
function largestNumber(nums) {
    const compareFn = (a, b) => {
      const strA = String(a) + String(b);
      const strB = String(b) + String(a);
      return strB.localeCompare(strA); // Sort descending based on custom comparison
    };
  
    nums.sort(compareFn);
    return nums.join("") === "00" ? "0" : nums.join("");
  }
  
  // Example usage
  const nums1 = [10, 2];
  const nums2 = [3, 30, 34, 5, 9];
  
  console.log(largestNumber(nums1)); // Output: "210"
  console.log(largestNumber(nums2)); // Output: "9534330"

  ```
  
  ```js

  function largestNumber(nums) {
    // Convert numbers to strings
    const numStrings = nums.map(num => num.toString());
    
    // Custom sort using comparator function
    numStrings.sort((a, b) => {
        const order1 = a + b;
        const order2 = b + a;
        // Compare order1 and order2 to determine sort order
        if (order1 > order2) return -1; // a should come before b
        else if (order1 < order2) return 1; // b should come before a
        else return 0; // order1 === order2
    });
    
    // Join sorted strings, handle leading zeros
    const result = numStrings.join('');
    
    // Edge case: handle leading zeros
    if (result[0] === '0') return '0';
    
    return result;
}

// Example cases
console.log(largestNumber([10, 2]));   // Output: "210"
console.log(largestNumber([3, 30, 34, 5, 9]));  // Output: "9534330"

```