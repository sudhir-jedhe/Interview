Handling API failures globally ensures your application gracefully copes with network drops, backend crashes, expired authentication tokens, and server errors without duplicating error-handling code across dozens of components.

In modern React applications, global API error handling is achieved by combining an **HTTP Interceptor layer** (via Axios or a custom Fetch wrapper) with an **Error Boundary** and a **Global Notification system**.

---

## Architecture Overview

```
                                  [ User Action / Data Fetch ]
                                               │
                                               ▼
                                 [ Axios / Fetch Interceptor ]
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
    [ 401 Unauthorized ]                                             [ 500 / Network Error ]
               │                                                               │
    Redirect to /login &                                             Trigger Global Toast / Banner
    Clear Auth Tokens                                               & Forward to Error Boundary

```

---

## Step 1: Centralize API Calls with HTTP Interceptors

Whether you use `axios` or standard `fetch`, create an API client that intercepts all responses. If an error occurs, handle infrastructure errors (like `401 Unauthorized` or `503 Service Unavailable`) automatically.

### Option A: Using Axios Interceptors

```typescript
// api/client.ts
import axios from 'axios';
import { toast } from 'your-toast-library'; // e.g., react-hot-toast, sonner

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Response Interceptor for Global Error Handling
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    // 1. Network / Connection Errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 2. Status-Specific Global Logic
    switch (status) {
      case 401: // Unauthorized: Session expired or invalid token
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        break;

      case 403: // Forbidden
        toast.error('You do not have permission to perform this action.');
        break;

      case 404: // Not Found (optional: handle globally or let page handle it)
        toast.error(data?.message || 'Requested resource not found.');
        break;

      case 500: // Server Crash
      case 502:
      case 503:
        toast.error('Server error. Our engineers have been notified.');
        // Log error to monitoring service (e.g., Sentry, LogRocket)
        logToSentry(error);
        break;

      default:
        toast.error(data?.message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

```

---

### Option B: Using Native `fetch` Wrapper

If you don't use Axios, wrap native `fetch` in a custom function:

```typescript
// api/fetchClient.ts
import { toast } from 'your-toast-library';

export async function customFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
      } else if (response.status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'TypeError') {
      toast.error('Network issue detected. Please check your connection.');
    }
    throw error;
  }
}

```

---

## Step 2: Global Integration with React Query / SWR

If you use **TanStack Query (React Query)**, you can configure a global default query/mutation cache handler so you don't have to write `onError` logic in every single component.

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'your-toast-library';

const queryClient = new QueryClient({
  // Global query error handling (for GET requests)
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Skip showing global toast if the specific query opted out
      if (query.meta?.suppressGlobalError) return;
      
      toast.error(`Error loading data: ${error.message}`);
    },
  }),

  // Global mutation error handling (for POST/PUT/DELETE)
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressGlobalError) return;

      toast.error(`Action failed: ${error.message}`);
    },
  }),

  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, or 404
        if ([401, 403, 404].includes(error?.response?.status)) return false;
        return failureCount < 2; // Retry twice for network/500 errors
      },
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

```

### Allowing Local Overrides

If a specific component wants to handle its own error (e.g., showing a inline form error instead of a global toast), set `meta.suppressGlobalError`:

```tsx
// Component-specific call suppressing global toast
const { data } = useQuery({
  queryKey: ['customData'],
  queryFn: fetchCustomData,
  meta: { suppressGlobalError: true }, // Global handler will ignore this error
});

```

---

## Step 3: Catch Unhandled UI Crashes with React Error Boundaries

When an API failure causes a component to throw an exception during rendering, wrap your app (or sub-sections) in a **React Error Boundary** to prevent the entire screen from going blank.

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI Error caught by boundary:', error, errorInfo);
    // Log to error monitoring tools (e.g., Sentry)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message || 'An unexpected application error occurred.'}</p>
          <button onClick={this.handleReset}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

```

---

## Summary Checklist for Global Error Handling

| Error Category                 | Best Strategy                          | Action Taken                                                 |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------ |
| **Auth Expiry (`401`)**        | Axios / Fetch Interceptor              | Clear tokens and redirect user to `/login`.                  |
| **Server Failure (`500/503`)** | Interceptor / React Query Global Cache | Display global Toast notification & send alert to Sentry.    |
| **Network Disconnection**      | Interceptor / Offline Listener         | Show persistent "You are offline" notification banner.       |
| **Unhandled Component Crash**  | React Error Boundary                   | Render user-friendly fallback screen with a "Reload" button. |

