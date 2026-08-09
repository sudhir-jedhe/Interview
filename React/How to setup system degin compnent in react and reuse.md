Building a complete, production-grade Design System like Material Design from scratch requires a structured multi-layer architecture. Material Design isn't just a set of buttons—it is an ecosystem built on **Design Tokens**, **Core Primitives**, **Compound UI Components**, **Theme Engine**, and **Accessibility Contracts**.

Here is a comprehensive, step-by-step blueprint to construct your custom React design system with enterprise-grade standards.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONSUMING APPLICATIONS / MICRO-FRONTENDS             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ 4. COMPOUND & OVERLAY COMPONENTS (Dialog, Select, Drawer, DatePicker)   │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. CORE PRIMITIVES & FORM CONTROLS (Button, Input, Checkbox, Switch)   │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. THEME ENGINE & CONTEXT PROVIDER (Dark/Light Mode, Custom Brands)    │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. DESIGN TOKENS (Colors, Spacing, Elevation, Typography, Motion)       │
└─────────────────────────────────────────────────────────────────────────┘

```

---

## Step 1: Establish Design Tokens

Design Tokens are the atomic sub-particles of your design system (colors, typography scales, spacing units, elevation/shadows, and animation durations).

### 1.1 Token Definitions (`src/tokens/tokens.ts`)

```typescript
export const tokens = {
  colors: {
    primary: {
      50: '#eef2ff',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      800: '#1e293b',
      900: '#0f172a',
    },
    danger: {
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type ThemeTokens = typeof tokens;

```

---

## Step 2: Build the Theme Engine & Context Provider

Like Material UI's `ThemeProvider`, your design system needs a provider to inject CSS custom variables into the DOM root and switch between Light and Dark modes dynamically.

### 2.1 Theme Provider (`src/theme/ThemeProvider.tsx`)

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokens } from '../tokens/tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode; defaultMode?: ThemeMode }> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    const root = document.documentElement;
    
    // Inject CSS variables for real-time dynamic brand customizability
    if (mode === 'dark') {
      root.style.setProperty('--bg-primary', tokens.colors.neutral[900]);
      root.style.setProperty('--text-primary', tokens.colors.neutral[50]);
      root.style.setProperty('--color-primary', tokens.colors.primary[500]);
      root.classList.add('dark');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--text-primary', tokens.colors.neutral[900]);
      root.style.setProperty('--color-primary', tokens.colors.primary[600]);
      root.classList.remove('dark');
    }
  }, [mode]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

```

---

## Step 3: Implement Utility Helper for Class Merging

Install Class Variance Authority (`cva`), `clsx`, and `tailwind-merge` (or standard class concatenation):

```bash
npm install cva clsx tailwind-merge @radix-ui/react-slot

```

### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

## Step 4: Build Core Primitives (e.g., Button with Ripple & Slot Support)

Material Design features iconic interaction effects like **Ripples**, **Elevations**, **Polymorphic Link support**, and **Loading States**.

### 4.1 Button Variants (`src/components/Button/Button.variants.ts`)

```typescript
import { cva, type VariantProps } from 'cva';

export const buttonVariants = cva(
  'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        filled: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md',
        outlined: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800',
        text: 'bg-transparent text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      fullWidth: false,
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

```

### 4.2 Button Component Implementation (`src/components/Button/Button.tsx`)

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants, type ButtonVariantProps } from './Button.variants';
import { cn } from '../../utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, asChild = false, isLoading = false, disabled, children, onClick, ...props },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const Comp = asChild ? Slot : 'button';

    // Material Design Ripple Effect Generator
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.(e);
    };

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        onClick={handleRipple}
        {...props}
      >
        {children}

        {/* Render Material Ripple Effects */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute animate-ping rounded-full bg-white/30 pointer-events-none"
            style={{
              left: r.x - 10,
              top: r.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

```

---

## Step 5: Build Compound Overlay Components (e.g., Dialog / Modal)

A design system needs complex compound components that handle portals, focus traps, and accessibility specs (WAI-ARIA).

### 5.1 Modal Compound Component (`src/components/Dialog/Dialog.tsx`)

```tsx
import * as React from 'react';
import { createPortal } from 'react-dom';

interface DialogContextValue {
  isOpen: boolean;
  close: () => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({ children, isOpen, onClose }: { children: React.ReactNode; isOpen: boolean; onClose: () => void }) {
  return (
    <DialogContext.Provider value={{ isOpen, close: onClose }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx || !ctx.isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={ctx.close} 
      />
      {/* Surface */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        {children}
      </div>
    </div>,
    document.body
  );
}

export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4 text-xl font-bold">{children}</div>;
export const DialogBody = ({ children }: { children: React.ReactNode }) => <div className="py-2 text-gray-600 dark:text-gray-300">{children}</div>;
export const DialogFooter = ({ children }: { children: React.ReactNode }) => <div className="mt-6 flex justify-end gap-3">{children}</div>;

```

---

## Step 6: Public Export Barrel & Packaging

Structure your main package entry point so developers can import primitives cleanly.

### `src/index.ts`

```typescript
// Tokens & Theme
export * from './tokens/tokens';
export * from './theme/ThemeProvider';

// Utilities
export * from './utils/cn';

// Components
export * from './components/Button/Button';
export * from './components/Button/Button.variants';
export * from './components/Dialog/Dialog';

```

---

## Complete Feature Roadmap to Match Material Design

To achieve full feature parity with Material Design, implement these core functional domains:

| Domain                  | Key Components to Build                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **Inputs & Forms**      | `TextField` (Floating Labels), `Select` (Combobox), `Checkbox`, `Switch`, `RadioGroup`, `Slider` |
| **Navigation**          | `TopAppBar`, `Drawer` (Sidebar Navigation), `Tabs`, `Breadcrumbs`, `BottomNavigation`            |
| **Surfaces & Layout**   | `Card`, `Paper`, `Accordion`, `Grid/Flex Container`, `Divider`                                   |
| **Feedback & Overlays** | `Dialog`, `Snackbar / Toast`, `Tooltip`, `CircularProgress`, `LinearProgress`, `Badge`           |
| **Data Display**        | `DataTable` (Sorting & Pagination), `Avatar`, `Chip / Tag`, `List`                               |

---

## Key Best Practices

1. **Avoid Style Collisions:** Always merge custom CSS classes using `tailwind-merge` + `clsx` so consumer-provided `className` props override internal defaults cleanly.
2. **Polymorphism via `asChild`:** Use Radix Slot so components like buttons can transform into links or custom router components (`<Button asChild><Link to="/dashboard">Go</Link></Button>`) without illegal nested DOM structures like `<button><a>...</a></button>`.
3. **Accessibility First:** Ensure all form controls assign dynamic `id`s (`useId()`) and pass explicit `aria-expanded`, `aria-controls`, and `role` attributes.
4. **Isolated Documentation:** Document every component in **Storybook** with interactive controls for all CVA variants.

Here is a complete, production-ready React implementation for your design system components—organized cleanly by **Inputs** and **Data Display**.

This system uses **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and **Radix Primitives** to deliver Material Design-level features (floating labels, ripple animations, transfer lists, accessible tooltips, and polymorphic slots).

---

## 1. Setup & Utilities

### Installation

```bash
npm install cva clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-tooltip

```

### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

## SECTION 1: INPUTS

### 1. Button, Floating Action Button (FAB) & Button Group

#### `src/components/Button.tsx`

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden active:scale-[0.98]',
  {
    variants: {
      variant: {
        filled: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
        outlined: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200',
        text: 'bg-transparent text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800',
        fab: 'rounded-full bg-indigo-600 text-white shadow-lg hover:shadow-xl hover:bg-indigo-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-10 px-4 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-lg',
        fab: 'h-14 w-14 p-0 text-xl',
        'fab-extended': 'h-14 px-6 text-base rounded-full gap-2',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={onClick}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

// --- Button Group ---
export const ButtonGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('inline-flex rounded-md shadow-sm [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:first-child)]:-ml-px', className)} {...props}>
    {children}
  </div>
);

```

---

### 2. Text Field (With Material Floating Label) & Autocomplete

#### `src/components/TextField.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, id, className, value, defaultValue, placeholder = ' ', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={cn(
              'peer w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2 pt-4 text-sm text-gray-900 outline-none transition-all placeholder-shown:pt-3 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:text-white',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'pointer-events-none absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 dark:text-gray-400',
              error && 'text-red-500 peer-focus:text-red-500'
            )}
          >
            {label}
          </label>
        </div>
        {(error || helperText) && (
          <p className={cn('mt-1 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';

```

#### `src/components/Autocomplete.tsx`

```tsx
import * as React from 'react';
import { TextField } from './TextField';

interface Option {
  label: string;
  value: string;
}

export const Autocomplete: React.FC<{ options: Option[]; label: string; onSelect: (val: Option) => void }> = ({
  options,
  label,
  onSelect,
}) => {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative w-full">
      <TextField
        label={label}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {filtered.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                setQuery(opt.label);
                onSelect(opt);
                setIsOpen(false);
              }}
              className="cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

```

---

### 3. Number Field (New), Rating & Select

#### `src/components/NumberField.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export const NumberField: React.FC<{ label: string; value?: number; onChange?: (val: number) => void }> = ({
  label,
  value = 0,
  onChange,
}) => {
  const [val, setVal] = React.useState(value);

  const update = (newVal: number) => {
    setVal(newVal);
    onChange?.(newVal);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700">
        <button
          type="button"
          onClick={() => update(val - 1)}
          className="px-3 py-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          -
        </button>
        <span className="w-12 text-center text-sm font-medium">{val}</span>
        <button
          type="button"
          onClick={() => update(val + 1)}
          className="px-3 py-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          +
        </button>
      </div>
    </div>
  );
};

```

#### `src/components/Rating.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export const Rating: React.FC<{ max?: number; value?: number; onChange?: (val: number) => void }> = ({
  max = 5,
  value = 0,
  onChange,
}) => {
  const [hover, setHover] = React.useState<number | null>(null);
  const [rating, setRating] = React.useState(value);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, idx) => {
        const starValue = idx + 1;
        const isFilled = (hover ?? rating) >= starValue;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setRating(starValue);
              onChange?.(starValue);
            }}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            className="text-2xl text-yellow-400 focus:outline-none"
          >
            {isFilled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
};

```

---

### 4. Checkbox, Radio Group, Switch, Slider & Toggle Button

#### `src/components/InputsCollection.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

// --- Checkbox ---
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn('h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600', className)}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';

// --- Switch ---
export const Switch: React.FC<{ checked?: boolean; onChange?: (checked: boolean) => void }> = ({
  checked = false,
  onChange,
}) => {
  const [isOn, setIsOn] = React.useState(checked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={() => {
        setIsOn(!isOn);
        onChange?.(!isOn);
      }}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
        isOn ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
          isOn ? 'translate-x-5' : 'translate-x-0.5',
          'mt-0.5'
        )}
      />
    </button>
  );
};

// --- Slider ---
export const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    type="range"
    className={cn('h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600 dark:bg-gray-700', className)}
    {...props}
  />
);

// --- Toggle Button ---
export const ToggleButton: React.FC<{ active?: boolean; onClick?: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
      active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
    )}
  >
    {children}
  </button>
);

```

---

### 5. Transfer List

#### `src/components/TransferList.tsx`

```tsx
import * as React from 'react';
import { Button } from './Button';

export const TransferList: React.FC<{ left: string[]; right: string[] }> = ({ left: initialLeft, right: initialRight }) => {
  const [left, setLeft] = React.useState(initialLeft);
  const [right, setRight] = React.useState(initialRight);
  const [leftSelected, setLeftSelected] = React.useState<string[]>([]);
  const [rightSelected, setRightSelected] = React.useState<string[]>([]);

  const moveRight = () => {
    setRight([...right, ...leftSelected]);
    setLeft(left.filter((item) => !leftSelected.includes(item)));
    setLeftSelected([]);
  };

  const moveLeft = () => {
    setLeft([...left, ...rightSelected]);
    setRight(right.filter((item) => !rightSelected.includes(item)));
    setRightSelected([]);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="h-48 w-40 overflow-auto rounded-md border border-gray-300 p-2 dark:border-gray-700">
        {left.map((item) => (
          <label key={item} className="flex items-center gap-2 p-1 text-sm">
            <input
              type="checkbox"
              onChange={(e) =>
                setLeftSelected(e.target.checked ? [...leftSelected, item] : leftSelected.filter((i) => i !== item))
              }
            />
            {item}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={moveRight} disabled={leftSelected.length === 0}>
          &gt;
        </Button>
        <Button size="sm" onClick={moveLeft} disabled={rightSelected.length === 0}>
          &lt;
        </Button>
      </div>

      <div className="h-48 w-40 overflow-auto rounded-md border border-gray-300 p-2 dark:border-gray-700">
        {right.map((item) => (
          <label key={item} className="flex items-center gap-2 p-1 text-sm">
            <input
              type="checkbox"
              onChange={(e) =>
                setRightSelected(e.target.checked ? [...rightSelected, item] : rightSelected.filter((i) => i !== item))
              }
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

```

---

## SECTION 2: DATA DISPLAY

### 1. Avatar, Badge & Chip

#### `src/components/DataDisplay.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

// --- Avatar ---
export const Avatar: React.FC<{ src?: string; alt?: string; fallback: string }> = ({ src, alt, fallback }) => (
  <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
    {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : fallback}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => (
  <div className="relative inline-block">
    {children}
    <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
      {content}
    </span>
  </div>
);

// --- Chip ---
export const Chip: React.FC<{ label: string; onDelete?: () => void }> = ({ label, onDelete }) => (
  <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
    <span>{label}</span>
    {onDelete && (
      <button type="button" onClick={onDelete} className="text-gray-400 hover:text-gray-600">
        ×
      </button>
    )}
  </div>
);

```

---

### 2. Divider, Icons, List, Tooltip & Typography

#### `src/components/TypographyAndIcons.tsx`

```tsx
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../utils/cn';

// --- Divider ---
export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={cn('my-4 border-gray-200 dark:border-gray-800', className)} />
);

// --- Material Icons Wrapper ---
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  <span className={cn('material-symbols-outlined select-none text-2xl', className)}>{name}</span>
);

// --- Typography ---
export const Typography: React.FC<{ variant?: 'h1' | 'h2' | 'body' | 'caption'; children: React.ReactNode; className?: string }> = ({
  variant = 'body',
  children,
  className,
}) => {
  const styles = {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    body: 'text-base leading-relaxed',
    caption: 'text-xs text-gray-500 dark:text-gray-400',
  };

  return <p className={cn(styles[variant], className)}>{children}</p>;
};

// --- Tooltip ---
export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={4}
        className="z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-md animate-in fade-in-0 dark:bg-gray-100 dark:text-gray-900"
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-100" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

```

#### `src/components/Table.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export const Table: React.FC<{ headers: string[]; data: Record<string, React.ReactNode>[] }> = ({ headers, data }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-6 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
            {Object.values(row).map((val, cellIdx) => (
              <td key={cellIdx} className="px-6 py-4">
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

```

Here is a complete, production-ready React implementation for your design system **Feedback & Overlay** components.

This set covers **Alert**, **Backdrop**, **Dialog**, **Progress** (Linear & Circular), **Skeleton**, and **Snackbar** (Toast) using **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and **React Portals** for clean DOM overlay management.

---

## 1. Setup & Utilities

### Installation

Ensure you have the core design system utilities installed:

```bash
npm install cva clsx tailwind-merge

```

### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

## 2. Alert Component

Provides inline banner messaging with contextual variants (`info`, `success`, `warning`, `error`).

### `src/components/Alert.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm flex items-start gap-3 transition-all',
  {
    variants: {
      variant: {
        info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-200',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-200',
        warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-200',
        error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, onClose, ...props }, ref) => {
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <div className="flex-1">
          {title && <h5 className="font-semibold leading-none tracking-tight mb-1">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

```

---

## 3. Backdrop & Dialog (Modal) Components

Renders full-screen dimming overlays and accessible compound modal dialogs using React Portals.

### `src/components/Backdrop.tsx`

```tsx
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClick?: () => void;
}

export const Backdrop: React.FC<BackdropProps> = ({ open, onClick, className, children, ...props }) => {
  if (!open) return null;

  return createPortal(
    <div
      onClick={onClick}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0',
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};

```

### `src/components/Dialog.tsx`

```tsx
import * as React from 'react';
import { Backdrop } from './Backdrop';
import { cn } from '../utils/cn';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <Backdrop open={open} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from bubbling up
        className={cn(
          'relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in zoom-in-95',
          className
        )}
      >
        {children}
      </div>
    </Backdrop>
  );
}

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100', className)} {...props} />
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)} {...props} />
);

export const DialogActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('mt-6 flex items-center justify-end gap-3', className)} {...props} />
);

```

---

## 4. Progress Indicators (Linear & Circular)

Shows loading or deterministic progress percentage states.

### `src/components/Progress.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

// --- Linear Progress ---
export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // If undefined, renders an indeterminate loading animation
}

export const LinearProgress: React.FC<LinearProgressProps> = ({ value, className, ...props }) => {
  const isIndeterminate = value === undefined;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500',
          isIndeterminate && 'w-full origin-left animate-pulse'
        )}
        style={{ width: isIndeterminate ? '100%' : `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

// --- Circular Progress ---
export interface CircularProgressProps extends React.SVGAttributes<SVGSVGElement> {
  value?: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 40,
  strokeWidth = 3.5,
  className,
  ...props
}) => {
  const isIndeterminate = value === undefined;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = isIndeterminate ? 0 : circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(isIndeterminate && 'animate-spin', className)}
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-20 text-indigo-600"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-indigo-600 transition-all duration-300 ease-out"
      />
    </svg>
  );
};

```

---

## 5. Skeleton Component

Pulsing placeholder shape used during data-fetching states.

### `src/components/Skeleton.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'rectangular', className, ...props }) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn('animate-pulse bg-gray-200 dark:bg-gray-800', variantStyles[variant], className)}
      {...props}
    />
  );
};

```

---

## 6. Snackbar (Toast) System

Provides temporary toast notifications with automatic dismissal timer logic and dynamic placement.

### `src/components/Snackbar.tsx`

```tsx
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export interface SnackbarProps {
  open: boolean;
  message: React.ReactNode;
  action?: React.ReactNode;
  autoHideDuration?: number; // milliseconds
  onClose: () => void;
  className?: string;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  action,
  autoHideDuration = 4000,
  onClose,
  className,
}) => {
  React.useEffect(() => {
    if (!open || !autoHideDuration) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between gap-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-gray-100 dark:text-gray-900 min-w-[280px] max-w-md animate-in slide-in-from-bottom-5',
        className
      )}
    >
      <div className="flex-1 font-medium">{message}</div>
      {action && <div className="flex items-center gap-2">{action}</div>}
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-white dark:hover:text-gray-900 focus:outline-none"
        aria-label="Close snackbar"
      >
        ✕
      </button>
    </div>,
    document.body
  );
};

```

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { Alert } from './components/Alert';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from './components/Dialog';
import { LinearProgress, CircularProgress } from './components/Progress';
import { Skeleton } from './components/Skeleton';
import { Snackbar } from './components/Snackbar';

export function FeedbackDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <div className="p-8 max-w-xl space-y-6">
      {/* Alert */}
      <Alert variant="success" title="Success!" onClose={() => alert('Closed')}>
        Your changes have been saved successfully.
      </Alert>

      {/* Progress */}
      <div className="space-y-2">
        <LinearProgress value={60} />
        <CircularProgress />
      </div>

      {/* Skeletons */}
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>

      {/* Dialog Controls */}
      <button
        onClick={() => setDialogOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium"
      >
        Open Dialog
      </button>

      {/* Snackbar Controls */}
      <button
        onClick={() => setSnackbarOpen(true)}
        className="px-4 py-2 border border-gray-300 rounded-md font-medium"
      >
        Trigger Snackbar
      </button>

      {/* Dialog Overlay */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to proceed? This action cannot be undone.
        </DialogDescription>
        <DialogActions>
          <button
            onClick={() => setDialogOpen(false)}
            className="px-3 py-1.5 text-sm font-medium border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => setDialogOpen(false)}
            className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        message="Item archived successfully"
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
}

```

Here is a complete, production-ready React implementation for your **Surfaces** design system components: **Accordion**, **App Bar**, **Card**, and **Paper**.

These components use **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and accessible ARIA attributes to create clean, Material-inspired surfaces.

---

## 1. Setup & Utilities

### Installation

```bash
npm install cva clsx tailwind-merge

```

### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

## 2. Paper & Card Components

**Paper** is the foundation surface element providing background fills, borders, and elevation/shadow levels. **Card** builds on top of Paper to provide structured layout slots (`CardHeader`, `CardMedia`, `CardContent`, and `CardActions`).

### `src/components/Surfaces.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

// --- Paper Surface Component ---
const paperVariants = cva('rounded-xl transition-shadow duration-200 text-gray-900 dark:text-gray-100', {
  variants: {
    variant: {
      elevation: 'bg-white dark:bg-gray-900',
      outlined: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    },
    elevation: {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow-md',
      3: 'shadow-lg',
      4: 'shadow-xl',
    },
  },
  defaultVariants: {
    variant: 'elevation',
    elevation: 1,
  },
});

export interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, variant, elevation, ...props }, ref) => (
    <div ref={ref} className={cn(paperVariants({ variant, elevation, className }))} {...props} />
  )
);
Paper.displayName = 'Paper';

// --- Card Component Suite ---
export interface CardProps extends PaperProps {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'outlined', elevation = 0, ...props }, ref) => (
    <Paper ref={ref} variant={variant} elevation={elevation} className={cn('overflow-hidden', className)} {...props} />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-2 flex flex-col gap-1', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold tracking-tight leading-none', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardMedia = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = '', ...props }, ref) => (
    <img ref={ref} alt={alt} className={cn('w-full h-48 object-cover', className)} {...props} />
  )
);
CardMedia.displayName = 'CardMedia';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 text-sm text-gray-700 dark:text-gray-300', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0 flex items-center justify-end gap-2', className)} {...props} />
  )
);
CardActions.displayName = 'CardActions';

