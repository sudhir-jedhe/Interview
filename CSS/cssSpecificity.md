CSS specificity is the algorithm browsers use to decide **which style rule wins** when multiple conflicting CSS rules target the same element.

If you write two rules that try to color the same paragraph text—say, one makes it red and another makes it blue—specificity is the referee that picks the winner.

## The Specificity Score (The 3-Column System)

Think of specificity like a three-column score: `(IDs, Classes, Elements)`.

When the browser evaluates a selector, it counts how many of each category are present. You compare the scores **left to right** (like a decimal number or a race).

| Category                          | What it counts                          | Weight notation | Example                        |
| --------------------------------- | --------------------------------------- | --------------- | ------------------------------ |
| **1. IDs**                        | ID selectors                            | `(1, 0, 0)`     | `#header`                      |
| **2. Classes & Attributes**       | Classes, attributes, and pseudo-classes | `(0, 1, 0)`     | `.btn`, `[disabled]`, `:hover` |
| **3. Elements & Pseudo-elements** | HTML tags and pseudo-elements           | `(0, 0, 1)`     | `div`, `p`, `::after`          |

_(Note: The universal selector `_`and combinators like`+`, `>`, and `~` add **0** to the score).\*

---

## How the Math Works (The Golden Rule)

Specificity is compared **column by column, left to right**.

Even a massive number of element selectors cannot beat a single class selector, and a single ID beats any number of classes combined.

- `p` $\rightarrow$ `(0, 0, 1)` (1 element)
- `.text` $\rightarrow$ `(0, 1, 0)` (1 class) — **Wins over `p`, because column 2 is higher.**
- `#main` $\rightarrow$ `(1, 0, 0)` (1 ID) — **Wins over `.text`, because column 1 is higher.**

Even if you write a ridiculous selector like `.a.b.c.d.e.f` `(0, 6, 0)`, it will **still lose** to a single ID `#sidebar` `(1, 0, 0)` because column 1 always takes absolute priority.

---

## The Tie-Breaker: Source Order

If two conflicting selectors have the **exact same specificity score** (for example, two classes targeting the same element: `.red-text` and `.blue-text`), **source order wins**.

The rule written **last** in your CSS file (or further down the page) will execute and override the ones above it.

---

## The Two Overrides

There are two ways to completely bypass the standard specificity calculation:

1. **Inline Styles (`style="..."`):** Styles applied directly inside an HTML tag beat almost everything else, having a score equivalent to `(1, 0, 0, 0)`. They are generally considered bad practice because they are hard to override.
2. **`!important`:** The nuclear option. Adding `!important` to a property forces it to win against all normal rules, regardless of specificity.

```css
p {
  color: blue !important;
}
```

_Warning:_ Overusing `!important` destroys your stylesheet's maintainability, making it nearly impossible to debug later. Use it only as an absolute last resort (such as overriding third-party widget styles).

Cascade Layers (`@layer`) are a modern CSS feature designed specifically to stop "specificity wars" and eliminate the need for `!important`.

Instead of relying solely on the rigid math of IDs, classes, and elements, `@layer` allows you to explicitly group your CSS into ordered buckets. **The order of the layers dictates what wins**, completely ignoring the traditional specificity scores between them.

Here is how they solve the biggest headaches in CSS architecture.

## The Problem: The Specificity War

Before layers, if a third-party library (like Bootstrap) styled a button using a highly specific selector, you had to write an even _uglier_, more specific selector to override it in your own stylesheet.

```css
/* Third-party CSS you can't control */
.card .card-body button.btn-primary {
  background: blue;
} /* Score: (0, 3, 1) */

/* Your override attempt - LOSES */
.my-button {
  background: red;
} /* Score: (0, 1, 0) */

/* Your forced override - WINS (but is terrible to maintain) */
body main .card .card-body button.btn-primary.my-button {
  background: red;
}
```

When this gets out of hand, developers give up and just use `!important`.

## The Solution: `@layer`

With Cascade Layers, you can define the hierarchy of your entire stylesheet upfront. A rule in a later layer will **always** beat a rule in an earlier layer, even if the earlier layer uses an ID and the later layer uses a basic element tag.

### 1. Define the Order

You establish your layers at the very top of your CSS file. The order you list them in is the order of priority, from lowest to highest.

```css
/* 1. Base is weakest. 3. Custom is strongest. */
@layer reset, framework, custom;
```

### 2. Assign Styles to Layers

You then wrap your CSS blocks inside the corresponding `@layer` rule.

```css
@layer framework {
  /* High specificity score: (1, 2, 0) */
  #main-nav ul.menu li.active {
    color: blue;
  }
}

@layer custom {
  /* Low specificity score: (0, 1, 0) */
  .active-link {
    color: red;
  }
}
```

**The Result:** If an HTML element has both matching criteria (`<li class="active active-link" id="main-nav">`), **the text will be red**.

Even though `#main-nav ul.menu li.active` has a massive specificity score, it loses entirely because the `.active-link` class lives in the `custom` layer, which was declared _after_ the `framework` layer.

## Key Behaviors to Know

- **Specificity still exists _within_ a layer:** If you have two conflicting rules inside the exact same `custom` layer, the browser falls back to the standard ID/Class/Element math to declare a winner.
- **Unlayered CSS beats layered CSS:** To prevent existing websites from breaking when you introduce layers, any CSS written _outside_ of a `@layer` block is automatically treated as the highest priority. It will override everything inside your layers.
- **Importing directly into layers:** You can safely import entire third-party libraries directly into a low-priority layer so they never fight with your custom code:

```css
@import url("bootstrap.css") layer(framework);
```
