In **Front-End System Design**, Unit Testing and Integration Testing represent the two core foundation layers of application reliability. As front-end applications grow into complex, stateful systems, these testing strategies ensure that business logic remains deterministic and user interfaces behave correctly when components interact.

---

## 1. Unit Testing: Functionality in Complete Isolation

**Unit Testing** focuses on testing the smallest testable units of code—such as pure functions, custom hooks, data transformers, state reducers, and utility modules—**in complete isolation**.

In unit testing, any external dependency (network calls, browser APIs, context providers, or database drivers) is replaced with **mocks, stubs, or spies**.

### Key Characteristics

* **Execution Speed:** Blazing fast (executes in milliseconds on Node.js/V8 without rendering a DOM).
* **Scope:** Single function, reducer, or isolated helper module.
* **Goal:** Verify that a specific piece of business logic returns the expected output for a given input, handling edge cases, boundary conditions, and error states gracefully.

### Code Example: Unit Testing a State Reducer & Currency Formatter

#### The Unit to Test (`src/utils/cartReducer.ts`)

```typescript
export interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => i.id === action.payload.id);
      let updatedItems = [...state.items];

      if (existingIndex > -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
      } else {
        updatedItems.push(action.payload);
      }

      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: updatedItems, totalAmount };
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(i => i.id !== action.payload.id);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: updatedItems, totalAmount };
    }
    default:
      return state;
  }
}

```

#### The Unit Test Suite (`src/utils/__tests__/cartReducer.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { cartReducer, CartState } from '../cartReducer';

describe('cartReducer Unit Tests', () => {
  const initialState: CartState = { items: [], totalAmount: 0 };

  it('should add a new item and calculate total amount correctly', () => {
    const newItem = { id: 'prod_1', price: 50, quantity: 2 };
    const nextState = cartReducer(initialState, { type: 'ADD_ITEM', payload: newItem });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.totalAmount).toBe(100);
  });

  it('should increment quantity when adding an existing item', () => {
    const stateWithItem: CartState = {
      items: [{ id: 'prod_1', price: 50, quantity: 2 }],
      totalAmount: 100,
    };

    const nextState = cartReducer(stateWithItem, {
      type: 'ADD_ITEM',
      payload: { id: 'prod_1', price: 50, quantity: 1 },
    });

    expect(nextState.items[0].quantity).toBe(3);
    expect(nextState.totalAmount).toBe(150);
  });
});

```

---

## 2. Integration Testing: Individual Components & System Interactions

While unit tests check isolated logic, **Integration Testing** verifies how individual components interact with each other, manage DOM events, consume context/state providers, and handle network side effects.

In modern front-end design (using tools like **React Testing Library** and **Mock Service Worker / MSW**), integration testing focuses on testing **User Behavior** rather than internal implementation details.

### Key Characteristics

* **Execution Speed:** Moderate (uses a simulated DOM like `jsdom` or `happy-dom`).
* **Scope:** Component trees, forms, pages, and interactive UI widgets.
* **Goal:** Verify that when a user clicks, types, or submits a form, the component updates the DOM correctly, fires API network calls, and displays success/error states.

### Code Example: Integration Testing an Interactive Checkout Form

#### Component to Test (`src/components/AddProductWidget.tsx`)

```tsx
import React, { useState } from 'react';

export const AddProductWidget: React.FC<{ onSuccess: (data: any) => void }> = ({ onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'prod_99', quantity }),
      });

      if (!res.ok) throw new Error('Failed to update cart');

      const data = await res.json();
      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="quantity-input">Quantity</label>
      <input
        id="quantity-input"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p role="alert" className="error-msg">{error}</p>}
    </form>
  );
};

```

#### The Integration Test Suite with MSW Network Mocking (`AddProductWidget.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { AddProductWidget } from './AddProductWidget';

