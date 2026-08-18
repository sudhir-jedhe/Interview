# Problem: Safe `JSON.stringify` That Handles Circular References

## Problem Statement

`JSON.stringify` throws `TypeError: Converting circular structure to JSON` when a value contains a circular reference (an object that, directly or indirectly, references itself). Implement a `safeStringify(value)` function that serializes an object like `JSON.stringify` would, but replaces any circular reference it encounters with a placeholder string instead of throwing.

## Requirements

- For non-circular input, `safeStringify(value)` should produce the same output as `JSON.stringify(value)`.
- When a circular reference is encountered, replace it with a string like `'[Circular]'` instead of throwing.
- Must handle circularity at any depth, and multiple independent circular references in the same object.
- Should not falsely flag two separate (non-circular) branches that happen to reference the same object as "circular" — only an actual ancestor-of-itself relationship counts.

## Approach

Use `JSON.stringify`'s second argument, the `replacer` function, combined with a `WeakSet` tracking objects currently "on the stack" of the recursive serialization. The tricky part is that the replacer alone can't tell "this object appears twice because it's circular" from "this object appears twice because it's referenced from two different branches" — both look identical from inside a naive replacer, since the replacer only sees each object once (it doesn't get called again if you return it more than once from *different* branches, but a true circular reference recurses back into the same still-open object). The fix is to track the current path (ancestors) rather than every object ever seen, adding to the tracking set on the way in and removing on the way out is what the replacer's per-object call structure naturally give us via a stack discipline.

## Solution

```js
function safeStringify(value, space) {
  const seen = new WeakSet(); // tracks objects currently being serialized (ancestors on the current path)

  function replacer(key, val) {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) {
        return '[Circular]';
      }
      seen.add(val);
    }
    return val;
  }

  // Note: JSON.stringify calls the replacer once per value as it walks the tree
  // depth-first, but it does NOT call us again on the way "out" of an object to
  // let us remove it from `seen` — so a naive version using only `seen.add` would
  // incorrectly flag sibling branches that just happen to share a reference as
  // circular. We work around this by doing a manual pre-pass with a real stack.
  return JSON.stringify(value, createStackAwareReplacer(), space);
}

function createStackAwareReplacer() {
  const stack = []; // ancestors of the value currently being visited, in order

  return function replacer(key, val) {
    if (typeof val !== 'object' || val === null) return val;

    // Pop ancestors that are no longer actual ancestors of this key.
    // `this` inside a JSON.stringify replacer is the object/array currently being
    // serialized (the parent of `key`), which lets us realign the stack correctly.
    while (stack.length && stack[stack.length - 1] !== this) {
      stack.pop();
    }

    if (stack.includes(val)) {
      return '[Circular]';
    }

    stack.push(val);
    return val;
  };
}

module.exports = { safeStringify };

// --- verification ---
const plain = { a: 1, b: { c: 2 } };
console.log(safeStringify(plain)); // '{"a":1,"b":{"c":2}}' — identical to JSON.stringify

const circular = { name: 'root' };
circular.self = circular; // direct circular reference
console.log(safeStringify(circular)); // '{"name":"root","self":"[Circular]"}'

const shared = { id: 1 };
const notActuallyCircular = { left: shared, right: shared }; // same object, two branches — NOT circular
console.log(safeStringify(notActuallyCircular)); // '{"left":{"id":1},"right":{"id":1}}' — both serialize fully, no false positive

const deep = { level1: { level2: {} } };
deep.level1.level2.backToTop = deep; // circular several levels down
console.log(safeStringify(deep));
// '{"level1":{"level2":{"backToTop":"[Circular]"}}}'
```

**Why this works:** the naive "global `WeakSet` of everything ever seen" approach produces false positives for the `shared` case above, because `shared` legitimately appears twice in the output without being circular. Maintaining an explicit ancestor **stack** (not just a seen-set) and using the replacer's `this` binding (which JSON.stringify sets to the immediate parent container) to pop stale ancestors on each call correctly distinguishes "this is one of my own ancestors" (truly circular) from "this was already fully serialized somewhere else in the tree" (a harmless shared reference).
