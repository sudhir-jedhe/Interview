# Snippet: DOM-based XSS sink — `innerHTML` executes injected markup, `textContent` doesn't

*(Browser-only.)*

```js
const untrusted = "<img src=x onerror=\"console.log('XSS ran')\">";

const safeDiv = document.createElement("div");
safeDiv.textContent = untrusted; // just displays the literal string, nothing executes

const dangerousDiv = document.createElement("div");
dangerousDiv.innerHTML = untrusted; // the onerror handler actually fires
document.body.append(dangerousDiv);
// logs: "XSS ran" -- purely from assigning to innerHTML
```
