```js
const chop = (str, size = str.length) => {
  const arr = [];
  let i = 0;

  //iterate the string
  while (i < str.length) {
    //slice the characters of given size
    //and push them in output array
    arr.push(str.slice(i, i + size));
    i = i + size;
  }

  return arr;
};

Input: console.log(chop("javascript", 3));

Output: ["jav", "asc", "rip", "t"];

str.match(/.{1,n}/g); // Replace n with the size of the substring

str.match(/(.|[\r\n]){1,n}/g); // Replace n with the size of the substring

const chop = (str, size = str.length) => {
  return str.match(new RegExp(".{1," + size + "}", "g"));
};
```

The provided approaches chop a string into chunks of a given length, but there are important edge cases and optimizations worth noting across the two methods (Loop vs. Regex).

---

### Comparison of Methods

#### 1. Loop-based Approach (`while` + `str.slice`)

The loop implementation is **clean, robust, and handles all edge cases safely**.

```javascript
const chop = (str, size = str?.length) => {
  if (!str) return [];
  if (size <= 0) return [str]; // Avoid infinite loop if size <= 0

  const arr = [];
  let i = 0;
  while (i < str.length) {
    arr.push(str.slice(i, i + size));
    i += size;
  }
  return arr;
};

console.log(chop("javascript", 3)); 
// Output: ["jav", "asc", "rip", "t"]

```

* **Pros:** Highly performant, handles multiline strings out of the box, safe from regex execution limits.
* **Important Safeguard:** Always ensure `size > 0` to prevent an infinite loop where `i` never increments.

---

#### 2. Regex-based Approach (`str.match`)

The regex approach is concise, but standard dot `.` **does not match newline characters (`\n`, `\r`)** by default.

```javascript
// ❌ FAILS on multiline strings (omits \n characters or produces incorrect matches)
const chopRegexNaive = (str, size) => str.match(new RegExp(".{1," + size + "}", "g"));

// ✅ FIX: Use the 's' (dotAll) flag or [\s\S]
const chopRegex = (str, size) => {
  if (!str) return [];
  if (size <= 0) return [str];
  
  // 's' flag allows '.' to match newline characters as well
  return str.match(new RegExp(`.{1,${size}}`, "gs")) || [];
};

console.log(chopRegex("java\nscript", 3));
// Output: ["jav", "a\ns", "cri", "pt"]

```

* **Pros:** Declarative and very short.
* **Cons:** `str.match()` returns `null` for empty strings `""` (requiring a fallback `|| []`), and constructing dynamic regexes repeatedly incurs a minor instantiation cost in hot loops.

---

### Alternative: ES2024 `String.prototype.matchAll` / Array Spread

For a modern one-liner using iterator helpers:

```javascript
const chopModern = (str, size) =>
  size > 0 && str ? str.match(new RegExp(`[\\s\\S]{1,${size}}`, 'g')) || [] : [];

```

---

### Summary Checklist

| Feature                      | `while` Loop + `slice()`     | Regex `str.match()`                 |
| ---------------------------- | ---------------------------- | ----------------------------------- |
| **Multiline Support (`\n`)** | ✅ Works automatically        | ⚠️ Needs `s` flag or `[\s\S]`        |
| **Empty String `""` Input**  | ✅ Returns `[]`               | ⚠️ Returns `null` without `          |
| **Zero/Negative Size Guard** | Required (`size <= 0`)       | Required (invalid regex quantifier) |
| **Performance**              | **Faster (No Regex Engine)** | Slightly slower on large strings    |
