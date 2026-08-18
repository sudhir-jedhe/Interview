# Scenario: analytics tracker with safely-bound callbacks

**Prompt:** You're implementing an analytics library where consumers register callback functions that should run with `this` bound to a specific tracker instance, regardless of how the consumer later invokes the callback (as a plain function, inside another object, etc.). Design the API.

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
setTimeout(log, 0, 'page_view');         // works — `this` locked to tracker
[1, 2].forEach(() => log('batch_item')); // still works, unaffected by forEach's own this
```

The key design decision is exposing `getLogger()` rather than expecting consumers to remember to `.bind()` the method themselves — this pushes the responsibility for correct `this` handling into the library, where it belongs, rather than relying on every caller to get it right. This is the same pattern React class components use internally (binding handlers in the constructor) and is broadly applicable any time you hand out a method reference that might be detached from its object.
