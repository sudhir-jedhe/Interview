# Scenario: Rate-limited auto-save that must never lose the final keystroke

**You need to add rate-limiting to a "save draft" auto-save feature in a text editor: save at most once every 5 seconds while the user types continuously, but also guarantee a final save happens shortly after they stop typing so nothing is lost.**

**Approach:**
Neither plain debounce nor plain throttle alone is quite right: throttle alone would keep firing forever during long typing sessions but might miss the very last keystrokes if the trailing call isn't handled; debounce alone would never save during a long uninterrupted typing session. The practical solution is a throttle with a trailing-edge call — fire on the leading edge (or every interval) *and* guarantee one more call after activity stops.

```js
function throttleWithTrailing(fn, interval) {
  let lastCall = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = interval - (now - lastCall);
    if (remaining <= 0) {
      clearTimeout(timer);
      lastCall = now;
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, remaining);
    }
  };
}

const autoSave = throttleWithTrailing((content) => saveDraft(content), 5000);
editor.addEventListener("input", (e) => autoSave(e.target.value));
```
