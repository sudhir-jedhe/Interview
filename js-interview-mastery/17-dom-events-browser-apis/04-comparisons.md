# Comparisons: DOM, Events & Browser APIs

## `textContent` vs `innerHTML`

| Aspect | `textContent` | `innerHTML` |
|---|---|---|
| Parses input as HTML | No — treated as literal text | Yes — creates real DOM nodes |
| XSS risk with untrusted input | None | High — can execute scripts/handlers |
| Performance | Faster (no parsing) | Slower (parses + re-renders subtree) |
| Use case | Displaying any text, especially user-generated | Inserting known-safe, pre-sanitized markup |

Default to `textContent` for anything containing user input or API data you don't fully control. The most common mistake is using `innerHTML` for "convenience" (e.g., building a list from an array with template strings) without realizing any of that data could contain a `<script>` or `onerror` handler.

## `preventDefault()` vs `stopPropagation()` vs `stopImmediatePropagation()`

| Aspect | `preventDefault()` | `stopPropagation()` | `stopImmediatePropagation()` |
|---|---|---|---|
| Stops default browser action | Yes | No | No (unless also called) |
| Stops event from reaching other elements | No | Yes | Yes |
| Stops other listeners on the *same* element | No | No | Yes |
| Typical use | Block form submit / link navigation | Prevent a parent's delegated handler from firing | Cancel a plugin/library's remaining handlers |

These are independent controls, not a spectrum — you often need both `preventDefault()` and `stopPropagation()` together (e.g., a custom dropdown item that shouldn't navigate *and* shouldn't trigger a parent "close on click" handler). The common mistake is calling only one and being confused why the "other" behavior still happens.

## Debounce vs. throttle

| Aspect | Debounce | Throttle |
|---|---|---|
| Trigger timing | Fires once after events stop for N ms | Fires at most once every N ms while events keep firing |
| Guarantees a call during continuous activity | No — can be delayed indefinitely if events never stop | Yes — regular cadence regardless of activity |
| Typical use | Search-as-you-type, resize-end, autosave | Scroll position tracking, mousemove-driven UI, rate-limited API polling |
| Risk if misused | Search feels laggy if delay too long | UI feels choppy if interval too long |

Use debounce when you only care about the *final* state after activity settles; use throttle when you need steady, periodic updates *during* continuous activity. The common mistake is using debounce for scroll handlers, which can make the UI feel unresponsive because nothing updates until scrolling completely stops.

## `event.target` vs `event.currentTarget`

| Aspect | `event.target` | `event.currentTarget` |
|---|---|---|
| What it refers to | The element that originated the event | The element the listener is attached to |
| Changes during bubbling? | No — fixed at dispatch | No — fixed per listener invocation, but differs per listener |
| Use case | Event delegation (identify which child was interacted with) | Rarely needed directly; `this` inside a non-arrow handler equals it |

The common confusion is expecting `target` to change as an event bubbles — it doesn't; it's always the original element the event started on. `currentTarget` is what changes, because it reflects whichever element's listener is currently executing.