```

---

## 3. App Bar Component

Provides top application navigation bars with support for sticky positioning, fixed headers, and flexible action layouts.

### `src/components/AppBar.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

const appBarVariants = cva('w-full flex items-center transition-colors z-40', {
  variants: {
    position: {
      fixed: 'fixed top-0 left-0 right-0',
      sticky: 'sticky top-0',
      static: 'relative',
    },
    color: {
      default: 'bg-white text-gray-900 border-b border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800',
      primary: 'bg-indigo-600 text-white shadow-md',
      transparent: 'bg-transparent text-current',
    },
  },
  defaultVariants: {
    position: 'sticky',
    color: 'default',
  },
});

export interface AppBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appBarVariants> {}

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  ({ className, position, color, ...props }, ref) => (
    <header ref={ref} className={cn(appBarVariants({ position, color, className }))} {...props} />
  )
);
AppBar.displayName = 'AppBar';

export const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between min-h-[64px] px-4 w-full gap-4', className)} {...props} />
  )
);
Toolbar.displayName = 'Toolbar';

```

---

## 4. Accordion Component Suite

Supports expanding/collapsing sections with keyboard navigation (`Enter` / `Space`), smooth transitions, and multi-expand or single-expand state management.

### `src/components/Accordion.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

interface AccordionContextValue {
  expandedValues: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion sub-components must be rendered within <Accordion>.');
  return ctx;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ type = 'single', defaultValue, children, className }: AccordionProps) {
  const [expandedValues, setExpandedValues] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = React.useCallback(
    (value: string) => {
      setExpandedValues((prev) => {
        if (type === 'single') {
          return prev.includes(value) ? [] : [value];
        }
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ expandedValues, toggleItem }}>
      <div className={cn('divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// --- Accordion Item Context ---
interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { expandedValues } = useAccordionContext();
    const isOpen = expandedValues.includes(value);
    const triggerId = React.useId();
    const contentId = React.useId();

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
        <div ref={ref} className={cn('overflow-hidden', className)} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

export const AccordionSummary = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const { toggleItem } = useAccordionContext();
    const { value, isOpen, triggerId, contentId } = React.useContext(AccordionItemContext)!;

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={(e) => {
          onClick?.(e);
          toggleItem(value);
        }}
        className={cn(
          'flex w-full items-center justify-between py-4 text-left font-medium text-sm transition-all hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
          className
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            'ml-2 transform text-xs transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        >
          ▼
        </span>
      </button>
    );
  }
);
AccordionSummary.displayName = 'AccordionSummary';

export const AccordionDetails = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, triggerId, contentId } = React.useContext(AccordionItemContext)!;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={cn('pb-4 text-sm text-gray-600 dark:text-gray-300 animate-in fade-in-0 duration-200', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionDetails.displayName = 'AccordionDetails';

```

---

## Usage Example

```tsx
import React from 'react';
import { AppBar, Toolbar } from './components/AppBar';
import { Paper, Card, CardHeader, CardTitle, CardDescription, CardMedia, CardContent, CardActions } from './components/Surfaces';
import { Accordion, AccordionItem, AccordionSummary, AccordionDetails } from './components/Accordion';

export function SurfacesDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-8 max-w-3xl mx-auto">
      {/* App Bar */}
      <AppBar color="primary">
        <Toolbar>
          <span className="font-semibold text-lg">My Application</span>
          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm">
            Logout
          </button>
        </Toolbar>
      </AppBar>

      {/* Paper Surface */}
      <Paper elevation={2} className="p-6 space-y-2">
        <h2 className="text-xl font-bold">Paper Elevation Surface</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Paper components provide standard container styling and elevated shadow levels.
        </p>
      </Paper>

      {/* Card Suite */}
      <Card variant="outlined">
        <CardMedia
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
          alt="Artwork"
        />
        <CardHeader>
          <CardTitle>Featured Artwork</CardTitle>
          <CardDescription>Created by Design System Team</CardDescription>
        </CardHeader>
        <CardContent>
          This card component demonstrates a complete composite surface layout with structured media, headers, and action areas.
        </CardContent>
        <CardActions>
          <button className="px-3 py-1.5 text-sm font-medium border rounded-md">Share</button>
          <button className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md">Learn More</button>
        </CardActions>
      </Card>

      {/* Accordion */}
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionSummary>What is a design system surface?</AccordionSummary>
          <AccordionDetails>
            Surfaces are background elements (cards, sheets, paper, dialogs) that organize content into distinct visual groups using elevation and boundaries.
          </AccordionDetails>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionSummary>Is it accessible?</AccordionSummary>
          <AccordionDetails>
            Yes, the Accordion includes correct ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`) and keyboard trigger handlers out of the box.
          </AccordionDetails>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

```

Here is a complete, production-ready React implementation for your **Navigation** design system components: **Drawer** (Sidebar Navigation), **Tabs**, and **Breadcrumbs**.

These components utilize **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and **React Portals** with full keyboard accessibility.

---

### 1. Drawer (Sidebar Navigation) Component

The **Drawer** slides in from screen edges (left, right, top, bottom) to display navigation links or contextual settings, backed by an accessible backdrop portal and escape key handler.

```tsx
// src/components/Drawer.tsx
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

const drawerVariants = cva(
  'fixed z-50 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-900 border-gray-200 dark:border-gray-800',
  {
    variants: {
      anchor: {
        left: 'top-0 left-0 bottom-0 h-full border-r animate-in slide-in-from-left',
        right: 'top-0 right-0 bottom-0 h-full border-l animate-in slide-in-from-right',
        top: 'top-0 left-0 right-0 w-full border-b animate-in slide-in-from-top',
        bottom: 'bottom-0 left-0 right-0 w-full border-t animate-in slide-in-from-bottom',
      },
      size: {
        sm: 'max-w-xs w-full',
        md: 'max-w-md w-full',
        lg: 'max-w-lg w-full',
        full: 'w-screen h-screen',
      },
    },
    defaultVariants: {
      anchor: 'left',
      size: 'sm',
    },
  }
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  anchor = 'left',
  size = 'sm',
  className,
  children,
  ...props
}) => {
  // Lock body scroll and register Escape key listener
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(drawerVariants({ anchor, size, className }))}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DrawerHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('mb-4 flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800', className)} {...props} />
);

export const DrawerTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)} {...props} />
);

export const DrawerBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex-1 overflow-y-auto py-2', className)} {...props} />
);

```

---

### 2. Tabs Component Suite

Supports switching views with keyboard arrow navigation (`ArrowRight` / `ArrowLeft`), active indicator states, and full ARIA tabs contract (`role="tablist"`, `role="tab"`, `role="tabpanel"`).

```tsx
// src/components/Tabs.tsx
import * as React from 'react';
import { cn } from '../utils/cn';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs sub-components must be rendered within <Tabs>.');
  return ctx;
}

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value: controlledValue, onChange, children, className }: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : uncontrolledValue;
  const baseId = React.useId();

  const setActiveTab = React.useCallback(
    (val: string) => {
      if (!isControlled) setUncontrolledValue(val);
      onChange?.(val);
    },
    [isControlled, onChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => listRef.current!);

    // Handle Keyboard Navigation (Arrow keys)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!listRef.current) return;
      const tabs = Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
        tabs[prevIndex].click();
      }
    };

    return (
      <div
        ref={listRef}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={cn('inline-flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, onClick, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId } = useTabsContext();
    const isSelected = activeTab === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <button
        ref={ref}
        id={tabId}
        role="tab"
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        onClick={(e) => {
          onClick?.(e);
          setActiveTab(value);
        }}
        className={cn(
          'relative px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
          isSelected
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-semibold'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, baseId } = useTabsContext();
    const isSelected = activeTab === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        className={cn('pt-4 text-sm text-gray-700 dark:text-gray-300 focus:outline-none animate-in fade-in-0 duration-150', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

```

---

### 3. Breadcrumbs Component

Displays navigational hierarchy, with customizable separator icons and `aria-label="Breadcrumb"` support for accessibility readers.

```tsx
// src/components/Breadcrumbs.tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ separator = '/', className, children, ...props }, ref) => {
    const items = React.Children.toArray(children);

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('flex items-center text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((child, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={index}>
                <li className={cn(isLast && 'font-semibold text-gray-900 dark:text-gray-100')} aria-current={isLast ? 'page' : undefined}>
                  {child}
                </li>
                {!isLast && (
                  <span className="text-gray-400 select-none px-1" aria-hidden="true">
                    {separator}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = 'Breadcrumbs';

export interface BreadcrumbItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const BreadcrumbItem = React.forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  ({ active, className, href, children, ...props }, ref) => {
    if (active || !href) {
      return (
        <span className={cn('text-gray-900 dark:text-gray-100 font-medium', className)}>
          {children}
        </span>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={cn('hover:underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors', className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

```

---

### 4. Comprehensive Usage Example

```tsx
import React, { useState } from 'react';
import { Drawer, DrawerHeader, DrawerTitle, DrawerBody } from './components/Drawer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import { Breadcrumbs, BreadcrumbItem } from './components/Breadcrumbs';

export function NavigationDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumbs */}
      <div>
        <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2">Breadcrumbs</h3>
        <Breadcrumbs separator="›">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
          <BreadcrumbItem active>Navigation</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* 2. Tabs */}
      <div>
        <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2">Tabs</h3>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Manage your personal account details, profile picture, and email settings.
          </TabsContent>
          <TabsContent value="security">
            Configure two-factor authentication (2FA) and update your password.
          </TabsContent>
          <TabsContent value="notifications">
            Manage email notifications and desktop push alerts.
          </TabsContent>
        </Tabs>
      </div>

      {/* 3. Drawer */}
      <div>
        <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2">Drawer</h3>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Open Navigation Drawer
        </button>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="sm">
          <DrawerHeader>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </DrawerHeader>
          <DrawerBody className="space-y-2">
            <a href="#dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
              Dashboard
            </a>
            <a href="#analytics" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
              Analytics
            </a>
            <a href="#projects" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
              Projects
            </a>
          </DrawerBody>
        </Drawer>
      </div>
    </div>
  );
}

```

Here is a complete, production-ready React implementation for core **Layout** design system primitives: **Box**, **Stack**, **Grid**, and **Container**.

These components use **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and **polymorphic slots (`asChild`)** to eliminate arbitrary `<div>` wrapping and unmaintainable layout CSS.

---

### 1. Setup & Utilities

Ensure you have the core design system utilities installed:

```bash
npm install cva clsx tailwind-merge @radix-ui/react-slot

```

#### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### 2. Box Component (Polymorphic Foundation)

`Box` is the foundational primitive of your design system. It handles arbitrary spacing, borders, background fills, and polymorphism (`asChild`) so it can render as any HTML element (`<section>`, `<article>`, `<header>`, `<a>`).

```tsx
// src/components/Box.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../utils/cn';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Box.displayName = 'Box';

```

---

### 3. Stack Component (1D Layouts: Vertical & Horizontal)

`Stack` manages 1-dimensional layouts (rows or columns) with consistent spacing between children, alignment control, and flex wrap rules.

```tsx
// src/components/Stack.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { Box, type BoxProps } from './Box';
import { cn } from '../utils/cn';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

export interface StackProps extends BoxProps, VariantProps<typeof stackVariants> {}

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  ({ className, direction, gap, align, justify, wrap, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn(stackVariants({ direction, gap, align, justify, wrap, className }))}
      {...props}
    />
  )
);
Stack.displayName = 'Stack';

```

---

### 4. Grid Component (2D Multi-Column Layouts)

`Grid` provides a 2-dimensional grid system supporting fixed column counts (`cols`), auto-responsive fitting (`auto-fit`/`auto-fill`), and responsive grid spans.

```tsx
// src/components/Grid.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { Box, type BoxProps } from './Box';
import { cn } from '../utils/cn';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-12',
      'auto-fit': 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
      'auto-fill': 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
});

export interface GridProps extends BoxProps, VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => (
    <Box ref={ref} className={cn(gridVariants({ cols, gap, className }))} {...props} />
  )
);
Grid.displayName = 'Grid';

// --- Grid Item Sub-Component ---
const gridItemVariants = cva('', {
  variants: {
    span: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      6: 'col-span-6',
      12: 'col-span-12',
      full: 'col-span-full',
    },
  },
  defaultVariants: {
    span: 1,
  },
});

export interface GridItemProps extends BoxProps, VariantProps<typeof gridItemVariants> {}

export const GridItem = React.forwardRef<HTMLElement, GridItemProps>(
  ({ className, span, ...props }, ref) => (
    <Box ref={ref} className={cn(gridItemVariants({ span, className }))} {...props} />
  )
);
GridItem.displayName = 'GridItem';

```

---

### 5. Container Component (Viewport Alignment & Boundaries)

`Container` centers your page content horizontally and constrains maximum viewport width according to breakpoint scales.

```tsx
// src/components/Container.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';
import { Box, type BoxProps } from './Box';
import { cn } from '../utils/cn';

const containerVariants = cva('w-full mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[96rem]',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

export interface ContainerProps extends BoxProps, VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <Box ref={ref} className={cn(containerVariants({ size, className }))} {...props} />
  )
);
Container.displayName = 'Container';

```

---

### 6. Comprehensive Usage Example

Here is how these layout components combine to build clean, maintainable application structures without custom CSS flex/grid rules:

```tsx
import React from 'react';
import { Container } from './components/Container';
import { Stack } from './components/Stack';
import { Grid, GridItem } from './components/Grid';
import { Box } from './components/Box';

export function LayoutDemo() {
  return (
    <Container size="lg" className="py-12">
      {/* 1. Stack for Vertical Page Sectioning */}
      <Stack gap="xl">
        <Box asChild>
          <header className="border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm">Layout Primitives in Action</p>
          </header>
        </Box>

        {/* 2. Responsive Multi-Column Grid */}
        <Grid cols={3} gap="lg">
          <Box className="p-6 rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <Stack gap="xs">
              <span className="text-xs font-semibold text-gray-400 uppercase">Total Revenue</span>
              <span className="text-2xl font-bold">$45,231.89</span>
            </Stack>
          </Box>

          <Box className="p-6 rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <Stack gap="xs">
              <span className="text-xs font-semibold text-gray-400 uppercase">Subscriptions</span>
              <span className="text-2xl font-bold">+2,350</span>
            </Stack>
          </Box>

          <Box className="p-6 rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <Stack gap="xs">
              <span className="text-xs font-semibold text-gray-400 uppercase">Active Now</span>
              <span className="text-2xl font-bold">+573</span>
            </Stack>
          </Box>
        </Grid>

        {/* 3. Horizontal Stack Action Toolbar */}
        <Stack direction="row" justify="between" align="center" className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
          <span className="text-sm font-medium">Selected: 3 items</span>
          
          <Stack direction="row" gap="sm">
            <button className="px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-900">
              Export CSV
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white font-medium">
              Bulk Action
            </button>
          </Stack>
        </Stack>

        {/* 4. Grid Spans for Sidebar / Content Split */}
        <Grid cols={12} gap="lg">
          <GridItem span={4} className="p-6 border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800">
            <h3 className="font-semibold text-base mb-2">Sidebar Filter</h3>
            <p className="text-xs text-gray-500">Spans 4 of 12 columns</p>
          </GridItem>

          <GridItem span={8} className="p-6 border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800">
            <h3 className="font-semibold text-base mb-2">Main Content Table</h3>
            <p className="text-xs text-gray-500">Spans 8 of 12 columns</p>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}

```

Documenting layout primitives in **Storybook** (v8+) requires visual aids (like colored boxes or outline borders) so developers can clearly see padding, spacing gaps, direction changes, and grid column spans.

Here is a complete setup for documenting **Box**, **Stack**, **Grid**, and **Container** using Storybook's `autodocs` and interactive controls.

---

## 1. Helper Placeholder Component for Layout Stories

Create a helper `Placeholder` component to render inside layout stories so spacing boundaries are immediately visible in the Storybook canvas:

```tsx
// src/components/Layout/stories/Placeholder.tsx
import React from 'react';

export const Placeholder: React.FC<{ children?: React.ReactNode; height?: string }> = ({
  children = 'Box',
  height = 'h-16',
}) => (
  <div
    className={`flex ${height} w-full items-center justify-center rounded-md border-2 border-dashed border-indigo-400 bg-indigo-50 p-3 text-xs font-semibold text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300`}
  >
    {children}
  </div>
);

```

---

## 2. Story 1: Box Component (`Box.stories.tsx`)

Demonstrates polymorphism (`asChild`) and custom styling overrides.

```tsx
// src/components/Box/Box.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Design System/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
      description: 'Render as child element using Radix Slot (polymorphism)',
    },
    className: {
      control: 'text',
      description: 'Custom Tailwind or CSS class overrides',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    className: 'p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-800',
    children: <p className="text-sm font-medium">This is a Box primitive acting as a styled surface.</p>,
  },
};

// Polymorphic Link Story
export const AsPolymorphicElement: Story = {
  args: {
    asChild: true,
    children: (
      <a
        href="https://storybook.js.org"
        target="_blank"
        rel="noreferrer"
        className="inline-block p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Rendered as an &lt;a&gt; tag via asChild
      </a>
    ),
  },
};

```

---

## 3. Story 2: Stack Component (`Stack.stories.tsx`)

Documents 1D directional alignment, custom gaps, and wrap behaviors.

```tsx
// src/components/Stack/Stack.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack } from './Stack';
import { Placeholder } from './stories/Placeholder';

const meta: Meta<typeof Stack> = {
  title: 'Design System/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['column', 'row', 'column-reverse', 'row-reverse'],
      description: 'Flex direction axis',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Spacing gap between stack items',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    wrap: {
      control: 'boolean',
    },
  },
  args: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const VerticalColumn: Story = {
  render: (args) => (
    <Stack {...args}>
      <Placeholder>Item 1</Placeholder>
      <Placeholder>Item 2</Placeholder>
      <Placeholder>Item 3</Placeholder>
    </Stack>
  ),
};

export const HorizontalRow: Story = {
  args: {
    direction: 'row',
    align: 'center',
    justify: 'between',
  },
  render: (args) => (
    <Stack {...args}>
      <Placeholder>Left Action</Placeholder>
      <Placeholder>Center Status</Placeholder>
      <Placeholder>Right Action</Placeholder>
    </Stack>
  ),
};

```

---

## 4. Story 3: Grid & GridItem Component (`Grid.stories.tsx`)

Documents multi-column grids, auto-responsive fitting, and column spans.

```tsx
// src/components/Grid/Grid.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid, GridItem } from './Grid';
import { Placeholder } from './stories/Placeholder';

const meta: Meta<typeof Grid> = {
  title: 'Design System/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12, 'auto-fit', 'auto-fill'],
      description: 'Number of columns or auto-responsive pattern',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    cols: 3,
    gap: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
  render: (args) => (
    <Grid {...args}>
      <Placeholder>Card 1</Placeholder>
      <Placeholder>Card 2</Placeholder>
      <Placeholder>Card 3</Placeholder>
      <Placeholder>Card 4</Placeholder>
      <Placeholder>Card 5</Placeholder>
      <Placeholder>Card 6</Placeholder>
    </Grid>
  ),
};

export const TwelveColumnSpans: Story = {
  args: {
    cols: 12,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem span={4}>
        <Placeholder>Span 4 (Sidebar)</Placeholder>
      </GridItem>
      <GridItem span={8}>
        <Placeholder>Span 8 (Main Content)</Placeholder>
      </GridItem>
      <GridItem span={12}>
        <Placeholder>Span 12 (Full Footer)</Placeholder>
      </GridItem>
    </Grid>
  ),
};

export const AutoFitResponsive: Story = {
  args: {
    cols: 'auto-fit',
    gap: 'lg',
  },
  render: (args) => (
    <Grid {...args}>
      <Placeholder>Auto-fit Item 1</Placeholder>
      <Placeholder>Auto-fit Item 2</Placeholder>
      <Placeholder>Auto-fit Item 3</Placeholder>
      <Placeholder>Auto-fit Item 4</Placeholder>
    </Grid>
  ),
};

```

---

## 5. Story 4: Container Component (`Container.stories.tsx`)

Documents viewport boundary constraints and horizontal centering.

```tsx
// src/components/Container/Container.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Design System/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum width breakpoint boundary',
    },
  },
  args: {
    size: 'lg',
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const InteractiveBoundary: Story = {
  render: (args) => (
    <div className="w-full bg-gray-100 py-8 dark:bg-gray-950">
      <Container {...args} className="bg-white p-6 shadow-md rounded-xl dark:bg-gray-900">
        <h3 className="text-lg font-bold">Container Boundary ({args.size})</h3>
        <p className="text-sm text-gray-500 mt-1">
          Resize your viewport or change the size control above to see max-width constraints.
        </p>
      </Container>
    </div>
  ),
};

```

---

## Interactive Features Result in Storybook

1. **Controls Panel:** Developers can switch `direction="row"` to `direction="column"` or adjust `gap="sm"` to `gap="xl"` in real-time.
2. **Autodocs Tab:** Storybook parses your TypeScript `Props` interfaces and produces clean, automated documentation tables for props, default values, and JSDoc descriptions.

To build, bundle, and publish a React design system library to NPM, **tsup** (powered by `esbuild`) is the modern standard. It handles ESM/CJS dual builds, outputs TypeScript declaration files (`.d.ts`), and bundles CSS assets with zero complex configuration.

Here is a complete setup for configuring `tsup` and `package.json`.

---

## 1. Project Directory Structure

Ensure your library repository is structured so components and utilities exit through a central entry file (`src/index.ts`):

```text
my-design-system/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   └── Modal/
│   ├── utils/
│   │   └── cn.ts
│   └── index.ts        # Central public export barrel
├── dist/               # Generated output build folder
├── tsup.config.ts      # tsup Bundler Configuration
├── tsconfig.json       # TypeScript Configuration
└── package.json        # NPM Package Manifest & Scripts

```

---

## 2. Install Development Dependencies

Install `tsup`, `typescript`, `react`, `react-dom`, and styling helpers as development/peer dependencies:

```bash
npm install -D tsup typescript @types/react @types/react-dom

```

---

## 3. Configure `tsup.config.ts`

Create a `tsup.config.ts` file in the project root. This configuration generates both **ES Modules (`esm`)** and **CommonJS (`cjs`)** formats, generates type declaration maps, and injects directives like `'use client'` for React 18/19 Server Component compatibility.

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  // 1. Entry point(s) to bundle
  entry: ['src/index.ts'],

  // 2. Output formats (ESM for modern bundlers, CJS for legacy Node/Webpack)
  format: ['cjs', 'esm'],

  // 3. Output directory
  outDir: 'dist',

  // 4. Generate TypeScript type declaration files (.d.ts)
  dts: true,

  // 5. Clean output directory before every build
  clean: true,

  // 6. Source maps for debugging in consuming projects
  sourcemap: true,

  // 7. Minify output in production builds
  minify: true,

  // 8. Bundle external CSS/Tailwind rules into a single dist/index.css
  injectStyle: false, // Set to true if you want CSS injected directly into JS bundle

  // 9. Preserve 'use client' directives for Next.js / React Server Components
  banner: {
    js: "'use client';",
  },

  // 10. Externalize peer dependencies so react/react-dom aren't duplicated
  external: ['react', 'react-dom'],
});

```

---

## 4. Configure `package.json` for NPM Publishing

Your `package.json` must explicitly define the entry points using the **Modern Package Exports Specification** so bundlers (Vite, Next.js, Webpack) resolve the correct files.

```json
{
  "name": "@your-org/design-system",
  "version": "1.0.0",
  "description": "Enterprise React Design System Library",
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "private": false,
  
  // Package Entry Points
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  
  // Conditional Exports Map (Modern Node/Bundler resolution)
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./dist/index.css": "./dist/index.css"
  },
  
  // Files to include in published NPM package (excludes tests/stories)
  "files": [
    "dist"
  ],
  
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "prepublishOnly": "npm run build"
  },
  
  // Peer Dependencies: Consuming app must provide these
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    },
    "react-dom": {
      "optional": false
    }
  },
  
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  }
}

