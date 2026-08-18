# Problem: borrow array methods for an array-like object

## Requirements

Given an array-like object (something with numeric indices and a `.length`, but no `Array.prototype` methods — like the `arguments` object inside a non-arrow function, or a DOM `NodeList`), use `call`/`apply` to "borrow" real array methods (`map`, `filter`, `slice`, `join`, `reduce`) and operate on it, without first manually copying every element by hand.

## Solution

```js
function statsFromArguments() {
  // `arguments` is array-like: has indices 0..n-1 and `.length`, but no .map/.filter/.reduce
  const nums = Array.prototype.slice.call(arguments); // borrow slice() to snapshot into a real array
  const doubled = Array.prototype.map.call(nums, (n) => n * 2);
  const evens = Array.prototype.filter.call(arguments, (n) => n % 2 === 0);
  const total = Array.prototype.reduce.call(arguments, (sum, n) => sum + n, 0);
  return { doubled, evens, total };
}

console.log(statsFromArguments(1, 2, 3, 4, 5));
// { doubled: [2, 4, 6, 8, 10], evens: [2, 4], total: 15 }
```

Borrowing directly on `arguments` (rather than first converting it) works for every read-only array method (`map`, `filter`, `reduce`, `join`, `slice`, `indexOf`, `forEach`, `some`, `every`) because none of them check that `this` is really an `Array` — they only require numeric indices and a `.length`.

### A array-like NodeList-style example

```js
function makeFakeNodeList(...items) {
  // Simulates the shape of a DOM NodeList: indexed properties + length, no array methods
  const nodeList = { length: items.length };
  items.forEach((item, i) => { nodeList[i] = item; });
  return nodeList;
}

const fakeNodeList = makeFakeNodeList({ tag: 'div', hidden: false }, { tag: 'span', hidden: true }, { tag: 'p', hidden: false });

const visibleTags = Array.prototype.filter
  .call(fakeNodeList, (node) => !node.hidden)
  .map((node) => node.tag); // .map works because filter already returned a real array

console.log(visibleTags); // ['div', 'p']
```

### Writing a small reusable helper

```js
function borrow(methodName, arrayLike, ...args) {
  return Array.prototype[methodName].apply(arrayLike, args);
}

console.log(borrow('join', fakeNodeList /* from above */, ', '));
```

`borrow` uses `apply` (arguments as an array) since the helper itself receives a variable number of trailing arguments via rest params, and forwarding them as an array to `apply` is the natural fit.

## Modern alternative worth showing in an interview

```js
function statsModern(...args) {
  // rest params already give you a real array — no borrowing needed
  return {
    doubled: args.map((n) => n * 2),
    evens: args.filter((n) => n % 2 === 0),
    total: args.reduce((sum, n) => sum + n, 0),
  };
}
```

`Array.from(arrayLike)` or `[...arrayLike]` (when the array-like is also iterable, as `NodeList` is) are the modern go-to conversions. The `call`/`apply`-borrowing technique is still worth demonstrating because it explains *why* `Array.from` needed to exist, and it's the only option for array-like objects that aren't iterable.
