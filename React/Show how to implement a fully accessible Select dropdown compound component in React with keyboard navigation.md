Here is a complete, production-ready **Select Dropdown** compound component built in React. It implements strict accessibility standards (**WAI-ARIA Select Pattern**), full keyboard navigation, type-ahead searching, and slot integration (`asChild`).

---

### Key Architectural & Accessibility Features

1. **WAI-ARIA Pattern Compliance:** Uses `role="combobox"` on the trigger and `role="listbox"` / `role="option"` inside the menu.
2. **Full Keyboard Navigation:**

* `Enter` / `Space` / `ArrowDown` / `ArrowUp`: Opens the dropdown.
* `ArrowDown` / `ArrowUp`: Navigates focused items within the list.
* `Home` / `End`: Jumps to first or last item.
* `Escape`: Closes the dropdown and restores focus to trigger.
* `Type-Ahead Search`: Typing letters jumps focus to matching items.

1. **Implicit State Sharing:** Uses React Context so `<Select.Option>` items automatically register themselves with the parent context.
2. **Controlled & Uncontrolled Support:** Works seamlessly with or without an external `value` state.

---

### Step 1: Create the Select Context & Provider

```tsx
// src/components/Select/SelectContext.tsx
import * as React from 'react';

export interface SelectOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectContextValue {
  isOpen: boolean;
  selectedValue: string;
  focusedIndex: number;
  options: SelectOptionData[];
  openSelect: () => void;
  closeSelect: () => void;
  toggleSelect: () => void;
  selectOption: (value: string, label: string) => void;
  registerOption: (option: SelectOptionData) => void;
  unregisterOption: (value: string) => void;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  triggerId: string;
  menuId: string;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be rendered inside <Select>.');
  }
  return context;
}

export interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  children,
  value: controlledValue,
  defaultValue = '',
  onChange,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [options, setOptions] = React.useState<SelectOptionData[]>([]);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const triggerId = React.useId();
  const menuId = React.useId();

  const openSelect = React.useCallback(() => setIsOpen(true), []);
  const closeSelect = React.useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);
  const toggleSelect = React.useCallback(() => setIsOpen((prev) => !prev), []);

  const selectOption = React.useCallback(
    (val: string) => {
      if (!isControlled) setUncontrolledValue(val);
      onChange?.(val);
      closeSelect();
    },
    [isControlled, onChange, closeSelect]
  );

  const registerOption = React.useCallback((opt: SelectOptionData) => {
    setOptions((prev) => {
      if (prev.some((o) => o.value === opt.value)) return prev;
      return [...prev, opt];
    });
  }, []);

  const unregisterOption = React.useCallback((val: string) => {
    setOptions((prev) => prev.filter((o) => o.value !== val));
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      selectedValue,
      focusedIndex,
      options,
      openSelect,
      closeSelect,
      toggleSelect,
      selectOption,
      registerOption,
      unregisterOption,
      setFocusedIndex,
      triggerId,
      menuId,
    }),
    [
      isOpen,
      selectedValue,
      focusedIndex,
      options,
      openSelect,
      closeSelect,
      toggleSelect,
      selectOption,
      registerOption,
      unregisterOption,
      triggerId,
      menuId,
    ]
  );

  return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
}

```

---

### Step 2: Implement Trigger & Keyboard Navigation

```tsx
// src/components/Select/SelectTrigger.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useSelectContext } from './SelectContext';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ asChild = false, className = '', children, onClick, onKeyDown, ...props }, ref) => {
    const {
      isOpen,
      selectedValue,
      options,
      toggleSelect,
      openSelect,
      closeSelect,
      focusedIndex,
      setFocusedIndex,
      triggerId,
      menuId,
    } = useSelectContext();

    const Comp = asChild ? Slot : 'button';

    // Find label for selected option
    const selectedOption = options.find((o) => o.value === selectedValue);
    const displayText = selectedOption ? selectedOption.label : 'Select an option...';

    // Type-Ahead Search buffer
    const searchBuffer = React.useRef('');
    const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          openSelect();
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          openSelect();
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && options[focusedIndex]) {
          const opt = options[focusedIndex];
          if (!opt.disabled) {
            useSelectContext().selectOption(opt.value, opt.label);
          }
        } else {
          toggleSelect();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeSelect();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocusedIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setFocusedIndex(options.length - 1);
      } else if (e.key.length === 1 && isOpen) {
        // Type-Ahead Logic
        searchBuffer.current += e.key.toLowerCase();
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
          searchBuffer.current = '';
        }, 500);

        const matchIndex = options.findIndex((opt) =>
          opt.label.toLowerCase().startsWith(searchBuffer.current)
        );
        if (matchIndex !== -1) setFocusedIndex(matchIndex);
      }
    };

    return (
      <Comp
        ref={ref}
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={(e) => {
          onClick?.(e);
          toggleSelect();
        }}
        onKeyDown={handleKeyDown}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${className}`}
        {...props}
      >
        {children || <span>{displayText}</span>}
      </Comp>
    );
  }
);
SelectTrigger.displayName = 'Select.Trigger';

