To safely load dynamic JSON or CSS modules using `import()`, pass an options object containing the `with` attribute as the second argument, and wrap the call in a `try/catch` block.

Because runtime environments vary in their support for import attributes (and legacy runtimes previously used `assert` instead of `with`), a robust implementation should validate outputs and provide sensible fallbacks (such as `fetch`).

---

### 1. Safely Loading a Dynamic JSON Module

When loading JSON via `import()`, the parsed data is attached to the module's `default` export.

```typescript
interface LoadJsonResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Safely imports a dynamic JSON module with fallbacks.
 *
 * @param path - Relative or absolute URL to the JSON file
 */
export async function loadJsonModule<T = unknown>(path: string): Promise<LoadJsonResult<T>> {
  try {
    // 1. Modern TC39 Stage 4 syntax using 'with'
    const module = await import(path, {
      with: { type: 'json' },
    });

    return { data: module.default as T, error: null };
  } catch (primaryError) {
    // Fallback path: If import attributes fail due to syntax incompatibility,
    // network MIME mismatch, or older engine version, fall back to standard fetch()
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = (await response.json()) as T;
      return { data, error: null };
    } catch (fallbackError) {
      return {
        data: null,
        error: new Error(
          `Failed to load JSON module at "${path}". Import error: ${
            (primaryError as Error).message
          } | Fallback error: ${(fallbackError as Error).message}`
        ),
      };
    }
  }
}

```

#### Usage

```typescript
interface AppConfig {
  apiUrl: string;
  maxRetries: number;
}

async function init() {
  const { data: config, error } = await loadJsonModule<AppConfig>('/config/app.json');

  if (error || !config) {
    console.error('Initialization aborted:', error);
    return;
  }

  console.log('Connected to API:', config.apiUrl);
}

```

---

### 2. Safely Loading a Dynamic CSS Module

When importing a CSS module via `with { type: 'css' }`, the engine returns a native **`CSSStyleSheet`** instance (a Constructable Stylesheet) on `module.default`. You attach it to the document or shadow root via `document.adoptedStyleSheets`.

```typescript
interface LoadCssResult {
  sheet: CSSStyleSheet | null;
  error: Error | null;
}

/**
 * Safely imports a dynamic CSS module and constructs a CSSStyleSheet.
 *
 * @param path - Relative or absolute URL to the CSS file
 */
export async function loadCssModule(path: string): Promise<LoadCssResult> {
  try {
    // 1. Dynamic import with CSS type attribute
    const module = await import(path, {
      with: { type: 'css' },
    });

    return { sheet: module.default as CSSStyleSheet, error: null };
  } catch (primaryError) {
    // Fallback path: Fetch the raw CSS text and populate a new CSSStyleSheet manually
    try {
      if (typeof CSSStyleSheet === 'undefined') {
        throw new Error('Constructable stylesheets are not supported in this environment.');
      }

      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const cssText = await response.text();
      const sheet = new CSSStyleSheet();
      await sheet.replace(cssText); // Asynchronous parsing to avoid main-thread blocking

      return { sheet, error: null };
    } catch (fallbackError) {
      return {
        sheet: null,
        error: new Error(
          `Failed to load CSS module at "${path}". Import error: ${
            (primaryError as Error).message
          } | Fallback error: ${(fallbackError as Error).message}`
        ),
      };
    }
  }
}

```

#### Usage with Document or Shadow DOM

```typescript
async function applyTheme(themeName: string, root: Document | ShadowRoot = document) {
  const { sheet, error } = await loadCssModule(`/themes/${themeName}.css`);

  if (error || !sheet) {
    console.warn(`Could not apply theme "${themeName}":`, error?.message);
    return;
  }

  // Adopt the stylesheet into the target root
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
}

```

---

### Key Failure Modes to Guard Against

* **MIME-Type Mismatch (`TypeError`):** If the server delivers the JSON file with `text/html` (e.g., during a 404 SPA fallback redirect) or `text/plain`, the browser throws an immediate `TypeError: Expected a JSON module script but the server responded with a MIME type of "text/html"`.
* **CORS Restrictions:** Just like static imports, dynamic module imports require standard CORS headers (`Access-Control-Allow-Origin`) if fetched cross-origin.
* **Malformed Content (`SyntaxError`):** If the JSON file contains trailing commas, single quotes, or comments, `import()` throws an unrecoverable `SyntaxError` during the Construction phase before entering `try/catch` evaluation.
* **Legacy `assert` vs `with` Support:** Older environments (Node.js 16–18 or Chromium < 123) may still expect `{ assert: { type: 'json' } }`. The `fetch` fallback pattern above ensures cross-compatibility without breaking runtime execution.
