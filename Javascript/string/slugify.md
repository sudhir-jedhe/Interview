SEO is important, and one of the things that can help improve your website's SEO is having a URL that is easy to read and understand. This is where slugs come in.

A slug is a URL-friendly version of a string, typically used to identify a resource on a website. Conventionally, slugs are created by converting a string to lowercase, removing special characters and replacing spaces with dashes.

The first part is straightforward, using String.prototype.toLowerCase() and String.prototype.trim() to lowercase and tidy up the string. Then, you can use a regular expression to find any characters that are not alphanumeric (\w), spaces (\s) or dashes (-) and remove them, using String.prototype.replace().

After that, you can replace word separators, such as spaces (\s) and underscores (\_) and dashes (-), with a single dash (-), using String.prototype.replace() again.

Finally, we can use a regular expression to match one or more consecutive dashes (-+) at the beginning and end of the string and remove them, using String.prototype.replace() one more time.

```js
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

slugify("Hello World!"); // 'hello-world
```

Your `slugify` implementation is clean, functional, and aligns with standard SEO slug practices.

However, there are a few important **edge cases** to be aware of—specifically regarding **accents/diacritics**, **non-Latin characters (Unicode)**, and **underscores in `\w**`.

---

### Key Issues & Edge Cases

#### 1. `\w` Includes Underscores (`_`)

In JavaScript regular expressions, `\w` matches `[a-zA-Z0-9_]`.

* Because `[^\w\s-]` keeps underscores, a string like `"hello_world!"` passes step 1 as `"hello_world"` and is then converted to `"hello-world"` in step 2.
* This works fine, but it can be simplified by defining alphanumeric characters directly: `[^a-z0-9 -]`.

#### 2. Accented & International Characters (e.g., `"Café"` or `"München"`)

Since `\w` only matches ASCII characters (`a-z`), accented characters like `é`, `ü`, or `ñ` get completely erased by `[^\w\s-]`:

```javascript
slugify("Café au Lait!"); 
// Output: "caf-au-lait" ('é' was deleted!)

```

---

### Spec-Compliant & Unicode-Safe Refactoring

To handle accents/diacritics and international character sets properly, use `String.prototype.normalize('NFD')` to decompose accented characters before stripping diacritics:

```javascript
/**
 * Converts a string into an SEO-friendly URL slug.
 * Handles accents, special characters, and multiple spaces.
 * @param {string} str - Input string to slugify
 * @returns {string} - URL-safe slug
 */
const slugify = (str) =>
  str
    .normalize("NFD")                  // 1. Decompose accented chars (e.g., 'é' -> 'e' + accent)
    .replace(/[\u0300-\u036f]/g, "")   // 2. Remove standalone accent marks
    .toLowerCase()                     // 3. Convert to lowercase
    .trim()                            // 4. Remove leading/trailing whitespace
    .replace(/[^a-z0-9 -]/g, "")       // 5. Remove non-alphanumeric chars (excluding spaces & hyphens)
    .replace(/[\s_]+/g, "-")           // 6. Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, "");          // 7. Strip leading and trailing hyphens

// --- Test Cases ---
console.log(slugify("Hello World!"));         // "hello-world"
console.log(slugify("  Café & Té  "));        // "cafe-te" (Preserves 'e'!)
console.log(slugify("München -- Germany"));   // "munchen-germany"
console.log(slugify("JavaScript & React.js"));// "javascript-reactjs"

```

---

### Step-by-Step Execution Pipeline

For `"  Café & Té!  "`:

| Step    | Operation                              | Result             |
| ------- | -------------------------------------- | ------------------ |
| **1–2** | `normalize('NFD')` + Accent strip      | `"  Cafe & Te!  "` |
| **3–4** | `toLowerCase()` + `trim()`             | `"cafe & te!"`     |
| **5**   | Strip non-alphanumeric (`[^a-z0-9 -]`) | `"cafe  te"`       |
| **6–7** | Collapse spaces & hyphens              | `"cafe-te"`        |
