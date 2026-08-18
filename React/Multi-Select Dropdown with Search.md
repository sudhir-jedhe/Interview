Here is a fully accessible, reusable **Multi-Select Dropdown with Search** in React and TypeScript. It includes keyboard navigation, outside-click detection, tag removals, and "Select All" support.

---

### 1. The Multi-Select Component (`MultiSelectDropdown.tsx`)

```tsx
import React, { useState, useRef, useEffect, useMemo, useId } from 'react';

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
  options: Option[];
  value: (string | number)[];
  onChange: (selectedValues: (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  maxDisplayTags?: number;
  showSelectAll?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
  maxDisplayTags = 3,
  showSelectAll = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  // Filter available options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  }, [options, searchTerm]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Scroll active item into view during keyboard navigation
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const toggleOption = (optionValue: string | number) => {
    const nextValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(nextValue);
  };

  const removeTag = (e: React.MouseEvent, valToRemove: string | number) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== valToRemove));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const toggleSelectAll = () => {
    const enabledFiltered = filteredOptions.filter((opt) => !opt.disabled);
    const allSelected = enabledFiltered.every((opt) => value.includes(opt.value));

    if (allSelected) {
      const unselectedValues = new Set(enabledFiltered.map((opt) => opt.value));
      onChange(value.filter((v) => !unselectedValues.has(v)));
    } else {
      const merged = new Set([...value, ...enabledFiltered.map((opt) => opt.value)]);
      onChange(Array.from(merged));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const item = filteredOptions[highlightedIndex];
          if (!item.disabled) toggleOption(item.value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Label lookups for tags
  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => ({ value: v, label: map.get(v) || String(v) }));
  }, [options, value]);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      style={{ position: 'relative', width: '100%', maxWidth: '420px', fontFamily: 'sans-serif' }}
    >
      {/* Control Box / Trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          minHeight: '42px',
          padding: '6px 10px',
          border: `1px solid ${isOpen ? '#2563eb' : '#d1d5db'}`,
          borderRadius: '6px',
          backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
          {selectedLabels.length === 0 ? (
            <span style={{ color: '#9ca3af', userSelect: 'none' }}>{placeholder}</span>
          ) : (
            <>
              {selectedLabels.slice(0, maxDisplayTags).map((item) => (
                <span
                  key={item.value}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={(e) => removeTag(e, item.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '14px',
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {selectedLabels.length > maxDisplayTags && (
                <span
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    alignSelf: 'center',
                  }}
                >
                  +{selectedLabels.length - maxDisplayTags} more
                </span>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={clearAll}
              title="Clear all"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '16px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          )}
          <span style={{ color: '#6b7280', fontSize: '10px', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
            ▼
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Search Bar */}
          <div style={{ padding: '8px', borderBottom: '1px solid #f3f4f6' }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Select All Action */}
          {showSelectAll && filteredOptions.length > 0 && (
            <div
              onClick={toggleSelectAll}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {filteredOptions.every((opt) => value.includes(opt.value)) ? 'Deselect All' : 'Select All'}
            </div>
          )}

          {/* Options List */}
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              margin: 0,
              padding: '4px 0',
              listStyle: 'none',
            }}
          >
            {filteredOptions.length === 0 ? (
              <li style={{ padding: '10px 12px', color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = value.includes(opt.value);
                const isHighlighted = highlightedIndex === idx;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onClick={() => !opt.disabled && toggleOption(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      backgroundColor: isHighlighted
                        ? '#f3f4f6'
                        : isSelected
                        ? '#f0fdf4'
                        : 'transparent',
                      color: opt.disabled ? '#9ca3af' : '#1f2937',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={opt.disabled}
                      readOnly
                      style={{ cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
                    />
                    <span style={{ flex: 1 }}>{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

```

---

### 2. Usage Example (`App.tsx`)

```tsx
import React, { useState } from 'react';
import { MultiSelectDropdown, Option } from './MultiSelectDropdown';

const FRAMEWORKS: Option[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'next' },
  { label: 'Remix', value: 'remix' },
  { label: 'Ember.js (Legacy)', value: 'ember', disabled: true },
];

export default function App() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<(string | number)[]>(['react', 'next']);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Tech Stack Selector</h2>
      
      <MultiSelectDropdown
        options={FRAMEWORKS}
        value={selectedFrameworks}
        onChange={setSelectedFrameworks}
        placeholder="Select frameworks..."
        maxDisplayTags={2}
      />

      <p style={{ fontSize: '14px', color: '#4b5563' }}>
        Selected IDs: <strong>{JSON.stringify(selectedFrameworks)}</strong>
      </p>
    </div>
  );
}

```

---

### Key Architectural Highlights

* **Accessible ARIA Patterns:** Implements `role="combobox"` and `role="listbox"` with `aria-multiselectable`, `aria-expanded`, and `aria-selected` attributes.
* **Full Keyboard Support:** `ArrowUp`/`ArrowDown` navigates options, `Enter` toggles selection, and `Escape` closes the menu.
* **Auto-Scrolling:** Scrolls active list items smoothly into view using `scrollIntoView({ block: 'nearest' })`.
* **Zero Extra Dependencies:** Operates using native HTML and React state hooks without requiring external UI libraries.
