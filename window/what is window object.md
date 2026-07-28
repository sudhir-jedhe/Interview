// ### How do you access history in javascript

// The window.history object contains the browser's history. You can load previous and next URLs in the history using back() and next() methods.

```js
function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}

// **Note:** You can also access history without window prefix.
```
