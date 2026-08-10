Designing an **Accessible Autocomplete Search Bar** (Combobox) requires balancing **performance**, **keyboard navigation**, **asynchronous data fetching**, and **WAI-ARIA compliance** (W3C Combobox Pattern).

Without proper Low-Level Design (LLD), autocomplete widgets often suffer from race conditions, memory leaks, high API call frequencies, and complete unusability for screen-reader users.

---

## 1. High-Level Requirements & WAI-ARIA Specifications

### Functional Requirements

1. **Debounced Network Requests:** Delay API calls until the user stops typing for a configurable duration (e.g., 300ms).
2. **Race Condition Prevention:** Cancel stale in-flight requests when a new query is typed (`AbortController`).
3. **Full Keyboard Navigation:**

* `ArrowDown` / `ArrowUp`: Move focus through suggestions.
* `Enter`: Select highlighted option.
* `Escape`: Close dropdown and clear selection focus.
* `Home` / `End`: Jump to first/last suggestion.

1. **Active Selection Display:** Sync selection back to input or trigger an `onSelect` callback.

### WAI-ARIA Accessibility Requirements

To conform to the **W3C ARIA 1.2 Combobox Pattern**:

* **`role="combobox"`** on the input container or input element.
* **`aria-expanded="true|false"`**: Indicates if the suggestions popup is open.
* **`aria-haspopup="listbox"`**: Informs screen readers that the popup is a list of options.
* **`aria-autocomplete="list"`**: Indicates that suggestions filter dynamically.
* **`aria-controls="listbox-id"`**: Links input to the options list container.
* **`aria-activedescendant="option-id"`**: Tells screen readers which option is currently highlighted without physically moving DOM focus away from the input element.
* **`role="listbox"`** on the suggestions container and **`role="option"`** on each list item.

---

## 2. Low-Level API & Component Interface

```typescript
// Autocomplete.types.ts
import { ReactNode } from 'react';

export interface AutocompleteOption {
  id: string | number;
  label: string;
  [key: string]: any;
}

export interface AutocompleteProps<T extends AutocompleteOption> {
  fetchOptions: (query: string, signal: AbortSignal) => Promise<T[]>;
  onSelect: (option: T | null) => void;
  placeholder?: string;
  debounceTime?: number;
  minChars?: number;
  renderOption?: (option: T, isHighlighted: boolean) => ReactNode;
}

```

---

## 3. Custom Hooks for Isolation of Concerns

To keep code modular, we separate **debouncing** and **fetching with cancellation** into custom hooks.

### Custom Hook 1: `useDebounce`

```typescript
// useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

```

### Custom Hook 2: `useAutocompleteFetch` (Prevents Race Conditions)

```typescript
// useAutocompleteFetch.ts
import { useState, useEffect, useRef } from 'react';
import { AutocompleteOption } from './Autocomplete.types';

export function useAutocompleteFetch<T extends AutocompleteOption>(
  query: string,
  fetchOptions: (query: string, signal: AbortSignal) => Promise<T[]>,
  minChars: number
) {
  const [options, setOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Track active AbortController across renders
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length < minChars) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    // Abort previous in-flight request if user kept typing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetchOptions(query, controller.signal)
      .then((data) => {
        setOptions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [query, fetchOptions, minChars]);

  return { options, isLoading, error };
}

```

---

## 4. Production-Ready Accessible Component Implementation

