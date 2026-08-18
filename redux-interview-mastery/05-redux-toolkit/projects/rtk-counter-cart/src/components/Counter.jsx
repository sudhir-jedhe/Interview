import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  decrement,
  incrementByAmount,
  stepChanged,
  reset,
  selectCounterValue,
  selectCounterStep,
} from '../features/counter/counterSlice';

export default function Counter() {
  // useSelector subscribes this component to just the slices of state it reads
  const value = useSelector(selectCounterValue);
  const step = useSelector(selectCounterStep);
  const dispatch = useDispatch();

  return (
    <section>
      <h2>Counter</h2>
      <p data-testid="counter-value">{value}</p>

      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>

      <label>
        Step:
        <input
          type="number"
          value={step}
          onChange={(e) => dispatch(stepChanged(Number(e.target.value) || 1))}
        />
      </label>
    </section>
  );
}
