# Snippets

### 1. Minimal error boundary
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>;
    return this.props.children;
  }
}
```

### 2. Error boundary that logs via `componentDidCatch`
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Caught by boundary:', error, info.componentStack);
  }
  render() {
    return this.state.hasError ? <p>Error!</p> : this.props.children;
  }
}
```

### 3. A component that throws during render (will be caught)
```jsx
function Buggy({ user }) {
  return <p>{user.profile.name}</p>; // throws if user.profile is undefined
}
// <ErrorBoundary><Buggy user={{}} /></ErrorBoundary> shows the fallback UI
```

### 4. An event handler error (will NOT be caught — needs try/catch)
```jsx
function SubmitButton() {
  function handleClick() {
    try {
      riskyOperation();
    } catch (err) {
      console.error('Handled manually:', err); // boundary can't see this
    }
  }
  return <button onClick={handleClick}>Submit</button>;
}
```

### 5. Resettable boundary with a "Try again" button
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  reset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return <button onClick={this.reset}>Try again</button>;
    }
    return this.props.children;
  }
}
```

### 6. Using `react-error-boundary` for a function-component-only workflow
```jsx
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()}>
      <Dashboard />
    </ErrorBoundary>
  );
}
```

### 7. Per-section boundaries so one widget failing doesn't take down the page
```jsx
function HomePage() {
  return (
    <>
      <ErrorBoundary fallback={<p>Weather unavailable</p>}>
        <WeatherWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>News unavailable</p>}>
        <NewsFeed />
      </ErrorBoundary>
    </>
  );
}
```
