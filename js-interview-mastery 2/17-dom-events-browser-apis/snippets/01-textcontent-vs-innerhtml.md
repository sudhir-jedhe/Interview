# Snippet: `textContent` treats input as literal text; `innerHTML` parses it as markup

*(Browser-only — run in a browser console on a real page.)*

```js
const div = document.createElement("div");
div.textContent = "<b>bold?</b>";
console.log(div.innerHTML);
// "&lt;b&gt;bold?&lt;/b&gt;" -- rendered as literal text, not bold

div.innerHTML = "<b>bold?</b>";
console.log(div.textContent);
// "bold?" -- now it's a real <b> element, and the tag isn't part of the text
```
