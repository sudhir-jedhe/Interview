# Template Literals and Tagged Templates

Template literals (`` `...` ``) support interpolation (`${expr}`) and multi-line strings without escape characters:

```js
const name = "Sam";
const greeting = `Hello, ${name}!
Welcome.`;
```

Any expression can go inside `${}` — it's coerced to a string the same way string concatenation coerces values.

## Tagged templates

A "tag" function placed immediately before the backticks intercepts the literal's parts *before* they're joined, receiving the static string chunks as an array and the interpolated values as separate arguments:

```js
function highlight(strings, ...values) {
  return strings.reduce(
    (acc, str, i) => `${acc}${str}${values[i] !== undefined ? `**${values[i]}**` : ""}`,
    ""
  );
}

highlight`Score: ${95} out of ${100}`; // "Score: **95** out of **100**"
```

`strings` is the array of literal text segments (`["Score: ", " out of ", ""]`), and `values` collects the interpolated expressions (`[95, 100]`) via rest syntax. Tagged templates are the mechanism behind libraries like styled-components (CSS-in-JS) and safe HTML-escaping/SQL-escaping template helpers — the tag function gets a chance to sanitize or transform each interpolated value before building the final string.
