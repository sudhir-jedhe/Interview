# Typing Function Component Props

The standard way to type a React function component's props is a `type` or `interface` describing the props object, applied directly to the function's parameter — not via `React.FC`, which has fallen out of favor.

## `interface` vs `type` for props

Both work identically for typical props objects:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};
```

`interface` is generally preferred for props by convention (better error messages when extended, declaration merging if a library needs to augment it), but `type` is required if the props type is a union (e.g., discriminated union props for variant components) — interfaces can't directly express unions.

## Why `React.FC<Props>` is avoided

`React.FC` used to be the default recommendation but has well-known downsides: it implicitly adds a `children?: ReactNode` prop even when the component doesn't accept children (silently allowing invalid usage), it makes generic components awkward to write, and it complicates `defaultProps` typing. The modern, widely-adopted convention is a plain typed function:

```tsx
// Preferred:
function Card({ title, children }: CardProps) { /* ... */ }

// Avoided:
const Card: React.FC<CardProps> = ({ title, children }) => { /* ... */ };
```

## Typing `children`

There are three common ways to type `children`, each with different strictness:

```tsx
interface LayoutProps {
  children: React.ReactNode; // most permissive: strings, numbers, elements, fragments, arrays, null
}

interface WrapperProps {
  children: React.ReactElement; // exactly one JSX element, no strings/arrays/null
}

interface RenderPropProps {
  children: (value: number) => React.ReactNode; // render-prop pattern, not JSX children
}
```

`React.ReactNode` is the right default for "accepts anything renderable" — it's a union covering `ReactElement | string | number | Iterable<ReactNode> | boolean | null | undefined`. Use `React.ReactElement` only when you specifically need exactly one element (e.g., `React.Children.only` semantics, or `cloneElement`-based APIs). A function-typed `children` is for the render-props pattern, unrelated to JSX children syntax but still passed as `children` when written with nested-function JSX syntax.

## Optional vs. required props

```tsx
interface AvatarProps {
  src: string;           // required
  alt?: string;           // optional — consumer may omit
  size?: number;
}

function Avatar({ src, alt = "avatar", size = 32 }: AvatarProps) {
  return <img src={src} alt={alt} width={size} height={size} />;
}
```

Default values via destructuring (`alt = "avatar"`) are the idiomatic replacement for the old `defaultProps` static property, which is deprecated for function components and doesn't interact well with TypeScript's inference for optional props.

## Extending native element props

A very common real-world pattern is a component that wraps a native HTML element and forwards most of its props:

```tsx
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

function IconButton({ icon, ...rest }: IconButtonProps) {
  return <button {...rest}>{icon}</button>;
}

// consumers get full native button typing (onClick, disabled, type, aria-*, etc.)
// plus the custom `icon` prop, for free
```

This avoids manually re-declaring every standard HTML attribute you want to support, and keeps the component's prop types accurate as the DOM spec evolves (since `React.ButtonHTMLAttributes` comes from `@types/react`, maintained alongside React itself).
