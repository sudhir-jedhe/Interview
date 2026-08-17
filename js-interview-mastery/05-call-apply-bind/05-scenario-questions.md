# call, apply, bind — Scenario Questions

### 1. You're given a DOM `NodeList` (from `document.querySelectorAll`) and need to filter it using array methods, but `NodeList` doesn't have `.filter()`. How would you solve this using the concepts from this topic, and what's the modern alternative?

**Approach:** `NodeList` is array-like (has indexed elements and `.length`) but isn't a real `Array`, so it lacks `Array.prototype` methods like `.filter`, `.map`, `.reduce`. You can "borrow" the array method by calling it with `this` set to the `NodeList` via `call`:

```js
const divs = document.querySelectorAll('div');
const visibleDivs = Array.prototype.filter.call(divs, (el) => el.offsetParent !== null);
```

`Array.prototype.filter` internally just needs something with numeric indices and a `.length` — it never checks that `this` is really an `Array`, so borrowing works fine on any array-like.

**Modern alternative:** convert the `NodeList` to a real array first, then use normal methods directly, which is clearer and avoids the borrowing pattern entirely:

```js
const visibleDivs2 = Array.from(divs).filter((el) => el.offsetParent !== null);
// or: [...divs].filter(...)
```

`Array.from` and the spread operator are the preferred modern approach; the `call`-borrowing technique is still worth knowing because it explains *why* `Array.from` needed to exist and shows up regularly in interview questions about `call`/`apply`.

---

### 2. You're implementing an analytics library where consumers register callback functions that should run with `this` bound to a specific tracker instance, regardless of how the consumer later invokes the callback (as a plain function, inside another object, etc.). Design the API.

**Approach:**

```js
class Tracker {
  constructor(appId) {
    this.appId = appId;
    this.events = [];
  }
  logEvent(name) {
    this.events.push(`[${this.appId}] ${name}`);
    console.log(this.events[this.events.length - 1]);
  }
  // Public API: return a permanently-bound function so consumers can't break `this`
  getLogger() {
    return this.logEvent.bind(this);
  }
}

const tracker = new Tracker('my-app');
const log = tracker.getLogger(); // safe to hand off anywhere
setTimeout(log, 0, 'page_view');       // works — `this` locked to tracker
[1, 2].forEach(() => log('batch_item')); // still works, unaffected by forEach's own this
```

The key design decision is exposing `getLogger()` rather than expecting consumers to remember to `.bind()` the method themselves — this pushes the responsibility for correct `this` handling into the library, where it belongs, rather than relying on every caller to get it right. This is the same pattern React class components use internally (binding handlers in the constructor) and is broadly applicable any time you hand out a method reference that might be detached from its object.

---

### 3. You need to implement a `once`-style utility, but this time using `bind` mechanics: a function that pre-fills a "mode" argument and locks `this` to a specific logger object, while still letting the caller supply the rest of the arguments each time. Show how `bind`'s partial-application behavior solves this cleanly.

**Approach:**

```js
const logger = {
  prefix: '[APP]',
  write(mode, message) {
    console.log(`${this.prefix} [${mode.toUpperCase()}] ${message}`);
  }
};

const logError = logger.write.bind(logger, 'error'); // locks `this` AND pre-fills mode='error'
const logInfo = logger.write.bind(logger, 'info');

logError('Failed to connect'); // '[APP] [ERROR] Failed to connect'
logInfo('Server started');     // '[APP] [INFO] Server started'
```

This is `bind`'s two responsibilities working together in one call: locking `this` to `logger` (so `this.prefix` always resolves correctly no matter where `logError`/`logInfo` end up being called from) and pre-filling the leading `mode` argument, leaving the message as the only argument the caller needs to supply at call time. This pattern is a clean way to derive several specialized functions from one general-purpose method without writing separate wrapper functions by hand.

---

### 4. You're asked in an interview to implement `Function.prototype.myApply` from scratch (not just `myBind`). What does the implementation look like, and what edge cases does a correct version need to handle?

**Approach:**

```js
Function.prototype.myApply = function(thisArg, argsArray) {
  const context = (thisArg === null || thisArg === undefined) ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn'); // unique property key to avoid clobbering existing properties
  context[fnKey] = this;

  const args = argsArray === null || argsArray === undefined ? [] : argsArray;
  const result = context[fnKey](...args);

  delete context[fnKey]; // clean up the temporary property
  return result;
};

function introduce(greeting) { return `${greeting}, ${this.name}`; }
console.log(introduce.myApply({ name: 'Kai' }, ['Hi'])); // 'Hi, Kai'
```

The core trick: to make `this` resolve correctly inside the target function without using the real `apply`/`call`, you temporarily attach the function as a property on the context object and invoke it as a method call (`context[fnKey](...)`) — that's implicit binding doing the work. A `Symbol` key avoids accidentally overwriting a real property named `fn` on the context object. Edge cases: (1) `thisArg` being `null`/`undefined` should fall back to the global object in non-strict semantics (real `apply` does this too, though strict-mode functions preserve `undefined`/`null` as-is — a fully spec-accurate version needs to know whether the target function is strict); (2) `argsArray` being `null`/`undefined` should call with no arguments rather than throwing; (3) if `thisArg` is a primitive (e.g. a number), it needs to be boxed via `Object(thisArg)` so you can attach a property to it, mirroring real non-strict `this` coercion behavior.
