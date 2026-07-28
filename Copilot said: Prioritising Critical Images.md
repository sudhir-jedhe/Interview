# Prioritising Critical Images

One of the biggest image-performance mistakes is treating **all images equally**.

Browsers have limited bandwidth and must decide:

```text
Download Hero Image?
Download Logo?
Download Gallery Images?
Download Footer Images?
```

Your job as a frontend engineer is to help the browser prioritise the **most important image first**—usually the image that becomes the **Largest Contentful Paint (LCP)** element. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# What Is a Critical Image?

A critical image is an image that appears:

```text
✅ Above the fold
✅ Immediately visible
✅ Part of LCP
✅ Essential for first impression
```

Examples:

```text
Hero Banner
Product Hero Image
Article Cover Image
Main Promotional Image
```

These images directly affect LCP and should be prioritised. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# Typical Page

```text
────────────────────────
 Hero Image   ← Critical
────────────────────────

 Product Card 1
 Product Card 2
 Product Card 3

 Gallery
 Footer Images
```

Priority:

```text
High:
Hero

Medium:
Above-fold content

Low:
Everything below viewport
```

[\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# 1. Use `fetchpriority="high"`

Modern browsers support:

```html
hero.webp alt="Hero" fetchpriority="high" />
```

This tells the browser:

```text
"Download this before competing images."
```

The Fetch Priority API allows developers to indicate that a resource should receive a higher relative priority than the browser would normally assign. One documented use case is boosting the priority of the LCP image. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[allahabadi.dev\]](https://allahabadi.dev/blogs/frontend/fetchpriority-lcp-hero-image-priority/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 2. Preload Hero Images

Browser normally discovers:

```text
HTML
 ↓
CSS
 ↓
Layout
 ↓
Image
```

This discovery can happen too late.

Instead:

```html

```

Preloading lets the browser begin downloading the image earlier than it otherwise would. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 3. Never Lazy Load Critical Images

❌ Wrong

```html
hero.webp loading="lazy" />
```

✅ Correct

```html
hero.webp loading="eager" fetchpriority="high" />
```

Multiple performance guides explicitly recommend removing lazy loading from hero/above-the-fold images and reserving lazy loading for non-critical content. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[dev.to\]](https://dev.to/highcenburg/boosting-lcp-a-guide-to-fetchpriorityhigh-5b57)

---

# 4. Lazy Load Everything Else

Below-the-fold images should use:

```html
gallery-1.webp loading="lazy" />
```

```html
gallery-2.webp loading="lazy" />
```

This preserves bandwidth for critical resources. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[dev.to\]](https://dev.to/highcenburg/boosting-lcp-a-guide-to-fetchpriorityhigh-5b57)

---

# 5. Use Responsive Preloads

For responsive hero images:

```html

```

Responsive preloads allow the browser to preload different critical images for different viewports. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 6. Find Your Actual LCP Image

Do not guess.

Use:

```text
Chrome DevTools
PageSpeed Insights
Lighthouse
WebPageTest
```

These tools can identify the actual LCP element, which may differ between mobile and desktop layouts. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# React Example

```jsx
function Hero() {
  return (
    /hero.webp
  );
}
```

---

# Next.js Example

```jsx
import Image from "next/image";

/hero.webp
```

The `priority` pattern is commonly described as disabling lazy loading for the critical image and prioritising its loading. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images)

---

# Priority Matrix

| Image Type                   | Priority |
| ---------------------------- | -------- |
| Hero / LCP                   | High     |
| Above-the-fold product image | High     |
| Navigation logo              | Medium   |
| Carousel images not visible  | Low      |
| Gallery images below fold    | Low      |
| Footer images                | Low      |

This aligns with published guidance distinguishing hero/above-the-fold images from deferred content. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# Common Mistakes

### Mistake 1

```html
loading="lazy"
```

on hero image. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

### Mistake 2

Preloading:

```text
20 images
```

instead of the actual LCP image.

Performance guidance warns that preloading the wrong image wastes a high-priority network slot. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

### Mistake 3

```html
hero.jpg
```

without:

```html
fetchpriority="high"
```

when it is the LCP candidate. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# Senior Frontend Interview Answer

> Prioritising critical images means identifying the image most important to initial rendering—typically the LCP image—and ensuring it loads before competing resources. I do this by making the image discoverable in HTML, preloading it when necessary, applying `fetchpriority="high"`, and avoiding lazy loading on above-the-fold content. All non-critical below-the-fold images are deferred with `loading="lazy"` so bandwidth remains available for the critical rendering path. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

# Prioritising Critical Images

One of the biggest image-performance mistakes is treating **all images equally**.

Browsers have limited bandwidth and must decide:

