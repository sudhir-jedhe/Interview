# Problem: Implement `capitalize`, `truncate`, and `slugify` from scratch

Implement three string utilities without leaning on library methods beyond the string/array basics (`slice`, `split`, `join`, `charAt`, `toUpperCase`/`toLowerCase`, regex where genuinely needed).

## Requirements

1. `capitalize(str)` — uppercase the first letter, lowercase the rest. Empty string returns empty string.
2. `truncate(str, maxLength)` — cut the string to `maxLength` characters, appending `"..."` only if it was actually truncated, and the *total* output length (including the ellipsis) should not exceed `maxLength`.
3. `slugify(str)` — convert to a URL-safe slug: lowercase, spaces/underscores become hyphens, non-alphanumeric characters (other than hyphens) are stripped, and collapsed/leading/trailing hyphens are cleaned up.

## Solution

```js
function capitalize(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log(capitalize("hello WORLD")); // "Hello world"
console.log(capitalize(""));            // ""
console.log(capitalize("a"));           // "A"


function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  const ellipsis = "...";
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

console.log(truncate("Hello, world!", 8));  // "Hello..."
console.log(truncate("Hi", 8));             // "Hi" — no truncation needed
console.log(truncate("Hello", 2));          // ".." — degenerate but bounded case


function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")     // spaces/underscores -> single hyphen
    .replace(/[^a-z0-9-]/g, "")  // strip anything that isn't alphanumeric or hyphen
    .replace(/-+/g, "-")         // collapse repeated hyphens
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}

console.log(slugify("  Hello, World!  "));      // "hello-world"
console.log(slugify("React & Redux: A Guide"));  // "react-redux-a-guide"
console.log(slugify("multiple   spaces_here"));  // "multiple-spaces-here"
```

## Why it works

- `capitalize` splits the string once at index 1 with `slice`, avoiding a loop; lowercasing the remainder ensures `"HELLO"` becomes `"Hello"`, not `"HELLO"`.
- `truncate` reserves room for the ellipsis *before* slicing, so the final string (content + `"..."`) never exceeds `maxLength` — a common off-by-one bug is appending `"..."` after slicing to the full `maxLength`, which overshoots.
- `slugify` runs a deliberate pipeline: normalize case → collapse whitespace/underscores into hyphens → strip disallowed characters → collapse duplicate hyphens (which can appear after stripping something between two hyphens) → trim stray hyphens at the edges. Each `replace` step handles one concern, which keeps the regex simple and the pipeline easy to reason about/test independently.

## Edge cases worth testing

```js
console.log(slugify("---"));        // "" — nothing left after stripping/trimming hyphens
console.log(slugify("café déjà vu")); // "caf-dj-vu" — accented characters are stripped by the ASCII-only regex; a production version would normalize accents to their base letters first (e.g. via str.normalize("NFD") and stripping combining marks) before running this pipeline
console.log(truncate("abc", 3));    // "abc" — exactly at the limit, no truncation
```
