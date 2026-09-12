/**
 * A page-level banner. Used for the alarm strip.
 *
 * `role="alert"` so it is announced the moment it appears, an icon and a
 * word alongside the colour (colour alone is not a signal), and a dismiss
 * that the caller owns — a banner that hides itself loses the alarm.
 */

import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type Tone = 'critical' | 'serious' | 'warning' | 'info';

const TONE: Record<Tone, { color: string; icon: IconName; word: string }> = {
  critical: { color: 'var(--status-critical)', icon: 'alert', word: 'Critical' },
  serious: { color: 'var(--status-serious)', icon: 'alert', word: 'Serious' },
  warning: { color: 'var(--status-warning)', icon: 'alert', word: 'Warning' },
  info: { color: 'var(--viz-1)', icon: 'bell', word: 'Notice' },
};

export function Banner({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}) {
  const spec = TONE[tone];

  return (
    <div className="banner" role="alert" style={{ borderLeftColor: spec.color }}>
      <span className="banner__icon" style={{ color: spec.color }} aria-hidden="true">
        <Icon name={spec.icon} size={18} />
      </span>

      <div className="banner__body">
        <strong>
          <span className="sr-only">{spec.word}: </span>
          {title}
        </strong>
        {children && <div className="banner__detail">{children}</div>}
      </div>

      {action}

      {onDismiss && (
        <button className="btn btn--ghost btn--icon" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
