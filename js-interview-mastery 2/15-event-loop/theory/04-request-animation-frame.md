# `requestAnimationFrame`

`requestAnimationFrame(fn)` schedules `fn` to run right before the browser's next repaint — it's neither a macrotask nor a microtask in the same sense; it runs after microtasks have drained but before the browser paints the next frame, roughly once per display refresh (~16.7ms at 60Hz). It's used for visual updates (animations) that should be synced to the rendering cycle rather than an arbitrary timer.

## `requestAnimationFrame` vs. `setTimeout`

| Aspect | `requestAnimationFrame` | `setTimeout` |
|---|---|---|
| Timing | Synced to the browser's repaint cycle (~every 16.7ms at 60Hz) | Arbitrary delay you specify, not synced to rendering |
| Pauses when tab hidden | Yes — browsers throttle/pause rAF in background tabs, saving resources | No — timers keep firing (though often throttled to 1000ms minimum in background tabs) |
| Best for | Visual animations, layout reads/writes | General-purpose deferred/delayed logic |

Always use `requestAnimationFrame` for animation logic rather than `setTimeout(fn, 16)` — it's automatically synced to the display's actual refresh rate and pauses appropriately when the tab isn't visible, avoiding wasted work and janky, drift-prone timing that a fixed-interval timer would produce.

## Where it fits in the loop

Per iteration of the event loop, roughly: run one macrotask → drain all microtasks → if a repaint is due, run any pending `requestAnimationFrame` callbacks → paint → move to the next macrotask. This means a `requestAnimationFrame` callback always sees the DOM/state as it stood after all microtasks from the current cycle have already applied, which is exactly what you want before reading layout values or drawing a frame.
