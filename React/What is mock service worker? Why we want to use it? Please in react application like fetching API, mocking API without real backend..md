**Mock Service Worker (MSW)** is an API mocking library that uses the browser's **Service Worker API** to intercept actual outgoing network requests (`fetch` or `axios`) at the network layer and return mock responses.

Unlike traditional mocking libraries that override global `fetch` or patch `axios` inside JavaScript code, MSW lets your frontend app issue real HTTP requests that behave as if a live backend exists.

---

## Why Use MSW over Traditional Mocking?

1. **Seamless Developer Experience (DX):** You do not need to rewrite your application code or add `if (isDevelopment) return mockData` conditionals inside components or API files.
2. **Identical Code for Browser and Testing:** The exact same request handlers work during local development in the browser and in unit/integration tests (using Vitest or Jest via Node).
3. **Network Level Interception:** Requests show up inside the Browser DevTools **Network tab** just like real requests, allowing you to debug status codes, headers, and payloads easily.
4. **Parallel Frontend and Backend Work:** Frontend developers can build UI features against agreed-upon API specifications long before the backend endpoints are built.

---

## How MSW Works in a React Application

Here is a quick walkthrough to set up MSW in a React app using `fetch` or `axios`.

### Step 1: Install MSW

```bash
npm install msw --save-dev

```

---

### Step 2: Define Request Handlers

Create a file `src/mocks/handlers.js` where you declare endpoints to intercept using REST or GraphQL handlers.

```javascript
// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice Developer' },
      { id: 2, name: 'Bob Engineer' },
    ]);
  }),

  // Intercept POST /api/users
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json(
      { id: Date.now(), ...newUser },
      { status: 201 }
    );
  }),
];

```

---

### Step 3: Setup Worker for the Browser

Generate the Service Worker script into your public directory:

```bash
npx msw init public/ --save

```

Then configure the browser worker in `src/mocks/browser.js`:

```javascript
// src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

```

---

### Step 4: Initialize MSW in React Entry Point

Start the worker before rendering your React app (typically in development mode only):

```javascript
// src/main.jsx or src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // Pass through requests not defined in handlers
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

```

---

### Step 5: Fetch Data Normally in React Components

Your React component uses normal `fetch` or `axios`. It has zero knowledge that MSW is intercepting the call:

```jsx
// src/App.jsx
import { useEffect, useState } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Normal fetch call - MSW intercepts this at the browser level
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>User List (Mocked by MSW)</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

```

How do I set up MSW to mock API calls in Vitest or Jest tests for React components?

To set up Mock Service Worker (MSW) for component testing in Vitest or Jest, you will use MSW's **Node server API** (`msw/node`). Instead of registering a Service Worker, MSW intercepts Node's `http`/`https` modules during testing.

---

## Step 1: Create the Node Test Server

Define your server using `setupServer` and import the same request handlers you use in development.

```javascript
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request interception server with the given request handlers.
export const server = setupServer(...handlers);

```

---

## Step 2: Configure Test Lifecycle Hooks

Configure your test runner to start the server before all tests, reset handlers after each test, and close the server when done.

### Option A: Vitest Setup

Add the lifecycle hooks to your Vitest setup file (e.g., `src/setupTests.js`):

```javascript
// src/setupTests.js
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';
import '@testing-library/jest-dom';

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that may be added during a test,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

```

Ensure this setup file is registered in `vitest.config.js`:

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
});

```

---

### Option B: Jest Setup

Add the lifecycle hooks to your Jest setup file (e.g., `src/setupTests.js`):

```javascript
// src/setupTests.js
import { server } from './mocks/server';
import '@testing-library/jest-dom';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

```

Ensure `setupFilesAfterEnv` points to your setup file in `jest.config.js`:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};

```

---

## Step 3: Write Component Tests

Write your component tests using **React Testing Library**. You can test default mock responses or override handlers on a per-test basis (e.g., testing error states).

