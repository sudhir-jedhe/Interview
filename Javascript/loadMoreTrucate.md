If you're asking about **"Load More Content + Truncate Text"** (very common React interview question), here's a complete example.

---

# Scenario

Show only first 100 characters.

```text
Lorem ipsum dolor sit amet...
```

User clicks:

```text
Load More
```

Show full content.

---

# React Example

```jsx
import { useState } from "react";

export default function App() {
  const [expanded, setExpanded] = useState(false);

  const content = `React is a JavaScript library for building user interfaces.
     It allows developers to create reusable components and
     efficiently update the DOM using a virtual DOM.`;

  const truncatedText = content.slice(0, 100);

  return (
    <div>
      <p>{expanded ? content : `${truncatedText}...`}</p>

      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Less" : "Load More"}
      </button>
    </div>
  );
}
```

---

# Multiple Cards Example

```jsx
import { useState } from "react";

function Post({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p>{expanded ? text : text.slice(0, 50)}</p>

      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Less" : "More"}
      </button>
    </div>
  );
}
```

---

# CSS Truncate (Single Line)

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```jsx
<p className="truncate">Very long content...</p>
```

Output:

```text
Very long conten...
```

---

# CSS Multi-Line Truncate

```css
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

```jsx
<p className="truncate-3">Long article content...</p>
```

Shows only:

```text
3 lines...
```

---

# Load More List Example

Frequently asked in React interviews.

```jsx
import React, { useState } from "react";

const data = [
  "React",
  "Angular",
  "Vue",
  "Next",
  "Node",
  "TypeScript",
  "Redux",
  "GraphQL",
];

