/**
 * Provider composition.
 *
 * Order is not arbitrary:
 *   ErrorBoundary  outermost, so a crash anywhere still renders something.
 *   BrowserRouter  the auth provider reads the location on bootstrap.
 *   I18nProvider   above auth, because the LOGIN screen needs translating
 *                  too — you cannot ask someone to sign in before they can
 *                  choose a language they read.
 *   AuthProvider   everything below asks it "who am I / may I".
 *   ToastProvider  so any page — and the alarm engine — can raise a toast.
 *   AlarmProvider  innermost: it needs auth for attribution and toasts for
 *                  notification, and every screen reads from it.
 */

import { BrowserRouter } from 'react-router-dom';

import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { AlarmProvider } from '@/features/alarms/AlarmProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AppRoutes } from '@/router/routes';

import '@/styles/tokens.css';
import '@/styles/global.css';
import '@/components/ui/ui.css';
import '@/components/layout/layout.css';
import '@/components/charts/chart.css';
import '@/styles/print.css';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              {/* Alarms sit INSIDE the toast provider: the engine raises
                  toasts, and outside it that call would throw. It also sits
                  inside auth, because an alarm is attributed to whoever
                  acknowledges it. */}
              <AlarmProvider>
                <AppRoutes />
              </AlarmProvider>
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
