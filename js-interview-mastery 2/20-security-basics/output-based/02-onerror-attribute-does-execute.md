# Output: An `onerror` attribute injected via `innerHTML` DOES execute

*(Browser-only.)*

```js
const el = document.createElement("div");
el.innerHTML = "<img src='invalid-url' onerror=\"console.log('fired')\">";
document.body.append(el);
```

**Answer:**
```
fired
```

**Why:** Unlike a `<script>` tag, an `onerror` (or `onload`, `onclick`, etc.) attribute assigned via `innerHTML` becomes a real, active event handler once the element is inserted into the live DOM. The browser attempts to load `'invalid-url'` as an image, fails, and fires `onerror`, executing the attacker's JS — this is the actual mechanism behind most `innerHTML`-based XSS payloads, not `<script>` tags.
