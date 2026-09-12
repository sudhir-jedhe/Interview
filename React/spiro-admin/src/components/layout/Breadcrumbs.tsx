import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

/**
 * Breadcrumbs derived from the URL.
 *
 * Deriving beats hand-writing them per page: they can never disagree with
 * where the user actually is. The label map turns slugs into prose, and an
 * id segment (the last crumb on a detail route) is replaced by a passed-in
 * title rather than showing a raw uuid.
 */

const LABELS: Record<string, string> = {
  tracking: 'Tracking',
  'vehicle-tracking': 'Vehicle Tracking',
  'battery-tracking': 'Battery Tracking',
  'battery-book': 'Battery Book',
  info: 'Info',
  vehicles: 'Vehicles',
  batteries: 'Batteries',
  users: 'User Management',
  analytics: 'Analytics',
  live: 'Live Feed',
  alarms: 'Alarms',
  geofences: 'Geofences',
  stations: 'Swap Stations',
  maintenance: 'Maintenance',
  riders: 'Riders',
  reports: 'Reports',
  audit: 'Audit Trail',
  settings: 'Settings',
};

export function Breadcrumbs({ currentLabel }: { currentLabel?: string }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return <nav className="breadcrumbs" aria-label="Breadcrumb" />;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const to = `/${segments.slice(0, index + 1).join('/')}`;

        // An unmapped last segment is an id — show the entity's name instead.
        const label = LABELS[segment] ?? (isLast && currentLabel ? currentLabel : prettify(segment));

        return (
          <span key={to} className="row" style={{ gap: 'var(--sp-2)' }}>
            <Icon name="chevron-right" size={13} />
            {isLast ? (
              <span className="breadcrumbs__current" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const prettify = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
