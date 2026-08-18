# Safe Alternatives to Unsafe Rendering

`textContent` never parses its input as HTML, so it's immune to markup injection by construction — use it whenever you're just displaying text. If you must render actual HTML from an untrusted source (e.g., a rich-text comment), run it through a dedicated sanitizer with an allowlist (like DOMPurify) rather than hand-rolled regex stripping, which is notoriously easy to bypass.

Modern frameworks (React, Vue, Angular) auto-escape interpolated values by default — `{userInput}` in JSX is rendered as text, not markup — but each has an explicit "danger" escape hatch (`dangerouslySetInnerHTML`, `v-html`) that reintroduces the same risk if fed untrusted data.

## `textContent` vs. raw `innerHTML` vs. sanitized `innerHTML`

| Aspect | `textContent` | Raw `innerHTML` | `innerHTML` with sanitizer (e.g., DOMPurify) |
|---|---|---|---|
| Parses input as markup | No | Yes | Yes, but strips dangerous elements/attributes first |
| Safe with untrusted input | Always | Never | Yes, if the sanitizer's allowlist is correctly configured |
| Supports rich formatting (bold, links) | No | Yes | Yes |
| Performance | Fastest | Fast | Slower (parsing + sanitization pass) |

Default to `textContent` unless you have a concrete need for rendered HTML; reach for a sanitizer only when rich formatting from untrusted sources is a real product requirement. The common mistake is writing a custom regex-based "sanitizer" instead of using a maintained library — regex-based HTML filtering is well documented to have bypasses.

A related, easy-to-misjudge detail: browsers deliberately do **not** execute `<script>` tags injected via `innerHTML` — that's spec behavior, specifically to block that one injection vector. This does *not* make `innerHTML` safe, though: other vectors like `<img onerror="...">` or `<svg onload="...">` do execute their event-handler attributes once inserted into the live DOM. See `../problems/01-xss-demo-and-fixes.md` and `../output-based/01-injected-script-tag-does-not-run.md` for this exact distinction demonstrated.
