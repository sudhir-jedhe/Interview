# Typing `useState`

`useState`'s type parameter controls what type the state variable and its setter accept. Most of the time TypeScript infers this correctly from the initial value; the cases where you need an explicit generic are worth knowing precisely, because getting them wrong is a frequent source of both compile errors and subtle bugs.

## When inference is enough

```tsx
const [count, setCount] = useState(0); // inferred: number
const [name, setName] = useState(""); // inferred: string
const [isOpen, setIsOpen] = useState(false); // inferred: boolean
```

TypeScript infers the state type directly from the initial value's type, exactly like any other variable inference. For simple primitives and object literals with a stable shape, this is sufficient and idiomatic — don't add a redundant explicit generic here.

## When you need an explicit generic: union states

The most common case requiring an explicit type parameter is when the state's type is *wider* than what the initial value alone would infer — typically a union that includes a state not present in the initial value:

```tsx
type Status = "idle" | "loading" | "success" | "error";

// WITHOUT explicit generic: inferred as "idle", not the full union!
const [status, setStatus] = useState("idle");
// setStatus("loading"); // Error: "loading" is not assignable to "idle"

// WITH explicit generic: correct
const [status2, setStatus2] = useState<Status>("idle");
setStatus2("loading"); // OK
```

Without the generic, TypeScript infers the *literal* type of the initial value (`"idle"`), not the broader `Status` union you actually intend to use, because there's no contextual type telling it otherwise — this is the same widening/inference logic covered in `12-type-inference-assertions`.

## When you need an explicit generic: nullable initial state

Another very common case: state that starts as `null` but will later hold a real object.

```tsx
interface User {
  id: string;
  name: string;
}

// WITHOUT explicit generic: inferred as `null`, permanently!
const [user, setUser] = useState(null);
// setUser({ id: "1", name: "Ada" }); // Error: not assignable to type 'null'

// WITH explicit generic: correct
const [user2, setUser2] = useState<User | null>(null);
setUser2({ id: "1", name: "Ada" }); // OK
```

`useState(null)` without a generic infers the state type as literally `null` — not `null` plus some future object type, because TypeScript has no way to know what other values you intend to store there from the initial value alone. This is an extremely common bug for developers new to TS + React: the component compiles at the point of declaration, but every subsequent `setUser(someRealUser)` call fails.

## Lazy initial state

For expensive-to-compute initial state, pass a function instead of a value — `useState` calls it only once, on mount:

```tsx
const [data, setData] = useState<ExpensiveData>(() => computeExpensiveInitialState());
```

The generic still applies the same way; TypeScript infers it from the function's return type if you omit it, but for the same union/nullable reasons above, an explicit generic is often clearer.

## Typing the setter function directly

`useState<T>`'s setter has type `React.Dispatch<React.SetStateAction<T>>`, which accepts either a new value of type `T` or a function `(prev: T) => T`. This matters when passing the setter down as a prop or storing it in a ref — annotate with the full type rather than trying to redeclare it by hand:

```tsx
interface CounterControlsProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

function CounterControls({ setCount }: CounterControlsProps) {
  return <button onClick={() => setCount((prev) => prev + 1)}>+1</button>;
}
```
