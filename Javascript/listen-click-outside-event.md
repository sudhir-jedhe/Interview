````js
const onClickOutside = (element, callback) => {
document.addEventListener('click', e => {
if (!element.contains(e.target)) callback();
});
};

onClickOutside('#my-element', () => console.log('Hello'));
// Will log 'Hello' whenever the user clicks outside of #my-element
```
Here are the two clean ways to handle **clicking outside an element** in React: as a custom hook (`useOnClickOutside`) or using a container component wrapper.

---

### Method 1: Reusable Custom Hook (`useOnClickOutside`)

This is the industry-standard approach. It attaches event listeners to the `document` for both `mousedown` and `touchstart` events.

```tsx
import { useEffect, RefObject } from "react";

type EventType = MouseEvent | TouchEvent;

/**
 * Custom hook to detect clicks outside of a specified element.
 *
 * @param ref - Ref object attached to the target HTML element
 * @param handler - Callback function invoked when a click outside occurs
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: EventType) => void,
): void {
  useEffect(() => {
    const listener = (event: EventType) => {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendant elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
````

#### Usage Example: Modal or Dropdown

```tsx
import React, { useRef, useState } from "react";
import { useOnClickOutside } from "./useOnClickOutside";

export const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button onClick={() => setIsOpen((prev) => !prev)}>Toggle Menu</button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md p-4">
          <p>Dropdown Content</p>
          <button onClick={() => setIsOpen(false)}>Option 1</button>
        </div>
      )}
    </div>
  );
};
```

---

### Method 2: Pure Vanilla JS / React Wrapper Component

If you prefer a self-contained wrapper component without creating custom hooks:

```tsx
import React, { useRef, useEffect } from "react";

interface ClickOutsideProps {
  children: React.ReactNode;
  onClickOutside: () => void;
  className?: string;
}

export const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClickOutside,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [onClickOutside]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
```

#### Usage:

```tsx
<ClickOutside onClickOutside={() => setIsOpen(false)}>
  <div className="modal">
    <h2>Modal Title</h2>
    <p>Modal content goes here...</p>
  </div>
</ClickOutside>
```

---

### Important Considerations

1. **`mousedown` vs `click**`: Using `mousedown`instead of`click`prevents edge cases where a user presses down inside the element, drags outside, and releases (which triggers a`click` outside).
2. **`contains()` method**: `el.contains(event.target)` checks whether the clicked element is either the element itself or any child nested inside it.
3. **Portal Modals**: If your modal renders inside a React Portal (outside the main DOM tree), pass portal refs or check if the target element lives within the portal container.
