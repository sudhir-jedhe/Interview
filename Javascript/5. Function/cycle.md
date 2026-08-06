You have provided two similar implementations of a function that cycles through one or more values each time it is called. Let's break down each implementation to understand how they work and point out any notable differences.

### 1. **First Implementation:**

```javascript
export default function cycle(...values) {
  let index = 0;

  return () => {
    const currentValue = values[index];
    index = (index + 1) % values.length;
    return currentValue;
  };
}
```

**Explanation:**
- **`index = 0`**: The `index` starts at 0, meaning the cycle will begin from the first value in the `values` array.
- **Return function**: The function returned will return the value at the current `index`, then increment the `index` to the next value, cycling back to the beginning once the end is reached (`index = (index + 1) % values.length`).
- **Behavior**: When you call the returned function, it returns the next value in the cycle. Once it reaches the end, it will restart from the first value.

**Example Usage:**

```javascript
const helloFn = cycle('hello');
console.log(helloFn()); // "hello"
console.log(helloFn()); // "hello"
```

Here, the function will always return `'hello'` since only one value is provided. However, the logic can handle multiple values as well:

```javascript
const onOffFn = cycle('on', 'off');
console.log(onOffFn()); // "on"
console.log(onOffFn()); // "off"
console.log(onOffFn()); // "on"
```

### 2. **Second Implementation (with TypeScript)**

```typescript
export default function cycle<T>(...values: Array<T>): () => T {
  let index = -1;

  return () => {
    index = (index + 1) % values.length;
    return values[index];
  };
}
```

**Explanation:**
- **`index = -1`**: The `index` starts at `-1`, so the first call to the returned function will increment `index` to `0`, returning the first value.
- **TypeScript**: The function is generic, meaning it can work with any type `T`. It accepts an arbitrary number of values and returns a function that always returns one of the values of the provided list.
- **Return function**: The returned function increments the `index` and uses the modulo operator to ensure the index wraps around when it exceeds the length of the `values` array.

**Example Usage:**

```typescript
const helloFn = cycle('hello');
console.log(helloFn()); // "hello"
console.log(helloFn()); // "hello"

const onOffFn = cycle('on', 'off');
console.log(onOffFn()); // "on"
console.log(onOffFn()); // "off"
console.log(onOffFn()); // "on"
```

### Key Differences:

1. **Initialization of `index`:**
   - In the first implementation, the index starts at `0`, so the first value is returned immediately.
   - In the second implementation, the index starts at `-1`, and the first call increments it to `0`, so the first value is returned only after the first call.

2. **TypeScript Support:**
   - The second implementation is written in TypeScript, which allows for type safety by specifying that the function can handle values of any type `T`.

3. **Flexibility and Reusability:**
   - Both implementations work similarly, but the second implementation is more flexible because it supports any type of values, as it uses TypeScript's generic functionality (`<T>`).

### Summary:

- Both functions implement a cyclic behavior, returning values one by one from a given list and wrapping around when the end is reached.
- The first version is simple JavaScript, while the second one is a more flexible and type-safe TypeScript version.
- The main difference is the initial value of `index` and the use of TypeScript in the second example.

Both implementations are efficient, but if you're working in TypeScript, the second version is preferable for type safety and flexibility.