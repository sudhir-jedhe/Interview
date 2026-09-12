Import attributes (defined in TC39 Stage 4 using the `with` keyword, replacing the earlier `assert` syntax) allow developers to pass out-of-band metadata alongside module specifiers:

```javascript
// Static import
import config from './config.json' with { type: 'json' };
import sheet from './styles.css' with { type: 'css' };

// Dynamic import
const data = await import('./config.json', { with: { type: 'json' } });

```

These attributes operate primarily within **Phase 1: Construction (Fetching & Parsing)**. Their main purpose is to prevent **MIME-type confusion and security exploits** before any code reaches Phase 2 (Instantiation) or Phase 3 (Evaluation).

---

### 1. The Security Problem Import Attributes Solve

Historically, the browser determines how to parse a module based on the HTTP `Content-Type` header sent by the server.

Without import attributes, an attacker could execute unauthorized JavaScript via a JSON or CSS endpoint:

1. A developer imports data expecting passive data:
`import data from '[https://api.example.com/user-data.json](https://api.example.com/user-data.json)';`
2. If the API endpoint is compromised, misconfigured, or allows user-supplied content, the server could send back executable JavaScript (`Content-Type: text/javascript`) containing malicious top-level code:
`evilScript(); export default {};`
3. The browser, trusting the server's MIME type, would parse and evaluate it as executable JavaScript in Phase 3.

With import attributes, the client **declares its security expectation upfront**:

```javascript
import data from 'https://api.example.com/user-data.json' with { type: 'json' };

```

If the server serves anything other than a recognized JSON MIME type (`application/json`), the browser **aborts immediately during the Construction phase**.

---

### 2. How Import Attributes Work During Construction

The Construction phase consists of three steps: Module Resolution, Fetching, and Parsing. Import attributes participate directly across this pipeline:

#### Step A: Module Map Cache Keying

In standard ESM, modules are cached in the internal **Module Map** by their canonical URL.

Import attributes alter this behavior: the module map key is a tuple of:

$$\text{Module Key} = (\text{Canonical URL}, \text{Sorted Import Attributes})$$

If the same URL is requested with different attributes (or once with `{ type: 'json' }` and once without), they do not share the same cache entry unless the host environment specifically normalizes them.

#### Step B: Strict MIME-Type Validation

Once the resource is fetched over the network or disk, the host environment compares the server's HTTP `Content-Type` against the declared `type` attribute:

* **For `{ type: 'json' }`:** The MIME type must be an explicit JSON MIME type (e.g., `application/json`). If the server responds with `text/javascript`, `text/plain`, or `text/html`, the engine halts and throws a `TypeError: Failed to load module script: Expected a JSON module script but the server responded with a MIME type of "text/javascript"`.
* **For `{ type: 'css' }`:** The MIME type must be `text/css`.

This check prevents a server from tricking the browser into parsing code under an unintended interpreter.

#### Step C: Parsing into Specialized Module Records

Standard JavaScript files are parsed into a **Source Text Module Record**. When a non-JS `type` attribute is present, the engine routes the fetched string to a specialized parser instead:

* **JSON Module:** Parsed directly using the equivalent of `JSON.parse()`. It creates a **Synthetic Module Record** where:
* There are **no import statements** (JSON files cannot import dependencies).
* A single `default` export binding is created, holding the parsed JSON object.
* *No executable code is generated.*

* **CSS Module:** Parsed into a **CSSStyleSheet** instance (Constructable Stylesheet).
* A single `default` export binding is created, pointing to that stylesheet object.
* The stylesheet can then be adopted via `document.adoptedStyleSheets = [sheet]`.

If parsing fails (e.g., the JSON file has a syntax error), a `SyntaxError` is thrown immediately in the Construction phase, preventing the dependency graph from progressing to Instantiation.

---

### 3. Impact on Subsequent Phases

Because the security and parsing constraints are fully resolved in the Construction phase:

* **Instantiation (Phase 2):**
The engine links the importing module's identifier directly to the Synthetic Module Record's `default` export memory slot. No complex live bindings or cyclical dependency graphs need to be mapped.
* **Evaluation (Phase 3):**
Evaluation for JSON and CSS modules is effectively a **no-op**. Since there is no top-level user JavaScript, no execution happens, no side effects occur, and the operation is completely synchronous and safe.

---

### Summary Checklist

| Event in Construction Phase  | Behavior with Import Attributes (`with { type: ... }`)                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Specifier Identification** | Parser recognizes `with { ... }` syntax statically.                                                                  |
| **Cache Check**              | Module Map matches URL **and** attribute parameters.                                                                 |
| **Network Response**         | Engine checks the response's `Content-Type` against the `type` attribute; mismatches throw an immediate `TypeError`. |
| **Parsing**                  | Bypasses the JavaScript AST parser; delegates to `JSON.parse` or CSS stylesheet parser.                              |
| **Record Creation**          | Produces a **Synthetic Module Record** with an immutable `default` export and zero side effects.                     |
