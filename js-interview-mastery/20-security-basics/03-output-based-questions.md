# Output-Based Questions: Security Basics

*(These trace behavior/reasoning rather than exact console output where the scenario is conceptual — actual output is noted where applicable. Browser-only unless stated.)*

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
**Why:** This is a common misconception — `<script>` tags injected via `innerHTML` are inserted into the DOM as inert markup but are **not executed** by the browser; this is a deliberate spec behavior specifically to prevent this exact injection vector. This does *not* mean `innerHTML` is safe, though — event-handler-based payloads like `<img src=x onerror="...">` *do* execute, because `onerror` firing isn't blocked the same way script tag parsing is.

---

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

---

```js
fetch("https://api.other-domain.com/public-data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log("error:", err.message));
// Assume api.other-domain.com responds with Access-Control-Allow-Origin: https://some-third-site.com
// and the calling page's origin is https://my-app.com
```
**Answer:**
```
error: Failed to fetch
```
**Why:** The server *did* process the request and send a response — CORS doesn't block the request from reaching the server. But because `Access-Control-Allow-Origin` names `https://some-third-site.com`, not `https://my-app.com` (the actual calling origin), the browser refuses to expose the response body to the calling script and surfaces it as a generic network-level failure instead, which is why the error message is vague rather than something explicit like "CORS denied" in the caught error object (that detail is only visible in the browser console/network tab, not in JS).

---

```js
document.cookie = "sessionId=abc123; HttpOnly";
console.log(document.cookie);
```
**Answer:**
```
"" (or existing non-HttpOnly cookies, but NOT sessionId)
```
**Why:** `HttpOnly` can only be set by the *server* via a `Set-Cookie` response header — it cannot actually be applied through `document.cookie` in client-side JS (this line silently fails to set the flag; in practice it just sets a regular, JS-readable cookie or does nothing depending on the browser). The point of `HttpOnly` is that once a cookie legitimately has that flag (set server-side), `document.cookie` cannot read it at all, which is why it's an effective mitigation against XSS-based cookie theft — but the flag must originate from the server, not from client JS.

---

```js
function validateAge(age) {
  return age >= 18;
}

// Client-side form check:
if (validateAge(document.getElementById("age").value)) {
  submitOrder();
}
```
**Answer:**
(No single deterministic console output — this traces a reasoning question.)
**Why:** `document.getElementById("age").value` is always a **string**, so `age >= 18` relies on JavaScript's loose comparison coercing the string to a number (`"20" >= 18` is `true`), which happens to work for well-formed input but silently misbehaves for edge cases (`"" >= 18` is `false` since `Number("")` is `0`, but `"18abc" >= 18` is `false` too since `Number("18abc")` is `NaN`, and `NaN` comparisons are always `false`). More importantly, this check runs entirely in the browser and can be bypassed by disabling JS or calling the server API directly — it provides no actual security guarantee regardless of whether the coercion logic is correct.

---

```js
// Server response header:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true

fetch("https://api.example.com/private", { credentials: "include" })
  .then(res => res.json())
  .catch(err => console.log("failed:", err.message));
```
**Answer:**
```
failed: Failed to fetch
```
**Why:** The CORS spec explicitly forbids combining a wildcard `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` — browsers reject this combination outright and refuse to expose the response, regardless of what the server intended, because a wildcard-plus-credentials combo would let literally any site read a user's authenticated data. This is a deliberate browser-enforced safety rule, not a server misconfiguration the browser tries to work around.
