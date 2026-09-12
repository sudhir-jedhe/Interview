import { cn } from '@/lib/utils/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

/**
 * Tabs with roving focus. Arrow keys move between tabs — the ARIA pattern
 * expects that, and it is what separates real tabs from styled buttons.
 */
export function Tabs<T extends string>({
  value,
  items,
  onChange,
  className,
}: {
  value: T;
  items: readonly TabItem<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;

    event.preventDefault();
    const next = (index + delta + items.length) % items.length;
    onChange(items[next]!.value);
  };

  return (
    <div className={cn('tabs', className)} role="tablist">
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          className="tab"
          aria-selected={item.value === value}
          tabIndex={item.value === value ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, index)}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
