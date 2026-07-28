### 1. **CSS Selector Specificity**

CSS specificity determines which CSS rule takes precedence when multiple rules target the same element. Specificity is calculated based on the following:

- Inline styles: `1000`
- IDs: `100`
- Classes, attributes, pseudo-classes: `10`
- Elements and pseudo-elements: `1`

**How it works:**

- The browser compares the specificity of the rules and applies the one with the highest specificity. If two selectors have the same specificity, the rule that appears later in the CSS is applied.

### 2. **Resetting vs Normalizing CSS**

- **Resetting CSS**: Resets all default browser styles to ensure a consistent baseline across browsers (e.g., `* { margin: 0; padding: 0; }`).
- **Normalizing CSS**: Keeps some useful default styles but makes sure elements render more consistently across browsers (e.g., `normalize.css`).

**Which to choose**:

- **Normalize** is typically preferred because it keeps useful defaults while fixing inconsistencies, whereas resetting can remove all styles, which could lead to unexpected layout issues.

---

### 3. **Floats**

Floats are used to position elements horizontally within their container, allowing text and inline elements to wrap around them. They are often used for layouts or wrapping images in text.

**How they work:**

- `float: left` or `float: right` moves an element to the left or right, respectively, and allows other content to flow around it.
- Floats take elements out of the normal document flow.

---

### 4. **z-index and Stacking Context**

- **z-index**: Controls the stacking order of positioned elements (elements with `position` other than `static`). Higher values appear in front of elements with lower values.
- **Stacking context**: A group of elements that share the same `z-index` stacking context. For example, when a parent has a `z-index` value, it creates a new stacking context for its children.

---

### 5. **BFC (Block Formatting Context)**

BFC is a concept in CSS that defines how block-level elements are formatted and how they interact with floating elements.

- **How it works**: An element with a `BFC` behaves like a block-level box, which prevents floating elements from affecting the layout of other elements.

Example: Elements with `overflow: hidden`, `float`, `position: absolute`, or `display: inline-block` often create a new BFC.

---

### 6. **Clearing Techniques**

Clearing clears the effect of floating elements. Here are some techniques:

- **Clearfix**: Add a pseudo-element `::after` with `content: ""; display: block; clear: both;` to the parent element.
- **Overflow**: Set `overflow: hidden` or `overflow: auto` on the parent element.
- **Clear property**: Apply `clear: both` to an element that follows the floated elements.

---

### 7. **Fixing Browser-Specific Styling Issues**

- **Use vendor prefixes**: For new CSS features (e.g., `-webkit-`, `-moz-`).
- **Feature queries**: `@supports` can be used to apply styles only if the browser supports certain CSS properties.
- **CSS resets or normalizers**: Normalize differences across browsers.

---

### 8. **Serving Pages for Feature-Constrained Browsers**

- **Use conditional comments** for Internet Explorer.
- **CSS feature queries**: `@supports` helps you target browsers with support for specific CSS properties.
- **JavaScript polyfills**: Provide missing features for older browsers.

---

### 9. **Visually Hiding Content (for Screen Readers)**

- **`visibility: hidden`** hides the element visually but keeps it accessible for screen readers.
- **`position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px; margin: -1px`** moves the element out of view but makes it available for screen readers.

---

### 10. **Grid Systems**

Grid systems are used to create consistent, responsive layouts. Common frameworks include:

- **Bootstrap**: Uses a 12-column grid system.
- **Foundation**: Offers flexible grid systems.
Personal preference may vary depending on project requirements, but **CSS Grid** is becoming increasingly popular for more control and flexibility.

---

### 11. **Media Queries and Mobile-Specific Layouts**

Media queries are used to apply styles based on viewport dimensions. Example:

```css
@media (max-width: 768px) {
  /* Apply mobile-specific styles */
}
```

**Mobile-first** approach involves starting with styles for smaller screens and using `min-width` in media queries to adjust for larger screens.

---

### 12. **Styling SVG**

SVG (Scalable Vector Graphics) can be styled like regular HTML elements using CSS:

- **Inline styles**: You can directly apply styles within the SVG markup.
- **External CSS**: You can target SVG elements using CSS classes or IDs.
Example:

```css
svg path {
  fill: red;
}
```

---

### 13. **@media Property Other Than Screen**

Example:

```css
@media print {
  /* Apply styles for print */
}
```

---

### 14. **Gotchas for Writing Efficient CSS**

- Avoid unnecessary overrides.
- Minimize the use of `!important`.
- Keep selectors simple and specific to avoid long cascades.
- Reduce the number of styles that require layout recalculations (e.g., avoid `float` for complex layouts).

---

### 15. **Advantages/Disadvantages of CSS Preprocessors**

- **Advantages**: Nesting, variables, mixins, partials, and functions improve maintainability and scalability.
- **Disadvantages**: Requires compilation, may add complexity.

---

### 16. **Likes/Dislikes About CSS Preprocessors**

