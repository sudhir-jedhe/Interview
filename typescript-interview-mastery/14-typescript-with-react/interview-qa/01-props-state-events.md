# Interview Q&A: Props, State, and Events

**Q: Why is `React.FC<Props>` generally avoided in modern codebases?**
A: It implicitly adds an optional `children` prop to every component, even ones that shouldn't accept children, silently allowing invalid usage. It also makes generic components harder to write and complicates typing default props. A plain typed function (`function Button(props: ButtonProps) {}`) is the current widely-adopted convention instead.

**Q: What's the difference between typing `children` as `React.ReactNode` vs. `React.ReactElement`?**
A: `React.ReactNode` is the permissive default — it accepts strings, numbers, elements, fragments, arrays, `null`, and `undefined`, covering essentially anything renderable in JSX. `React.ReactElement` requires exactly one actual JSX element instance, rejecting plain text or arrays; use it only when the component's implementation genuinely needs a single element, such as when calling `React.cloneElement` on `children`.

**Q: When does `useState` need an explicit generic instead of relying on inference from the initial value?**
A: Two common cases: when the state is a union wider than what the initial literal value alone implies (e.g., `useState<Status>("idle")` where `Status` is `"idle" | "loading" | "error"`, since `useState("idle")` alone would infer just the literal `"idle"`), and when the initial value is `null`/`undefined` but the state will later hold a real object (e.g., `useState<User | null>(null)`, since `useState(null)` alone infers the type as literally `null` forever).

**Q: Name three React event types you'd use and what element they'd typically be attached to.**
A: `React.ChangeEvent<HTMLInputElement>` for a text input's `onChange`; `React.FormEvent<HTMLFormElement>` for a form's `onSubmit`; `React.MouseEvent<HTMLButtonElement>` for a button's `onClick`. Each is generic over the element it's bound to, which determines the type of `e.currentTarget`.

**Q: What's the difference between `e.target` and `e.currentTarget` in a typed React event handler, and which should you generally prefer?**
A: `e.target` is the actual element that triggered the event, which — due to event bubbling — could be any descendant of the element the handler is attached to, so React types it more loosely (often as `EventTarget`). `e.currentTarget` is always the element the handler is bound to, and is typed precisely as whatever element type you specified in the event generic (e.g., `HTMLButtonElement`). Prefer `e.currentTarget` whenever you want the element the handler was attached to, which is almost always what you actually want.