```

---

## 5. Configure `tsconfig.json`

Ensure TypeScript is configured for library mode without emitting `.js` files directly (since `tsup` handles transpilation):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}

```

---

## 6. Build and Publish Steps

### Step 1: Run Build Test Locally

Execute `tsup` to verify the generated bundle in `dist/`:

```bash
npm run build

```

This generates:

* `dist/index.js` (ES Module format)
* `dist/index.cjs` (CommonJS format)
* `dist/index.d.ts` (TypeScript types)
* `dist/index.css` (Styles)

### Step 2: Test Locally (`npm pack`)

Before publishing live to NPM, test your output locally by creating a tarball:

```bash
npm pack

```

This generates `@your-org-design-system-1.0.0.tgz`. In an external test application, install it directly:

```bash
npm install ../path/to/your-org-design-system-1.0.0.tgz

```

### Step 3: Publish to NPM

1. **Log in to NPM:**

```bash
npm login

```

1. **Publish Package:**

* For standard public package:

```bash
npm publish

```

* For scoped package (e.g., `@my-org/ui`):

```bash
npm publish --access public

```

---

## How Consumers Use Your Published Library

Once published, consumers install your design system and import components with full TypeScript support and auto-complete:

```tsx
// Consuming App Code
import { Button, Stack, Container } from '@your-org/design-system';
import '@your-org/design-system/dist/index.css'; // Optional if CSS is externalized

export function Dashboard() {
  return (
    <Container size="lg">
      <Stack gap="md">
        <h1>Welcome</h1>
        <Button variant="primary">Click Me</Button>
      </Stack>
    </Container>
  );
}

```

