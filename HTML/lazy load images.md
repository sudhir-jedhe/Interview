Lazy loading images defers loading offscreen images until the user scrolls near them, dramatically cutting initial page weight, data usage, and First Contentful Paint (FCP).

---

### 1. Native HTML Lazy Loading (Recommended)

Modern browsers natively support lazy loading using the `loading="lazy"` attribute. It requires zero JavaScript.

```html
<img 
  src="image.jpg" 
  alt="Descriptive label" 
  loading="lazy" 
  width="800" 
  height="600"
/>

```

* **Always declare explicit dimensions:** Providing `width` and `height` (or CSS `aspect-ratio`) is critical so the browser can allocate layout space before the image downloads, preventing **Cumulative Layout Shift (CLS)**.
* **Never lazy load above-the-fold images:** Do not add `loading="lazy"` to your hero image or primary visual (the LCP element). For those, load eagerly and consider adding `fetchpriority="high"`:

```html
<img src="hero.jpg" alt="Hero" fetchpriority="high" width="1200" height="600" />

```

---

### 2. JavaScript via `IntersectionObserver` (For Placeholders & Legacy Support)

If you want smooth fade-in animations, blur-up effects, or backward compatibility with older browsers, use an `IntersectionObserver`.

#### HTML Structure

Store the real image URL in a `data-src` attribute and show a low-res placeholder or blank canvas initially:

```html
<img 
  class="lazy-image" 
  src="placeholder.jpg" 
  data-src="high-res-photo.jpg" 
  alt="Gallery Image"
  width="800" 
  height="600"
/>

```

#### CSS Transition

```css
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  background-color: #f3f4f6; /* Gray placeholder box */
}

.lazy-image.loaded {
  opacity: 1;
}

```

#### JavaScript Implementation

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('.lazy-image');

  // Fallback for older browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Swap placeholder with real image
          img.src = img.dataset.src;

          img.onload = () => {
            img.classList.add('loaded');
          };

          // Stop observing once loaded
          observer.unobserve(img);
        }
      });
    },
    {
      // Start fetching 200px before the image enters the viewport
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.01,
    }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
});

```

---

### 3. Responsive Images with `<picture>` and `srcset`

Combine lazy loading with responsive formats (e.g., AVIF/WebP) and adaptive resolutions:

```html
<picture>
  <source type="image/avif" srcset="photo-400.avif 400w, photo-800.avif 800w" />
  <source type="image/webp" srcset="photo-400.webp 400w, photo-800.webp 800w" />
  <img 
    src="photo-800.jpg" 
    alt="Landscape" 
    loading="lazy" 
    decoding="async"
    width="800" 
    height="500" 
    sizes="(max-width: 600px) 100vw, 800px"
  />
</picture>

```

* `decoding="async"`: Instructs the browser to decode the image off the main thread, avoiding frame drops during page scrolling.

---

### 4. Framework-Specific Best Practices

* **React / Next.js:** Use `next/image`, which applies `loading="lazy"`, responsive sizing, modern formats (WebP/AVIF), and blur placeholders automatically. Mark your hero image with `priority`.
* **Vue / Nuxt:** Use `@nuxt/image` with the `loading="lazy"` prop.

---

### Summary Checklist

| Strategy                   | Best Used For                     | Notes                                                       |
| -------------------------- | --------------------------------- | ----------------------------------------------------------- |
| **`loading="lazy"`**       | 90% of web use cases              | Native, lightweight, requires dimensions (`width`/`height`) |
| **`IntersectionObserver`** | Blurred previews, custom fade-ins | Flexible, allows custom `rootMargin` prefetching            |
| **`fetchpriority="high"`** | LCP (Hero) image only             | **Never** lazy load your largest above-the-fold content     |