// 1. Setup Mock Service Worker (MSW) to intercept HTTP network calls
const server = setupServer(
  http.post('/api/v1/cart', async () => {
    return HttpResponse.json({ success: true, itemQuantity: 3 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AddProductWidget Integration Tests', () => {
  it('allows user to change quantity and submit form successfully', async () => {
    const handleSuccess = vi.fn();
    const user = userEvent.setup();

    // 2. Render component into JS-DOM
    render(<AddProductWidget onSuccess={handleSuccess} />);

    // 3. User Interaction: Change quantity input
    const input = screen.getByLabelText(/quantity/i);
    await user.clear(input);
    await user.type(input, '3');

    // 4. User Interaction: Click submit button
    const submitBtn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(submitBtn);

    // 5. Assertions: Check loading state and success callback execution
    expect(submitBtn).toBeDisabled();
    
    // Wait for async MSW response and callback invocation
    expect(await screen.findByRole('button', { name: /add to cart/i })).not.toBeDisabled();
    expect(handleSuccess).toHaveBeenCalledWith({ success: true, itemQuantity: 3 });
  });

  it('displays error alert when network request fails', async () => {
    // Override MSW handler for this test to simulate 500 error
    server.use(
      http.post('/api/v1/cart', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();
    render(<AddProductWidget onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(submitBtn);

    // Verify error DOM alert node is populated
    const alertMsg = await screen.findByRole('alert');
    expect(alertMsg).toHaveTextContent('Failed to update cart');
  });
});

```

---

## 3. Unit vs. Integration Testing Comparison Matrix

| Testing Aspect             | Unit Testing                                              | Integration Testing                                                      |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Primary Target**         | Pure functions, custom hooks, utils, state reducers.      | Component hierarchies, forms, pages, API integrations.                   |
| **DOM Requirement**        | None (Node.js engine only).                               | Required (`jsdom`, `happy-dom`, or browser).                             |
| **Dependency Treatment**   | 100% Mocked/Stubbed.                                      | Sub-components rendered real; Network mocked via MSW.                    |
| **Execution Time**         | Extremely Fast ($<10\text{ms}$ per test).                 | Fast to Moderate ($50\text{ms} - 300\text{ms}$ per test).                |
| **Query Strategy**         | Direct function call assertions (`expect(fn()).toBe()`).  | User-centric accessibility queries (`screen.getByRole()`).               |
| **Primary Risk Mitigated** | Broken business formulas or algorithmic state corruption. | Broken user interaction flows, unhandled API errors, DOM rendering bugs. |

---

## 4. Best Practices for Component Isolation in System Design

1. **Avoid Implementation Detail Leakage:** Query components using accessibility standards (`getByRole`, `getByLabelText`) rather than implementation specifics like CSS class names (`.btn-primary`) or component state properties (`state.isOpen`).
2. **Network Interception over Function Mocks:** Prefer **Mock Service Worker (MSW)** over mocking `window.fetch` or `axios` directly. MSW intercepts requests at the network layer, allowing your components to execute their real fetch/parse logic.
3. **Keep Unit Suites Pure:** Ensure unit tests for mathematical models, data transformers, and reducers do not import DOM utilities or initialize component providers. Keep them completely decoupled from the framework layer.

Show how to set up and configure Vitest with React Testing Library, jsdom, and MSW in a modern TypeScript project.

Here is a step-by-step guide to setting up **Vitest**, **React Testing Library**, **jsdom**, and **Mock Service Worker (MSW v2)** in a modern TypeScript project (Vite / React).

---

## 1. Install Required Dependencies

Install the core testing libraries and MSW as development dependencies:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom msw

```

---

## 2. Configure Vitest in `vite.config.ts`

Update your `vite.config.ts` to include the `test` configuration block:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true, // Enables global `describe`, `it`, `expect` without explicit imports
    environment: 'jsdom', // Simulates DOM environment
    setupFiles: ['./src/testing/setupTests.ts'], // Test setup script executed before each test file
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/testing/'],
    },
  },
});

```

---

## 3. Create MSW v2 Network Handlers

Set up Mock Service Worker (MSW) to intercept network requests at the Node.js process level.

### Create API Handlers (`src/testing/mocks/handlers.ts`)

```typescript
// src/testing/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept GET /api/v1/user/profile
  http.get('/api/v1/user/profile', () => {
    return HttpResponse.json({
      id: 'usr_789',
      name: 'Alex Developer',
      email: 'alex@example.com',
    });
  }),

  // Intercept POST /api/v1/cart
  http.post('/api/v1/cart', async ({ request }) => {
    const body = (await request.json()) as { productId: string; quantity: number };
    
    return HttpResponse.json(
      { success: true, addedQuantity: body.quantity },
      { status: 201 }
    );
  }),
];

```

### Create MSW Server (`src/testing/mocks/server.ts`)

```typescript
// src/testing/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW Node server instance using the handlers
export const server = setupServer(...handlers);

```

---

## 4. Configure Test Setup Script (`src/testing/setupTests.ts`)

Create the setup script referenced in `vite.config.ts` to attach `@testing-library/jest-dom` matchers and control the MSW server lifecycle across test runs.

```typescript
// src/testing/setupTests.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// 1. Establish MSW API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 2. Reset MSW runtime request handlers & DOM state after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// 3. Clean up MSW server after all tests finish
afterAll(() => server.close());

```

---

## 5. Add TypeScript Definitions (`tsconfig.json`)

Ensure TypeScript recognizes global Vitest types and `@testing-library/jest-dom` matchers (e.g., `toBeInTheDocument()`):

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

```

Add NPM test scripts to your `package.json`:

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}