Here is a complete, production-ready React implementation for all **Navigation** design system components built from scratch: **Bottom Navigation**, **Breadcrumbs**, **Drawer**, **Link**, **Menu**, **Menubar**, **Pagination**, **Speed Dial**, **Stepper**, and **Tabs**.

This suite uses **TypeScript**, **Class Variance Authority (`cva`)**, **`clsx` + `tailwind-merge**`, and **React Portals** for overlays.

---

### Setup & Utilities

```bash
npm install cva clsx tailwind-merge @radix-ui/react-slot

```

#### Class Merging Helper (`src/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### 1. Link & Breadcrumbs

#### `src/components/Link.tsx`

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'cva';
import { cn } from '../utils/cn';

const linkVariants = cva(
  'inline-flex items-center gap-1 font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm',
  {
    variants: {
      underline: {
        always: 'underline',
        hover: 'no-underline hover:underline',
        none: 'no-underline',
      },
    },
    defaultVariants: {
      underline: 'hover',
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, underline, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return <Comp ref={ref} className={cn(linkVariants({ underline, className }))} {...props} />;
  }
);
Link.displayName = 'Link';

```

#### `src/components/Breadcrumbs.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ separator = '/', className, children, ...props }, ref) => {
    const items = React.Children.toArray(children);

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('flex items-center text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((child, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <li aria-current={isLast ? 'page' : undefined}>{child}</li>
                {!isLast && (
                  <span className="text-gray-400 select-none px-1" aria-hidden="true">
                    {separator}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = 'Breadcrumbs';

```

---

### 2. Tabs & Bottom Navigation

#### `src/components/Tabs.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, value, onChange, children, className }: {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue || '');
  const activeTab = value !== undefined ? value : uncontrolled;

  const setActiveTab = React.useCallback((val: string) => {
    if (value === undefined) setUncontrolled(val);
    onChange?.(val);
  }, [value, onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div role="tablist" className={cn('flex border-b border-gray-200 dark:border-gray-800', className)} {...props} />
);

export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  const ctx = React.useContext(TabsContext)!;
  const isSelected = ctx.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
        isSelected
          ? 'border-indigo-600 text-indigo-600 font-semibold dark:text-indigo-400 dark:border-indigo-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400',
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.activeTab !== value) return null;
  return <div role="tabpanel" className={cn('pt-4 text-sm', className)}>{children}</div>;
};

```

#### `src/components/BottomNavigation.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export const BottomNavigation: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900',
      className
    )}
    {...props}
  />
);

