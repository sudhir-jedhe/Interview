# Snippet: `stopPropagation` prevents bubbling but NOT the default action

*(Browser-only — run in a browser console on a real page.)*

```js
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
