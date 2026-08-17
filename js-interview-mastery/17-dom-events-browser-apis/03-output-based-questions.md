# Output-Based Questions: DOM, Events & Browser APIs

*(Browser-only — assume a real DOM environment.)*

```js
const parent = document.createElement("div");
const child = document.createElement("button");
parent.append(child);
document.body.append(parent);

parent.addEventListener("click", () => console.log("parent bubble"));
parent.addEventListener("click", () => console.log("parent capture"), true);
child.addEventListener("click", () => console.log("child"));

child.click();
```
**Answer:**
```
parent capture
child
parent bubble
```
**Why:** The event travels capturing phase first (window → ... → parent, since `capture: true` listeners fire on the way down), then hits the target (`child`), then bubbles back up, firing `parent`'s bubble-phase listener last.

---

```js
const btn = document.createElement("button");
document.body.append(btn);
btn.addEventListener("click", () => console.log("first"));
btn.addEventListener("click", () => console.log("second"));
btn.addEventListener("click", function (e) {
  console.log("third");
  e.stopImmediatePropagation();
});
btn.addEventListener("click", () => console.log("fourth"));
btn.click();
```
**Answer:**
```
first
second
third
```
**Why:** Listeners on the same element/phase run in registration order. `stopImmediatePropagation()` called inside the third listener prevents any *remaining* listeners on that same element — including "fourth", registered after it — from running, in addition to stopping propagation to ancestors.

---

```js
const div = document.createElement("div");
div.textContent = "before";
div.innerHTML += "<span>x</span>";
console.log(div.childNodes.length);
```
**Answer:**
```
2
```
**Why:** `div.innerHTML += "..."` reads the current `innerHTML` (`"before"`), concatenates the new markup, and reassigns it — which reparses the whole thing as HTML. The result is a text node `"before"` plus a `<span>` element node: two child nodes. (Note: this pattern also destroys any existing event listeners/state on prior children since they're all recreated from the markup string.)

---

```js
async function getData() {
  const res = await fetch("/nonexistent-endpoint-404");
  console.log("fetch resolved, status:", res.status);
  console.log(res.ok);
}
getData();
```
**Answer:**
```
fetch resolved, status: 404
false
```
**Why:** `fetch` only rejects on network-level failures (DNS failure, no connectivity, CORS block). An HTTP 404 or 500 response is still a "successful" fetch as far as the promise is concerned — it resolves normally with a `Response` object whose `.ok` is `false` for any non-2xx status. Forgetting to check `res.ok` is a very common bug.

---

```js
localStorage.setItem("count", 5);
const stored = localStorage.getItem("count");
console.log(typeof stored, stored + 1);
```
**Answer:**
```
string 51
```
**Why:** `localStorage` only stores strings — `setItem` coerces the number `5` to `"5"`. `getItem` returns that string, so `stored + 1` performs string concatenation (`"5" + 1` → `"51"`), not numeric addition, since `+` with a string operand concatenates rather than converts.

---

```js
const list = document.createElement("ul");
list.innerHTML = "<li id='a'>A</li>";
document.body.append(list);

list.addEventListener("click", (e) => {
  console.log("target:", e.target.tagName, "currentTarget:", e.currentTarget.tagName);
});

list.querySelector("li").click();
```
**Answer:**
```
target: LI currentTarget: UL
```
**Why:** `e.target` is always the element the event actually originated on — the `<li>` that was clicked. `e.currentTarget` is the element the listener is attached to — the `<ul>` — and only has that value while the handler is actively running (accessing it later, e.g. in a saved reference, would be `null`).

---

```js
const form = document.createElement("form");
document.body.append(form);
let clicked = false;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clicked = true;
});
const evt = new Event("submit", { cancelable: true });
const wasNotCancelled = form.dispatchEvent(evt);
console.log(clicked, wasNotCancelled);
```
**Answer:**
```
true false
```
**Why:** `dispatchEvent` returns `false` if any listener called `preventDefault()` on a cancelable event (and the event was created with `cancelable: true`), and `true` otherwise. `clicked` is `true` because the listener ran and set it; the return value reflects that the default action was prevented, which is the opposite of what "was not cancelled" might intuitively suggest.
