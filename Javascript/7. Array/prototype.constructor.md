In JavaScript, extending built-in objects like `Array` with custom methods is possible through the use of `Array.prototype`. However, it's generally discouraged to extend built-in prototypes because it can lead to unexpected behavior, especially when using third-party libraries or interacting with other parts of the code. Nonetheless, here are the solutions to your two examples, where you extend the `Array.prototype` with custom methods.

### 1. **`lowerCase` Method**
This method modifies each element of the array to convert it to lowercase.

#### Code:
```javascript
Array.prototype.lowerCase = function () {
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i].toLowerCase();
  }
};

function myGeeks() {
  let sub = ["DSA", "WEBTEchnologies", "GeeksforGeeks", "gfg"];
  sub.lowerCase();  // Convert each element to lowercase
  console.log(sub);  // Output: [ 'dsa', 'webtechnologies', 'geeksforgeeks', 'gfg' ]
}

myGeeks();
```

#### Output:
```javascript
[ 'dsa', 'webtechnologies', 'geeksforgeeks', 'gfg' ]
```

### Explanation:
- **`Array.prototype.lowerCase`** iterates through each element of the array (`this`) and updates the element by converting it to lowercase using the `toLowerCase()` method.
- **`myGeeks` function** demonstrates how this new method is applied to an array of strings, and the result is printed.

---

### 2. **`stringLength` Method**
This method modifies the array to store the length of each string in the array.

#### Code:
```javascript
Array.prototype.stringLength = function () {
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i].length;
  }
};

function lengthFunction() {
  let str = ["GeeksforGeeks", "GFG", "myGeeks"];
  str.stringLength();  // Convert each element to its string length
  console.log(str);  // Output: [ 14, 3, 7 ]
}

lengthFunction();
```

#### Output:
```javascript
[ 14, 3, 7 ]
```

### Explanation:
- **`Array.prototype.stringLength`** iterates through each string in the array (`this`), and updates the element to store the length of the string using the `length` property of the string.
- **`lengthFunction` function** demonstrates how this method is applied to an array of strings, where the strings are replaced by their respective lengths.

---

### Why Modifying Prototypes Can Be Risky:
- Modifying built-in prototypes like `Array.prototype` can lead to conflicts with other libraries or future versions of JavaScript, which might introduce new methods with the same name.
- Other parts of the code might depend on the original behavior of built-in methods, leading to unexpected results.

### Safe Alternatives:
Instead of modifying `Array.prototype`, you can define standalone utility functions, like:

```javascript
// Safe alternative for `lowerCase` method
function lowerCaseArray(arr) {
  return arr.map(item => item.toLowerCase());
}

// Safe alternative for `stringLength` method
function stringLengthArray(arr) {
  return arr.map(item => item.length);
}
```

These functions provide the same functionality but don't modify built-in objects. They are less prone to conflicts and are considered safer.

Let me know if you need further explanations or assistance!