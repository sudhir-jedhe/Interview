Here is the complete, production-ready React **Counter Application** built using **Redux Toolkit (`@reduxjs/toolkit` and `react-redux`)**, covering all scenarios: increment, decrement, reset, and custom increment/decrement by a dynamic value.

### 1. Counter Slice (`counterSlice.js`)

This file defines the Redux slice, actions, and reducers using Redux Toolkit.

```javascript
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
    decrementByAmount: (state, action) => {
      state.count -= action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
} = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

```

---

### 2. Counter Component (`CounterAppReduxToolkit.jsx`)

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
} from './counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
  const [customValue, setCustomValue] = useState(5);

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setCustomValue(isNaN(val) ? 0 : val);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Counter (Redux Toolkit)</h1>
      <p className="text-xs text-gray-400 mb-6">State managed seamlessly with RTK slices.</p>

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
export default function CounterAppReduxToolkit() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

```
