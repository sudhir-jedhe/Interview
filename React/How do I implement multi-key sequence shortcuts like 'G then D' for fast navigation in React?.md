Multi-key sequences (like GitHub or Gmail’s `g` then `d` to go to dashboard) require a **timed buffer state machine**.

The implementation needs to:

1. **Track keystroke sequences** within a reset timeout (typically 800–1000ms).
2. **Ignore inputs** when the user is typing in editable fields (`<input>`, `<textarea>`, `contenteditable`).
3. **Execute the exact matching sequence** and clear the buffer immediately.

---

### 1. The Multi-Key Hook (`hooks/useKeySequence.ts`)

```typescript
import { useEffect, useRef } from 'react';

export interface KeySequenceBinding {
  /**
   * Sequence of keys in order, e.g. ['g', 'd'] or ['g', 'i']
   * Case-insensitive matching is applied automatically.
   */
  keys: string[];
  callback: (e: KeyboardEvent) => void;
  description?: string;
}

interface UseKeySequenceOptions {
  /** Time window in ms before buffer resets. Defaults to 800ms */
  timeout?: number;
  /** Whether the sequence listener is active. Defaults to true */
  enabled?: boolean;
}

export function useKeySequence(
  bindings: KeySequenceBinding[],
  options: UseKeySequenceOptions = {}
) {
  const { timeout = 800, enabled = true } = options;

  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bindingsRef = useRef(bindings);

  // Keep bindings fresh without re-binding the event listener
  useEffect(() => {
    bindingsRef.current = bindings;
  }, [bindings]);

  useEffect(() => {
    if (!enabled) return;

    const isEditableElement = (element: Element | null): boolean => {
      if (!element) return false;
      const tagName = element.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = element.getAttribute('contenteditable') === 'true';
      return isInput || isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignore if inside form controls or modal inputs
      if (isEditableElement(document.activeElement)) {
        bufferRef.current = [];
        return;
      }

      // 2. Ignore modifier combinations (Ctrl, Alt, Meta) to allow standard browser/OS combos
      if (e.metaKey || e.ctrlKey || e.altKey) {
        bufferRef.current = [];
        return;
      }

      // Normalize key (e.g. 'G' -> 'g')
      const pressedKey = e.key.toLowerCase();

      // Reset existing buffer clearance timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Append pressed key to current buffer
      bufferRef.current.push(pressedKey);
      const currentBuffer = bufferRef.current;

      // 3. Check for matching sequence
      const matchedBinding = bindingsRef.current.find((binding) => {
        const targetKeys = binding.keys.map((k) => k.toLowerCase());
        if (targetKeys.length !== currentBuffer.length) return false;
        return targetKeys.every((key, index) => key === currentBuffer[index]);
      });

      if (matchedBinding) {
        e.preventDefault();
        bufferRef.current = []; // Reset on hit
        matchedBinding.callback(e);
        return;
      }

      // 4. Check if current buffer is a valid prefix of ANY registered binding
      const hasValidPrefix = bindingsRef.current.some((binding) => {
        const targetKeys = binding.keys.map((k) => k.toLowerCase());
        if (currentBuffer.length >= targetKeys.length) return false;
        return currentBuffer.every((key, index) => key === targetKeys[index]);
      });

      if (!hasValidPrefix) {
        // Current buffer cannot lead to any registered sequence; reset immediately
        bufferRef.current = [];
      } else {
        // Set timeout to clear buffer if user abandons sequence
        timerRef.current = setTimeout(() => {
          bufferRef.current = [];
        }, timeout);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeout, enabled]);
}

```

---

### 2. Integration with React Router Navigation (`AppNavigationShortcuts.tsx`)

Attach global sequence navigation chords across the entire dashboard:

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeySequence } from './hooks/useKeySequence';

export function NavigationShortcutManager({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [activeHint, setActiveHint] = useState<string | null>(null);

  useKeySequence([
    // 'G' then 'D' -> Go to Dashboard
    {
      keys: ['g', 'd'],
      callback: () => {
        setActiveHint('Navigating to Dashboard (g + d)');
        navigate('/dashboard');
      },
    },
    // 'G' then 'A' -> Go to Analytics
    {
      keys: ['g', 'a'],
      callback: () => {
        setActiveHint('Navigating to Analytics (g + a)');
        navigate('/analytics');
      },
    },
    // 'G' then 'U' -> Go to Users
    {
      keys: ['g', 'u'],
      callback: () => {
        setActiveHint('Navigating to Users (g + u)');
        navigate('/users');
      },
    },
    // 'G' then 'S' -> Go to System Settings
    {
      keys: ['g', 's'],
      callback: () => {
        setActiveHint('Navigating to Settings (g + s)');
        navigate('/system/general');
      },
    },
    // '?' -> Toggle Shortcuts Cheatsheet Modal
    {
      keys: ['?'],
      callback: () => {
        setActiveHint('Opening Keyboard Cheatsheet (?)');
        // trigger cheatsheet modal
      },
    },
  ]);

  return (
    <>
      {children}
      {/* Toast indicator confirming sequence execution */}
      {activeHint && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#0f172a',
            color: '#38bdf8',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            border: '1px solid #334155',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
          }}
        >
          {activeHint}
        </div>
      )}
    </>
  );
}

```

---

### Architectural Highlights

* **Prefix Pruning:** If a user presses `g` followed by an invalid key (e.g. `g` $\rightarrow$ `x`), the hook detects that no registered sequence begins with `['g', 'x']` and immediately discards the buffer without waiting for the timeout.
* **Form Safety:** Checks `isEditableElement(document.activeElement)` so typing letters like `"great design"` into a search bar or form will not inadvertently trigger page navigation.
* **Ref-Stabilized Callbacks:** Keeps callbacks inside `bindingsRef` so you can use closure values and navigation methods without constantly rebinding the `window.addEventListener` listener on every render.
