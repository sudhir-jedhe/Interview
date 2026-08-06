Implementing a virtualized message list with **dynamic heights** and **reverse scrolling** (Chat UI layout) is notorious for scroll jumping.

When older messages are prepended to the top of the list or when images/media load dynamically, the browser's scroll position shifts unless you explicitly offset it or leverage modern CSS scroll anchoring.

---

### Key Challenges in Virtualized Chat Lists

1. **Dynamic Heights:** Unlike fixed lists (where every item is 50px), chat bubbles vary based on text length, screen width, and attachments.
2. **Prepending Items (Infinite Scroll Up):** Loading historical messages inserts items at index `0`, pushing existing content down and causing the viewport to jump.
3. **Anchor at Bottom:** New incoming messages or sending a message should pin the viewport to the bottom unless the user has manually scrolled up.

---

### Solution Strategy 1: Using `react-virtuoso` (Recommended Production Solution)

Building dynamic height measurement from scratch with `ResizeObserver` is complex and edge-case heavy. **`react-virtuoso`** natively handles dynamic heights, reverse scrolling, prepending items, and sticky-bottom alignment out of the box.

#### Implementation

```jsx
import React, { useState, useRef, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

export function ChatMessageList({ initialMessages, fetchOlderMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [firstItemIndex, setFirstItemIndex] = useState(10000); // High starting index for prepending
  const virtuosoRef = useRef(null);

  // Prepend older messages when scrolling to top
  const handleStartReached = useCallback(async () => {
    const olderMessages = await fetchOlderMessages();
    if (olderMessages.length === 0) return;

    setMessages((prev) => [...olderMessages, ...prev]);
    // Shift firstItemIndex backwards by the number of inserted items.
    // Virtuoso uses this index offset to maintain exact scroll position without jumping!
    setFirstItemIndex((prevIndex) => prevIndex - olderMessages.length);
  }, [fetchOlderMessages]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%' }}
        // Start index trick for prepend accounting
        firstItemIndex={firstItemIndex}
        data={messages}
        // Automatically scroll to bottom on initial render
        initialTopMostItemIndex={messages.length - 1}
        // Auto-scroll to bottom when new messages arrive if user is already near bottom
        followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
        // Trigger infinite scroll up when reaching top
        startReached={handleStartReached}
        // Render item callback (Dynamic height measured automatically!)
        itemContent={(index, message) => (
          <div className="message-item" style={{ padding: '8px 16px' }}>
            <div className="author">{message.senderName}</div>
            <div className="bubble">{message.text}</div>
            {message.attachmentUrl && (
              <img
                src={message.attachmentUrl}
                alt="Attachment"
                style={{ maxWidth: '300px', display: 'block' }}
                // Crucial for dynamic media: force remeasure on image load!
                onLoad={() => virtuosoRef.current?.autoscrollToBottom()}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}

```

---

### Solution Strategy 2: Building from Scratch (How it Works Under the Hood)

If you need to build a custom dynamic virtualizer or understand the low-level DOM mechanics, here are the essential architectural techniques to eliminate scroll jumping:

#### 1. Measure Dynamic Heights with `ResizeObserver`

Because message heights cannot be predicted prior to DOM rendering, attach a shared `ResizeObserver` to measure every rendered DOM bubble and cache its height in a map (`heightCache: Map<id, number>`).

```javascript
// Measure DOM nodes as they render or resize
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const id = entry.target.dataset.id;
    const height = entry.borderBoxSize[0].blockSize;
    
    if (heightCache.get(id) !== height) {
      heightCache.set(id, height);
      triggerListRecomputation(); // Notify virtualizer of height change
    }
  }
});

```

#### 2. Scroll Anchoring for Prepending Items (The Anti-Jump Trick)

When older messages are prepended to the top of the list, measure the total height of the newly prepended items (or the scroll height delta) and adjust `scrollTop` synchronously **before browser paint**.

```javascript
// Synchronous Scroll Offset Adjustment
useLayoutEffect(() => {
  if (isPrependingItems) {
    const container = scrollContainerRef.current;
    const newScrollHeight = container.scrollHeight;
    
    // Adjust scroll position by exact difference in scrollHeight
    const scrollDelta = newScrollHeight - previousScrollHeightRef.current;
    container.scrollTop = container.scrollTop + scrollDelta;
    
    previousScrollHeightRef.current = newScrollHeight;
  }
}, [messages]);

```

#### 3. Native CSS `overflow-anchor: auto`

Modern browsers support native CSS scroll anchoring. Apply `overflow-anchor: auto` to the scroll container, and add `overflow-anchor: none` to elements that should **not** act as anchors (like typing indicators or loading spinners).

```css
.chat-scroll-container {
  overflow-y: auto;
  /* Instructs browser to anchor scroll position to visible DOM nodes */
  overflow-anchor: auto; 
}

.typing-indicator, .loading-spinner {
  /* Prevent temporary elements from pulling scroll focus */
  overflow-anchor: none;
}

```

---

### Summary Checklist for a Smooth Dynamic Chat List

1. **Use `firstItemIndex` offset** when using virtualization libraries like `Virtuoso` so index shifts don't cause layout jumps.
2. **Attach `onLoad` handlers** to async assets (images/GIFs) to trigger height remeasurement/scroll updates once media loads.
3. **Use `useLayoutEffect**` for manual DOM `scrollTop` compensation when prepending historical messages.
4. **Leverage `overflow-anchor: auto**` in CSS as a browser-native safety net against layout shifts.