```text
Download Hero Image?
Download Logo?
Download Gallery Images?
Download Footer Images?
```

Your job as a frontend engineer is to help the browser prioritise the **most important image first**—usually the image that becomes the **Largest Contentful Paint (LCP)** element. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# What Is a Critical Image?

A critical image is an image that appears:

```text
✅ Above the fold
✅ Immediately visible
✅ Part of LCP
✅ Essential for first impression
```

Examples:

```text
Hero Banner
Product Hero Image
Article Cover Image
Main Promotional Image
```

These images directly affect LCP and should be prioritised. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# Typical Page

```text
────────────────────────
 Hero Image   ← Critical
────────────────────────

 Product Card 1
 Product Card 2
 Product Card 3

 Gallery
 Footer Images
```

Priority:

```text
High:
Hero

Medium:
Above-fold content

Low:
Everything below viewport
```

[\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# 1. Use `fetchpriority="high"`

Modern browsers support:

```html
hero.webp alt="Hero" fetchpriority="high" />
```

This tells the browser:

```text
"Download this before competing images."
```

The Fetch Priority API allows developers to indicate that a resource should receive a higher relative priority than the browser would normally assign. One documented use case is boosting the priority of the LCP image. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[allahabadi.dev\]](https://allahabadi.dev/blogs/frontend/fetchpriority-lcp-hero-image-priority/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 2. Preload Hero Images

Browser normally discovers:

```text
HTML
 ↓
CSS
 ↓
Layout
 ↓
Image
```

This discovery can happen too late.

Instead:

```html

```

Preloading lets the browser begin downloading the image earlier than it otherwise would. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 3. Never Lazy Load Critical Images

❌ Wrong

```html
hero.webp loading="lazy" />
```

✅ Correct

```html
hero.webp loading="eager" fetchpriority="high" />
```

Multiple performance guides explicitly recommend removing lazy loading from hero/above-the-fold images and reserving lazy loading for non-critical content. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[dev.to\]](https://dev.to/highcenburg/boosting-lcp-a-guide-to-fetchpriorityhigh-5b57)

---

# 4. Lazy Load Everything Else

Below-the-fold images should use:

```html
gallery-1.webp loading="lazy" />
```

```html
gallery-2.webp loading="lazy" />
```

This preserves bandwidth for critical resources. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[dev.to\]](https://dev.to/highcenburg/boosting-lcp-a-guide-to-fetchpriorityhigh-5b57)

---

# 5. Use Responsive Preloads

For responsive hero images:

```html

```

Responsive preloads allow the browser to preload different critical images for different viewports. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# 6. Find Your Actual LCP Image

Do not guess.

Use:

```text
Chrome DevTools
PageSpeed Insights
Lighthouse
WebPageTest
```

These tools can identify the actual LCP element, which may differ between mobile and desktop layouts. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# React Example

```jsx
function Hero() {
  return (
    /hero.webp
  );
}
```

---

# Next.js Example

```jsx
import Image from "next/image";

/hero.webp
```

The `priority` pattern is commonly described as disabling lazy loading for the critical image and prioritising its loading. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images)

---

# Priority Matrix

| Image Type                   | Priority |
| ---------------------------- | -------- |
| Hero / LCP                   | High     |
| Above-the-fold product image | High     |
| Navigation logo              | Medium   |
| Carousel images not visible  | Low      |
| Gallery images below fold    | Low      |
| Footer images                | Low      |

This aligns with published guidance distinguishing hero/above-the-fold images from deferred content. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

# Common Mistakes

### Mistake 1

```html
loading="lazy"
```

on hero image. [\[frontendchecklist.io\]](https://frontendchecklist.io/rules/images/critical-images), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

### Mistake 2

Preloading:

```text
20 images
```

instead of the actual LCP image.

Performance guidance warns that preloading the wrong image wastes a high-priority network slot. [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/)

---

### Mistake 3

```html
hero.jpg
```

without:

```html
fetchpriority="high"
```

when it is the LCP candidate. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)

---

# Senior Frontend Interview Answer

> Prioritising critical images means identifying the image most important to initial rendering—typically the LCP image—and ensuring it loads before competing resources. I do this by making the image discoverable in HTML, preloading it when necessary, applying `fetchpriority="high"`, and avoiding lazy loading on above-the-fold content. All non-critical below-the-fold images are deferred with `loading="lazy"` so bandwidth remains available for the critical rendering path. [\[web.dev\]](https://web.dev/articles/fetch-priority), [\[adame.io\]](https://adame.io/techniques/optimize-critical-images/), [\[unlighthouse.dev\]](https://unlighthouse.dev/learn-lighthouse/lcp/prioritize-lcp-image)
