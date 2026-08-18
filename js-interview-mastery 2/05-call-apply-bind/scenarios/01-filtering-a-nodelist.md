# Scenario: filtering a NodeList with array methods

**Prompt:** You're given a DOM `NodeList` (from `document.querySelectorAll`) and need to filter it using array methods, but `NodeList` doesn't have `.filter()`. How would you solve this using the concepts from this topic, and what's the modern alternative?

**Approach:** `NodeList` is array-like (has indexed elements and `.length`) but isn't a real `Array`, so it lacks `Array.prototype` methods like `.filter`, `.map`, `.reduce`. You can "borrow" the array method by calling it with `this` set to the `NodeList` via `call`:

```js
const divs = document.querySelectorAll('div');
const visibleDivs = Array.prototype.filter.call(divs, (el) => el.offsetParent !== null);
```

`Array.prototype.filter` internally just needs something with numeric indices and a `.length` — it never checks that `this` is really an `Array`, so borrowing works fine on any array-like.

**Modern alternative:** convert the `NodeList` to a real array first, then use normal methods directly, which is clearer and avoids the borrowing pattern entirely:

```js
const visibleDivs2 = Array.from(divs).filter((el) => el.offsetParent !== null);
// or: [...divs].filter(...)
```

`Array.from` and the spread operator are the preferred modern approach; the `call`-borrowing technique is still worth knowing because it explains *why* `Array.from` needed to exist and shows up regularly in interview questions about `call`/`apply`.
