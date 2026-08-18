# Problem: Implement a simple template-string engine

Implement `render(template, data)` that replaces `{{key}}` placeholders with values from a data object, using regex and `String.prototype.replace` — essentially a tiny hand-rolled version of what Handlebars/Mustache do at the string level.

## Requirements

- `render("Hi {{name}}", { name: "Sam" })` → `"Hi Sam"`
- Supports multiple placeholders: `render("{{a}} + {{b}} = {{c}}", { a: 1, b: 2, c: 3 })` → `"1 + 2 = 3"`
- Supports whitespace inside braces: `{{ name }}` should work the same as `{{name}}`
- Supports dotted paths for nested data: `render("{{user.name}}", { user: { name: "Ada" } })` → `"Ada"`
- Missing keys render as an empty string (not `"undefined"`), so a template never leaks placeholder syntax or literal `undefined` into output.

## Solution

```js
function render(template, data = {}) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const value = getPath(data, path);
    return value === undefined || value === null ? "" : String(value);
  });
}

function getPath(obj, path) {
  return path.split(".").reduce(
    (current, key) => (current == null ? undefined : current[key]),
    obj
  );
}

console.log(render("Hi {{name}}", { name: "Sam" }));
// "Hi Sam"

console.log(render("{{a}} + {{b}} = {{c}}", { a: 1, b: 2, c: 3 }));
// "1 + 2 = 3"

console.log(render("Hello, {{ name }}!", { name: "Ada" }));
// "Hello, Ada!"

console.log(render("{{user.name}} works at {{user.company}}", {
  user: { name: "Ada", company: "Acme" },
}));
// "Ada works at Acme"

console.log(render("Missing: [{{nope}}]", {}));
// "Missing: []"
```

## Why it works

- The regex `/\{\{\s*([\w.]+)\s*\}\}/g` matches `{{`, optional whitespace, a capture group of word characters and dots (covering both simple keys and dotted paths), optional whitespace, then `}}`. The `g` flag makes `replace` process every match in the template, not just the first.
- `String.prototype.replace` with a **function** as the second argument (rather than a plain string) calls that function once per match, passing the full match and each capture group as arguments — this is what makes per-placeholder dynamic lookup possible instead of a single fixed substitution.
- `getPath` walks a dotted path (`"user.company"` → `["user", "company"]`) via `reduce`, short-circuiting to `undefined` the moment any intermediate value is `null`/`undefined` rather than throwing — this mirrors how optional chaining (`?.`) behaves, but implemented manually since `reduce` can't use `?.` mid-chain on a dynamically-built path.
- Explicitly checking for `undefined`/`null` before stringifying prevents the literal text `"undefined"` from leaking into rendered output for missing keys — a very easy bug to introduce if you just do `String(value)` unconditionally, since `String(undefined) === "undefined"`.

## Edge cases worth testing

```js
console.log(render("{{count}} items", { count: 0 }));
// "0 items" — falsy-but-defined values like 0 must still render, not be treated as "missing"

console.log(render("No placeholders here", { anything: 1 }));
// "No placeholders here" — unchanged when there's nothing to replace

console.log(render("{{a}}{{a}}{{a}}", { a: "x" }));
// "xxx" — the same key can appear (and be replaced) multiple times per call
```

A real template engine would also need escaping (e.g. `\{\{literal\}\}`), loops/conditionals, and HTML-escaping of interpolated values to avoid injection — this implementation intentionally covers only the interpolation core.
