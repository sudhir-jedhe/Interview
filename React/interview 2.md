
1. Implement Infinite Scroll Component.
 Implement an infinite scroll component in React that handles data fetching and error handling.

2. Create Debounced Search Functionality.
 Create a debounced search functionality in a React application.

3. Design Responsive Grid Layout.
 Design a responsive grid layout using CSS Grid or Flexbox.

🔎 𝐒𝐞𝐜𝐨𝐧𝐝 𝐑𝐨𝐮𝐧𝐝 (𝐂𝐨𝐝𝐢𝐧𝐠):

1. Implement Custom useDebounce Hook.
 Implement a custom `useDebounce` hook from scratch for a React application.

2. Optimize Rendering for Large Lists.
 How would you optimize rendering for a list of 10,000+ items in a React application?

3. Build Real-Time Order Tracker.
 How would you build a real-time order tracker using WebSockets?

🔎 𝐓𝐡𝐢𝐫𝐝 𝐑𝐨𝐮𝐧𝐝 (𝐂𝐨𝐝𝐢𝐧𝐠):

1. Display List of Restaurants.
 Display a list of restaurants with filtering and sorting capabilities.

2. Implement Cart System.
 Implement a cart system with real-time price updates.

3. Add Error Boundaries.
 Add error boundaries and loading states to improve the user experience.

4. Make Application Responsive.
 Make the application responsive for mobile devices.

🔎 𝐅𝐨𝐮𝐫𝐭𝐡 𝐑𝐨𝐮𝐧𝐝 (𝐒𝐲𝐬𝐭𝐞𝐦 𝐃𝐞𝐬𝐢𝐠𝐧):

1. Design Restaurant Page Architecture.
 Design the frontend architecture for Swiggy’s Restaurant Page with Real-Time Order Updates.

2. Explain Component Architecture.
 Explain the component architecture and code-splitting strategy for a large scale application.

3. Discuss State Management Approaches.
 Discuss state management, data fetching, and caching approaches for a frontend application.

4. Describe Performance Optimization Techniques.
 Describe performance optimization techniques and error handling strategies applied in your projects.

Here is a complete, production-ready breakdown of solutions across all four interview rounds, including architectural designs, custom React hooks, state management strategies, and frontend system design for Swiggy-scale applications.

---

Here is a comprehensive breakdown covering all four coding and system design rounds, complete with production-grade React code examples, custom hooks, and architectural diagrams.

---

# 🔎 First Round: Machine Coding & Core Mechanics

## 1. Implement Infinite Scroll Component with Error Handling

This component uses the **IntersectionObserver API** with an invisible "sentinel" DOM element, pre-fetching buffer margins (`rootMargin`), and retry logic for failed fetches.

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Item {
  id: number;
  title: string;
}

interface FetchResponse {
  data: Item[];
  hasMore: boolean;
}

// Mock API function simulating network delay and random failures
const fetchItemsApi = async (page: number): Promise<FetchResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 15% simulated failure rate to test error handling
      if (Math.random() < 0.15) {
        reject(new Error('Network error: Failed to fetch items'));
        return;
      }
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: (page - 1) * 10 + i + 1,
        title: `Food Item #${(page - 1) * 10 + i + 1}`,
      }));
      resolve({ data, hasMore: page < 5 }); // Limits dataset to 5 pages
    }, 1000);
  });
};

