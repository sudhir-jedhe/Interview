/**
 * Toasts — one provider, imperative API.
 *
 * Deliberately NOT a hook-per-component: errors surface from API calls all
 * over the app, and threading an `onError` through every layer is how you end
 * up with none of them showing anything.
 */

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';

type ToastKind = 'info' | 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = ++nextId;
      setToasts((current) => [...current, { id, kind, message }]);

      // Errors stay longer — they usually need reading twice.
      setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4000);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (m) => show(m, 'success'),
      error: (m) => show(m, 'error'),
    }),
    [show]
  );

  return (
    <ToastContext value={value}>
      {children}

      {toasts.length > 0 && (
        <div className="toasts" role="region" aria-label="Notifications">
          {toasts.map((toast) => (
            <div key={toast.id} className={cn('toast', `toast--${toast.kind}`)} role="alert">
              <Icon
                name={toast.kind === 'success' ? 'check' : toast.kind === 'error' ? 'alert' : 'bell'}
                size={16}
              />
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} aria-label="Dismiss">
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
