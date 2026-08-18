# A Global Variable Gets Silently Overwritten by Another Script

**Scenario:** You're debugging a production issue where a global variable named `data` is being unexpectedly overwritten by a script loaded on the page, causing another script to break. How does scope explain this, and what are two ways to prevent it?

**Approach:** This is almost always caused by accidental *implicit globals* or `var` declarations at the top level of separate `<script>` tags (non-module scripts), which all share the same global scope/`window` object. If Script A does `var data = fetchStuff()` and Script B independently does `var data = otherStuff()`, they collide on the same global `data` — whichever runs last wins, silently.

```js
// script-a.js
var data = { source: 'A' };

// script-b.js (loaded after script-a.js on the same page)
var data = { source: 'B' }; // overwrites script-a's global data with no warning
```

Fix 1 — wrap each script in an IIFE or module scope so top-level `var`/function declarations don't leak to `window`:

```js
(function() {
  var data = { source: 'A' }; // scoped to this IIFE only
})();
```

Fix 2 (preferred in modern code) — load scripts as ES modules (`<script type="module">`), since each module has its own top-level scope and top-level `let`/`const`/`var`/function declarations never attach to the global object, regardless of keyword. Additionally, switching from `var` to `let`/`const` at the top level of a *non-module* script still helps somewhat (they don't attach to `window` as properties), but the real fix for multi-script collisions is proper scoping via modules or IIFEs, not just the choice of declaration keyword.