```tsx
// Autocomplete.tsx
import React, { useState, useRef, useId, KeyboardEvent, ChangeEvent } from 'react';
import { AutocompleteProps, AutocompleteOption } from './Autocomplete.types';
import { useDebounce } from './useDebounce';
import { useAutocompleteFetch } from './useAutocompleteFetch';

export function Autocomplete<T extends AutocompleteOption>({
  fetchOptions,
  onSelect,
  placeholder = 'Search...',
  debounceTime = 300,
  minChars = 1,
  renderOption,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Generate unique DOM IDs for ARIA linkage
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputId = `${baseId}-input`;

  const debouncedQuery = useDebounce(inputValue, debounceTime);
  const { options, isLoading, error } = useAutocompleteFetch(
    debouncedQuery,
    fetchOptions,
    minChars
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Open dropdown when valid options exist
  const showDropdown = isOpen && (options.length > 0 || isLoading || !!error);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1); // Reset highlight when typing
  };

  const handleSelectOption = (option: T) => {
    setInputValue(option.label);
    onSelect(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && e.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelectOption(options[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      case 'Home':
        if (isOpen && options.length > 0) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;

      case 'End':
        if (isOpen && options.length > 0) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
    }
  };

  // Close dropdown on outside click
  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const activeOptionId =
    highlightedIndex >= 0 && options[highlightedIndex]
      ? `${baseId}-option-${options[highlightedIndex].id}`
      : undefined;

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      style={{ position: 'relative', width: '100%', maxWidth: '400px' }}
    >
      {/* Search Input */}
      <input
        id={inputId}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        // ARIA Attributes
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        style={{
          width: '100%',
          padding: '10px 14px',
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      {/* Visually Hidden Live Region for Screen Readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? 'Loading suggestions...'
          : options.length > 0
          ? `${options.length} suggestions available.`
          : ''}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search Suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: '4px 0 0 0',
            padding: 0,
            listStyle: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isLoading && (
            <li style={{ padding: '10px', color: '#666' }}>Loading...</li>
          )}

          {error && (
            <li style={{ padding: '10px', color: 'red' }}>
              Failed to load suggestions.
            </li>
          )}

          {!isLoading && !error && options.length === 0 && (
            <li style={{ padding: '10px', color: '#666' }}>No results found.</li>
          )}

          {!isLoading &&
            options.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const optionId = `${baseId}-option-${option.id}`;

              return (
                <li
                  key={option.id}
                  id={optionId}
                  role="option"
                  aria-selected={isHighlighted}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    backgroundColor: isHighlighted ? '#e2e8f0' : 'transparent',
                  }}
                >
                  {renderOption
                    ? renderOption(option, isHighlighted)
                    : option.label}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

```

---

## 5. Usage Example

```tsx
// App.tsx
import React from 'react';
import { Autocomplete } from './Autocomplete';

interface MovieOption {
  id: number;
  label: string;
  year: number;
}

// Mock API Call
const fetchMovies = async (query: string, signal: AbortSignal): Promise<MovieOption[]> => {
  const response = await fetch(
    `https://demo-api.example.com/movies?q=${encodeURIComponent(query)}`,
    { signal }
  );
  return response.json();
};

export default function App() {
  return (
    <div style={{ padding: '40px' }}>
      <label htmlFor="movie-search" style={{ display: 'block', marginBottom: '8px' }}>
        Search Movies:
      </label>
      
      <Autocomplete<MovieOption>
        fetchOptions={fetchMovies}
        onSelect={(movie) => console.log('Selected Movie:', movie)}
        placeholder="Type a movie title (e.g. Inception)"
        debounceTime={300}
        minChars={2}
        renderOption={(movie, isHighlighted) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{movie.label}</span>
            <span style={{ color: isHighlighted ? '#333' : '#888' }}>{movie.year}</span>
          </div>
        )}
      />
    </div>
  );
}

```

---

## 6. Crucial Edge Cases & Performance Enhancements

| Challenge                                    | Cause                                                                                            | LLD Solution                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Out-of-Order Responses (Race Conditions)** | Fast typing sends multiple asynchronous requests; an earlier request resolves after a later one. | Use **`AbortController`** inside `useEffect` to abort stale in-flight HTTP requests.                                             |
| **API Spamming**                             | Calling API on every keystroke.                                                                  | Implement **Debouncing** (300ms delay) before firing requests.                                                                   |
| **Focus Loss for Screen Readers**            | Moving focus manually to list options interrupts voiceover reading of the input.                 | Use **`aria-activedescendant`** to keep physical DOM focus on the `<input>` while visually/programmatically pointing to options. |
| **Large Suggestion Lists**                   | Rendering 500+ items inside the dropdown causes layout thrashing.                                | Combine Autocomplete dropdowns with **List Virtualization** (`VirtualList`) if response sets exceed 50 items.                    |
