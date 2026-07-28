**What is CSS Specificity?**
CSS specificity is a rule that determines which CSS styles are applied to an element when multiple conflicting rules target the same element. It’s a way of calculating the "weight" of CSS selectors, and it helps the browser decide which style rule to apply when multiple rules could affect the same element.

In simple terms, CSS specificity defines the priority of CSS selectors, ensuring that more specific selectors override more general ones.

**How CSS Specificity Works**
Specificity is calculated based on the types of selectors used in a CSS rule. The more specific the selector, the higher its specificity score. The specificity score is calculated as a set of four values, often represented as a tuple:

```js
(a, b, c, d);
```

Where:

`a represents the number of inline styles applied to an element.`
`b represents the number of IDs used in the selector.`
`c represents the number of classes, attributes, and pseudo-classes used in the selector.`
`d represents the number of element (type) selectors and pseudo-elements used in the selector`.

**CSS Specificity Formula**
The specificity of a CSS rule is calculated based on these components, with the following priority order:

**Inline styles (a value)**
**ID selectors (b value)**
**Class, attribute, and pseudo-class selectors (c value)**
**Type selectors (element selectors) and pseudo-elements (d value)**

The specificity score is evaluated by comparing these four values in the order above. If two selectors have the same specificity, the one that appears last in the stylesheet will be applied.

**CSS Specificity Breakdown**
`Inline styles`: If you apply a style directly to an element using the style attribute, it has the highest specificity (i.e., a = 1).

```js
<div style="color: red;">Hello World</div>
```

`ID selectors:` Selectors with IDs are more specific than class or type selectors. The specificity of an ID selector is represented as b = 1.

```js
#header { color: blue; }
```

`Class selectors:` Selectors using classes have lower specificity than ID selectors. The specificity of a class selector is represented as c = 1.

```js
.menu { color: green; }
```

`Type (element) selectors:` These selectors have the lowest specificity. The specificity of a type selector is represented as d = 1.

```js
p { color: yellow; }
```

`Pseudo-classes: Pseudo-classes` (like :hover, :first-child, etc.) have a specificity that is the same as class selectors.

```js
p:hover { color: pink; }
```

`Pseudo-elements: Pseudo-elements` (like ::before, ::after) also contribute to specificity but are considered to have the same weight as type selectors.

```js
p::before { content: "Hello"; }
```

**Examples of Specificity Calculation
Example 1: Inline style vs CSS rule**

```js
<!-- Inline style has highest specificity -->
<div id="header" style="color: red;">Hello World</div>
```

```js
#header {
  color: blue;
}
```

Inline style (style="color: red;") has the highest specificity: (1, 0, 0, 0)
The CSS rule #header has a specificity of (0, 1, 0, 0)
**Result:** The text will be red because the inline style has higher specificity than the #header ID selector.

**Example 2: ID vs Class vs Type selectors**

```js
/* ID selector */
#header {
  color: blue;
}

/* Class selector */
.menu {
  color: green;
}

/* Type selector */
p {
  color: yellow;
}
```

```js
<p class="menu" id="header">
  Hello World
</p>
```

The #header selector has specificity (0, 1, 0, 0).
The .menu selector has specificity (0, 0, 1, 0).
The p selector has specificity (0, 0, 0, 1).
Result: The text will be blue because the #header ID selector has the highest specificity.

**Example 3: Pseudo-class selector vs Type selector**

```js
/* Type selector */
p {
  color: blue;
}

/* Pseudo-class selector */
p:hover {
  color: red;
}

```

```js
<p>Hover over me</p>
```

The p selector has specificity (0, 0, 0, 1).
The p:hover selector has specificity (0, 0, 1, 1) (higher specificity than the p selector).
Result: When you hover over the paragraph, the text will be red because the p:hover selector has higher specificity than the p selector.

**Summary of Specificity Rules**
**Inline styles: Highest specificity.**
Specificity: (1, 0, 0, 0)
**ID selectors: Next highest specificity.**
Specificity: (0, 1, 0, 0)
**Class selectors, attribute selectors, and pseudo-classes: Medium specificity.**
Specificity: (0, 0, 1, 0)
**Type (element) selectors and pseudo-elements: Lowest specificity.**
Specificity: (0, 0, 0, 1)

CSS Specificity Example Order
If you have the following selectors, the order of application based on specificity will be:

`Inline style` (most specific)
`ID selectors`
`Class selectors, pseudo-classes`
`Type selectors, pseudo-elements` (least specific)

**Conclusion**
Understanding CSS specificity is crucial when you're dealing with conflicting styles, especially in large projects with multiple CSS rules targeting the same elements. By knowing how specificity works, you can avoid issues with styles not applying as expected and ensure your stylesheets are both efficient and maintainable.

