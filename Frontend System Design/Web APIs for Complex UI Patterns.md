In Front-End System Design, relying on traditional scroll, resize, or polling event listeners leads to main-thread congestion and poor frame rates ($<60\text{ FPS}$). Modern browser architecture addresses this with asynchronous **Observer APIs**. These APIs offload layout monitoring to the browser's engine, executing callbacks asynchronously on the main thread only when specific triggers are hit.

---

## 1. Intersection Observer API & Infinite Scroll Architecture

The **Intersection Observer API** detects when a target element intersects with an ancestor element or the top-level document viewport.

```text
       ┌─────────────────────────────────────────┐
       │             Browser Viewport            │
       │                                         │
       │     ┌─────────────────────────────┐     │
       │     │    Visible Feed Content     │     │
       │     │                             │     │
       │     └─────────────────────────────┘     │
       │                                         │
       │   [ ─── Sentinel Element (Div) ─── ]    │  <── Intersects Root
       └─────────────────────────────────────────┘

```

### System Design: Infinite Scroll Implementation

A production-grade infinite scroll relies on a **Sentinel Node** at the bottom of a list. When the sentinel becomes visible, extra data is fetched and appended.

```typescript
interface InfiniteScrollOptions {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number | number[];
  onFetchNextPage: () => Promise<boolean>; // Returns false when no more pages
}

class InfiniteScrollController {
  private observer: IntersectionObserver | null = null;
  private sentinel: HTMLElement | null = null;
  private isLoading = false;
  private hasMore = true;

  constructor(private options: InfiniteScrollOptions) {}

  public attach(container: HTMLElement, sentinel: HTMLElement): void {
    this.sentinel = sentinel;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: this.options.root || null,
        // Trigger fetch 200px BEFORE the user reaches the bottom
        rootMargin: this.options.rootMargin || '200px 0px',
        threshold: this.options.threshold || 0.0,
      }
    );

    this.observer.observe(this.sentinel);
  }

  private async handleIntersection(entries: IntersectionObserverEntry[]): Promise<void> {
    const target = entries[0];

    if (target.isIntersecting && !this.isLoading && this.hasMore) {
      this.isLoading = true;
      try {
        this.hasMore = await this.options.onFetchNextPage();
      } catch (error) {
        console.error('Failed to load next page:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

```

---

## 2. Mutation Observer API & Exercise

The **Mutation Observer API** monitors changes made to the DOM tree (node additions/removals, attribute updates, or character data changes).

### Critical Use Cases

* **Third-Party Script Monitoring:** Detecting unwanted DOM injection or ad tampering.
* **UI Auto-resizing / Auto-scrolling:** Keeping a live chat window scrolled to the bottom as new messages arrive.
* **Form Validation State Injection:** Syncing external UI libraries with native inputs.

---

### Exercise: Building an Anti-Tampering & Security Guard

**Requirement:** Build a utility that monitors a specific high-security DOM element (e.g., a checkout button or pricing node) and automatically reverts unauthorized attribute, class, or child node modifications made by third-party extensions or malicious scripts.

```typescript
class DOMGuard {
  private observer: MutationObserver | null = null;
  private isReverting = false; // Prevents infinite recursion during rollback

  constructor(
    private targetNode: HTMLElement,
    private expectedAttributes: Record<string, string>
  ) {}

  public startProtection(): void {
    this.observer = new MutationObserver((mutations) => this.handleMutations(mutations));

    this.observer.observe(this.targetNode, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private handleMutations(mutations: MutationRecord[]): void {
    if (this.isReverting) return;

    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const attrName = mutation.attributeName;
        if (attrName && this.expectedAttributes.hasOwnProperty(attrName)) {
          const currentValue = this.targetNode.getAttribute(attrName);
          const expectedValue = this.expectedAttributes[attrName];

          if (currentValue !== expectedValue) {
            console.warn(`[Security Alert] Unauthorized attribute modification detected on ${attrName}. Reverting...`);
            
            this.isReverting = true;
            this.targetNode.setAttribute(attrName, expectedValue);
            this.isReverting = false;
          }
        }
      } else if (mutation.type === 'childList') {
        console.warn(`[Security Alert] Unauthorized child node alteration. Triggering audit log.`);
        // Re-render or handle node restoration
      }
    }
  }

  public stopProtection(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// --- Usage ---
const payBtn = document.getElementById('pay-button') as HTMLElement;
const guard = new DOMGuard(payBtn, {
  'data-amount': '49.99',
  'class': 'btn btn-primary active',
});
guard.startProtection();

```