export const BottomNavigationAction: React.FC<{
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center gap-1 transition-colors px-3 py-1 text-xs font-medium',
      active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
    )}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

```

---

### 3. Drawer & Pagination

#### `src/components/Drawer.tsx`

```tsx
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 h-full w-72 bg-white p-6 shadow-xl dark:bg-gray-900 animate-in slide-in-from-left">
        {children}
      </div>
    </div>,
    document.body
  );
}

```

#### `src/components/Pagination.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface PaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ count, page, onChange }) => {
  return (
    <nav aria-label="Pagination Navigation" className="flex items-center gap-1">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Prev
      </button>

      {Array.from({ length: count }).map((_, idx) => {
        const p = idx + 1;
        const isCurrent = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              'rounded border px-3 py-1.5 text-sm font-medium transition-colors',
              isCurrent
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        disabled={page >= count}
        onClick={() => onChange(page + 1)}
        className="rounded border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Next
      </button>
    </nav>
  );
};

```

---

### 4. Menu & Menubar (New)

#### `src/components/Menu.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export const Menu: React.FC<{ trigger: React.ReactNode; children: React.ReactNode }> = ({ trigger, children }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-in fade-in-0 zoom-in-95">
          {children}
        </div>
      )}
    </div>
  );
};

export const MenuItem: React.FC<{ onClick?: () => void; children: React.ReactNode; disabled?: boolean }> = ({
  onClick,
  children,
  disabled,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-800"
  >
    {children}
  </button>
);

// --- Menubar ---
export const Menubar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    {children}
  </div>
);