```jsx
// src/App.test.jsx
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import App from './App';

test('renders user list fetched from API', async () => {
  render(<App />);

  // Wait for items mocked in src/mocks/handlers.js to appear
  const user1 = await screen.findByText('Alice Developer');
  const user2 = await screen.findByText('Bob Engineer');

  expect(user1).toBeInTheDocument();
  expect(user2).toBeInTheDocument();
});

test('handles server error state', async () => {
  // Override the default GET /api/users handler for this specific test
  server.use(
    http.get('/api/users', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<App />);

  // Verify your component displays error handling UI
  const errorMessage = await screen.findByText(/failed to load users/i);
  expect(errorMessage).toBeInTheDocument();
});

```

---

## Key Testing Best Practices

1. **Always call `server.resetHandlers()` in `afterEach`:** This prevents runtime overrides (`server.use(...)`) from leaking into subsequent tests.
2. **Set `onUnhandledRequest: 'error'` in `server.listen()`:** If a component makes an unhandled API request during a test, MSW will instantly throw an error instead of letting it fail silently or make a real network request.
3. **Polyfill Fetch (if using older Node versions):** If running tests on Node `< 18`, ensure a global fetch polyfill like `undici` or `whatwg-fetch` is imported in your setup file. Modern Node (18+) includes global `fetch` natively.

To test custom hooks and loading states, you use React Testing Library's `renderHook` function alongside MSW. MSW lets you delay network responses or control when they resolve so you can verify loading spinners before the final data renders.

---

## Part 1: Testing Loading Spinners in Components

To test that a loading spinner appears, delay the MSW response using `delay()` from the `msw` package. This creates a window of time where the request is pending, allowing React Testing Library to assert that the loading UI is rendered.

### Component Under Test (`UserList.jsx`)

```jsx
// src/UserList.jsx
import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div role="status">Loading users...</div>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

```

### Component Test (`UserList.test.jsx`)

```jsx
// src/UserList.test.jsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { server } from './mocks/server';
import UserList from './UserList';

test('shows loading spinner initially, then displays user list', async () => {
  // Override endpoint to add an intentional delay
  server.use(
    http.get('/api/users', async () => {
      await delay(100); // Hold request open for 100ms
      return HttpResponse.json([{ id: 1, name: 'Alice Developer' }]);
    })
  );

  render(<UserList />);

  // 1. Assert spinner is immediately in the DOM (sync)
  const spinner = screen.getByRole('status');
  expect(spinner).toHaveTextContent('Loading users...');

  // 2. Wait for spinner to disappear after MSW resolves
  await waitForElementToBeRemoved(() => screen.queryByRole('status'));

  // 3. Assert final data is rendered
  expect(screen.getByText('Alice Developer')).toBeInTheDocument();
});

```

---

## Part 2: Testing React Custom Hooks with `renderHook`

When testing a custom hook that fetches data, use `renderHook` to execute the hook and `act` / `waitFor` to inspect its returning state over time.

### Custom Hook (`useFetchUsers.js`)

```javascript
// src/useFetchUsers.js
import { useState, useEffect } from 'react';

export function useFetchUsers() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((users) => {
        if (isMounted) {
          setData(users);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

```

### Custom Hook Test (`useFetchUsers.test.js`)

```javascript
// src/useFetchUsers.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { server } from './mocks/server';
import { useFetchUsers } from './useFetchUsers';

test('returns loading state initially, then returns user data on success', async () => {
  server.use(
    http.get('/api/users', async () => {
      await delay(100);
      return HttpResponse.json([{ id: 1, name: 'Bob Engineer' }]);
    })
  );

  const { result } = renderHook(() => useFetchUsers());

  // 1. Initial State assertions
  expect(result.current.isLoading).toBe(true);
  expect(result.current.data).toBeNull();
  expect(result.current.error).toBeNull();

  // 2. Wait for hook state update when MSW resolves
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  // 3. Final State assertions
  expect(result.current.data).toEqual([{ id: 1, name: 'Bob Engineer' }]);
  expect(result.current.error).toBeNull();
});

test('handles hook error state on 500 error', async () => {
  server.use(
    http.get('/api/users', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const { result } = renderHook(() => useFetchUsers());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data).toBeNull();
  expect(result.current.error).toBe('Network response was not ok');
});

```

