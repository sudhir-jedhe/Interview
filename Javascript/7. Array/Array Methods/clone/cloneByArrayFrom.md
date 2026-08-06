# The code demonstrates two common uses of **`Array.from()`** in JavaScript.

## Example 1: Cloning an Array

```javascript
let arr = [1, 24, 5, 6, 7, 8, 9];
let clonedArr = Array.from(arr);

console.log(clonedArr);
```

### How it works

* `Array.from(arr)` creates a **new array** from the existing array.
* It performs a **shallow copy**.
* Changes to `clonedArr` will not affect `arr` (for primitive values).

#### Output

```javascript
[1, 24, 5, 6, 7, 8, 9]
```

***

### Example 2: Cloning and Transforming Elements

```javascript
let anotherArr = [1, 2, 3, 4, 5];

let clonedAnotherArr = Array.from(
  anotherArr,
  (element) => element * 2
);

console.log(clonedAnotherArr);
```

### How it works

`Array.from()` accepts a second parameter called a **mapping function**:

```javascript
Array.from(sourceArray, mapFn)
```

For each element:

* `1 → 2`
* `2 → 4`
* `3 → 6`
* `4 → 8`
* `5 → 10`

#### Output

```javascript
[2, 4, 6, 8, 10]
```

***

### Equivalent Using `map()`

The second example is equivalent to:

```javascript
let clonedAnotherArr = anotherArr.map(
  element => element * 2
);
```

***

### Other Common Uses of `Array.from()`

#### Convert String to Array

```javascript
const chars = Array.from("React");

console.log(chars);
```

Output:

```javascript
['R', 'e', 'a', 'c', 't']
```

#### Generate an Array of Numbers

```javascript
const numbers = Array.from(
  { length: 5 },
  (_, index) => index + 1
);

console.log(numbers);
```

Output:

```javascript
[1, 2, 3, 4, 5]
```

#### Convert Set to Array

```javascript
const set = new Set([1, 2, 3]);

const arr = Array.from(set);

console.log(arr);
```

Output:

```javascript
[1, 2, 3]
```

### Interview Point

`Array.from()` is often used for:

1. Creating a copy of an array.
2. Converting iterable objects (`Set`, `Map`, `String`) to arrays.
3. Creating arrays with generated values using the mapping function.

**Syntax:**

```javascript
Array.from(arrayLike, mapFn?, thisArg?)
```
