# Problem: Fix a Memory Leak Caused by Unremoved Listeners in a Long-Running Service

## Problem Statement

A long-running worker service maintains one shared `EventEmitter` (`metricsBus`) for the process's lifetime. Every time it handles a "connection" (e.g., a new WebSocket client, a new tenant session), it creates a per-connection `ConnectionHandler` object that subscribes to `metricsBus` to report stats. When the connection closes, the `ConnectionHandler` is discarded — but its listener on `metricsBus` is never removed, so `metricsBus`'s listener list grows forever, retaining a reference to every `ConnectionHandler` that has ever existed (preventing garbage collection) and eventually crossing the `MaxListenersExceededWarning` threshold.

## Requirements

- Reproduce the leak: show that after many connect/disconnect cycles, `metricsBus.listenerCount('tick')` keeps growing instead of returning to a stable baseline.
- Fix it so that closing a connection always removes exactly the listener that connection registered — no leftover references.
- The fix must not require the caller to remember to manually clean up (i.e., don't just say "remember to call `.off()`" and leave it at that) — encapsulate the cleanup inside the connection's own `close()` method.
- Demonstrate, with a small script, that listener count returns to baseline after connections close.

## Approach

The root bug is registering a listener with an inline/anonymous function (or a bound method with no stored reference) and never calling `.off()` for it. The fix: store a reference to the exact listener function on the `ConnectionHandler` instance when subscribing, and remove that exact reference in `close()`. This makes cleanup mandatory and automatic as part of the object's own lifecycle method, rather than an easy-to-forget separate step.

## Solution

```js
const { EventEmitter } = require('events');

const metricsBus = new EventEmitter();
metricsBus.setMaxListeners(1000); // headroom while we demonstrate; the real fix is below

// --- THE BUGGY VERSION ---
class LeakyConnectionHandler {
  constructor(id) {
    this.id = id;
    // BUG: anonymous arrow function is registered with no stored reference,
    // so there is no way to ever call metricsBus.off() with a matching function.
    metricsBus.on('tick', () => {
      // ... report this connection's stats ...
    });
  }

  close() {
    // Nothing removes the listener registered in the constructor — it leaks forever.
  }
}

// --- THE FIXED VERSION ---
class ConnectionHandler {
  #onTick;

  constructor(id) {
    this.id = id;
    // Store the exact function reference so it can be removed later.
    this.#onTick = () => {
      // ... report this connection's stats ...
    };
    metricsBus.on('tick', this.#onTick);
  }

  close() {
    // Cleanup lives inside the object's own lifecycle method — callers
    // don't need to remember any separate "unsubscribe" step.
    metricsBus.off('tick', this.#onTick);
  }
}

module.exports = { metricsBus, LeakyConnectionHandler, ConnectionHandler };

// --- verification / demonstration ---
function simulate(HandlerClass, cycles) {
  for (let i = 0; i < cycles; i++) {
    const conn = new HandlerClass(i);
    conn.close();
  }
  return metricsBus.listenerCount('tick');
}

metricsBus.removeAllListeners('tick');
const leakyCount = simulate(LeakyConnectionHandler, 50);
console.log('leaky listener count after 50 connect/close cycles:', leakyCount); // 50 — grows unbounded

metricsBus.removeAllListeners('tick');
const fixedCount = simulate(ConnectionHandler, 50);
console.log('fixed listener count after 50 connect/close cycles:', fixedCount); // 0 — back to baseline
```

**Why this works:** the leak isn't caused by using `EventEmitter` itself — it's caused by losing the reference needed to call `.off()`. Storing the bound/created listener function as an instance field (`#onTick`) guarantees `close()` always has the exact reference `on()` was called with, satisfying `EventEmitter`'s requirement that removal use the same function identity. Encapsulating the `metricsBus.off()` call inside `close()` (rather than documenting "please unsubscribe when done") means the cleanup is structurally tied to the object's lifecycle, so it can't be forgotten by a caller the way a standalone cleanup step could be.