```

---

## 6. Verification: Writing a Component Test

### Component to Test (`src/components/UserProfile.tsx`)

```tsx
// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/user/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user profile');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="user-card">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

```

### Integration Test (`src/components/__tests__/UserProfile.test.tsx`)

```tsx
// src/components/__tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/testing/mocks/server';
import { UserProfile } from '../UserProfile';

describe('UserProfile Integration Suite', () => {
  it('fetches and displays user profile data from MSW endpoint', async () => {
    render(<UserProfile />);

    // 1. Verify initial loading state
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();

    // 2. Wait for MSW intercepted data to render
    const heading = await screen.findByRole('heading', { level: 1 });
    
    expect(heading).toHaveTextContent('Alex Developer');
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
  });

  it('renders error alert when API returns 500 status', async () => {
    // Override MSW handler for this specific failure scenario
    server.use(
      http.get('/api/v1/user/profile', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserProfile />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Failed to fetch user profile');
  });
});

```

Explain how to write isolated unit tests for complex React custom hooks using renderHook.

Unit testing complex React custom hooks in isolation requires testing the hook's **state transitions, side effects, and asynchronous flows** without needing to render an entire UI component tree.

React Testing Library provides the **`renderHook`** and **`act`** utilities (built into `@testing-library/react`) specifically for this purpose. `renderHook` wraps your custom hook inside a minimal, synthetic React component context, allowing you to inspect its return values and trigger its functions directly.

---

## 1. The Complex Hook to Test (`usePaginatedFetch.ts`)

Consider a production-grade custom hook that handles paginated API requests, manages state transitions (loading, success, error), and provides refetch capabilities:

```typescript
// src/hooks/usePaginatedFetch.ts
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  page: number;
}

export function usePaginatedFetch<T>(fetchFn: (page: number) => Promise<T>, initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const executeFetch = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn(targetPage);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown fetch error'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    executeFetch(page);
  }, [page, executeFetch]);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const refetch = useCallback(() => executeFetch(page), [executeFetch, page]);

  return { data, isLoading, error, page, nextPage, prevPage, refetch };
}

