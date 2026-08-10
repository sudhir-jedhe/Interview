**Config-Driven UI** (or Server-Driven UI) is a frontend architectural pattern where the structure, layout, behavior, and content of a user interface are defined by a JSON (or YAML) configuration object rather than hardcoded in JSX/HTML.

In this pattern, the frontend acts as a **smart rendering engine**. It receives a schema configuration (often from a backend API or local CMS) and dynamically maps that JSON to a registry of reusable frontend components.

---

## Why Use Config-Driven UI?

* **Dynamic UI Updates Without Deployments:** Change page layouts, forms, or navigation instantly from the server without waiting for frontend deployments or App Store reviews.
* **Server-Controlled Business Logic:** Dynamically show/hide fields, reorder sections, or apply validation rules per user role, region, or A/B testing experiment.
* **Consistency & Code Reusability:** Forces developers to build highly modular, standardized design system components.

---

## How to Achieve Config-Driven UI

To build a Config-Driven UI, you need three core building blocks:

```
+------------------+      +--------------------------+      +-------------------------+
|  1. JSON Config  | ---> |  2. Component Registry   | ---> |   3. Renderer Engine    |
| (Schema Payload) |      | (Mapping Type -> React)  |      | (Recursive Map & Render)|
+------------------+      +--------------------------+      +-------------------------+

```

1. **JSON Schema Payload:** Defines component types, layout hierarchy, props, and validation rules.
2. **Component Registry:** A dictionary/map linking string type keys (e.g., `"button"`) to actual UI components (`<Button/>`).
3. **Renderer Engine:** A recursive component that loops over the JSON, looks up matching components in the registry, and passes the JSON props dynamically.

---

## Example 1: Dynamic Form Generator (With Validation)

Forms are the most common application of config-driven UIs.

### 1. JSON Configuration (`formConfig.json`)

```json
{
  "title": "Registration Form",
  "fields": [
    {
      "id": "username",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "required": true
    },
    {
      "id": "role",
      "type": "select",
      "label": "Account Type",
      "options": ["Developer", "Designer", "Manager"],
      "defaultValue": "Developer"
    },
    {
      "id": "newsletter",
      "type": "checkbox",
      "label": "Subscribe to newsletter",
      "defaultValue": false
    }
  ]
}

```

### 2. Component Implementation in React

```jsx
import React, { useState } from 'react';

// A. Individual Form Field Components
const TextInput = ({ label, value, onChange, placeholder, required }) => (
  <div className="field-group">
    <label>{label} {required && '*'}</label>
    <input
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div className="field-group">
    <label>{label}</label>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const CheckboxInput = ({ label, value, onChange }) => (
  <div className="field-group">
    <label>
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  </div>
);

// B. Component Registry
const FIELD_REGISTRY = {
  text: TextInput,
  select: SelectInput,
  checkbox: CheckboxInput,
};

// C. Dynamic Form Renderer Engine
export function ConfigDrivenForm({ schema }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    schema.fields.forEach((field) => {
      initial[field.id] = field.defaultValue ?? '';
    });
    return initial;
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Payload:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{schema.title}</h2>
      {schema.fields.map((field) => {
        const Component = FIELD_REGISTRY[field.type];
        if (!Component) return null; // Fallback for unknown types

        return (
          <Component
            key={field.id}
            {...field}
            value={formData[field.id]}
            onChange={(val) => handleChange(field.id, val)}
          />
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

```

---

## Example 2: E-Commerce Homepage Layout (Server-Driven UI)

E-commerce apps (like Amazon or Swiggy) use config-driven UI to dynamically swap home page feeds during flash sales or promotional events without releasing app updates.

### 1. JSON Configuration (`homeLayoutConfig.json`)

```json
[
  {
    "type": "HERO_BANNER",
    "props": {
      "imageUrl": "/banners/black-friday.jpg",
      "ctaUrl": "/sale",
      "title": "Black Friday Deals - Up to 50% Off"
    }
  },
  {
    "type": "PRODUCT_CAROUSEL",
    "props": {
      "category": "electronics",
      "title": "Trending Electronics",
      "limit": 5
    }
  },
  {
    "type": "PROMO_GRID",
    "props": {
      "columns": 2,
      "items": [
        { "title": "Laptops", "link": "/laptops" },
        { "title": "Headphones", "link": "/headphones" }
      ]
    }
  }
]

```

