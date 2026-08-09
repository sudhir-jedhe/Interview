// Left substring generator
// Using a for...in loop, we can iterate over the string, and yield each substring, starting at the beginning. We can use String.prototype.slice() to get the substring. In order to terminate early, we can use String.prototype.length to check if the string is empty.

```js
const leftSubstrGenerator = function* (str) {
  if (!str.length) return;
  for (let i in str) yield str.slice(0, i + 1);
};

[...leftSubstrGenerator("hello")];
// [ 'h', 'he', 'hel', 'hell', 'hello' ]
// Right substring generator
// The exact same technique with a for...in loop can be used when starting at the end of the string. Same as before, albeit with a slight modification, we can use String.prototype.slice() to get the substring. And again, we use String.prototype.length to terminate early if the string is empty.

const rightSubstrGenerator = function* (str) {
  if (!str.length) return;
  for (let i in str) yield str.slice(-i - 1);
};

[...rightSubstrGenerator("hello")];
// [ 'o', 'lo', 'llo', 'ello', 'hello' ]
```

While generator functions (`function*`) and `slice()` are a great way to create lazy sequence generators, there is a **subtle, critical bug** in both functions caused by using a **`for...in`** loop on a string.

---

### Critical Bug: `for...in` Key Coercion

In JavaScript, **`for...in` iterates over object keys as strings, NOT numbers.**

In the loop `for (let i in str)`:

* On the first iteration, `i` is the string `"0"` (not number `0`).
* In `str.slice(0, i + 1)`:
* Iteration 0: `i = "0"` $\rightarrow$ `"0" + 1` = `"01"` $\rightarrow$ `str.slice(0, "01")` $\rightarrow$ `str.slice(0, 1)` (Works by coincidence)
* Iteration 1: `i = "1"` $\rightarrow$ `"1" + 1` = `"11"` $\rightarrow$ `str.slice(0, 11)` $\rightarrow$ **Grabs 11 characters instead of 2!**

#### Verification of Bug

```javascript
const leftSubstrGenerator = function* (str) {
  if (!str.length) return;
  for (let i in str) yield str.slice(0, i + 1);
};

console.log([...leftSubstrGenerator("javascript")]);
// ❌ WRONG OUTPUT:
// [ 'j', 'javascript', 'javascript', ... ]

```

---

### Fixed & Optimal Implementation

Replace `for...in` with a standard numeric `for` loop (or `for...of` with index counters). Standard numeric loops avoid string-concatenation bugs and perform significantly faster.

#### 1. Corrected `leftSubstrGenerator` (Prefixes)

```javascript
/**
 * Yields left substrings (prefixes) from shortest to longest.
 */
const leftSubstrGenerator = function* (str) {
  if (!str) return;
  for (let i = 1; i <= str.length; i++) {
    yield str.slice(0, i);
  }
};

console.log([...leftSubstrGenerator("hello")]);
// ✅ ['h', 'he', 'hel', 'hell', 'hello']

console.log([...leftSubstrGenerator("javascript")]);
// ✅ ['j', 'ja', 'jav', 'java', 'javas', 'javasc', 'javascr', 'javascri', 'javascrip', 'javascript']

```

#### 2. Corrected `rightSubstrGenerator` (Suffixes)

```javascript
/**
 * Yields right substrings (suffixes) from shortest to longest.
 */
const rightSubstrGenerator = function* (str) {
  if (!str) return;
  for (let i = str.length - 1; i >= 0; i--) {
    yield str.slice(i);
  }
};

console.log([...rightSubstrGenerator("hello")]);
// ✅ ['o', 'lo', 'llo', 'ello', 'hello']

```

---

### Key Takeaways

1. **Avoid `for...in` for Arrays & Strings:** `for...in` is meant for enumerating object properties. It returns keys as strings and can iterate over non-numeric inherited properties on prototype chains.
2. **Generators for Memory Efficiency:** Using generators (`function*`) is ideal for processing large strings lazily without pre-allocating memory for all substrings in an array upfront.
