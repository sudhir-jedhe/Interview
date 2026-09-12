/**
 * Global search — debounced, keyboard-driven, cancels stale requests.
 *
 * The two things that make search feel broken if you skip them:
 *   - DEBOUNCE, or you fire a request per keystroke
 *   - ABORT + ignore stale, or a slow early response overwrites a fast later
 *     one and the list disagrees with the box (useAsync handles both)
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { globalSearch, type SearchHit } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Icon } from '@/components/ui/Icon';

export function GlobalSearch() {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debounced = useDebounce(term, 250);

  const { data: hits, isFetching } = useAsync<SearchHit[]>(
    ({ signal }) => globalSearch(debounced, signal),
    [debounced],
    { enabled: debounced.trim().length >= 2, initialData: [] }
  );

  useOnClickOutside(rootRef, () => setOpen(false), open);

  // Cmd/Ctrl-K focuses search from anywhere — the expected shortcut.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = hits ?? [];

  useEffect(() => setActiveIndex(0), [debounced]);

  const go = (hit: SearchHit) => {
    navigate(hit.href);
    setOpen(false);
    setTerm('');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]!);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const vehicles = results.filter((r) => r.type === 'vehicle');
  const batteries = results.filter((r) => r.type === 'battery');

  return (
    <div className="topbar__search" ref={rootRef}>
      <div className="input-wrap">
        <span className="input-wrap__icon">
          <Icon name="search" size={16} />
        </span>

        <input
          ref={inputRef}
          className="input input--with-icon input--round"
          placeholder="Search vehicles, batteries, IMEI…"
          value={term}
          role="combobox"
          aria-expanded={open}
          aria-controls="global-search-results"
          aria-label="Global search"
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {term ? (
          <button className="input-wrap__clear" onClick={() => setTerm('')} aria-label="Clear search">
            <Icon name="close" size={14} />
          </button>
        ) : (
          <span
            style={{ position: 'absolute', right: 10, opacity: 0.6, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <kbd>⌘K</kbd>
          </span>
        )}
      </div>

      {open && term.trim().length > 0 && (
        <div className="gsearch__results" id="global-search-results" role="listbox">
          {term.trim().length < 2 ? (
            <div className="gsearch__hint">Keep typing…</div>
          ) : isFetching && results.length === 0 ? (
            <div className="gsearch__hint">Searching…</div>
          ) : results.length === 0 ? (
            <div className="gsearch__hint">No matches for “{term}”</div>
          ) : (
            <>
              {vehicles.length > 0 && <div className="gsearch__group">Vehicles</div>}
              {vehicles.map((hit) => (
                <Row
                  key={hit.id}
                  hit={hit}
                  active={results.indexOf(hit) === activeIndex}
                  onSelect={() => go(hit)}
                />
              ))}

              {batteries.length > 0 && <div className="gsearch__group">Batteries</div>}
              {batteries.map((hit) => (
                <Row
                  key={hit.id}
                  hit={hit}
                  active={results.indexOf(hit) === activeIndex}
                  onSelect={() => go(hit)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ hit, active, onSelect }: { hit: SearchHit; active: boolean; onSelect: () => void }) {
  return (
    <button className="gsearch__item" role="option" aria-selected={active} data-active={active} onClick={onSelect}>
      <Icon name={hit.type === 'vehicle' ? 'scooter' : 'battery'} size={17} />
      <span style={{ flex: 1 }}>
        <strong style={{ display: 'block' }}>{hit.label}</strong>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{hit.sublabel}</span>
      </span>
      <Icon name="chevron-right" size={15} />
    </button>
  );
}
