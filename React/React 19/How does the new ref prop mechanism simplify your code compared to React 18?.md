In **React 18 and earlier**, passing a `ref` from a parent component down to a DOM element inside a functional child component required wrapping the child component in the **`forwardRef`** higher-order component (HOC).

In **React 19**, `ref` is now treated as a **standard prop**. You can pass it directly to any functional component just like `className`, `onClick`, or `value`.

Here is a side-by-side comparison of how this simplifies your code.

---

## 1. Code Comparison

### React 18: Boilerplate with `forwardRef`

In React 18, functional components could not accept `ref` as a normal prop. Attempting to pass `ref` directly would result in a React warning, forcing you to use `forwardRef`:

```tsx
// React 18: CustomInput.tsx
import React, { forwardRef } from 'react';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ❌ Requires wrapping the whole component function in forwardRef HOC.
// ❌ Separate argument signature: (props, ref) instead of standard component props.
export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, value, onChange }, ref) => {
    return (
      <label>
        {label}
        <input ref={ref} value={value} onChange={onChange} />
      </label>
    );
  }
);

// Optional: Required display name for debugging in React DevTools when using forwardRef
CustomInput.displayName = 'CustomInput';

```

---

### React 19: Standard Prop Access

In React 19, `ref` is just another property on the `props` object. `forwardRef` is deprecated.

```tsx
// React 19: CustomInput.tsx
import React from 'react';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>; // ✅ Standard prop definition!
}

// ✅ Clean, standard functional component signature
export function CustomInput({ label, value, onChange, ref }: CustomInputProps) {
  return (
    <label>
      {label}
      <input ref={ref} value={value} onChange={onChange} />
    </label>
  );
}

```

---

## 2. Key Simplifications & Benefits

### 1. Eliminates Wrapper Higher-Order Components

You no longer need to wrap component definitions in `forwardRef(...)`. This keeps the component definition clean and matching standard JavaScript function syntax.

### 2. Simplifies Component Signatures

* **React 18:** Components using `forwardRef` took two separate parameters: `(props, ref)`.
* **React 19:** Components take a single `props` object containing `ref`: `({ ref, ...props })`.

### 3. Better TypeScript DX

In React 18, typing `forwardRef<RefType, PropsType>` was confusing because the **Ref type came first and Props type came second**, reversing the intuition of component props. In React 19, you define `ref` directly inside your `Props` interface just like any other prop.

```tsx
// React 19 TypeScript interface
interface ButtonProps {
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

```

### 4. Generics Work Natively

In React 18, passing generic types to a component wrapped in `forwardRef` was notoriously difficult and required complex TypeScript workarounds or type assertions. In React 19, generic components accept refs naturally:

```tsx
// React 19 Generic Component with Ref
interface SelectProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  ref?: React.Ref<HTMLSelectElement>;
}

export function CustomSelect<T>({ items, onSelect, ref }: SelectProps<T>) {
  return <select ref={ref}>...</select>;
}

```

### 5. Retains DevTools Display Names

Components wrapped in `forwardRef` in React 18 often appeared as `Anonymous` or `ForwardRef` in React DevTools unless manually assigned a `CustomInput.displayName = 'CustomInput'`. Standard functions in React 19 keep their natural function name in DevTools automatically.

---

## 3. Migration Tip

React 19 includes a codemod to convert legacy `forwardRef` usages across existing codebases automatically:

```bash
npx codemod@latest react/19/migration-recipe

```

`forwardRef` still works in React 19 for backwards compatibility, but it will throw a deprecation warning and will be completely removed in a future major version.
