Here is a production-ready, highly accessible **Autocomplete / Typeahead component** built in React. It satisfies core frontend system design requirements: **Debounced API integration**, **WAI-ARIA accessibility guidelines (Combobox pattern)**, **Keyboard navigation**, and **Race-condition handling**.

---

### `Autocomplete.jsx`

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Autocomplete.css';

export default function Autocomplete({ 
  placeholder = "Search...", 
  delay = 300, 
  minChars = 2 
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState(null);

  const listboxRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // 1. Debounced API Fetching with AbortController (Race-condition & Cleanup prevention)
  useEffect(() => {
    if (query.trim().length < minChars) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        // Replace with your endpoint (e.g., https://api.example.com/search?q=${query})
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Something went wrong. Please try again.');
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort(); // Cancels previous pending request (prevents race conditions)
    };
  }, [query, delay, minChars]);

  // 2. Click Outside to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Keyboard Navigation Handler (Accessibility standard)
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && suggestions.length > 0) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name); // Adjust based on your API response structure
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const activeDescendantId = highlightedIndex >= 0 ? `suggestion-item-${highlightedIndex}` : undefined;

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          // Accessibility Attributes (WAI-ARIA Combobox)
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={activeDescendantId}
          aria-haspopup="listbox"
        />
        {isLoading && <span className="loader-spinner" aria-hidden="true">⏳</span>}
      </div>

      {/* Screen Reader Live Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? "Loading suggestions..." : `${suggestions.length} results available.`}
      </div>

      {isOpen && (
        <ul 
          ref={listboxRef}
          id="autocomplete-listbox" 
          role="listbox" 
          className="suggestions-list"
        >
          {error && <li className="suggestion-error">{error}</li>}
          
          {!error && suggestions.length === 0 && !isLoading && (
            <li className="no-results">No matches found</li>
          )}

          {!error && suggestions.map((item, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={item.id || index}
                id={`suggestion-item-${index}`}
                role="option"
                aria-selected={isHighlighted}
                className={`suggestion-item ${isHighlighted ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(item)}
              >
                {item.name}
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

### `Autocomplete.css`

```css
.autocomplete-wrapper {
  position: relative;
  width: 320px;
  font-family: sans-serif;
}

.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.autocomplete-wrapper input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
}

.autocomplete-wrapper input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.loader-spinner {
  position: absolute;
  right: 12px;
  font-size: 14px;
  pointer-events: none;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
}

.suggestion-item {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
}

.suggestion-item.highlighted,
.suggestion-item:hover {
  background-color: #f0f4f8;
  color: #0066cc;
}

.no-results, .suggestion-error {
  padding: 10px 14px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

/* Hidden visual helper for Screen Readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

```

---

### Core Engineering Highlights

1. **Debounce Optimization**: Prevents firing requests on every keystroke using native `setTimeout`.
2. **Race-Condition & Stale State Defense (`AbortController`)**: Cancels any unresolved, outdated API requests if a user types a new character before the previous fetch resolves.
3. **Accessibility (WAI-ARIA Combobox Pattern)**:

* Uses `role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`, and `aria-controls`.
* Dynamic active descendant tracking via `aria-activedescendant` allows screen readers to natively read the focused keyboard option.
* Includes an `aria-live="polite"` region to announce state updates (e.g., results count) automatically.

1. **Full Keyboard Control**: Arrow Up/Down to navigate items, Enter to select the highlighted row, and Escape to dismiss the menu.
