```tsx
function LikeButton() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const label = e.target.textContent;
    console.log(label);
  };

  return (
    <button onClick={handleClick}>
      <span>Like</span>
    </button>
  );
}
```

Does this compile? What's the underlying issue even if you cast around it?

**Answer:** It does not compile: `Property 'textContent' does not exist on type 'EventTarget'`. `e.target` is typed as the generic DOM `EventTarget`, not `HTMLButtonElement`, so `.textContent` isn't recognized. Even if you cast it (`(e.target as HTMLElement).textContent`), the runtime value of `e.target` could genuinely be the inner `<span>` (since the click bubbles from whatever descendant was actually clicked), not the `<button>` itself — so the cast is technically legal but represents a real ambiguity in what "target" means when the button has nested markup.

**Why:** `React.MouseEvent<HTMLButtonElement>` types `e.currentTarget` as `HTMLButtonElement` — the element the handler is actually attached to — but deliberately types `e.target` more loosely as `EventTarget`, because in event bubbling, the actual originating element could be *any* descendant, and it's not always the same type as the element the handler is bound to. The fix, and the generally correct pattern, is to use `e.currentTarget` when you want the element the handler was attached to:

```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  const label = e.currentTarget.textContent; // reliably typed as HTMLButtonElement
  console.log(label);
};
```

This is a common trap: reaching for `e.target` out of habit (common in vanilla JS) when `e.currentTarget` is almost always what you actually want in a React event handler.