```

---

## 2. Core Patterns for Testing Custom Hooks

### Pattern A: Initial State & Sync Evaluation

`renderHook` returns a `result` object. The hook's current return value is stored in **`result.current`**.

```typescript
// 1. Render the hook into synthetic context
const { result } = renderHook(() => usePaginatedFetch(mockApi, 1));

// 2. Access state values via result.current
expect(result.current.page).toBe(1);
expect(result.current.isLoading).toBe(true);

```

---

### Pattern B: State Updates & the `act()` Utility

When invoking hook methods that trigger state updates (e.g., `nextPage()`), wrap the call in **`act()`**. This ensures all queued state updates and React effect cycles settle before making assertions.

```typescript
const { result } = renderHook(() => usePaginatedFetch(mockApi, 1));

// Wrap state-modifying function calls in act()
act(() => {
  result.current.nextPage();
});

expect(result.current.page).toBe(2);

```

---

### Pattern C: Asynchronous State & `waitFor`

When testing async operations (like API calls or promises inside `useEffect`), use **`waitFor`** to wait for loading states to resolve.

```typescript
const { result } = renderHook(() => usePaginatedFetch(mockApi));

// Wait until isLoading transitions from true to false
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});

expect(result.current.data).toEqual(expectedMockData);

```

---

### Pattern D: Testing Hooks with Context Wrappers

If your custom hook depends on a React Context Provider (e.g., `useAuth` or `useTheme`), pass the provider component using the **`wrapper`** option in `renderHook`.

```tsx
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider initialUser={{ id: '123', name: 'Alex' }}>
    {children}
  </AuthProvider>
);

const { result } = renderHook(() => useAuthHook(), { wrapper });

```

---

## 3. Complete Vitest Suite (`usePaginatedFetch.test.ts`)

Here is the complete unit test suite validating initial state, pagination updates, async success, and error handling in isolation:

```typescript
// src/hooks/__tests__/usePaginatedFetch.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePaginatedFetch } from '../usePaginatedFetch';

describe('usePaginatedFetch Custom Hook Unit Tests', () => {
  const mockItems = ['Item A', 'Item B'];
  let mockFetchFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetchFn = vi.fn().mockResolvedValue(mockItems);
  });

  it('should initialize with default state and fetch page 1', async () => {
    const { result } = renderHook(() => usePaginatedFetch(mockFetchFn, 1));

    // Initial sync state assertions
    expect(result.current.page).toBe(1);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();

    // Wait for async effect execution
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockItems);
    expect(mockFetchFn).toHaveBeenCalledWith(1);
  });

  it('should update page state and refetch when nextPage is invoked', async () => {
    const { result } = renderHook(() => usePaginatedFetch(mockFetchFn, 1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Trigger state change
    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockFetchFn).toHaveBeenCalledWith(2);
  });

  it('should handle API errors gracefully', async () => {
    const apiError = new Error('Network failure');
    const failingFetchFn = vi.fn().mockRejectedValue(apiError);

    const { result } = renderHook(() => usePaginatedFetch(failingFetchFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(apiError);
    expect(result.current.data).toBeNull();
  });

  it('should refetch the current page when refetch() is called', async () => {
    const { result } = renderHook(() => usePaginatedFetch(mockFetchFn, 2));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchFn).toHaveBeenCalledTimes(1);

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchFn).toHaveBeenCalledTimes(2);
    expect(mockFetchFn).toHaveBeenLastCalledWith(2);
  });
});

