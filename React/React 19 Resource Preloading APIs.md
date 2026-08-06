Here is a clean, structured reference guide explaining React 19's new Resource Preloading APIs with practical code examples.

---

# React 19 Resource Preloading APIs: Moving Optimizations into Components

Historically, preloading critical assets required manually inserting `<link rel="preload">`, `<link rel="preconnect">`, or `<link rel="dns-prefetch">` tags into your document `<head>`, or configuring framework-specific plugins.

In React 19, **resource preloading moves directly into component logic**. React provides a suite of hoisting functions from `react-dom` that automatically hoist resource hints to the document `<head>` and deduplicate requests across renders.

---

## 1. Overview of the New APIs (`react-dom`)

React 19 introduces six functions inside `react-dom` to control network connection setup, asset downloading, and module initialization:

```typescript
import { 
  prefetchDNS, 
  preconnect, 
  preload, 
  preloadModule, 
  preinit, 
  preinitModule 
} from 'react-dom';

```

| API Function                      | What It Does                                               | Common Use Case                                          |
| --------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| **`prefetchDNS(url)`**            | Resolves the IP address for a domain early.                | High-probability future external domain calls.           |
| **`preconnect(url, options)`**    | Performs DNS lookup + TCP handshake + TLS negotiation.     | Known external media/API servers (e.g., S3, Cloudinary). |
| **`preload(url, options)`**       | Downloads critical assets (fonts, images, CSS) in advance. | Above-the-fold hero images, custom web fonts.            |
| **`preloadModule(url, options)`** | Downloads an ES module file over the wire early.           | Heavy interactive widgets needed on hover/focus.         |
| **`preinit(url, options)`**       | Downloads **and executes/applies** a script or stylesheet. | Critical component-specific CSS or JS SDKs.              |
| **`preinitModule(url, options)`** | Downloads **and initializes** an ES module file.           | Early initialization of external ES modules.             |

---

## 2. Practical Code Example: E-Commerce Product Page

Below is an example showing how these APIs integrate directly into component life cycles, user interactions, and event handlers.

```jsx
import React from 'react';
import { 
  prefetchDNS, 
  preconnect, 
  preload, 
  preinit, 
  preloadModule 
} from 'react-dom';

export function ProductDetails({ product }) {
  // 1. Establish early network connections during component render
  prefetchDNS('https://analytics.example.com');
  preconnect('https://cdn.myshop.com', { crossOrigin: 'anonymous' });

  // 2. Preload critical above-the-fold assets (Hero Image & Web Font)
  preload(product.heroImageUrl, { as: 'image', fetchPriority: 'high' });
  preload('/fonts/Inter-Bold.woff2', { 
    as: 'font', 
    type: 'font/woff2', 
    crossOrigin: 'anonymous' 
  });

  // 3. Preinit: Download AND execute a third-party SDK script immediately
  preinit('https://checkout.stripe.com/v3.js', { as: 'script' });

  // 4. Preload dynamic modules on user hover/interaction
  const handleMouseEnterReviews = () => {
    // Preload heavy review chart module before user clicks!
    preloadModule('/modules/ReviewAnalyticsChart.js', { as: 'script' });
  };

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      
      {/* Hero Image */}
      <img src={product.heroImageUrl} alt={product.name} />

      {/* Dynamic hover trigger */}
      <button onMouseEnter={handleMouseEnterReviews} onClick={() => alert("Open Reviews")}>
        View Customer Reviews
      </button>
    </div>
  );
}

```

---

## 3. Why This Approach Is Superior

### A. Dynamic & Context-Aware Optimizations

Instead of statically listing dozens of `<link>` tags inside a static HTML `<head>` for assets that *might* be used, components can now conditionally trigger preloads based on **props, route parameters, or fetched data**.

```jsx
function UserGallery({ userTier }) {
  if (userTier === 'VIP') {
    // Dynamically preload 4K video assets only for VIP users
    preload('/assets/vip-stream.mp4', { as: 'video' });
  }
}

```

### B. Automatic Deduplication

If ten instances of a `<ProductCard/>` component call `preload('/images/badge.png', { as: 'image' })` on the same page, React 19 **deduplicates the call**. Only a single `<link rel="preload">` element is inserted into the document `<head>`.

### C. Co-Location of Logic and Performance

Resource hints now live next to the UI code that actually requires them. When a component is refactored, moved, or deleted, its corresponding network preloading hints are naturally refactored or removed alongside it—eliminating "dead" preloads in global HTML head files.

---

## Summary Matrix: `preload` vs. `preinit`

| Aspect                 | `preload()` / `preloadModule()`                                 | `preinit()` / `preinitModule()`                                     |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Download Behavior**  | Downloads the file into the browser cache.                      | Downloads the file into the browser cache.                          |
| **Execution Behavior** | **Does not execute** or apply the file until requested by code. | **Executes immediately** (applies `<script>` or inserts `<style>`). |
| **Primary Use Case**   | Fonts, hero images, lazy-routed JS chunks.                      | Critical external SDKs (Stripe, Analytics), component CSS.          |
