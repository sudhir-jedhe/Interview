A **semantic tag** (or semantic element) in HTML clearly describes its meaning and purpose to both the browser and the developer, rather than just dictating how content should look.

For example, `<p>` clearly indicates a paragraph, and `<button>` defines a clickable button. In contrast, non-semantic tags like `<div>` and `<span>` tell the browser nothing about the type of content they contain—they act purely as generic containers for styling or layout.

---

### Key Semantic Elements

**Document Structure & Layout**

* `<header>`: Introductory content, page banners, or site-level navigation wrappers.
* `<nav>`: Major navigational blocks containing links.
* `<main>`: The dominant, central content unique to the document (only one per page).
* `<article>`: Self-contained, independently distributable content (e.g., blog posts, news articles, comments).
* `<section>`: A thematic grouping of content, typically with a heading.
* `<aside>`: Content tangentially related to the surrounding content (e.g., sidebars, callout boxes).
* `<footer>`: Information about the author, copyright data, links to related documents, or footnotes.

**Content & Text Meaning**

* `<h1>` to `<h6>`: Hierarchical section headings indicating document structure.
* `<figure>` and `<figcaption>`: Self-contained media (like images, diagrams, or code snippets) and its caption.
* `<mark>`: Text highlighted or marked for reference purposes.
* `<time>`: Specific machine-readable times, dates, or durations.
* `<strong>`: Text with strong importance or urgency (not merely visual bolding).
* `<em>`: Text with stress emphasis that shifts the sentence’s tone or meaning.

**Forms & Interaction**

* `<button>`: An interactive, keyboard-accessible push button.
* `<form>`: An interactive section for submitting user inputs.
* `<fieldset>` and `<legend>`: A group of related controls and its descriptive label.

---

### Why Semantic Elements Matter

* **Accessibility (a11y)**: Screen readers and assistive technologies use native semantics to build the browser's accessibility tree. This allows users to navigate directly by landmarks (e.g., skipping straight to `<main>` or browsing headings).
* **Search Engine Optimization (SEO)**: Search engine crawlers prioritize semantic structure to parse the primary topics, headings, and hierarchy of a webpage effectively.
* **Maintainability & Readability**: Semantic markup creates cleaner code that is easier for teams to inspect, understand, and maintain without relying on excessive class names (e.g., avoiding `<div class="nav-bar">` when `<nav>` suffices).
* **Built-in Browser Behavior**: Native interactive semantic tags come with default keyboard navigation (like `Tab` focus and `Enter`/`Space` activation) and default state handling that non-semantic elements lack.
