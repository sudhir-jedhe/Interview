// jsx: how selectors get consumed in components via useSelector.
import React from 'react';
import { useSelector } from 'react-redux';
import { selectInStockItems } from './02-createSelector-basic';

export function InStockList() {
  // useSelector re-runs this selector on every dispatched action, but because
  // selectInStockItems is memoized, it only triggers a re-render of THIS
  // component when the memoized result's reference actually changes.
  const items = useSelector(selectInStockItems);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// useSelector's default comparison is reference equality (===) — this is exactly
// why returning the SAME array/object reference when nothing relevant changed
// (what createSelector's memoization guarantees) is what prevents wasted renders.