---

## 3. Resize Observer API & Exercise

The **Resize Observer API** tracks element dimensions ($X, Y, \text{Width}, \text{Height}$) independent of viewport size changes. Unlike `window.onresize`, it fires when individual element container dimensions alter (e.g., sidebar toggles, flexbox shifts).

### Critical Use Cases

* **Container Queries (Polyfilling):** Applying layout logic based on element width rather than viewport width.
* **Dynamic Canvas & Charting:** Redrawing Data-Driven Charts (D3 / Chart.js) when parent wrappers resize.

---

### Exercise: Responsive Dashboard Card with Container Query Logic

**Requirement:** Design a self-contained widget component that adjusts its internal rendering layout (e.g., switches between `grid`, `list`, and `compact`) based strictly on its own rendered container width, ignoring the global viewport dimensions.

```typescript
type LayoutState = 'compact' | 'list' | 'grid';

class ResponsiveContainerWidget {
  private observer: ResizeObserver | null = null;
  private currentLayout: LayoutState = 'compact';

  constructor(
    private container: HTMLElement,
    private onLayoutChange: (layout: LayoutState) => void
  ) {}

  public initialize(): void {
    this.observer = new ResizeObserver((entries) => this.handleResize(entries));
    this.observer.observe(this.container);
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      // Use borderBoxSize for accurate bounding layout dimensions
      let inlineSize = 0;

      if (entry.borderBoxSize) {
        // Handle array variant in newer browsers spec
        const boxSize = Array.isArray(entry.borderBoxSize) 
          ? entry.borderBoxSize[0] 
          : entry.borderBoxSize;
        inlineSize = boxSize.inlineSize;
      } else {
        // Fallback for legacy specs
        inlineSize = entry.contentRect.width;
      }

      this.evaluateBreakpoints(inlineSize);
    }
  }

  private evaluateBreakpoints(width: number): void {
    let nextLayout: LayoutState = 'compact';

    if (width >= 600) {
      nextLayout = 'grid';
    } else if (width >= 350) {
      nextLayout = 'list';
    } else {
      nextLayout = 'compact';
    }

    if (nextLayout !== this.currentLayout) {
      this.currentLayout = nextLayout;
      this.container.setAttribute('data-layout', nextLayout);
      this.onLayoutChange(nextLayout);
    }
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// --- Usage ---
const widgetElement = document.getElementById('dashboard-widget') as HTMLElement;
const widget = new ResponsiveContainerWidget(widgetElement, (newLayout) => {
  console.log(`Widget layout adapted to: ${newLayout}`);
});
widget.initialize();

```

---

## 4. Architectural Observer Comparison

| Observer API              | Target Monitored                                              | Performance Advantage                                                 | System Design Pitfall / Mitigation                                                                                                                              |
| ------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intersection Observer** | Relative visibility of an element vs Viewport/Root Container. | Bypasses `scroll` event polling entirely; calculates off main thread. | High threshold counts ($>100$) can degrade main-thread CPU. Keep thresholds sparse.                                                                             |
| **Mutation Observer**     | Structural DOM mutations (children, attributes, subtree).     | Batch-delivers changes asynchronously via Microtask queue.            | Synchronous DOM updates inside observer callbacks can cause **Infinite Mutation Loops**.                                                                        |
| **Resize Observer**       | Element content/border box size changes.                      | Eliminates reliance on `window.onresize` for component layout logic.  | Modifying element dimensions inside its own callback triggers an **" ResizeObserver loop limit exceeded "** error. Use `requestAnimationFrame` to batch writes. |

Show me how to combine Intersection Observer and DOM Virtualization to build a high-performance list that recycles DOM elements during infinite scrolling.

Combining **Intersection Observer** with **DOM Virtualization (Windowing)** allows you to render infinitely large lists (e.g., 100,000+ items) while maintaining a strict, constant memory footprint.

Instead of continually appending new nodes to the DOM as the user scrolls, this architecture maintains a fixed pool of DOM elements and **recycles** them by updating their position ($Y$-offset) and data content based on the active scroll viewport.

---

## 1. High-Level Architecture & Concept

