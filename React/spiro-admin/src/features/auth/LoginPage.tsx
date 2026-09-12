/**
 * Login.
 *
 * Three things this gets right that a demo login usually does not:
 *
 *   1. It respects `?from=` — a user who deep-linked to a battery and got
 *      bounced here lands back on that battery, not on the dashboard.
 *   2. The submit button is disabled while pending AND the form is a real
 *      <form>, so Enter works and password managers see it.
 *   3. The error is announced (`role="alert"`), not just coloured red.
 *
 * The demo accounts are listed on the page on purpose: this app has no
 * backend, and a login screen you cannot get past is not a demo.
 */

import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { DEMO_ACCOUNTS, useAuth } from './AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/i18n/I18nProvider';

export function LoginPage() {
  const { signIn, status, error, isPending } = useAuth();
  const { lang, toggle: toggleLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@spiro.com');
  const [password, setPassword] = useState('spiro');

  // ProtectedRoute stashes the blocked location in router state; the query
  // string is the fallback for a hand-typed /login?from=/vehicles.
  const state = location.state as { from?: { pathname?: string } } | null;
  const from =
    state?.from?.pathname ?? new URLSearchParams(location.search).get('from') ?? '/';

  // Already signed in (e.g. a second tab restored the session) — don't show
  // the form at all.
  if (status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      // `error` from the context already carries the message; swallowing here
      // stops an unhandled rejection in the console.
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--sp-6)',
        background: 'var(--bg-app)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="row" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          <span className="rail__logo" aria-hidden="true">
            S
          </span>
          <div>
            <strong style={{ fontSize: 'var(--fs-lg)' }}>Spiro IoTHub</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              {t('login.tagline')}
            </div>
          </div>

          <span className="spacer" />

          {/* The language switch belongs here too: asking someone to sign in
              before they can choose a language they read is backwards. */}
          <button type="button" className="btn btn--ghost btn--sm" onClick={toggleLang}>
            {lang === 'en' ? 'Français' : 'English'}
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="card"
          style={{ padding: 'var(--sp-6)', display: 'grid', gap: 'var(--sp-4)' }}
        >
          <h1 style={{ fontSize: 'var(--fs-xl)', margin: 0 }}>{t('login.title')}</h1>

          <Input
            label={t('login.email')}
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={t('login.password')}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div
              role="alert"
              className="row"
              style={{ gap: 'var(--sp-2)', color: 'var(--status-critical)', fontSize: 'var(--fs-sm)' }}
            >
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" variant="primary" block loading={isPending}>
            {t('login.title')}
          </Button>
        </form>

        <div
          style={{
            marginTop: 'var(--sp-5)',
            padding: 'var(--sp-4)',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>{t('login.demoAccounts')}</strong>
          <p style={{ margin: 'var(--sp-2) 0 var(--sp-3)' }}>{t('login.demoNote')}</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--sp-2)' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email} className="row" style={{ gap: 'var(--sp-2)' }}>
                <code>{account.email}</code>
                <span className="spacer" />
                <span>{account.role.replace('_', ' ')}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                >
                  {t('login.use')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
