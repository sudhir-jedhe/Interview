To make hover flyouts fully accessible, they must operate like standard menus following the **WAI-ARIA Menu/Menubar Design Pattern**:

1. **Trigger Semantics:** Use `aria-haspopup="true"` and `aria-expanded`.
2. **Keyboard Traversal:**

* `ArrowRight`, `Enter`, or `Space` opens the flyout and focuses the first item.
* `ArrowDown` / `ArrowUp` navigates through submenu items in a loop.
* `ArrowLeft` or `Escape` closes the flyout and returns focus to the parent trigger icon.
* `Tab` closes the flyout and advances to the next top-level item.

1. **Focus Trapping / Bounds:** Use `focusin`/`focusout` boundary handlers or keyboard intercepts so keyboard users don't get trapped or miss flyouts.

---

### Accessible Flyout Component (`components/AccessibleFlyoutItem.tsx`)

```tsx
import React, { useState, useRef, useEffect, useId } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppRouteRecord } from '../types/routes';

interface AccessibleFlyoutItemProps {
  route: AppRouteRecord;
  basePath: string;
}

const resolvePath = (basePath: string, path: string) => {
  if (path.startsWith('/')) return path;
  if (!path) return basePath;
  return `${basePath}/${path}`.replace(/\/+/g, '/');
};

export const AccessibleFlyoutItem: React.FC<AccessibleFlyoutItemProps> = ({ route, basePath }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  const fullPath = resolvePath(basePath, route.path);
  const navChildren = route.children?.filter((c) => !c.meta?.hideInNav && !c.path.includes(':'));
  const hasChildren = Boolean(navChildren && navChildren.length > 0);
  const isChildActive = location.pathname.startsWith(fullPath) && location.pathname !== fullPath;

  const icon = route.meta.icon || '▫';

  // Automatically focus active item in flyout when opened via keyboard
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
      items[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  // Close flyout if focus leaves the container entirely
  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  // Trigger keyboard controls
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (!hasChildren) return;

    if (['ArrowRight', 'ArrowDown', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0); // Focus first child immediately
    }
  };

  // Submenu keyboard controls
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!navChildren || navChildren.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < navChildren.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : navChildren.length - 1));
        break;

      case 'ArrowLeft':
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        (triggerRef.current as HTMLElement)?.focus(); // Return focus back to parent icon
        break;

      case 'Tab':
        // Allow native tab flow out, but close the popover
        setIsOpen(false);
        setFocusedIndex(-1);
        break;

      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setFocusedIndex(navChildren.length - 1);
        break;

      default:
        break;
    }
  };

  return (
    <li
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setFocusedIndex(-1);
      }}
      onBlur={handleBlur}
      style={{ position: 'relative', marginBottom: '6px', listStyle: 'none' }}
    >
      {/* Trigger: Button (if parent folder) or NavLink (if direct page) */}
      {hasChildren ? (
        <button
          ref={(el) => (triggerRef.current = el)}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          aria-label={route.meta.title}
          onKeyDown={handleTriggerKeyDown}
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            width: '100%',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: isChildActive ? '#38bdf8' : '#94a3b8',
            backgroundColor: isChildActive || isOpen ? '#1e293b' : 'transparent',
            outline: 'none',
          }}
        >
          <span>{icon}</span>
        </button>
      ) : (
        <NavLink
          ref={(el) => (triggerRef.current = el)}
          to={fullPath}
          aria-label={route.meta.title}
          style={({ isActive }) => ({
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            fontSize: '18px',
            textDecoration: 'none',
            color: isActive ? '#38bdf8' : '#94a3b8',
            backgroundColor: isActive ? '#1e293b' : 'transparent',
            outline: 'none',
          })}
        >
          <span>{icon}</span>
        </NavLink>
      )}

      {/* Flyout Popover Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 8px)',
            top: 0,
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            minWidth: '200px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            border: '1px solid #334155',
            padding: '6px 0',
            zIndex: 100,
          }}
        >
          {/* Header / Tooltip Label */}
          <div
            id={`${menuId}-label`}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#38bdf8',
              borderBottom: hasChildren ? '1px solid #334155' : 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {route.meta.title}
          </div>

          {/* Navigable Menu Items */}
          {hasChildren && (
            <ul
              id={menuId}
              ref={menuRef}
              role="menu"
              aria-labelledby={`${menuId}-label`}
              onKeyDown={handleMenuKeyDown}
              style={{ listStyle: 'none', margin: 0, padding: '4px 0' }}
            >
              {navChildren!.map((child, idx) => {
                const childPath = resolvePath(fullPath, child.path);
                const isFocused = focusedIndex === idx;

                return (
                  <li key={child.path} role="none">
                    <NavLink
                      to={childPath}
                      role="menuitem"
                      tabIndex={isFocused ? 0 : -1}
                      onClick={() => {
                        setIsOpen(false);
                        setFocusedIndex(-1);
                      }}
                      style={({ isActive }) => ({
                        display: 'block',
                        padding: '8px 14px',
                        fontSize: '13px',
                        textDecoration: 'none',
                        outline: 'none',
                        color: isActive || isFocused ? '#ffffff' : '#94a3b8',
                        backgroundColor: isFocused
                          ? '#0284c7'
                          : isActive
                          ? '#0f172a'
                          : 'transparent',
                      })}
                    >
                      {child.meta.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

```

---

### Keyboard & Screen Reader Interaction Matrix

| Key / Event                      | Context           | Behavior                                                                                  |
| -------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `Tab`                            | Top-level trigger | Focuses trigger icon; screen reader announces label and `haspopup="menu"`.                |
| `ArrowRight` / `Enter` / `Space` | Focused trigger   | Opens the flyout and immediately focuses the **first submenu link** (`focusedIndex = 0`). |
| `ArrowDown` / `ArrowUp`          | Inside flyout     | Loops through the submenu items without leaving the menu.                                 |
| `ArrowLeft` / `Escape`           | Inside flyout     | Closes the flyout and returns focus back to the parent trigger icon.                      |
| `Tab`                            | Inside flyout     | Closes flyout and tabs to the next top-level item in the main navigation.                 |
| `onBlur` (Focus loss)            | Anywhere in item  | Safely collapses the flyout if user clicks or tabs outside the component tree.            |

---

### Key Accessibility Attributes Used

* **`role="menu"` & `role="menuitem"`:** Explicitly declares the popup as an interactive application menu rather than a standard unordered list.
* **`tabIndex={isFocused ? 0 : -1}` (Roving Tabindex):** Keeps only the currently selected flyout item focusable via keyboard, preventing tab clutter.
* **`aria-expanded` & `aria-haspopup="menu"`:** Informs screen reader users whether an interactive menu is attached and if it is currently expanded.
