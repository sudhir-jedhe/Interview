import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/features/auth/AuthProvider';
import { ROLE_LABELS } from '@/features/auth/permissions';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useTheme } from '@/hooks/useTheme';
import { useRealtimeState } from '@/hooks/useRealtime';
import { useAlarms } from '@/features/alarms/AlarmProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { GlobalSearch } from './GlobalSearch';

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, signOut } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useI18n();

  const feed = useRealtimeState();
  const { unacknowledgedCount, criticalCount } = useAlarms();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <header className="topbar">
      <button
        className="topbar__burger"
        onClick={onToggleSidebar}
        aria-label={t('chrome.toggleNav')}
      >
        <Icon name="menu" size={20} />
      </button>

      <GlobalSearch />

      <div className="topbar__actions">
        {/* Feed health is a permanent fixture, not a toast: an operator has
            to be able to tell "nothing is happening" from "nothing is
            arriving" at a glance. */}
        <span
          className={feed === 'open' ? 'pill pill--live' : 'pill'}
          title={
            feed === 'open'
              ? t('chrome.feedLiveTitle')
              : feed === 'connecting'
                ? t('chrome.feedConnectingTitle')
                : t('chrome.feedClosedTitle')
          }
        >
          {feed === 'open' && <span className="pill__pulse" aria-hidden="true" />}
          {feed === 'open'
            ? t('chrome.live')
            : feed === 'connecting'
              ? t('chrome.connecting')
              : t('chrome.feedOffline')}
        </span>

        {/* Language toggle — a switch with both endpoints labelled, so the
            state is readable without knowing which side means what. */}
        <div className="lang-toggle">
          <span style={{ opacity: lang === 'fr' ? 1 : 0.65 }}>Fr</span>
          <button
            className="lang-toggle__switch"
            data-on={lang === 'en'}
            role="switch"
            aria-checked={lang === 'en'}
            aria-label={t('chrome.language')}
            onClick={toggleLang}
          >
            <span className="lang-toggle__knob" />
          </button>
          <span style={{ opacity: lang === 'en' ? 1 : 0.65 }}>En</span>
        </div>

        <button className="topbar__icon-btn" onClick={toggleTheme} aria-label={t('chrome.theme')}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>

        <Link
          to="/alarms"
          className="topbar__icon-btn"
          aria-label={
            unacknowledgedCount === 0
              ? t('chrome.alarmsNone')
              : `${t('nav.alarms')}: ${unacknowledgedCount} ${t('state.open')}${
                  criticalCount > 0 ? `, ${criticalCount} ${t('state.critical')}` : ''
                }`
          }
        >
          <Icon name="bell" size={19} />
          {unacknowledgedCount > 0 && (
            <span
              className="topbar__badge"
              aria-hidden="true"
              style={criticalCount > 0 ? { background: 'var(--status-critical)' } : undefined}
            >
              {unacknowledgedCount > 99 ? '99+' : unacknowledgedCount}
            </span>
          )}
        </Link>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            className="topbar__user"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Icon name="user" size={19} />
            <span>{user?.name}</span>
            <Icon name="chevron-down" size={14} />
          </button>

          {menuOpen && (
            <div className="select__menu" role="menu" style={{ right: 0, left: 'auto', width: 220 }}>
              <div style={{ padding: 'var(--sp-3)', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ display: 'block' }}>{user?.name}</strong>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  {user?.email}
                </span>
                <div style={{ marginTop: 'var(--sp-2)' }}>
                  <span className="badge badge--info">{user ? ROLE_LABELS[user.role] : ''}</span>
                </div>
              </div>

              <button className="select__option" role="menuitem" onClick={signOut}>
                <span className="row" style={{ gap: 'var(--sp-2)' }}>
                  <Icon name="logout" size={16} /> {t('chrome.logout')}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