```

---

## 4. Hook Testing Best Practices Matrix

| Scenario                                   | Recommended Technique                                 | Why?                                                                           |
| ------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Hook uses `useState` / `useReducer**`    | Wrap trigger actions in **`act(() => { ... })`**      | Flushes state updates deterministically and eliminates React console warnings. |
| **Hook uses `useEffect` / async Promises** | Use **`await waitFor(() => { ... })`**                | Waits for React's asynchronous render cycle to finish updating state.          |
| **Hook consumes Context**                  | Pass Provider via **`renderHook(..., { wrapper })`**  | Supplies necessary React context without polluting tests with manual DOM tags. |
| **Hook receives dynamic props**            | Use the returned **`rerender({ newProp })`** function | Tests how custom hooks react when parent arguments change over time.           |

Unit testing UI components in a front-end architecture verifies that individual building blocks render correctly, handle user interactions properly, manage accessibility attributes, and execute expected callbacks.

Below is a complete, production-ready unit testing suite using **Vitest**, **React Testing Library (RTL)**, **`@testing-library/user-event`**, and **`@testing-library/jest-dom`** for three essential UI components: a **Button**, an **Input Field**, and a full **Form**.

---

## Prerequisites & Setup

Ensure `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom` are installed and configured in your test setup file (`setupTests.ts`):

```typescript
// setupTests.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

```

---

## 1. Testing a Base Button Component

### Component Implementation (`src/components/Button.tsx`)

```tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  onClick,
  ...rest
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? <span data-testid="spinner">Loading...</span> : children}
    </button>
  );
};

```

### Unit Test Suite (`src/components/__tests__/Button.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button Component Unit Tests', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    
    // Query by accessible role
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies correct CSS class for variant props', () => {
    render(<Button variant="danger">Delete Item</Button>);
    
    const button = screen.getByRole('button', { name: /delete item/i });
    expect(button).toHaveClass('btn-danger');
  });

  it('triggers onClick handler when clicked by user', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Submit</Button>);
    
    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and prevents click execution when disabled prop is true', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner and disables button when isLoading is true', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button isLoading onClick={handleClick}>Save</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

```

---

## 2. Testing an Input Field Component

### Component Implementation (`src/components/InputField.tsx`)

```tsx
import React, { useId } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  id,
  value,
  onChange,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} role="alert" className="error-text">
          {error}
        </span>
      )}
      {!error && helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

```

### Unit Test Suite (`src/components/__tests__/InputField.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InputField } from '../InputField';