export default function App() {
  const [visible, setVisible] = useState(3);

  return (
    <>
      {data.slice(0, visible).map((item) => (
        <p key={item}>{item}</p>
      ))}

      {visible < data.length && (
        <button onClick={() => setVisible((prev) => prev + 3)}>
          Load More
        </button>
      )}
    </>
  );
}
```

---

# Senior React Interview Answer

When implementing **Load More + Truncate**:

✅ Store expansion state using `useState`

✅ Use `slice()` for truncation

✅ Use CSS `text-overflow: ellipsis` for single-line content

✅ Use `-webkit-line-clamp` for multi-line truncation

✅ For large datasets, combine with:

- Lazy Loading
- Infinite Scroll
- Pagination
- Generators/Iterators

These patterns are commonly used in feeds, blogs, comments, dashboards, and social media applications.

# Multi-Line CSS Truncate Example

Single-line truncation uses:

```css
text-overflow: ellipsis;
```

For **multi-line content**, use `line-clamp`.

---

## 3-Line Truncate

```css
.description {
  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

---

## React Example

```jsx
export default function Card() {
  const content = `
    React is a JavaScript library for building
    user interfaces. It allows developers to
    create reusable components and efficiently
    update the DOM using a virtual DOM.
    React is widely used in enterprise
    applications because of its component-driven
    architecture.
  `;

  return (
    <div className="card">
      <p className="description">{content}</p>
    </div>
  );
}
```

Result:

```text
React is a JavaScript library
for building user interfaces...
```

Only 3 lines are shown.

---

# Expand / Collapse (Read More)

```jsx
import { useState } from "react";

export default function Post() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className={expanded ? "" : "truncate-3"}>Long article content...</p>

      <button onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Show Less" : "Read More"}
      </button>
    </>
  );
}
```

```css
.truncate-3 {
  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

---

# Performance Tips for Large Lists

When rendering:

```javascript
1000+
5000+
10000+
```

records in React, performance can degrade significantly.

---

# 1. Use Pagination

❌ Bad

```jsx
users.map((user) => <UserCard {...user} />);
```

Rendering:

```text
10,000 Components
```

---

✅ Better

```jsx
users
  .slice(currentPage * 20, currentPage * 20 + 20)
  .map((user) => <UserCard {...user} />);
```

Render only 20 rows.

---

# 2. Load More Pattern

```jsx
const [visibleItems,
       setVisibleItems] =
  useState(20);

users
  .slice(0, visibleItems)
  .map(...);
```

Button:

```jsx
<button onClick={() => setVisibleItems((prev) => prev + 20)}>Load More</button>
```

---

# 3. Virtualisation (Most Important)

For enterprise React applications, use:

```text
react-window
react-virtualized
TanStack Virtual
```

Example:

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={500} width={400} itemSize={35} itemCount={10000}>
  {Row}
</FixedSizeList>;
```

Only visible rows are rendered.

```text
10000 Records
↓
Only 10-15 DOM nodes
```

Huge performance gain.

---

# 4. Memoise Expensive Rows

```jsx
const UserRow = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});
```

Prevents unnecessary rerenders.

---

# 5. Stable Keys

❌ Bad

```jsx
users.map((user, index) => <Row key={index} />);
```

---

✅ Good

```jsx
users.map((user) => <Row key={user.id} />);
```

---

# 6. Use `useMemo`

```jsx
const filteredUsers = useMemo(
  () => users.filter((user) => user.name.toLowerCase().includes(search)),
  [users, search],
);
```

Avoids filtering on every render.

---

# 7. Debounce Search

❌

```jsx
onChange={() =>
  filterUsers()
}
```

Runs on every keystroke.

---

✅

```jsx
const debouncedSearch = useDebounce(search, 300);
```

Only filter after typing stops.

---

# 8. Avoid Inline Functions in Huge Lists

❌

```jsx
users.map((user) => <button onClick={() => deleteUser(user.id)} />);
```

Creates thousands of functions.

---

✅

```jsx
const handleDelete = useCallback((id) => {
  deleteUser(id);
}, []);
```

---

# 9. Infinite Scroll

Instead of:

```text
Load entire dataset
```

Use:

```text
Load 20
↓
Scroll
↓
Load 20 More
```

Common in:

```text
LinkedIn
Facebook
Twitter
Instagram
```

---

# 10. Generator + Lazy Loading

```javascript
function* employeeGenerator(employees) {
  for (const emp of employees) {
    yield emp;
  }
}
```

Load only what is required.

```text
Next()
↓
Next()
↓
Next()
```

Memory efficient.

---

# Senior React Interview Answer

For large lists:

✅ Pagination

✅ Load More

✅ Infinite Scroll

✅ Virtualisation (`react-window`)

✅ `React.memo`

✅ `useMemo`

✅ `useCallback`

✅ Stable Keys

✅ Debounced Search

✅ Generator-Based Lazy Loading

The **best optimisation for 10,000+ rows is virtualisation**, because React only renders visible rows instead of the entire dataset, dramatically reducing memory usage and DOM updates.

If you mean **"how Medium.com locks content and shows only a truncated preview"**, that's a very common React/frontend interview scenario.

## Important Reality

❌ **Do NOT send the full premium content to the browser and just hide it with CSS.**

Bad approach:

```jsx
<p className="truncate">{fullArticle}</p>
```

Users can easily view source, inspect state, or check network responses.

---

# ✅ Correct Approach (Server Side Lock)

## API Response for Free User

Backend returns:

```json
{
  "title": "React Design Patterns",
  "preview": "Builder pattern helps create complex objects...",
  "isPremium": true,
  "isLocked": true
}
```

React:

```jsx
function Article({ article }) {
  return (
    <>
      <h1>{article.title}</h1>

      <p>{article.preview}</p>

      {article.isLocked && <Paywall />}
    </>
  );
}
```

Output:

```text
Builder pattern helps create...
--------------------------------
🔒 Subscribe to continue reading
```

Only preview is sent.

---

# Medium-Style Paywall

## React Component

```jsx
function Article({ content, locked }) {
  return (
    <div>
      <div className={locked ? "blurred" : ""}>{content}</div>

      {locked && (
        <div className="paywall">
          <h3>Member-only story</h3>

          <button>Subscribe</button>
        </div>
      )}
    </div>
  );
}
```

CSS:

```css
.blurred {
  max-height: 300px;

  overflow: hidden;

  position: relative;
}

.blurred::after {
  content: "";

  position: absolute;

  bottom: 0;

  width: 100%;
  height: 100px;

  background: linear-gradient(transparent, white);
}
```

---

# Medium-Style API Design

### Guest User

```json
{
  "title": "React Patterns",
  "preview": "Builder Pattern...",
  "locked": true
}
```

### Paid User

```json
{
  "title": "React Patterns",
  "content": "Full article...",
  "locked": false
}
```

---

# Load More Pattern

For public content:

```jsx
const [showFull,
       setShowFull] =
  useState(false);

<p>
  {showFull
    ? article
    : article.slice(
        0,
        300
      )}
</p>

<button
  onClick={() =>
    setShowFull(true)
  }
>
  Read More
</button>
```

---

# Enterprise Interview Question

### Q: How would you protect premium content?

Bad:

```text
Send full content
Hide with CSS
```

Anyone can inspect the response.

---

Good:

```text
Backend sends preview only
Backend validates subscription
Backend sends full article only to authorised users
```

Architecture:

```text
React UI
   ↓
API Gateway
   ↓
Auth Check
   ↓
Premium User ?
   ↓
YES → Full Content

NO → Preview Content
```

---

# Senior Frontend Interview Answer

> Content locking should always be enforced on the server. The frontend may visually truncate or blur content for user experience, but the complete premium content must never be sent to unauthorised users. A secure implementation returns only preview content for guests and full content for authenticated subscribers. CSS truncation (`line-clamp`, gradients, blur overlays) should be considered presentation enhancements, not security mechanisms.

Here are the two primary ways to implement a **Truncate with Read More / Load More** component in React.

---

### Method 1: Client-Side Character Truncation (React Component)

This component truncates long strings at a specific character limit (e.g., 150 characters) and toggles between expanded and collapsed states.

```tsx
import React, { useState } from "react";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
}

export const ReadMoreText: React.FC<ReadMoreProps> = ({
  text,
  maxLength = 150,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is within limits, render it as-is
  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  return (
    <div className="read-more-container">
      <p>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        <button
          onClick={toggleReadMore}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            fontWeight: 600,
            cursor: "pointer",
            marginLeft: "6px",
            padding: 0,
          }}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </p>
    </div>
  );
};
```

#### Usage

```tsx
<ReadMoreText
  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  maxLength={100}
/>
```

---

### Method 2: Line-Based CSS Truncation (Pure CSS `-webkit-line-clamp`)

If you want to truncate based on **number of visible lines** (e.g., clamp at 3 lines) rather than character length, CSS `-webkit-line-clamp` combined with React state is the cleanest approach.

```tsx
import React, { useState } from "react";

interface LineClampProps {
  children: React.ReactNode;
  lines?: number;
}

export const LineClampText: React.FC<LineClampProps> = ({
  children,
  lines = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clampedStyle: React.CSSProperties = isExpanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      };

  return (
    <div>
      <div style={clampedStyle}>{children}</div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          marginTop: "8px",
          background: "none",
          border: "none",
          color: "#2563eb",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};
```

---

### Method 3: Paginated "Load More" Items Array

If you want to truncate a **list/array of items** (e.g., rendering 5 items at a time with a "Load More" button):

```tsx
import React, { useState } from "react";

interface LoadMoreListProps<T> {
  items: T[];
  initialCount?: number;
  step?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function LoadMoreList<T>({
  items,
  initialCount = 5,
  step = 5,
  renderItem,
}: LoadMoreListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, items.length));
  };

  const handleShowLess = () => {
    setVisibleCount(initialCount);
  };

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </ul>

      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        {hasMore && (
          <button onClick={handleLoadMore}>
            Load More ({items.length - visibleCount} remaining)
          </button>
        )}
        {visibleCount > initialCount && (
          <button onClick={handleShowLess}>Collapse</button>
        )}
      </div>
    </div>
  );
}
```

How can I convert this Load More list pattern into an infinite scroll component using Intersection Observer?

Here is how to convert the **Load More** list pattern into an **Infinite Scroll** component using the native `IntersectionObserver` API in React.

This implementation attaches an observer to a invisible "sentinel" element placed right after the bottom of your visible list. When that element scrolls into the viewport, it triggers loading the next batch of items.

---

### Custom Hook: `useIntersectionObserver`

Extracting the observer into a reusable hook keeps the component code clean and ensures proper cleanup of event listeners.

```tsx
import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  threshold = 1.0,
  rootMargin = "100px", // Pre-fetches 100px BEFORE user reaches bottom
}: UseIntersectionObserverProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin },
    );

    const el = targetRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [onIntersect, enabled, threshold, rootMargin]);

  return targetRef;
}
```

---

### Component Implementation: `InfiniteScrollList`

```tsx
import React, { useState, useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface InfiniteScrollListProps<T> {
  items: T[];
  initialCount?: number;
  step?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function InfiniteScrollList<T>({
  items,
  initialCount = 10,
  step = 10,
  renderItem,
}: InfiniteScrollListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < items.length;

  // Callback executed when sentinel comes into view
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate minor async loading buffer (useful for smoother UX)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + step, items.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, step, items.length]);

  // Target ref attached to invisible element at bottom of list
  const observerRef = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: hasMore && !isLoading,
    rootMargin: "200px", // Triggers loading 200px before reaching bottom
  });

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="infinite-scroll-container">
      <ul style={{ listStyle: "none", padding: 0 }}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </ul>

      {/* Invisible Sentinel Target */}
      <div
        ref={observerRef}
        style={{ height: "20px", margin: "10px 0", textAlign: "center" }}
      >
        {isLoading && <p style={{ color: "#6b7280" }}>Loading more items...</p>}
        {!hasMore && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            You've reached the end of the list.
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### Usage Example

```tsx
import React from "react";
import { InfiniteScrollList } from "./InfiniteScrollList";

// Sample dataset of 100 items
const sampleItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item #${i + 1}`,
  description: `This is the detailed description for item number ${i + 1}.`,
}));

