```tsx
interface WrapperProps {
  children: React.ReactElement;
}

function Wrapper({ children }: WrapperProps) {
  return <div className="wrapper">{children}</div>;
}

function App() {
  return (
    <Wrapper>
      Just some text
    </Wrapper>
  );
}
```

Does `<Wrapper>Just some text</Wrapper>` compile?

**Answer:** No — `Type 'string' is not assignable to type 'ReactElement<any, any>'`.

**Why:** `children: React.ReactElement` requires exactly one JSX element (like `<span>...</span>` or `<Icon />`), not a plain string, number, array, or `null`. Passing raw text as children doesn't satisfy `ReactElement`, because a string literal isn't an element instance — it's a primitive. This is a case where being overly strict about `children`'s type is actually catching a real constraint the component genuinely has (perhaps it calls `React.cloneElement(children, extraProps)` internally, which only works on a single element, not text). If the component is actually fine accepting any renderable content, the type should be relaxed to `React.ReactNode` instead:

```tsx
interface WrapperProps {
  children: React.ReactNode; // now accepts strings, arrays, elements, null, etc.
}
```

The lesson: choose `ReactElement` deliberately, only when the component's implementation genuinely requires a single element (e.g., for `cloneElement`), not as a default — `ReactNode` is the correct default for "accepts normal JSX children."
