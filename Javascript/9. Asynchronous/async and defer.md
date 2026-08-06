When parsing HTML in the context of JavaScript and web development, the terms `async` and `defer` refer to two attributes that control how external JavaScript files are loaded and executed in relation to the HTML document parsing. While these attributes are both related to the loading behavior of JavaScript, they influence the rendering of the page differently.

Here's a breakdown of the differences between `async` and `defer` and how they affect the HTML parsing process:

### 1. **`async` Attribute**

- The `async` attribute is used on `<script>` tags to indicate that the script should be fetched asynchronously and executed as soon as it is available, without waiting for the HTML document to be completely parsed.
- When a `<script>` tag has the `async` attribute, the browser does **not** block the rendering of the page while the script is being fetched. However, the script is executed **immediately** once it is downloaded, potentially interrupting the parsing of HTML.

#### **How it works**

- The browser starts parsing the HTML and encounters the `<script async src="...">` tag.
- The browser begins downloading the script file in parallel with the HTML parsing.
- Once the script is fetched, the browser **stops parsing the HTML** and immediately executes the script.
- After the script is executed, the browser resumes parsing the remaining HTML.

#### **Behavior of `async`**

- Scripts with the `async` attribute are executed **as soon as** they are downloaded, regardless of where they appear in the HTML document.
- If you have multiple scripts with `async`, they are executed in the order in which they finish downloading, not in the order they appear in the HTML.

#### **Example**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Async Example</title>
  </head>
  <body>
    <h1>Async Script Example</h1>

    <script async src="script1.js"></script>
    <script async src="script2.js"></script>
  </body>
</html>
```

- `script1.js` and `script2.js` will be fetched in parallel and executed as soon as they are available, potentially out of order, which may not always be desirable.

### 2. **`defer` Attribute**

- The `defer` attribute is used on `<script>` tags to indicate that the script should be fetched asynchronously, but it should **only be executed** after the HTML document has been completely parsed.
- The `defer` attribute guarantees that the scripts are executed in the order they appear in the HTML document, even though they are downloaded asynchronously.

#### **How it works**

- The browser starts parsing the HTML document and encounters the `<script defer src="...">` tag.
- The browser downloads the script in parallel while continuing to parse the rest of the HTML.
- However, the script is **not executed immediately**. It will be executed **only after the HTML parsing is complete**, before the `DOMContentLoaded` event is fired.

#### **Behavior of `defer`**

- Scripts with the `defer` attribute are executed in the order they appear in the document, regardless of how long it takes for each script to finish downloading.
- The scripts are executed after the document is fully parsed but before the `DOMContentLoaded` event is triggered, ensuring that all DOM elements are available to the scripts.

#### **Example**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Defer Example</title>
  </head>
  <body>
    <h1>Defer Script Example</h1>

    <script defer src="script1.js"></script>
    <script defer src="script2.js"></script>
  </body>
</html>
```

- Both `script1.js` and `script2.js` are fetched in parallel but executed in the order they appear, only after the entire HTML document has been parsed.

### 3. **Key Differences Between `async` and `defer`**

| **Feature**                      | **`async`**                                                                    | **`defer`**                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Loading Behavior**             | Downloads script asynchronously while parsing the HTML.                        | Downloads script asynchronously while parsing the HTML.                                           |
| **Execution Order**              | Executes as soon as the script is available, potentially out of order.         | Executes in the order the scripts appear in the document, after HTML parsing.                     |
| **When Is Execution Triggered?** | As soon as the script is downloaded.                                           | After the entire HTML document has been parsed.                                                   |
| **Impact on HTML Parsing**       | Can block HTML parsing while executing.                                        | Does **not** block HTML parsing.                                                                  |
| **Best Use Case**                | For scripts that do not depend on other scripts or the DOM being fully parsed. | For scripts that depend on the DOM being fully parsed or need to be executed in a specific order. |

### 4. **When to Use `async` vs. `defer`?**

