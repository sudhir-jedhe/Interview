# String Basics: Immutability, Extraction & Searching

## String immutability

Strings in JavaScript are immutable primitives — no method ever changes a string in place, every "modifying" operation returns a brand-new string.

```js
let s = "hello";
s.toUpperCase();
console.log(s);               // "hello" — unchanged, return value was discarded
s = s.toUpperCase();
console.log(s);                // "HELLO" — reassignment is required
```

Indexing (`s[0]`) and `charAt` never let you assign into a string either — `s[0] = "H"` silently fails (or throws in strict mode).

## slice vs substring vs substr

All three extract a portion of a string, but they differ in how they handle their arguments, especially negative and out-of-order ones.

```js
const str = "javascript";
str.slice(-6);         // "script" — negative counts from end
str.substring(-6);     // "javascript" — negative clamped to 0, so from start
str.slice(4, 2);        // "" — start after end returns empty
str.substring(4, 2);    // "as" — args get swapped internally to (2, 4)
```

| Aspect | `slice(start, end)` | `substring(start, end)` | `substr(start, length)` (legacy) |
|---|---|---|---|
| Negative indices | Counts from end | Clamped to `0` | Start clamped/wrapped, deprecated behavior varies |
| `start > end` | Returns `""` | Silently swaps arguments | N/A — second arg is a length, not an end index |
| Second argument meaning | End index (exclusive) | End index (exclusive) | Length of substring to take |
| Recommended today | Yes | Situationally | No — deprecated, avoid in new code |

Use `slice` as the default for nearly everything, especially when negative-index "from the end" extraction is useful. Use `substring` only if you specifically want the swap-on-reversed-args behavior. Avoid `substr` entirely in new code since it's marked legacy in the spec. The most common mistake is assuming `slice` and `substring` are interchangeable — they diverge exactly on negative indices and reversed arguments, both of which are easy to hit by accident with computed indices.

## split/join, padStart/padEnd, includes/startsWith/endsWith

```js
"a,b,,c".split(",");               // ["a", "b", "", "c"] — empty strings preserved
["a", "b"].join("-");              // "a-b"
"5".padStart(3, "0");              // "005"
"abc".includes("b");               // true
"abc".startsWith("ab");            // true
```

`padStart`/`padEnd` are common for formatting (zero-padding numbers, aligning output). `includes`/`startsWith`/`endsWith` are the modern, readable replacements for `indexOf(...) !== -1` checks.
