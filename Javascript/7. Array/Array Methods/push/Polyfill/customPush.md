Your **first implementation has a few bugs**, while the **second implementation is much closer to the real `push()` behaviour**.

***

# ❌ Problems in First Implementation

```javascript
Array.prototype.customPush = function (elements) {
  for (let i = 0; i < elements.length; i++) {
    this[elements.length] = elements[i];
  }
  return this;
};
```

### Issue 1: Wrong Parameter

```javascript
customPush("pen");
```

Here:

```javascript
elements = "pen"
```

String length:

```javascript
elements.length === 3
```

So the loop iterates over:

```javascript
'p'
'e'
'n'
```

Instead of pushing:

```javascript
"pen"
```

it pushes individual characters.

***

### Issue 2: Wrong Index

```javascript
this[elements.length] = elements[i];
```

Should use current array length instead.

For:

```javascript
const words = [];
words.customPush("pen");
```

This becomes:

```javascript
this[3] = "p";
this[3] = "e";
this[3] = "n";
```

Final result:

```javascript
[empty × 3, 'n']
```

***

# ✅ Correct Implementation

```javascript
Array.prototype.customPush = function (...elements) {
  const currentLength = this.length;

  for (let i = 0; i < elements.length; i++) {
    this[currentLength + i] = elements[i];
  }

  return this.length;
};
```

***

## Example

```javascript
const numbers = [1, 2, 3];

const newLength =
  numbers.customPush(4, 5, 6);

console.log(numbers);
console.log(newLength);
```

### Output

```javascript
[1, 2, 3, 4, 5, 6]

6
```

Just like native:

```javascript
numbers.push(4, 5, 6);
```

***

# Interview-Style Polyfill

```javascript
Array.prototype.customPush = function (...items) {
  let length = this.length;

  for (let i = 0; i < items.length; i++) {
    this[length] = items[i];
    length++;
  }

  return this.length;
};
```

***

# Dry Run

```javascript
const arr = [1, 2, 3];

arr.customPush(4, 5);
```

### Before

```javascript
length = 3
```

***

### Iteration 1

```javascript
arr[3] = 4
```

Array:

```javascript
[1,2,3,4]
```

***

### Iteration 2

```javascript
arr[4] = 5
```

Array:

```javascript
[1,2,3,4,5]
```

***

### Return

```javascript
5
```

***

# Behaviour Matches Native Push

```javascript
const arr = [1, 2];

console.log(
  arr.customPush(3, 4)
);
```

Output:

```javascript
4
```

Array:

```javascript
[1, 2, 3, 4]
```

***

# Edge Cases

### No Arguments

```javascript
const arr = [1, 2, 3];

console.log(
  arr.customPush()
);
```

Output:

```javascript
3
```

Array remains:

```javascript
[1, 2, 3]
```

***

### Array as Element

```javascript
const arr = [1];

arr.customPush([2, 3]);

console.log(arr);
```

Output:

```javascript
[1, [2, 3]]
```

Same as native `push()`.

***

# Time Complexity

```text
O(k)
```

where:

```javascript
k = number of elements being pushed
```

# Space Complexity

```text
O(1)
```

(ignoring the added elements in the array itself).

### Interview One-Liner

> A custom `push()` can be implemented by appending elements at indices starting from the current array length and returning the new length. The operation runs in **O(k)** time where `k` is the number of elements being added and mimics the behaviour of JavaScript's native `Array.prototype.push()`.
The **first `customPush()` implementation is incorrect for multiple reasons**.

### First Implementation

```javascript
Array.prototype.customPush = function (elements) {
  for (let i = 0; i < elements.length; i++) {
    this[elements.length] = elements[i];
  }
  return this;
};
```

***

# Problem 1: Accepts Only One Parameter

```javascript
words.customPush("pen");
```

Here:

```javascript
elements = "pen";
```

Since strings have a `length` property:

```javascript
elements.length === 3
```

The loop treats `"pen"` as:

```javascript
'p'
'e'
'n'
```

instead of treating `"pen"` as a single element.

### Expected

```javascript
["pen"]
```

### Actual Behaviour

It processes character by character.

***

# Problem 2: Wrong Index Used

Inside the loop:

```javascript
this[elements.length] = elements[i];
```

Notice:

```javascript
elements.length
```

is always the same value during the entire loop.

For:

```javascript
elements = "pen"
```

```javascript
elements.length === 3
```

The code does:

```javascript
this[3] = "p";
this[3] = "e";
this[3] = "n";
```

Each assignment overwrites the previous one.

***

## Dry Run

```javascript
const words = [];

words.customPush("pen");
```

### Iteration 1

```javascript
this[3] = "p";
```

Array:

```javascript
[empty × 3, "p"]
```

***

### Iteration 2

```javascript
this[3] = "e";
```

Array:

```javascript
[empty × 3, "e"]
```

***

### Iteration 3

```javascript
this[3] = "n";
```

Array:

```javascript
[empty × 3, "n"]
```

Final result:

```javascript
[empty × 3, "n"]
```

***

# Problem 3: Doesn't Support Multiple Arguments

Native `push()` supports:

```javascript
arr.push(1, 2, 3);
```

But your implementation:

```javascript
customPush("pencil", "knife", "chair");
```

only receives:

```javascript
elements = "pencil"
```

The remaining arguments are ignored.

***

# Problem 4: Returns the Array Instead of New Length

Native `push()` returns:

```javascript
const len = arr.push(1, 2);

console.log(len);
```

Output:

```javascript
2
```

Your implementation returns:

```javascript
return this;
```

which returns:

```javascript
the array itself
```

instead of:

```javascript
the new length
```

***

# Correct Implementation

```javascript
Array.prototype.customPush = function (...elements) {
  const currentLength = this.length;

  for (let i = 0; i < elements.length; i++) {
    this[currentLength + i] = elements[i];
  }

  return this.length;
};
```

***

## Example

```javascript
const words = [];

words.customPush("pen");
words.customPush(
  "pencil",
  "knife",
  "chair"
);

console.log(words);
```

### Output

```javascript
[
  "pen",
  "pencil",
  "knife",
  "chair"
]
```

***

# Comparison

| Feature                      | First Version | Second Version |
| ---------------------------- | ------------- | -------------- |
| Supports multiple arguments  | ❌             | ✅              |
| Uses correct array index     | ❌             | ✅              |
| Preserves existing elements  | ❌             | ✅              |
| Matches native `push()`      | ❌             | ✅              |
| Returns new length           | ❌             | ✅              |
| Works with strings correctly | ❌             | ✅              |

### Interview Answer

> The first implementation is incorrect because it uses `elements.length` as the insertion index, causing values to overwrite the same position repeatedly. It also accepts only a single argument, treats strings as iterable character sequences, ignores additional arguments, and returns the array instead of the new array length. The correct implementation should use a rest parameter (`...elements`), append items starting at the current array length, and return the updated length just like the native `Array.prototype.push()`.
