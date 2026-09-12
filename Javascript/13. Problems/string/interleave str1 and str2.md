Here are the most common ways to interleave `str1` and `str2` in JavaScript:

---

### Method 1: Using a simple `for` loop (Clean & Readable)

```javascript
let str1 = 'xyz';
let str2 = 123;

const s1 = String(str1);
const s2 = String(str2);

let result = '';
const maxLength = Math.max(s1.length, s2.length);

for (let i = 0; i < maxLength; i++) {
  if (i < s1.length) result += s1[i];
  if (i < s2.length) result += s2[i];
}

console.log(result); // "x1y2z3"

```

---

### Method 2: Using Array Methods (`map` & `join`)

```javascript
let str1 = 'xyz';
let str2 = 123;

const s2 = String(str2);

const result = Array.from(str1)
  .map((char, i) => char + (s2[i] ?? ''))
  .join('');

console.log(result); // "x1y2z3"

```

---

### Method 3: Using `reduce` (One-liner)

```javascript
let str1 = 'xyz';
let str2 = 123;

const result = [...str1].reduce((acc, char, i) => acc + char + (String(str2)[i] || ''), '');

console.log(result); // "x1y2z3"

```

---

### Why `String(str2)` is necessary

Because `str2` is a number (`123`), it doesn't have an index lookup (e.g., `str2[0]` evaluates to `undefined`). Converting it to a string via `String(str2)` or `str2.toString()` allows iterating over each digit character-by-character.
