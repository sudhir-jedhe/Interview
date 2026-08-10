Automated accessibility testing using **`jest-axe`** allows you to catch common WCAG (Web Content Accessibility Guidelines) violations—such as missing ARIA attributes, unassociated form labels, broken landmark structures, and invalid HTML roles—directly inside your Vitest or Jest component test suite.

Here is a step-by-step guide to installing, configuring, and writing automated accessibility tests for React components.

---

## 1. Installation

Install `jest-axe` along with `@testing-library/react` as development dependencies:

```bash
# For Vitest or Jest projects
npm install -D jest-axe @testing-library/react @testing-library/jest-dom

```

---

## 2. Global Configuration & Matchers Setup

To use the custom `.toHaveNoViolations()` assertion across your entire test suite without importing it into every file, configure it in your test setup file.

### For Vitest (`src/testing/setupTests.ts`)

```typescript
// src/testing/setupTests.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

```

Make sure your TypeScript configuration (`tsconfig.json`) recognizes the custom matcher types:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom", "jest-axe"]
  }
}

```

---

### For Jest (`jest.setup.js` / `setupTests.ts`)

```typescript
// setupTests.ts
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest's expect matcher
expect.extend(toHaveNoViolations);

```

---

## 3. Writing Accessibility Tests for React Components

### Example 1: Accessible vs. Inaccessible Components

Let's test an accessible component against an inaccessible one to see how `jest-axe` catches violations.

```tsx
// src/components/FormControls.tsx
import React from 'react';

// ✅ ACCESSIBLE COMPONENT
export const AccessibleForm = () => (
  <form aria-label="User Registration">
    <label htmlFor="user-email">Email Address</label>
    <input id="user-email" type="email" placeholder="alex@example.com" required />
    <button type="submit">Register</button>
  </form>
);

// ❌ INACCESSIBLE COMPONENT (Missing labels, invalid image alt text)
export const InaccessibleForm = () => (
  <form>
    {/* Violation: Input missing an associated label or aria-label */}
    <input type="email" placeholder="alex@example.com" />
    
    {/* Violation: Image missing alt attribute */}
    <img src="/logo.png" />
    
    {/* Violation: Interactive element missing accessible name */}
    <button type="button" onClick={() => {}} />
  </form>
);

```

---

### Example 2: The Accessibility Test Suite (`FormControls.test.tsx`)

Pass the rendered component container into `axe()` and assert that it has no violations:

```tsx
// src/components/__tests__/FormControls.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { AccessibleForm, InaccessibleForm } from '../FormControls';

describe('Accessibility (a11y) Automated Audits', () => {
  it('AccessibleForm should have zero WCAG accessibility violations', async () => {
    const { container } = render(<AccessibleForm />);

    // Run axe accessibility engine against rendered DOM tree
    const results = await axe(container);

    // Assert zero violations
    expect(results).toHaveNoViolations();
  });

  it('InaccessibleForm should fail accessibility audit and report violations', async () => {
    const { container } = render(<InaccessibleForm />);

    const results = await axe(container);

    // This assertion will fail, listing exact WCAG rules violated
    expect(results).not.toHaveNoViolations();
  });
});

```

---

## 4. Advanced Configuration: Custom Axe Rules & Modal Audits

### A. Configuring Specific Axe Rules & Exclusions

You can configure the `axe` engine to disable specific rules (e.g., if testing a partial DOM fragment that lacks a document-level `<main>` landmark) or enforce specific WCAG levels (e.g., `wcag2a`, `wcag2aa`, `wcag21aa`).

```tsx
// src/components/__tests__/Modal.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { Modal } from '../Modal';

describe('Modal Accessibility Audit', () => {
  it('should have no violations when modal dialog is open', async () => {
    const { container } = render(
      <Modal isOpen={true} title="Terms of Service">
        <p>Please read and accept our terms.</p>
        <button>Accept</button>
      </Modal>
    );

    // Configure custom axe options
    const results = await axe(container, {
      rules: {
        // Enforce strict WCAG 2.1 Level AA tags
        'region': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });
});

```

---

### B. Creating a Reusable Helper Function

To streamline accessibility checks across hundreds of component tests, create a reusable testing helper:

```typescript
// src/testing/testUtils.ts
import { render, RenderOptions } from '@testing-library/react';
import { axe, AxeResults } from 'jest-axe';
import { ReactElement } from 'react';

export async function assertAccessible(
  ui: ReactElement,
  options?: RenderOptions
): Promise<AxeResults> {
  const { container } = render(ui, options);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
}

```

#### Usage in any test file

```tsx
import { assertAccessible } from '@/testing/testUtils';
import { Button } from './Button';

it('button component is fully accessible', async () => {
  await assertAccessible(<Button label="Click Me" />);
});

```

---

## What `jest-axe` Catches vs. Limitations

| What `jest-axe` Catches Automatically                                                   | What Requires Manual or E2E Testing                                                             |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Missing Form Labels:** `<input>` elements without matching `<label>` or `aria-label`. | **Keyboard Focus Traps:** Ensuring `Tab` key focus stays constrained inside open modal dialogs. |
| **Duplicate IDs:** Multiple elements sharing the same `id` attribute.                   | **Screen Reader Intonation:** How screen readers voice dynamic content updates.                 |
| **Invalid ARIA Roles:** Using non-existent or misapplied `role="..."` values.           | **Complex Color Contrast:** CSS background gradients or dynamic images behind text.             |
| **Image Alt Attributes:** `<img>` tags missing `alt="..."` descriptions.                | **Logical Focus Order:** Ensuring focus moves sequentially across custom layouts.               |
