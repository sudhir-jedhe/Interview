```js
function isObject(object) {
    return object && typeof object === 'object';
  }
  
  module.exports = isObject;
```

### **The `is` Function**

Your `is` function is trying to compare two values (`a` and `b`) with special handling for edge cases such as `NaN`, `0`, `-0`, and regular values. It includes several checks to ensure correct equality for these cases.

Let's walk through your solution and refine it to ensure that it works for all the specified cases.

### **Key Edge Cases**:
1. **NaN**: `NaN` is the only value in JavaScript that is not equal to itself. This needs special handling.
2. **Zero Equality**: JavaScript's `===` operator treats `0` and `-0` as equal, but mathematically they are distinct. Therefore, `1 / 0` is `Infinity`, while `1 / -0` is `-Infinity`. This can be used to distinguish between positive and negative zero.
3. **General Equality**: For all other values, we use the normal `===` equality check.

### **Refined Solution**:

We can further streamline your solution by handling these edge cases clearly and concisely.

```javascript
/**
 * Compares two values a and b for equality with special handling for NaN, 0, and -0.
 * @param {any} a - First value to compare.
 * @param {any} b - Second value to compare.
 * @return {boolean} - Returns true if the values are equal, false otherwise.
 */
function is(a, b) {
  // Handle NaN: NaN is the only value that is not equal to itself
  if (a !== a) { 
    return b !== b; // If a is NaN, return true only if b is also NaN
  }
  
  // Handle +0 and -0: 0 and -0 are considered equal by === but not mathematically the same
  if (a === 0 && b === 0) { 
    return 1 / a === 1 / b; // If a and b are both 0, check if they are +0 or -0
  }
  
  // Regular equality check for all other cases
  return a === b;
}

module.exports = is;
```

### **Explanation**:
1. **NaN Check**: 
   - `a !== a` is used because `NaN` is the only value in JavaScript that does not equal itself. This handles the `NaN` edge case.
   - If `a` is `NaN`, we return `true` if and only if `b` is also `NaN`.
  
2. **Zero Check**: 
   - When both `a` and `b` are `0` (including `-0`), we check if the **sign of zero** is the same for both by comparing `1 / a` and `1 / b`. 
   - `1 / 0` will give `Infinity` while `1 / -0` will give `-Infinity`. This allows us to distinguish between `+0` and `-0`.

3. **Default Equality**:
   - For all other values, we simply use the regular `===` comparison. This covers primitive types like numbers, strings, and booleans, as well as objects and arrays.

### **Test Cases**:

Let's verify this function with a variety of test cases.

```javascript
console.log(is(1, 1)); // true
console.log(is(1, 2)); // false
console.log(is('a', 'a')); // true
console.log(is('a', 'b')); // false
console.log(is(true, true)); // true
console.log(is(true, false)); // false
console.log(is(NaN, NaN)); // true
console.log(is(0, 0)); // true (both +0)
console.log(is(-0, 0)); // false (-0 is not equal to +0)
console.log(is(0, -0)); // false
console.log(is(-0, -0)); // true (-0 is equal to -0)
console.log(is({}, {})); // false (different object references)
console.log(is([1, 2], [1, 2])); // false (different array references)
```

### **Additional Notes**:

1. **`NaN` Comparison**: This approach explicitly handles `NaN` values, which is critical since `NaN !== NaN` in JavaScript.
2. **Zero Comparison**: By comparing `1 / a` and `1 / b`, we can accurately detect differences between `+0` and `-0`.
3. **Object and Array References**: The `is` function uses strict equality (`===`), so different object or array references will return `false` even if they have identical properties or values.

This function is a good solution for comparing primitive values while considering the nuances of JavaScript's handling of `NaN`, `0`, and `-0`.