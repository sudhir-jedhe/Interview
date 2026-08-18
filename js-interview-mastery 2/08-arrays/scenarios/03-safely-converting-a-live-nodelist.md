# Scenario: converting a live NodeList into a real array to safely filter/map DOM nodes

**Prompt:** You're iterating over `document.querySelectorAll(".item")` and want to `.filter()` and `.map()` the results, but `NodeList` doesn't reliably support those array methods (depending on environment) and can be a "live" collection in some cases (like `getElementsByClassName`). How do you convert it safely, and why does it matter?

**Approach:** Use `Array.from` (or spread, if you know it's iterable) to snapshot into a real array before doing any array-method work:

```js
const nodeList = document.querySelectorAll(".item"); // static NodeList (querySelectorAll)
const items = Array.from(nodeList);
const visibleTexts = items
  .filter((el) => !el.hidden)
  .map((el) => el.textContent);
```

The key reason this matters: `getElementsByClassName`/`getElementsByTagName` return *live* HTMLCollections that update automatically as the DOM changes — if you iterate one of those directly while also modifying the DOM (e.g., removing matched elements), the collection shrinks mid-loop and you'll skip elements. Snapshotting with `Array.from` first freezes the list at that moment, avoiding that class of bug entirely, in addition to unlocking the full array method set.