- **Use `async`** when:
  - The script is independent of other scripts and does not rely on DOM elements being fully loaded. For example, analytics scripts, ad scripts, or other third-party scripts that don't interact with the page content.
  - Speed is a concern, and you want to load scripts as quickly as possible without waiting for the entire page to be parsed.

- **Use `defer`** when:
  - The script relies on the DOM being fully parsed or needs to be executed after the page is loaded. This is ideal for scripts that interact with DOM elements, like JavaScript functionality for forms, modals, or other page interactions.
  - You need to preserve the order of script execution.

### 5. **Conclusion**

- **`async`** is best for scripts that can be executed independently of the HTML structure and other scripts.
- **`defer`** is ideal for scripts that need to wait for the document to finish parsing and need to be executed in a specific order.

Both attributes help improve page load times by allowing scripts to be fetched asynchronously, but they provide different levels of control over when and how the scripts are executed in relation to the HTML document parsing.

Here is my take: Both `async` and `defer` prevent scripts from blocking HTML parsing during downloading, but they differ significantly in **when they execute** and **whether they preserve execution order**.

Here is a visual breakdown of how HTML parsing, downloading, and script execution interact across different script tags:

---

### Comparison Diagram

```text
1. Normal <script>
HTML Parsing  |═══════════|               |═══════════|
Script Download           |███████████|
Script Execution                      |███████|
(Parser is completely blocked while the script downloads and runs)

2. <script async>
HTML Parsing  |═══════════════════════|               |═══════════|
Script Download           |███████████|
Script Execution                      |███████|
(Downloads in background; pauses HTML parsing IMMEDIATELY when ready to execute)

3. <script defer>
HTML Parsing  |═══════════════════════════════════════|
Script Download           |███████████|
Script Execution                                      |███████|
(Downloads in background; waits for HTML parsing to complete BEFORE executing)

```

---

### Key Differences

| Feature             | Regular `<script>`                            | `<script async>`                                 | `<script defer>`                                           |
| ------------------- | --------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| **HTML Parsing**    | Blocked during download & execution           | Blocked **only** during execution                | Never blocked                                              |
| **Execution Time**  | Immediately when downloaded                   | Immediately when downloaded                      | After HTML parsing finishes (before `DOMContentLoaded`)    |
| **Order Guarantee** | Sequential                                    | **No** (executes as soon as downloaded)          | **Yes** (executes in document order)                       |
| **Best Used For**   | Critical scripts required before page renders | Independent third-party scripts (Analytics, Ads) | Scripts that manipulate the DOM or depend on other scripts |

---

### Detailed Breakdown

#### 1. `<script async>` (Asynchronous)

- **Behavior:** Downloads the script in the background while HTML parsing continues. As soon as the script finishes downloading, **HTML parsing pauses** to execute the script immediately. Once execution finishes, HTML parsing resumes.
- **Order:** Scripts marked `async` run on a **first-come, first-served** basis. If `scriptA.js` is declared before `scriptB.js`, but `scriptB.js` finishes downloading first, `scriptB.js` will execute first.
- **Use Case:** Best for independent, third-party scripts that do not rely on the DOM or other scripts (e.g., Google Analytics, tracking pixels, or ad networks).

#### 2. `<script defer>` (Deferred)

- **Behavior:** Downloads the script in the background without blocking HTML parsing. Execution is **deferred until the HTML document is fully parsed**.
- **Order:** Preserves the relative ordering declared in the document. Even if a smaller `scriptB.js` downloads before `scriptA.js`, browser guarantees `scriptA.js` runs first.
- **Timing:** Executes right before the `DOMContentLoaded` event fires.
- **Use Case:** Best for application scripts that rely on DOM elements or depend on each other (e.g., UI libraries, main application entry points).

---

### Cheat Sheet Recommendation

> **Default Rule of Thumb:** Place scripts in the `<head>` tag with the `defer` attribute. It maximizes download parallelism without blocking parser rendering or breaking script dependency order.
