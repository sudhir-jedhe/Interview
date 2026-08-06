The `myNone` method you've written is a custom implementation of the `none()` function that checks whether **none** of the elements in an array satisfy a provided predicate condition.

Here’s a breakdown of how it works and how you can improve and utilize it:

### **Function Description**:

1. **Predicate Check**: 
   - The method loops through each element in the array and applies the predicate function to each element.
   - If **any element** satisfies the predicate (returns `true`), the method **returns `false`** (indicating that the predicate is fulfilled for at least one element).
   - If **none of the elements** satisfy the predicate (i.e., all return `false`), the method will return `true` at the end.
   
2. **Parameters**:
   - `predicate`: The function that is applied to each element. It receives three arguments:
     - `currentValue`: The value of the current element in the array.
     - `index`: The index of the current element.
     - `array`: The array being traversed.
   
   - `thisArg`: The value that should be used as `this` when calling the `predicate` function. This is similar to the second argument of `Array.prototype.forEach()`.

3. **Early Exit**:
   - If at any point the predicate is fulfilled (i.e., returns `true` for any element), the method exits early and returns `false`. This avoids unnecessary further checks after a condition is met.
   
4. **Edge Case**:
   - If the array is empty, the method will return `true` since there's no element to satisfy the predicate.

### **Code Explanation**:

```javascript
Array.prototype.myNone = function myNone(predicate, thisArg){
    // Iterate through the array
    for (var i = 0; i < this.length; ++i) {
        // Apply predicate with the provided thisArg
        if (predicate.call(thisArg, this[i], i, this)) {
            return false;  // Exit early if predicate is satisfied
        }
    }
    
    return true;  // Return true if no element satisfies the predicate
}
```

### **How it works**:

1. **Predicate check**: Inside the loop, for every element in the array (`this[i]`), the predicate is invoked. It uses the `call()` method to bind `thisArg` to the predicate function (just like `Array.prototype.forEach()`).

2. **Early exit**: If any element satisfies the predicate, `predicate.call(thisArg, this[i], i, this)` will return `true`, causing an immediate return of `false`.

3. **Return value**: If the loop completes without finding any element that satisfies the predicate, the function returns `true` (indicating that no elements met the predicate condition).

### **Examples**:

1. **Example 1**: Checking if none of the elements in an array are negative:

```javascript
const arr = [1, 2, 3, 4];
const result = arr.myNone(x => x < 0);  // true (none of the elements are negative)
console.log(result);  // Output: true
```

2. **Example 2**: Checking if none of the elements in an array are even:

```javascript
const arr = [1, 3, 5, 7];
const result = arr.myNone(x => x % 2 === 0);  // true (none are even)
console.log(result);  // Output: true
```

3. **Example 3**: Checking if none of the elements are greater than 5:

```javascript
const arr = [1, 2, 3, 4];
const result = arr.myNone(x => x > 5);  // true (none are greater than 5)
console.log(result);  // Output: true
```

4. **Example 4**: Checking if none of the elements are equal to 2:

```javascript
const arr = [1, 3, 4, 5];
const result = arr.myNone(x => x === 2);  // true (none are equal to 2)
console.log(result);  // Output: true
```

5. **Example 5**: Early exit when the predicate is satisfied:

```javascript
const arr = [1, 2, 3, 4];
const result = arr.myNone(x => x === 2);  // false (element 2 satisfies the condition)
console.log(result);  // Output: false
```

6. **Edge Case**: Empty Array:

```javascript
const arr = [];
const result = arr.myNone(x => x > 0);  // true (no elements to satisfy the condition)
console.log(result);  // Output: true
```

### **Notes**:
- **Early Exit**: This feature makes the `myNone` method more efficient than just checking all elements when an element satisfies the condition.
- **ThisArg**: The `thisArg` parameter is useful when you want to bind a specific context (`this`) to the predicate function.
- **Array Traversal**: The method uses a simple `for` loop to iterate over the array. This is a basic traversal method, but other array iteration methods like `forEach` could also be used, though they wouldn't support early exit.

### **Improvements**:
- Your implementation looks good overall. One small potential improvement would be to check whether the `predicate` is a function at the start to avoid runtime errors if the user passes an invalid predicate.

```javascript
Array.prototype.myNone = function myNone(predicate, thisArg){
    if (typeof predicate !== 'function') {
        throw new TypeError('The predicate must be a function');
    }
    
    for (var i = 0; i < this.length; ++i){
        if (predicate.call(thisArg, this[i], i, this))
            return false;
    }
    
    return true;
}
```

With this check, if the user passes something other than a function, it will throw an error with a helpful message.