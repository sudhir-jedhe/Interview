Building a custom Accessible Dropdown (Select) component from scratch in React requires handling three core mechanics:

1. **Keyboard Navigation** (ArrowDown, ArrowUp, Enter, Escape, Home, End).
2. **Accessibility Attributes** (`aria-haspopup`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`, `role="option"`).
3. **Outside Interaction** (closing the menu when clicking or focusing away).

---

### Complete Single-File Component

Here is a fully accessible, styled custom dropdown built with pure React hooks and Tailwind CSS:

```jsx
import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const DEFAULT_OPTIONS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
];

export default function CustomDropdown({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  placeholder = 'Select a framework...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  
  const id = useId();
  const listboxId = `dropdown-listbox-${id}`;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset keyboard highlight index when opening/closing
  useEffect(() => {
    if (isOpen) {
      const selectedIdx = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIdx !== -1 ? selectedIdx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, value, options]);

  // Ensure keyboard-highlighted option stays in scroll view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[focusedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (option) => {
    if (onChange) onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // --- KEYBOARD NAVIGATION MACHINE ---
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex]);
        }
        break;

      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-64 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* --- TRIGGER BUTTON --- */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 ? `option-${id}-${focusedIndex}` : undefined
        }
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-800 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </button>

      {/* --- POPOVER LISTBOX --- */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            focusedIndex >= 0 ? `option-${id}-${focusedIndex}` : undefined
          }
          className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 text-sm focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;

            return (
              <li
                key={option.value}
                id={`option-${id}-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`flex items-center justify-between px-3.5 py-2 cursor-pointer select-none transition-colors ${
                  isFocused ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
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

### Usage Example

```jsx
import React, { useState } from 'react';
import CustomDropdown from './CustomDropdown';

export default function App() {
  const [selectedVal, setSelectedVal] = useState('react');

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Favorite Tech Stack
      </label>
      
      <CustomDropdown
        value={selectedVal}
        onChange={setSelectedVal}
        placeholder="Choose framework..."
      />

      <p className="text-xs text-gray-500 font-mono">
        Selected Value: {selectedVal}
      </p>
    </div>
  );
}

```

---

### What Makes This WAI-ARIA Compliant

1. **`aria-activedescendant`**: Tracks which option is visually focused using keyboard arrows without shifting actual browser focus off the trigger button.
2. **`aria-expanded`**: Tells screen readers whether the dropdown menu popover is currently visible.
3. **`scrollIntoView` Integration**: Ensures long option lists stay auto-scrolled to the currently highlighted item as you navigate with arrow keys.

How do I modify this custom dropdown component to support multi-selection with checkboxes?

To convert the custom dropdown into a **Multi-Select Dropdown with Checkboxes**, we need to adjust three core mechanisms:

1. **State Shape**: Change `value` from a single primitive (e.g., `'react'`) to an array (e.g., `['react', 'vue']`).
2. **Toggle Selection**: Clicking or pressing Enter on an item toggles its presence in the array rather than closing the menu.
3. **Trigger Display**: Show a summarized count (e.g., `"3 selected"`) or pills when multiple items are chosen, and include a "Select All / Clear All" utility action in the list.

---

### Complete Multi-Select Component

```jsx
import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

const DEFAULT_OPTIONS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
];

export default function MultiSelectDropdown({
  options = DEFAULT_OPTIONS,
  value = [], // Array of selected values, e.g. ['react', 'vue']
  onChange,
  placeholder = 'Select frameworks...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);

  const id = useId();
  const listboxId = `multiselect-listbox-${id}`;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard scroll into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[focusedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  // Toggle single item selection
  const handleToggleOption = (val) => {
    const isSelected = value.includes(val);
    const updatedValue = isSelected
      ? value.filter((v) => v !== val)
      : [...value, val];

    if (onChange) onChange(updatedValue);
  };

  // Select All / Clear All
  const handleSelectAll = () => {
    if (value.length === options.length) {
      if (onChange) onChange([]);
    } else {
      if (onChange) onChange(options.map((opt) => opt.value));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggleOption(options[focusedIndex].value);
        }
        break;

      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  // Format trigger label text
  const renderTriggerContent = () => {
    if (value.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }

    if (value.length <= 2) {
      const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label)
        .join(', ');
      return <span className="text-gray-900 font-medium truncate">{selectedLabels}</span>;
    }

    return (
      <span className="text-gray-900 font-medium">
        {value.length} selected
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-72 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          {renderTriggerContent()}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Listbox */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          {/* Header Action: Select All / Clear All */}
          <div className="flex justify-between items-center px-3.5 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500">
            <span>{value.length} of {options.length} Selected</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              {value.length === options.length ? 'Clear All' : 'Select All'}
            </button>
          </div>

          {/* Options List */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-56 overflow-y-auto py-1 focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = value.includes(option.value);
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={option.value}
                  id={`option-${id}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggleOption(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                    isFocused ? 'bg-indigo-50/70' : ''
                  }`}
                >
                  {/* Custom Styled Checkbox */}
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Usage Example

```jsx
import React, { useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

export default function App() {
  const [selectedTech, setSelectedTech] = useState(['react', 'next']);

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Filter Technologies
      </label>

      <MultiSelectDropdown
        value={selectedTech}
        onChange={setSelectedTech}
        placeholder="Choose framework..."
      />

      <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600">
        Selected: {JSON.stringify(selectedTech)}
      </div>
    </div>
  );
}

```

How do I add a real-time search filtering input inside the popover menu of this multi-select dropdown?

To add real-time search filtering inside the popover menu of your multi-select dropdown, you need to handle four key additions:

1. **Search Query State**: Track the input value (e.g., `searchTerm`).
2. **Filtered Options Computation**: Derive a `filteredOptions` list on every keystroke.
3. **Auto-Focus Input**: Automatically direct focus to the search input as soon as the popover opens.
4. **Keyboard Index Alignment**: Ensure arrow key navigation (`ArrowDown`, `ArrowUp`, `Enter`) operates on `filteredOptions` instead of the original full options array.

---

### Complete Multi-Select Dropdown with Integrated Search

```jsx
import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

const DEFAULT_OPTIONS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

export default function SearchableMultiSelectDropdown({
  options = DEFAULT_OPTIONS,
  value = [],
  onChange,
  placeholder = 'Select frameworks...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);

  const id = useId();
  const listboxId = `multiselect-listbox-${id}`;

  // 1. FILTERED OPTIONS
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [options, searchTerm]);

  // Close popover when clicking outside & reset search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. AUTO-FOCUS SEARCH INPUT WHEN OPENED
  useEffect(() => {
    if (isOpen) {
      // Short delay ensures popover is mounted before focusing
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      setFocusedIndex(0);
    } else {
      setSearchTerm(''); // Clear search when closed
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Scroll keyboard-highlighted item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[focusedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  // Toggle single option selection
  const handleToggleOption = (val) => {
    const isSelected = value.includes(val);
    const updatedValue = isSelected
      ? value.filter((v) => v !== val)
      : [...value, val];

    if (onChange) onChange(updatedValue);
  };

  // Select All / Clear All (Operates on currently filtered items)
  const handleSelectAllFiltered = () => {
    const filteredValues = filteredOptions.map((opt) => opt.value);
    const allFilteredSelected = filteredValues.every((val) => value.includes(val));

    if (allFilteredSelected) {
      // Remove all currently filtered values
      if (onChange) onChange(value.filter((val) => !filteredValues.includes(val)));
    } else {
      // Merge all currently filtered values with existing state
      const combined = Array.from(new Set([...value, ...filteredValues]));
      if (onChange) onChange(combined);
    }
  };

  // 3. KEYBOARD NAVIGATION
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleToggleOption(filteredOptions[focusedIndex].value);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  const renderTriggerContent = () => {
    if (value.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }

    if (value.length <= 2) {
      const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label)
        .join(', ');
      return <span className="text-gray-900 font-medium truncate">{selectedLabels}</span>;
    }

    return (
      <span className="text-gray-900 font-medium">
        {value.length} selected
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          {renderTriggerContent()}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Listbox */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* SEARCH INPUT HEADER */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(0); // Reset highlight index on typing
                }}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* UTILITY BAR */}
          <div className="flex justify-between items-center px-3.5 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500">
            <span>{value.length} Selected</span>
            {filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-indigo-600 hover:text-indigo-800 transition"
              >
                {filteredOptions.every((opt) => value.includes(opt.value))
                  ? 'Deselect Match'
                  : 'Select Matches'}
              </button>
            )}
          </div>

          {/* OPTIONS LIST */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No matching options found for "{searchTerm}"
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`option-${id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleToggleOption(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                      isFocused ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm ${
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Highlights of This Search Addition

1. **Focus Trap & Input Management**: Opening the popover automatically focuses the search input via `requestAnimationFrame`. When the popover closes, `searchTerm` is cleared so re-opening shows the full list again.
2. **Context-Aware "Select Matches"**: The header action adapts to the active search filter—clicking "Select Matches" selects only the items matching the current search term rather than overwriting un-matched prior selections.
3. **Keyboard Safety**: Arrow navigation and pressing Enter interact strictly with `filteredOptions[focusedIndex]`, preventing hidden items from being toggled unintentionally while searching.

How do I render selected items as interactive pill badges inside the trigger button of this searchable multi-select dropdown?

To render the selected items as interactive, dismissible pill badges directly inside the trigger, we need to adjust three core parts of the dropdown:

1. **Trigger Container Styling**: Change the trigger from a fixed height button to a flexible container (`flex-wrap`) that expands as pills are added.
2. **Pill Badges**: Render each selected item as a pill badge with its own inline × button that stops event propagation (`e.stopPropagation()`) so clicking it removes the item without toggling the main dropdown open/close state.
3. **Pill Limit Counter**: Optionally cap how many pills render directly in the trigger (e.g., show up to 3 pills, then display a `+N more` badge) to prevent the trigger button from becoming excessively tall.

---

### Complete Component with Pill Badges

Here is the updated `SearchableMultiSelectDropdown` component:

```jsx
import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

const DEFAULT_OPTIONS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

export default function PillMultiSelectDropdown({
  options = DEFAULT_OPTIONS,
  value = [],
  onChange,
  placeholder = 'Select frameworks...',
  maxDisplayedPills = 3, // Shows "+N more" badge if exceeded
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);

  const id = useId();
  const listboxId = `pill-multiselect-listbox-${id}`;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [options, searchTerm]);

  // Selected option objects
  const selectedOptions = useMemo(() => {
    return options.filter((opt) => value.includes(opt.value));
  }, [options, value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      setFocusedIndex(0);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[focusedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  // Toggle or remove selection
  const handleToggleOption = (val) => {
    const isSelected = value.includes(val);
    const updatedValue = isSelected
      ? value.filter((v) => v !== val)
      : [...value, val];

    if (onChange) onChange(updatedValue);
  };

  const handleRemovePill = (e, val) => {
    e.stopPropagation(); // Prevents opening/closing the popover
    if (onChange) {
      onChange(value.filter((v) => v !== val));
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (onChange) onChange([]);
  };

  const handleSelectAllFiltered = () => {
    const filteredValues = filteredOptions.map((opt) => opt.value);
    const allFilteredSelected = filteredValues.every((val) => value.includes(val));

    if (allFilteredSelected) {
      if (onChange) onChange(value.filter((val) => !filteredValues.includes(val)));
    } else {
      const combined = Array.from(new Set([...value, ...filteredValues]));
      if (onChange) onChange(combined);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleToggleOption(filteredOptions[focusedIndex].value);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  // Render Pill Badges
  const renderPills = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-400 text-sm">{placeholder}</span>;
    }

    const displayedPills = selectedOptions.slice(0, maxDisplayedPills);
    const hiddenCount = selectedOptions.length - maxDisplayedPills;

    return (
      <div className="flex flex-wrap items-center gap-1.5 py-0.5">
        {displayedPills.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-md group transition-colors hover:bg-indigo-100"
          >
            <span>{option.label}</span>
            <button
              type="button"
              onClick={(e) => handleRemovePill(e, option.value)}
              className="p-0.5 rounded hover:bg-indigo-200/80 text-indigo-500 hover:text-indigo-800 transition"
              title={`Remove ${option.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {hiddenCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 font-medium text-xs rounded-md">
            +{hiddenCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button with Pills */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex-1 overflow-hidden pr-1">
          {renderPills()}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {value.length > 0 && (
            <span
              onClick={handleClearAll}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(0);
                }}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Utility Header */}
          <div className="flex justify-between items-center px-3.5 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500">
            <span>{value.length} Selected</span>
            {filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-indigo-600 hover:text-indigo-800 transition"
              >
                {filteredOptions.every((opt) => value.includes(opt.value))
                  ? 'Deselect Match'
                  : 'Select Matches'}
              </button>
            )}
          </div>

          {/* Options List */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No matching options found for "{searchTerm}"
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`option-${id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleToggleOption(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                      isFocused ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm ${
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Key Technical Details

1. **`e.stopPropagation()` on Dismiss Buttons**: Crucial for embedded controls inside buttons. Without this, clicking the × on a pill badge would trigger the outer `<button onClick>`, causing the popover to toggle unexpectedly.
2. **`min-h-[42px]` Flex Layout**: Replaces fixed `height` with `min-height` so the trigger expands gracefully when pills wrap to multiple lines.
3. **`maxDisplayedPills` Prop**: Keeps the trigger compact by truncating excessive selections into a `+N more` badge. You can adjust or remove this threshold by modifying the prop.

How do I connect this searchable multi-select dropdown to an API endpoint with debounced remote search?

Connecting your searchable multi-select dropdown to an API requires replacing local filtering with an **asynchronous request lifecycle**:

1. **Debounce Engine**: Delay firing network requests (e.g., 300ms) while the user is typing to avoid spamming the backend.
2. **Async State Machine**: Manage `isLoading`, `error`, and `remoteOptions` states cleanly.
3. **Selection Persistence**: Maintain a map or cache of previously selected options so that item badges (pills) stay rendered with their human-readable labels even when the remote search result list changes or empties out.

---

### Custom Debounce Hook (`useDebounce`)

First, create a lightweight debounce hook to delay execution until the user stops typing:

```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

```

---

### Complete Component with Remote API & Debouncing

Here is the updated component. It accepts an `fetchOptions` function (which returns a promise resolving to `{ value, label }[]`) and automatically fetches and debounces search queries.

```jsx
import React, { useState, useRef, useEffect, useId, useMemo, useCallback } from 'react';
import { ChevronDown, Check, X, Search, Loader2 } from 'lucide-react';
import { useDebounce } from './useDebounce'; // Or define inline

export default function AsyncMultiSelectDropdown({
  value = [], // Selected item values (e.g. ['id1', 'id2'])
  onChange,
  fetchOptions, // Async function: (searchQuery, signal) => Promise<Option[]>
  initialSelectedOptions = [], // [{ value: 'id1', label: 'Item 1' }] to render pills before initial search
  placeholder = 'Search & select...',
  debounceMs = 300,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Async states
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Selection Label Cache: Maps values to labels so selected pills remain visible across searches
  const [selectedMap, setSelectedMap] = useState(() => {
    const map = new Map();
    initialSelectedOptions.forEach((opt) => map.set(opt.value, opt.label));
    return map;
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);

  const id = useId();
  const listboxId = `async-multiselect-listbox-${id}`;

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 1. FETCH API DATA WITH DEBOUNCE AND ABORT CONTROLLER
  const loadOptions = useCallback(
    async (query, signal) => {
      if (!fetchOptions) return;
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchOptions(query, signal);
        setOptions(results || []);

        // Update selectedMap cache with any new options returned from server
        setSelectedMap((prev) => {
          const updated = new Map(prev);
          results.forEach((opt) => updated.set(opt.value, opt.label));
          return updated;
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch options:', err);
          setError('Failed to load options');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOptions]
  );

  // Trigger search fetch when popover opens or debounced term changes
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    loadOptions(debouncedSearchTerm, controller.signal);

    return () => {
      controller.abort(); // Cancel pending network request if query changes or dropdown closes
    };
  }, [isOpen, debouncedSearchTerm, loadOptions]);

  // Click Outside & Cleanup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      setFocusedIndex(0);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Handle Option Toggle
  const handleToggleOption = (option) => {
    const isSelected = value.includes(option.value);
    const updatedValue = isSelected
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    // Ensure item label is cached
    setSelectedMap((prev) => new Map(prev).set(option.value, option.label));

    if (onChange) onChange(updatedValue);
  };

  const handleRemovePill = (e, val) => {
    e.stopPropagation();
    if (onChange) onChange(value.filter((v) => v !== val));
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggleOption(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button with Cached Pill Badges */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 py-0.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-md"
              >
                <span>{selectedMap.get(val) || val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemovePill(e, val)}
                  className="p-0.5 rounded hover:bg-indigo-200 text-indigo-500 hover:text-indigo-800 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search remote API..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Options List */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {error ? (
              <li className="px-3.5 py-3 text-center text-red-500 text-xs">{error}</li>
            ) : isLoading && options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">Loading options...</li>
            ) : options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No results found for "{debouncedSearchTerm}"
              </li>
            ) : (
              options.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`option-${id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleToggleOption(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                      isFocused ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm ${
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Usage with Real REST API (Fetch / Axios)

Pass an asynchronous function that handles fetching and mapping remote objects to `{ value, label }`:

```jsx
import React, { useState } from 'react';
import AsyncMultiSelectDropdown from './AsyncMultiSelectDropdown';

export default function App() {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Async search function connected to GitHub Users API (or your backend REST endpoint)
  const fetchUsersFromApi = async (query, signal) => {
    if (!query) return [];

    const response = await fetch(`https://api.github.com/search/users?q=${query}&per_page=10`, {
      signal,
    });
    
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    
    // Map API data to standard dropdown schema
    return data.items.map((user) => ({
      value: String(user.id),
      label: user.login,
    }));
  };

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Assign GitHub Users
      </label>

      <AsyncMultiSelectDropdown
        value={selectedUserIds}
        onChange={setSelectedUserIds}
        fetchOptions={fetchUsersFromApi}
        placeholder="Type to search users..."
      />

      <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600">
        Selected IDs: {JSON.stringify(selectedUserIds)}
      </div>
    </div>
  );
}

```

---

### Why This Architecture Works

1. **`AbortController` Cancellation**: Rapidly typing triggers multiple network calls. Passing `controller.signal` automatically cancels stale HTTP requests, preventing race conditions where older requests complete after newer ones.
2. **`selectedMap` Cache**: When searching for "Alex" and selecting an option, then clearing search to type "Bob", the value array stores the ID, but `selectedMap` holds onto `"Alex"` so the badge pill still displays the text label correctly.

How do I add infinite scroll pagination to remote search results inside this async dropdown component?

To add infinite scroll pagination to your `AsyncMultiSelectDropdown`, you need to handle three key additions:

1. **Paginated Async State**: Track the current page (`page`) and whether more pages are available on the backend (`hasMore`).
2. **Infinite Scroll Observer**: Use an `IntersectionObserver` attached to a sentinel element (or a scroll event listener) at the bottom of the options list to trigger loading the next page when the user scrolls near the end.
3. **Array Concatenation**: Append incoming page results to existing options instead of overwriting them.

---

### Key Architectural Updates

```
Scrolls to bottom ──> Sentinel intersecting ──> Trigger loadMore() ──> Append page data to list

```

---

### Refactored Component with Infinite Scroll

Here is the updated component. It expects `fetchOptions` to accept `(query, page, signal)` and return `{ options: Option[], hasMore: boolean }` (or an array, which we can handle cleanly).

```jsx
import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown, Check, X, Search, Loader2 } from 'lucide-react';
import { useDebounce } from './useDebounce';

export default function InfiniteAsyncMultiSelectDropdown({
  value = [],
  onChange,
  fetchOptions, // Signature: async (query, page, signal) => { options, hasMore }
  initialSelectedOptions = [],
  placeholder = 'Search & select...',
  debounceMs = 300,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Async & Pagination States
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  // Selection Label Cache
  const [selectedMap, setSelectedMap] = useState(() => {
    const map = new Map();
    initialSelectedOptions.forEach((opt) => map.set(opt.value, opt.label));
    return map;
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);
  const sentinelRef = useRef(null); // Infinite scroll sentinel target

  const id = useId();
  const listboxId = `infinite-multiselect-listbox-${id}`;
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 1. FETCH OPTIONS FUNCTION (Handles Page 1 vs. Subsequent Pages)
  const loadOptions = useCallback(
    async (query, pageNum, signal) => {
      if (!fetchOptions) return;

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        // Fetch paginated data
        const res = await fetchOptions(query, pageNum, signal);
        
        // Normalize response shape: supports both { options: [], hasMore: bool } and raw arrays
        const newOptions = Array.isArray(res) ? res : res.options || [];
        const MoreAvailable = Array.isArray(res) ? newOptions.length > 0 : Boolean(res.hasMore);

        setOptions((prev) => (pageNum === 1 ? newOptions : [...prev, ...newOptions]));
        setHasMore(MoreAvailable);

        // Update selectedMap cache for badges
        setSelectedMap((prev) => {
          const updated = new Map(prev);
          newOptions.forEach((opt) => updated.set(opt.value, opt.label));
          return updated;
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching paginated options:', err);
          setError('Failed to load options');
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchOptions]
  );

  // 2. TRIGGER INITIAL SEARCH (Resets to Page 1 on Query Change)
  useEffect(() => {
    if (!isOpen) return;

    setPage(1);
    const controller = new AbortController();
    loadOptions(debouncedSearchTerm, 1, controller.signal);

    return () => {
      controller.abort();
    };
  }, [isOpen, debouncedSearchTerm, loadOptions]);

  // 3. INFINITE SCROLL INTERSECTION OBSERVER
  useEffect(() => {
    if (!isOpen || isLoading || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadOptions(debouncedSearchTerm, nextPage);
            return nextPage;
          });
        }
      },
      {
        root: listboxRef.current, // Observe scroll container
        threshold: 0.5,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [isOpen, isLoading, isLoadingMore, hasMore, debouncedSearchTerm, loadOptions]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto Focus on Open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      setFocusedIndex(0);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Option Selection
  const handleToggleOption = (option) => {
    const isSelected = value.includes(option.value);
    const updatedValue = isSelected
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    setSelectedMap((prev) => new Map(prev).set(option.value, option.label));
    if (onChange) onChange(updatedValue);
  };

  const handleRemovePill = (e, val) => {
    e.stopPropagation();
    if (onChange) onChange(value.filter((v) => v !== val));
  };

  // Keyboard Nav
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggleOption(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button with Badge Pills */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 py-0.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-md"
              >
                <span>{selectedMap.get(val) || val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemovePill(e, val)}
                  className="p-0.5 rounded hover:bg-indigo-200 text-indigo-500 hover:text-indigo-800 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Scrollable List Container */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {error ? (
              <li className="px-3.5 py-3 text-center text-red-500 text-xs">{error}</li>
            ) : isLoading && page === 1 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">Loading options...</li>
            ) : options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No results found
              </li>
            ) : (
              <>
                {options.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isFocused = index === focusedIndex;

                  return (
                    <li
                      key={`${option.value}-${index}`}
                      id={`option-${id}-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggleOption(option)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                        isFocused ? 'bg-indigo-50/70' : ''
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <span
                        className={`text-sm ${
                          isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </span>
                    </li>
                  );
                })}

                {/* --- INFINITE SCROLL SENTINEL & SPINNER --- */}
                {hasMore && (
                  <li ref={sentinelRef} className="py-2 text-center">
                    {isLoadingMore && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>Loading more...</span>
                      </div>
                    )}
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Example API Integration Function

When passing `fetchOptions`, supply an `async (query, page, signal)` callback:

```jsx
import React, { useState } from 'react';
import InfiniteAsyncMultiSelectDropdown from './InfiniteAsyncMultiSelectDropdown';

export default function App() {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Paginated search API function
  const fetchPaginatedUsers = async (query, page, signal) => {
    const limit = 10;
    const searchUrl = query
      ? `https://api.github.com/search/users?q=${query}&page=${page}&per_page=${limit}`
      : `https://api.github.com/users?since=${(page - 1) * limit}&per_page=${limit}`;

    const res = await fetch(searchUrl, { signal });
    if (!res.ok) throw new Error('API request failed');

    const data = await res.json();
    const items = data.items || data;

    return {
      options: items.map((u) => ({ value: String(u.id), label: u.login })),
      hasMore: items.length === limit,
    };
  };

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Infinite Scroll Users
      </label>

      <InfiniteAsyncMultiSelectDropdown
        value={selectedUserIds}
        onChange={setSelectedUserIds}
        fetchOptions={fetchPaginatedUsers}
        placeholder="Search GitHub users..."
      />
    </div>
  );
}

```

How do I connect this searchable multi-select dropdown to an API endpoint with debounced remote search?

Connecting a searchable multi-select dropdown to a remote API requires three core mechanisms:

1. **Debounce Logic**: Delays sending network requests while the user is actively typing (e.g., 300ms) to avoid over-querying your server.
2. **Cancellation (`AbortController`)**: Cancels pending HTTP requests when new keystrokes occur, preventing out-of-order response race conditions.
3. **Option Cache Map**: Preserves `{ value, label }` pairs for selected items so that dismissal pills remain correctly rendered with human-readable text even when remote search results change or empty out.

---

### Custom Debounce Hook (`useDebounce`)

First, define a reusable debounce hook:

```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

```

---

### Complete Component with Remote API & Debouncing

Here is the complete component. It accepts a `fetchOptions` prop — an async function returning a list of `{ value, label }` objects.

```jsx
import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown, Check, X, Search, Loader2 } from 'lucide-react';
import { useDebounce } from './useDebounce';

export default function AsyncMultiSelectDropdown({
  value = [], // Array of selected values, e.g., ['id1', 'id2']
  onChange,
  fetchOptions, // Signature: async (query, signal) => Promise<Option[]>
  initialSelectedOptions = [], // [{ value: 'id1', label: 'Item 1' }]
  placeholder = 'Search & select...',
  debounceMs = 300,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Async states
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Label Cache: Maps values to labels so badge pills remain visible regardless of search query
  const [selectedMap, setSelectedMap] = useState(() => {
    const map = new Map();
    initialSelectedOptions.forEach((opt) => map.set(opt.value, opt.label));
    return map;
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);

  const id = useId();
  const listboxId = `async-multiselect-listbox-${id}`;
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 1. Fetch options with AbortController signal
  const loadOptions = useCallback(
    async (query, signal) => {
      if (!fetchOptions) return;
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchOptions(query, signal);
        setOptions(results || []);

        // Cache newly fetched options for badge pill labels
        setSelectedMap((prev) => {
          const updated = new Map(prev);
          results.forEach((opt) => updated.set(opt.value, opt.label));
          return updated;
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch options:', err);
          setError('Failed to load options');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOptions]
  );

  // Trigger search when popover opens or debounced search changes
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    loadOptions(debouncedSearchTerm, controller.signal);

    return () => {
      controller.abort(); // Cancel stale network requests on new query or dropdown close
    };
  }, [isOpen, debouncedSearchTerm, loadOptions]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      setFocusedIndex(0);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Handle Option Toggle
  const handleToggleOption = (option) => {
    const isSelected = value.includes(option.value);
    const updatedValue = isSelected
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    setSelectedMap((prev) => new Map(prev).set(option.value, option.label));
    if (onChange) onChange(updatedValue);
  };

  const handleRemovePill = (e, val) => {
    e.stopPropagation();
    if (onChange) onChange(value.filter((v) => v !== val));
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggleOption(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button with Badge Pills */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 py-0.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-md"
              >
                <span>{selectedMap.get(val) || val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemovePill(e, val)}
                  className="p-0.5 rounded hover:bg-indigo-200 text-indigo-500 hover:text-indigo-800 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Input Header */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search remote API..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Options List */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {error ? (
              <li className="px-3.5 py-3 text-center text-red-500 text-xs">{error}</li>
            ) : isLoading && options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">Loading options...</li>
            ) : options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No results found for "{debouncedSearchTerm}"
              </li>
            ) : (
              options.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`option-${id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleToggleOption(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                      isFocused ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm ${
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Usage Example with Fetch/Axios API

```jsx
import React, { useState } from 'react';
import AsyncMultiSelectDropdown from './AsyncMultiSelectDropdown';

export default function App() {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Fetch function mapping API objects to { value, label }
  const fetchUsersFromApi = async (query, signal) => {
    if (!query) return [];

    const response = await fetch(`https://api.github.com/search/users?q=${query}&per_page=10`, {
      signal,
    });
    
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    return data.items.map((user) => ({
      value: String(user.id),
      label: user.login,
    }));
  };

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Assign GitHub Users
      </label>

      <AsyncMultiSelectDropdown
        value={selectedUserIds}
        onChange={setSelectedUserIds}
        fetchOptions={fetchUsersFromApi}
        placeholder="Type to search users..."
      />
    </div>
  );
}

```

How do I add infinite scroll pagination to remote search results inside this async dropdown component?

To add infinite scroll pagination to the `AsyncMultiSelectDropdown`, you need to update three main layers:

1. **API Callback Signature**: Update `fetchOptions` to accept `(query, page, signal)` and return `{ options, hasMore }`.
2. **Infinite Scroll Observer**: Use an `IntersectionObserver` attached to a sentinel element at the bottom of the scrollable list container to load the next page when the user scrolls down.
3. **Array Concatenation**: Reset state on page 1 (new search query) and append results on subsequent pages (page 2+).

---

### Refactored Component with Infinite Scroll

Here is the complete updated component incorporating page tracking and auto-scrolling fetch triggers:

```jsx
import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown, Check, X, Search, Loader2 } from 'lucide-react';

// Lightweight inline debounce helper
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function InfiniteAsyncMultiSelectDropdown({
  value = [],
  onChange,
  fetchOptions, // Signature: async (query, page, signal) => { options: [], hasMore: boolean }
  initialSelectedOptions = [],
  placeholder = 'Search & select...',
  debounceMs = 300,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Async & Pagination States
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache labels so selected pills remain visible across query changes
  const [selectedMap, setSelectedMap] = useState(() => {
    const map = new Map();
    initialSelectedOptions.forEach((opt) => map.set(opt.value, opt.label));
    return map;
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);
  const sentinelRef = useRef(null); // Target node for IntersectionObserver

  const id = useId();
  const listboxId = `infinite-multiselect-listbox-${id}`;
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 1. Core Fetch Handler
  const loadOptions = useCallback(
    async (query, pageNum, signal) => {
      if (!fetchOptions) return;

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const res = await fetchOptions(query, pageNum, signal);
        
        // Normalize response shape: supports both { options: [], hasMore: bool } and raw arrays
        const newOptions = Array.isArray(res) ? res : res.options || [];
        const isMoreAvailable = Array.isArray(res) ? newOptions.length > 0 : Boolean(res.hasMore);

        setOptions((prev) => (pageNum === 1 ? newOptions : [...prev, ...newOptions]));
        setHasMore(isMoreAvailable);

        // Update selected map cache
        setSelectedMap((prev) => {
          const updated = new Map(prev);
          newOptions.forEach((opt) => updated.set(opt.value, opt.label));
          return updated;
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching paginated options:', err);
          setError('Failed to load options');
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchOptions]
  );

  // 2. Query/Open Reset: Trigger page 1 fetch when query changes or popover opens
  useEffect(() => {
    if (!isOpen) return;

    setPage(1);
    const controller = new AbortController();
    loadOptions(debouncedSearchTerm, 1, controller.signal);

    return () => {
      controller.abort();
    };
  }, [isOpen, debouncedSearchTerm, loadOptions]);

  // 3. Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!isOpen || isLoading || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadOptions(debouncedSearchTerm, nextPage);
            return nextPage;
          });
        }
      },
      {
        root: listboxRef.current, // Target internal scroll container
        threshold: 0.5,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [isOpen, isLoading, isLoadingMore, hasMore, debouncedSearchTerm, loadOptions]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto Focus on Open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      setFocusedIndex(0);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Selection Handlers
  const handleToggleOption = (option) => {
    const isSelected = value.includes(option.value);
    const updatedValue = isSelected
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    setSelectedMap((prev) => new Map(prev).set(option.value, option.label));
    if (onChange) onChange(updatedValue);
  };

  const handleRemovePill = (e, val) => {
    e.stopPropagation();
    if (onChange) onChange(value.filter((v) => v !== val));
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggleOption(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-80 text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button with Badge Pills */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 py-0.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-md"
              >
                <span>{selectedMap.get(val) || val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemovePill(e, val)}
                  className="p-0.5 rounded hover:bg-indigo-200 text-indigo-500 hover:text-indigo-800 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {value.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange([]);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Scrollable List Container */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-52 overflow-y-auto py-1 focus:outline-none"
          >
            {error ? (
              <li className="px-3.5 py-3 text-center text-red-500 text-xs">{error}</li>
            ) : isLoading && page === 1 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">Loading options...</li>
            ) : options.length === 0 ? (
              <li className="px-3.5 py-3 text-center text-gray-400 text-xs">
                No results found
              </li>
            ) : (
              <>
                {options.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isFocused = index === focusedIndex;

                  return (
                    <li
                      key={`${option.value}-${index}`}
                      id={`option-${id}-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggleOption(option)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`flex items-center gap-3 px-3.5 py-2 cursor-pointer select-none transition-colors ${
                        isFocused ? 'bg-indigo-50/70' : ''
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <span
                        className={`text-sm ${
                          isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </span>
                    </li>
                  );
                })}

                {/* --- INFINITE SCROLL SENTINEL --- */}
                {hasMore && (
                  <li ref={sentinelRef} className="py-2 text-center">
                    {isLoadingMore && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>Loading more...</span>
                      </div>
                    )}
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Usage Example with Paginated API

Pass a callback function that handles receiving `(query, page, signal)` from the component:

```jsx
import React, { useState } from 'react';
import InfiniteAsyncMultiSelectDropdown from './InfiniteAsyncMultiSelectDropdown';

export default function App() {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Paginated search API function
  const fetchPaginatedUsers = async (query, page, signal) => {
    const limit = 10;
    const searchUrl = query
      ? `https://api.github.com/search/users?q=${query}&page=${page}&per_page=${limit}`
      : `https://api.github.com/users?since=${(page - 1) * limit}&per_page=${limit}`;

    const res = await fetch(searchUrl, { signal });
    if (!res.ok) throw new Error('API request failed');

    const data = await res.json();
    const items = data.items || data;

    return {
      options: items.map((u) => ({ value: String(u.id), label: u.login })),
      hasMore: items.length === limit, // True if full page was returned
    };
  };

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Infinite Scroll Users
      </label>

      <InfiniteAsyncMultiSelectDropdown
        value={selectedUserIds}
        onChange={setSelectedUserIds}
        fetchOptions={fetchPaginatedUsers}
        placeholder="Search GitHub users..."
      />
    </div>
  );
}

```

---

### Key Mechanics To Keep In Mind

* **`root: listboxRef.current`**: Crucial for `IntersectionObserver`. Setting `root` to the scrollable `<ul>` container ensures the observer detects when the bottom sentinel enters the visible view frame of the dropdown rather than the viewport.
* **Dual Loading States**: `isLoading` triggers a full skeleton view on initial queries/searches, while `isLoadingMore` renders a subtle spinner at the bottom of the list without wiping out existing options.

How do I integrate this Pill Multi-Select Dropdown component with React Hook Form and Zod validation?

Integrating a custom React component with **React Hook Form (RHF)** and **Zod** requires three essential steps:

1. **RHF `Controller**`: Connects uncontrolled or custom components to React Hook Form's state model via the `field` object (`value`, `onChange`, `onBlur`).
2. **Zod Validation Schema**: Defines validation rules (e.g., enforcing a minimum or maximum number of selected items) using `z.array()`.
3. **Error Reporting**: Displays validation error messages generated by Zod through RHF's `formState.errors`.

---

### 1. Define the Zod Schema

Define your form validation schema using Zod's `array` method to validate selected multi-select items:

```typescript
import { z } from 'zod';

export const formSchema = z.object({
  // Requires at least 1 selection, and caps at 3 selections
  frameworks: z
    .array(z.string())
    .min(1, { message: 'Please select at least one framework.' })
    .max(3, { message: 'You can select a maximum of 3 frameworks.' }),
});

export type FormValues = z.infer<typeof formSchema>;

```

---

### 2. Connect with RHF via `<Controller/>`

Below is the complete form wrapper component demonstrating how to connect `PillMultiSelectDropdown` to React Hook Form:

```jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';
import PillMultiSelectDropdown from './PillMultiSelectDropdown'; // Your custom dropdown

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
];

export default function FrameworkForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frameworks: ['react'], // Initial selected items
    },
  });

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
    alert(`Submitted successfully: ${JSON.stringify(data)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Select Frameworks <span className="text-red-500">*</span>
        </label>

        {/* --- RHF CONTROLLER WRAPPER --- */}
        <Controller
          name="frameworks"
          control={control}
          render={({ field }) => (
            <PillMultiSelectDropdown
              options={FRAMEWORK_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select frameworks..."
              className={errors.frameworks ? 'border-red-500 ring-1 ring-red-500' : ''}
            />
          )}
        />

        {/* Validation Error Message */}
        {errors.frameworks && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">
            {errors.frameworks.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

```

---

### 3. Updating the Dropdown Component for Error Styles

To reflect invalid form states directly on the dropdown border, ensure your custom `PillMultiSelectDropdown` component passes down or accepts custom border styles via `className` or an `hasError` prop:

```jsx
// Inside PillMultiSelectDropdown.jsx
export default function PillMultiSelectDropdown({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  hasError = false, // Add optional error prop
  className = '',
}) {
  return (
    <div className={`relative inline-block w-full text-left ${className}`}>
      <button
        type="button"
        className={`w-full flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-white border rounded-lg shadow-sm text-sm transition-all ${
          hasError
            ? 'border-red-500 ring-2 ring-red-100' // Render red error ring
            : 'border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500'
        }`}
      >
        {/* Pills & Chevron Icon */}
      </button>
      {/* Popover Listbox */}
    </div>
  );
}

```

---

### Key Best Practices

1. **`zodResolver`**: Ensures validation rules run natively inside React Hook Form on submit, blur, or change depending on your `mode` setting (e.g., `mode: 'onBlur'`).
2. **Default Values**: Always initialize your field array with `defaultValues: { frameworks: [] }` in `useForm` so the dropdown receives an array instead of `undefined`.
3. **Clear on Reset**: Calling RHF's `reset()` automatically resets the dropdown's selected pill badges back to the default initial values without manual state syncing.

How do I add custom async server-side validation rules to Zod schemas in React Hook Form?

To perform async server-side validation with Zod in React Hook Form (like checking if a username is available or validating an ID against a database), you use Zod’s **`refine`** or **`transform`** method with an `async` function, combined with **debouncing** to prevent hitting your server on every keystroke.

---

### 1. Defining the Async Zod Schema

Use `z.string().refine(async (val) => { ... }, { message: '...' })`. Zod automatically handles the promise returned by the async refinement.

```typescript
// schema.ts
import { z } from 'zod';

// Simulated API endpoint check
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  // Replace with your actual fetch call:
  // const res = await fetch(`/api/check-username?username=${username}`);
  // return res.ok;
  
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency
  const takenUsernames = ['admin', 'root', 'john_doe'];
  return !takenUsernames.includes(username.toLowerCase());
};

export const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    // Async validation step
    .refine(
      async (username) => {
        if (username.length < 3) return true; // Skip API call if basic validation fails
        return await checkUsernameAvailability(username);
      },
      {
        message: 'This username is already taken.',
      }
    ),
});

export type FormValues = z.infer<typeof formSchema>;

```

---

### 2. Debouncing the Async Validation in React Hook Form

By default, React Hook Form will run validation on every render or keystroke depending on your `mode`. Running an expensive async server check on every single keypress will spam your backend.

To prevent this, combine `mode: 'onBlur'` or `mode: 'onChange'` with a **debounced async refinement** or debounced form handler.

#### Option A: Debounced Refinement in Zod (Recommended)

You can wrap the async API call inside a debounced helper function:

```typescript
import { z } from 'zod';

// Utility to debounce promise execution
function debouncePromise<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let activeReject: ((reason?: any) => void) | null = null;

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    if (timer) clearTimeout(timer);
    if (activeReject) activeReject({ isCanceled: true });

    return new Promise((resolve, reject) => {
      activeReject = reject;
      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  };
}

const debouncedCheck = debouncePromise(checkUsernameAvailability, 400);

export const debouncedFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Minimum 3 characters required')
    .refine(
      async (username) => {
        try {
          return await debouncedCheck(username);
        } catch (err: any) {
          if (err?.isCanceled) return true; // Ignore superseded calls
          return false;
        }
      },
      { message: 'Username is already taken' }
    ),
});

```

---

### 3. Integrating with React Hook Form & Displaying Loading State

When validating asynchronously, React Hook Form tracks the validating state via `formState.isValidating`. You can use this to show a loading spinner next to the input while the server check is in progress.

```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { debouncedFormSchema } from './schema';

export default function AsyncValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(debouncedFormSchema),
    mode: 'onChange', // Runs validation as user types (debounced by Zod schema)
  });

  const onSubmit = (data) => {
    console.log('Form Submitted Successfully:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose Username
        </label>

        <div className="relative">
          <input
            {...register('username')}
            type="text"
            placeholder="e.g. john_doe"
            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.username
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
          />

          {/* Inline Loading / Success Indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isValidating && (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            )}
            {!isValidating && touchedFields.username && !errors.username && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {!isValidating && errors.username && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Error Message */}
        {errors.username && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.username.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isValidating || isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {isSubmitting ? 'Registering...' : 'Register Account'}
      </button>
    </form>
  );
}

```

---

### Alternative: Handling Server Errors On Submission (`setError`)

If you want to validate on the server **only when submitting the form** (rather than live as the user types), handle it in your `onSubmit` handler using React Hook Form's `setError`:

```javascript
const onSubmit = async (data) => {
  try {
    const response = await api.registerUser(data);
  } catch (error) {
    if (error.status === 409) {
      // Manually set field error returned from server
      setError('username', {
        type: 'server',
        message: 'This username has been claimed on another device.',
      });
    }
  }
};

```

---

### Key Takeaways

1. **Async `refine()**`: Return a Promise resolving to `boolean` inside Zod's `.refine()`.
2. **Debouncing is Crucial**: Never run un-debounced async API queries directly inside `mode: "onChange"` without a debounce wrapper or `mode: "onBlur"`.
3. **`formState.isValidating`**: Use this built-in React Hook Form flag to render spinners while background requests complete.

To perform async server-side validation with Zod in React Hook Form (like checking if a username is available or validating an ID against a database), you use Zod’s **`refine`** or **`transform`** method with an `async` function, combined with **debouncing** to prevent hitting your server on every keystroke.

---

### 1. Defining the Async Zod Schema

Use `z.string().refine(async (val) => { ... }, { message: '...' })`. Zod automatically handles the promise returned by the async refinement.

```typescript
// schema.ts
import { z } from 'zod';

// Simulated API endpoint check
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  // Replace with your actual fetch call:
  // const res = await fetch(`/api/check-username?username=${username}`);
  // return res.ok;
  
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency
  const takenUsernames = ['admin', 'root', 'john_doe'];
  return !takenUsernames.includes(username.toLowerCase());
};

export const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    // Async validation step
    .refine(
      async (username) => {
        if (username.length < 3) return true; // Skip API call if basic validation fails
        return await checkUsernameAvailability(username);
      },
      {
        message: 'This username is already taken.',
      }
    ),
});

export type FormValues = z.infer<typeof formSchema>;

```

---

### 2. Debouncing the Async Validation in React Hook Form

By default, React Hook Form will run validation on every render or keystroke depending on your `mode`. Running an expensive async server check on every single keypress will spam your backend.

To prevent this, combine `mode: 'onBlur'` or `mode: 'onChange'` with a **debounced async refinement** or debounced form handler.

#### Option A: Debounced Refinement in Zod (Recommended)

You can wrap the async API call inside a debounced helper function:

```typescript
import { z } from 'zod';

// Utility to debounce promise execution
function debouncePromise<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let activeReject: ((reason?: any) => void) | null = null;

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    if (timer) clearTimeout(timer);
    if (activeReject) activeReject({ isCanceled: true });

    return new Promise((resolve, reject) => {
      activeReject = reject;
      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  };
}

const debouncedCheck = debouncePromise(checkUsernameAvailability, 400);

export const debouncedFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Minimum 3 characters required')
    .refine(
      async (username) => {
        try {
          return await debouncedCheck(username);
        } catch (err: any) {
          if (err?.isCanceled) return true; // Ignore superseded calls
          return false;
        }
      },
      { message: 'Username is already taken' }
    ),
});

```

---

### 3. Integrating with React Hook Form & Displaying Loading State

When validating asynchronously, React Hook Form tracks the validating state via `formState.isValidating`. You can use this to show a loading spinner next to the input while the server check is in progress.

```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { debouncedFormSchema } from './schema';

export default function AsyncValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(debouncedFormSchema),
    mode: 'onChange', // Runs validation as user types (debounced by Zod schema)
  });

  const onSubmit = (data) => {
    console.log('Form Submitted Successfully:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose Username
        </label>

        <div className="relative">
          <input
            {...register('username')}
            type="text"
            placeholder="e.g. john_doe"
            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.username
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
          />

          {/* Inline Loading / Success Indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isValidating && (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            )}
            {!isValidating && touchedFields.username && !errors.username && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {!isValidating && errors.username && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Error Message */}
        {errors.username && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.username.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isValidating || isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {isSubmitting ? 'Registering...' : 'Register Account'}
      </button>
    </form>
  );
}

```

---

### Alternative: Handling Server Errors On Submission (`setError`)

If you want to validate on the server **only when submitting the form** (rather than live as the user types), handle it in your `onSubmit` handler using React Hook Form's `setError`:

```javascript
const onSubmit = async (data) => {
  try {
    const response = await api.registerUser(data);
  } catch (error) {
    if (error.status === 409) {
      // Manually set field error returned from server
      setError('username', {
        type: 'server',
        message: 'This username has been claimed on another device.',
      });
    }
  }
};

```

---

### Key Takeaways

1. **Async `refine()**`: Return a Promise resolving to `boolean` inside Zod's `.refine()`.
2. **Debouncing is Crucial**: Never run un-debounced async API queries directly inside `mode: "onChange"` without a debounce wrapper or `mode: "onBlur"`.
3. **`formState.isValidating`**: Use this built-in React Hook Form flag to render spinners while background requests complete.
  
  Creating a reusable `FormField` wrapper in React Hook Form (RHF) works best by leveraging **React Context** (via `useFormContext` or RHF's `<Controller/>`) combined with `React.cloneElement` or render props.

This pattern decouples your form layout (labels, helper text, loading spinners, error messages) from your custom input controls (text inputs, multi-select dropdowns, time pickers, checkboxes).

---

### 1. The `FormField` Wrapper Component

This component automatically reads validation errors, touched state, and `isValidating` status from the parent form context and injects layout elements around any child input.

```jsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function FormField({
  name,
  label,
  description,
  required = false,
  children,
  className = '',
}) {
  const {
    control,
    formState: { errors, isValidating, touchedFields },
  } = useFormContext(); // Reads context from parent <FormProvider />

  const error = errors[name];
  const isTouched = touchedFields[name];
  const hasError = Boolean(error);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* --- LABEL --- */}
      {label && (
        <div className="flex justify-between items-center">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      {/* --- DESCRIPTION / HELP TEXT --- */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* --- FIELD INPUT CONTAINER WITH STATUS ICON OVERLAY --- */}
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            // Inject `id`, `hasError`, `value`, and `onChange` into child component
            if (React.isValidElement(children)) {
              return React.cloneElement(children, {
                ...field,
                id: name,
                hasError,
                className: `${children.props.className || ''} ${
                  hasError ? 'border-red-500 ring-1 ring-red-500' : ''
                }`,
              });
            }
            return children;
          }}
        />

        {/* --- STATUS SPINNER & ICONS OVERLAY --- */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {isValidating && (
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
          )}
          {!isValidating && hasError && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {!isValidating && !hasError && isTouched && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {hasError && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
          {error.message}
        </p>
      )}
    </div>
  );
}

```

---

### 2. Usage with `<FormProvider/>`

To use `FormField` anywhere in your application tree without manually drilling the `control` object, wrap your form with RHF's `<FormProvider/>`.

```jsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from './FormField';
import CustomTimeInput from './CustomTimeInput';
import PillMultiSelectDropdown from './PillMultiSelectDropdown';

// 1. Zod Validation Schema
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  meetingTime: z.string().min(1, 'Meeting time is required'),
  frameworks: z.array(z.string()).min(1, 'Select at least 1 framework'),
});

const FRAMEWORKS = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'next', label: 'Next.js' },
];

export default function MyForm() {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      meetingTime: '09:00 AM',
      frameworks: [],
    },
    mode: 'onBlur',
  });

  const onSubmit = (data) => console.log('Submitted Form Data:', data);

  return (
    // 2. Wrap form with FormProvider
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-5">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Project Setup</h2>

        {/* Standard Text Input */}
        <FormField
          name="username"
          label="Username"
          description="Choose a unique handle for your account."
          required
        >
          <input
            type="text"
            placeholder="e.g. alex_dev"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </FormField>

        {/* Custom Time Picker Component */}
        <FormField
          name="meetingTime"
          label="Standup Time"
          required
        >
          <CustomTimeInput />
        </FormField>

        {/* Custom Multi-Select Dropdown */}
        <FormField
          name="frameworks"
          label="Tech Stack"
          description="Select frameworks used in this project."
          required
        >
          <PillMultiSelectDropdown options={FRAMEWORKS} />
        </FormField>

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
        >
          Submit Configuration
        </button>
      </form>
    </FormProvider>
  );
}

```

---

### Key Advantages of This Architecture

1. **Zero Prop Drilling**: Using `useFormContext()` inside `<FormField/>` eliminates the need to pass `control`, `errors`, or `register` props through every level of component hierarchy.
2. **Unified UI Standards**: Standardizes label typography, error message formatting, required indicators (`*`), and loading spinners across all inputs in your design system.
3. **Pluggable Inputs**: Works out-of-the-box with standard HTML inputs (`<input>`, `<select>`, `<textarea>`) and custom UI components (`PillMultiSelectDropdown`, `CustomTimeInput`, `DatePicker`).

How do I perform cross-field validation (like confirm password matching) using Zod and React Hook Form?

Performing cross-field validation—such as ensuring a "Confirm Password" field matches a "Password" field—is handled in Zod using the **`.refine()`** or **`.superRefine()`** method on the parent object.

By attaching validation at the object level, Zod gets access to all sibling field values simultaneously.

---

### 1. Define the Zod Schema with `.refine()`

Define your individual field rules inside `z.object()`, then append `.refine()` to evaluate both fields together.

```typescript
import { z } from 'zod';

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Targets the error message directly to the confirmPassword field
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

```

#### Why `path: ['confirmPassword']` is Critical

Without specifying `path`, Zod assigns the validation error to the root object (`errors.root`). Providing `path: ['confirmPassword']` ensures React Hook Form attaches the error directly to `errors.confirmPassword`, so your field wrapper renders the error right under the confirm input.

---

### 2. Multi-Field Validation Example (e.g., Date Ranges)

If you need to validate multiple interdependent conditions (e.g., matching passwords **and** checking that an `endDate` is after a `startDate`), use **`.superRefine()`** to add multiple custom errors in a single pass:

```typescript
import { z } from 'zod';

export const bookingSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // Rule 1: Confirm Password Match
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }

    // Rule 2: Date Comparison
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
          path: ['endDate'],
        });
      }
    }
  });

```

---

### 3. React Component Integration

Connect the schema to React Hook Form using `zodResolver`. Setting `mode: "onChange"` or `mode: "onBlur"` automatically re-evaluates cross-field rules as users type or tab out.

```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from './schema';

export default function PasswordResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange', // Live validation on keystrokes
  });

  const onSubmit = (data) => {
    console.log('Valid Form Data:', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Reset Password</h2>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          {...register('password')}
          type="password"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.password
              ? 'border-red-500 ring-1 ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500'
          }`}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.confirmPassword
              ? 'border-red-500 ring-1 ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500'
          }`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition"
      >
        Update Password
      </button>
    </form>
  );
}

```

---

### Pro-Tip: Triggering Re-Validation on Sibling Changes

If a user types matching passwords, but then goes back to change the **first password** field, React Hook Form might not automatically re-trigger the check on `confirmPassword` depending on your mode.

To ensure `confirmPassword` re-evaluates immediately when `password` changes, use RHF's `trigger` helper in an `onChange` handler:

```jsx
const { register, trigger } = useForm({
  resolver: zodResolver(passwordSchema),
});

<input
  {...register('password')}
  onChange={(e) => {
    register('password').onChange(e);
    trigger('confirmPassword'); // Re-runs confirmPassword check instantly
  }}
/>

```

How do I build dynamic forms with add/remove row capability using React Hook Form's useFieldArray?

To build dynamic forms with add/remove row capabilities in React Hook Form, you use the **`useFieldArray`** hook alongside **`useForm`**.

`useFieldArray` manages an array of form fields as a single state unit while automatically generating stable unique IDs for keys (`field.id`), keeping re-renders minimal and performance fast.

---

### 1. Zod Schema for Array Data

Define an array of objects inside your Zod schema using `z.array()`:

```typescript
// schema.ts
import { z } from 'zod';

export const teamSchema = z.object({
  teamName: z.string().min(2, 'Team name is required'),
  members: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        role: z.string().min(1, 'Role is required'),
      })
    )
    .min(1, 'At least one team member is required'),
});

export type TeamFormValues = z.infer<typeof teamSchema>;

```

---

### 2. Complete Component Implementation

Here is the complete component demonstrating `append`, `remove`, and dynamic row rendering:

```jsx
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { teamSchema } from './schema';

export default function DynamicTeamForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: 'Frontend Core',
      members: [
        { name: 'Alex Johnson', email: 'alex@company.com', role: 'Lead Developer' },
      ],
    },
  });

  // --- USE FIELD ARRAY HOOK ---
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members', // Must match the key in your schema & defaultValues
  });

  const onSubmit = (data) => {
    console.log('Submitted Team Data:', data);
    alert(`Successfully saved team with ${data.members.length} members!`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Team Roster Setup</h2>
        <p className="text-sm text-gray-500">Add or remove team members dynamically.</p>
      </div>

      {/* Team Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('teamName')}
          type="text"
          placeholder="e.g. Design Systems"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.teamName
              ? 'border-red-500 ring-1 ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500'
          }`}
        />
        {errors.teamName && (
          <p className="mt-1 text-xs text-red-600">{errors.teamName.message}</p>
        )}
      </div>

      {/* Dynamic Members Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Members ({fields.length})
          </h3>

          {/* ADD ROW BUTTON */}
          <button
            type="button"
            onClick={() => append({ name: '', email: '', role: 'Developer' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Member
          </button>
        </div>

        {errors.members?.root && (
          <p className="text-xs text-red-600 font-medium">
            {errors.members.root.message}
          </p>
        )}

        {/* DYNAMIC ROWS LIST */}
        <div className="space-y-3">
          {fields.map((field, index) => {
            // Field-specific errors
            const memberErrors = errors.members?.[index];

            return (
              <div
                key={field.id} // CRITICAL: Always use field.id as key, NEVER index!
                className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg items-start sm:items-center animate-in fade-in duration-150"
              >
                {/* Member Name */}
                <div className="flex-1 w-full">
                  <input
                    {...register(`members.${index}.name`)}
                    type="text"
                    placeholder="Full Name"
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      memberErrors?.name
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  />
                  {memberErrors?.name && (
                    <p className="mt-1 text-xs text-red-600">{memberErrors.name.message}</p>
                  )}
                </div>

                {/* Member Email */}
                <div className="flex-1 w-full">
                  <input
                    {...register(`members.${index}.email`)}
                    type="email"
                    placeholder="email@company.com"
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      memberErrors?.email
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  />
                  {memberErrors?.email && (
                    <p className="mt-1 text-xs text-red-600">{memberErrors.email.message}</p>
                  )}
                </div>

                {/* Member Role Select */}
                <div className="w-full sm:w-40">
                  <select
                    {...register(`members.${index}.role`)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Lead Developer">Lead Developer</option>
                    <option value="Product Owner">Product Owner</option>
                  </select>
                </div>

                {/* REMOVE ROW BUTTON */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1} // Prevent removing if minimum 1 row required
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed self-end sm:self-center"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
        >
          {isSubmitting ? 'Saving...' : 'Save Roster'}
        </button>
      </div>
    </form>
  );
}

```

---

### Golden Rules of `useFieldArray`

1. **`key={field.id}` is Mandatory**: Always use `field.id` as the React `key` attribute when mapping over `fields`. Do **NOT** use `key={index}`. RHF generates a unique ID for each row to preserve focus, cursor position, and state when rows are inserted or reordered.
2. **Template Literals for Field Registration**: Register dynamic inputs using the `members.${index}.fieldName` path syntax.
3. **Available Array Methods**:

* `append(obj)`: Adds item(s) to the end of the array.
* `prepend(obj)`: Adds item(s) to the beginning of the array.
* `insert(index, obj)`: Inserts an item at a specific position.
* `remove(index)`: Removes an item at a specific index (or pass an array of indices `remove([0, 2])`).
* `swap(indexA, indexB)`: Swaps positions of two rows (great for reordering).
* `move(from, to)`: Moves a row to a new index.

How do I structure a multi-step form wizard where each step validates against a distinct Zod sub-schema?

Structuring a multi-step form wizard where each step validates against its own Zod schema requires two design choices:

1. **Schema Composition**: Define individual Zod sub-schemas for each step, then merge them using `z.intersection()` or `.and()` (or `z.object().extend()`) into a master schema for final submission.
2. **Step Validation Engine**: Before advancing to step $N+1$, call React Hook Form's **`trigger()`** with the field names of the current step to run validation against only those fields.

---

### Architecture Overview

```
Step 1 Schema ──┐
Step 2 Schema ──┼──> Master Combined Schema (for final submission & type safety)
Step 3 Schema ──┘

Navigation: Step N ──( trigger(['fieldA', 'fieldB']) )──> Pass? ──> Step N+1

```

---

### 1. Define Step Schemas & Master Union

```typescript
// schemas.ts
import { z } from 'zod';

// Step 1: Personal Info
export const stepOneSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
});

// Step 2: Account Preferences
export const stepTwoSchema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise'], {
    errorMap: () => ({ message: 'Please select a plan' }),
  }),
  notifications: z.boolean().default(true),
});

// Step 3: Payment Details
export const stepThreeSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  billingZip: z.string().min(5, 'ZIP code must be at least 5 digits'),
});

// Combine all steps into a single master schema
export const masterFormSchema = stepOneSchema
  .and(stepTwoSchema)
  .and(stepThreeSchema);

export type MasterFormValues = z.infer<typeof masterFormSchema>;

// Helper to get fields to validate per step
export const STEP_FIELDS: Record<number, Array<keyof MasterFormValues>> = {
  1: ['fullName', 'email'],
  2: ['plan', 'notifications'],
  3: ['cardNumber', 'billingZip'],
};

```

---

### 2. Multi-Step Wizard Implementation

By mounting a single `useForm` instance with the `masterFormSchema`, you retain all form values in memory as the user moves back and forth through steps.

```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  masterFormSchema,
  STEP_FIELDS,
} from './schemas';

const TOTAL_STEPS = 3;

export default function MultiStepWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  // Single useForm instance backed by the combined master schema
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(masterFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      plan: 'pro',
      notifications: true,
      cardNumber: '',
      billingZip: '',
    },
    mode: 'onBlur',
  });

  // STEP VALIDATION: Only validate current step's fields before advancing
  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate); // Triggers validation on specified fields

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final submission handler
  const onSubmit = (data) => {
    console.log('Complete Valid Form Submission:', data);
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      
      {/* STEPPER HEADER */}
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -z-0 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        />

        {[1, 2, 3].map((step) => {
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                  isDone
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-50'
                    : 'bg-gray-100 border border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
        
        {/* STEP 1: PERSONAL INFO */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-gray-800">1. Personal Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="Jane Doe"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="jane@company.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-gray-800">2. Select Plan</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Plan
              </label>
              <select
                {...register('plan')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="free">Free Tier</option>
                <option value="pro">Pro Plan ($19/mo)</option>
                <option value="enterprise">Enterprise Tier</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                {...register('notifications')}
                type="checkbox"
                id="notifications"
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700">
                Receive product update emails
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-gray-800">3. Payment Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number (16 digits) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('cardNumber')}
                type="text"
                maxLength={16}
                placeholder="4000123456789010"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.cardNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.cardNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                {...register('billingZip')}
                type="text"
                placeholder="90210"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.billingZip ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.billingZip && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.billingZip.message}</p>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION CONTROLS */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Order'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Alternative: Dynamic Resolver Switching

If your steps rely on conditional logic or isolated sub-forms, you can dynamically pass different Zod resolvers to `useForm` based on `currentStep`:

```javascript
const schemas = [stepOneSchema, stepTwoSchema, stepThreeSchema];

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schemas[currentStep - 1]),
});

```

*(Note: The `trigger()` method approach shown in the full code above is generally preferred because it keeps all values in a single form state without needing to merge state across step unmounts.)*

How do I make this multi-step form wizard persist its draft progress in browser LocalStorage so users don't lose data on page refresh?

Persisting draft progress in a React Hook Form multi-step wizard requires two main synchronizations:

1. **Form Values & Active Step Persistence**: Read initial data from `localStorage` on page load, and continuously sync form changes and step progress back to `localStorage`.
2. **Form Reset on Submit**: Clear local storage once the user successfully completes the entire wizard.

---

### Custom Hook: `usePersistedMultiStepForm`

Here is a lightweight custom hook that wraps React Hook Form's `watch()` and `reset()` to synchronize both your form inputs and active step with `localStorage`:

```typescript
import { useEffect } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface PersistOptions<T extends FieldValues> {
  storageKey: string;
  form: UseFormReturn<T>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  defaultValues: T;
  defaultStep?: number;
}

export function usePersistedMultiStepForm<T extends FieldValues>({
  storageKey,
  form,
  currentStep,
  setCurrentStep,
  defaultValues,
  defaultStep = 1,
}: PersistOptions<T>) {
  const { watch, reset } = form;

  // 1. READ: Load draft data & active step on initial mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const { values, step } = JSON.parse(savedData);
        if (values) reset(values); // Populate form fields
        if (step) setCurrentStep(step); // Restore active step
      }
    } catch (error) {
      console.error(`Error loading draft from localStorage key "${storageKey}":`, error);
    }
  }, [storageKey, reset, setCurrentStep]);

  // 2. WRITE: Subscribe to all form changes & step shifts
  useEffect(() => {
    const subscription = watch((formValues) => {
      try {
        const draft = {
          values: formValues,
          step: currentStep,
        };
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (error) {
        console.error(`Error saving draft to localStorage key "${storageKey}":`, error);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, currentStep, storageKey]);

  // 3. CLEAR: Utility to wipe local storage upon final submission
  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      reset(defaultValues);
      setCurrentStep(defaultStep);
    } catch (error) {
      console.error(`Error clearing draft from localStorage key "${storageKey}":`, error);
    }
  };

  return { clearDraft };
}

```

---

### Integration with Multi-Step Wizard

Pass your `useForm` methods, current step state, and storage key into the custom hook:

```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { masterFormSchema, STEP_FIELDS } from './schemas';
import { usePersistedMultiStepForm } from './usePersistedMultiStepForm';

const STORAGE_KEY = 'wizard_draft_progress_v1';
const DEFAULT_VALUES = {
  fullName: '',
  email: '',
  plan: 'pro',
  notifications: true,
  cardNumber: '',
  billingZip: '',
};

export default function PersistedMultiStepWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(masterFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = form;

  // --- ACTIVATE DRAFT PERSISTENCE ---
  const { clearDraft } = usePersistedMultiStepForm({
    storageKey: STORAGE_KEY,
    form,
    currentStep,
    setCurrentStep,
    defaultValues: DEFAULT_VALUES,
  });

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // On successful final submission, clear draft from browser
  const onSubmit = async (data) => {
    console.log('Final Submission:', data);
    
    // Simulate API submission call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Clear storage and reset wizard state
    clearDraft();
    alert('Order submitted successfully! Draft cleared.');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Draft Banner */}
      <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-700">
        <span>Draft progress is automatically saved locally.</span>
        <button
          type="button"
          onClick={clearDraft}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Clear Draft
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1 Inputs */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">1. Personal Info</h3>
            <input
              {...register('fullName')}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            
            <input
              {...register('email')}
              placeholder="Email Address"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
        )}

        {/* Step 2 & Step 3 Inputs ... */}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Order'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Best Practices

1. **Performant `watch()` Subscriptions**: React Hook Form's `watch()` callback in `useEffect` receives field values asynchronously without triggering re-renders of your entire component tree on every keypress.
2. **Schema Versioning in Key Names**: Use a versioned storage key name (e.g., `'wizard_draft_v1'`). If you update your Zod schema in the future, bumping the key version prevents `JSON.parse` errors from stale structure mismatches.
3. **Lazy Reset**: Pass `reset(values)` inside `useEffect` on mount rather than initializing default values directly in `useForm` so SSR frameworks (Next.js/Remix) avoid hydration mismatch errors.

How do I make this LocalStorage draft wizard sync form data in real-time across multiple open browser tabs using window storage events?

To synchronize your multi-step form wizard and draft data in real time across multiple open browser tabs, you need to extend your persistence hook to handle the browser's native **`storage` event**.

When Tab A makes a change to `localStorage`, Tab B receives a `storage` event containing `event.key`, `event.oldValue`, and `event.newValue`. Listening to this event allows Tab B to immediately call React Hook Form's **`reset()`** and update its active step state.

---

### Enhanced Custom Hook: `useSyncedMultiStepForm`

This updated hook handles both **saving/clearing draft data** and **real-time cross-tab synchronization**.

```typescript
import { useEffect, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface SyncedWizardOptions<T extends FieldValues> {
  storageKey: string;
  form: UseFormReturn<T>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  defaultValues: T;
  defaultStep?: number;
}

export function useSyncedMultiStepForm<T extends FieldValues>({
  storageKey,
  form,
  currentStep,
  setCurrentStep,
  defaultValues,
  defaultStep = 1,
}: SyncedWizardOptions<T>) {
  const { watch, reset } = form;
  
  // Ref flag to prevent local changes from creating recursive loop updates
  const isUpdatingFromExternalTab = useRef(false);

  // 1. READ ON MOUNT: Load initial draft data & step state
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const { values, step } = JSON.parse(savedData);
        if (values) reset(values);
        if (step) setCurrentStep(step);
      }
    } catch (error) {
      console.error(`[useSyncedMultiStepForm] Error parsing initial draft:`, error);
    }
  }, [storageKey, reset, setCurrentStep]);

  // 2. WRITE TO LOCALSTORAGE: Save local form edits & step navigation
  useEffect(() => {
    const subscription = watch((formValues) => {
      // If the change came from another tab's storage event, skip writing back
      if (isUpdatingFromExternalTab.current) {
        isUpdatingFromExternalTab.current = false;
        return;
      }

      try {
        const draft = {
          values: formValues,
          step: currentStep,
        };
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (error) {
        console.error(`[useSyncedMultiStepForm] Error saving draft:`, error);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, currentStep, storageKey]);

  // 3. LISTEN TO 'STORAGE' EVENTS FROM OTHER TABS
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      // Only process events targeting our specific storage key from localStorage
      if (event.key !== storageKey || event.storageArea !== window.localStorage) {
        return;
      }

      try {
        if (event.newValue === null) {
          // Draft was cleared in another tab (e.g. form submitted)
          isUpdatingFromExternalTab.current = true;
          reset(defaultValues);
          setCurrentStep(defaultStep);
        } else {
          // Draft was updated in another tab
          const { values, step } = JSON.parse(event.newValue);

          isUpdatingFromExternalTab.current = true;
          if (values) reset(values, { keepDefaultValues: true });
          if (step && step !== currentStep) setCurrentStep(step);
        }
      } catch (error) {
        console.error(`[useSyncedMultiStepForm] Error parsing cross-tab update:`, error);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [storageKey, reset, setCurrentStep, currentStep, defaultValues, defaultStep]);

  // 4. CLEAR DRAFT UTILITY (For final form submission)
  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      reset(defaultValues);
      setCurrentStep(defaultStep);
    } catch (error) {
      console.error(`[useSyncedMultiStepForm] Error clearing draft:`, error);
    }
  };

  return { clearDraft };
}

```

---

### Component Integration Example

Simply wire the hook inside your multi-step wizard component:

```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { masterFormSchema, STEP_FIELDS } from './schemas';
import { useSyncedMultiStepForm } from './useSyncedMultiStepForm';

const STORAGE_KEY = 'synced_wizard_draft_v1';
const DEFAULT_VALUES = {
  fullName: '',
  email: '',
  plan: 'pro',
  notifications: true,
  cardNumber: '',
  billingZip: '',
};

export default function MultiTabSyncedWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(masterFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = form;

  // Activate cross-tab multi-step synchronization
  const { clearDraft } = useSyncedMultiStepForm({
    storageKey: STORAGE_KEY,
    form,
    currentStep,
    setCurrentStep,
    defaultValues: DEFAULT_VALUES,
  });

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data) => {
    console.log('Submitted Order:', data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Clears local storage and notifies all open tabs automatically
    clearDraft();
    alert('Submitted successfully! All open tabs have been reset.');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs text-emerald-800">
        <span>⚡ Live Multi-Tab Sync Active (Open in 2 tabs to test)</span>
        <button
          type="button"
          onClick={clearDraft}
          className="text-emerald-700 font-semibold hover:underline"
        >
          Reset All Tabs
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">1. Personal Details</h3>
            <div>
              <input
                {...register('fullName')}
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <input
                {...register('email')}
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 & 3 Inputs ... */}

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Order'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Critical Implementation Details

1. **`isUpdatingFromExternalTab` Flag**: Prevents an infinite update loop. When Tab B receives a storage event from Tab A and invokes `reset()`, React Hook Form's `watch()` callback triggers. Checking this ref flag ensures Tab B doesn't immediately re-write identical data back into `localStorage`.
2. **`reset(values, { keepDefaultValues: true })`**: Passing `{ keepDefaultValues: true }` ensures that external updates replace the field values cleanly without clobbering baseline form metadata or validation schema configurations.
3. **Automatic Submission Reset**: When you call `clearDraft()` on submit in Tab A, `localStorage.removeItem()` triggers `event.newValue === null` in Tab B, instantly resetting both tabs back to Step 1 with blank fields.
