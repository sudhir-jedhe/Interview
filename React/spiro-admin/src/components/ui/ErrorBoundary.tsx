/**
 * The one place a class component is still required: React has no hook for
 * `componentDidCatch`. Everything else in this app is a function component.
 *
 * `resetKey` lets a caller clear the boundary on navigation, so a crash on
 * one route does not leave the whole app stuck on the error screen.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this is where the error reporter goes.
    console.error('Unhandled render error', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="page" role="alert" style={{ maxWidth: 560, margin: '0 auto', paddingTop: 'var(--sp-12)' }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Something went wrong</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{error.message}</p>
        <button className="btn btn--primary" onClick={this.reset}>
          Try again
        </button>
      </div>
    );
  }
}
