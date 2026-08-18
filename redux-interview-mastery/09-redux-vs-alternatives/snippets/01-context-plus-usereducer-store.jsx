// Requires: react
// A minimal Context + useReducer "store" replicating Redux's dispatch/reducer loop for a counter.

import React, { createContext, useContext, useReducer } from 'react';

const CounterContext = createContext(null);

function counterReducer(state, action) {
  switch (action.type) {
    case 'incremented':
      return { value: state.value + 1 };
    case 'decremented':
      return { value: state.value - 1 };
    default:
      return state;
  }
}

export function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, { value: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error('useCounter must be used within a CounterProvider');
  return ctx;
}

export function CounterDisplay() {
  const { state, dispatch } = useCounter();
  return (
    <div>
      <span>{state.value}</span>
      <button onClick={() => dispatch({ type: 'incremented' })}>+</button>
      <button onClick={() => dispatch({ type: 'decremented' })}>-</button>
    </div>
  );
}

// Usage: <CounterProvider><CounterDisplay /></CounterProvider>
// Note what's missing vs Redux: no DevTools time-travel, no middleware pipeline,
// and every consumer of CounterContext re-renders on ANY state change (no selector narrowing).