```text
  Total Height = Total Items Count × Fixed Item Height (e.g., 100,000 × 50px = 5,000,000px)

  ┌────────────────────────────────────────────────────────┐  ◄── Container (overflow-y: auto)
  │                      Top Spacer                        │  (Height: startIndex × itemHeight)
  ├────────────────────────────────────────────────────────┤  ◄── Top Sentinel
  │  ┌──────────────────────────────────────────────────┐  │
  │  │ Rendered Item #100                              │  │
  │  │ Rendered Item #101                              │  │  ◄── Visible Viewport Window
  │  │ Rendered Item #102                              │  │      (Only ~10-20 physical
  │  │ Rendered Item #103                              │  │       DOM nodes allocated)
  │  └──────────────────────────────────────────────────┘  │
  ├────────────────────────────────────────────────────────┤  ◄── Bottom Sentinel
  │                     Bottom Spacer                      │  (Height: (Total - endIndex) × itemHeight)
  └────────────────────────────────────────────────────────┘

```

### Key Components

1. **Scroll Container & Target Spacer:** A wrapper container with an inner phantom element sized to the total height of all items ($N \times \text{itemHeight}$), maintaining natural browser scrollbars.
2. **Buffer / Window Windowing:** We compute `startIndex` and `endIndex` based on current scroll position and render only visible items plus a small **buffer** above and below to prevent flickering.
3. **Sentinels & Intersection Observer:** Top and Bottom sentinel nodes trigger updates when the user approaches window edges, avoiding expensive `scroll` event listeners.

---

## 2. Production-Grade Implementation (TypeScript / ES6)

### A. Component Implementation

```typescript
interface VirtualListOptions<T> {
  container: HTMLElement;
  itemHeight: number;
  bufferSize?: number; // Extra items to render above/below viewport
  fetchMoreData: () => Promise<T[]>; // Infinite scroll data loader
  renderItem: (item: T, index: number) => HTMLElement;
}

export class VirtualizedInfiniteList<T> {
  private container: HTMLElement;
  private scrollPhantom!: HTMLElement;
  private contentWrapper!: HTMLElement;
  private topSentinel!: HTMLElement;
  private bottomSentinel!: HTMLElement;

  private items: T[] = [];
  private itemHeight: number;
  private bufferSize: number;
  private fetchMoreData: () => Promise<T[]>;
  private renderItem: (item: T, index: number) => HTMLElement;

  private observer: IntersectionObserver | null = null;
  private isLoading = false;
  private hasMore = true;

  private visibleNodes: Map<number, HTMLElement> = new Map(); // Index -> DOM Element
  private pool: HTMLElement[] = []; // Recyclable DOM Node Pool

  constructor(options: VirtualListOptions<T>) {
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.bufferSize = options.bufferSize ?? 5;
    this.fetchMoreData = options.fetchMoreData;
    this.renderItem = options.renderItem;

    this.setupDOMStructure();
    this.setupObserver();
    this.init();
  }

  /**
   * Initializes the DOM shell: Phantom scroll height element and absolute positioning wrapper
   */
  private setupDOMStructure(): void {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';

    // 1. Invisible phantom to hold full scroll height
    this.scrollPhantom = document.createElement('div');
    this.scrollPhantom.style.position = 'absolute';
    this.scrollPhantom.style.top = '0';
    this.scrollPhantom.style.left = '0';
    this.scrollPhantom.style.width = '100%';
    this.scrollPhantom.style.zIndex = '-1';

    // 2. Absolute wrapper for active visible DOM items
    this.contentWrapper = document.createElement('div');
    this.contentWrapper.style.position = 'absolute';
    this.contentWrapper.style.top = '0';
    this.contentWrapper.style.left = '0';
    this.contentWrapper.style.width = '100%';

    // 3. Sentinels for Intersection Observer boundaries
    this.topSentinel = document.createElement('div');
    this.bottomSentinel = document.createElement('div');
    this.topSentinel.style.height = '1px';
    this.bottomSentinel.style.height = '1px';

    this.container.appendChild(this.scrollPhantom);
    this.container.appendChild(this.contentWrapper);

    // Bind scroll listener to re-render visible window efficiently
    this.container.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  /**
   * Configures IntersectionObserver for top/bottom boundary triggers
   */
  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === this.bottomSentinel && entry.isIntersecting) {
            this.handleInfiniteFetch();
          }
        });
      },
      {
        root: this.container,
        rootMargin: '300px 0px', // Fetch 300px before reaching absolute bottom
      }
    );
  }

  private async init(): Promise<void> {
    await this.handleInfiniteFetch();
  }

  /**
   * Fetches new chunk of items and updates total virtual scroll height
   */
  private async handleInfiniteFetch(): Promise<void> {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    const newItems = await this.fetchMoreData();

    if (newItems.length === 0) {
      this.hasMore = false;
    } else {
      this.items.push(...newItems);
      // Update virtual total scroll height
      this.scrollPhantom.style.height = `${this.items.length * this.itemHeight}px`;
      this.render();
    }

    this.isLoading = false;
  }

  /**
   * Recalculates index window on scroll and updates virtual window
   */
  private onScroll(): void {
    requestAnimationFrame(() => this.render());
  }

  /**
   * Core Virtualization Algorithm: Recycles DOM nodes into visible window
   */
  private render(): void {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;

    // Calculate start and end indices
    let startIndex = Math.floor(scrollTop / this.itemHeight) - this.bufferSize;
    let endIndex = Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.bufferSize;

    startIndex = Math.max(0, startIndex);
    endIndex = Math.min(this.items.length - 1, endIndex);

    const activeIndices = new Set<number>();
    for (let i = startIndex; i <= endIndex; i++) {
      activeIndices.add(i);
    }

    // Phase 1: Unmount nodes out of current visible window into pool
    this.visibleNodes.forEach((node, index) => {
      if (!activeIndices.has(index)) {
        node.remove();
        this.pool.push(node); // Return to pool for reuse
        this.visibleNodes.delete(index);
      }
    });

    // Phase 2: Render/Recycle nodes for active indices
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.visibleNodes.has(i)) {
        const itemData = this.items[i];
        let node: HTMLElement;

        if (this.pool.length > 0) {
          // Recycle an existing node from the pool
          node = this.pool.pop()!;
          this.updateNodeData(node, itemData, i);
        } else {
          // Allocate a new node if pool is empty
          node = this.renderItem(itemData, i);
        }

        // Hardware-accelerated GPU positioning via transform
        node.style.position = 'absolute';
        node.style.top = '0';
        node.style.left = '0';
        node.style.width = '100%';
        node.style.transform = `translate3d(0, ${i * this.itemHeight}px, 0)`;

        this.visibleNodes.set(i, node);
        fragment.appendChild(node);
      }
    }

    this.contentWrapper.appendChild(fragment);

    // Phase 3: Position bottom sentinel near list end to trigger infinite fetching
    if (this.observer) {
      this.observer.unobserve(this.bottomSentinel);
      const sentinelOffset = Math.max(0, (this.items.length - 2) * this.itemHeight);
      this.bottomSentinel.style.transform = `translate3d(0, ${sentinelOffset}px, 0)`;
      this.contentWrapper.appendChild(this.bottomSentinel);
      this.observer.observe(this.bottomSentinel);
    }
  }

  /**
   * Updates existing DOM elements in place without recreating nodes
   */
  private updateNodeData(node: HTMLElement, data: T, index: number): void {
    const freshNode = this.renderItem(data, index);
    node.innerHTML = freshNode.innerHTML;
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.container.innerHTML = '';
  }
}

```