describe('InputField Component Unit Tests', () => {
  it('associates input with label correctly', () => {
    render(<InputField label="Email Address" placeholder="enter email" />);

    // Accessing via getByLabelText verifies accessibility label association
    const input = screen.getByLabelText(/email address/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'enter email');
  });

  it('invokes onChange callback when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<InputField label="Username" value="" onChange={handleChange} />);

    const input = screen.getByLabelText(/username/i);
    await user.type(input, 'alex');

    // userEvent.type triggers onChange for each typed character
    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  it('renders error message and sets ARIA accessibility attributes when error prop is set', () => {
    render(<InputField label="Password" error="Password is required" />);

    const input = screen.getByLabelText(/password/i);
    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toHaveTextContent('Password is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-error'));
  });

  it('renders helper text when no error is present', () => {
    render(<InputField label="Zip Code" helperText="Enter 5-digit zip code" />);

    expect(screen.getByText('Enter 5-digit zip code')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

```

---

## 3. Testing an Integrated Form Component

### Component Implementation (`src/components/LoginForm.tsx`)

```tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { Button } from './Button';

export interface LoginFormProps {
  onSubmit: (data: { email: string; role: string }) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({ email, role });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login Form">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <label htmlFor="role-select">Select Role</label>
      <select
        id="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <Button type="submit" isLoading={isSubmitting}>
        Submit Login
      </Button>
    </form>
  );
};

```

### Unit Test Suite (`src/components/__tests__/LoginForm.test.tsx`)

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

describe('LoginForm Component Unit Tests', () => {
  it('renders all form fields and submit button', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('form', { name: /login form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit login/i })).toBeInTheDocument();
  });

  it('validates required fields and shows inline validation error on empty submit', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /submit login/i });
    await user.click(submitBtn);

    // Assert validation error appears
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Email is required');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates email format correctly', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitBtn = screen.getByRole('button', { name: /submit login/i });
    await user.click(submitBtn);

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email format');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits form with user inputs when fields are valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    // 1. Fill out inputs
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'john@example.com');

    // 2. Select option dropdown
    const roleSelect = screen.getByLabelText(/select role/i);
    await user.selectOptions(roleSelect, 'admin');

    // 3. Submit form
    const submitBtn = screen.getByRole('button', { name: /submit login/i });
    await user.click(submitBtn);

    // 4. Verify callback payload
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        role: 'admin',
      });
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

```

---

## Testing Patterns & Best Practices Matrix

| Testing Aspect             | Rule / Principle                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Element Queries**        | Always prefer accessible queries: `getByRole('button')`, `getByLabelText('Email')` over `.querySelector('.btn')`.                                             |
| **User Events**            | Use `@testing-library/user-event` instead of `fireEvent`. `userEvent` accurately dispatches all full browser events (hover, focus, keydown, keypress, keyup). |
| **Async State Assertions** | Use `findByRole()` or `waitFor()` for assertions dependent on state updates or resolved promises.                                                             |
| **Form Testing**           | Always test both **invalid state branches** (prevented submission + validation messages) and **valid state submission payloads**.                             |

Unit testing a form built with **React Hook Form (RHF)** and **Zod** schema validation requires verifying two distinct behaviors:

1. **Validation Logic:** Ensuring Zod schema rules (required fields, email formats, password constraints) trigger error state transitions as expected.
2. **User & Form Interactions:** Ensuring `react-hook-form` accurately captures user input, handles async submission states, and delivers the validated payload to your `onSubmit` handler.

Below is a complete, production-ready guide using **Vitest**, **React Testing Library (RTL)**, and **`@testing-library/user-event`**.

---

## 1. The Component: RHF + Zod Form (`RegistrationForm.tsx`)

First, install the schema resolver bridge:

```bash
npm install react-hook-form zod @hookform/resolvers

```

Here is the Registration Form component using Zod validation:

```tsx
// src/components/RegistrationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define Zod Schema
export const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce
    .number({ invalid_type_error: 'Age must be a number' })
    .min(18, 'Must be at least 18 years old'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void> | void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      age: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Registration Form">
      {/* Username Field */}
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register('username')}
          aria-invalid={!!errors.username}
        />
        {errors.username && <p role="alert">{errors.username.message}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      {/* Age Field */}
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age')}
          aria-invalid={!!errors.age}
        />
        {errors.age && <p role="alert">{errors.age.message}</p>}
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

```

---

## 2. Unit Testing Pure Zod Schemas

Testing the Zod schema independently from React Hook Form ensures complex validation rules, refinements, and custom transformations work deterministically without rendering DOM nodes.

```typescript
// src/components/__tests__/registrationSchema.test.ts
import { describe, it, expect } from 'vitest';
import { registrationSchema } from '../RegistrationForm';

describe('registrationSchema Zod Unit Tests', () => {
  it('passes validation when provided valid input data', () => {
    const validData = {
      username: 'john_doe',
      email: 'john@example.com',
      age: '25', // Coerced string to number
    };

    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data).toEqual({
        username: 'john_doe',
        email: 'john@example.com',
        age: 25,
      });
    }
  });

  it('fails validation when username is under 3 characters', () => {
    const invalidData = {
      username: 'jo',
      email: 'john@example.com',
      age: 20,
    };

    const result = registrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.path).toContain('username');
      expect(issue.message).toBe('Username must be at least 3 characters');
    }
  });

  it('fails validation when age is under 18', () => {
    const invalidData = {
      username: 'john_doe',
      email: 'john@example.com',
      age: 16,
    };

    const result = registrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Must be at least 18 years old');
    }
  });
});

```

---

## 3. Integration Testing the Component (RHF + Zod + RTL)

React Hook Form processes Zod validations **asynchronously**. Therefore, assertions expecting Zod error messages or successful submissions **must use async queries (`findByRole`, `waitFor`)**.

```tsx
// src/components/__tests__/RegistrationForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RegistrationForm } from '../RegistrationForm';

describe('RegistrationForm Integration Tests', () => {
  it('renders form controls correctly', () => {
    render(<RegistrationForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('form', { name: /registration form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('triggers Zod validation errors on empty submission and displays error alerts', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={handleSubmit} />);

    // 1. Submit empty form
    const submitBtn = screen.getByRole('button', { name: /register/i });
    await user.click(submitBtn);

    // 2. Assert Zod validation errors asynchronously
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(3);

    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByText('Must be at least 18 years old')).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('clears error messages dynamically as user corrects invalid fields', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);

    // Type invalid email and submit
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();

    // Correct the email input
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert invalid email error is removed
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
  });

  it('submits form successfully when all inputs satisfy Zod schema constraints', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={handleSubmit} />);

    // Fill valid form inputs
    await user.type(screen.getByLabelText(/username/i), 'alex_dev');
    await user.type(screen.getByLabelText(/email/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/age/i), '24');

    // Submit form
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert submission callback payload matches coerced Zod output
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          username: 'alex_dev',
          email: 'alex@example.com',
          age: 24, // Notice Zod coerced string '24' to number 24
        },
        expect.anything() // Ignores SyntheticEvent parameter passed by React
      );
    });

    // Ensure zero validation alerts remain
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

```

---

## 4. Key Testing Rules for RHF & Zod

| Testing Challenge                         | Solution / Best Practice                                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Async Resolver Latency**                | Zod resolvers run asynchronously inside React Hook Form. **Always use `await screen.findByText()` or `await waitFor()**` to assert error states. |
| **User Events over FireEvent**            | Use `@testing-library/user-event`. `userEvent.type()` triggers necessary `focus`, `keydown`, `input`, and `blur` cycles required by RHF.         |
| **HTML5 Browser Validation Interference** | Add `noValidate` to the `<form>` element. This prevents standard browser popups from blocking RHF form submission during testing.                |
| **Schema Testing Isolation**              | Always unit test complex Zod schemas (`safeParse`) separately from the UI component to isolate pure business rules from rendering cycles.        |

In React, **integration testing** is the practice of testing how multiple components, custom hooks, state management setups, and API calls work together as a single cohesive feature—rather than testing isolated functions or single component units in complete isolation.

While a **unit test** might check whether a `<Button>` component renders a label, an **integration test** checks what happens when a user types into an `<Input>`, clicks the `<Button>`, triggers an API request, updates global/local state, and sees a confirmation banner render on the screen.

---

## The Philosophy of Integration Testing in React

The modern React testing philosophy (popularized by **React Testing Library**) revolves around a core principle:

> *"The more your tests resemble the way your software is used, the more confidence they can give you."*

Rather than inspecting internal component state, props, or class instances (implementation details), an integration test interacts with the rendered DOM exactly like a real user would:

1. Finding elements by their **accessible roles, labels, and text** (`getByRole`, `getByLabelText`).
2. Simulating real browser interactions (`userEvent.click`, `userEvent.type`).
3. Asserting that the correct output is painted onto the screen.

---

## What Does a React Integration Test Typically Cover?

A typical React integration test exercises a full slice of your application:

* **Parent-Child Component Trees:** Verifying that state passed from parent to children renders and updates correctly.
* **Forms & User Inputs:** Typing into input fields, selecting dropdowns, and triggering validation errors or form submissions.
* **Network Side Effects:** Intercepting API calls at the network layer (using **Mock Service Worker / MSW**) to test loading spinners, successful data rendering, and error alerts.
* **State Management:** Verifying state transitions handled by React `useState`/`useReducer`, Context API, or external state stores (Zustand, Redux).

---

## Practical Example: Integration Testing a Component Flow

Here is a practical example using **Vitest / Jest**, **React Testing Library (RTL)**, and **Mock Service Worker (MSW)**.

### The Feature: User Profile Fetcher (`UserProfile.tsx`)

```tsx
import React, { useState } from 'react';

export const UserProfile = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/user');
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleFetchUser} disabled={loading}>
        {loading ? 'Fetching...' : 'Load Profile'}
      </button>

      {error && <p role="alert">{error}</p>}

      {user && (
        <section aria-label="User Details">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </section>
      )}
    </div>
  );
};

```

---

### The Integration Test (`UserProfile.test.tsx`)

This integration test verifies the full cycle: **User Interaction $\rightarrow$ Network Call $\rightarrow$ State Update $\rightarrow$ DOM Re-render**.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { UserProfile } from './UserProfile';

// 1. Setup Mock Service Worker (MSW) to intercept network calls at the network boundary
const server = setupServer(
  http.get('/api/v1/user', () => {
    return HttpResponse.json({ name: 'Jane Doe', email: 'jane@example.com' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile Integration Suite', () => {
  it('fetches and displays user details when the load button is clicked', async () => {
    const user = userEvent.setup();

    // 2. Render the component into the virtual DOM
    render(<UserProfile />);

    // 3. User Action: Click the "Load Profile" button
    const loadBtn = screen.getByRole('button', { name: /load profile/i });
    await user.click(loadBtn);

    // 4. Assert intermediate loading state
    expect(screen.getByRole('button')).toHaveTextContent(/fetching/i);

    // 5. Assert final asynchronous DOM updates after API resolution
    const userNameHeading = await screen.findByRole('heading', { name: /jane doe/i });
    expect(userNameHeading).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders error alert when the network request fails', async () => {
    // Override default MSW handler to simulate a 500 server error
    server.use(
      http.get('/api/v1/user', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();
    render(<UserProfile />);

    // Trigger action
    await user.click(screen.getByRole('button', { name: /load profile/i }));

    // Assert error state rendered in DOM
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('User not found');
  });
});

```

---

## Unit Testing vs. Integration Testing vs. End-to-End (E2E)

| Feature         | Unit Testing                                                  | Integration Testing                                         | End-to-End (E2E) Testing                                                |
| --------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Scope**       | Single function, custom hook, or utility module in isolation. | Multiple components interacting with state & network mocks. | The entire application running in a real browser against live backends. |
| **Tools Used**  | Vitest, Jest                                                  | Vitest / Jest + React Testing Library + MSW                 | Playwright, Cypress                                                     |
| **Environment** | Node.js (V8)                                                  | Node.js + Synthetic DOM (`jsdom` / `happy-dom`)             | Real Browsers (Chromium, Firefox, WebKit)                               |
| **Speed**       | Blazing Fast ($< 10\text{ms}$)                                | Fast ($50\text{ms} - 300\text{ms}$)                         | Slower ($1\text{s} - 10\text{s}+$)                                      |
| **Confidence**  | Low to Moderate (Checks isolated logic)                       | **High** (Sweet spot for UI behavior)                       | Maximum (Tests complete system)                                         |

---

## Best Practices for React Integration Testing

1. **Test Behavior, Not Implementation:** Avoid querying by internal class names (`.btn-primary`) or inspecting internal component state (`wrapper.state()`). Query elements by accessibility roles (`getByRole`, `getByLabelText`).
2. **Use MSW for Network Isolation:** Instead of mocking `window.fetch` or `axios` functions directly, intercept HTTP requests at the network layer using **Mock Service Worker**. This allows your components to execute their actual fetch and parsing code.
3. **Use `userEvent` Over `fireEvent`:** `@testing-library/user-event` accurately simulates full browser behavior (firing `hover`, `focus`, `keydown`, `keypress`, and `keyup` in sequence), whereas `fireEvent` dispatches single synthetic events.
4. **Avoid Artificial Delays:** Use RTL’s async utilities (`findByRole`, `waitFor`) instead of arbitrary `setTimeout` waits to keep tests fast and deterministic.
