import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Button } from './Button';

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={30} />
      <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="empty-state" role="alert">
      <Icon name="alert" size={30} style={{ color: 'var(--danger)' }} />
      <strong style={{ color: 'var(--text-primary)' }}>Something went wrong</strong>
      <span>{error.message}</span>
      {onRetry && (
        <Button variant="secondary" icon="refresh" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: string | number }) {
  return <div className="skeleton" style={{ height, width }} />;
}
