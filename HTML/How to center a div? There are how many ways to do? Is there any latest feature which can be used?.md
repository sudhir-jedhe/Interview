There are at least **6 primary ways** to center a `<div>` in CSS, ranging from the latest modern specifications to classic layout techniques.

---

### The Latest Feature: `align-content` on Block Layouts

Historically, `align-content` only worked inside Flexbox or Grid containers. Modern browsers (Chrome 123+, Safari 17.4+, Firefox 125+) support **`align-content` directly on standard block containers**:

```css
.parent {
  height: 100vh;
  align-content: center; /* Vertically centers children without Flex or Grid */
}

.child {
  margin-inline: auto;   /* Horizontally centers the block element */
  width: fit-content;
}

```

You can now vertically center child elements in a plain `<div>` without changing its `display` type to `flex` or `grid`.

---

### All Common Ways to Center a Div

**1. CSS Grid (`place-items: center`) — Most concise**
Requires only two lines on the container to center both horizontally and vertically:

```css
.parent {
  display: grid;
  place-items: center;
}

```

**2. Flexbox (`justify-content` + `align-items`) — Most common**
Centers items along both axes cleanly:

```css
.parent {
  display: flex;
  justify-content: center; /* Horizontal */
  align-items: center;     /* Vertical */
}

```

**3. Flexbox + `margin: auto**`
Setting `margin: auto` on a child inside a Flex container automatically consumes all available space in all directions:

```css
.parent {
  display: flex;
}
.child {
  margin: auto;
}

```

**4. Absolute Positioning + `translate**`
Standard technique for overlays, tooltips, or modals regardless of container display type:

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

```

**5. Modern Inset + `margin: auto**`
A cleaner alternative to `transform` for absolute centering:

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 200px;  /* Requires explicit dimensions */
  height: 200px;
}

```

**6. Table Cell Fallback (Legacy)**
Simulates HTML table-cell behavior:

```css
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.child {
  display: inline-block;
}

```

For most modern layouts, **CSS Grid (`place-items: center`)** remains the quickest approach for dedicated containers, while **`align-content: center`** is the cleanest new way to align content vertically inside default block elements.