### 2. Component Renderer Engine

```jsx
import React from 'react';

// Base Components
const HeroBanner = ({ imageUrl, title }) => (
  <div className="hero"><img src={imageUrl} alt={title} /><h1>{title}</h1></div>
);

const ProductCarousel = ({ title, category }) => (
  <div className="carousel"><h3>{title} ({category})</h3>{/* Carousel items */}</div>
);

const PromoGrid = ({ items, columns }) => (
  <div className={`grid cols-${columns}`}>
    {items.map((item, idx) => <div key={idx}>{item.title}</div>)}
  </div>
);

// Registry Mapping
const SECTION_REGISTRY = {
  HERO_BANNER: HeroBanner,
  PRODUCT_CAROUSEL: ProductCarousel,
  PROMO_GRID: PromoGrid,
};

// Page Builder Engine
export function ServerDrivenHomePage({ layoutConfig }) {
  return (
    <main className="homepage">
      {layoutConfig.map((section, index) => {
        const Component = SECTION_REGISTRY[section.type];
        if (!Component) return <div key={index}>Unknown Section</div>;

        return <Component key={index} {...section.props} />;
      })}
    </main>
  );
}

```

---

## Example 3: Nested Dashboard / Page Layout Builder (Recursive Render)

Config-driven UI can also render nested hierarchical structures like dashboards with containers and sidebars.

### 1. JSON Configuration (`dashboardSchema.json`)

```json
{
  "type": "CONTAINER",
  "props": { "direction": "row" },
  "children": [
    {
      "type": "SIDEBAR",
      "props": { "width": "250px", "links": ["Overview", "Analytics", "Settings"] }
    },
    {
      "type": "CONTAINER",
      "props": { "direction": "column" },
      "children": [
        { "type": "HEADER", "props": { "title": "Analytics Dashboard" } },
        { "type": "METRIC_CARD", "props": { "label": "Total Revenue", "value": "$45,200" } }
      ]
    }
  ]
}

```

### 2. Recursive Renderer Implementation

```jsx
import React from 'react';

const Sidebar = ({ width, links }) => (
  <aside style={{ width }}>
    {links.map((l) => <div key={l}>{l}</div>)}
  </aside>
);

const Header = ({ title }) => <h1>{title}</h1>;
const MetricCard = ({ label, value }) => (
  <div className="card"><h4>{label}</h4><p>{value}</p></div>
);

const Container = ({ direction, children }) => (
  <div style={{ display: 'flex', flexDirection: direction }}>{children}</div>
);

const REGISTRY = {
  SIDEBAR: Sidebar,
  HEADER: Header,
  METRIC_CARD: MetricCard,
  CONTAINER: Container,
};

// Recursive Component
export function RecursiveUIEngine({ node }) {
  const Component = REGISTRY[node.type];
  if (!Component) return null;

  // Recursively render child components if present
  const renderedChildren = node.children
    ? node.children.map((child, index) => (
        <RecursiveUIEngine key={index} node={child} />
      ))
    : null;

  return <Component {...node.props}>{renderedChildren}</Component>;
}

```

---

## Trade-offs & Challenges

| Advantages                                                                                        | Challenges / Trade-offs                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Instant Updates:** No app release required for layout changes.                                  | **Increased Complexity:** Error handling for corrupt/missing JSON schemas is critical.                                                    |
| **A/B Testing Friendly:** Serve different configs per user segment from the backend.              | **Bundle Size:** All registered components must be loaded even if unused in a specific config (requires code-splitting via `React.lazy`). |
| **Cross-Platform Parity:** Web, iOS, and Android can share a single JSON backend layout response. | **Security Risks:** Vulnerable to Injection/XSS if raw HTML or unvalidated callbacks are permitted inside configs.                        |

How do you handle conditional rendering logic and lazy loading in a Config-Driven UI system?

Handling **conditional rendering** and **lazy loading** in a Config-Driven UI system requires extending the rendering engine to evaluate dynamic rules at runtime and load components on demand without bloating the initial JavaScript bundle.

