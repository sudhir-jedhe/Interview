# EventEmitter Fundamentals

## Why EventEmitter matters

`EventEmitter` (from the `events` module) is the backbone of Node's async design. `net.Socket`, `http.Server`, `fs.ReadStream`, `process` itself — all extend `EventEmitter`. If you understand `EventEmitter`, you understand a huge chunk of how Node's core APIs communicate: not via callbacks-only or promises, but via named events that can fire zero, one, or many times over an object's lifetime (as opposed to a Promise, which settles exactly once).

```js
const { EventEmitter } = require('events');

class Ticker extends EventEmitter {
  start() {
    let count = 0;
    this.interval = setInterval(() => this.emit('tick', ++count), 1000);
  }
}

const ticker = new Ticker();
ticker.on('tick', (n) => console.log(`tick ${n}`));
ticker.start();
```

## Core API

- `.on(event, listener)` — register a listener, called every time `event` fires.
- `.once(event, listener)` — register a listener that auto-removes itself after firing once.
- `.emit(event, ...args)` — synchronously call every listener registered for `event`, in the order they were added, passing `args`. Returns `true` if there were listeners, `false` otherwise.
- `.off(event, listener)` (alias for `.removeListener`) — remove a specific listener.
- `.removeAllListeners([event])` — nuke all listeners for an event, or all events if no argument given.

## Custom EventEmitter subclass vs a plain callback API

| Aspect | EventEmitter subclass | Plain callback parameter |
|---|---|---|
| Multiple subscribers | Yes, unlimited independent listeners | Typically one callback per call |
| Discoverability | Named events document the object's "vocabulary" | Implicit, tied to a single call signature |
| Overhead | Slightly more setup (extends EventEmitter) | Minimal, simple function passing |

Use an EventEmitter subclass when an object has multiple, independent things that can happen over its lifetime and multiple consumers may care about different subsets (e.g., a `Job` class emitting `progress`, `complete`, `error`). Use a plain callback for a simple one-shot async operation. The common mistake is over-engineering a single-callback use case into a full EventEmitter when a Promise or plain callback would be simpler and clearer.
