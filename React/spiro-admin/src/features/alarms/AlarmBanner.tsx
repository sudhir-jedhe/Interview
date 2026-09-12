/**
 * The red strip at the top of every page.
 *
 * It shows only CRITICAL alarms, and only unacknowledged ones. A banner that
 * shows everything is a banner that is always there, and a banner that is
 * always there is wallpaper.
 *
 * Dismissing hides it until the next critical alarm arrives — it does not
 * acknowledge anything, because hiding a warning and clearing it are
 * different acts and conflating them loses the record.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Banner } from '@/components/ui/Banner';
import { useAlarms } from './AlarmProvider';

export function AlarmBanner() {
  const { active, criticalCount } = useAlarms();
  const critical = active.filter((a) => a.severity === 'critical');
  const newest = critical[0];

  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // A newer critical alarm un-dismisses the strip.
  useEffect(() => {
    if (newest && dismissedId && newest.id !== dismissedId) setDismissedId(null);
  }, [newest, dismissedId]);

  if (!newest || dismissedId === newest.id) return null;

  return (
    <div style={{ padding: 'var(--sp-4) var(--sp-6) 0' }}>
      <Banner
        tone="critical"
        title={
          criticalCount > 1
            ? `${criticalCount} critical alarms open`
            : 'Critical alarm open'
        }
        onDismiss={() => setDismissedId(newest.id)}
        action={
          <Link className="btn btn--danger btn--sm" to="/alarms">
            Open alarm centre
          </Link>
        }
      >
        {newest.message}
      </Banner>
    </div>
  );
}
