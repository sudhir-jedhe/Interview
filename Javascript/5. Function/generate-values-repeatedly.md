You've created two excellent examples of generators in JavaScript, demonstrating how to repeat a value indefinitely and how to cycle through an array of values. Let's break down these concepts a little more thoroughly to clarify what's going on and to make sure everything is clear.

### **1. Repeating a Single Value**

The `repeatGenerator` function uses a `while(true)` loop to repeatedly yield the same value (or a new value if one is provided via `.next()`).

Here’s the breakdown:

```javascript
const repeatGenerator = function* (val) {
  let v = val; // initial value to repeat
  while (true) { // infinite loop
    let newV = yield v; // yield the current value, and optionally get a new value from next()
    if (newV !== undefined) v = newV; // if new value is provided, update the value
  }
};
```

#### Explanation:
- **`yield v`**: This returns the current value and pauses the generator.
- **`newV = yield v`**: The `newV` will be the value passed into `next()` after the yield (if any).
- **`if (newV !== undefined) v = newV;`**: This checks if a new value has been passed via `.next()`. If so, it updates the value to be yielded on the next iteration.

#### Example:

```javascript
const repeater = repeatGenerator(5);
console.log(repeater.next()); // { value: 5, done: false }
console.log(repeater.next()); // { value: 5, done: false }
console.log(repeater.next(4)); // { value: 4, done: false }
console.log(repeater.next()); // { value: 4, done: false }
```

- Initially, `repeater.next()` returns `5`, since that's the starting value.
- On `repeater.next(4)`, you pass `4` into the generator, and it updates the value it repeats from `5` to `4`.
- From then on, `repeater.next()` continues yielding `4`.

---

### **2. Repeating an Array of Values**

The `cycleGenerator` function cycles through the array indefinitely, yielding values in a repeating sequence. It uses the modulo operator to ensure the index wraps around when it reaches the end of the array.

```javascript
const cycleGenerator = function* (arr) {
  let i = 0; // index tracker
  while (true) { // infinite loop
    yield arr[i % arr.length]; // modulo ensures the index wraps around
    i++; // increment index
  }
};
```

#### Explanation:
- **`arr[i % arr.length]`**: This expression ensures that when `i` exceeds the array length, it wraps around. The modulo operator (`%`) gives a remainder when dividing `i` by the length of the array, which ensures that the index always stays within bounds of the array.
- **`i++`**: After each `yield`, the index is incremented to move to the next element in the array.

#### Example:

```javascript
const binaryCycle = cycleGenerator([0, 1]);
console.log(binaryCycle.next()); // { value: 0, done: false }
console.log(binaryCycle.next()); // { value: 1, done: false }
console.log(binaryCycle.next()); // { value: 0, done: false }
console.log(binaryCycle.next()); // { value: 1, done: false }
```

- The generator cycles through the array `[0, 1]` indefinitely, alternating between `0` and `1`.

---

### Summary

1. **Repeating a single value**: The generator `repeatGenerator` yields a single value indefinitely unless a new value is provided, in which case it updates the yielded value.
2. **Cycling through an array**: The generator `cycleGenerator` cycles through the array by using the modulo operator to ensure the index wraps around once it exceeds the length of the array.

These patterns can be very useful for creating repeatable, infinite sequences in applications, like animations or cyclic data handling. Let me know if you'd like to dive deeper into any of these examples!