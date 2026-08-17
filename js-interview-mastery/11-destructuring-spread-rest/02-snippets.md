# Snippets: Destructuring, Spread & Rest

```js
// 1. Skipping elements and defaults in array destructuring
const [first, , third = 'fallback'] = ['a', 'b'];
console.log(first, third);
// a fallback
```

```js
// 2. Swapping variables without a temp
let left = 'L', right = 'R';
[left, right] = [right, left];
console.log(left, right);
// R L
```

```js
// 3. Nested + renamed object destructuring with defaults
const response = { data: { user: { name: 'Zoe' } }, status: 200 };
const { data: { user: { name, email = 'n/a' } }, status: code } = response;
console.log(name, email, code);
// Zoe n/a 200
```

```js
// 4. Object spread merge order — later keys overwrite earlier ones
const defaults = { theme: 'light', size: 'md' };
const overrides = { size: 'lg' };
const merged = { ...defaults, ...overrides };
console.log(merged);
// { theme: 'light', size: 'lg' }
```

```js
// 5. Shallow copy caveat: nested reference is shared
const state = { count: 0, meta: { tags: ['a'] } };
const next = { ...state, count: 1 };
next.meta.tags.push('b');
console.log(state.meta.tags);
// [ 'a', 'b' ]  <- mutated through the shared reference
```

```js
// 6. Rest parameters produce a real array (unlike `arguments`)
function collect(...nums) {
  return nums.filter(n => n % 2 === 0);
}
console.log(collect(1, 2, 3, 4, 5, 6));
// [ 2, 4, 6 ]
```

```js
// 7. Rest in object destructuring to omit a key
const fullRecord = { id: 1, name: 'Kim', password: 'secret' };
const { password, ...safeRecord } = fullRecord;
console.log(safeRecord);
// { id: 1, name: 'Kim' }
```

```js
// 8. Spread to convert an iterable (string/Set) into an array
const unique = [...new Set([...'banana'])];
console.log(unique);
// [ 'b', 'a', 'n' ]
```
