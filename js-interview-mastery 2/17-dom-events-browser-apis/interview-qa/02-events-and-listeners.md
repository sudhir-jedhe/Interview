# Interview Q&A: Events & Listeners

**Q: Explain event bubbling and capturing.**
Every DOM event conceptually travels in three phases: capturing (from the `window` down to the target), the target phase, then bubbling (back up from the target to `window`). By default `addEventListener` listens on the bubbling phase; passing `{ capture: true }` makes it listen on the capturing phase instead, so it fires before the target's own handlers.

**Q: What is event delegation and why use it?**
Event delegation means attaching a single listener to a common ancestor instead of individual listeners to each of many children, then using `event.target` (often with `.closest()`) inside the handler to determine which child actually triggered it. It reduces memory/setup overhead for large lists and automatically covers elements added to the DOM later, since there's no need to attach a new listener per new child.

**Q: What's the difference between `preventDefault()` and `stopPropagation()`?**
`preventDefault()` cancels the browser's default action for the event (like following a link or submitting a form) but does not stop the event from continuing to bubble or capture. `stopPropagation()` stops the event from reaching other elements in the propagation path but has no effect on the browser's default action — they're independent and often need to be called together.

**Q: What does `stopImmediatePropagation()` add on top of `stopPropagation()`?**
It stops propagation to other elements *and* prevents any remaining listeners registered on the *same* element for that event from running, even ones registered before it in the call order but not yet executed. Regular `stopPropagation()` still lets all listeners on the current element finish running.

**Q: Why is `element.addEventListener` generally preferred over inline `onclick` attributes or `element.onclick = fn`?**
`addEventListener` allows multiple listeners on the same event without overwriting each other (assigning `.onclick` twice replaces the first handler), supports the capture phase and options like `{ once: true }` or `{ passive: true }`, and keeps behavior out of HTML markup, which improves separation of concerns and avoids inline-script CSP restrictions.

**Q: What does the `{ passive: true }` option do on `addEventListener`, and why does it matter for scroll performance?**
It tells the browser the listener will never call `preventDefault()`, so the browser doesn't have to wait for the handler to finish before starting the default scroll/touch behavior — this avoids input lag on touch/scroll events, which is significant on mobile. Using it on a listener that *does* call `preventDefault()` causes the call to be silently ignored (with a console warning), so it should only be used when you genuinely don't need to prevent the default.
