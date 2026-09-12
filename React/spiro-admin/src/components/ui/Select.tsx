/**
 * Select — a custom dropdown with real keyboard support.
 *
 * A native <select> cannot be styled to match this design, so this is a
 * listbox built from scratch. The keyboard contract is the part people skip:
 * ArrowUp/Down move, Home/End jump, Enter/Space select, Escape closes, and
 * typing jumps to a matching option.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Icon } from './Icon';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'primary';
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder = 'Select…',
  className,
  variant = 'default',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef({ query: '', at: 0 });

  const listboxId = useId();
  const selected = options.find((o) => o.value === value);

  useOnClickOutside(rootRef, () => setOpen(false), open);

  // Opening should land the highlight on the current value, not the top.
  useEffect(() => {
    if (!open) return;
    const index = options.findIndex((o) => o.value === value);
    setActiveIndex(index === -1 ? 0 : index);
  }, [open, options, value]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: 'nearest',
    });
  }, [open, activeIndex]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      onChange(option.value);
      setOpen(false);
    },
    [options, onChange]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) return setOpen(true);
        return setActiveIndex((i) => Math.min(options.length - 1, i + 1));

      case 'ArrowUp':
        event.preventDefault();
        if (!open) return setOpen(true);
        return setActiveIndex((i) => Math.max(0, i - 1));

      case 'Home':
        if (!open) return;
        event.preventDefault();
        return setActiveIndex(0);

      case 'End':
        if (!open) return;
        event.preventDefault();
        return setActiveIndex(options.length - 1);

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) return setOpen(true);
        return commit(activeIndex);

      case 'Escape':
        return setOpen(false);

      case 'Tab':
        return setOpen(false);

      default: {
        // Typeahead: consecutive keystrokes within 600ms build a query.
        if (event.key.length !== 1) return;

        const now = Date.now();
        const state = typeaheadRef.current;
        state.query = now - state.at < 600 ? state.query + event.key : event.key;
        state.at = now;

        const match = options.findIndex((o) =>
          o.label.toLowerCase().startsWith(state.query.toLowerCase())
        );
        if (match !== -1) {
          setOpen(true);
          setActiveIndex(match);
        }
      }
    }
  };

  return (
    <div className={cn('select', className)} ref={rootRef}>
      {label && <span className="field__label">{label}</span>}

      <button
        type="button"
        className="select__trigger"
        style={
          variant === 'primary'
            ? { background: 'var(--blue-500)', color: 'var(--text-inverse)', borderColor: 'var(--blue-500)', fontWeight: 600, justifyContent: 'center' }
            : undefined
        }
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span>{selected?.label ?? placeholder}</span>
        <Icon name="chevron-down" size={16} className="select__chevron" />
      </button>

      {open && (
        <div className="select__menu" role="listbox" id={listboxId} ref={listRef}>
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              role="option"
              className="select__option"
              aria-selected={option.value === value}
              data-active={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              {option.label}
              {option.value === value && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
