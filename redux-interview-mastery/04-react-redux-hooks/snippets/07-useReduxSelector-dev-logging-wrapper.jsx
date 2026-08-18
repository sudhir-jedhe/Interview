// A small custom hook wrapping useSelector with development-mode logging of
// what changed on each re-render — useful for debugging unexpected re-renders.
import { useSelector } from 'react-redux';
import { useRef } from 'react';

export function useReduxSelectorWithLogging(selector, label) {
  const previousRef = useRef(undefined);
  const value = useSelector(selector);

  if (process.env.NODE_ENV !== 'production' && previousRef.current !== value) {
    console.log(`[useReduxSelectorWithLogging] "${label}" changed:`, {
      from: previousRef.current,
      to: value,
    });
    previousRef.current = value;
  }

  return value;
}

// Usage:
// const itemCount = useReduxSelectorWithLogging(
//   (state) => state.cart.items.length,
//   'cart.items.length'
// );
