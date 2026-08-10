Here is the complete English translation of the explanation on Virtualization Techniques, Loading New Data, Element Recycling, and Pooling:

---

# Virtualization Techniques in Front-End System Design: Loading New Data, Creating Virtual Pools, and Recycling Elements

**Virtualization Techniques** represent a powerful front-end system design pattern used when an application needs to render **thousands or millions of data items** (such as long lists, massive tables, or infinite scroll feeds) smoothly without performance lag or dropped frames.

When a browser attempts to render 10,000 DOM elements simultaneously, memory consumption spikes, layout recalculations (reflows) slow to a crawl, and the page can easily crash. The golden rule of virtualization is: **"Render only what is visible inside the viewport, and discard or recycle the rest."**

---

## 1. How Virtualization Works (Core Concept)

1. **Total Height Virtualization:** A placeholder element (phantom container) is created to match the combined total height of all items in the list (e.g., 10,000 items $\times$ 50px = 500,000px height), generating a natural scrollbar.
2. **Viewport Windowing:** The user views only a small subset of items currently intersecting the visible screen window (e.g., 10 to 20 items).
3. **Absolute Positioning:** These visible items are positioned precisely within the viewport using `position: absolute` and `transform: translateY()`.
4. **Dynamic Scrolling:** As the user scrolls, computed indices update dynamically, shifting and re-rendering active items in real time.

---

## 2. System Design Architecture: Loading New Data

When implementing infinite scrolling with a virtualized list, data handling follows a structured architecture:

* **Paging / Chunking:** Instead of fetching all data in a single massive payload, data is loaded from the server in paginated chunks (e.g., 50 or 100 items per page).
* **Buffer Zone (Overscan):** As the user approaches the bottom of the list, an **Intersection Observer** or optimized scroll listener triggers a background fetch for the next page.
* **Memory Array Append:** Newly fetched data is appended to the existing dataset array, which dynamically extends the total virtual scroll height.

---

## 3. Element Recycling & Pooling

Creating brand-new DOM nodes and deleting old ones (garbage collection pauses) on every scroll event puts heavy pressure on the CPU. To prevent this, **DOM Recycling and Pooling** are employed.

### How It Works

* The browser maintains a **fixed pool of DOM elements** (e.g., exactly 20 DOM nodes) regardless of whether the underlying list contains 10,000 items.
* When an item scrolls out of view, its DOM node is not destroyed.
* Instead, the node is **recycled**—its text content, data bindings, and styles are updated, and it is repositioned to a new index at the top or bottom of the viewport.
* This completely eliminates **Garbage Collection (GC) spikes** and keeps the application's memory footprint stable.

---

## 4. Practical Code: Vanilla JavaScript Virtual Scroll Engine

Here is a lightweight, high-performance virtual scroll engine that implements element positioning, recycling, and dynamic rendering:

```typescript
interface VirtualScrollOptions {
  container: HTMLElement;
  itemHeight: number;
  totalItems: number;
  renderItem: (index: number) => HTMLElement;
}

class VirtualScroller {
  private phantomDiv: HTMLDivElement;
  private viewportDiv: HTMLDivElement;
  private visibleCount: number;
  private cachedItems: Map<number, HTMLElement> = new Map();

  constructor(private options: VirtualScrollOptions) {
    const { container, itemHeight, totalItems } = options;

    // 1. Set total virtual height to generate accurate scrollbars
    this.phantomDiv = document.createElement('div');
    this.phantomDiv.style.height = `${totalItems * itemHeight}px`;
    this.phantomDiv.style.position = 'relative';
    container.appendChild(this.phantomDiv);

    // 2. Create the visible viewport container
    this.viewportDiv = document.createElement('div');
    this.viewportDiv.style.position = 'absolute';
    this.viewportDiv.style.top = '0';
    this.viewportDiv.style.left = '0';
    this.viewportDiv.style.right = '0';
    this.phantomDiv.appendChild(this.viewportDiv);

    // Calculate how many items fit concurrently inside the viewport container
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2; // Including buffer rows

    // 3. Attach scroll listener
    container.addEventListener('scroll', () => this.onScroll());
    this.render();
  }

  private onScroll(): void {
    requestAnimationFrame(() => this.render());
  }

  private render(): void {
    const { container, itemHeight, totalItems, renderItem } = this.options;
    const scrollTop = container.scrollTop;

    // Calculate the start index that should be visible on screen
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
    const endIndex = Math.min(totalItems, startIndex + this.visibleCount);

    // Translate the viewport container position to the correct offset
    this.viewportDiv.style.transform = `translateY(${startIndex * itemHeight}px)`;

    // DOM Recycling and Pooling Logic
    const currentActiveIndexes = new Set<number>();

    for (let i = startIndex; i < endIndex; i++) {
      currentActiveIndexes.add(i);
      let itemEl = this.cachedItems.get(i);

      if (!itemEl) {
        // Create new element if not available in the pool
        itemEl = renderItem(i);
        itemEl.style.position = 'absolute';
        itemEl.style.top = `${(i - startIndex) * itemHeight}px`;
        itemEl.style.height = `${itemHeight}px`;
        this.viewportDiv.appendChild(itemEl);
        this.cachedItems.set(i, itemEl);
      } else {
        // Reuse/reposition existing element if already cached
        itemEl.style.top = `${(i - startIndex) * itemHeight}px`;
      }
    }

    // Hide or remove items that are no longer inside the viewport
    this.cachedItems.forEach((el, index) => {
      if (!currentActiveIndexes.has(index)) {
        el.remove();
        this.cachedItems.delete(index);
      }
    });
  }
}

```

---

## 5. Key System Design Challenges in Virtualization

1. **Dynamic / Variable Heights:** When items in a list have variable heights (e.g., chat messages or responsive cards with dynamic text wrapping), static height calculations fail. This requires **dynamic measurement and estimation engines** (such as those used in TanStack Virtual or React Virtualized).
2. **Scroll Flickering:** Rapid scrolling can occasionally cause brief rendering delays for incoming items, leading to visual flicker. This is mitigated by adding **Overscan / Buffer Rows** (rendering 2 to 3 extra hidden rows above and below the viewport boundary).
