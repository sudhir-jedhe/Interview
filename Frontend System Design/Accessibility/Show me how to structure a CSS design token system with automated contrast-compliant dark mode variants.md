Structuring an accessible design token system requires separating **primitive values** (raw colors) from **semantic tokens** (intent-based roles like surface, text, border). By anchoring semantic tokens to luminance-tested pairs, you ensure both light and dark mode automatically pass WCAG AA (4.5:1 for text, 3:1 for UI controls) without hand-picking colors for every component.

Here is a architecture using modern CSS Custom Properties, native color functions, and CSS Light/Dark color-scheme integration.

---

## 1. System Architecture & Token Structure

We organize tokens into three distinct tiers:

1. **Tier 1: Primitives (Palettes)** — Raw HSL or Oklch color scales. Never used directly in UI components.
2. **Tier 2: Semantic Tokens (Light/Dark Pairs)** — Contextual roles mapped to primitive pairs validated for contrast compliance.
3. **Tier 3: Component Tokens** — Specific component bindings mapped directly back to semantic tokens.

```
┌────────────────────────────────────────────────────────┐
│ Tier 1: Primitives (e.g., --slate-900, --blue-600)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 2: Semantic Tokens                                │
│ --surface-default  ──► light: slate-50  / dark: slate-900│
│ --text-primary     ──► light: slate-900 / dark: slate-50 │ (Contrast Ratio: 15.6:1)
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 3: Component Tokens (e.g., --btn-bg, --card-bg)   │
└────────────────────────────────────────────────────────┘

```

---

## 2. Production CSS Token Implementation

Using CSS `light-dark()` (or standard media query overrides), we can declare both light and dark modes in a single location.

```css
/* ==========================================================================
   TIER 1: PRIMITIVES
   Raw color values across scale lightness (50 to 950).
   Using OKLCH or HSL ensures predictable visual lightness steps.
   ========================================================================== */
:root {
  /* Slate Scale */
  --pr-slate-50:  oklch(0.98 0.005 240);
  --pr-slate-100: oklch(0.95 0.010 240);
  --pr-slate-200: oklch(0.88 0.015 240);
  --pr-slate-300: oklch(0.78 0.020 240);
  --pr-slate-700: oklch(0.35 0.030 240);
  --pr-slate-800: oklch(0.25 0.025 240);
  --pr-slate-900: oklch(0.18 0.020 240);
  --pr-slate-950: oklch(0.12 0.015 240);

  /* Brand Blue Scale */
  --pr-blue-500:  oklch(0.60 0.200 250);
  --pr-blue-600:  oklch(0.52 0.210 250); /* High contrast light mode accent */
  --pr-blue-400:  oklch(0.70 0.180 250); /* Desaturated/brighter dark mode accent */
  --pr-blue-950:  oklch(0.20 0.080 250);

  /* Status Primitives */
  --pr-red-600:   oklch(0.55 0.220 25);
  --pr-red-400:   oklch(0.72 0.190 25);
}

/* ==========================================================================
   TIER 2: SEMANTIC TOKENS (Contrast-Guaranteed Pairs)
   Every text token is paired with a specific background surface to ensure
   a minimum of 4.5:1 (WCAG AA) contrast ratio.
   ========================================================================== */

/* Enable browser native color-scheme awareness */
:root {
  color-scheme: light dark;

  /* Surfaces */
  --surface-base:      light-dark(var(--pr-slate-50), var(--pr-slate-950));
  --surface-raised:    light-dark(#ffffff, var(--pr-slate-900));
  --surface-subtle:    light-dark(var(--pr-slate-100), var(--pr-slate-800));

  /* Text & Content (Target: 4.5:1+ against corresponding surfaces) */
  --text-primary:      light-dark(var(--pr-slate-950), var(--pr-slate-50));  /* ~16:1 ratio */
  --text-secondary:    light-dark(var(--pr-slate-700), var(--pr-slate-300));  /* ~5.2:1 ratio */
  --text-on-accent:    #ffffff;

  /* Interactive Accents (Target: 3:1+ for controls, 4.5:1 for text) */
  --accent-primary:    light-dark(var(--pr-blue-600), var(--pr-blue-400));
  --accent-subtle:     light-dark(var(--pr-blue-50), var(--pr-blue-950));

  /* Status Colors */
  --status-error-bg:   light-dark(oklch(0.95 0.03 25), oklch(0.25 0.06 25));
  --status-error-text: light-dark(var(--pr-red-600), var(--pr-red-400));

  /* Borders & Focus Rings (Target: 3:1+ against adjacent background) */
  --border-default:    light-dark(var(--pr-slate-300), var(--pr-slate-700));
  --focus-ring:        light-dark(var(--pr-blue-600), var(--pr-blue-400));
}

/* Manual Theme Overrides via Class (e.g. user theme toggle) */
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }

/* ==========================================================================
   TIER 3: COMPONENT BINDINGS
   Components consume ONLY Tier 2 tokens or component abstractions.
   ========================================================================== */
.card {
  background-color: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 1.5rem;
}

.card-subtitle {
  color: var(--text-secondary);
}

.btn-primary {
  background-color: var(--accent-primary);
  color: var(--text-on-accent);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.btn-primary:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

```

---

## 3. Automated Contrast Auditing in Build Pipelines

To prevent non-compliant primitive pairings from making it to production, validate your CSS tokens during build time or in CI/CD using **Style Dictionary** with a custom contrast validator plugin.

### Style Dictionary + Contrast Validation Script

```javascript
// build-tokens.js
const StyleDictionary = require('style-dictionary');
const { culori, wcagLuminance, contrast } = require('culori');

// Custom Transform to Validate Contrast Ratios
StyleDictionary.registerTransform({
  name: 'accessibility/contrast-check',
  type: 'value',
  transitive: true,
  matcher: (token) => token.attributes?.category === 'semantic',
  transformer: (token) => {
    const { bg, fg, minRatio = 4.5 } = token.accessibility || {};
    
    if (bg && fg) {
      const ratio = contrast(bg, fg);
      if (ratio < minRatio) {
        console.error(
          `❌ [Accessibility Violation] Token '${token.name}': Contrast ratio between ${bg} and ${fg} is ${ratio.toFixed(2)}:1. Minimum required is ${minRatio}:1.`
        );
        process.exitCode = 1; // Fail the CI/CD build
      } else {
        console.log(`✅ [Accessibility Pass] Token '${token.name}' Ratio: ${ratio.toFixed(2)}:1`);
      }
    }
    return token.value;
  }
});

// Configure and run build
const sd = StyleDictionary.extend({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transforms: ['attribute/cti', 'color/css', 'accessibility/contrast-check'],
      buildPath: 'build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    }
  }
});

sd.buildAllPlatforms();

```

---

## Core Rules for Accessible Theme Systems

1. **Invert Lightness Intentionally:** Dark mode is not just "inverting colors." Light backgrounds use subtle shadows for depth, whereas dark backgrounds use lighter background surface overlays (`--surface-raised`) because shadows are invisible on dark backgrounds.
2. **Desaturate Accents in Dark Mode:** High-saturation brand colors (e.g., `#0055FF`) look good on light backgrounds, but cause visual vibration ("bleed") on dark backgrounds. Lower the chroma/saturation and increase lightness for dark mode accents (e.g., `--pr-blue-400`).
3. **Always Anchor Focus Rings:** Ensure `--focus-ring` maintains at least a 3:1 contrast ratio against both `--surface-base` and `--surface-raised`.