---

### B. Usage Example

```html
<!-- HTML Wrapper -->
<div id="virtual-scroll-container" style="height: 600px; width: 400px; border: 1px solid #ccc;"></div>

```

```typescript
// Define Mock Data Fetcher
let currentId = 0;
const fetchMockPage = async (): Promise<{ id: number; title: string }[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const page = [];
  for (let i = 0; i < 50; i++) {
    currentId++;
    page.push({
      id: currentId,
      title: `Item #${currentId} - Virtualized Data Row`,
    });
  }
  return page;
};

// Instantiate Virtualized List
const container = document.getElementById('virtual-scroll-container')!;

const list = new VirtualizedInfiniteList({
  container,
  itemHeight: 50, // Each row is 50px tall
  bufferSize: 5,  // Pre-render 5 items above/below viewport
  fetchMoreData: fetchMockPage,
  renderItem: (item) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.style.height = '50px';
    div.style.lineHeight = '50px';
    div.style.padding = '0 16px';
    div.style.borderBottom = '1px solid #eee';
    div.style.boxSizing = 'border-box';
    div.innerHTML = `<strong>ID: ${item.id}</strong> — ${item.title}`;
    return div;
  },
});

```

---

## 3. Why This Approach Prevents Performance Bottlenecks

1. **Constant DOM Node Count:** Even with $100,000+$ total items in data array `items`, only $\approx 25\text{--}30$ actual DOM nodes exist in the tree at any point ($\text{Viewport Height} / \text{Item Height} + 2 \times \text{Buffer}$).
2. **Zero Layout Thrashing:** Node coordinates use `transform: translate3d(0, Y, 0)`, running position changes entirely on the **Compositor / GPU layer** without triggering Reflow or Repaint stages.
3. **DOM Node Recycling Pool (`this.pool`):** Prevents continuous Garbage Collection (GC) pauses by reusing detached nodes rather than allocating/destroying DOM instances continuously during scrolling.

Show me how to modify this virtual list component to handle dynamic item heights with variable row sizing.

Handling **variable/dynamic item heights** in a virtual list introduces a key challenge: without uniform item heights, you can no longer compute an item's $Y$-position or the total scroll height using simple multiplication ($i \times \text{height}$).

To maintain smooth $60\text{ FPS}$ performance, we track each item's measured size in an **internal height cache**, use **Prefix Sums** for $O(1)$ or $O(\log N)$ position lookups, and leverage a **Binary Search** algorithm to identify visible row indices during scrolling.

---

## 1. Architectural Changes for Dynamic Heights

```text
  ┌─────────────────────────────────────────────────────────────┐
  │ Item 0 (Height: 85px)  ──> Offset: 0px                      │
  ├─────────────────────────────────────────────────────────────┤
  │ Item 1 (Height: 120px) ──> Offset: 85px                     │
  ├─────────────────────────────────────────────────────────────┤
  │ Item 2 (Height: 45px)  ──> Offset: 205px                    │
  ├─────────────────────────────────────────────────────────────┤  ◄── scrollTop (e.g. 210px)
  │ Item 3 (Height: 150px) ──> Offset: 250px [VISIBLE START]    │  ◄── Found via Binary Search!
  │ Item 4 (Height: 60px)  ──> Offset: 400px [VISIBLE]          │
  └─────────────────────────────────────────────────────────────┘

