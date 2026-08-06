The **viewport** is simply the visible area of a web page that a user can currently see on their screen.

If a webpage is 5,000 pixels tall, but your phone screen is only 800 pixels tall, your viewport is just that 800-pixel window. If you are on a desktop and you shrink your browser window, the viewport shrinks with it.

You use the viewport in three different ways in web development: HTML setup, CSS sizing, and CSS layout.

## 1. HTML: Setting the Viewport (The Meta Tag)

As discussed previously, you must tell mobile browsers to match the viewport to the physical device screen. Without this, mobile browsers will fake a desktop viewport and shrink your site.

```html
<!-- Always put this in the <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## 2. CSS: Using Viewport Units (`vw` and `vh`)

CSS gives you special units of measurement based exactly on the size of the user's viewport.

- `1vw` = 1% of the viewport's width.
- `1vh` = 1% of the viewport's height.

**How to use them:**
If you want to create a "Hero Image" or a landing page section that perfectly fills the user's screen (no matter if they are on a massive TV or a tiny phone), you use `vh`.

```css
.hero-section {
  /* This element will always be exactly 100% of the screen height */
  height: 100vh;
  width: 100%;
  background-image: url("header.jpg");
}

.half-screen-box {
  /* This box will take up exactly half the width of the screen */
  width: 50vw;
}
```

## 3. CSS: Media Queries (Responsive Layouts)

You use the size of the viewport to tell your CSS when to change the layout. This is the foundation of responsive design.

Instead of writing code for specific phones (like "iPhone 14"), you write code based on how wide the viewport is.

**How to use it:**

```css
/* Default layout for mobile viewports (stacked vertically) */
.container {
  display: flex;
  flex-direction: column;
}

/* When the viewport becomes wider than 768px (like on a tablet or desktop) */
@media (min-width: 768px) {
  .container {
    /* Change the layout to side-by-side */
    flex-direction: row;
  }
}
```

> **Summary:** You use the **HTML meta tag** to unlock the true viewport on mobile. You use **CSS viewport units (`vh`, `vw`)** to size elements perfectly to the screen. You use **Media Queries** to change your layout as the viewport gets bigger or smaller.

The `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag is the absolute most important line of code for making a website responsive on mobile devices.

If you write responsive CSS (like `@media` queries) but forget this exact tag, your mobile layout will completely fail to trigger.

Here is exactly what it does and why it is required.

## The Problem: The "Desktop Fake-Out"

When smartphones were first invented, most websites were not built for small screens. If an iPhone tried to load a 1990s desktop website at its actual screen width (e.g., 320 pixels wide), the website would be completely cut off, showing only the top-left corner.

To fix this, Apple (and later all mobile browsers) programmed a workaround: **Mobile browsers lie to the website.**

If you do not include the viewport tag, your phone's browser will pretend it is a desktop monitor (usually 980 pixels wide). It renders the desktop version of the site, and then shrinks the entire picture down to fit on the phone screen.

- **The result:** The user sees the whole website, but the text is microscopic. They have to pinch-to-zoom and pan around just to read a single paragraph.

## The Solution: Deconstructing the Tag

By adding this meta tag, you are telling the mobile browser: _"Stop pretending to be a desktop. I have written code for small screens. Render the site at your actual size."_

Here is what the two specific commands inside the `content` attribute actually do:

### 1. `width=device-width`

This tells the browser to set the width of the webpage to the exact physical width of the device's screen (e.g., 390 CSS pixels for an iPhone 14, or 412 pixels for a Pixel 7).

Once this happens, your CSS media queries (like `@media (max-width: 600px)`) will finally wake up and apply your mobile layout (like stacking columns vertically instead of side-by-side).

### 2. `initial-scale=1.0`

This sets the initial zoom level when the page is first loaded by the browser. Setting it to `1.0` means the browser will not zoom in or zoom out—it will display the pixels exactly at 100% scale.

---

> **Crucial Accessibility Warning:**
> You might sometimes see older tutorials add `maximum-scale=1.0` or `user-scalable=no` to this tag. **Never do this.**
> Those commands physically disable the user's ability to pinch-to-zoom on their phone. While it might make your app feel more "native," it breaks accessibility guidelines (WCAG) and prevents visually impaired users from zooming in to read your text. Always stick to just `width=device-width, initial-scale=1.0`.

The newer viewport units (`svh`, `lvh`, and `dvh`) were introduced to solve one of the most frustrating bugs in mobile web development: the expanding and collapsing address bar.

## The Problem with Standard `vh`

For years, developers used `100vh` to make a section perfectly fill a user's screen. On desktop, this works flawlessly.

On mobile phones, however, browsers like Safari (iOS) and Chrome (Android) have a dynamic UI. When you load a page, the address bar and bottom navigation are visible. As you scroll down, they slide out of the way.

The standard `100vh` unit **ignores this UI**. It calculates its height based on the _largest_ possible screen size (when the UI is hidden). As a result, when the page first loads, the bottom 10-15% of your `100vh` element gets cut off and hidden _underneath_ the browser's navigation bar.

## The Solution: The New Units

To fix this without breaking older websites, the CSS working group introduced three new units that explicitly account for the browser's UI.

| Unit      | Name                        | What it measures                                                                                       | When to use it                                                                                                                       |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`svh`** | **Small Viewport Height**   | The height of the screen when the browser UI is fully expanded (the smallest possible visible area).   | Use for elements that absolutely must be visible at all times, like a sticky bottom navigation bar or a fixed chat widget.           |
| **`lvh`** | **Large Viewport Height**   | The height of the screen when the browser UI is completely hidden (the largest possible visible area). | Use for background images or elements where you don't mind the bottom edge being temporarily covered by the address bar.             |
| **`dvh`** | **Dynamic Viewport Height** | Automatically transitions between `svh` and `lvh` in real-time as the user scrolls and the UI moves.   | Use for hero sections that you want to perfectly frame the visible screen at all times, regardless of what the address bar is doing. |

_(Note: These units also have width equivalents—`svw`, `lvw`, and `dvw`—but since mobile browsers don't dynamically change their width, they behave almost identically to standard `vw`)._

## Why not just use `dvh` for everything?

While `dvh` seems like the perfect solution, it comes with a performance cost. Because `dvh` constantly recalculates its size as the user scrolls, it forces the browser to rapidly redraw the webpage.

If you have a lot of complex content inside a `dvh` container, this constant recalculation can cause the page to stutter or lag on lower-end phones.

**Best Practice:** Use `100dvh` sparingly, primarily for your main, above-the-fold hero section. For anything that simply needs to be "tall," stick to `min-height: 100svh` or standard `vh`.