---

## Summary Checklist

1. **Use `delay()` from `msw`:** Keeps HTTP requests pending long enough to test initial loading states.
2. **Use `getByRole` for instant loading elements:** Query sync loading states immediately after `render` or `renderHook`.
3. **Use `waitForElementToBeRemoved` or `waitFor`:** Handle async transitions as MSW resolves requests.

How can I use MSW to simulate API errors (like 500 or 404) and slow network delays in React?

MSW makes simulating edge cases like network latency, client/server errors, and total network failures straightforward without modifying your React code or component logic.

---

## 1. Simulating Network Delays

Use MSW's built-in `delay()` helper inside your handler to pause execution before returning a response.

### Constant Delay

```javascript
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/users', async () => {
    // Delays the response by 2000 milliseconds (2 seconds)
    await delay(2000);

    return HttpResponse.json([
      { id: 1, name: 'Alice Developer' },
    ]);
  }),
];

```

### Realistic Variable Latency or Infinite Loading

```javascript
// Realistic random network latency (e.g., between 500ms and 1500ms)
await delay(); // Default is a realistic random duration (100–400ms)

// Infinite pending state (useful for testing skeleton screens/spinners that never resolve)
await delay('infinite');

```

---

## 2. Simulating HTTP Error Responses (404, 500, 401, etc.)

Return an `HttpResponse` instance configured with standard status codes, status text, or error JSON payloads.

### Server Error (500 Internal Server Error)

```javascript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }),
];

```

### Resource Not Found (404) with Custom Error Payload

```javascript
http.get('/api/users/:id', ({ params }) => {
  const { id } = params;

  return HttpResponse.json(
    { message: `User with ID ${id} was not found` },
    { status: 404 }
  );
});

```

### Authentication Error (401 / 403)

```javascript
http.post('/api/protected-data', () => {
  return HttpResponse.json(
    { error: 'Unauthorized access' },
    { status: 401 }
  );
});

```

---

## 3. Simulating Total Network Failures (Offline / CORS / Dropped Connection)

If you want to test how your app recovers when the user loses internet connection or encounters a browser-level network error (e.g., `fetch()` throws a `TypeError`), use `HttpResponse.error()`.

```javascript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    // Throws a raw network error at the browser level
    return HttpResponse.error();
  }),
];

```

---

## 4. Overriding Endpoints Dynamically in Dev/Tests

Rather than modifying default handlers in `handlers.js`, you can runtime-override handlers on the fly in components or test blocks using `server.use()` or `worker.use()`.

### Example: Testing a 500 Error in a Specific Test

```jsx
import { render, screen } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { server } from './mocks/server';
import UserList from './UserList';

test('renders error alert on 500 response after delay', async () => {
  // Override for this test only
  server.use(
    http.get('/api/users', async () => {
      await delay(500); // 500ms delay
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<UserList />);

  // Assert error message renders
  const errorMessage = await screen.findByText(/something went wrong/i);
  expect(errorMessage).toBeInTheDocument();
});

```

### Example: Triggering Errors Interactively in Dev Environment

In your browser during local development, you can dynamically append temporary handlers directly from your browser console:

```javascript
// In browser DevTools console
import('./mocks/browser').then(({ worker }) => {
  const { http, HttpResponse } = window.msw; // Or import directly
  worker.use(
    http.get('/api/users', () => HttpResponse.json({ error: 'Server exploded' }, { status: 500 }))
  );
});

```
