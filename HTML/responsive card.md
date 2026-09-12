We need to make a responsive card, three on the desktop, two on the tablet, one on the mobile. How we can achieve?

The cleanest and most robust way to achieve this is using **CSS Grid** with mobile-first media queries.

---

### HTML Structure

```html
<div class="card-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>

```

---

### Method 1: CSS Grid (Recommended)

CSS Grid is ideal for explicit multi-column layouts because it handles equal-height cards and consistent spacing automatically.

```css
/* Mobile: 1 column by default */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Card basic styling */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

```

---

### Method 2: Flexbox Alternative

If you need Flexbox to control how trailing items behave:

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
}

/* Mobile: 1 per row (100%) */
.card {
  flex: 1 1 100%;
}

/* Tablet: 2 per row (accounting for gap) */
@media (min-width: 640px) {
  .card {
    flex: 1 1 calc(50% - (1.5rem / 2));
  }
}

/* Desktop: 3 per row (accounting for gap) */
@media (min-width: 1024px) {
  .card {
    flex: 0 1 calc(33.333% - (1.5rem * 2 / 3));
  }
}

```

---

### Method 3: Tailwind CSS (If using utility classes)

```html
<div class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-lg border bg-white p-6 shadow-sm">Card 1</div>
  <div class="rounded-lg border bg-white p-6 shadow-sm">Card 2</div>
  <div class="rounded-lg border bg-white p-6 shadow-sm">Card 3</div>
</div>

```
