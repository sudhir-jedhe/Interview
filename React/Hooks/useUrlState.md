Creating a custom hook like `useUrlState()` simplifies reading and updating query parameters by providing an API similar to standard `useState`, but bound directly to React Router’s `useSearchParams`.

---

### Implementation: The `useUrlState` Custom Hook

This hook handles reading values, casting types (strings, numbers, booleans), updating parameters cleanly, and deleting empty values from the URL.

```javascript
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom Hook: Syncs component state with URL search params
 * 
 * @param {string} key - The query string key (e.g. 'q', 'page')
 * @param {any} defaultValue - Fallback value if key is missing from URL
 * @param {Object} options - Options (e.g., type casting, debounce)
 */
export function useUrlState(key, defaultValue = '', { type = 'string', debounceMs = 0 } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to parse values from URL strings based on target type
  const parseValue = useCallback((rawValue) => {
    if (rawValue === null || rawValue === undefined) return defaultValue;
    switch (type) {
      case 'number': {
        const parsed = Number(rawValue);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      case 'boolean':
        return rawValue === 'true';
      default:
        return rawValue;
    }
  }, [defaultValue, type]);

  // Read current value from URL
  const urlValue = parseValue(searchParams.get(key));

  // Local state for smooth typing/debouncing
  const [internalValue, setInternalValue] = useState(urlValue);

  // Sync internal state when URL changes externally (e.g., Back/Forward buttons)
  useEffect(() => {
    setInternalValue(urlValue);
  }, [urlValue]);

  // Update URL search parameters
  const updateUrl = useCallback((newValue) => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      const valueToSet = typeof newValue === 'function' ? newValue(parseValue(nextParams.get(key))) : newValue;

      // Clean up empty, null, or default values from URL string
      if (valueToSet === '' || valueToSet === null || valueToSet === undefined || valueToSet === defaultValue) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(valueToSet));
      }

      return nextParams;
    });
  }, [key, defaultValue, setSearchParams, parseValue]);

  // Handle debounced updates if debounceMs is configured
  useEffect(() => {
    if (!debounceMs) return;

    const timer = setTimeout(() => {
      if (internalValue !== urlValue) {
        updateUrl(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, urlValue, updateUrl, debounceMs]);

  // Setter function returning standard setState behavior or debounced local updates
  const setValue = useCallback((val) => {
    if (debounceMs) {
      setInternalValue(val);
    } else {
      setInternalValue(val);
      updateUrl(val);
    }
  }, [debounceMs, updateUrl]);

  return [internalValue, setValue];
}

```

---

### Usage Example in Components

Notice how `useUrlState` abstracts away `URLSearchParams` operations into familiar `[value, setValue]` tuples:

```jsx
import React from 'react';
import { useUrlState } from './useUrlState';

export function FilterControls() {
  // 1. Debounced string search param: ?q=...
  const [query, setQuery] = useUrlState('q', '', { debounceMs: 400 });

  // 2. Numeric page param: ?page=...
  const [page, setPage] = useUrlState('page', 1, { type: 'number' });

  // 3. Numeric limit param: ?limit=...
  const [limit, setLimit] = useUrlState('limit', 5, { type: 'number' });

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset page to 1 when typing a new search
  };

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleQueryChange}
      />

      {/* Limit Selector */}
      <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </select>

      {/* Page Navigation */}
      <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
        Prev Page
      </button>
      <span>Current Page: {page}</span>
      <button onClick={() => setPage((p) => p + 1)}>
        Next Page
      </button>
    </div>
  );
}

```

---

### Key Capabilities

1. **Automatic Type Casting**: Encapsulates string-to-number or string-to-boolean conversions safely with fallbacks.
2. **Clean URL Generation**: Automatically strips keys when their values match the `defaultValue` or are empty (`""`/`null`), preventing noisy URLs like `?q=&page=1&limit=5`.
3. **Built-in Debouncing**: Specifying `{ debounceMs: 400 }` holds back URL updates until user typing stops while maintaining responsive local input UI.
4. **Browser History Native**: Reacts instantly to browser **Back** and **Forward** button events.

To support arrays in `useUrlState`, we can update the hook to handle comma-separated values (or multiple query parameters) in the URL string, parse them into Javascript arrays on read, and format arrays back into URL strings on write.

Here is the updated `useUrlState` hook with **array support**, type casting, and automatic cleaning.

---

### Refactored Hook with Array Support

