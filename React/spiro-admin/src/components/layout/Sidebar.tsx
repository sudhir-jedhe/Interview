import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Can } from '@/features/auth/ProtectedRoute';
import { useAuth } from '@/features/auth/AuthProvider';
import type { Permission } from '@/types/domain';
import { useI18n } from '@/i18n/I18nProvider';
import type { TranslationKey } from '@/i18n/dictionary';

interface NavItem {
  to: string;
  /** A translation key, not a string — the rail changes with the language. */
  label: TranslationKey;
  icon: IconName;
  permission: Permission;
  end?: boolean;
}

interface NavGroup {
  label: TranslationKey;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: 'nav.overview',
    items: [
      { to: '/', label: 'nav.dashboard', icon: 'dashboard', permission: 'dashboard:view', end: true },
      { to: '/live', label: 'nav.live', icon: 'radio', permission: 'vehicle:view' },
      { to: '/alarms', label: 'nav.alarms', icon: 'bell', permission: 'battery:view' },
    ],
  },
  {
    label: 'nav.tracking',
    items: [
      { to: '/tracking/vehicle-tracking', label: 'nav.vehicleTracking', icon: 'scooter', permission: 'vehicle:view' },
      { to: '/tracking/battery-tracking', label: 'nav.batteryTracking', icon: 'battery', permission: 'battery:view' },
      { to: '/geofences', label: 'nav.geofences', icon: 'pin', permission: 'vehicle:view' },
    ],
  },
  {
    label: 'nav.assets',
    items: [
      { to: '/vehicles', label: 'nav.vehicles', icon: 'bike', permission: 'vehicle:view' },
      { to: '/stations', label: 'nav.stations', icon: 'charge', permission: 'station:view' },
      { to: '/maintenance', label: 'nav.maintenance', icon: 'wrench', permission: 'maintenance:view' },
    ],
  },
  {
    label: 'nav.operations',
    items: [
      { to: '/riders', label: 'nav.riders', icon: 'contact', permission: 'rider:view' },
      { to: '/reports', label: 'nav.reports', icon: 'file', permission: 'report:view' },
    ],
  },
  {
    label: 'nav.administration',
    items: [
      { to: '/users', label: 'nav.users', icon: 'user', permission: 'user:view' },
      { to: '/audit', label: 'nav.audit', icon: 'shield', permission: 'audit:view' },
      { to: '/settings', label: 'nav.settings', icon: 'grid', permission: 'dashboard:view' },
    ],
  },
];

export function Sidebar({ expanded, onNavigate }: { expanded: boolean; onNavigate?: () => void }) {
  const { signOut } = useAuth();
  const { t } = useI18n();

  return (
    <aside className={cn('rail', expanded && 'rail--expanded')}>
      <div className="rail__brand">
        <span className="rail__logo" aria-hidden="true">
          S
        </span>
        <strong className="rail__brand-text" style={{ whiteSpace: 'nowrap' }}>
          Spiro IoTHub
        </strong>
      </div>

      {/* A real <nav> with a label — the icon rail is otherwise unnavigable
          by screen reader, since the labels are visually hidden when collapsed. */}
      <nav className="rail__nav" aria-label={t('nav.main')}>
        {NAV.map((group) => (
          <div key={group.label}>
            <div className="rail__group-label">{t(group.label)}</div>

            {group.items.map((item) => (
              <Can key={item.to} permission={item.permission}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className="rail__link"
                  onClick={onNavigate}
                  // The tooltip is the only label when the rail is collapsed.
                  title={expanded ? undefined : t(item.label)}
                >
                  <Icon name={item.icon} size={19} />
                  <span className="rail__link-text">{t(item.label)}</span>
                  {!expanded && <span className="sr-only">{t(item.label)}</span>}
                </NavLink>
              </Can>
            ))}
          </div>
        ))}
      </nav>

      <div className="rail__footer">
        {/* Always reachable: the rail scrolls, this does not. When collapsed
            the icon is the whole control, so it carries its own accessible
            name rather than relying on the hidden text beside it. */}
        <button
          type="button"
          className="rail__link"
          onClick={signOut}
          title={t('chrome.logout')}
          aria-label={t('chrome.logout')}
        >
          <Icon name="logout" size={19} />
          <span className="rail__link-text">{t('chrome.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
