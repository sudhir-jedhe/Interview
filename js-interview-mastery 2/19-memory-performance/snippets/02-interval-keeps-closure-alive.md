# Snippet: An interval keeps its closure (and everything it references) alive

```js
function startLeak() {
  const bigData = new Array(1_000_000).fill("leak-me");
  const id = setInterval(() => {
    console.log(bigData.length); // keeps bigData alive as long as the interval runs
  }, 10000);
  return id; // caller MUST clearInterval(id) eventually, or bigData never gets collected
}
const intervalId = startLeak();
// ... later, when the work is done:
clearInterval(intervalId); // now bigData becomes eligible for garbage collection
```