How do you integrate Sentry with global error handling in React?
Integrating **Sentry** with a global error handling architecture in React gives you real-time visibility into client-side crashes, API failures, and unhandled promise rejections before users report them.

Below is a complete, production-ready guide to integrating Sentry with React, combining **Sentry’s Error Boundary**, **React Query global handlers**, and **Axios/Fetch interceptors**.

---

## 1. Installation & Initialization

First, install the official Sentry React SDK:

```bash
npm install @sentry/react

```

Initialize Sentry at the **entry point** of your application (e.g., `main.tsx` or `index.tsx`) **before rendering the React app**.

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';

Sentry.init({
  dsn: 'https://YOUR_PUBLIC_KEY@o000000.ingest.sentry.io/0000000', // Found in Sentry Project Settings
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,       // Privacy: Mask sensitive user text
      blockAllMedia: true,     // Privacy: Block images/media in session replays
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,      // Capture 100% of transactions in dev (lower to 0.1-0.2 in high-traffic production)
  
  // Session Replays
  replaysSessionSampleRate: 0.1, // Record 10% of standard user sessions
  replaysOnErrorSampleRate: 1.0, // Record 100% of sessions when an error occurs

  // Environment & Release Tracking
  environment: import.meta.env.MODE, // 'production' or 'development'
  release: `my-app@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

## 2. Global UI Error Boundary with Sentry

Sentry provides a built-in `<Sentry.ErrorBoundary>` component that catches React component rendering errors, sends the stack trace directly to Sentry, and renders a fallback UI.

```tsx
// App.tsx
import * as Sentry from '@sentry/react';

function ErrorFallback({ error, resetError }: Sentry.FallbackProps) {
  return (
    <div role="alert" style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: '#d9534f' }}>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  );
}

export function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={ErrorFallback}
      showDialog // Opens Sentry user feedback modal on crash (optional)
      onReset={() => {
        // Clear cached state or reload page if needed
        window.location.reload();
      }}
    >
      <MainRouter />
    </Sentry.ErrorBoundary>
  );
}

```

---

## 3. Capturing API Failures (Axios Interceptors)

Network failures (like `500 Internal Server Error`) don't automatically trigger React Error Boundaries unless they crash a render pass. You should report critical API failures explicitly using **`Sentry.captureException`**.

```typescript
// api/client.ts
import axios from 'axios';
import * as Sentry from '@sentry/react';

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Report server crashes (5xx) or unexpected network errors to Sentry
    if (!status || status >= 500) {
      Sentry.withScope((scope) => {
        // Attach extra context for debugging
        scope.setTag('api_url', error.config?.url);
        scope.setExtra('response_body', error.response?.data);
        scope.setExtra('status_code', status);
        
        Sentry.captureException(error);
      });
    }

    return Promise.reject(error);
  }
);

```

---

## 4. Integrating with React Query (TanStack Query)

If you use React Query, attach Sentry monitoring to the global `QueryCache` and `MutationCache` so failed background fetches are logged automatically:

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Don't report expected 404s or 401s if they are handled by UI
      const status = (error as any)?.response?.status;
      if (status === 404 || status === 401) return;

      Sentry.captureException(error, {
        tags: {
          query_key: JSON.stringify(query.queryKey),
        },
      });
    },
  }),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

```

---

## 5. Enriching Sentry Errors with User Context

To make debugging actionable, attach authenticated user details and custom tags when users log into your app:

```typescript
import * as Sentry from '@sentry/react';

// Call this upon successful authentication
export function identifyUserInSentry(user: { id: string; email: string; role: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

// Call this on user logout
export function clearSentryUser() {
  Sentry.setUser(null);
}

```

---

## Sentry Error Pipeline Summary

```
   ┌───────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
   │ React Render Crash    │ ──────► │ Sentry Error Boundary│ ──────► │ Log Stack Trace +    │
   └───────────────────────┘         └──────────────────────┘         │ Session Replay       │
                                                                      │                      │
   ┌───────────────────────┐         ┌──────────────────────┐         │ SENTRY DASHBOARD     │
   │ API 500 Server Error  │ ──────► │ Axios Interceptor /  │ ──────► │                      │
   └───────────────────────┘         │ React Query Cache    │         │                      │
                                     └──────────────────────┘         └──────────────────────┘

```
