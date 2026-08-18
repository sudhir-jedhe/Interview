# Interview Q&A — Error Handling and Leaks

**Q: What happens if you emit an `'error'` event with no listeners attached?**
Node treats `'error'` as a special event. If there is no listener for it, Node throws the error object as an uncaught exception inside the `emit()` call, which by default crashes the process. This is intentional — it forces developers to explicitly handle errors on emitters rather than silently swallowing them.

**Q: How do you safely handle errors on an EventEmitter you don't control (e.g., a third-party socket)?**
Always attach an `'error'` listener before performing any operations that could trigger one, ideally immediately after creating the emitter:
```js
socket.on('error', (err) => console.error('socket error:', err));
```
This ensures the error is caught and handled rather than crashing the process.

**Q: What is `MaxListenersExceededWarning` and what typically causes it?**
It's a diagnostic warning Node logs when more than the default limit (10) of listeners are registered for the same event name on the same emitter. It's a heuristic leak detector, not an error — the emitter still functions past 10. It's typically caused by registering a new listener inside a function that runs repeatedly (e.g., a request handler) instead of registering it once during setup.

**Q: How do you fix a legitimate (non-leak) case of exceeding the listener limit?**
Call `emitter.setMaxListeners(n)` to raise the cap for that specific emitter to a value appropriate for the expected number of subscribers, rather than disabling the warning globally, which would hide genuine leaks elsewhere in the application.
