# DOM Selection & Mutation

*(Browser-only unless noted — run these in a browser console with a page loaded, not a Node REPL.)*

## Selecting, creating, and modifying nodes

`document.querySelector(selector)` returns the first matching element (or `null`); `querySelectorAll` returns a static `NodeList` of all matches. `createElement` builds a detached node you must insert with `appendChild`/`append`/`insertBefore` to see it rendered.

```js
const el = document.createElement("div");
el.textContent = "Hello";
document.body.append(el);
```

## `textContent` vs `innerHTML`

The critical distinction is `textContent` vs `innerHTML`. `textContent` sets/reads raw text — any string assigned to it is inserted literally, never parsed as markup. `innerHTML` parses the assigned string as HTML and creates real DOM nodes from it.

```js
const userInput = "<img src=x onerror=alert('xss')>";
el.textContent = userInput; // safe: renders the literal text "<img src=x onerror=alert('xss')>"
el.innerHTML = userInput;   // DANGEROUS: creates a real <img> tag, onerror fires, XSS executes
```

This is the single most common DOM-related security bug: rendering untrusted (user- or API-supplied) content via `innerHTML`. If you must insert HTML, sanitize it first (e.g., with DOMPurify) or use safer APIs. Never build `innerHTML` strings via concatenation with unescaped user input. See `../../20-security-basics/` for the full XSS treatment.

### Comparison

| Aspect | `textContent` | `innerHTML` |
|---|---|---|
| Parses input as HTML | No — treated as literal text | Yes — creates real DOM nodes |
| XSS risk with untrusted input | None | High — can execute scripts/handlers |
| Performance | Faster (no parsing) | Slower (parses + re-renders subtree) |
| Use case | Displaying any text, especially user-generated | Inserting known-safe, pre-sanitized markup |

Default to `textContent` for anything containing user input or API data you don't fully control. The most common mistake is using `innerHTML` for "convenience" (e.g., building a list from an array with template strings) without realizing any of that data could contain a `<script>` or `onerror` handler.
