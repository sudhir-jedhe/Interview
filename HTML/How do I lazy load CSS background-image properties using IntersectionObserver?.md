Browsers download a CSS `background-image` the moment a selector containing `url(...)` matches an element in the DOM. To lazy load background images, keep the `url(...)` out of the default stylesheet and apply it via a CSS modifier class or inline style only when the element enters the viewport via `IntersectionObserver`.

---

### 1. The HTML & CSS Setup

Define the layout, dimensions, and optional fallback/low-res color in CSS. Store the image target in a `data-bg` attribute instead of applying it directly.

```html
<section 
  class="lazy-bg" 
  data-bg="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600"
>
  <div class="content">
    <h2>Explore the Coast</h2>
  </div>
</section>

```

```css
.lazy-bg {
  min-height: 450px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* Fallback color/placeholder while loading */
  background-color: #e2e8f0;
  
  /* Smooth visual transition when the image loads */
  transition: background-image 0.3s ease-in-out;
}

/* Modifier class triggered by IntersectionObserver */
.lazy-bg.is-loaded {
  /* Set dynamically via JS variable or inline style */
  background-image: var(--bg-url);
}

```

---

### 2. The JavaScript Implementation

This script observes all `.lazy-bg` elements, preloads the high-resolution image in the background via `new Image()`, and only applies the CSS variable once the image is fully downloaded to prevent visual stutter.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');

  // Fallback for environments lacking IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    lazyBackgrounds.forEach((el) => {
      const src = el.dataset.bg;
      if (src) {
        el.style.setProperty('--bg-url', `url('${src}')`);
        el.classList.add('is-loaded');
      }
    });
    return;
  }

  const bgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const imageUrl = target.dataset.bg;

          if (imageUrl) {
            // Preload off-DOM to ensure smooth rendering before displaying
            const img = new Image();
            img.src = imageUrl;

            img.onload = () => {
              target.style.setProperty('--bg-url', `url('${imageUrl}')`);
              target.classList.add('is-loaded');
            };

            // If the image fails to load, you can attach an error state class
            img.onerror = () => {
              target.classList.add('is-failed');
            };
          }

          // Unobserve so the handler runs only once
          observer.unobserve(target);
        }
      });
    },
    {
      // rootMargin: Pre-fetch 250px before entering viewport for a seamless experience
      rootMargin: '0px 0px 250px 0px',
      threshold: 0.01,
    }
  );

  lazyBackgrounds.forEach((el) => bgObserver.observe(el));
});

```

---

### 3. Handling Responsive Background Images

If you need different background images for mobile and desktop screens, pass responsive breakpoints using dataset properties or `window.matchMedia`:

```html
<section 
  class="lazy-responsive-bg"
  data-bg-mobile="banner-small.jpg"
  data-bg-desktop="banner-large.jpg"
>
  <h1>Hero Title</h1>
</section>

```

```javascript
const isDesktop = window.matchMedia('(min-width: 768px)').matches;
const selectedUrl = isDesktop 
  ? target.dataset.bgDesktop 
  : target.dataset.bgMobile;

target.style.setProperty('--bg-url', `url('${selectedUrl}')`);
target.classList.add('is-loaded');

```

---

### Key Best Practices

* **Always provide explicit height/min-height:** Background images do not push DOM height like `<img>` tags do. Failing to define a `min-height` or explicit sizing causes layout collapse and breaks viewport trigger calculations.
* **Pre-fetch with `rootMargin`:** Setting `rootMargin: '0px 0px 250px 0px'` ensures the image begins downloading before the user reaches it, eliminating blank white space during scrolling.
* **Hero / Above-the-Fold Exception:** Never lazy load background images located above the fold (e.g., hero banners). Load them immediately using standard CSS to protect your **Largest Contentful Paint (LCP)** score.
