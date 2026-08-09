Here is a production-ready `useDocumentTitle` React hook that updates the browser page title and optionally restores the previous title when the component unmounts or changes.

```jsx
import { useEffect, useRef } from "react";

/**
 * Custom hook to dynamically update the document title with optional unmount cleanup.
 *
 * @param {string} title - The title string to set for the page.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.restoreOnUnmount=false] - If true, restores the title that was active before this hook mounted or updated.
 */
export function useDocumentTitle(title, options = {}) {
  const { restoreOnUnmount = false } = options;
  const prevTitleRef = useRef(typeof document !== "undefined" ? document.title : "");

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Capture current title before applying new title
    const previousTitle = document.title;

    if (title && document.title !== title) {
      document.title = title;
    }

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle || prevTitleRef.current;
      }
    };
  }, [title, restoreOnUnmount]);
}

```

---

### Usage Examples

#### 1. Dynamic Page Route Title

```jsx
function UserProfilePage({ userName }) {
  // Updates title while mounted: "John Doe's Profile"
  useDocumentTitle(`${userName}'s Profile`);

  return <h1>User Profile: {userName}</h1>;
}

```

#### 2. Temporary Modal / Overlay Title (Restores on Unmount)

```jsx
function SettingsModal({ isOpen }) {
  // Restores original title (e.g., "Dashboard") when modal unmounts
  useDocumentTitle("Settings - Account Settings", { restoreOnUnmount: true });

  return <div className="modal">Settings Content</div>;
}

```

#### 3. Unread Notifications Count Badge

```jsx
function Inbox({ unreadCount }) {
  const title = unreadCount > 0 ? `(${unreadCount}) Inbox` : "Inbox";
  useDocumentTitle(title);

  return <div>You have {unreadCount} unread messages</div>;
}

```

---

### Key Features

* **Title Restoring (`restoreOnUnmount`):** Restores the original document title when the host component unmounts—ideal for nested routes, modals, and preview drawers.
* **SSR Safe:** Guards against `document` missing during server-side rendering (Next.js, Remix, Gatsby) without triggering hydration mismatches.
* **Minimal DOM Updates:** Only updates `document.title` if the title string actually changed.