```

### Key Enhancements

1. **Measured Heights Cache (`measuredHeights`):** Maps `index -> height`. Items start with an estimated default height (e.g., $50\text{px}$) until rendered and measured via `getBoundingClientRect()`.
2. **Offset Cache (`offsets`):** Stores cumulative top positions ($Y$-offsets).

$$\text{Offset}[i] = \sum_{k=0}^{i-1} \text{MeasuredHeight}[k]$$

1. **Binary Search Lookup:** Given `container.scrollTop`, binary search finds the `startIndex` in $O(\log N)$ time rather than scanning linearly $O(N)$.
2. **Post-Render Resize Measurement:** After DOM nodes enter the viewport, `ResizeObserver` measures their true rendered heights, updates the cache, and adjusts overall phantom scroll height dynamically.

---

## 2. Updated Implementation (TypeScript)

```typescript
interface DynamicVirtualListOptions<T> {
  container: HTMLElement;
  estimatedItemHeight: number; // Initial height guess before measuring DOM
  bufferSize?: number;
  fetchMoreData: () => Promise<T[]>;
  renderItem: (item: T, index: number) => HTMLElement;
}

interface ItemMeta {
  offset: number; // Y-position from top of container
  height: number; // Measured height in pixels
}

export class DynamicVirtualizedList<T> {
  private container: HTMLElement;
  private scrollPhantom!: HTMLElement;
  private contentWrapper!: HTMLElement;
  private bottomSentinel!: HTMLElement;

  private items: T[] = [];
  private estimatedItemHeight: number;
  private bufferSize: number;
  private fetchMoreData: () => Promise<T[]>;
  private renderItem: (item: T, index: number) => HTMLElement;

  private observer: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private isLoading = false;
  private hasMore = true;

  // Cache storing metadata (height & offset) for every item
  private itemMetadata: ItemMeta[] = [];
  private visibleNodes: Map<number, HTMLElement> = new Map();
  private pool: HTMLElement[] = [];

  constructor(options: DynamicVirtualListOptions<T>) {
    this.container = options.container;
    this.estimatedItemHeight = options.estimatedItemHeight;
    this.bufferSize = options.bufferSize ?? 5;
    this.fetchMoreData = options.fetchMoreData;
    this.renderItem = options.renderItem;

    this.setupDOMStructure();
    this.setupObservers();
    this.init();
  }

