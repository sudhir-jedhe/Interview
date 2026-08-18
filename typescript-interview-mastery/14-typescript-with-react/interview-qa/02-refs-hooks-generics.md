# Interview Q&A: Refs, Custom Hooks, and Generic Components

**Q: Why should `useRef` for a DOM node always be initialized with `null`, even though it feels like extra null-checking work later?**
A: Because that's the truth of the ref's lifecycle — before the component mounts (and after it unmounts), there is genuinely no DOM node to point to. Typing it as `useRef<HTMLInputElement>(null)` produces `.current: HTMLInputElement | null`, correctly forcing every access to handle the case where the node isn't there yet. Forcing it to be non-null via an assertion (`useRef<HTMLInputElement>(null!)`) removes that protection without removing the actual risk.

**Q: What's the difference between a DOM ref and a mutable-value ref in terms of typing and usage?**
A: A DOM ref (`useRef<HTMLInputElement>(null)`) is attached to an element via the JSX `ref` prop, and React manages `.current` for you — you should never assign to it directly. A mutable-value ref (e.g., `useRef<number | null>(null)` holding an interval ID) is never attached to a JSX element; it's just a plain box for a value that persists across renders without triggering re-renders, and your own code freely reads and writes `.current` directly.

**Q: Why does a custom hook returning `[value, setValue]` sometimes lose correct typing, and how do you fix it?**
A: If the hook returns a plain array literal with no type hint (`return [value, setValue];`), TypeScript applies best-common-type inference across the array, collapsing every element into one shared union type and losing which position held which type. The fix is `return [value, setValue] as const;`, which locks each element to its own type and marks the result as a fixed-position readonly tuple — matching how `useState` itself is typed internally.

**Q: Why does `<T>(props: Props<T>) => ...` fail to parse as a generic arrow function component in a `.tsx` file?**
A: Because `<T>` in that position is syntactically ambiguous with opening a JSX element tag, and `.tsx` files resolve that ambiguity in favor of JSX. The fix is either a trailing comma (`<T,>(props: Props<T>) => ...`) to disambiguate it as a type parameter list, or using a named function declaration (`function Component<T>(props: Props<T>) {}`), which has no such ambiguity.

**Q: How does TypeScript infer the type parameter `T` when you use a generic component like `<List items={products} .../>`?**
A: The same way it infers generic function type parameters generally — from the argument (here, the `items` prop) matching the parameter's declared shape (`T[]`). Once `T` is inferred as `Product` from `items: Product[]`, every other prop referencing `T` (like `renderItem: (item: T) => ReactNode`) is typed consistently as `Product` at that call site, with no manual annotation needed.
