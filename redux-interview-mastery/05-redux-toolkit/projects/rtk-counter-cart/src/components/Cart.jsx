import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  itemAdded,
  itemRemoved,
  quantityChanged,
  cartCleared,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
} from '../features/cart/cartSlice';

const CATALOG = [
  { id: 'widget', name: 'Widget', price: 9.99 },
  { id: 'gadget', name: 'Gadget', price: 19.99 },
  { id: 'gizmo', name: 'Gizmo', price: 4.5 },
];

export default function Cart() {
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  return (
    <section>
      <h2>Cart ({itemCount} items)</h2>

      <ul>
        {CATALOG.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price.toFixed(2)}{' '}
            <button onClick={() => dispatch(itemAdded(product))}>Add</button>
          </li>
        ))}
      </ul>

      <h3>Your cart</h3>
      {items.length === 0 && <p>Empty</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x{' '}
            <input
              type="number"
              min={0}
              value={item.quantity}
              onChange={(e) =>
                dispatch(quantityChanged({ id: item.id, quantity: Number(e.target.value) }))
              }
            />
            {' '}= ${(item.price * item.quantity).toFixed(2)}{' '}
            <button onClick={() => dispatch(itemRemoved(item.id))}>Remove</button>
          </li>
        ))}
      </ul>

      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch(cartCleared())} disabled={items.length === 0}>
        Clear cart
      </button>
    </section>
  );
}
