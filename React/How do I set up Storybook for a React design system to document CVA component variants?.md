Setting up **Storybook** for a React design system built with **Class Variance Authority (CVA)** gives your team an interactive playground to test variants, sizes, and states in isolation.

Here is a step-by-step guide to setting up Storybook (v8+) with Vite/Webpack, Tailwind CSS, and automatic prop controls derived directly from your CVA variant definitions.

---

## Step 1: Initialize Storybook in Your Project

In the root of your React design system repository, initialize Storybook:

```bash
npx storybook@latest init

```

Storybook will auto-detect your framework (e.g., React + Vite or React + Webpack) and create a `.storybook/` configuration directory alongside sample stories.

---

## Step 2: Configure Global Styles & Tailwind CSS

To ensure Storybook renders your custom CVA styles and Tailwind utility classes properly, import your global CSS file inside `.storybook/preview.ts`.

### `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';

// Import your design system's global styles / Tailwind CSS
import '../src/index.css'; 

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Add custom background options for dark/light mode testing
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
};

export default preview;

```

---

## Step 3: Sample CVA Component Target

Assume you have a standard polymorphic Button component with CVA variants defined like this:

```typescript
// src/components/Button/Button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'cva';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<buttonVariants> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  fullWidth,
  isLoading,
  children,
  ...props
}) => {
  return (
    <button className={buttonVariants({ variant, size, fullWidth, className })} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

```

---

## Step 4: Write the Story with CVA Controls

Storybook automatically generates interactive UI dropdowns and toggles for typescript props. You can configure `argTypes` to control how those CVA variants are rendered in Storybook's Control panel.

### `src/components/Button/Button.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Primitives/Button',
  component: Button,
  tags: ['autodocs'], // Enables automatic component documentation generation
  argTypes: {
    // 1. Map CVA Variant options to a select dropdown
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline'],
      description: 'The visual style variant of the button',
    },
    // 2. Map CVA Size options to radio buttons or select
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'The size variant of the button',
    },
    // 3. Map CVA Boolean flags to a toggle switch
    fullWidth: {
      control: 'boolean',
      description: 'Expands button to fill parent container width',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner state',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button Label',
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Story 1: Default Playground
export const Default: Story = {};

// Story 2: Secondary Variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

// Story 3: Outline Variant
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

// Story 4: Danger Small Variant
export const DangerSmall: Story = {
  args: {
    variant: 'danger',
    size: 'sm',
    children: 'Delete Item',
  },
};

// Story 5: All Variants Matrix (Grid Comparison Story)
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="primary" size="sm">Primary Sm</Button>
        <Button variant="primary" size="md">Primary Md</Button>
        <Button variant="primary" size="lg">Primary Lg</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm">Secondary Sm</Button>
        <Button variant="secondary" size="md">Secondary Md</Button>
        <Button variant="secondary" size="lg">Secondary Lg</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="danger" size="sm">Danger Sm</Button>
        <Button variant="danger" size="md">Danger Md</Button>
        <Button variant="danger" size="lg">Danger Lg</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">Outline Sm</Button>
        <Button variant="outline" size="md">Outline Md</Button>
        <Button variant="outline" size="lg">Outline Lg</Button>
      </div>
    </div>
  ),
};

```

---

## Step 5: Advanced Tip — Extract Controls Directly from CVA Config

If you want to avoid manually maintaining `options: ['primary', 'secondary', ...]` in your story files, you can extract variant keys directly from your CVA `buttonVariants` definition:

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta } from '@storybook/react';
import { Button, buttonVariants } from './Button';

// Extract keys dynamically from CVA configuration
const variantOptions = Object.keys(buttonVariants.variants.variant);
const sizeOptions = Object.keys(buttonVariants.variants.size);

const meta: Meta<typeof Button> = {
  title: 'Design System/Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions, // Dynamically sourced from CVA!
    },
    size: {
      control: 'radio',
      options: sizeOptions,    // Dynamically sourced from CVA!
    },
  },
};

export default meta;

```

---

## Step 6: Launch Storybook

Run the Storybook local development server:

```bash
npm run storybook

```

Navigate to `http://localhost:6006` to interact with your CVA variants, inspect auto-generated props documentation, and test responsive viewports.
