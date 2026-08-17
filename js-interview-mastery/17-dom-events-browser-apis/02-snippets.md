# Snippets: DOM, Events & Browser APIs

*(Browser-only — run in a browser console on a real page.)*

```js
// 1. textContent treats input as literal text; innerHTML parses it as markup
const div = document.createElement("div");
div.textContent = "<b>bold?</b>";
console.log(div.innerHTML);
// "&lt;b&gt;bold?&lt;/b&gt;" -- rendered as literal text, not bold

div.innerHTML = "<b>bold?</b>";
console.log(div.textContent);
// "bold?" -- now it's a real <b> element, and the tag isn't part of the text
```

```js
// 2. Event bubbling order: target's own listeners fire, then ancestors, in bubble order
const outer = document.createElement("div");
const inner = document.createElement("span");
outer.append(inner);
document.body.append(outer);

outer.addEventListener("click", () => console.log("outer"));
inner.addEventListener("click", () => console.log("inner"));

inner.click(); // simulate a click on the inner span
// logs: "inner"
// logs: "outer"
```

```js
// 3. capture: true reverses the order relative to a bubble listener on an ancestor
outer.addEventListener("click", () => console.log("outer capture"), { capture: true });
inner.addEventListener("click", () => console.log("inner"));
inner.click();
// logs: "outer capture"  (capturing phase: outer -> inner, runs first)
// logs: "inner"          (target phase)
```

```js
// 4. Event delegation: one listener handles clicks on any current or future <li>
const list = document.createElement("ul");
list.innerHTML = "<li>Apples</li><li>Bananas</li>";
document.body.append(list);

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) console.log("clicked:", li.textContent);
});

list.querySelector("li").click();
// logs: "clicked: Apples"

// A new <li> added later still works, no new listener needed:
const newItem = document.createElement("li");
newItem.textContent = "Cherries";
list.append(newItem);
newItem.click();
// logs: "clicked: Cherries"
```

```js
// 5. stopPropagation prevents bubbling but NOT the default action
const link = document.createElement("a");
link.href = "#test";
link.textContent = "click me";
document.body.append(link);

document.body.addEventListener("click", () => console.log("body heard it"));
link.addEventListener("click", (e) => {
  e.stopPropagation(); // body listener above will NOT run
  // e.preventDefault() was NOT called, so the browser still navigates the hash
});
link.click();
// no "body heard it" logged; URL hash still changes to #test
```

```js
// 6. localStorage persists strings only -- objects must be serialized
localStorage.setItem("user", JSON.stringify({ name: "Ana", age: 30 }));
const raw = localStorage.getItem("user");
console.log(typeof raw, raw);
// "string" '{"name":"Ana","age":30}'

const user = JSON.parse(raw);
console.log(user.name);
// "Ana"
```

```js
// 7. A minimal debounce wrapper around an input handler
function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

const log = debounce((value) => console.log("searching for:", value), 300);
// Rapid calls within 300ms of each other collapse into a single trailing call:
log("a");
log("ap");
log("app");
// only "searching for: app" logs, ~300ms after the last call
```
