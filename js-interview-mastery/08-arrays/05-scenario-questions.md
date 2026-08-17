# Scenario Questions: Arrays

## 1. Deduplicating and grouping a list of orders by customer

You have a flat array of order objects (`{ id, customerId, amount }`) and need to produce a summary: total amount spent per customer, sorted by total descending. How do you implement this cleanly, and what edge cases matter?

**Approach:** `reduce` to group and sum, then convert to an array and sort:

```js
const orders = [
  { id: 1, customerId: "a", amount: 50 },
  { id: 2, customerId: "b", amount: 30 },
  { id: 3, customerId: "a", amount: 20 },
];

const totals = orders.reduce((acc, order) => {
  acc[order.customerId] = (acc[order.customerId] ?? 0) + order.amount;
  return acc;
}, {});

const summary = Object.entries(totals)
  .map(([customerId, total]) => ({ customerId, total }))
  .sort((a, b) => b.total - a.total);

console.log(summary); // [{customerId:"a",total:70},{customerId:"b",total:30}]
```

Edge cases: an empty `orders` array should produce `[]`, not throw. Floating-point amounts can accumulate rounding error — for real currency, sum in integer cents. Ties in total amount are left in whatever relative order `sort` happens to produce beyond the primary key (modern engines guarantee `sort` is stable, so original relative order is preserved for equal totals, which is usually the desired tie-break).

## 2. Removing duplicates from an array of primitives vs an array of objects

You need a `dedupe` utility. It works fine on `[1, 2, 2, 3]` but fails on an array of objects like `[{id:1}, {id:1}]` where the objects are different references but represent the same logical entity. How do you handle both cases?

**Approach:** For primitives, `Set` is a one-liner. For objects, dedupe by a key selector:

```js
const dedupePrimitives = (arr) => [...new Set(arr)];
console.log(dedupePrimitives([1, 2, 2, 3])); // [1, 2, 3]

function dedupeBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
const users = [{ id: 1, name: "A" }, { id: 1, name: "A-dup" }, { id: 2, name: "B" }];
console.log(dedupeBy(users, (u) => u.id)); // keeps first occurrence per id
```

Edge case: `Set` only dedupes by reference/`===` equality, so two structurally-identical-but-different object references (`{id:1}` twice, created separately) are never deduped by `new Set()` alone — that's exactly why the keyed version is needed for object data.

## 3. Converting a live NodeList into a real array to safely filter/map DOM nodes

You're iterating over `document.querySelectorAll(".item")` and want to `.filter()` and `.map()` the results, but `NodeList` doesn't reliably support those array methods (depending on environment) and can be a "live" collection in some cases (like `getElementsByClassName`). How do you convert it safely, and why does it matter?

**Approach:** Use `Array.from` (or spread, if you know it's iterable) to snapshot into a real array before doing any array-method work:

```js
const nodeList = document.querySelectorAll(".item"); // static NodeList (querySelectorAll)
const items = Array.from(nodeList);
const visibleTexts = items
  .filter((el) => !el.hidden)
  .map((el) => el.textContent);
```

The key reason this matters: `getElementsByClassName`/`getElementsByTagName` return *live* HTMLCollections that update automatically as the DOM changes — if you iterate one of those directly while also modifying the DOM (e.g., removing matched elements), the collection shrinks mid-loop and you'll skip elements. Snapshotting with `Array.from` first freezes the list at that moment, avoiding that class of bug entirely, in addition to unlocking the full array method set.

## 4. Implementing pagination over a large in-memory array

You have an array of 10,000 records and need a `paginate(data, page, pageSize)` function used across the app for tables. How do you implement it, and what edge cases (out-of-range pages, last partial page, empty data) do you need to handle?

**Approach:**

```js
function paginate(data, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: data.slice(start, start + pageSize), // non-mutating — safe to call repeatedly
    page: safePage,
    totalPages,
    totalItems: data.length,
  };
}

paginate([], 1, 10);          // { items: [], page: 1, totalPages: 1, totalItems: 0 }
paginate([1,2,3], 5, 2);      // clamps to last valid page: page 2, items [3]
```

Edge cases handled: empty array (avoid `Math.ceil(0/pageSize)` producing `0` total pages and confusing UI), requesting a page beyond range (clamp rather than returning an empty slice silently), and `pageSize` of `0` or negative (should probably throw or default, since it would otherwise produce `Infinity` total pages or an infinite loop upstream if not guarded). `slice` is used deliberately over `splice` because pagination must never mutate the underlying dataset.
