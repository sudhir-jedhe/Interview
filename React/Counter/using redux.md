Here is the complete, production-ready React **Counter Application** built using **Classic / Old Redux** (pre-Toolkit, using `createStore`, action creators, switch-case reducers, and `react-redux` hooks), covering all scenarios: increment, decrement, reset, and custom increment/decrement by a dynamic value.

### 1. Old Redux Store Setup (`counterStore.js`)

This file defines the action types, action creators, reducer with a `switch` statement, and configures the Redux store using `legacy_createStore`.

```javascript
import { legacy_createStore as createStore } from 'redux';

// 1. Action Types
const TYPES = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  INCREMENT_BY: 'INCREMENT_BY',
  DECREMENT_BY: 'DECREMENT_BY',
};

// 2. Action Creators
export const increment = () => ({ type: TYPES.INCREMENT });
export const decrement = () => ({ type: TYPES.DECREMENT });
export const reset = () => ({ type: TYPES.RESET });
export const incrementByAmount = (amount) => ({ type: TYPES.INCREMENT_BY, payload: amount });
export const decrementByAmount = (amount) => ({ type: TYPES.DECREMENT_BY, payload: amount });

// 3. Initial State
const initialState = { count: 0 };

// 4. Reducer Function (Classic Switch Case)
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.INCREMENT:
      return { ...state, count: state.count + 1 };
    case TYPES.DECREMENT:
      return { ...state, count: state.count - 1 };
    case TYPES.RESET:
      return { ...state, count: 0 };
    case TYPES.INCREMENT_BY:
      return { ...state, count: state.count + action.payload };
    case TYPES.DECREMENT_BY:
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
}

// 5. Create Store
export const store = createStore(counterReducer);

```

---

### 2. Counter Component (`CounterAppOldRedux.jsx`)

```javascript
import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
  store,
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
} from './counterStore';

function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const [customValue, setCustomValue] = useState(5);

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setCustomValue(isNaN(val) ? 0 : val);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Counter (Old Redux)</h1>
      <p className="text-xs text-gray-400 mb-6">Built using classic createStore and switch reducers.</p>

      {/* Display Counter Value */}
      <div className="text-6xl font-extrabold text-blue-600 mb-8 tracking-tight">
        {count}
      </div>

      {/* Basic Controls: Increment & Decrement */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => dispatch(decrement())}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
        >
          - Decrement
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
        >
          + Increment
        </button>
      </div>

      {/* Reset Control */}
      <div className="mb-6">
        <button
          onClick={() => dispatch(reset())}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider"
        >
          Reset Counter
        </button>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Custom Value Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Custom Value:</span>
          <input
            type="number"
            value={customValue}
            onChange={handleCustomChange}
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch(decrementByAmount(customValue))}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Subtract {customValue}
          </button>
          <button
            onClick={() => dispatch(incrementByAmount(customValue))}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Add {customValue}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Redux Provider
export default function CounterAppOldRedux() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

```
