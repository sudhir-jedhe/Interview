# Re-Entrant emit() from Inside a Listener

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('x', () => {
  ee.emit('x'); // re-entrant emit from inside a listener
  console.log('inner done');
});
ee.on('x', () => console.log('second listener'));

ee.emit('x');
```

**Answer:** `second listener`, `inner done`, `second listener`.

**Why:** When the first listener calls `ee.emit('x')` re-entrantly, that nested emit synchronously runs both listeners top to bottom first (logging `second listener`), completing before control returns to the first listener's remaining code (`console.log('inner done')`). Then the *outer* emit continues to its second listener, logging `second listener` again. This nested/re-entrant emission order is a classic trap.