export const App = () => {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Infinite Scroll List</h1>

      <InfiniteScrollList
        items={sampleItems}
        initialCount={10}
        step={10}
        renderItem={(item) => (
          <li
            key={item.id}
            style={{
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <p style={{ margin: "4px 0 0", color: "#4b5563" }}>
              {item.description}
            </p>
          </li>
        )}
      />
    </div>
  );
};
```

---

### Key Optimizations Used

1. **`rootMargin: '200px'`**: Starts fetching the next batch **200 pixels before** the user actually reaches the bottom, creating a seamless, invisible loading experience.
2. **`enabled` Guard**: Deactivates the observer whenever `hasMore` is false or a load operation is already in progress, preventing redundant state updates.
3. **Automatic Cleanup**: Disconnects the `IntersectionObserver` when the component unmounts or completes loading all items.

How do I configure and use Tailwind CSS line-clamp classes for truncating text with a Read More toggle?

**No separate plugin is required.** Since Tailwind CSS v3.3+, `line-clamp` utilities are built directly into the core framework.

The best way to build a "Read More / Show Less" toggle is by combining Tailwind's `line-clamp-{n}` and `line-clamp-none` utilities with a bit of component state.

---

### React Component Implementation

Here is a clean, accessible React component using Tailwind CSS:

```tsx
import React, { useState } from "react";

interface ReadMoreProps {
  text: string;
  lines?: number; // Number of lines to show when collapsed (default: 3)
}

export const ExpandableText: React.FC<ReadMoreProps> = ({
  text,
  lines = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic class mapping for initial line clamping
  const lineClampClasses: Record<number, string> = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
    5: "line-clamp-5",
    6: "line-clamp-6",
  };

  const currentClampClass = lineClampClasses[lines] || `line-clamp-[${lines}]`;

  return (
    <div className="space-y-2">
      <p
        className={`text-gray-700 transition-all duration-300 ${
          isExpanded ? "line-clamp-none" : currentClampClass
        }`}
      >
        {text}
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};
```

---

### Pure CSS / HTML Toggle (No JS Required)

If you are working in static HTML or want a zero-JavaScript solution, you can use a hidden `<input type="checkbox">` alongside Tailwind's `peer` utilities:

```html
<div className="max-w-md p-4 border rounded-lg shadow-sm">
  <input type="checkbox" id="read-more-toggle" className="peer hidden" />

  <p className="text-gray-700 line-clamp-3 peer-checked:line-clamp-none">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur.
  </p>

  <label
    htmlFor="read-more-toggle"
    className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:underline cursor-pointer select-none peer-checked:before:content-['Show_less'] before:content-['Read_more']"
  >
  </label>
</div>
```

---

### Useful Tailwind `line-clamp` Utilities Reference

| Utility                           | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `line-clamp-1` ... `line-clamp-6` | Clamps text to $1$ through $6$ lines.             |
| `line-clamp-none`                 | Removes line clamping completely.                 |
| `line-clamp-[8]`                  | Arbitrary value syntax for custom line counts.    |
| `md:line-clamp-4`                 | Responsive line clamping at specific breakpoints. |
| `hover:line-clamp-none`           | Automatically removes clamp on mouse hover.       |

---

### Legacy Support (Only for Tailwind < 3.3)

If your project uses an older version of Tailwind (< v3.3), install the official plugin:

```bash
npm install -D @tailwindcss/line-clamp

```

And register it in your `tailwind.config.js`:

```javascript
module.exports = {
  plugins: [require("@tailwindcss/line-clamp")],
};
```

Here is a clean, reusable React component that handles text truncation with a **"Load More" / "Show Less"** (or expandable) toggle.

---

### Component Implementation (`TruncatedText.jsx`)

```jsx
import React, { useState } from 'react';

const TruncatedText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is shorter than the max length, just render it normally
  if (text.length <= maxLength) {
    return <p className="text-gray-700">{text}</p>;
  }

  // Determine what text to display
  const displayedText = isExpanded ? text : text.slice(0, maxLength) + '...';

  return (
    <div className="text-gray-700 leading-relaxed">
      <p className="inline">{displayedText}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-blue-600 font-medium hover:underline focus:outline-none"
      >
        {isExpanded ? 'Show Less' : 'Load More'}
      </button>
    </div>
  );
};

export default TruncatedText;

```

---

### Example Usage (`App.jsx`)

```jsx
import React from 'react';
import TruncatedText from './TruncatedText';

function App() {
  const longDescription = 
    "React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.";

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-black">Product Overview</h2>
      <TruncatedText text={longDescription} maxLength={80} />
    </div>
  );
}

export default App;

```

---

### Alternative: Word-Based Truncation (Instead of Characters)

If you prefer cutting off text by a specific **number of words** instead of characters (which prevents cutting words right in the middle), use this alternative logic for the `displayedText`:

```jsx
const words = text.split(' ');
const isTooLong = words.length > maxLength; // here maxLength acts as maxWords

const displayedText = isExpanded || !isTooLong
  ? text
  : words.slice(0, maxLength).join(' ') + '...';

```
