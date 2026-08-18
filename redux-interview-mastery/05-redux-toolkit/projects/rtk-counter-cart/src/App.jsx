import React from 'react';
import Counter from './components/Counter';
import Cart from './components/Cart';

export default function App() {
  return (
    <main>
      <h1>RTK Counter + Cart Demo</h1>
      <Counter />
      <hr />
      <Cart />
    </main>
  );
}
