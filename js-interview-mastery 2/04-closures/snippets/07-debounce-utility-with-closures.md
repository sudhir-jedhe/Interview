# Closures Used to Build a Debounce Utility (Real-World Pattern)

```js
function debounce(fn, delay) {
  let timeoutId; // captured across every call to the debounced function
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
const log = debounce((msg) => console.log(msg), 100);
log('a'); log('b'); log('c'); // only 'c' will actually log, ~100ms later
```
