Here is the complete guide and solution for LeetCode #2619: **Array Prototype Last** (extending JavaScript's `Array.prototype` so that calling `.last()` on any array returns its last element, or `-1` if the array is empty).

---

### Solution

```javascript
/**
 * Extends Array.prototype to add a last() method.
 * 
 * @return {null|boolean|number|string|Array|Object} The last element or -1 if empty.
 */
Array.prototype.last = function() {
  if (this.length === 0) {
    return -1;
  }
  return this[this.length - 1];
};

```

---

### Alternative Implementation Approaches

#### 1. Ternary Operator (Concise One-Liner)

```javascript
Array.prototype.last = function() {
  return this.length === 0 ? -1 : this[this.length - 1];
};

```

#### 2. Modern `at()` Method (ES2022)

`Array.prototype.at(-1)` accesses the last element of an array. If the array is empty, `at(-1)` returns `undefined`, which can be defaulted to `-1` using nullish coalescing `??`:

```javascript
Array.prototype.last = function() {
  return this.at(-1) ?? -1;
};

```

#### 3. Using `pop()` on a Copy (Immutable)

`pop()` mutates the array, so if you use `pop()`, you must clone the array first:

```javascript
Array.prototype.last = function() {
  return this.length ? [...this].pop() : -1;
};

```

---

### Usage Examples

#### Example 1: Non-Empty Numerical Array

```javascript
const arr1 = [null, {}, 3];
console.log(arr1.last()); 
// Output: 3

```

#### Example 2: Empty Array

```javascript
const arr2 = [];
console.log(arr2.last()); 
// Output: -1

```

#### Example 3: Array Containing Falsy Last Element

```javascript
const arr3 = [1, 2, 0];
console.log(arr3.last()); 
// Output: 0 (Correctly returns 0, not -1)

```

---

### Key Takeaways

1. **`this` Binding:** Inside a method attached to `Array.prototype`, `this` references the array instance calling `.last()`.
2. **$O(1)$ Time & Space Complexity:** Accessing `this[this.length - 1]` takes constant time $O(1)$ and uses no extra memory space.
3. **Falsy Values Handling:** Always check `this.length === 0` rather than checking `if (!this[this.length - 1])`, because valid array elements can be falsy values like `0`, `false`, `""`, `null`, or `undefined`.