  private setupDOMStructure(): void {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';

    this.scrollPhantom = document.createElement('div');
    this.scrollPhantom.style.position = 'absolute';
    this.scrollPhantom.style.top = '0';
    this.scrollPhantom.style.left = '0';
    this.scrollPhantom.style.width = '100%';
    this.scrollPhantom.style.zIndex = '-1';

    this.contentWrapper = document.createElement('div');
    this.contentWrapper.style.position = 'absolute';
    this.contentWrapper.style.top = '0';
    this.contentWrapper.style.left = '0';
    this.contentWrapper.style.width = '100%';

    this.bottomSentinel = document.createElement('div');
    this.bottomSentinel.style.height = '1px';

    this.container.appendChild(this.scrollPhantom);
    this.container.appendChild(this.contentWrapper);

    this.container.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  private setupObservers(): void {
    // 1. Intersection Observer for infinite scrolling
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === this.bottomSentinel && entry.isIntersecting) {
            this.handleInfiniteFetch();
          }
        });
      },
      { root: this.container, rootMargin: '400px 0px' }
    );

    // 2. ResizeObserver to dynamically measure true DOM row dimensions
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsRecompute = false;

      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const indexStr = target.getAttribute('data-index');
        if (indexStr !== null) {
          const index = parseInt(indexStr, 10);
          const measuredHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;

          // If measured height differs from cached estimate, update metadata
          if (this.itemMetadata[index] && this.itemMetadata[index].height !== measuredHeight) {
            this.itemMetadata[index].height = measuredHeight;
            needsRecompute = true;
          }
        }
      });

      // Recalculate offsets for all subsequent items if sizes changed
      if (needsRecompute) {
        this.recomputeOffsets();
        this.render();
      }
    });
  }

  private async init(): Promise<void> {
    await this.handleInfiniteFetch();
  }

  /**
   * Recalculates cumulative offset positions for all items in O(N) time
   */
  private recomputeOffsets(startingIndex = 0): void {
    const total = this.items.length;
    let currentOffset = startingIndex > 0 ? this.itemMetadata[startingIndex - 1].offset + this.itemMetadata[startingIndex - 1].height : 0;

    for (let i = startingIndex; i < total; i++) {
      this.itemMetadata[i].offset = currentOffset;
      currentOffset += this.itemMetadata[i].height;
    }

    // Update phantom height to match total actual calculated content height
    this.scrollPhantom.style.height = `${currentOffset}px`;
  }

  /**
   * Appends new items with initial estimated metadata
   */
  private async handleInfiniteFetch(): Promise<void> {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    const newItems = await this.fetchMoreData();

    if (newItems.length === 0) {
      this.hasMore = false;
    } else {
      const startIndex = this.items.length;
      this.items.push(...newItems);

      // Initialize metadata with estimated height
      newItems.forEach(() => {
        this.itemMetadata.push({
          offset: 0,
          height: this.estimatedItemHeight,
        });
      });

      this.recomputeOffsets(startIndex);
      this.render();
    }

    this.isLoading = false;
  }

  private onScroll(): void {
    requestAnimationFrame(() => this.render());
  }

  /**
   * O(log N) Binary Search algorithm to find the first visible item index matching scrollTop
   */
  private findStartIndex(scrollTop: number): number {
    let low = 0;
    let high = this.itemMetadata.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midOffset = this.itemMetadata[mid].offset;

      if (midOffset === scrollTop) {
        return mid;
      } else if (midOffset < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return low > 0 ? low - 1 : 0;
  }

  /**
   * Renders and recycles active nodes based on binary-searched dynamic boundaries
   */
  private render(): void {
    if (this.items.length === 0) return;

    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;

    // Use binary search to find visible range start in O(log N)
    const rawStartIndex = this.findStartIndex(scrollTop);
    const startIndex = Math.max(0, rawStartIndex - this.bufferSize);

    // Find visible range end
    let endIndex = rawStartIndex;
    while (
      endIndex < this.items.length - 1 &&
      this.itemMetadata[endIndex].offset < scrollTop + viewportHeight
    ) {
      endIndex++;
    }
    endIndex = Math.min(this.items.length - 1, endIndex + this.bufferSize);

    const activeIndices = new Set<number>();
    for (let i = startIndex; i <= endIndex; i++) {
      activeIndices.add(i);
    }

    // Unmount off-screen nodes and return to recycling pool
    this.visibleNodes.forEach((node, index) => {
      if (!activeIndices.has(index)) {
        if (this.resizeObserver) this.resizeObserver.unobserve(node);
        node.remove();
        this.pool.push(node);
        this.visibleNodes.delete(index);
      }
    });

    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.visibleNodes.has(i)) {
        const itemData = this.items[i];
        let node: HTMLElement;

        if (this.pool.length > 0) {
          node = this.pool.pop()!;
          this.updateNodeData(node, itemData, i);
        } else {
          node = this.renderItem(itemData, i);
        }

        node.setAttribute('data-index', i.toString());
        node.style.position = 'absolute';
        node.style.top = '0';
        node.style.left = '0';
        node.style.width = '100%';
        // Apply Y-offset calculated dynamically from metadata cache
        node.style.transform = `translate3d(0, ${this.itemMetadata[i].offset}px, 0)`;

        this.visibleNodes.set(i, node);
        fragment.appendChild(node);

        // Track rendered element dimensions with ResizeObserver
        if (this.resizeObserver) {
          this.resizeObserver.observe(node);
        }
      } else {
        // Update position if previous siblings changed size
        const node = this.visibleNodes.get(i)!;
        node.style.transform = `translate3d(0, ${this.itemMetadata[i].offset}px, 0)`;
      }
    }

    this.contentWrapper.appendChild(fragment);

    // Reposition infinite loading bottom sentinel
    if (this.observer) {
      this.observer.unobserve(this.bottomSentinel);
      const lastIndex = this.items.length - 1;
      const sentinelOffset = this.itemMetadata[lastIndex]?.offset ?? 0;
      this.bottomSentinel.style.transform = `translate3d(0, ${sentinelOffset}px, 0)`;
      this.contentWrapper.appendChild(this.bottomSentinel);
      this.observer.observe(this.bottomSentinel);
    }
  }

  private updateNodeData(node: HTMLElement, data: T, index: number): void {
    const freshNode = this.renderItem(data, index);
    node.innerHTML = freshNode.innerHTML;
  }

  public destroy(): void {
    if (this.observer) this.observer.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.container.innerHTML = '';
  }
}