export const InfiniteScrollList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetchItemsApi(page);
      setItems((prev) => [...prev, ...response.data]);
      setHasMore(response.hasMore);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore && !error) {
          loadMoreData();
        }
      },
      { rootMargin: '200px' } // Pre-fetches 200px before reaching the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreData, loading, hasMore, error]);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px' }}>
      <h2>Infinite Feed</h2>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: '16px',
            margin: '8px 0',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
          }}
        >
          {item.title}
        </div>
      ))}

      {/* Invisible sentinel observed by IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: '20px' }} />

      {loading && <p style={{ textAlign: 'center' }}>⏳ Loading items...</p>}

      {error && (
        <div style={{ textAlign: 'center', color: '#dc2626', margin: '16px 0' }}>
          <p>{error}</p>
          <button
            onClick={loadMoreData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!hasMore && (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          🎉 You've reached the end of the list!
        </p>
      )}
    </div>
  );
};

```

---

## 2. Create Debounced Search Functionality

This component delays triggering search network calls until the user pauses typing for `400ms`, preventing API rate limits.

```tsx
import React, { useState, useEffect } from 'react';

export const DebouncedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // Delay execution until 400ms after user stops typing
    const handler = setTimeout(async () => {
      setIsSearching(true);
      
      // Simulated API response delay
      await new Promise((res) => setTimeout(res, 300));
      
      setResults([
        `${searchTerm} Pizza`,
        `${searchTerm} Burger`,
        `${searchTerm} Special Roll`,
      ]);
      setIsSearching(false);
    }, 400);

    // Cleanup: cancels pending timeout if user types within 400ms window
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search dishes or restaurants..."
        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {isSearching && <p>Searching...</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
        {results.map((res, index) => (
          <li
            key={index}
            style={{ padding: '8px', borderBottom: '1px solid #eee' }}
          >
            🔍 {res}
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## 3. Design Responsive Grid Layout (CSS Grid)

Responsive auto-fit layout requiring **zero media queries**. Columns dynamically wrap and expand to fit the available viewport width.

```css
/* responsive-grid.css */
.restaurant-grid {
  display: grid;
  /* Auto-fit columns: minimum 280px wide, max 1fr */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.restaurant-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.restaurant-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.restaurant-card .content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

```

---

# 🔎 Second Round: Advanced Mechanics & Performance

## 1. Custom `useDebounce` Hook From Scratch

```typescript
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any rapidly changing value.
 * @param value The value to debounce (e.g. text input)
 * @param delay Cooldown in milliseconds
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Schedule state update after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value or delay changes before timeout completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

```

---

## 2. Optimize Rendering for Large Lists (10,000+ Items)

To render 10,000+ items without freezing the browser DOM tree, we use **Windowing / Virtualization**. Only items currently positioned within the visible viewport window are mounted as DOM elements.

```tsx
import React, { useState } from 'react';

interface ListProps {
  items: string[];
  itemHeight: number;
  containerHeight: number;
}

export const VirtualizedList: React.FC<ListProps> = ({
  items,
  itemHeight,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  // Total height of the scrollable container
  const totalHeight = items.length * itemHeight;

  // Calculate row bounds currently inside the viewport (+ 2 items padding buffer)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + 2
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      onScroll={onScroll}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid #ccc',
      }}
    >
      {/* Invisible placeholder element forcing scrollbar height */}
      <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                boxSizing: 'border-box',
              }}
            >
              Row #{actualIndex + 1}: {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

```

---

## 3. Real-Time Order Tracker using WebSockets

```tsx
import React, { useEffect, useState, useRef } from 'react';

type OrderStatus = 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface OrderState {
  orderId: string;
  status: OrderStatus;
  driverEtaMinutes: number;
}

export const RealTimeOrderTracker: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderState>({
    orderId,
    status: 'PLACED',
    driverEtaMinutes: 25,
  });
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`wss://api.swiggy.com/v1/orders/track?id=${orderId}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event: MessageEvent) => {
      try {
        const payload: OrderState = JSON.parse(event.data);
        setOrder(payload);
      } catch (err) {
        console.error('Failed to parse WebSocket payload', err);
      }
    };

    // Socket teardown on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [orderId]);

  const steps: OrderStatus[] = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div style={{ padding: '24px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px' }}>
      <h3>Order Tracker #{order.orderId}</h3>
      <p>Status: {connected ? '🟢 Live' : '🔴 Reconnecting...'}</p>
      <h4>ETA: {order.driverEtaMinutes} mins</h4>

      {/* Stepper UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {steps.map((step, idx) => (
          <div
            key={step}
            style={{
              fontWeight: idx <= currentStepIndex ? 'bold' : 'normal',
              color: idx <= currentStepIndex ? '#16a34a' : '#94a3b8',
              fontSize: '12px',
            }}
          >
            {idx <= currentStepIndex ? '✓' : '○'} {step.replace(/_/g, ' ')}
          </div>
        ))}
      </div>
    </div>
  );
};

```

