Here is a production-ready `useCopyToClipboard` React hook. It uses the modern `navigator.clipboard` API, provides an automatic temporary success state (perfect for "Copied!" tooltips), and ensures safe timer cleanup if the component unmounts.

```jsx
import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for copying text to the clipboard with a temporary success state.
 *
 * @param {Object} [options] - Configuration options.
 * @param {number} [options.timeout=2000] - Duration in ms before the `isCopied` state resets.
 * @returns {Object} { isCopied, copiedText, error, copy }
 */
export function useCopyToClipboard({ timeout = 2000 } = {}) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const [error, setError] = useState(null);
  
  const timeoutRef = useRef(null);

  // Clear timeout to prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text) => {
      // Guard for SSR or unsupported browser environments
      if (!navigator?.clipboard) {
        const err = new Error("Clipboard API not supported in this environment.");
        setError(err);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        
        setIsCopied(true);
        setCopiedText(text);
        setError(null);

        // Clear any existing timer to restart the timeout if clicked rapidly
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set timeout to revert the success state
        if (timeout) {
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
            setCopiedText(null);
          }, timeout);
        }

        return true;
      } catch (err) {
        setError(err);
        setIsCopied(false);
        setCopiedText(null);
        return false;
      }
    },
    [timeout]
  );

  return { isCopied, copiedText, error, copy };
}

```

---

### Usage Examples

#### 1. "Share Profile" Button with Feedback

```jsx
function ShareButton({ profileUrl }) {
  const { isCopied, error, copy } = useCopyToClipboard({ timeout: 2500 });

  return (
    <div>
      <button onClick={() => copy(profileUrl)} disabled={isCopied}>
        {isCopied ? "✅ Copied to clipboard!" : "🔗 Copy Profile Link"}
      </button>
      {error && <p style={{ color: "red" }}>Failed to copy: {error.message}</p>}
    </div>
  );
}

```

#### 2. Code Snippet Block

```jsx
function CodeSnippet({ code }) {
  // Returns a promise, so you can execute additional logic after copying
  const { isCopied, copy } = useCopyToClipboard({ timeout: 1500 });

  const handleCopy = async () => {
    const success = await copy(code);
    if (success) {
      console.log("Analytics: User copied code snippet");
    }
  };

  return (
    <div style={{ position: "relative", background: "#f5f5f5", padding: "1rem" }}>
      <button 
        onClick={handleCopy} 
        style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

```

---

### Key Features

* **Auto-Resetting State (`isCopied`):** Automatically reverts to `false` after the provided `timeout` duration, eliminating the need to manually manage tooltip or button states.
* **Rapid-Click Safe:** Cancels and restarts the timer if the user repeatedly mashes the copy button.
* **Async Return Value:** The `copy` function returns a `Promise<boolean>`, allowing you to easily chain additional actions (like tracking analytics or showing a global toast notification) based on success or failure.
* **Unmount Safety:** Cleans up pending timeouts via `useEffect` if the component is removed from the DOM before the timeout completes.
