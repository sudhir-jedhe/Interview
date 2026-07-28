# Responsive Images: `srcset`, `sizes`, and `<picture>`

Responsive images solve a common performance problem:

```text
Desktop:
Needs large image

Mobile:
Needs small image

❌ Same image for everyone
✅ Right image for the right device
```

The web platform provides three key tools:

```text
1. srcset
2. sizes
3. <picture>
```

These allow the browser to select the most appropriate image based on viewport size, screen density, media conditions, and supported formats. [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[developer....ozilla.org\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [\[web.dev\]](https://web.dev/learn/performance/image-performance)

---

# Why Responsive Images Matter

Imagine:

```text
Image:
4000px
4 MB
```

Displayed on:

```text
375px mobile screen
```

The user downloads:

```text
4 MB
```

But only sees:

```text
~375px worth of pixels
```

This wastes:

```text
Bandwidth
LCP
Battery
```

Responsive images help browsers download only the image size actually needed. [\[developer....ozilla.org\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [\[htmltoimages.com\]](https://www.htmltoimages.com/blog/responsive-images-guide/), [\[web.dev\]](https://web.dev/learn/performance/image-performance)

---

# 1. `srcset`

`srcset` provides a list of image candidates.

photo-800.jpg![Visualization](

Meaning:

```text
400w  → image is 400px wide
800w  → image is 800px wide
1200w → image is 1200px wide
```

Browser chooses the best image automatically. [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[htmltoimages.com\]](https://www.htmltoimages.com/blog/responsive-images-guide/)

---

# Browser Selection Example

```text
Phone width:
375px

DPR:
2x
```

Required image:

```text
375 × 2 = 750px
```

Browser selects:

```text
800w image
```

instead of:

```text
1200w image
```

saving bandwidth. [\[htmltoimages.com\]](https://www.htmltoimages.com/blog/responsive-images-guide/), [\[web.dev\]](https://web.dev/learn/performance/image-performance)

---

# 2. `sizes`

The browser also needs to know:

```text
How much space
the image occupies
```

Example:

photo.jpg 100vw,&nbsp;&nbsp;&nbsp; (max-width: 1024px) 50vw,&nbsp;&nbsp;&nbsp; 800px&nbsp; "&nbsp; alt="Mountain"/&gt;![Visualization]

```text
≤600px:
Image uses 100% viewport width

≤1024px:
Image uses 50% viewport width

>1024px:
Image always 800px wide
```

The browser combines `sizes` and device pixel ratio to determine which image file to download. [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[htmltoimages.com\]](https://www.htmltoimages.com/blog/responsive-images-guide/)

---

# Visual Example

```text
Mobile
-----------------
|               |
|    Image      |
|               |
-----------------
100vw
```

```text
Desktop
-------------------------
| Image | Content Area |
-------------------------
50vw
```

---

# 3. `<picture>`

Use `<picture>` when:

```text
✅ Different image formats
✅ Different crops
✅ Different aspect ratios
✅ Art direction
```

The responsive image "art direction" problem—serving different crops for different layouts—is a primary use case of `<picture>`. [\[developer....ozilla.org\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images)

---

# Format Switching

Browser chooses:

```text
AVIF -> if supported
WebP -> otherwise
JPEG -> fallback
```

[\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images)

---

# Art Direction Example

Desktop image:

```text
Wide Landscape
```

Mobile image:

```text
Portrait Crop
```

This provides:

```text
✅ Format switching
✅ Resolution switching
✅ Fallback support
✅ Better LCP
```

[\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[web.dev\]](https://web.dev/learn/performance/image-performance)

---

# Senior React Example

```jsx
/product-800.webp 100vw,
    50vw
  "
  alt="Product"
/>
```

---

# When to Use What

| Situation                         | Use                          |
| --------------------------------- | ---------------------------- |
| Same image, different resolutions | `srcset`                     |
| Different layout widths           | `srcset + sizes`             |
| Different image formats           | `<picture>`                  |
| Different mobile/desktop crops    | `<picture>`                  |
| Modern production sites           | `<picture> + srcset + sizes` |

This distinction—`srcset` for resolution switching and `<picture>` for art direction/format switching—is the standard responsive image guidance. [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[developer....ozilla.org\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)

---

# Senior Frontend Interview Answer

> `srcset` allows the browser to choose among multiple image resolutions, `sizes` tells the browser how much screen space the image will occupy, and `<picture>` enables format switching and art direction. In production applications, I typically combine `<picture>` with `srcset` and `sizes` so browsers can download the smallest acceptable image for the user's device while still supporting modern formats such as AVIF and WebP. [\[bing.com\]](https://bing.com/search?q=responsive+images+srcset+sizes+picture+element+web.dev+image+performance+responsive+images), [\[developer....ozilla.org\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [\[web.dev\]](https://web.dev/learn/performance/image-performance)

It looks like a few code snippets got garbled or truncated in your text! Here is the clean, fixed version of those snippets so your study notes are 100% complete and accurate:

---

### Fixed HTML Code Snippets

#### 1. Correct `srcset` & `sizes` HTML Structure

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1024px) 50vw,
    800px
  "
  alt="Mountain landscape"
  width="800"
  height="500"
/>
```

#### 2. Correct `<picture>` Art Direction & Format Switching

```html
<picture>
  <!-- Mobile Portrait Crop (AVIF -> WebP) -->
  <source
    media="(max-width: 600px)"
    srcset="mobile-crop.avif 400w, mobile-crop-2x.avif 800w"
    type="image/avif"
  />
  <source
    media="(max-width: 600px)"
    srcset="mobile-crop.webp 400w, mobile-crop-2x.webp 800w"
    type="image/webp"
  />

  <!-- Desktop Landscape (AVIF -> WebP) -->
  <source
    srcset="desktop.avif 1200w, desktop-2x.avif 2400w"
    type="image/avif"
  />
  <source
    srcset="desktop.webp 1200w, desktop-2x.webp 2400w"
    type="image/webp"
  />

  <!-- Fallback img element (Mandatory inside <picture>) -->
  <img src="desktop.jpg" alt="Hero product" width="1200" height="600" />
</picture>
```

#### 3. Correct Senior React / JSX Example

```jsx
export function ProductImage() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="
          /product-400.avif 400w,
          /product-800.avif 800w,
          /product-1200.avif 1200w
        "
        sizes="(max-width: 600px) 100vw, 50vw"
      />
      <source
        type="image/webp"
        srcSet="
          /product-400.webp 400w,
          /product-800.webp 800w,
          /product-1200.webp 1200w
        "
        sizes="(max-width: 600px) 100vw, 50vw"
      />
      <img
        src="/product-800.jpg"
        alt="Product view"
        width={800}
        height={600}
        loading="lazy"
      />
    </picture>
  );
}
```

---

### Key Technical Detail to Keep in Mind:

When combining `<picture>` and `<source>`, **the `sizes` attribute belongs inside the `<source>` tag** alongside its corresponding `srcSet`. The browser reads the media query and format preferences top-to-bottom, matches the first supported `<source>`, and calculates the download candidate using its `srcSet` and `sizes`.