**CSS Specificity** is the set of rules browsers use to determine which CSS property values are applied to an element when multiple CSS rules target the same element. Think of it as a **scoring system**: the selector with the highest specificity score wins, and its styles are applied.

---

## 1. The Specificity Hierarchy (Scoring System)

Specificity is usually calculated using a 3-part hierarchy: **`(A, B, C)`**. When comparing two selectors, compare the numbers from left to right. The selector with the higher number in the leftmost position wins, regardless of how large the numbers to the right are.

```
  ( Inline Styles )  ──>  [A] IDs  ──>  [B] Classes/Attributes/Pseudos  ──>  [C] Elements/Pseudo-elements

```

| Category                                   | Selector Types                                                         | Example Selectors                 | Specificity Score `(A, B, C)`   |
| ------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------- | ------------------------------- |
| **Inline Styles**                          | Applied directly in HTML via `style="..."`                             | `<div style="color: red;">`       | Overrides all regular selectors |
| **A: IDs**                                 | ID selectors                                                           | `#header`, `#main-nav`            | `(1, 0, 0)`                     |
| **B: Classes, Attributes, Pseudo-classes** | `.class`, `[attr]`, `:hover`, `:nth-child()`, `:focus`                 | `.btn`, `[type="text"]`, `:hover` | `(0, 1, 0)`                     |
| **C: Elements & Pseudo-elements**          | HTML tags, `::before`, `::after`                                       | `div`, `p`, `h1`, `::before`      | `(0, 0, 1)`                     |
| **Zero Weight**                            | Universal selector (`*`), combinators (`+`, `>`, `~`, ` `), `:where()` | `*`, `div > p`, `:where(.card)`   | `(0, 0, 0)`                     |

---

## 2. Examples of Specificity Calculation

Let's look at how selector scores stack up against each other:

```css
/* 1. Element selector */
p {
  color: blue;
} /* Score: (0, 0, 1) */

/* 2. Class + Element selector */
p.tagline {
  color: green;
} /* Score: (0, 1, 1) -> WINS over 'p' */

/* 3. Class + Attribute selector */
.nav-item[data-active="true"] {
  color: yellow;
} /* Score: (0, 2, 0) */

/* 4. ID selector */
#main-header {
  color: purple;
} /* Score: (1, 0, 0) -> WINS over classes */

/* 5. ID + Class + Element selector */
header#main-header .title {
  color: red;
} /* Score: (1, 1, 1) -> WINS over single ID */
```

> **Note:** Selectors with higher specificity category values always win. For instance, **1 ID `(1, 0, 0)` beats 100 Classes `(0, 100, 0)**`.

---

## 3. Key Rules & Exceptions

### Rule 1: The Cascade / Order of Appearance (Tie-Breaker)

If two rules targeting the same element have the **exact same specificity score**, the rule that appears **last** in the CSS file takes precedence.

```css
.button {
  background: red;
}
.button {
  background: blue;
} /* Same score (0,1,0). Last rule wins -> BLUE */
```

### Rule 2: `!important` Overrides Specificity

Adding `!important` to a CSS declaration bypasses the standard specificity calculation completely. It overrides inline styles, IDs, classes, and element selectors.

```css
/* Even though #header has a higher specificity, !important wins */
p {
  color: red !important;
}
#header p {
  color: blue;
}

/* Result: Text will be RED */
```

- **Best Practice:** Avoid using `!important` unless strictly necessary (e.g., overriding inline styles from third-party scripts or utility classes), as it makes CSS difficult to maintain and debug.

### Rule 3: Pseudo-class Exceptions

Most pseudo-classes count toward the **B** column `(0, 1, 0)`, but there are exceptions:

- **`:not()`, `:is()`, `:has()`:** These pseudo-classes do not add specificity themselves; instead, they take on the specificity of the **most specific selector inside their arguments**.
- **`:where()`:** Always has a specificity of **`(0, 0, 0)`**, making it useful for CSS resets and base styles that should be easily overridden.

---

## 4. Best Practices for Managing Specificity

1. **Keep Specificity Low:** Rely primarily on single class names (`.card`, `.btn`) rather than chaining IDs and deep descendant selectors (`#container div.sidebar ul li a`).
2. **Use BEM Methodology:** BEM (Block Element Modifier) keeps specificity flat and uniform across your codebase (e.g., `.card__button--primary` has a score of `(0, 1, 0)`).
3. **Leverage CSS `@layer` (Cascade Layers):** Modern CSS allows you to organize styles into layers where lower layers are overridden by higher layers regardless of selector specificity inside them:

```css
@layer base, components, utilities;

@layer base {
  #main h1 {
    color: black;
  } /* Won't override .title in components */
}

@layer components {
  .title {
    color: blue;
  } /* WINS because the layer has higher priority */
}
```
