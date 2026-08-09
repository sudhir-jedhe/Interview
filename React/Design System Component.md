Design System Component i
Designing a production-ready **Design System Component** in React requires balancing accessibility, reusability, customizability, and strict TypeScript safety.

Here is a complete, step-by-step guide to building a design system component (a flexible `<Button>` component) following modern design system architecture.

---

## 1. Architectural Checklist for a Design System Component

Every core design system component should implement five foundational patterns:

1. **Variant & Size API:** Standardized visual styles (e.g., `primary`, `secondary`, `danger`) and sizing scales (e.g., `sm`, `md`, `lg`).
2. **Ref Forwarding (`React.forwardRef`):** Allows consumers to attach DOM refs for focus management, tooltips, or animations.
3. **Polymorphism / Slot Support (`asChild`):** Allows rendering as a regular HTML element (e.g., `<button>`) or a React Router/Next.js link (`<a>` / `<Link>`).
4. **Accessible Primitive Baseline:** Built with correct ARIA attributes and keyboard navigation.
5. **Polished Prop Types & Polymorphic HTML Props:** Inherits standard HTML attributes (`onClick`, `disabled`, `type`, `aria-label`) dynamically.

---

## 2. Recommended Stack

To make styling variants and polymorphic slots effortless, modern design systems rely on two industry-standard micro-libraries:

* **`cva` (Class Variance Authority):** Clean, type-safe management of component variants and sizes without massive `if/else` conditions.
* **`clsx` / `tailwind-merge`:** Safe merging of default internal tailwind classes with custom user-supplied `className` props.
* **`@radix-ui/react-slot`:** Implements the `asChild` pattern so components can swap their underlying rendered element while keeping styles intact.

```bash
npm install cva clsx tailwind-merge @radix-ui/react-slot

```

---

## 3. Step-by-Step Implementation

### Step 1: Utility Helper for Merging Classes (`src/utils/cn.ts`)

Create a `cn` helper function to safely resolve CSS class collisions:

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### Step 2: Define Component Variants with `cva` (`src/components/Button/Button.variants.ts`)

Define design tokens, variants, sizes, and default properties cleanly:

```typescript
// src/components/Button/Button.variants.ts
import { cva, type VariantProps } from 'cva';

export const buttonVariants = cva(
  // Base classes applied to every button variant
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus-visible:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    // Default variants if omitted by consumer
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

```

---

### Step 3: Implement the Component (`src/components/Button/Button.tsx`)

Build the component with `forwardRef`, polymorphic `Slot` support, and dynamic prop inheritance:

```tsx
// src/components/Button/Button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants, type ButtonVariantProps } from './Button.variants';
import { cn } from '../../utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  /**
   * If true, merges props onto the immediate child element instead of rendering a <button>.
   * Useful for React Router <Link> or Next.js <Link>.
   */
  asChild?: boolean;
  /**
   * Shows a loading spinner and disables interactions.
   */
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Determine whether to render Radix Slot or standard <button>
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

```

---

### Step 4: Public Barrel Export (`src/components/Button/index.ts`)

Export component primitives explicitly so consumers import from `@design-system/ui`:

```typescript
// src/components/Button/index.ts
export { Button, type ButtonProps } from './Button';
export { buttonVariants, type ButtonVariantProps } from './Button.variants';

```

---

## 4. How Consumers Use the Component

### Usage A: Standard Button Usages

```tsx
import { Button } from '@design-system/ui';

export function Example() {
  return (
    <div className="flex gap-4">
      {/* Primary Small Button */}
      <Button variant="primary" size="sm" onClick={() => alert('Clicked!')}>
        Save Changes
      </Button>

      {/* Danger Loading State */}
      <Button variant="danger" isLoading>
        Delete Account
      </Button>
    </div>
  );
}

```

### Usage B: Polymorphic Link Usage (`asChild`)

When rendered as a link, setting `asChild={true}` transfers button styles and focus rings to the child `<a href="...">` without producing invalid nesting like `<button><a>...</a></button>`:

```tsx
import { Button } from '@design-system/ui';

export function NavigationExample() {
  return (
    <Button asChild variant="outline" size="lg">
      <a href="/dashboard">Go to Dashboard</a>
    </Button>
  );
}

```

---

## 5. Design System Component Lifecycle & Best Practices

1. **Tokens Over Hardcoded Values:** Never hardcode HEX colors (e.g. `#0052CC`) directly in component files. Map them to Tailwind colors or CSS variables (`var(--color-primary)`).
2. **Compound Components for Complex UI:** For complex primitives like Modals, Tabs, or Dropdowns, use the **Compound Component Pattern** (`<Modal>`, `<Modal.Header>`, `<Modal.Body>`) wrapped in `React Context`.
3. **Automated Documentation (Storybook):** Write `.stories.tsx` files alongside every component to test states, variants, accessibility (a11y), and responsive behaviors in isolation.