- **Likes**: Makes writing modular and DRY (Don’t Repeat Yourself).
- **Dislikes**: Can increase complexity and requires a build process.

---

### 17. **Implementing Non-Standard Fonts**

To implement non-standard fonts, you can use the `@font-face` rule or Google Fonts:

```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('path/to/font.woff2') format('woff2');
}
body {
  font-family: 'MyCustomFont', sans-serif;
}
```

---

### 18. **How Browser Determines CSS Selector Matching**

Browsers use a process called **"CSS cascade"** to match CSS selectors. They start from the most specific (ID selectors) to the least specific (type selectors) and apply the corresponding rules in order of specificity.

---

### 19. **Pseudo-Elements**

Pseudo-elements allow you to style parts of an element, such as the `::before`, `::after`, or `::first-letter`.

Example:

```css
p::after {
  content: ' - end of paragraph';
}
```

---

### 20. **Box Model**

The box model defines how elements are sized and how space is allocated:

- **Content**: Actual content of the element.
- **Padding**: Space between content and border.
- **Border**: Surrounds padding (optional).
- **Margin**: Space outside the border.

**Changing box model**:

```css
* {
  box-sizing: border-box;
}
```

---

### 21. **What Does * { box-sizing: border-box; } Do?**

This rule changes the box model to include padding and border in the element’s total width and height, preventing overflow issues.

---

### 22. **CSS Display Property**

The `display` property defines how an element is displayed in the layout:

- `block`: Takes up full width, starts on a new line.
- `inline`: Does not start on a new line, takes up only as much width as necessary.
- `inline-block`: Behaves like inline but allows block properties like width/height.
- `flex`: Enables a flexbox layout.
- `grid`: Enables a grid layout.

---

### 23. **Difference Between Inline and Inline-Block**

- **Inline**: Elements stay on the same line as other elements, with no control over width or height.
- **Inline-block**: Elements stay on the same line but retain block-level properties such as width and height.

---

### 24. **nth-of-type() vs nth-child()**

- **nth-child()**: Targets the nth child of a parent element, regardless of type.
- **nth-of-type()**: Targets the nth element of a specific type (e.g., `p:nth-of-type(2)`).

---

### 25. **Positioning: Relative, Fixed, Absolute, Static**

- **Relative**: Positioned relative to its normal position.
- **Fixed**: Positioned relative to the viewport (stays fixed on the screen).
- **Absolute**: Positioned relative to the nearest positioned ancestor.
- **Static**: Default positioning; not affected by top, bottom, left, or right.

---

### 26. **Existing CSS Frameworks**

- **Bootstrap**: A popular front-end framework that provides grid systems, components, and utilities.
- **Tailwind**: A utility-first CSS framework.
- **Foundation**: A responsive framework for building websites.

**Improvements**: More customization, mobile-first focus, better performance optimization.

---

### 27. **CSS Grid**

CSS Grid is a 2-dimensional layout system that allows you to create complex layouts with rows and columns.

---

### 28. **Responsive vs Mobile-First Strategy**

- **Responsive**: Design adjusts to different screen sizes by using media queries.
- **Mobile-First**: Start with styles for mobile devices and use media queries for larger screens.

---

### 29. **Working with Retina Graphics**

For retina displays, provide high-resolution images using `srcset` in `img` elements:

```html
<img src="image.jpg" srcset="image@2x.jpg 2x">
```

---

### 30. **translate() vs Absolute Positioning**

- **translate()**: A CSS transform function that moves elements without affecting document flow.
- **Absolute positioning**: Positions an element relative to its nearest positioned ancestor.

**Why use translate()?** It’s often more performant since it doesn’t affect document layout.

---

### 31. **Clearfix CSS Property**

Clearfix is used to clear floating elements within a container. It can be implemented using `::after`:

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

---

### 32. **px, em, rem for Font Sizing**

- **px**: Fixed pixel value.
- **em**: Relative to the font size of the parent element.
- **rem**: Relative to the root element’s font size (easier for global control).

---

### 33. **Pseudo-Class Example**

```css
a:hover {
  color: red;
}
```

**Use case**: Change an anchor’s color when a user hovers over it.

---

### 34. **Block-Level vs Inline Elements**

- **Block-level**: Elements that take up the full width of their parent (e.g., `<div>`, `<p>`).
- **Inline**: Elements that take up only as much width as necessary (e.g., `<span>`, `<a>`).

---

### 35. **CSS Grid vs Flexbox**

- **Grid**: Best for 2-dimensional layouts (rows and columns).
- **Flexbox**: Best for 1-dimensional layouts (either rows or columns).

---

### 36. **Fixed, Fluid, Responsive Layouts**

- **Fixed**: Fixed width layout.
- **Fluid**: Uses percentages for width, allowing the layout to scale with

 the viewport.

- **Responsive**: Combines fluid layouts with media queries to adapt to different screen sizes.
