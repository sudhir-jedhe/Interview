# Output: A `<script>` tag injected via `innerHTML` does not execute

*(Browser-only.)*

```js
const el = document.createElement("div");
const payload = "<script>console.log('ran')</script>";
el.innerHTML = payload;
document.body.append(el);
console.log(el.innerHTML);
```

**Answer:**
```
<script>console.log('ran')</script>
```
(No "ran" is logged.)

**Why:** This is a common misconception — `<script>` tags injected via `innerHTML` are inserted into the DOM as inert markup but are **not executed** by the browser; this is a deliberate spec behavior specifically to prevent this exact injection vector. This does *not* mean `innerHTML` is safe, though — event-handler-based payloads like `<img src=x onerror="...">` *do* execute, because `onerror` firing isn't blocked the same way script tag parsing is (see the next question).