```

---

### 5. Stepper & Speed Dial

#### `src/components/Stepper.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface Step {
  label: string;
  description?: string;
}

export const Stepper: React.FC<{ steps: Step[]; activeStep: number }> = ({ steps, activeStep }) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;

        return (
          <React.Fragment key={step.label}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isCompleted && 'bg-emerald-600 text-white',
                  isActive && 'bg-indigo-600 text-white',
                  !isCompleted && !isActive && 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                )}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{step.label}</span>
                {step.description && <span className="text-xs text-gray-400">{step.description}</span>}
              </div>
            </div>
            {idx < steps.length - 1 && <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-800" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

```

#### `src/components/SpeedDial.tsx`

```tsx
import * as React from 'react';
import { cn } from '../utils/cn';

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const SpeedDial: React.FC<{ actions: SpeedDialAction[] }> = ({ actions }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {open && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-5">
          {actions.map((act, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                act.onClick();
                setOpen(false);
              }}
              title={act.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {act.icon}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-lg transition-transform hover:bg-indigo-700 active:scale-95"
      >
        {open ? '✕' : '+'}
      </button>
    </div>
  );
};

```

---

### Comprehensive Usage Showcase

```tsx
import React, { useState } from 'react';
import { Link } from './components/Link';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import { BottomNavigation, BottomNavigationAction } from './components/BottomNavigation';
import { Pagination } from './components/Pagination';
import { Menu, MenuItem, Menubar } from './components/Menu';
import { Stepper } from './components/Stepper';
import { SpeedDial } from './components/SpeedDial';

export function NavigationShowcase() {
  const [page, setPage] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-24">
      {/* 1. Breadcrumbs & Link */}
      <Breadcrumbs separator="›">
        <Link href="/">Home</Link>
        <Link href="/docs">Docs</Link>
        <span>Navigation</span>
      </Breadcrumbs>

      {/* 2. Stepper */}
      <Stepper
        activeStep={activeStep}
        steps={[{ label: 'Account' }, { label: 'Payment' }, { label: 'Confirmation' }]}
      />
      <div className="flex gap-2">
        <button onClick={() => setActiveStep((s) => Math.max(0, s - 1))} className="px-3 py-1 border rounded text-xs">Back</button>
        <button onClick={() => setActiveStep((s) => Math.min(2, s + 1))} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Next</button>
      </div>

      {/* 3. Menubar & Dropdown Menu */}
      <Menubar>
        <Menu trigger={<button className="px-3 py-1 text-sm font-medium">File</button>}>
          <MenuItem onClick={() => alert('New File')}>New File</MenuItem>
          <MenuItem onClick={() => alert('Save')}>Save</MenuItem>
        </Menu>
        <Menu trigger={<button className="px-3 py-1 text-sm font-medium">Edit</button>}>
          <MenuItem onClick={() => alert('Cut')}>Cut</MenuItem>
          <MenuItem onClick={() => alert('Copy')}>Copy</MenuItem>
        </Menu>
      </Menubar>

      {/* 4. Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview content area.</TabsContent>
        <TabsContent value="analytics">Analytics dashboard statistics.</TabsContent>
      </Tabs>

      {/* 5. Pagination */}
      <Pagination count={5} page={page} onChange={setPage} />

      {/* 6. Speed Dial */}
      <SpeedDial
        actions={[
          { icon: '📝', label: 'New Post', onClick: () => alert('Post') },
          { icon: '📷', label: 'Upload Photo', onClick: () => alert('Photo') },
        ]}
      />

      {/* 7. Bottom Navigation */}
      <BottomNavigation>
        <BottomNavigationAction active label="Home" icon="🏠" />
        <BottomNavigationAction label="Favorites" icon="★" />
        <BottomNavigationAction label="Profile" icon="👤" />
      </BottomNavigation>
    </div>
  );
}

```

Here is a complete, production-ready React implementation for all **Utils & Low-Level Primitives** built from scratch: **Click-Away Listener**, **CSS Baseline**, **InitColorSchemeScript**, **Modal**, **No SSR**, **Popover**, **Popper**, **Portal**, **Textarea Autosize**, **Transitions**, and **useMediaQuery**.

These components utilize **TypeScript**, **React Portals**, **DOM Event Delegation**, and **ResizeObservers** to match low-level utility specs.

---

### Setup & Utilities

Ensure you have your class merging helper ready:

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### 1. Portal, No SSR & Click-Away Listener

#### `src/utils/Portal.tsx`

```tsx
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const targetContainer = container || (typeof document !== 'undefined' ? document.body : null);
  if (!targetContainer) return null;

  return createPortal(children, targetContainer);
};

```

#### `src/utils/NoSsr.tsx`

```tsx
import * as React from 'react';

export interface NoSsrProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NoSsr: React.FC<NoSsrProps> = ({ children, fallback = null }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <>{fallback}</>;
};

```

#### `src/utils/ClickAwayListener.tsx`

```tsx
import * as React from 'react';

export interface ClickAwayListenerProps {
  children: React.ReactElement;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'onClick' | 'onMouseDown' | 'onMouseUp' | false;
  touchEvent?: 'onTouchStart' | 'onTouchEnd' | false;
}

export const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({
  children,
  onClickAway,
  mouseEvent = 'onMouseDown',
  touchEvent = 'onTouchEnd',
}) => {
  const nodeRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const el = nodeRef.current;
      if (!el || el.contains(event.target as Node)) return;
      onClickAway(event);
    };

    const domMouseEvent = mouseEvent ? mouseEvent.substring(2).toLowerCase() : false;
    const domTouchEvent = touchEvent ? touchEvent.substring(2).toLowerCase() : false;

    if (domMouseEvent) {
      document.addEventListener(domMouseEvent as keyof DocumentEventMap, handleEvent as EventListener);
    }
    if (domTouchEvent) {
      document.addEventListener(domTouchEvent as keyof DocumentEventMap, handleEvent as EventListener);
    }

    return () => {
      if (domMouseEvent) {
        document.removeEventListener(domMouseEvent as keyof DocumentEventMap, handleEvent as EventListener);
      }
      if (domTouchEvent) {
        document.removeEventListener(domTouchEvent as keyof DocumentEventMap, handleEvent as EventListener);
      }
    };
  }, [onClickAway, mouseEvent, touchEvent]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      nodeRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
  });
};

