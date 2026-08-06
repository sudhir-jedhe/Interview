# custom shift

```js
Array.prototype.customUnshift = function (...elements) {
  // Calculate the new length of the array after unshifting elements
  const newLength = this.length + elements.length;

  // Make room for new elements by shifting existing elements to the right
  for (let i = this.length - 1; i >= 0; i--) {
    this[i + elements.length] = this[i];
  }

  // Copy the new elements to the beginning of the array
  for (let i = 0; i < elements.length; i++) {
    this[i] = elements[i];
  }

  // Update the length property of the array
  this.length = newLength;

  // Return the new length of the array
  return newLength;
};

// Example usage:
const fruits = ["banana", "orange"];
const newLength = fruits.customUnshift("apple", "grape");

console.log(newLength); // Output: 4
console.log(fruits); // Output: ['apple', 'grape', 'banana', 'orange']
```