---

## 1. Handling Conditional Rendering Logic

Conditional logic in a config-driven UI allows fields or sections to dynamically show, hide, or alter properties based on user interactions (e.g., *Show "Passport Number" only if "Nationality" is NOT "Domestic"*).

### Step A: Define Expression Rules in JSON

Store conditions as declarative JSON rules using a JSON Rule Specification (like [JSON Schema Conditionals](https://json-schema.org/) or [json-rules-engine](https://github.com/CacheControl/json-rules-engine)).

```json
{
  "fields": [
    {
      "id": "hasVehicle",
      "type": "checkbox",
      "label": "Do you own a vehicle?"
    },
    {
      "id": "licensePlate",
      "type": "text",
      "label": "License Plate Number",
      "conditions": {
        "visible": {
          "field": "hasVehicle",
          "operator": "EQUALS",
          "value": true
        }
      }
    }
  ]
}

```

### Step B: Build an Evaluator Engine

Implement a deterministic condition evaluator function to check state against conditions.

```typescript
// evaluator.ts
export type RuleOperator = 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN';

export interface ConditionRule {
  field: string;
  operator: RuleOperator;
  value: any;
}

export function evaluateCondition(
  condition: ConditionRule | undefined,
  formData: Record<string, any>
): boolean {
  if (!condition) return true; // Default to visible if no condition specified

  const targetValue = formData[condition.field];

  switch (condition.operator) {
    case 'EQUALS':
      return targetValue === condition.value;
    case 'NOT_EQUALS':
      return targetValue !== condition.value;
    case 'CONTAINS':
      return Array.isArray(targetValue) && targetValue.includes(condition.value);
    case 'GREATER_THAN':
      return Number(targetValue) > Number(condition.value);
    default:
      return true;
  }
}

```

### Step C: Integrate Evaluator in Component Renderer

Evaluate the condition inside the render loop before rendering the component.

```jsx
export function ConfigFormRenderer({ schema, formData, onChange }) {
  return (
    <form>
      {schema.fields.map((field) => {
        // 1. Evaluate condition against current form state
        const isVisible = evaluateCondition(field.conditions?.visible, formData);

        // 2. Skip rendering if condition resolves to false
        if (!isVisible) return null;

        const Component = COMPONENT_REGISTRY[field.type];
        return (
          <Component
            key={field.id}
            {...field}
            value={formData[field.id]}
            onChange={(val) => onChange(field.id, val)}
          />
        );
      })}
    </form>
  );
}

```

---

## 2. Handling Lazy Loading & Code-Splitting

A common risk with Config-Driven UIs is importing **every possible component** into a single monolithic registry. If your registry maps 100 components statically, every user downloads all 100 components—even if the JSON config only uses 3.

### Step A: Define a Lazy Component Registry

Use `React.lazy()` and dynamic `import()` statements to define the registry.

```jsx
// registry.js
import React from 'react';

// Maps string keys to dynamic import functions
export const LAZY_REGISTRY = {
  text: React.lazy(() => import('./components/TextInput')),
  select: React.lazy(() => import('./components/SelectInput')),
  checkbox: React.lazy(() => import('./components/CheckboxInput')),
  richText: React.lazy(() => import('./components/RichTextEditor')), // Heavy component loaded on demand
  chart: React.lazy(() => import('./components/AnalyticsChart')), // Heavy D3/Chart.js component
};

```

### Step B: Wrap Dynamic Renders in `React.Suspense`

Wrap the renderer engine with `<React.Suspense>` and provide a fallback loading UI.

```jsx
// LazyRenderer.jsx
import React, { Suspense } from 'react';
import { LAZY_REGISTRY } from './registry';

export function ConfigDrivenLazyRenderer({ schema }) {
  return (
    <div className="config-container">
      {schema.sections.map((section, index) => {
        const DynamicComponent = LAZY_REGISTRY[section.type];

        if (!DynamicComponent) {
          console.warn(`Component type "${section.type}" not found in registry.`);
          return null;
        }

        return (
          <Suspense key={section.id || index} fallback={<ComponentSkeleton />}>
            <DynamicComponent {...section.props} />
          </Suspense>
        );
      })}
    </div>
  );
}

// Fallback loader while chunk downloads
function ComponentSkeleton() {
  return <div className="skeleton-loader" style={{ height: '40px', background: '#eee' }} />;
}

```

---

## 3. Combining Both Patterns: Complete Example

Here is a complete production pattern combining **Condition Evaluation**, **Lazy Loading**, and **Fallback Loading States**.

```jsx
import React, { useState, Suspense } from 'react';

// 1. Lazy-loaded component registry
const REGISTRY = {
  text: React.lazy(() => import('./fields/TextInput')),
  textarea: React.lazy(() => import('./fields/TextAreaInput')),
  select: React.lazy(() => import('./fields/SelectInput')),
};

// 2. Condition evaluator function
function isConditionMet(condition, state) {
  if (!condition) return true;
  const fieldValue = state[condition.field];
  if (condition.operator === 'EQUALS') return fieldValue === condition.value;
  if (condition.operator === 'NOT_EMPTY') return !!fieldValue && fieldValue.length > 0;
  return true;
}

// 3. Main Config-Driven Renderer
export function AdvancedConfigRenderer({ config }) {
  const [formState, setFormState] = useState({});

  const handleFieldChange = (fieldId, value) => {
    setFormState((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <form className="dynamic-form">
      {config.fields.map((field) => {
        // A. Condition check
        const isVisible = isConditionMet(field.conditions?.visible, formState);
        if (!isVisible) return null;

        // B. Lazy component lookup
        const Component = REGISTRY[field.type];
        if (!Component) return null;

        // C. Render with Suspense
        return (
          <Suspense key={field.id} fallback={<div className="field-loader">Loading field...</div>}>
            <Component
              {...field}
              value={formState[field.id]}
              onChange={(val) => handleFieldChange(field.id, val)}
            />
          </Suspense>
        );
      })}
    </form>
  );
}

```

---

## Summary Matrix

| Problem                        | Solution Strategy                                              | Key Advantage                                                       |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Complex Field Dependencies** | Declarative JSON Condition Rules + Runtime Evaluator           | Server controls visibility without frontend code releases.          |
| **Monolithic Bundle Size**     | `React.lazy()` + Dynamic `import()` Registry                   | Downloads only the JavaScript for components present in the config. |
| **Unrendered Asset Flash**     | Wrap dynamic nodes with `<React.Suspense>` + Skeleton Fallback | Maintains layout stability during code chunk fetching.              |

How do you handle event handling and user action callbacks safely in a Config-Driven UI system?

Handling user actions, click handlers, form submissions, and API triggers safely in a **Config-Driven UI** is one of the most critical design challenges.

Because JSON schemas are plain data formats, **you cannot pass executable JavaScript functions directly inside JSON** (doing so via `eval()` or `new Function()` creates severe **Cross-Site Scripting / XSS security risks**).

Instead, you handle events by adopting an **Action-Dispatcher Pattern**—where JSON defines **declarative action descriptors** (strings and parameters), and the frontend engine maps those descriptors to concrete JavaScript handlers.

---

## 1. High-Level Architecture: Declarative Action Dispatcher

```
+----------------------------+
|        JSON Schema         |  <-- Action Descriptor: { "action": "SUBMIT_FORM", "endpoint": "/api/user" }
+-------------+--------------+
              |
              v
+----------------------------+
|  Action Registry Handler   |  <-- Map Action Type -> Real JS Function
+-------------+--------------+
              |
              v
+----------------------------+
|  Target Execution Engine   |  <-- Executes Navigation, API Fetch, State Change, or Analytics
+----------------------------+

```

---

## 2. Step 1: Define Declarative Action Schema in JSON

Rather than passing raw code like `"onClick": () => alert('Hi')`, express actions as structured JSON objects specifying an **`action` key** and a **`payload` object**.

```json
{
  "type": "BUTTON",
  "props": {
    "label": "Save Profile",
    "variant": "primary"
  },
  "events": {
    "onClick": [
      {
        "action": "TRIGGER_API",
        "payload": {
          "endpoint": "/api/profile",
          "method": "POST"
        }
      },
      {
        "action": "SHOW_TOAST",
        "payload": {
          "message": "Profile saved successfully!",
          "type": "success"
        }
      },
      {
        "action": "NAVIGATE",
        "payload": {
          "url": "/dashboard"
        }
      }
    ]
  }
}

```

---

## 3. Step 2: Build a Safe Action Registry & Executor

Create an **Action Registry** containing pre-defined, safe JavaScript handlers. The **Action Executor** receives the action descriptors and runs them sequentially or concurrently.

```typescript
// actionRegistry.ts
import { navigateTo } from './navigationService';
import { showToast } from './toastService';
import { apiRequest } from './apiService';

export interface ActionDescriptor {
  action: string;
  payload?: Record<string, any>;
}

// 1. Map of string keys to secure JS implementation functions
const ACTION_REGISTRY: Record<
  string,
  (payload: any, context: Record<string, any>) => Promise<void> | void
> = {
  // Navigation Handler
  NAVIGATE: (payload) => {
    navigateTo(payload.url);
  },

  // Toast Alert Handler
  SHOW_TOAST: (payload) => {
    showToast(payload.message, payload.type);
  },

  // API Call Handler
  TRIGGER_API: async (payload, context) => {
    const dataToSend = payload.includeFormData ? context.formData : payload.data;
    await apiRequest(payload.endpoint, payload.method, dataToSend);
  },

  // Local State Update Handler
  UPDATE_STATE: (payload, context) => {
    if (context.setFormState) {
      context.setFormState((prev: any) => ({
        ...prev,
        [payload.key]: payload.value,
      }));
    }
  },
};

// 2. Safe Action Executor Engine
export async function executeActions(
  actions: ActionDescriptor[] | undefined,
  context: Record<string, any> = {}
) {
  if (!actions || !Array.isArray(actions)) return;

  for (const actionItem of actions) {
    const handler = ACTION_REGISTRY[actionItem.action];

    if (handler) {
      try {
        await handler(actionItem.payload || {}, context);
      } catch (err) {
        console.error(`Error executing action ${actionItem.action}:`, err);
        break; // Stop action pipeline on error
      }
    } else {
      console.warn(`Unauthorized or unknown action type: "${actionItem.action}"`);
    }
  }
}

```

---

## 4. Step 3: Connect Action Executor to UI Components

Pass event handlers down to your registered UI components.

```jsx
// ButtonComponent.jsx
import React from 'react';
import { executeActions } from './actionRegistry';

export function ConfigButton({ props, events, context }) {
  const handleClick = () => {
    // Safely execute the array of action descriptors attached to onClick
    if (events?.onClick) {
      executeActions(events.onClick, context);
    }
  };

  return (
    <button className={`btn btn-${props.variant}`} onClick={handleClick}>
      {props.label}
    </button>
  );
}

```

---

## 5. Advanced Pattern: Dynamic Variable Resolution in Payloads

Frequently, an action needs data entered into a form at runtime (e.g., sending `{"userId": "$state.currentUserId"}`).

Implement a simple **Template Variable Resolver** to replace string placeholders safely without using `eval()`:

```typescript
// resolver.ts

export function resolvePayloadVariables(
  payload: Record<string, any>,
  stateContext: Record<string, any>
): Record<string, any> {
  const resolved = { ...payload };

  for (const key in resolved) {
    const val = resolved[key];

    // If payload value is a string placeholder like "$state.email"
    if (typeof val === 'string' && val.startsWith('$state.')) {
      const stateKey = val.replace('$state.', '');
      resolved[key] = stateContext[stateKey];
    }
  }

  return resolved;
}

```

### Example Usage in Executor

```typescript
TRIGGER_API: async (payload, context) => {
  // Dynamically resolve values from form state before firing API request
  const resolvedPayload = resolvePayloadVariables(payload, context.formData);
  await apiRequest(resolvedPayload.endpoint, resolvedPayload.method, resolvedPayload);
}

```

---

## Security & Best Practices Summary

| Requirement                    | Threat / Risk                                             | Safe Design Pattern                                                                                                 |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **No Code Execution (`eval`)** | XSS attacks via malicious JSON payloads.                  | Use **Action Descriptors** mapped to an internal **Action Registry Map**.                                           |
| **Input Sanitization**         | Passing raw HTML strings inside component labels/props.   | Never render raw HTML strings directly via `dangerouslySetInnerHTML`. Sanitise using DOMPurify if HTML is required. |
| **Restricted API Endpoints**   | Users or tampered JSON triggering unauthorized endpoints. | Validate API endpoints against an **Allowed Endpoint Whitelist** inside the executor.                               |
| **Action Pipeline Failure**    | An error in action 1 corrupting state in action 2.        | Wrap individual action executions in `try/catch` blocks inside the executor loop.                                   |

How do you implement dynamic form validation using Zod or Yup in a Config-Driven UI system?

Implementing dynamic form validation using libraries like **Zod** or **Yup** in a Config-Driven UI requires converting serializable **JSON validation rules** into executable validation schemas at runtime.

Since JSON cannot store JavaScript methods (like `.min()`, `.email()`, or `.regex()`), you build a **Schema Builder Factory** that parses validation rules from your JSON config and maps them to chainable Zod/Yup methods.

---

## 1. Defining Validation Rules in JSON

Extend your component JSON schema with a `validation` object containing declarative rules:

```json
{
  "fields": [
    {
      "id": "username",
      "type": "text",
      "label": "Username",
      "validation": {
        "required": "Username is required",
        "minLength": { "value": 3, "message": "Must be at least 3 characters" },
        "regex": { "pattern": "^[a-zA-Z0-9_]+$", "message": "Only letters, numbers, and underscores allowed" }
      }
    },
    {
      "id": "email",
      "type": "text",
      "label": "Email Address",
      "validation": {
        "required": "Email is required",
        "email": "Invalid email format"
      }
    },
    {
      "id": "age",
      "type": "number",
      "label": "Age",
      "validation": {
        "min": { "value": 18, "message": "Must be at least 18 years old" }
      }
    }
  ]
}

```

---

## 2. Approach A: Dynamic Zod Schema Generator

Zod is ideal for type-safe validation and pairs cleanly with `react-hook-form` via `@hookform/resolvers/zod`.

### Step 1: Zod Schema Factory (`zodBuilder.ts`)

```typescript
import { z, ZodSchema } from 'zod';

export interface ValidationRule {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  email?: string | boolean;
  regex?: { pattern: string; message: string };
}

export interface FieldConfig {
  id: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  validation?: ValidationRule;
}

export function buildZodSchema(fields: FieldConfig[]): z.ZodObject<any> {
  const shape: Record<string, ZodSchema> = {};

  fields.forEach((field) => {
    const rules = field.validation;

    // 1. Base Zod Type Selection
    let validator: any;

    if (field.type === 'number') {
      validator = z.number({ invalid_type_error: 'Must be a number' });
    } else if (field.type === 'checkbox') {
      validator = z.boolean();
    } else {
      validator = z.string();
    }

    // 2. Chain Rules Dynamic Parser
    if (rules) {
      // String/Text Specific Validations
      if (typeof validator === 'object' && 'min' in validator) {
        if (rules.minLength) {
          validator = validator.min(rules.minLength.value, rules.minLength.message);
        }
        if (rules.maxLength) {
          validator = validator.max(rules.maxLength.value, rules.maxLength.message);
        }
        if (rules.email) {
          const message = typeof rules.email === 'string' ? rules.email : 'Invalid email';
          validator = validator.email(message);
        }
        if (rules.regex) {
          validator = validator.regex(new RegExp(rules.regex.pattern), rules.regex.message);
        }
      }

      // Numeric Validations
      if (field.type === 'number') {
        if (rules.min) {
          validator = validator.min(rules.min.value, rules.min.message);
        }
        if (rules.max) {
          validator = validator.max(rules.max.value, rules.max.message);
        }
      }

      // Required vs Optional
      if (rules.required) {
        const reqMessage = typeof rules.required === 'string' ? rules.required : 'Field is required';
        if (field.type === 'string') {
          validator = validator.min(1, reqMessage);
        }
      } else {
        validator = validator.optional();
      }
    } else {
      validator = validator.optional();
    }

    shape[field.id] = validator;
  });

  return z.object(shape);
}

```

---

## 3. Approach B: Dynamic Yup Schema Generator

If your team uses Yup, the factory pattern is nearly identical:

```typescript
import * as yup from 'yup';

export function buildYupSchema(fields: FieldConfig[]) {
  const shape: Record<string, yup.AnySchema> = {};

  fields.forEach((field) => {
    const rules = field.validation;
    let validator: yup.AnySchema;

    if (field.type === 'number') {
      validator = yup.number().typeError('Must be a number');
    } else if (field.type === 'checkbox') {
      validator = yup.boolean();
    } else {
      validator = yup.string();
    }

    if (rules) {
      if (rules.required) {
        const msg = typeof rules.required === 'string' ? rules.required : 'Required';
        validator = validator.required(msg);
      }
      if (rules.minLength && 'min' in validator) {
        validator = (validator as yup.StringSchema).min(rules.minLength.value, rules.minLength.message);
      }
      if (rules.email && 'email' in validator) {
        const msg = typeof rules.email === 'string' ? rules.email : 'Invalid email';
        validator = (validator as yup.StringSchema).email(msg);
      }
      if (rules.regex && 'matches' in validator) {
        validator = (validator as yup.StringSchema).matches(
          new RegExp(rules.regex.pattern),
          rules.regex.message
        );
      }
    }

    shape[field.id] = validator;
  });

  return yup.object().shape(shape);
}

```

---

## 4. Integration with React Hook Form

Using `useMemo` prevents rebuilds of the Zod/Yup validation schema on every render. Re-evaluate the schema only when the dynamic form config structure changes.

```tsx
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildZodSchema, FieldConfig } from './zodBuilder';

interface DynamicFormProps {
  config: {
    fields: FieldConfig[];
  };
  onSubmit: (data: any) => void;
}

export function ConfigDrivenForm({ config, onSubmit }: DynamicFormProps) {
  // 1. Generate Zod Schema dynamically when JSON config changes
  const validationSchema = useMemo(() => {
    return buildZodSchema(config.fields);
  }, [config]);

  // 2. Bind generated schema to React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur', // Validate on blur
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {config.fields.map((field) => (
        <div key={field.id} style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            {field.label}
          </label>
          
          <input
            type={field.type}
            {...register(field.id, {
              valueAsNumber: field.type === 'number',
            })}
            style={{
              padding: '8px',
              borderColor: errors[field.id] ? 'red' : '#ccc',
            }}
          />

          {/* Render Validation Error Message */}
          {errors[field.id] && (
            <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>
              {errors[field.id]?.message as string}
            </span>
          )}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}

```

---

## 5. Handling Dependent / Cross-Field Validation

For advanced scenarios like *“Confirm Password must match Password”* or *“End Date must be after Start Date”*, add custom refinement rules in JSON:

### Extended JSON Config

```json
{
  "id": "confirmPassword",
  "type": "text",
  "validation": {
    "required": "Please confirm password",
    "sameAs": { "targetField": "password", "message": "Passwords do not match" }
  }
}

```

### Extending Zod Factory with `.refine()`

```typescript
export function buildZodSchemaWithRefinements(fields: FieldConfig[]) {
  let schema = buildZodSchema(fields);

  fields.forEach((field) => {
    if (field.validation?.sameAs) {
      const { targetField, message } = field.validation.sameAs;

      schema = schema.refine((data) => data[field.id] === data[targetField], {
        message,
        path: [field.id], // Attach error to the specific field
      }) as any;
    }
  });

  return schema;
}

```

---

## Architecture Summary

| Challenge                         | Cause                                                      | Solution                                                                                    |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Non-serializable Code in JSON** | JSON cannot store JS functions like `.min()`.              | Build a **Schema Factory** that maps JSON rule keys (`minLength`) to Zod/Yup chain methods. |
| **Performance Overhead**          | Rebuilding schemas on every keypress causes lag.           | Wrap the factory execution in **`useMemo()`** dependent on `[config]`.                      |
| **Type Coercion**                 | Number inputs returning strings from native HTML elements. | Use `{ valueAsNumber: true }` in React Hook Form or Zod `z.coerce.number()`.                |
