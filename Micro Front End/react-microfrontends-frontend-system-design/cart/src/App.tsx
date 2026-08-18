import { useEffect, useState } from "react";
import "./App.css";
import {
  CART_ADD_EVENT,
  readCartItems,
  writeCartItems,
} from "@microshop/cart-contract";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

function App() {
  const [items, setItems] = useState<CartItem[]>(() => readCartItems());

  useEffect(() => {
    const onAdd = () => setItems(readCartItems());

    window.addEventListener(CART_ADD_EVENT, onAdd);
    return () => window.removeEventListener(CART_ADD_EVENT, onAdd);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    writeCartItems(next);
    setItems(next);
  };

  const clearCart = () => {
    writeCartItems([]);
    setItems([]);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Cart MFE · standalone</p>
          <h1>Cart</h1>
        </div>
      </header>

      <main className="main">
        <section className="panel">
          <div className="panel-top">
            <h2>Your cart</h2>
            <span className="badge">Items: {totalCount}</span>
          </div>

          {items.length === 0 ? (
            <p className="empty">Cart is empty. Add a product from Products.</p>
          ) : (
            <ul className="list">
              {items.map((item) => (
                <li key={item.id} className="row">
                  <span>
                    {item.name} × {item.quantity} — $
                    {item.price * item.quantity}
                  </span>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 ? (
            <div className="footer">
              <strong>Total: ${totalPrice}</strong>
              <button type="button" className="secondary" onClick={clearCart}>
                Clear cart
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