```

---

### 2. CSS Baseline & InitColorSchemeScript

#### `src/utils/CssBaseline.tsx`

```tsx
import * as React from 'react';

export const CssBaseline: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: var(--bg-color, #ffffff);
          color: var(--text-color, #0f172a);
          line-height: 1.5;
        }
      `}</style>
      {children}
    </>
  );
};

```

#### `src/utils/InitColorSchemeScript.tsx`

```tsx
import * as React from 'react';

export interface InitColorSchemeScriptProps {
  defaultMode?: 'light' | 'dark' | 'system';
  attribute?: string;
  colorSchemeNode?: string;
}

export const InitColorSchemeScript: React.FC<InitColorSchemeScriptProps> = ({
  defaultMode = 'system',
  attribute = 'data-theme',
}) => {
  const scriptSrc = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-mode') || '${defaultMode}';
        var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolved = mode === 'system' ? (supportDarkMode ? 'dark' : 'light') : mode;
        if (resolved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        document.documentElement.setAttribute('${attribute}', resolved);
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptSrc }} />;
};

```

---

### 3. Textarea Autosize & useMediaQuery Hook

#### `src/utils/useMediaQuery.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

```

#### `src/utils/TextareaAutosize.tsx`

```tsx
import * as React from 'react';
import { cn } from './cn';

export interface TextareaAutosizeProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  minRows?: number;
}

