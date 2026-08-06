Let's break down the different functions you've mentioned: `clampNumber`, `toSafeInteger`, and `mapNumRange`, explaining how they work with examples.

### 1. **Clamp a Number**

The goal of the `clampNumber` function is to ensure that a number stays within the bounds of a lower and upper limit. If the number is outside the range, it is adjusted to be within the range.

#### Implementation:

```javascript
const clampNumber = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

console.log(clampNumber(2, 3, 5)); // 3
console.log(clampNumber(1, -1, -5)); // -1
console.log(clampNumber(10, 5, 7)); // 7
console.log(clampNumber(-2, -1, 0)); // -1
```

#### Explanation:
- `Math.max(a, b)` returns the larger of the two numbers.
- `Math.min(num, Math.max(a, b))` ensures `num` is not larger than the largest of `a` or `b`.
- `Math.min(a, b)` returns the smaller of the two numbers.
- The outer `Math.max` ensures that `num` is not smaller than the smallest of `a` or `b`.
  
The function effectively "clamps" the number within the range `[min(a, b), max(a, b)]`.

### 2. **Convert a Number to a Safe Integer**

JavaScript has a concept of "safe integers" defined by `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`. These constants represent the largest and smallest integers that JavaScript can safely represent (without losing precision).

#### Implementation:

```javascript
const toSafeInteger = num =>
  Math.round(
    Math.max(Math.min(num, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER)
  );

console.log(toSafeInteger('3.2')); // 3
console.log(toSafeInteger(Infinity)); // 9007199254740991
console.log(toSafeInteger(-Infinity)); // -9007199254740991
console.log(toSafeInteger(9007199254740992)); // 9007199254740991 (out of safe integer range)
```

#### Explanation:
- The `Math.max` and `Math.min` ensure that the number stays within the safe integer limits.
- `Number.MAX_SAFE_INTEGER` is `9007199254740991` (the largest number that JavaScript can represent precisely).
- `Number.MIN_SAFE_INTEGER` is `-9007199254740991` (the smallest number that JavaScript can represent precisely).
- `Math.round` ensures that the number is rounded to the nearest integer before returning the result.

This function is helpful when you want to make sure a number remains within JavaScript's safe integer range and is properly rounded to an integer.

### 3. **Map a Number to a Range**

Mapping a number from one range to another is a linear transformation, which can be achieved using a mathematical formula. For instance, if you want to map a number from the range `[inMin, inMax]` to the range `[outMin, outMax]`, you can use this formula:

#### Implementation:

```javascript
const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

console.log(mapNumRange(5, 0, 10, 0, 100)); // 50
console.log(mapNumRange(7, 0, 10, 0, 100)); // 70
console.log(mapNumRange(0, 0, 100, 0, 1)); // 0
console.log(mapNumRange(100, 0, 100, 0, 1)); // 1
```

#### Explanation:
- The formula `(num - inMin) / (inMax - inMin)` normalizes `num` to a value between 0 and 1, relative to the input range.
- Then, multiplying by `(outMax - outMin)` scales the normalized value to the output range.
- Adding `outMin` shifts the result to the start of the output range.

This function is useful when you need to map a number from one scale to another, such as converting a percentage or mapping a value from one coordinate system to another.

### Conclusion

Here's a summary of each function:

1. **Clamp a Number**: Ensures that a number stays within the specified bounds using `Math.max` and `Math.min`.
2. **Convert to Safe Integer**: Ensures the number stays within JavaScript's safe integer range using `Number.MAX_SAFE_INTEGER` and `Number.MIN_SAFE_INTEGER`.
3. **Map a Number to a Range**: Maps a number from one range to another using a linear transformation formula.

These functions are commonly used in scenarios like bounding values within a certain range, ensuring numeric precision, and scaling or normalizing values.