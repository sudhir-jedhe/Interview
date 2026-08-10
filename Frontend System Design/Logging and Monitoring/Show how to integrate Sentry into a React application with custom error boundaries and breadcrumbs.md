Integrating Sentry into a React application provides real-time error tracking with rich context. Combining Sentry with a custom **Error Boundary** ensures that unhandled UI rendering exceptions display a graceful fallback UI to users while automatically transmitting error stack traces, component stacks, and user action **breadcrumbs** to your monitoring dashboard.

---

## 1. Installation

Install the official Sentry React SDK:

```bash
npm install @sentry/react

```

---

## 2. Initializing Sentry

Initialize Sentry as early as possible in your application lifecycle—typically at the top of your entry file (`main.tsx` or `index.tsx`).

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';

Sentry.init({
  // Replace with your actual project DSN from Sentry settings
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true, // Privacy: Masks sensitive user text input
      blockAllMedia: true,
    }),
  ],

  // Performance Monitoring: Capture 100% of transactions in dev, adjust in prod
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replays: Capture 10% of standard sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

## 3. Creating a Custom Error Boundary with Sentry

Sentry provides an out-of-the-box `<Sentry.ErrorBoundary>` component, but creating a custom wrapper gives you full control over the fallback UI, user feedback dialogs, and manual reset handlers.

```tsx
// src/components/CustomErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  eventId: string | null;
}

export class CustomErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    eventId: null,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true, eventId: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Manually capture exception with component stack trace context
    Sentry.withScope((scope) => {
      scope.setExtras({ componentStack: errorInfo.componentStack });
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, eventId: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>Our team has been notified of this issue.</p>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={this.handleReset}>Try Again</button>
            <button
              onClick={() =>
                Sentry.showReportDialog({ eventId: this.state.eventId || undefined })
              }
            >
              Report Feedback
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

```

---

## 4. Capturing Custom Breadcrumbs & Contextual Logs

**Breadcrumbs** are chronological events leading up to an error. Sentry automatically captures console logs, DOM clicks, network requests, and URL changes, but you can record **custom breadcrumbs** for domain-specific events (e.g., checkout steps or API actions).

### A. Recording Manual Breadcrumbs & Setting User Context

```tsx
// src/services/checkoutService.ts
import * as Sentry from '@sentry/react';

export function setAuthenticatedUser(user: { id: string; email: string; role: string }) {
  // Attach user context to all future Sentry error reports
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

export async function processPayment(cartId: string, amount: number) {
  // 1. Log custom operational breadcrumb before starting critical action
  Sentry.addBreadcrumb({
    category: 'checkout',
    message: `Initiating payment processing for Cart ID: ${cartId}`,
    level: 'info',
    data: { amount, cartId },
  });

  try {
    const response = await fetch('/api/v1/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, amount }),
    });

    if (!response.ok) {
      throw new Error(`Payment processing failed with status ${response.status}`);
    }

    // 2. Record success breadcrumb
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: 'Payment succeeded successfully',
      level: 'info',
    });

    return await response.json();
  } catch (error) {
    // 3. Record error breadcrumb before capturing exception
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: 'Payment execution threw an exception',
      level: 'error',
      data: { cartId, errorMessage: (error as Error).message },
    });

    // Manually capture non-rendering error in try-catch blocks
    Sentry.captureException(error);
    throw error;
  }
}

```

---

## 5. App Component Integration Example

Wrap critical feature views or your entire root application tree in the custom Error Boundary.

```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { CustomErrorBoundary } from './components/CustomErrorBoundary';
import { setAuthenticatedUser, processPayment } from './services/checkoutService';

export default function App() {
  useEffect(() => {
    // Set user context on mount
    setAuthenticatedUser({
      id: 'usr_9876',
      email: 'alex@example.com',
      role: 'premium',
    });
  }, []);

  const handleCheckout = async () => {
    await processPayment('cart_123', 99.99);
  };

  return (
    <CustomErrorBoundary>
      <main style={{ padding: '2rem' }}>
        <h1>Enterprise Dashboard</h1>
        <button onClick={handleCheckout}>Process Order</button>
        
        {/* Child component wrapped in its own error boundary */}
        <CustomErrorBoundary fallback={<div>Failed to load metrics widget.</div>}>
          <ComplexWidget />
        </CustomErrorBoundary>
      </main>
    </CustomErrorBoundary>
  );
}

function ComplexWidget() {
  // Simulated component render error
  return <div>Metrics Loaded Successfully</div>;
}

```

---

## Integration Summary Checklist

| Sentry Feature          | Implementation Method           | What It Captures                                                            |
| ----------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| **Global Init**         | `Sentry.init({ dsn: '...' })`   | Automatic JS errors, unhandled promise rejections.                          |
| **Error Boundary**      | `<CustomErrorBoundary>` wrapper | Component stack traces on UI rendering crashes.                             |
| **Custom Breadcrumbs**  | `Sentry.addBreadcrumb()`        | Chronological events preceding an error (e.g., checkout steps).             |
| **User Identification** | `Sentry.setUser()`              | Binds error reports to specific User IDs/emails for debugging.              |
| **User Feedback**       | `Sentry.showReportDialog()`     | Displays a crash feedback modal allowing users to describe what went wrong. |
