# Each Dynamically Rendered Button Needs Its Own Item in Its Click Handler

**Scenario:** Your app renders a list of buttons dynamically from an array of items, and each button's click handler needs to know which item it corresponds to. Using a `for` loop with `var`, every button ends up referencing the last item. Diagnose and fix it, including a version that doesn't rely on `let`.

**Approach:**

```js
const items = ['Apple', 'Banana', 'Cherry'];
const container = document.createElement('div');

// Buggy: every click handler closes over the same shared `i`
for (var i = 0; i < items.length; i++) {
  const btn = document.createElement('button');
  btn.textContent = items[i];
  btn.addEventListener('click', () => console.log('clicked:', items[i])); // always items[3] -> undefined
  container.appendChild(btn);
}
```

**Fix with `let`** (simplest, preferred in modern code):

```js
for (let i = 0; i < items.length; i++) {
  const btn = document.createElement('button');
  btn.textContent = items[i];
  btn.addEventListener('click', () => console.log('clicked:', items[i])); // correct per-button item
  container.appendChild(btn);
}
```

**Fix without `let`** (using `forEach`, which creates a new function scope — and thus a new closure — per callback invocation, sidestepping the issue entirely):

```js
items.forEach(function(item, i) {
  const btn = document.createElement('button');
  btn.textContent = item;
  btn.addEventListener('click', () => console.log('clicked:', item)); // `item` is a fresh param per call
  container.appendChild(btn);
});
```

The `forEach` version works because each call to the callback gets its own `item`/`i` parameters — function parameters are scoped per invocation just like `let`. This is a good general lesson: array iteration methods (`forEach`, `map`, `filter`) sidestep the classic `var` loop bug automatically, since they're implemented as repeated function calls rather than a single shared-scope loop.
