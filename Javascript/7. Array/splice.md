The `splice()` method in JavaScript is a versatile tool that allows you to modify an array by removing or replacing elements, or by adding new ones. It directly modifies the original array and returns an array of the removed elements.

Here’s a breakdown of your code examples and how they demonstrate various use cases of the `splice()` method:

### Example 1: **Basic Usage of `splice()`**
```javascript
let arrayIntegersOriginal1 = [1, 2, 3, 4, 5];
let arrayIntegers1 = arrayIntegersOriginal1.splice(0, 2); // removes 2 elements from index 0
console.log(arrayIntegers1); // returns [1, 2]
console.log(arrayIntegersOriginal1); // original array is now [3, 4, 5]
```
- **Action**: Removes 2 elements from index 0, resulting in `[1, 2]`, and the original array becomes `[3, 4, 5]`.

### Example 2: **Removing from the end of the array**
```javascript
let arrayIntegersOriginal2 = [1, 2, 3, 4, 5];
let arrayIntegers2 = arrayIntegersOriginal2.splice(3); // removes from index 3 till end of the array
console.log(arrayIntegers2); // returns [4, 5]
console.log(arrayIntegersOriginal2); // original array is now [1, 2, 3]
```
- **Action**: Removes all elements from index 3 till the end. The result is `[4, 5]`, and the original array becomes `[1, 2, 3]`.

### Example 3: **Replacing elements in the middle**
```javascript
let arrayIntegersOriginal3 = [1, 2, 3, 4, 5];
let arrayIntegers3 = arrayIntegersOriginal3.splice(3, 1, "a", "b", "c"); 
console.log(arrayIntegers3); // returns [4] (removed element)
console.log(arrayIntegersOriginal3); // original array is now [1, 2, 3, "a", "b", "c", 5]
```
- **Action**: Starts at index 3, removes 1 element, and adds `"a"`, `"b"`, and `"c"`. The original array changes to `[1, 2, 3, "a", "b", "c", 5]`.

### Example 4: **Find and remove an element by value**
```javascript
var arr = [2, 4, 5, 3, 6];

// Find the index of element 5
var n = 5;
var ind = arr.indexOf(n);

// Remove the element at index found
arr.splice(ind, 1); // removes element at index of 5
console.log(arr); // [2, 4, 3, 6]
```
- **Action**: Finds the index of the element `5` in the array, and then removes it from the array. The array becomes `[2, 4, 3, 6]`.

### Example 5: **Removing elements from the end of the array**
```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("Original Array:", arr);

// Remove the last 3 elements
let elemsToDelete = 3;
arr.splice(arr.length - elemsToDelete, elemsToDelete);

console.log("Modified Array:", arr); // [1, 2, 3, 4, 5, 6]
```
- **Action**: Removes the last 3 elements (from index `6` onward), resulting in the modified array `[1, 2, 3, 4, 5, 6]`.

### Example 6: **Removing and adding elements**
```javascript
let number_arr = [20, 30, 40, 50, 60];
let string_arr = ["amit", "sumit", "anil", "prateek"];

// Delete 3 elements starting from index 1
number_arr.splice(1, 3);
console.log(number_arr); // [20, 60]

// Add 3, 4, 5 at index 1
number_arr.splice(1, 0, 3, 4, 5);
console.log(number_arr); // [20, 3, 4, 5, 60]

// Remove 2 elements starting from index 1 and add new ones
string_arr.splice(1, 2, "xyz", "geek 1", "geek 2");
console.log(string_arr); // ["amit", "xyz", "geek 1", "geek 2", "prateek"]
```
- **Action**: 
  - In `number_arr`, removes elements starting from index `1`, then adds `3`, `4`, `5` at index `1`.
  - In `string_arr`, removes `"sumit"` and `"anil"`, then adds `"xyz"`, `"geek 1"`, and `"geek 2"` at index `1`.

### Key Points:
- **`splice(startIndex, deleteCount, ...itemsToAdd)`**:
  - `startIndex`: The index at which to start the operation.
  - `deleteCount`: The number of elements to remove from the array. If `0`, no elements are removed.
  - `...itemsToAdd`: Items to add to the array at the specified index.
  
- **Returns**:
  - The `splice()` method returns an array containing the elements that were removed. If no elements were removed, it returns an empty array.

- **Modification**:
  - The original array is modified, and the elements are either removed or added at the specified positions.

### Conclusion:
The `splice()` method is highly flexible for modifying arrays in JavaScript. You can remove or add elements, or even replace existing ones, making it an essential tool when dealing with array manipulation.