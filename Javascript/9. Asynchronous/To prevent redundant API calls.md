API call is faced every time the user open the same page. How would you optimize it? Use caching like a memory cache, local storage, react query, browser cache.

To prevent redundant API calls and optimize performance, we need to treat the shopping cart as **server state** rather than just local UI state.

Here is how you can implement the caching strategies you mentioned, ranked from the industry standard to alternative approaches.

### 1. The Industry Standard: React Query (TanStack Query)

For modern React applications, **React Query** is the ultimate tool for this. It provides an in-memory cache, deduplicates multiple requests into a single network call, and handles "stale-while-revalidate" logic out of the box.

Instead of hitting the API every time a component mounts, React Query reads from its memory cache first.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Fetch Cart (Cached in Memory)
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    // The data remains "fresh" for 5 minutes. No API calls are made if the 
    // user navigates around during this window.
    staleTime: 5 * 60 * 1000, 
    // Keep the cache in memory for 30 minutes even if unused
    gcTime: 30 * 60 * 1000,   
  });
};

// 2. Add to Cart (Invalidates Cache or Optimistically Updates)
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product) => {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      return res.json();
    },
    onSuccess: () => {
      // Instantly marks the cache as stale, triggering a background refetch
      // so the UI stays perfectly in sync with the backend.
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

```

### 2. The "Cache-Then-Network" Pattern: Local Storage + Context

If you prefer not to add a heavy library like React Query, you can combine `localStorage` with the Context API. This gives the user an **instant UI load** (reading from local storage) while silently verifying the cart against the database in the background.

```jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartProvider = ({ children }) => {
  // 1. Initialize state synchronously from Local Storage (Instant Load)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopping_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const syncCart = async () => {
      try {
        // 2. Fetch the true state from the database
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        // 3. Update memory state
        setCart(data.items);
        
        // 4. Update the local storage cache
        localStorage.setItem('shopping_cart', JSON.stringify(data.items));
      } catch (error) {
        console.error("Failed to background sync cart");
      }
    };

    // Only run the API call if the cart is empty or based on a timestamp
    syncCart();
  }, []); // Runs on mount, but UI isn't blocked waiting for it

  // ... addToCart function ...
}

```

### 3. HTTP Browser Caching (Server-Side Control)

You can rely on the browser's native HTTP cache by configuring your backend to send specific `Cache-Control` headers.

However, **this is generally risky for shopping carts**. Cart data is highly dynamic; if the cache isn't invalidated properly when a user adds an item, they will see a stale cart.

If you go this route, use **ETags** instead of time-based caching:

* **The Flow:** The backend sends an `ETag` (a unique hash of the cart data) in the header. On the next page load, the browser sends the `ETag` back. If the cart hasn't changed, the server returns a fast `304 Not Modified` status with an empty body, saving bandwidth and processing time.
* **Header Example:** `Cache-Control: no-cache` (This forces the browser to revalidate the ETag with the server every time, rather than serving a potentially outdated local copy).

---

### Which should you choose?

For an enterprise-grade React architecture, **React Query** (or SWR) is heavily favored. It abstracts away the boilerplate of `useEffect`, handles the race conditions that plague custom caching logic, and seamlessly integrates with optimistic UI updates.

Implementing optimistic UI updates with React Query (TanStack Query) ensures that the user's interface updates instantly when they click "Add to Cart," while handling network requests and potential rollbacks safely in the background.

Here is how to implement an optimistic mutation for a shopping cart using **TanStack Query v5**.

---

### Step-by-Step Implementation

To achieve an optimistic update, you use the `onMutate`, `onError`, and `onSettled` options provided by the `useMutation` hook.

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product) => {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      return response.json();
    },

    // 1. BEFORE the network request fires:
    onMutate: async (newProduct) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value for rollback purposes
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update the cache with the new item
      queryClient.setQueryData(['cart'], (oldCart = []) => {
        const existingItem = oldCart.find((item) => item.id === newProduct.id);
        
        if (existingItem) {
          return oldCart.map((item) =>
            item.id === newProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...oldCart, { ...newProduct, quantity: 1 }];
      });

      // Return context object with the snapshotted value
      return { previousCart };
    },

    // 2. IF the network request FAILS:
    onError: (err, newProduct, context) => {
      // Roll back the cache to the snapshot we saved in onMutate
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      console.error("Could not add item, rolling back UI changes:", err);
    },

    // 3. ALWAYS, whether success or failure:
    onSettled: () => {
      // Refetch the cart query to ensure the client matches the true server state
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

```

---

### How to Use It in Your Component

Because React Query manages the cache globally, any component that reads the cart using `useQuery` will automatically update the moment `onMutate` runs.

```jsx
import React from 'react';
import { useAddToCart } from './useCartMutations';

const ProductCard = ({ product }) => {
  const { mutate: addToCart, isPending } = useAddToCart();

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h4>{product.name}</h4>
      <p>${product.price}</p>
      
      <button 
        onClick={() => addToCart(product)} 
        disabled={isPending}
      >
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;

```

### Why This Architecture Shines

* **Zero UI Latency:** The cart badge updates immediately on click, bypassing network delays entirely.
* **Automatic Rollback:** If the user loses internet connection or the server throws an error, the cart instantly reverts to its previous state and prevents data desynchronization.
* **Self-Correcting:** `onSettled` triggers a background validation check (`invalidateQueries`), ensuring your client cache stays aligned with database triggers, server-side discounts, or inventory limits.
