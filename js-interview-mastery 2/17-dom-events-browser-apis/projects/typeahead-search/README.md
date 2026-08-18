# Project: Typeahead Search

A small, runnable, dependency-free browser project: a debounced typeahead/autocomplete search box over a mock local dataset (a static list of country names, standing in for an API), with full keyboard navigation.

## What it demonstrates

- **Debounce** (`../../problems/02-debounce-and-throttle.md`): the search only actually "hits the API" ~250ms after the user stops typing, not on every keystroke.
- **Stale-response protection**: a request token guards against an older, slower "response" overwriting a newer one — the same idea as the `AbortController` pattern in `../../scenarios/04-search-as-you-type-debounce-abort.md`, adapted since the mock API has nothing real to cancel.
- **Event delegation**: a single click listener on the results `<ul>` handles selecting any result, including ones rendered after the listener was attached.
- **Keyboard navigation**: `ArrowDown`/`ArrowUp` move the highlighted result (wrapping at both ends), `Enter` selects it, `Escape` closes the dropdown.
- **Safe DOM rendering**: results (and the highlighted match) are built with `createElement`/`textContent`, never `innerHTML` with raw input — see `../../../20-security-basics/` for why that matters.
- Basic accessibility: `role="combobox"`/`role="listbox"`/`role="option"`, `aria-expanded`, `aria-selected`, and a live region for the result count.

## How to run it

No build step or server required.

1. Open `index.html` directly in any modern browser (double-click it, or drag it into a browser window).
2. Start typing a country name (e.g., "united", "ar", "korea").
3. Use `ArrowDown`/`ArrowUp` to move through the results, `Enter` to pick one, `Escape` to dismiss the dropdown, or just click a result with the mouse.

If your browser blocks local script execution under `file://` for any reason, you can instead serve the folder with any static file server, e.g.:

```bash
cd projects/typeahead-search
python3 -m http.server 8000
# then open http://localhost:8000 in a browser
```

## Files

- `index.html` — markup + inline styles for the search box and results dropdown.
- `script.js` — all behavior: the mock data/API, the `debounce` implementation, rendering, and keyboard handling.
