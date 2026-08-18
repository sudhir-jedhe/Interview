# Scenario: Looping a NodeList with a skip condition and an early cap

You're given a `NodeList` from `document.querySelectorAll(...)` and need to loop through it, skip any element with a `data-disabled` attribute, and stop entirely once you've processed 5 valid elements. What loop and control-flow constructs do you use, and what's the gotcha with `NodeList`?

**Approach:**
`NodeList` (from `querySelectorAll`, as opposed to `getElementsByClassName`) is iterable, so `for-of` works directly, combined with `continue` to skip and `break` to cap:

```js
const nodes = document.querySelectorAll('.item');
let processed = 0;
for (const node of nodes) {
  if (node.hasAttribute('data-disabled')) continue;
  console.log(node.textContent);
  processed++;
  if (processed === 5) break;
}
```
The gotcha: `querySelectorAll` returns a **static** `NodeList` (a snapshot at call time), so it's safe to iterate even if the DOM changes afterward — but `getElementsByClassName`/`getElementsByTagName` return a **live** `HTMLCollection`, which is *not* directly iterable with `for-of` in older environments and, more dangerously, updates in real time as the DOM changes, so mutating matched elements mid-loop can cause elements to be skipped or visited twice. Always confirm which one you're dealing with before looping and mutating.
