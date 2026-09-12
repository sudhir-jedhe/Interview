To create an accessible, production-ready `<LazyImage/>` component backed by the shared observer pattern, you must balance performance with accessibility fundamentals:

1. **Avoid Layout Shifts (CLS):** Reserve layout space using explicit `width`/`height` or CSS `aspect-ratio` before the image loads.
2. **Accessible Semantics:** Preserve the native `alt` attribute for assistive tech.
3. **Screen Reader Experience:** Do not announce low-quality placeholders or broken states as separate elements; communicate status cleanly without generating noisy live-region spam.
4. **Reduced Motion:** Respect `prefers-reduced-motion` for transitions.
5. **No-JS Fallback:** Provide a `<noscript>` fallback so users without JavaScript (or search crawler bots) still get the image.

---

### 1. The `<LazyImage/>` Component

This component uses the shared `observeElement` manager defined previously.

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { observeElement } from './observerManager';
import './LazyImage.css';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string; // Required for accessibility
  width: number | string;
  height: number | string;
  placeholderSrc?: string;
  rootMargin?: string;
  threshold?: number | number[];
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0,
  className = '',
  style,
  ...restProps
}: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Register with our shared IntersectionObserver manager
    const unobserve = observeElement(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          unobserve(); // Stop observing once it enters the target viewport margin
        }
      },
      { rootMargin, threshold }
    );

    return () => unobserve();
  }, [rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={`lazy-img-wrapper ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        maxWidth: typeof width === 'number' ? `${width}px` : width,
        ...style,
      }}
    >
      {/* 1. Optional Low-Quality Placeholder or Skeleton */}
      {placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt="" // Presentational placeholder must be hidden from screen readers
          aria-hidden="true"
          className="lazy-img-placeholder"
        />
      )}

      {/* 2. Main Lazy-loaded Image */}
      {isVisible && !hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy" // Native browser fallback
          decoding="async" // Offload image decoding from the main thread
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`lazy-img-element ${isLoaded ? 'is-loaded' : 'is-loading'}`}
          {...restProps}
        />
      )}

      {/* 3. Accessible Error Fallback */}
      {hasError && (
        <div className="lazy-img-error" role="alert">
          <span className="sr-only">Image failed to load: </span>
          <span>{alt || 'Image unavailable'}</span>
        </div>
      )}

      {/* 4. Progressive Enhancement: Fallback for environments with JS disabled */}
      <noscript>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="lazy-img-element is-loaded"
          {...restProps}
        />
      </noscript>
    </div>
  );
}

```

---

### 2. Accompanying CSS Styles (`LazyImage.css`)

```css
/* Container reserves dimensions to prevent Cumulative Layout Shift (CLS) */
.lazy-img-wrapper {
  position: relative;
  display: block;
  overflow: hidden;
  background-color: #f3f4f6; /* Neutral skeleton placeholder */
  width: 100%;
}

/* Base image styling */
.lazy-img-element {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

/* Smooth fade-in on full resolution arrival */
.lazy-img-element.is-loaded {
  opacity: 1;
}

/* Blur-up placeholder styling */
.lazy-img-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px);
  transform: scale(1.05); /* Prevents blur bleed past edges */
  pointer-events: none;
}

/* Error fallback styling */
.lazy-img-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
  text-align: center;
  border: 1px dashed #d1d5db;
}

/* Accessible screen-reader-only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .lazy-img-element {
    transition: none;
  }
}

```

---

### 3. Usage Example

```tsx
import React from 'react';
import { LazyImage } from './LazyImage';

export function ProductGallery() {
  return (
    <div className="gallery-grid">
      <LazyImage
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000"
        placeholderSrc="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&blur=20"
        alt="Red Nike running shoe on a minimalist grey pedestal"
        width={600}
        height={400}
        rootMargin="0px 0px 300px 0px"
      />
    </div>
  );
}

```

---

### Key Accessibility & Performance Rules Followed

* **Explicit Dimensions (`aspect-ratio`):** Declaring `width` and `height` alongside CSS `aspect-ratio` guarantees the browser allocates the exact box dimensions in the layout tree before bytes are fetched, avoiding layout shifts (**CLS score = 0**).
* **Decorative Placeholders Marked `aria-hidden="true"`:** Placeholders use `alt=""` and `aria-hidden="true"` so screen reader users do not hear low-res descriptions or duplicate image announcements.
* **`decoding="async"`:** Ensures that offscreen or newly intersecting images decode in a background thread rather than stalling main-thread UI interactivity during scrolling.
* **`role="alert"` for Errors:** If an image fails to load, assistive technologies are notified with context (`role="alert"`), displaying the original `alt` text as a visible fallback.
* **`<noscript>` Fallback:** If JavaScript fails to load or the user has scripts disabled, the core `<img>` tag is immediately readable and renderable by both browsers and search indexers.

How do I modify this accessible LazyImage component to support responsive picture and srcset sources?

To support responsive images using `<picture>` and `srcset`, you wrap the inner `<img>` in a `<picture>` element once the container enters the viewport, passing through `<source>` definitions for modern formats (AVIF, WebP) and viewport-based resolution switches.

---

### 1. Updated Component (`LazyImage.tsx`)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { observeElement } from './observerManager';
import './LazyImage.css';

export interface ImageSource {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
}

export interface LazyResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string; // Enforced accessibility requirement
  width: number | string;
  height: number | string;
  sources?: ImageSource[];
  placeholderSrc?: string;
  rootMargin?: string;
  threshold?: number | number[];
}

export function LazyResponsiveImage({
  src,
  alt,
  width,
  height,
  sources = [],
  placeholderSrc,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0,
  className = '',
  style,
  sizes,
  ...restProps
}: LazyResponsiveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const unobserve = observeElement(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          unobserve();
        }
      },
      { rootMargin, threshold }
    );

    return () => unobserve();
  }, [rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={`lazy-img-wrapper ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        maxWidth: typeof width === 'number' ? `${width}px` : width,
        ...style,
      }}
    >
      {/* 1. Low-Quality Blur/Skeleton Placeholder */}
      {placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="lazy-img-placeholder"
        />
      )}

      {/* 2. Responsive Picture Wrapper */}
      {isVisible && !hasError && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              media={source.media}
              type={source.type}
              sizes={source.sizes || sizes}
            />
          ))}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`lazy-img-element ${isLoaded ? 'is-loaded' : 'is-loading'}`}
            {...restProps}
          />
        </picture>
      )}

      {/* 3. Accessible Error Fallback */}
      {hasError && (
        <div className="lazy-img-error" role="alert">
          <span className="sr-only">Image failed to load: </span>
          <span>{alt || 'Image unavailable'}</span>
        </div>
      )}

      {/* 4. No-JS / SEO Fallback */}
      <noscript>
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              media={source.media}
              type={source.type}
              sizes={source.sizes || sizes}
            />
          ))}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className="lazy-img-element is-loaded"
            {...restProps}
          />
        </picture>
      </noscript>
    </div>
  );
}

```

---

### 2. Usage Examples

#### Scenario A: Next-Gen Format Negotiation (AVIF → WebP → JPEG)

Serve compressed formats based on browser capabilities:

```tsx
<LazyResponsiveImage
  src="/images/hero-fallback.jpg"
  alt="Modern architectural house exterior with warm lighting"
  width={1200}
  height={675}
  placeholderSrc="/images/hero-lqip.jpg"
  sources={[
    {
      srcSet: '/images/hero.avif',
      type: 'image/avif',
    },
    {
      srcSet: '/images/hero.webp',
      type: 'image/webp',
    },
  ]}
/>

```

#### Scenario B: Art Direction and Density Switching

Serve different crops or aspect ratios across mobile and desktop, plus retina (`2x`) densities:

```tsx
<LazyResponsiveImage
  src="/images/product-desktop-1x.jpg"
  alt="Noise-cancelling wireless headphones in matte black"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  sources={[
    // Mobile Viewport (Portrait crop)
    {
      media: '(max-width: 768px)',
      srcSet: '/images/product-mobile-1x.jpg 1x, /images/product-mobile-2x.jpg 2x',
    },
    // Desktop Viewport (Landscape composition)
    {
      media: '(min-width: 769px)',
      srcSet: '/images/product-desktop-1x.jpg 1x, /images/product-desktop-2x.jpg 2x',
    },
  ]}
/>

```

---

### Critical Responsive & Accessibility Notes

* **Single `alt` on the `<img>` tag:** The HTML standard assigns accessibility properties (like `alt`, `role`, and ARIA attributes) to the child `<img>` element, never to the parent `<picture>` or `<source>` tags. Screen readers parse only the inner `<img>`.
* **Dimension Allocation with `aspect-ratio`:** When art-direction changes the aspect ratio across breakpoints (e.g., square `1 / 1` on mobile vs `16 / 9` on desktop), override `aspectRatio` in CSS media queries targeting `.lazy-img-wrapper`:

```css
.hero-responsive-wrapper {
  aspect-ratio: 1 / 1;
}
@media (min-width: 768px) {
  .hero-responsive-wrapper {
    aspect-ratio: 16 / 9;
  }
}

```

* **Correct Order in `sources`:** Browsers evaluate `<source>` tags top-to-bottom and pick the **first matching candidate**. Always order formats from most optimized to least (`image/avif` before `image/webp`), and media queries from most specific to least.
