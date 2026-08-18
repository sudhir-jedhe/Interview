# Typing Custom Hooks: Tuple vs. Object Returns

Custom hooks can return either a tuple (array-destructured, like `useState` itself) or an object (property-destructured, like most data-fetching hooks). Both are valid design choices with different typing implications — and tuple returns have a specific, easy-to-miss pitfall around type widening.

## Object returns: no special typing concerns

```tsx
interface UseToggleResult {
  isOn: boolean;
  toggle: () => void;
  setOn: (value: boolean) => void;
}

function useToggle(initial = false): UseToggleResult {
  const [isOn, setIsOn] = useState(initial);
  const toggle = () => setIsOn((prev) => !prev);
  const setOn = (value: boolean) => setIsOn(value);

  return { isOn, toggle, setOn };
}

// usage:
const { isOn, toggle } = useToggle();
```

Object returns work correctly with plain inference — TypeScript infers an object literal's shape directly from its properties, with no widening problem, because object property *order* is irrelevant to consumers (they destructure by name), and there's no positional-array semantics to lose.

## Tuple returns: the widening trap

Mimicking `useState`'s `[value, setValue]` tuple style is common for hooks with exactly two closely related return values, but it has a subtle trap:

```tsx
// BROKEN: returns a plain array, not a tuple!
function useToggleBroken(initial = false) {
  const [isOn, setIsOn] = useState(initial);
  const toggle = () => setIsOn((prev) => !prev);

  return [isOn, toggle]; // inferred as (boolean | (() => void))[]
}

const [isOn, toggle] = useToggleBroken();
// isOn: boolean | (() => void)  -- WRONG, lost positional typing
// toggle: boolean | (() => void) -- WRONG, same union for both
```

Without any hint, TypeScript applies best-common-type array inference (see `12-type-inference-assertions`) to the returned array literal, producing a single union type for *every* element, discarding which position held which specific type. Destructuring still works at runtime (JS doesn't care), but the static types are wrong and unhelpful — `toggle` is typed as possibly being a `boolean`, and calling `toggle()` would actually fail to compile because `boolean` isn't callable.

**The fix: `as const`**

```tsx
function useToggle(initial = false) {
  const [isOn, setIsOn] = useState(initial);
  const toggle = () => setIsOn((prev) => !prev);

  return [isOn, toggle] as const; // readonly [boolean, () => void]
}

const [isOn, toggle] = useToggle();
// isOn: boolean (correct)
// toggle: () => void (correct)
```

`as const` locks each array element to its own specific literal/precise type and marks the result as a fixed-length readonly tuple instead of a general mutable array — exactly the tuple typing `useState` itself relies on internally. This is the single most common tuple-typing bug in custom hooks, and knowing to reach for `as const` here (rather than manually writing an explicit tuple return-type annotation, which also works but is more verbose to maintain) is a strong practical signal in interviews.

## Explicit tuple type annotation (the alternative fix)

```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [isOn, setIsOn] = useState(initial);
  const toggle = () => setIsOn((prev) => !prev);
  return [isOn, toggle];
}
```

An explicit return-type annotation also works, because it contextually types the returned array literal against the declared tuple type — but it requires manually keeping the annotation in sync if the return shape changes, whereas `as const` derives the tuple type directly from what's actually returned.

## Choosing tuple vs. object

Tuples are idiomatic when there are exactly two tightly coupled values and consumers commonly rename them (`const [count, setCount] = useCounter()`, `const [width, height] = useDimensions()`), mirroring `useState`. Objects are better for three or more return values, or when named access improves readability at call sites (`const { data, loading, error } = useFetch(url)` — see `problems/03-usefetch-hook.md`), since object destructuring makes it obvious which value is which without relying on consistent positional naming conventions across the codebase.
