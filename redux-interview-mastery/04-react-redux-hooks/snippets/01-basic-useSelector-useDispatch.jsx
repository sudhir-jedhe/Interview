// Basic useSelector + useDispatch usage in a function component.
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { itemAdded, itemRemoved } from './cartSlice';

function CartSummary() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Cart ({items.length})</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => dispatch(itemRemoved(item.id))}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(itemAdded({ id: Date.now(), name: 'New item' }))}>
        Add item
      </button>
    </div>
  );
}

export default CartSummary;