```

---

## 3. Dynamic Usage Example

```typescript
// Render variable height content (cards with varying text lengths)
const container = document.getElementById('virtual-scroll-container')!;

let currentId = 0;
const sampleParagraphs = [
  "Short comment.",
  "Medium length comment that spans two or three lines depending on container width.",
  "Very long post content. " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(4),
];

const fetchVariablePage = async () => {
  await new Promise((res) => setTimeout(res, 150));
  const page = [];
  for (let i = 0; i < 40; i++) {
    currentId++;
    const text = sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)];
    page.push({ id: currentId, text });
  }
  return page;
};

const dynamicList = new DynamicVirtualizedList({
  container,
  estimatedItemHeight: 60, // Estimated guess
  bufferSize: 4,
  fetchMoreData: fetchVariablePage,
  renderItem: (item) => {
    const card = document.createElement('div');
    card.style.padding = '12px 16px';
    card.style.borderBottom = '1px solid #ddd';
    card.style.boxSizing = 'border-box';
    card.style.background = '#fff';
    card.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">User #${item.id}</div>
      <div style="font-size: 14px; color: #444;">${item.text}</div>
    `;
    return card;
  },
});

```

---

## 4. Performance Optimizations Summary

1. **Binary Search ($O(\log N)$):** Locates the top visible node in milliseconds, even across hundreds of thousands of items with non-uniform heights.
2. **`ResizeObserver` Integration:** Measures true DOM layout dimensions automatically upon entry into the DOM, self-correcting scroll position calculations on the fly.
3. **Offset Prefix Cache:** Avoids $O(N)$ DOM querying loops on every frame by recalculating $Y$-offsets only when an item's measured dimensions change.

Explain how to handle scroll anchoring and prevent scroll position jumping when scrolling upwards in dynamic height virtual lists.

When scrolling upwards in a virtualized list with **dynamic item heights**, you often encounter a jarring user experience: **scroll position jumping or content shifting**.

This happens because when new items are prepended (or when items above the viewport are measured and their heights differ from your initial estimates), the browser's scroll position remains anchored to an absolute pixel value. Since the content above shifted, the user's view suddenly jumps to a completely different item.

Here is how front-end systems architect **Scroll Anchoring** and **Pre-Measurement / Estimate Correction** to eliminate scroll jumps.

---

## 1. Why Scroll Jumps Happen in Upward Scrolling

1. **Prepend Data Loading:** When a user scrolls to the top and you fetch older pages, you insert items *above* the current viewport.
2. **Height Mutation Drift:** If your initial height guess (`estimatedItemHeight`) for those prepended items was incorrect, the moment those items render and `ResizeObserver` corrects their true heights, the total offset of everything below shifts.
3. **The Pixel Disconnect:** If the container was scrolled to `scrollTop = 500px`, adding 3 items above that shift their combined height by 200px means `scrollTop` needs to become `700px` to keep the exact same visual content pinned to the top of the viewport.

---

## 2. The Solution: Scroll Anchoring Strategies

To prevent jumps, you must intercept data prepending or height adjustments and **adjust `scrollTop` by the exact delta** of the newly added content height.

---

### Strategy A: Upward Pagination Scroll Anchoring (Prepending Data)

When fetching previous pages and prepending items to the top of the array:

1. **Record Pre-Prepend State:** Capture the exact DOM element or scroll offset *before* updating the array.
2. **Prepend & Adjust:** Insert the new items into the items array and adjust metadata offsets.
3. **Compensate `scrollTop`:** Immediately increase the container's `scrollTop` by the total height added by the newly prepended items.

```typescript
// Example: Prepending items safely without a scroll jump
public async prependPreviousPage(fetchOlderData: () => Promise<T[]>) {
  if (this.isLoadingOlder) return;
  this.isLoadingOlder = true;

  // 1. Capture current anchor point
  const previousScrollHeight = this.scrollPhantom.offsetHeight;
  const previousScrollTop = this.container.scrollTop;

  // 2. Fetch older items
  const olderItems = await fetchOlderData();
  if (olderItems.length === 0) {
    this.isLoadingOlder = false;
    return;
  }

  // 3. Insert items at the beginning of the array
  const addedCount = olderItems.length;
  const estimatedAddedHeight = addedCount * this.estimatedItemHeight;

  // Create metadata entries for older items
  const newMetadata: ItemMeta[] = olderItems.map(() => ({
    offset: 0,
    height: this.estimatedItemHeight,
  }));

  this.items = [...olderItems, ...this.items];
  this.itemMetadata = [...newMetadata, ...this.itemMetadata];

  // 4. Recompute all cumulative offsets from index 0
  this.recomputeOffsets(0);

  // 5. Calculate exact height delta added at the top
  const newScrollHeight = this.scrollPhantom.offsetHeight;
  const heightDelta = newScrollHeight - previousScrollHeight;

  // 6. Instantly compensate container scrollTop to anchor user view
  this.container.scrollTop = previousScrollTop + heightDelta;

  this.isLoadingOlder = false;
  this.render();
}

```

---

### Strategy B: Native CSS Scroll Anchoring (`overflow-anchor`)

Modern browsers feature a built-in CSS property called **`overflow-anchor`** that automatically locks scroll position when DOM nodes are injected above the visible area.

* **How to enable it:**

```css
.virtual-scroll-container {
  overflow-anchor: auto; /* Default in modern browsers */
}

```

* **Opting out for specific anchor nodes:**
If you want to prevent the browser from anchoring to a specific volatile element (like a dynamic loading spinner), you can disable it:

```css
.loading-spinner {
  overflow-anchor: none;
}

```

* **Limitation:** While `overflow-anchor` handles standard DOM updates automatically, virtual lists rely heavily on absolute positioning (`transform: translate3d`) and dynamic height caches, meaning CSS anchoring alone is often insufficient. Manual delta compensation (Strategy A) is required for robust virtualized frameworks.

---

### Strategy C: Handling Resize Shifts (Dynamic Height Correction)

When items render for the first time and `ResizeObserver` measures their true height, shifting items *above* the current viewport can cause subtle jumps.

To prevent this, anchor the scroll position to a specific **anchor item ID** rather than raw pixel coordinates during dynamic resizes:

```typescript
// 1. Identify the first visible item in the viewport before height changes
const anchorIndex = this.findStartIndex(this.container.scrollTop);
const anchorItemOffsetBefore = this.itemMetadata[anchorIndex]?.offset ?? 0;
const distanceIntoItem = this.container.scrollTop - anchorItemOffsetBefore;

// --- [ ResizeObserver updates heights & recomputes offsets ] ---
this.recomputeOffsets();

// 2. Restore exact visual position based on the anchor item's new offset
const anchorItemOffsetAfter = this.itemMetadata[anchorIndex]?.offset ?? 0;
this.container.scrollTop = anchorItemOffsetAfter + distanceIntoItem;

```

---

## 3. Summary Checklist for Smooth Upward Scrolling

1. **Never rely on raw pixel positions** when mutating arrays from the top.
2. **Track height deltas** (`newTotalHeight - oldTotalHeight`) whenever prepending items.
3. **Mutate `scrollTop` synchronously** in the exact same execution tick after prepending data, *before* the browser paints the next frame, eliminating visual flicker.
4. **Leverage anchor referencing** (tracking a specific item index) when asynchronous layout measurements alter heights above the current viewport.
