Apply a mapping function to each character in a JavaScript string

Ever wished Array.prototype.map() worked on strings? Well, it doesn't, but you can easily replicate its behavior. As strings can easily be turned into arrays and back, you only need to take care of the mapping function and the arguments it receives.

When working with arrays, the mapping function expects three arguments - the current element, the index of the current element and the array itself. When working with strings, the mapping function should expect the current character, the index of the current character and the string itself. This, in fact, is the only part that requires special attention.

For the rest of the process, you can simply use String.prototype.split() to turn the string into an array. Then, use Array.prototype.map() to apply the mapping function to each character, taking extra care to pass the correct arguments. Finally, use Array.prototype.join() to turn the array back into a string.

```js
const mapString = (str, fn) =>
  str
    .split("")
    .map((c, i) => fn(c, i, str))
    .join("");

mapString("lorem ipsum", (c) => (c === " " ? " " : c + c.toUpperCase() + c));
// 'lLloOorRreEemMm iIipPpsSsuUumMm'
```

Your implementation of `mapString` is clean, functional, and correctly passes `(character, index, originalString)` to the mapping callback.

While `str.split('')` works well for basic ASCII strings, there are **two key nuances** worth keeping in mind when mapping strings in modern JavaScript: **Unicode handling** and **alternative syntax choices**.

---

### 1. Unicode & Emoji Handling (The `split('')` Trap)

Using `str.split('')` breaks surrogate pairs (like multi-byte Unicode characters, emojis, or accented characters) into incomplete code units.

#### The Issue

```javascript
mapString("a🤖b", (c) => c + "-");
// Output: 'a---b-' (The emoji was broken into two invalid UTF-16 surrogate halves!)

```

#### The Fix (Using Array Spread `[...str]` or `Array.from`)

The spread operator `[...str]` and `Array.from(str)` are **Unicode-aware** and iterate over full Unicode code points:

```javascript
/**
 * Unicode-safe string mapping
 * @param {string} str
 * @param {function(string, number, string): string} fn
 * @return {string}
 */
const mapStringUnicode = (str, fn) =>
  [...str]
    .map((char, index) => fn(char, index, str))
    .join("");

// Verification with Emojis
console.log(mapStringUnicode("a🤖b", (c) => c + "-"));
// Output: 'a-🤖-b-' (Preserves emoji correctly!)

```

---

### 2. Micro-Optimization: Using `Array.from()` Directly

`Array.from()` accepts a mapping function directly as its second argument, eliminating the need for separate `.split()` / `[...str]` and `.map()` passes:

```javascript
const mapStringFast = (str, fn) =>
  Array.from(str, (char, index) => fn(char, index, str)).join("");

// Example usage:
console.log(
  mapStringFast("lorem ipsum", (c) => (c === " " ? " " : c + c.toUpperCase() + c))
);
// Output: 'lLloOorRreEemMm iIipPpsSsuUumMm'

```

---

### 3. Alternative: Extending `String.prototype`

If you prefer a method-style syntax similar to `Array.prototype.map`:

```javascript
String.prototype.map = function (fn) {
  return Array.from(this, (char, index) => fn(char, index, this)).join("");
};

// Usage:
console.log("hello".map((c, i) => `${c}${i}`)); 
// Output: 'h0e1l2l3o4'

```

---

### Comparison Summary

| Method                                   | Unicode / Emoji Safe?         | Performance                      | Syntax                 |
| ---------------------------------------- | ----------------------------- | -------------------------------- | ---------------------- |
| **`str.split('').map(...)` (Your Code)** | ❌ No (Breaks surrogate pairs) | Moderate                         | Array chaining         |
| **`[...str].map(...)`**                  | ✅ Yes                         | Good                             | Modern JS spread       |
| **`Array.from(str, fn).join('')`**       | ✅ Yes                         | **Best** (Single iteration pass) | Functional & idiomatic |
