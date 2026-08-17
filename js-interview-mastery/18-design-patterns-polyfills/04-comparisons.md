# Comparisons: Design Patterns & Polyfills

## Debounce vs. throttle (implementation-level)

| Aspect | Debounce | Throttle |
|---|---|---|
| Core mechanism | `clearTimeout` + reschedule on every call | Timestamp check, ignore calls inside the window |
| When `fn` runs | Once, after calls stop for `delay` ms | Repeatedly, at most once per `interval` ms |
| Guarantees a call during nonstop activity | No | Yes (roughly every `interval`) |
| State needed | One timer id | One "last called at" timestamp (or a timer for trailing-edge variants) |

Use throttle for anything needing periodic feedback during continuous input (drag, scroll position). Use debounce for anything that should only react to the *settled* final state (validation after typing stops). Mixing them up is the most common mistake — e.g., throttling a search box means firing requests mid-typing on outdated partial input.

## Module pattern (IIFE) vs. ES modules

| Aspect | IIFE module pattern | ES modules (`import`/`export`) |
|---|---|---|
| Privacy mechanism | Closure over local variables | File scope — top-level bindings aren't global by default |
| Syntax overhead | Manual wrapping, manual public API object | Native `export`/`import` keywords |
| Static analysis (tree-shaking, etc.) | Not possible — dynamic object | Possible — imports/exports are statically analyzable |
| Still relevant today? | Mostly for interviews / legacy code / bundler-output patterns | Yes, the standard for all modern code |

Know the IIFE pattern because it explains *why* closures matter and shows up in legacy code and interview questions, but default to ES modules in real projects. A common mistake is over-engineering module-pattern boilerplate in new code where native modules already solve the problem more simply.

## Singleton pattern vs. a plain exported module object

| Aspect | Explicit Singleton class | Plain exported object from a module |
|---|---|---|
| Enforces one instance | Yes, via constructor check | Implicitly, via module caching (import returns the same reference every time) |
| Boilerplate | More (constructor guard logic) | Less (just export an object literal) |
| When it's actually needed | When consumers might call `new` directly and need to be stopped from creating duplicates | Most everyday cases — module caching already gives you this for free |

In JavaScript, the classic Singleton pattern is often unnecessary boilerplate because the module system already caches modules — importing the same file twice gives the same object reference. The common mistake is reaching for the class-based Singleton pattern out of habit from other languages when a plain exported object would do.

## Observer/pub-sub vs. direct callback passing

| Aspect | Observer/pub-sub (event emitter) | Direct callback argument |
|---|---|---|
| Coupling | Loose — publisher doesn't know who's listening | Tight — caller must pass the exact callback at call time |
| Multiple subscribers | Trivial — just call `.on()` multiple times | Requires manually managing an array of callbacks yourself |
| Late subscription | Supported — subscribe any time before the event fires | Not possible — callback must exist before the call |
| Debuggability | Harder to trace "who's listening to what" in large systems | Easy to trace — it's just a function call |

Use pub-sub when many independent parts of a system need to react to the same event without knowing about each other (UI components reacting to a global state change). Use a direct callback when there's a single, well-defined caller-callee relationship — reaching for an event emitter there is overkill and makes the code harder to follow.
