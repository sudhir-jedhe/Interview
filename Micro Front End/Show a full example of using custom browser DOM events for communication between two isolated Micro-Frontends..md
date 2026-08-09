Show a full example of using custom browser DOM events for communication between two isolated Micro-Frontends.

Using native **Custom DOM Events** is the industry-standard, framework-agnostic way to enable communication between isolated Micro-Frontends (MFEs). It keeps MFEs completely decoupled—neither app needs to know about the internal implementation, state management, or React component hierarchy of the other.

Below is a complete, production-ready example featuring two isolated Micro-Frontends:

1. **Product Catalog MFE (Sender):** Emits an action when a user adds a product to their cart.
2. **Header Cart MFE (Receiver):** Listens for the custom event and updates its cart item count and total badge in real time.

---

### Step 1: Create a Strongly-Typed Event Contract

To prevent typos and ensure type safety across teams, define a shared event contract (e.g., in a shared TypeScript types file or package).

```typescript
// shared/events.ts

// 1. Define the Payload Interface
export interface CartItemPayload {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

// 2. Define Unique Event Names
export const MFE_EVENTS = {
  ADD_TO_CART: 'mfe:cart:add_item',
  CLEAR_CART: 'mfe:cart:clear',
} as const;

// 3. Define the Custom Event Type
export interface AddToCartCustomEvent extends CustomEvent<CartItemPayload> {
  type: typeof MFE_EVENTS.ADD_TO_CART;
}

// 4. Helper Function to Dispatch the Event
export const dispatchAddToCart = (payload: CartItemPayload) => {
  const event = new CustomEvent<CartItemPayload>(MFE_EVENTS.ADD_TO_CART, {
    detail: payload,
    bubbles: true,   // Allows event to bubble up the DOM tree
    composed: true,  // Crosses Shadow DOM boundaries if Shadow DOM is used
  });
  window.dispatchEvent(event);
};

```

---

### Step 2: The Sender MFE (Product Catalog)

This MFE contains a product list. When the user clicks "Add to Cart", it calls the `dispatchAddToCart` helper to broadcast a custom DOM event on the `window` object.

```tsx
// ProductCatalogMFE/src/ProductCard.tsx
import React from 'react';
import { dispatchAddToCart, CartItemPayload } from './shared/events';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, title, price }) => {
  const handleAddToCart = () => {
    const item: CartItemPayload = {
      productId: id,
      title,
      price,
      quantity: 1,
    };

    // Trigger action by dispatching custom DOM event
    dispatchAddToCart(item);
    console.log(`[Product Catalog MFE] Dispatched ${MFE_EVENTS.ADD_TO_CART} event:`, item);
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <p>Price: ${price.toFixed(2)}</p>
      <button 
        onClick={handleAddToCart}
        style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Add to Cart
      </button>
    </div>
  );
};

```

---

### Step 3: Create a Custom Hook for Listening to Events

In the receiving MFE, encapsulate the DOM event listener inside a custom React hook. This ensures proper subscription on mount and cleanup on unmount to prevent memory leaks.

```typescript
// HeaderCartMFE/src/hooks/useMfeEventListener.ts
import { useEffect } from 'react';

export function useMfeEventListener<T>(
  eventName: string,
  handler: (payload: T) => void
) {
  useEffect(() => {
    // Event listener bridge
    const eventListener = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      handler(customEvent.detail);
    };

    // Attach listener to window
    window.addEventListener(eventName, eventListener);

    // Clean up listener on component unmount
    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName, handler]);
}

```

---

### Step 4: The Receiver MFE (Header Cart)

This MFE sits in the top navigation bar. It uses `useMfeEventListener` to listen for `mfe:cart:add_item` events and updates its internal React state when an event arrives.

```tsx
// HeaderCartMFE/src/HeaderCartBadge.tsx
import React, { useState, useCallback } from 'react';
import { MFE_EVENTS, CartItemPayload } from './shared/events';
import { useMfeEventListener } from './hooks/useMfeEventListener';

export const HeaderCartBadge: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Stable callback handler for event listener
  const handleItemAdded = useCallback((newItem: CartItemPayload) => {
    console.log('[Header Cart MFE] Received custom event:', newItem);
    setCartCount((prevCount) => prevCount + newItem.quantity);
    setTotalAmount((prevTotal) => prevTotal + newItem.price * newItem.quantity);
  }, []);

  // Listen for the custom DOM event broadcasted by any MFE
  useMfeEventListener<CartItemPayload>(MFE_EVENTS.ADD_TO_CART, handleItemAdded);

  return (
    <div style={{ padding: '12px 24px', background: '#1e293b', color: '#fff', display: 'flex', gap: '16px' }}>
      <span>🛒 Cart Items: <strong>{cartCount}</strong></span>
      <span>Total: <strong>${totalAmount.toFixed(2)}</strong></span>
    </div>
  );
};

```

---

### Step 5: Putting It Together in the Shell App

Here is how both independent components operate inside a single Host Shell application:

```tsx
// HostShell/src/App.tsx
import React from 'react';
import { HeaderCartBadge } from 'header_cart_mfe/HeaderCartBadge';
import { ProductCard } from 'product_catalog_mfe/ProductCard';

export default function App() {
  return (
    <div>
      {/* Receiver MFE */}
      <HeaderCartBadge />

      <main style={{ padding: '24px', display: 'flex', gap: '16px' }}>
        {/* Sender MFE components */}
        <ProductCard id="p-101" title="Wireless Headphones" price={99.99} />
        <ProductCard id="p-102" title="Mechanical Keyboard" price={149.50} />
      </main>
    </div>
  );
}

```

---

### Key Operational Rules for Event-Based MFE Communication

1. **Always clean up event listeners:** Unsubscribing inside `useEffect`'s cleanup return function (`window.removeEventListener`) is mandatory to prevent memory leaks when MFEs mount and unmount.
2. **Set `bubbles: true` and `composed: true`:** If any of your MFEs use Shadow DOM encapsulations (e.g., Web Components), setting `composed: true` ensures the custom event escapes the Shadow DOM boundary into the global window tree.
3. **Keep payloads small and serializable:** Pass lightweight IDs, quantities, or simple state objects through event details rather than passing heavy class instances or React component nodes.