export const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, maxRows, minRows = 1, onChange, value, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useImperativeHandle(ref, () => textareaRef.current!);

  const resize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const computed = window.getComputedStyle(el);
    const lineHeight = parseInt(computed.lineHeight) || 20;
    const paddingTop = parseInt(computed.paddingTop) || 0;
    const paddingBottom = parseInt(computed.paddingBottom) || 0;

    let targetHeight = el.scrollHeight;

    if (minRows) {
      const minHeight = minRows * lineHeight + paddingTop + paddingBottom;
      targetHeight = Math.max(targetHeight, minHeight);
    }
    if (maxRows) {
      const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom;
      targetHeight = Math.min(targetHeight, maxHeight);
    }

    el.style.height = `${targetHeight}px`;
  }, [maxRows, minRows]);

  React.useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      onChange={(e) => {
        resize();
        onChange?.(e);
      }}
      className={cn(
        'w-full resize-none overflow-hidden rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white',
        className
      )}
      {...props}
    />
  );
});
TextareaAutosize.displayName = 'TextareaAutosize';

```

---

### 4. Transitions Component (Fade, Collapse, Zoom)

#### `src/utils/Transitions.tsx`

```tsx
import * as React from 'react';
import { cn } from './cn';

export interface TransitionProps {
  in: boolean;
  type?: 'fade' | 'zoom' | 'collapse';
  duration?: number;
  children: React.ReactElement;
  className?: string;
}

export const Transition: React.FC<TransitionProps> = ({
  in: inProp,
  type = 'fade',
  duration = 200,
  children,
  className,
}) => {
  const [mounted, setMounted] = React.useState(inProp);

  React.useEffect(() => {
    if (inProp) setMounted(true);
    else {
      const timer = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(timer);
    }
  }, [inProp, duration]);

  if (!mounted) return null;

  const typeStyles = {
    fade: inProp ? 'opacity-100' : 'opacity-0',
    zoom: inProp ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    collapse: inProp ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden',
  };

  return React.cloneElement(children, {
    className: cn(
      'transition-all ease-in-out',
      typeStyles[type],
      children.props.className,
      className
    ),
    style: {
      transitionDuration: `${duration}ms`,
      ...children.props.style,
    },
  });
};

```

---

### 5. Popper, Popover & Modal

#### `src/utils/Popper.tsx`

```tsx
import * as React from 'react';
import { Portal } from './Portal';
import { cn } from './cn';

export interface PopperProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  children: React.ReactNode;
  className?: string;
}

export const Popper: React.FC<PopperProps> = ({
  open,
  anchorEl,
  placement = 'bottom-start',
  children,
  className,
}) => {
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!open || !anchorEl) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      let top = rect.bottom + window.scrollY;
      let left = rect.left + window.scrollX;

      if (placement === 'bottom-end') left = rect.right + window.scrollX;
      if (placement === 'top-start') top = rect.top + window.scrollY;

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [open, anchorEl, placement]);

  if (!open) return null;

  return (
    <Portal>
      <div
        style={{ position: 'absolute', top: coords.top, left: coords.left }}
        className={cn('z-50', className)}
      >
        {children}
      </div>
    </Portal>
  );
};

```

#### `src/utils/Popover.tsx`

```tsx
import * as React from 'react';
import { Popper } from './Popper';
import { ClickAwayListener } from './ClickAwayListener';
import { cn } from './cn';

export interface PopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  anchorEl,
  onClose,
  children,
  className,
}) => {
  if (!open) return null;

  return (
    <Popper open={open} anchorEl={anchorEl}>
      <ClickAwayListener onClickAway={onClose}>
        <div
          className={cn(
            'rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900',
            className
          )}
        >
          {children}
        </div>
      </ClickAwayListener>
    </Popper>
  );
};

```

#### `src/utils/Modal.tsx`

```tsx
import * as React from 'react';
import { Portal } from './Portal';
import { cn } from './cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 w-full max-w-lg rounded-xl border bg-white p-6 shadow-2xl dark:bg-gray-900 dark:border-gray-800',
            className
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

```

---

### Comprehensive Showcase Example

```tsx
import React, { useState, useRef } from 'react';
import { CssBaseline } from './utils/CssBaseline';
import { NoSsr } from './utils/NoSsr';
import { TextareaAutosize } from './utils/TextareaAutosize';
import { Transition } from './utils/Transitions';
import { Popover } from './utils/Popover';
import { Modal } from './utils/Modal';
import { useMediaQuery } from './utils/useMediaQuery';

export function UtilsShowcase() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [transitionIn, setTransitionIn] = useState(true);

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <CssBaseline>
      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Utility Primitives Showcase</h1>
        <p className="text-sm text-gray-500">
          Media Query Status: {isDesktop ? 'Desktop View (≥768px)' : 'Mobile View (<768px)'}
        </p>

        {/* 1. Textarea Autosize */}
        <div>
          <label className="block text-sm font-medium mb-1">Textarea Autosize</label>
          <TextareaAutosize
            minRows={2}
            maxRows={6}
            placeholder="Type long text here to see smooth autosizing..."
          />
        </div>

        {/* 2. No SSR */}
        <div className="p-4 border rounded-md">
          <NoSsr fallback={<p className="text-gray-400">Loading Client Component...</p>}>
            <p className="text-emerald-600 font-medium">Rendered strictly on client side!</p>
          </NoSsr>
        </div>

        {/* 3. Transitions */}
        <div>
          <button
            onClick={() => setTransitionIn(!transitionIn)}
            className="px-3 py-1.5 border rounded text-xs mb-2"
          >
            Toggle Transition
          </button>
          <Transition in={transitionIn} type="zoom">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 rounded-md">
              Zoom Transition Surface
            </div>
          </Transition>
        </div>

        {/* 4. Popover */}
        <div>
          <button
            ref={anchorRef}
            onClick={() => setPopoverOpen(!popoverOpen)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
          >
            Open Popover
          </button>
          <Popover
            open={popoverOpen}
            anchorEl={anchorRef.current}
            onClose={() => setPopoverOpen(false)}
          >
            <p className="text-sm font-medium">Popover Content (Click away to dismiss)</p>
          </Popover>
        </div>

        {/* 5. Modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          Open Modal
        </button>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-bold mb-2">Portal Modal</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Rendered at root document.body with ESC key support and background scroll locks.
          </p>
          <button
            onClick={() => setModalOpen(false)}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
          >
            Close
          </button>
        </Modal>
      </div>
    </CssBaseline>
  );
}

```
