Here is the complete, production-ready React **Counter Application** refactored to use **`useReducer`**, covering all scenarios: increment, decrement, reset, and custom increment/decrement by a dynamic value.

### `CounterAppReducer.jsx`

```jsx
import React, { useReducer, useState } from 'react';

// 1. Define Action Types
const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset',
  INCREMENT_BY: 'increment_by',
  DECREMENT_BY: 'decrement_by',
};

// 2. Define the Reducer Function
function counterReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      return { count: state.count + 1 };
    case ACTIONS.DECREMENT:
      return { count: state.count - 1 };
    case ACTIONS.RESET:
      return { count: 0 };
    case ACTIONS.INCREMENT_BY:
      return { count: state.count + action.payload };
    case ACTIONS.DECREMENT_BY:
      return { count: state.count - action.payload };
    default:
      return state;
  }
}

export default function CounterAppReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  const [customValue, setCustomValue] = useState(5);

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setCustomValue(isNaN(val) ? 0 : val);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Counter (useReducer)</h1>
      <p className="text-xs text-gray-400 mb-6">Centralized state management with actions and reducer logic.</p>

      {/* Display Counter Value */}
      <div className="text-6xl font-extrabold text-blue-600 mb-8 tracking-tight">
        {state.count}
      </div>

      {/* Basic Controls: Increment & Decrement */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => dispatch({ type: ACTIONS.DECREMENT })}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
        >
          - Decrement
        </button>
        <button
          onClick={() => dispatch({ type: ACTIONS.INCREMENT })}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
        >
          + Increment
        </button>
      </div>

      {/* Reset Control */}
      <div className="mb-6">
        <button
          onClick={() => dispatch({ type: ACTIONS.RESET })}
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
            onClick={() => dispatch({ type: ACTIONS.DECREMENT_BY, payload: customValue })}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Subtract {customValue}
          </button>
          <button
            onClick={() => dispatch({ type: ACTIONS.INCREMENT_BY, payload: customValue })}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Add {customValue}
          </button>
        </div>
      </div>
    </div>
  );
}

```
