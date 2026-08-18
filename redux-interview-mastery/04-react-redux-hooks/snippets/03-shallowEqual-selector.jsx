// Using shallowEqual to avoid re-renders when a selector must return an
// array/object, but its contents are often unchanged in practice.
import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

function ActiveItemsList() {
  const activeItems = useSelector(
    (state) => state.cart.items.filter((item) => item.active),
    shallowEqual // compares the resulting array shallowly, not by reference
  );

  console.log('ActiveItemsList rendered'); // watch this in devtools/console

  return (
    <ul>
      {activeItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

export default ActiveItemsList;