```javascript
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom Hook: Syncs component state with URL search params (Supports Arrays)
 * 
 * @param {string} key - The query string key (e.g. 'category', 'tags')
 * @param {any} defaultValue - Fallback value if missing from URL
 * @param {Object} options - Config options ({ type: 'string'|'number'|'boolean'|'array', arraySeparator: ',' })
 */
export function useUrlState(key, defaultValue = '', { type = 'string', arraySeparator = ',', debounceMs = 0 } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper: Parses raw string from URL into typed value or array
  const parseValue = useCallback((rawValue) => {
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return defaultValue;
    }

    if (type === 'array') {
      // Split comma-separated string into an array and strip empty whitespace
      const items = rawValue.split(arraySeparator).map((item) => item.trim()).filter(Boolean);
      return items.length > 0 ? items : defaultValue;
    }

    switch (type) {
      case 'number': {
        const parsed = Number(rawValue);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      case 'boolean':
        return rawValue === 'true';
      default:
        return rawValue;
    }
  }, [defaultValue, type, arraySeparator]);

  // Read value from URL
  const urlValue = parseValue(searchParams.get(key));

  // Local state for debouncing / immediate UI updates
  const [internalValue, setInternalValue] = useState(urlValue);

  // Sync internal state when URL changes externally (e.g. Back/Forward buttons)
  useEffect(() => {
    setInternalValue(urlValue);
  }, [JSON.stringify(urlValue)]); // Stringify keeps array equality checks stable

  // Helper: Formats typed value/array back into string for URL
  const formatValueForUrl = useCallback((val) => {
    if (Array.isArray(val)) {
      return val.filter(Boolean).join(arraySeparator);
    }
    return String(val);
  }, [arraySeparator]);

  // Update URL Search Params
  const updateUrl = useCallback((newValue) => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      const rawResolved = typeof newValue === 'function' 
        ? newValue(parseValue(nextParams.get(key))) 
        : newValue;

      const formatted = formatValueForUrl(rawResolved);

      // Clean empty strings, empty arrays, or matching default values from URL
      const isEmptyArray = Array.isArray(rawResolved) && rawResolved.length === 0;
      const isDefault = JSON.stringify(rawResolved) === JSON.stringify(defaultValue);

      if (!formatted || isEmptyArray || isDefault) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, formatted);
      }

      return nextParams;
    });
  }, [key, defaultValue, setSearchParams, parseValue, formatValueForUrl]);

  // Debounce handler
  useEffect(() => {
    if (!debounceMs) return;

    const timer = setTimeout(() => {
      if (JSON.stringify(internalValue) !== JSON.stringify(urlValue)) {
        updateUrl(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, urlValue, updateUrl, debounceMs]);

  // Setter wrapper
  const setValue = useCallback((val) => {
    setInternalValue(val);
    if (!debounceMs) {
      updateUrl(val);
    }
  }, [debounceMs, updateUrl]);

  return [internalValue, setValue];
}

```

---

### How to Use for Multi-Select Checkboxes / Categories

Using the updated hook for array state allows you to add or remove categories seamlessly:

```jsx
import React from 'react';
import { useUrlState } from './useUrlState';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Finance'];

export function CategoryFilter() {
  // Sync category array with URL: ?category=Work,Personal
  const [selectedCategories, setSelectedCategories] = useUrlState('category', [], {
    type: 'array',
  });

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev = []) => {
      if (prev.includes(cat)) {
        // Remove item if already selected
        return prev.filter((item) => item !== cat);
      } else {
        // Add item if not selected
        return [...prev, cat];
      }
    });
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4>Filter by Category</h4>
      <div style={{ display: 'flex', gap: '12px' }}>
        {CATEGORIES.map((cat) => {
          const isChecked = selectedCategories.includes(cat);
          return (
            <label key={cat} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggleCategory(cat)}
              />
              {cat}
            </label>
          );
        })}
      </div>

      <p>
        <strong>Selected in URL:</strong>{' '}
        {selectedCategories.length ? selectedCategories.join(', ') : 'None (All)'}
      </p>
    </div>
  );
}

```

---

### What Changed?

1. **Array Parsing (`type: 'array'`)**: Converts `?category=Work,Personal` into `['Work', 'Personal']`.
2. **Value Formatting**: Converts array inputs `['Work', 'Personal']` into string format `Work,Personal` when writing to URL params.
3. **Array Clean-up**: Automatically deletes the parameter key from the URL when all checkboxes are unselected (`[]`), keeping URLs clean (`?category=` is removed).
4. **Stable State Syncing**: Uses `JSON.stringify()` inside `useEffect` dependencies so array references don't cause infinite re-render loops.
