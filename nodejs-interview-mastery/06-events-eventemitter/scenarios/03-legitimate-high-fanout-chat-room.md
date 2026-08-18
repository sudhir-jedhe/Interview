# Legitimate High-Fanout Listener Count in a Chat Room

**Scenario:** You're building a chat server where a `Room` EventEmitter can have well over 100 connected sockets all listening for `message` events, and you keep seeing `MaxListenersExceededWarning` even though this is expected behavior, not a leak. What do you do?

**Approach:** This is a legitimate high-fanout case, not a bug — raise the limit on that specific emitter rather than suppressing warnings globally or ignoring them (which could mask real leaks elsewhere).

```js
const { EventEmitter } = require('events');

class Room extends EventEmitter {
  constructor(capacity) {
    super();
    // set explicitly based on expected max subscribers, with headroom
    this.setMaxListeners(capacity + 10);
  }
}

const room = new Room(200);
// now up to 210 listeners can be added without warnings
```

Avoid `EventEmitter.defaultMaxListeners = Infinity` globally — that disables the leak detector everywhere in the process, hiding genuine leaks in unrelated code.
