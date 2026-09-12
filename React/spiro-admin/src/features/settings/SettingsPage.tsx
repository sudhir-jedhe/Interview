/**
 * Settings — preferences, and what the browser is holding.
 *
 * The storage table is here because "where is my state" is a question people
 * genuinely have, and because the two scopes behave differently in ways that
 * are invisible until they surprise you:
 *
 *   Preferences (localStorage) survive the browser closing and are shared by
 *   every tab. Change the theme here and the other tab changes too.
 *
 *   This session (sessionStorage) dies with the tab and is private to it.
 *   Two tabs are two workspaces: filter one to Pune and the other stays put.
 *
 * Nothing operational is stored in either. The access token is deliberately
 * in memory only, so it does not survive a reload and cannot be read by
 * anything else on the origin.
 */

import { useState } from 'react';

import { clearScope, inspectStorage, type Scope } from '@/lib/storage';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/hooks/useTheme';
import { useAlarms } from '@/features/alarms/AlarmProvider';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

const LANG_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'fr' as const, label: 'Français' },
];

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
];

const SCOPE_LABEL: Record<Scope, string> = {
  local: 'Preference',
  session: 'This session',
};

/** What each key is for, in words rather than as a raw key name. */
const DESCRIPTIONS: { match: (key: string) => boolean; text: string }[] = [
  { match: (k) => k === 'lang', text: 'Interface language' },
  { match: (k) => k === 'profile', text: 'Your name and role, so a reload does not flash an empty topbar' },
  { match: (k) => k === 'theme', text: 'Light or dark' },
  { match: (k) => k === 'nav-expanded', text: 'Whether the navigation rail is pinned open' },
  { match: (k) => k === 'alarm-thresholds', text: 'Your alarm trip points and whether the chime is armed' },
  { match: (k) => k.startsWith('table:'), text: 'Where you are in a table — sort, filters, page' },
  { match: (k) => k.startsWith('filter:'), text: 'A filter you set on a screen' },
];

function describe(key: string): string {
  if (key.startsWith('cols:')) return `Column choices for the ${key.slice(5)} table`;
  if (key.startsWith('table:')) {
    const [, table, field] = key.split(':');
    return `${table} table — ${field}`;
  }
  if (key.startsWith('filter:')) {
    const [, screen, field] = key.split(':');
    return `${screen} screen — ${field} filter`;
  }
  return DESCRIPTIONS.find((d) => d.match(key))?.text ?? '—';
}

export function SettingsPage() {
  const { lang, setLang, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const { thresholds, toggleSound } = useAlarms();
  const toast = useToast();

  // Bumped after a clear so the table re-reads. Storage has no change event
  // for the tab that wrote it, so nothing else would trigger a re-render.
  const [version, setVersion] = useState(0);
  const [clearing, setClearing] = useState<Scope | null>(null);

  const rows = inspectStorage();
  void version;

  const totals = rows.reduce<Record<Scope, { count: number; bytes: number }>>(
    (acc, row) => {
      acc[row.scope].count += 1;
      acc[row.scope].bytes += row.bytes;
      return acc;
    },
    { local: { count: 0, bytes: 0 }, session: { count: 0, bytes: 0 } }
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <h1 className="page-title">Settings</h1>

        <div className="auto-grid">
          <Card title="Language">
            <Select value={lang} options={LANG_OPTIONS} onChange={setLang} />
            <p style={{ margin: 'var(--sp-3) 0 0', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Also sets the page language and switches number and date formats to match.
            </p>
          </Card>

          <Card title="Appearance">
            <Select value={theme} options={THEME_OPTIONS} onChange={setTheme} />
            <p style={{ margin: 'var(--sp-3) 0 0', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Shared across tabs — changing it here changes it everywhere.
            </p>
          </Card>

          <Card title="Alarm sound">
            <div className="row" style={{ gap: 'var(--sp-3)' }}>
              <Badge tone={thresholds.soundArmed ? 'success' : 'neutral'}>
                {thresholds.soundArmed ? 'Armed' : 'Silent'}
              </Badge>
              <span className="spacer" />
              <Button variant="secondary" icon="bell" onClick={toggleSound}>
                {thresholds.soundArmed ? 'Disarm' : 'Arm'}
              </Button>
            </div>
            <p style={{ margin: 'var(--sp-3) 0 0', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Thresholds live on the Alarms screen. Browsers block audio until you ask for it, which
              is why this is a button and not a default.
            </p>
          </Card>
        </div>

        <Card
          title="What this browser is storing"
          action={
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              <Button size="sm" variant="ghost" onClick={() => setClearing('session')}>
                Clear session
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setClearing('local')}>
                Reset preferences
              </Button>
            </div>
          }
        >
          <div className="auto-grid auto-grid--tight" style={{ marginBottom: 'var(--sp-4)' }}>
            <Tally
              label="Preferences"
              value={`${totals.local.count} keys · ${totals.local.bytes} B`}
              note="Survives closing the browser. Shared by every tab."
            />
            <Tally
              label="This session"
              value={`${totals.session.count} keys · ${totals.session.bytes} B`}
              note="Dies with this tab. Private to it."
            />
            <Tally
              label="Access token"
              value="In memory only"
              note="Never written to storage, so a reload signs you out."
            />
          </div>

          {rows.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              Nothing stored yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Scope</th>
                    <th>Key</th>
                    <th>What it is</th>
                    <th style={{ textAlign: 'right' }}>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.scope}:${row.key}`}>
                      <td>
                        <Badge tone={row.scope === 'local' ? 'info' : 'neutral'}>
                          {SCOPE_LABEL[row.scope]}
                        </Badge>
                      </td>
                      <td className="mono">{row.key}</td>
                      <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                        {describe(row.key)}
                      </td>
                      <td style={{ textAlign: 'right' }}>{row.bytes} B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p
            className="row"
            style={{ gap: 'var(--sp-2)', marginBottom: 0, marginTop: 'var(--sp-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}
          >
            <Icon name="shield" size={15} />
            {t('chrome.logout')} clears the in-memory token. No fleet data, rider details or audit
            entries are written to either store.
          </p>
        </Card>
      </div>

      <ConfirmDialog
        open={clearing !== null}
        title={clearing === 'local' ? 'Reset your preferences?' : 'Clear this session?'}
        description={
          clearing === 'local'
            ? 'Language, theme, column choices and alarm thresholds go back to their defaults, in every tab — and because your profile is stored here too, it signs you out.'
            : 'Filters, sort order and page positions for this tab are forgotten. Your preferences are untouched.'
        }
        confirmLabel={clearing === 'local' ? 'Reset preferences' : 'Clear session'}
        danger={clearing === 'local'}
        onCancel={() => setClearing(null)}
        onConfirm={() => {
          if (!clearing) return;
          clearScope(clearing);
          setVersion((v) => v + 1);
          toast.success(clearing === 'local' ? 'Preferences reset' : 'Session cleared');
          setClearing(null);
        }}
      />
    </>
  );
}

function Tally({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div style={{ padding: 'var(--sp-3)', background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)' }}>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{note}</div>
    </div>
  );
}
