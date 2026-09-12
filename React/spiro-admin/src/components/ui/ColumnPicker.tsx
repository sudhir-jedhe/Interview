/**
 * Column preferences.
 *
 * Which columns a person wants is a preference, not application state, so it
 * persists per table (see `useTable`'s `tableId`) and survives navigation and
 * reload. Nine columns is right for an analyst and four is right for a
 * dispatcher, and neither should have to re-hide the other's five every time
 * they open the page.
 *
 * Hidden columns are excluded from the EXPORT too, wherever a page passes
 * `visibleColumns` to its export rows — what you see is what you get is the
 * whole point of letting you choose.
 */

import { useRef, useState } from 'react';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Icon } from './Icon';
import type { Column } from './Table';

interface Props<T> {
  columns: Column<T>[];
  hidden: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onShowAll: () => void;
}

export function ColumnPicker<T>({ columns, hidden, onToggle, onShowAll }: Props<T>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapRef, () => setOpen(false), open);

  // A column with no heading is a control column (checkboxes, row actions);
  // offering to hide it is offering to break the table.
  const choices = columns.filter((c) => !c.alwaysVisible && c.header.trim() !== '');
  const hiddenCount = choices.filter((c) => hidden.has(c.key)).length;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn--secondary btn--sm"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="layers" size={15} />
        Columns
        {hiddenCount > 0 && <span className="pill" style={{ padding: '0 6px' }}>{choices.length - hiddenCount}/{choices.length}</span>}
        <Icon name="chevron-down" size={13} />
      </button>

      {open && (
        <div className="select__menu column-picker" role="menu">
          <div className="column-picker__head">
            <strong>Show columns</strong>
            <button type="button" className="btn btn--ghost btn--sm" onClick={onShowAll}>
              Show all
            </button>
          </div>

          <div className="column-picker__list">
            {choices.map((column) => {
              const visible = !hidden.has(column.key);
              const lastVisible = visible && choices.length - hiddenCount === 1;

              return (
                <label key={column.key} className="column-picker__row">
                  <input
                    type="checkbox"
                    checked={visible}
                    // Hiding the last column leaves an empty table with no way
                    // back except the menu you just emptied.
                    disabled={lastVisible}
                    onChange={() => onToggle(column.key)}
                  />
                  <span>{column.header}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