---

# 🔎 Third Round: Complete Application Integration

Below is an integrated React application featuring **Restaurant Listings, Cart Management, Error Boundaries, and Responsive Layouts**.

```tsx
import React, { Component, ErrorInfo, useState, useMemo } from 'react';

// ==========================================
// 1. ERROR BOUNDARY COMPONENT
// ==========================================
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error inside UI boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#fff1f2' }}>
          <h2>Oops! Something went wrong in this module.</h2>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 2. DATA MODELS & TYPES
// ==========================================
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMins: number;
  priceForTwo: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const RESTAURANTS_DATA: Restaurant[] = [
  { id: '1', name: 'Trattoria Italian', cuisine: 'Italian', rating: 4.5, deliveryTimeMins: 25, priceForTwo: 600 },
  { id: '2', name: 'Spice Kingdom', cuisine: 'Indian', rating: 4.8, deliveryTimeMins: 15, priceForTwo: 400 },
  { id: '3', name: 'Burger Hub', cuisine: 'American', rating: 3.9, deliveryTimeMins: 30, priceForTwo: 300 },
  { id: '4', name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.6, deliveryTimeMins: 40, priceForTwo: 1200 },
];

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================
export const FoodDeliveryApp: React.FC = () => {
  const [restaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'price'>('rating');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter and Sort Calculations
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => (selectedCuisine === 'All' ? true : r.cuisine === selectedCuisine))
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'deliveryTime') return a.deliveryTimeMins - b.deliveryTimeMins;
        if (sortBy === 'price') return a.priceForTwo - b.priceForTwo;
        return 0;
      });
  }, [restaurants, selectedCuisine, sortBy]);

  // Cart Operations
  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Real-time Total Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <ErrorBoundary>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Swiggy Express</h1>
          <div>🛒 Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)</div>
        </header>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '16px', margin: '20px 0', flexWrap: 'wrap' }}>
          <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
            <option value="All">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="American">American</option>
            <option value="Japanese">Japanese</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="rating">Sort by Rating</option>
            <option value="deliveryTime">Sort by Delivery Time</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Responsive Grid & Sidebar Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          {/* Restaurant Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {filteredRestaurants.map((res) => (
              <div
                key={res.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                }}
              >
                <h3>{res.name}</h3>
                <p>{res.cuisine} • ⭐ {res.rating}</p>
                <p>⏱️ {res.deliveryTimeMins} mins • ₹{res.priceForTwo} for two</p>
                <button
                  onClick={() => addToCart({ id: res.id, name: `${res.name} Combo`, price: 250 })}
                  style={{
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Add Meal (₹250)
                </button>
              </div>
            ))}
          </div>

          {/* Cart Sidebar */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', height: 'fit-content' }}>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
                    <div>
                      <div>{item.name}</div>
                      <small>₹{item.price} × {item.quantity}</small>
                    </div>
                    <div>
                      <button onClick={() => removeFromCart(item.id)}>-</button>
                      <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                      <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}>+</button>
                    </div>
                  </div>
                ))}
                <hr />
                <div>Subtotal: ₹{subtotal}</div>
                <div>Delivery Fee: ₹{deliveryFee}</div>
                <h3 style={{ marginTop: '12px' }}>Total: ₹{grandTotal}</h3>
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

```

---

# 🔎 Fourth Round: Frontend System Design

## 1. Design Restaurant Page Architecture (Swiggy Scale)

Below is the client-side system architecture for high-concurrency restaurant pages:

