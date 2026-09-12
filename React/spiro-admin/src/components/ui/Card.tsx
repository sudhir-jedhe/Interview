import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  title?: ReactNode;
  action?: ReactNode;
  accent?: boolean;
  flush?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function Card({ title, action, accent, flush, className, style, children }: CardProps) {
  return (
    <section className={cn('card', className)} style={style}>
      {(title || action) && (
        <header className={cn('card__header', accent && 'card__header--accent')}>
          {title && <h2 className="card__title">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn('card__body', flush && 'card__body--flush')}>{children}</div>
    </section>
  );
}
