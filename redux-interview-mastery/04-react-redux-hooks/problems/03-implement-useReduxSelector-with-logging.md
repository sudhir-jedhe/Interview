# Problem: Implement a `useReduxSelector` Wrapper With Development-Mode Change Logging

## Task

Build a custom hook, `useReduxSelector`, that behaves exactly like `useSelector` but additionally logs (in development only) what changed — the previous value, the new value, and a caller-supplied label — every time the selected value actually changes. This is a common "extend a library hook" exercise that tests whether you understand `useSelector`'s contract well enough to wrap it correctly.

## Requirements

- Must accept the same arguments `useSelector` does: a selector function, and an optional equality function.
- Must return the exact same value `useSelector` would return — the wrapper should be a transparent drop-in replacement.
- Must log only when the selected value actually changes (not on every render for unrelated reasons), and only outside production builds.
- Must not break `useSelector`'s own re-render-skipping behavior — the wrapper itself must not introduce extra re-renders.

## Solution

```jsx
import { useSelector } from 'react-redux';
import { useRef } from 'react';

export function useReduxSelector(selector, equalityFnOrLabel, maybeLabel) {
  // Support both useReduxSelector(selector, label) and
  // useReduxSelector(selector, equalityFn, label) call shapes.
  let equalityFn;
  let label;
  if (typeof equalityFnOrLabel === 'function') {
    equalityFn = equalityFnOrLabel;
    label = maybeLabel;
  } else {
    label = equalityFnOrLabel;
  }

  const value = useSelector(selector, equalityFn);
  const previousValueRef = useRef(value);
  const isFirstRunRef = useRef(true);

  if (process.env.NODE_ENV !== 'production') {
    const changed = isFirstRunRef.current || previousValueRef.current !== value;
    if (changed && !isFirstRunRef.current) {
      console.log(
        `%c[useReduxSelector]%c ${label ?? '(unlabeled)'} changed`,
        'color: #8a5cf6; font-weight: bold',
        'color: inherit',
        { from: previousValueRef.current, to: value }
      );
    }
    previousValueRef.current = value;
    isFirstRunRef.current = false;
  }

  return value;
}
```

## Quick verification

```jsx
function ItemCount() {
  const count = useReduxSelector((state) => state.cart.items.length, 'cart.items.length');
  return <span>{count}</span>;
}

// In a dev console, after dispatching a couple of cart/itemAdded actions:
// [useReduxSelector] cart.items.length changed { from: 0, to: 1 }
// [useReduxSelector] cart.items.length changed { from: 1, to: 2 }
// (no log at all for dispatches that don't change this selector's result)
```

## Interview follow-ups this problem invites

- "Why use a `useRef` instead of `useState` to track the previous value?" `useState` would trigger an *additional* re-render whenever the tracked value updates (since calling its setter schedules a state update), which would defeat the whole purpose — this hook must not cause more re-renders than plain `useSelector` already would. `useRef` persists a mutable value across renders without triggering re-renders on write, which is exactly what's needed for "remember what I saw last time, silently."
- "Why guard the logging with `!isFirstRunRef.current`?" Without it, every component's very first render would log a spurious "changed" from `undefined`/initial-ref-value to the actual first value — which isn't a real change, just the initial read. The guard suppresses that noise so logs only reflect genuine subsequent changes.
- "Does this hook correctly support passing a custom equality function like `shallowEqual`, matching `useSelector`'s own API?" Yes — it forwards `equalityFn` straight through to the underlying `useSelector` call, so the re-render-skipping behavior (and therefore how often this wrapper's own logic even runs) is identical to using `useSelector` directly with the same equality function; the wrapper only adds observation, not different comparison semantics.
