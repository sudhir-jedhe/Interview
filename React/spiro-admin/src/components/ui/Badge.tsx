import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'solid';

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn('badge', `badge--${tone}`)}>{children}</span>;
}

/** Online/offline dot with a text label the screen reader also gets. */
export function StatusDot({ online, label }: { online: boolean; label?: string }) {
  return (
    <span className="row" style={{ gap: 'var(--sp-2)' }}>
      <span className={cn('dot', online ? 'dot--online' : 'dot--offline')} />
      <span className="sr-only">{online ? 'Online' : 'Offline'}</span>
      {label && <span aria-hidden="true">{label}</span>}
    </span>
  );
}
