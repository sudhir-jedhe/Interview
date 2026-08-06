You're absolutely right! The `Array.prototype.forEach()` method is an elegant way to iterate over arrays, but by default, it iterates from left to right. To iterate over an array from right to left, we can use a combination of the following:

1. **Array.prototype.slice()** – to create a shallow clone of the array (to avoid mutating the original array).
2. **Array.prototype.reverse()** – to reverse the cloned array.
3. **Array.prototype.forEach()** – to iterate over the reversed array.

Here's how you can achieve it:

### Code:

```javascript
const forEachRight = (arr, callback) => 
  arr.slice().reverse().forEach(callback);

// Test the function
forEachRight([1, 2, 3, 4], val => console.log(val)); 
// Output: '4', '3', '2', '1'
```

### Explanation:

- **`arr.slice()`**: This method creates a shallow copy of the original array. This is important because `reverse()` mutates the original array, so using `slice()` ensures that the original array remains intact.
- **`arr.slice().reverse()`**: This first clones the array and then reverses the clone, so you are working with a reversed array without modifying the original array.
- **`.forEach(callback)`**: This method iterates over each element of the reversed array, invoking the provided callback with the current element.

### Example Output:

```
4
3
2
1
```

This approach works well if you need to avoid modifying the original array and still want to iterate over it from right to left. It's a neat, functional approach to the problem.