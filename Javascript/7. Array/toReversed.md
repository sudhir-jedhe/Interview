
In JavaScript, there isn't a built-in `Array.toReversed()` method, but you can easily implement a custom method that returns a new array with elements in reverse order. 

Here’s how you could implement such a method:

### Custom `toReversed()` Method:

You can create this method on `Array.prototype` so that it works on any array instance. This method will return a new array with the elements in reverse order without modifying the original array.

```javascript
// Adding toReversed to Array.prototype
Array.prototype.toReversed = function() {
    return [...this].reverse(); // Return a shallow copy of the array and reverse it
};

// Example usage:
const arr = [1, 2, 3, 4, 5];
const reversedArr = arr.toReversed();

console.log(reversedArr); // Output: [5, 4, 3, 2, 1]
console.log(arr);         // Output: [1, 2, 3, 4, 5] (Original array is unchanged)
```

### Explanation:
- **`Array.prototype.toReversed`**: We extend the `Array.prototype` to add the `toReversed` method.
- **`[...this]`**: This creates a shallow copy of the array to avoid mutating the original array.
- **`.reverse()`**: This method reverses the newly created array.
- The original array is not modified, as the method returns a new array with reversed elements.

### Why not mutate the array?
If we used `.reverse()` directly on `this`, it would mutate the original array. Returning a copy ensures that the original array remains unchanged, which is often preferred to avoid side effects.

### Example:

```javascript
const numbers = [10, 20, 30, 40];
console.log(numbers.toReversed()); // [40, 30, 20, 10]
console.log(numbers);              // [10, 20, 30, 40] (Original array is unchanged)
```

### Performance Considerations:
- **Shallow Copying**: Since we're using `[...this]` to create a shallow copy of the array before reversing it, this is generally fine for most use cases. However, if the array is large and contains complex objects, this might add overhead due to the shallow copy.
  
This method should work effectively for most scenarios where you need a reversed copy of the array without altering the original.