```text
                               ┌────────────────────────────────────────┐
                               │              CLIENT BROWSER            │
                               └───────────────────┬────────────────────┘
                                                   │
                       ┌───────────────────────────┴───────────────────────────┐
                       ▼                                                       ▼
        ┌──────────────────────────────┐                       ┌──────────────────────────────┐
        │   Network & Caching Layer    │                       │     Real-Time Engine         │
        │   (TanStack Query / SWR)     │                       │     (WebSocket Manager)      │
        └──────────────┬───────────────┘                       └──────────────┬───────────────┘
                       │                                                       │
                       ▼                                                       ▼
        ┌──────────────────────────────┐                       ┌──────────────────────────────┐
        │    Global State Store        │◄──────────────────────┤  Event Dispatcher /          │
        │    (Zustand / Redux)         │  Pushes Live Updates  │  Reconnection Manager        │
        └──────────────┬───────────────┘                       └──────────────────────────────┘
                       │
         ┌─────────────┴────────────────────────────┐
         ▼                                          ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│  Restaurant Listing UI       │          │  Live Order Tracking Widget  │
│  • Virtualized Menu List     │          │  • Order Status Stepper      │
│  • Micro-Cart Module         │          │  • Driver GPS Map Pointer    │
└──────────────────────────────┘          └──────────────────────────────┘

```

### Key System Decisions

1. **Network & Caching Layer:** TanStack Query handles API fetching with a `staleTime` of $5\text{ minutes}$ for static restaurant menus.
2. **WebSocket Real-Time Engine:** A singleton WebSocket client manages heartbeat ping/pongs, auto-reconnects with exponential backoff, and listens for live driver tracking updates.
3. **Normalized Global State:** Cart data is stored flat in Zustand (`byId`, `allIds`) to enable $O(1)$ mutation lookups and prevent whole-page re-renders on item quantity increments.

---

## 2. Component Architecture & Code-Splitting Strategy

To keep initial First Contentful Paint (FCP) under $1.5\text{s}$, separate critical path code from secondary bundles:

```tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Static Import for Above-The-Fold Critical Path
import HomePage from './pages/HomePage';

// 2. Dynamic Lazy Imports for Secondary Routes
const RestaurantDetailPage = lazy(() => import('./pages/RestaurantDetailPage'));
const OrderCheckoutPage = lazy(() => import('./pages/OrderCheckoutPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export const AppRoutes = () => (
  <Suspense fallback={<div className="page-spinner">Loading module...</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
      <Route path="/checkout" element={<OrderCheckoutPage />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  </Suspense>
);

```

---

## 3. State Management, Data Fetching & Caching Approaches

| Layer                    | Recommended Tool             | Responsibility                                                                           |
| ------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------- |
| **Server State / Cache** | TanStack Query (React Query) | Handles remote server queries, stale-while-revalidate caching, and automatic retries.    |
| **Client UI State**      | Zustand / Context API        | Manages theme toggles, modal open/close states, and user location preferences.           |
| **Form / Input State**   | React Hook Form              | Manages un-controlled form inputs without triggering component re-renders on keystrokes. |

```typescript
import { useQuery } from '@tanstack/react-query';

export const useRestaurantMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: () => fetch(`/api/v1/menu/${restaurantId}`).then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    gcTime: 1000 * 60 * 30,    // Preserves cache in memory for 30 minutes
    refetchOnWindowFocus: false,
  });
};

```

---

## 4. Performance Optimization & Error Handling Strategy

### Performance Optimization Techniques

1. **Asset Optimization:** Serve modern image formats (`WebP`/`AVIF`) with dynamic CDN sizing and `loading="lazy"` attributes.
2. **Cumulative Layout Shift (CLS) Prevention:** Pre-allocate explicit aspect ratios and height containers on skeleton loaders before API responses return.
3. **Tree Shaking:** Import specific utilities directly (e.g., `import debounce from 'lodash/debounce'`) instead of importing full library packages.

### Error Handling Strategy

* **Granular Error Boundaries:** Wrap isolated modules (e.g., Cart Sidebar, Reviews Section) in separate Error Boundaries so a failure in user reviews doesn't crash the ordering flow.
* **Global HTTP Interceptors:** Intercept HTTP $401$ Unauthorized status codes to execute automatic token refresh cycles, and display offline fallback states when network connections drop.