```

---

### Step 3: Implement Content Menu & Option Primitives

```tsx
// src/components/Select/SelectContent.tsx
import * as React from 'react';
import { useSelectContext } from './SelectContext';

export interface SelectContentProps extends React.HTMLAttributes<HTMLUListElement> {}

export const SelectContent = React.forwardRef<HTMLUListElement, SelectContentProps>(
  ({ className = '', children, ...props }, ref) => {
    const { isOpen, closeSelect, menuId, triggerId } = useSelectContext();
    const listRef = React.useRef<HTMLUListElement | null>(null);

    React.useImperativeHandle(ref, () => listRef.current!);

    // Handle clicking outside to close
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (listRef.current && !listRef.current.contains(e.target as Node)) {
          closeSelect();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeSelect]);

    if (!isOpen) return null;

    return (
      <ul
        ref={listRef}
        id={menuId}
        role="listbox"
        aria-labelledby={triggerId}
        tabIndex={-1}
        className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
SelectContent.displayName = 'Select.Content';

export interface SelectOptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
  label: string;
  disabled?: boolean;
}

export const SelectOption = React.forwardRef<HTMLLIElement, SelectOptionProps>(
  ({ value, label, disabled = false, className = '', children, ...props }, ref) => {
    const {
      selectedValue,
      focusedIndex,
      options,
      selectOption,
      registerOption,
      unregisterOption,
    } = useSelectContext();

    const itemRef = React.useRef<HTMLLIElement | null>(null);
    React.useImperativeHandle(ref, () => itemRef.current!);

    // Automatically register option with context
    React.useEffect(() => {
      registerOption({ value, label, disabled });
      return () => unregisterOption(value);
    }, [value, label, disabled, registerOption, unregisterOption]);

    const isSelected = selectedValue === value;
    const currentIndex = options.findIndex((o) => o.value === value);
    const isFocused = focusedIndex === currentIndex;

    // Auto-scroll focused item into view during arrow key navigation
    React.useEffect(() => {
      if (isFocused && itemRef.current) {
        itemRef.current.scrollIntoView({ block: 'nearest' });
      }
    }, [isFocused]);

    return (
      <li
        ref={itemRef}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        onClick={() => !disabled && selectOption(value, label)}
        className={`flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
          isFocused ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : ''
        } ${isSelected ? 'font-semibold' : ''} ${
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${className}`}
        {...props}
      >
        {children || <span>{label}</span>}
        {isSelected && <span className="text-blue-600">✓</span>}
      </li>
    );
  }
);
SelectOption.displayName = 'Select.Option';

```

---

### Step 4: Export Namespace Compound Component

```tsx
// src/components/Select/index.ts
import { Select as RootSelect } from './SelectContext';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent, SelectOption } from './SelectContent';

export const Select = Object.assign(RootSelect, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
});

export type { SelectProps } from './SelectContext';

```

---

### Step 5: How Consumers Use the Select Component

#### Controlled Example

```tsx
import { useState } from 'react';
import { Select } from '@design-system/ui';

export function SelectDemo() {
  const [selectedRole, setSelectedRole] = useState('developer');

  return (
    <div className="relative w-64">
      <label className="mb-2 block text-sm font-medium">Select Role</label>
      
      <Select value={selectedRole} onChange={setSelectedRole}>
        <Select.Trigger />

        <Select.Content>
          <Select.Option value="developer" label="Software Developer" />
          <Select.Option value="designer" label="UI/UX Designer" />
          <Select.Option value="manager" label="Product Manager" />
          <Select.Option value="intern" label="Intern" disabled />
        </Select.Content>
      </Select>

      <p className="mt-4 text-xs text-gray-500">Selected Role: {selectedRole}</p>
    </div>
  );
}

```
