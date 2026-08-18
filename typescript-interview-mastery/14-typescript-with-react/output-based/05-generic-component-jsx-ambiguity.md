```tsx
interface SelectProps<T> {
  options: T[];
  onChange: (value: T) => void;
}

const Select = <T>(props: SelectProps<T>) => {
  return null;
};
```

In a `.tsx` file, does this compile?

**Answer:** No — this fails with a JSX-related parse error (something like `JSX element 'T' has no corresponding closing tag` or `Cannot find name 'T'`), because the parser interprets `<T>` as the start of a JSX element, not a generic type parameter list.

**Why:** In `.tsx` files, `<T>` immediately after an arrow function's parameter list position is syntactically ambiguous — it looks identical to opening a JSX tag `<T>`. TypeScript's parser resolves this ambiguity by treating it as JSX in `.tsx` files, which breaks generic arrow function components. There are two standard fixes:

1. **Add a trailing comma** to disambiguate it as a type parameter list, not JSX:
```tsx
const Select = <T,>(props: SelectProps<T>) => {
  return null;
};
```

2. **Use a named function declaration instead**, which has no such ambiguity because `function` declarations are never confused with JSX:
```tsx
function Select<T>(props: SelectProps<T>) {
  return null;
}
```

Option 2 is generally preferred for generic components specifically because it sidesteps the trailing-comma workaround entirely and reads more clearly — this is one concrete, practical reason function declarations are often favored over arrow functions for components that need type parameters.
