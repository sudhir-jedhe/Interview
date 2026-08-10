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

| Challenge                         | Cause                                                       | Solution                                                                                    |
| --------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Non-serializable Code in JSON** | JSON cannot store JS functions like `.min()`.               | Build a **Schema Factory** that maps JSON rule keys (`minLength`) to Zod/Yup chain methods. |
| **Performance Overhead**          | Rebuilding schemas on every keypress causes lag.            | Wrap the factory execution in **`useMemo()`** dependent on `[config]`.                      |
| **Security Risks (`eval`)**       | Converting string code to rules using `eval()` enables XSS. | Use **RegExp constructors** and string parameter mapping instead of `eval`.                 |
| **Type Coercion**                 | Number inputs returning strings from native HTML elements.  | Use `{ valueAsNumber: true }` in React Hook Form or Zod `z.coerce.number()`.                |

Designing a **Drag-and-Drop Form Builder** that outputs a Config-Driven UI JSON schema is a classic Frontend System Design problem. It combines **state management**, **drag-and-drop primitives**, **JSON schema serialization**, and **real-time component rendering**.

---

## 1. High-Level Architecture & Data Flow

The Form Builder operates as a two-way synchronization engine between the visual UI and a central JSON Schema.

```
+-------------------+       Drag Event       +-------------------------+
|  Component Palette| ---------------------> |   Canvas / Drop Zone    |
| (Draggable Types) |                        | (Visual Render & Order) |
+-------------------+                        +------------+------------+
                                                          |
                                                    Selects Item
                                                          v
+-------------------+    Updates State       +-------------------------+
| Schema Inspector  | <--------------------- |    Properties Panel     |
| (Live JSON Preview)|                        | (Edits Labels/Rules)    |
+-------------------+                        +-------------------------+

```

### Unidirectional Data Flow

1. **Palette $\rightarrow$ Canvas:** Dropping an item adds a default schema definition to the `fields` array.
2. **Canvas $\rightarrow$ Properties Panel:** Clicking a field on the canvas sets `selectedFieldId`.
3. **Properties Panel $\rightarrow$ Store:** Modifying props (e.g., changing a label) updates the item in the `fields` array.
4. **Store $\rightarrow$ Schema Inspector / Form Preview:** The updated JSON schema re-renders the live preview instantly.

---

## 2. Core JSON Schema Output Specification

The primary deliverable of the builder is a standardized JSON schema.

```json
{
  "version": "1.0",
  "title": "User Registration",
  "fields": [
    {
      "id": "field_usr_123",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "defaultValue": "",
      "validation": {
        "required": "Full name is required",
        "minLength": { "value": 3, "message": "Min 3 characters required" }
      }
    },
    {
      "id": "field_role_456",
      "type": "select",
      "label": "Account Role",
      "options": [
        { "label": "Developer", "value": "dev" },
        { "label": "Designer", "value": "des" }
      ],
      "defaultValue": "dev"
    }
  ]
}

```

---

## 3. Store State Management (Zustand / React Context)

We use a central store to handle structural reordering, property updates, and selection state cleanly.

```typescript
// formBuilderStore.ts
import { create } from 'zustand';

export interface FieldSchema {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: Record<string, any>;
  [key: string]: any;
}

interface FormBuilderState {
  title: string;
  fields: FieldSchema[];
  selectedFieldId: string | null;
  
  // Actions
  addField: (type: string, index?: number) => void;
  removeField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  updateFieldProps: (id: string, updatedProps: Partial<FieldSchema>) => void;
  setSelectedFieldId: (id: string | null) => void;
  exportJSON: () => string;
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  title: 'Untitled Form',
  fields: [],
  selectedFieldId: null,

  addField: (type, index) => {
    const newField: FieldSchema = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      validation: {},
    };

    set((state) => {
      const updated = [...state.fields];
      const targetIndex = index ?? updated.length;
      updated.splice(targetIndex, 0, newField);
      return { fields: updated, selectedFieldId: newField.id };
    });
  },

  removeField: (id) => {
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    }));
  },

  reorderFields: (startIndex, endIndex) => {
    set((state) => {
      const result = [...state.fields];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { fields: result };
    });
  },

  updateFieldProps: (id, updatedProps) => {
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id ? { ...f, ...updatedProps } : f
      ),
    }));
  },

  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  exportJSON: () => {
    const { title, fields } = get();
    return JSON.stringify({ version: '1.0', title, fields }, null, 2);
  },
}));

```

---

## 4. Drag-and-Drop Implementation (HTML5 Drag & Drop API / `@hello-pangea/dnd`)

To keep dependencies lightweight and fully customizable, we implement HTML5 Drag & Drop primitives for **Sidebar Palette $\rightarrow$ Canvas** and reordering **Canvas Item $\rightarrow$ Canvas Item**.

### Component A: Palette Sidebar (Draggable Types)

```tsx
// Palette.tsx
import React from 'react';
import { useFormBuilderStore } from './formBuilderStore';

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input' },
  { type: 'number', label: 'Number Input' },
  { type: 'select', label: 'Dropdown Select' },
  { type: 'checkbox', label: 'Checkbox' },
];

export function Palette() {
  const addField = useFormBuilderStore((s) => s.addField);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ sourceType: 'PALETTE', type }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside style={{ width: '220px', padding: '16px', borderRight: '1px solid #ddd' }}>
      <h3>Components</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FIELD_TYPES.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => addField(item.type)} // Click-to-add fallback
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'grab',
              backgroundColor: '#fff',
            }}
          >
            + {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}

```

### Component B: Canvas Drop Zone & Reorder Listener

```tsx
// Canvas.tsx
import React, { useState } from 'react';
import { useFormBuilderStore, FieldSchema } from './formBuilderStore';

export function Canvas() {
  const { fields, selectedFieldId, addField, reorderFields, setSelectedFieldId, removeField } =
    useFormBuilderStore();
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    setDraggedOverIndex(null);

    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;

    const payload = JSON.parse(rawData);

    if (payload.sourceType === 'PALETTE') {
      // Add new field from Palette
      addField(payload.type, targetIndex);
    } else if (payload.sourceType === 'CANVAS') {
      // Reorder existing field within Canvas
      if (payload.index !== undefined && targetIndex !== undefined) {
        reorderFields(payload.index, targetIndex);
      }
    }
  };

  const handleCanvasItemDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ sourceType: 'CANVAS', index })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <main
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, fields.length)}
      style={{
        flex: 1,
        padding: '24px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <h3>Form Canvas</h3>

      {fields.length === 0 && (
        <div style={{ padding: '40px', border: '2px dashed #ccc', textAlign: 'center' }}>
          Drag components here from the palette
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fields.map((field, index) => {
          const isSelected = field.id === selectedFieldId;

          return (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleCanvasItemDragStart(e, index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOverIndex(index);
              }}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e, index);
              }}
              onClick={() => setSelectedFieldId(field.id)}
              style={{
                padding: '16px',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                boxShadow: draggedOverIndex === index ? '0 4px 0 #2563eb' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 'bold' }}>{field.label}</label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeField(field.id);
                  }}
                  style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>

              {/* Render Preview Input */}
              <input
                type={field.type}
                disabled
                placeholder={field.placeholder || `Sample ${field.type} input`}
                style={{ width: '100%', marginTop: '8px', padding: '8px' }}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}

```

---

## 5. Properties Inspector Panel

When a field is selected on the canvas, the **Properties Panel** maps its properties to form controls, enabling live schema mutations.

```tsx
// PropertiesPanel.tsx
import React from 'react';
import { useFormBuilderStore } from './formBuilderStore';

export function PropertiesPanel() {
  const { fields, selectedFieldId, updateFieldProps } = useFormBuilderStore();
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <aside style={{ width: '280px', padding: '16px', borderLeft: '1px solid #ddd' }}>
        <p style={{ color: '#666' }}>Select a field on the canvas to edit properties.</p>
      </aside>
    );
  }

  return (
    <aside style={{ width: '280px', padding: '16px', borderLeft: '1px solid #ddd' }}>
      <h3>Field Properties</h3>

      {/* Label Edit */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px' }}>Label</label>
        <input
          type="text"
          value={selectedField.label}
          onChange={(e) => updateFieldProps(selectedField.id, { label: e.target.value })}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>

      {/* Placeholder Edit */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px' }}>Placeholder</label>
        <input
          type="text"
          value={selectedField.placeholder || ''}
          onChange={(e) =>
            updateFieldProps(selectedField.id, { placeholder: e.target.value })
          }
          style={{ width: '100%', padding: '6px' }}
        />
      </div>

      {/* Validation Toggle */}
      <div style={{ marginBottom: '12px' }}>
        <label>
          <input
            type="checkbox"
            checked={!!selectedField.validation?.required}
            onChange={(e) =>
              updateFieldProps(selectedField.id, {
                validation: {
                  ...selectedField.validation,
                  required: e.target.checked ? 'This field is required' : false,
                },
              })
            }
          />
          Required Field
        </label>
      </div>
    </aside>
  );
}

```

---

## 6. Putting It Together: Form Builder Layout & JSON Exporter

```tsx
// FormBuilderApp.tsx
import React, { useState } from 'react';
import { Palette } from './Palette';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useFormBuilderStore } from './formBuilderStore';

export default function FormBuilderApp() {
  const exportJSON = useFormBuilderStore((s) => s.exportJSON);
  const [showJsonModal, setShowJsonModal] = useState(false);

  return (
    <div>
      <header
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Low-Level Design: Form Builder</h2>
        <button
          onClick={() => setShowJsonModal(true)}
          style={{
            backgroundColor: '#10B981',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export JSON Schema
        </button>
      </header>

      <div style={{ display: 'flex' }}>
        <Palette />
        <Canvas />
        <PropertiesPanel />
      </div>

      {/* Live JSON Modal Exporter */}
      {showJsonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '500px' }}>
            <h3>Generated Config-Driven JSON Schema</h3>
            <pre style={{ backgroundColor: '#eee', padding: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {exportJSON()}
            </pre>
            <button onClick={() => setShowJsonModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## Technical Edge Cases & LLD Architecture Matrix

| Challenge                          | Cause                                                                                      | Low-Level Solution                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Nested Layouts (Grids/Columns)** | Flattened array state (`fields: []`) cannot express nested row/column containers.          | Transition schema from flat array to a **Recursive Tree Node Structure** (`children: []`) and use recursive canvas renderers. |
| **Drag Hover Performance**         | Re-calculating indexes on every `dragOver` event causes layout thrashing.                  | Throttle drop target calculations using **`requestAnimationFrame`** or spatial index maps.                                    |
| **Undo / Redo History**            | Mutating schema state destroys previous steps.                                             | Wrap store actions with **Immer.js** or a **Command Pattern Stack** (`past`, `present`, `future`).                            |
| **Duplicate IDs**                  | Cloning elements without re-generating IDs breaks React key lists and form state bindings. | Always assign new UUIDs (`field_${Date.now()}_${rand}`) in the `addField` action logic.                                       |

How do you extend a Drag-and-Drop Form Builder (LLD) to support nested grid layouts and multi-column containers?

Extending a Drag-and-Drop Form Builder to support **nested grid layouts and multi-column containers** requires shifting from a simple flat array of fields (`FieldSchema[]`) to a **Recursive Tree Data Structure**.

Instead of treating every element as a standalone input field, we introduce **Container Nodes** (e.g., `Grid`, `Row`, `Column`, `Section`) that can recursively accept child nodes within a `children` array.

---

## 1. High-Level Data Model: Recursive Tree Schema

A multi-column container is defined by dividing layout width into fractional units (e.g., 12-column CSS Grid or Flexbox ratios like `span: 6` for 50% width).

### Updated JSON Schema Specification (`formSchema.json`)

```json
{
  "version": "1.0",
  "title": "Nested Layout Form",
  "children": [
    {
      "id": "container_grid_123",
      "type": "GRID",
      "props": { "columns": 2, "gap": "16px" },
      "children": [
        {
          "id": "col_1",
          "type": "COLUMN",
          "props": { "span": 1 },
          "children": [
            {
              "id": "field_fname_1",
              "type": "TEXT_INPUT",
              "props": { "label": "First Name" }
            }
          ]
        },
        {
          "id": "col_2",
          "type": "COLUMN",
          "props": { "span": 1 },
          "children": [
            {
              "id": "field_lname_2",
              "type": "TEXT_INPUT",
              "props": { "label": "Last Name" }
            }
          ]
        }
      ]
    }
  ]
}

```

---

## 2. Store & Recursive Tree Manipulation Logic

Operations like **adding**, **moving**, or **deleting** a node require traversing the tree using path identifiers or deep recursive searching.

### Tree Node Interface Definition

```typescript
// types.ts
export type NodeType = 'GRID' | 'COLUMN' | 'TEXT_INPUT' | 'NUMBER_INPUT' | 'SELECT';

export interface FormNode {
  id: string;
  type: NodeType;
  props: Record<string, any>;
  children?: FormNode[]; // Optional recursive children
}

```

### Recursive State Operations (`treeOperations.ts`)

```typescript
// Utility function to immutably insert a node into a target parent in the tree
export function insertNodeAtPath(
  tree: FormNode[],
  targetParentId: string | null, // null means root level
  newNode: FormNode,
  targetIndex: number
): FormNode[] {
  // 1. Root-level insertion
  if (targetParentId === null) {
    const updated = [...tree];
    updated.splice(targetIndex, 0, newNode);
    return updated;
  }

  // 2. Recursive depth search
  return tree.map((node) => {
    if (node.id === targetParentId) {
      const children = node.children ? [...node.children] : [];
      children.splice(targetIndex, 0, newNode);
      return { ...node, children };
    }

    if (node.children) {
      return {
        ...node,
        children: insertNodeAtPath(node.children, targetParentId, newNode, targetIndex),
      };
    }

    return node;
  });
}

// Immutable node removal
export function removeNodeById(tree: FormNode[], targetId: string): FormNode[] {
  return tree
    .filter((node) => node.id !== targetId)
    .map((node) => {
      if (node.children) {
        return { ...node, children: removeNodeById(node.children, targetId) };
      }
      return node;
    });
}

```

---

## 3. Recursive Drag-and-Drop Canvas Component

To support nesting on the canvas, components must render themselves recursively. A `Grid` component renders multiple `Column` components, and each `Column` acts as a drop zone for other fields or nested grids.

```tsx
// RecursiveCanvasNode.tsx
import React, { useState } from 'react';
import { FormNode } from './types';
import { useFormBuilderStore } from './formBuilderStore';

interface RecursiveCanvasNodeProps {
  node: FormNode;
  parentId: string | null;
  index: number;
}

export const RecursiveCanvasNode: React.FC<RecursiveCanvasNodeProps> = ({
  node,
  parentId,
  index,
}) => {
  const {
    selectedNodeId,
    setSelectedNodeId,
    removeNode,
    addNodeToParent,
    reorderNodeInParent,
  } = useFormBuilderStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const isSelected = selectedNodeId === node.id;

  // Drag handlers for Canvas Elements
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation(); // Stop bubbling to parent container
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ sourceType: 'CANVAS', nodeId: node.id, parentId, index })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;
    const payload = JSON.parse(rawData);

    if (payload.sourceType === 'PALETTE') {
      // If dropping into a Column, target this node as the parent
      const targetParentId = node.type === 'COLUMN' ? node.id : parentId;
      addNodeToParent(payload.type, targetParentId, index);
    } else if (payload.sourceType === 'CANVAS') {
      reorderNodeInParent(payload.nodeId, node.id, index);
    }
  };

  // --- 1. RENDER CONTAINER TYPES (GRID / COLUMN) ---
  if (node.type === 'GRID') {
    const columnsCount = node.props.columns || 2;
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNodeId(node.id);
        }}
        style={{
          border: isSelected ? '2px solid #2563eb' : '1px dashed #cbd5e1',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          backgroundColor: '#f8fafc',
        }}
      >
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
          Grid Container ({columnsCount} Columns)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
            gap: node.props.gap || '12px',
          }}
        >
          {node.children?.map((childNode, childIdx) => (
            <RecursiveCanvasNode
              key={childNode.id}
              node={childNode}
              parentId={node.id}
              index={childIdx}
            />
          ))}
        </div>
      </div>
    );
  }

  if (node.type === 'COLUMN') {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px solid #10b981' : '1px dashed #94a3b8',
          padding: '12px',
          minHeight: '80px',
          backgroundColor: isDragOver ? '#ecfdf5' : '#ffffff',
          borderRadius: '4px',
        }}
      >
        {node.children && node.children.length > 0 ? (
          node.children.map((childNode, childIdx) => (
            <RecursiveCanvasNode
              key={childNode.id}
              node={childNode}
              parentId={node.id}
              index={childIdx}
            />
          ))
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center' }}>
            Drop Field Here
          </div>
        )}
      </div>
    );
  }

  // --- 2. RENDER STANDARD INPUT FIELDS ---
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNodeId(node.id);
      }}
      style={{
        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
        padding: '12px',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        marginBottom: '8px',
        cursor: 'grab',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '14px', fontWeight: 600 }}>{node.props.label}</label>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNode(node.id);
          }}
          style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>
      <input
        type="text"
        disabled
        placeholder={node.props.placeholder || 'Input preview'}
        style={{ width: '100%', marginTop: '6px', padding: '6px' }}
      />
    </div>
  );
};

```

---

## 4. Automatic Column Generation Strategy

When a user drags a `Grid` container onto the canvas, the builder should **automatically generate child `Column` nodes** based on the configured column count.

```typescript
// Inside Store Action: addNodeToParent
addNodeToParent: (type, targetParentId, index) => {
  let newNode: FormNode;

  if (type === 'GRID') {
    const gridId = `grid_${Date.now()}`;
    // Auto-create 2 default Column children inside the Grid
    newNode = {
      id: gridId,
      type: 'GRID',
      props: { columns: 2, gap: '16px' },
      children: [
        { id: `col_${Date.now()}_1`, type: 'COLUMN', props: { span: 1 }, children: [] },
        { id: `col_${Date.now()}_2`, type: 'COLUMN', props: { span: 1 }, children: [] },
      ],
    };
  } else {
    newNode = {
      id: `field_${Date.now()}`,
      type: type as NodeType,
      props: { label: `New ${type}` },
    };
  }

  set((state) => ({
    tree: insertNodeAtPath(state.tree, targetParentId, newNode, index),
    selectedNodeId: newNode.id,
  }));
};

```

---

## 5. Architectural Edge Cases in Nested Canvas Builders

| Edge Case                          | Problem                                                                                                  | Low-Level Solution                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event Bubbling on Drop**         | Dropping an item inside a nested column triggers `onDrop` events on both the column AND the parent grid. | Call **`e.stopPropagation()`** inside the innermost drop target event handler.                                                               |
| **Infinite Nesting Depth**         | Dragging a Grid container into another Grid container infinitely breaks layout performance.              | Validate depth inside `handleDrop`. Restrict maximum container depth (e.g., `maxDepth = 3`).                                                 |
| **Empty Drop Zones**               | An empty column collapses to $0\text{px}$ height, making it impossible to drag items into it.            | Set **`min-height: 80px`** and explicit dashed borders on empty container elements.                                                          |
| **Broadcasting Drag Target State** | High-frequency `dragOver` events triggering state updates across the entire tree cause frame drops.      | Handle hover highlights locally within each canvas component using local React state (`isDragOver`) rather than updating global store state. |

How do you implement an Undo / Redo history state stack in a React Form Builder application?

Implementing an **Undo / Redo history state stack** in a React Form Builder requires storing snapshots of the application's schema state in a **Time-Travel Data Structure**.

Instead of manually writing undo/redo logic for every UI action (add, delete, reorder, property update), you manage state using a **History Stack Container** containing `past`, `present`, and `future` states.

---

## 1. High-Level Data Architecture

The state consists of three main parts:

* **`past`**: An array of historical state snapshots ($\text{State}_0, \text{State}_1, \dots$).
* **`present`**: The current active schema state rendered on the canvas.
* **`future`**: An array of undone state snapshots ready to be redone.

```
                  UNDO
           ┌─────────────────┐
           │                 │
           ▼                 │
     +----------+      +-----------+      +------------+
     |   PAST   |      |  PRESENT  |      |   FUTURE   |
     | [S0, S1] |      |   (S2)    |      |    [S3]    |
     +----------+      +-----------+      +------------+
                             ▲                 │
                             │                 │
                             └─────────────────┘
                                    REDO

```

### State Transitions

1. **New Action (Mutation):** Push `present` to `past`, set new state as `present`, and **clear `future**` (new mutations invalidate the redo branch).
2. **Undo Action:** Pop the last item from `past`, move current `present` to `future`, and set the popped item as `present`.
3. **Redo Action:** Pop the last item from `future`, move current `present` to `past`, and set the popped item as `present`.

---

## 2. Low-Level Store Implementation (Zustand + History Wrapper)

Below is a production-ready, custom history implementation built with **Zustand**. It manages state snapshots cleanly while enforcing a **maximum history limit** to prevent memory bloat.

### A. History Store Types & State (`useFormBuilderStore.ts`)

```typescript
import { create } from 'zustand';

// 1. Core Schema State Data
export interface FormSchemaState {
  title: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    props?: Record<string, any>;
  }>;
}

// 2. Full History Store Interface
interface FormBuilderHistoryState {
  // Snapshot Buckets
  past: FormSchemaState[];
  present: FormSchemaState;
  future: FormSchemaState[];
  
  // Selection State (Not tracked in history, so undoing doesn't break focus unnecessarily)
  selectedFieldId: string | null;

  // History Controls
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // Core Actions (Mutators)
  setPresent: (newPresent: FormSchemaState | ((prev: FormSchemaState) => FormSchemaState)) => void;
  setSelectedFieldId: (id: string | null) => void;
}

const MAX_HISTORY_LIMIT = 30; // Prevents unbounded memory growth

const INITIAL_SCHEMA: FormSchemaState = {
  title: 'Untitled Form',
  fields: [],
};

export const useFormBuilderStore = create<FormBuilderHistoryState>((set, get) => ({
  past: [],
  present: INITIAL_SCHEMA,
  future: [],
  selectedFieldId: null,

  canUndo: false,
  canRedo: false,

  // --- MUTATION ACTION WITH HISTORY RECORDING ---
  setPresent: (updater) => {
    const { past, present } = get();
    const newPresent = typeof updater === 'function' ? updater(present) : updater;

    // Prevent duplicate snapshots if state hasn't actually changed
    if (JSON.stringify(present) === JSON.stringify(newPresent)) return;

    // Maintain max history stack capacity
    const updatedPast = [...past, present].slice(-MAX_HISTORY_LIMIT);

    set({
      past: updatedPast,
      present: newPresent,
      future: [], // Clear future whenever a new action occurs
      canUndo: true,
      canRedo: false,
    });
  },

  // --- UNDO ACTION ---
  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      present: previous,
      future: [present, ...future],
      canUndo: newPast.length > 0,
      canRedo: true,
    });
  },

  // --- REDO ACTION ---
  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, present],
      present: next,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
  },

  setSelectedFieldId: (id) => set({ selectedFieldId: id }),
}));

```

---

## 3. Convenient Action Helpers

Abstract common form actions (add, delete, move, edit props) so they automatically trigger `setPresent`.

```typescript
// formActions.ts
import { useFormBuilderStore, FormSchemaState } from './useFormBuilderStore';

export const useFormActions = () => {
  const setPresent = useFormBuilderStore((s) => s.setPresent);

  const addField = (type: string, label = `New ${type}`) => {
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      label,
    };

    setPresent((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const removeField = (id: string) => {
    setPresent((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
  };

  const updateFieldLabel = (id: string, newLabel: string) => {
    setPresent((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, label: newLabel } : f)),
    }));
  };

  return { addField, removeField, updateFieldLabel };
};

```

---

## 4. Keyboard Shortcut Listener Hook (`Ctrl + Z` & `Ctrl + Y`)

Integrate global hotkeys (`Cmd/Ctrl + Z` for Undo, `Cmd/Ctrl + Y` or `Cmd/Ctrl + Shift + Z` for Redo).

```typescript
// useUndoRedoShortcuts.ts
import { useEffect } from 'react';
import { useFormBuilderStore } from './useFormBuilderStore';

export function useUndoRedoShortcuts() {
  const { undo, redo, canUndo, canRedo } = useFormBuilderStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings if the user is currently typing inside an input element
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          // Cmd + Shift + Z -> Redo
          if (canRedo) {
            e.preventDefault();
            redo();
          }
        } else {
          // Cmd + Z -> Undo
          if (canUndo) {
            e.preventDefault();
            undo();
          }
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        // Cmd + Y -> Redo
        if (canRedo) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}

```

---

## 5. Toolbar Controls Component

```tsx
// Toolbar.tsx
import React from 'react';
import { useFormBuilderStore } from './useFormBuilderStore';
import { useUndoRedoShortcuts } from './useUndoRedoShortcuts';

export const Toolbar: React.FC = () => {
  // Bind Keyboard Shortcuts
  useUndoRedoShortcuts();

  const { undo, redo, canUndo, canRedo, past, future } = useFormBuilderStore();

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '12px', borderBottom: '1px solid #ccc' }}>
      <button
        onClick={undo}
        disabled={!canUndo}
        style={{
          padding: '6px 12px',
          opacity: canUndo ? 1 : 0.5,
          cursor: canUndo ? 'pointer' : 'not-allowed',
        }}
      >
        ⎌ Undo ({past.length})
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        style={{
          padding: '6px 12px',
          opacity: canRedo ? 1 : 0.5,
          cursor: canRedo ? 'pointer' : 'not-allowed',
        }}
      >
        ⎍ Redo ({future.length})
      </button>
    </div>
  );
};

```

---

## 6. Alternative: Using Immutable Libraries (`immer` + `zundo`)

If you want to reduce boilerplate further, Zustand has an official middleware wrapper called **`zundo`** (which uses **Immer** under the hood to perform structural sharing):

```typescript
// Alternative Store using Zundo Middleware
import { create } from 'zustand';
import { temporal } from 'zundo';

interface SchemaStore {
  schema: { title: string; fields: any[] };
  addField: (field: any) => void;
}

export const useSchemaStore = create<SchemaStore>()(
  temporal(
    (set) => ({
      schema: { title: 'Untitled', fields: [] },
      addField: (field) =>
        set((state) => ({
          schema: { ...state.schema, fields: [...state.schema.fields, field] },
        })),
    }),
    { limit: 30 } // Set max history depth
  )
);

// Usage in components:
// const { undo, redo, pastStates } = useSchemaStore.temporal.getState();

```

---

## Key Edge Cases & LLD Considerations

| Problem / Challenge                    | Cause                                                                                                                                 | Low-Level Solution                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High-Frequency Input Changes**       | Updating label text on every keystroke (`onChange`) pushes 50 micro-snapshots to the history stack for a single word.                 | **Debounce history pushes** on text inputs (e.g., commit to history stack on `onBlur` or after a 500ms pause in typing).                                            |
| **Memory Growth / Garbage Collection** | Storing hundreds of deep object graphs consumes significant RAM.                                                                      | Enforce a **Maximum Stack Limit** (`MAX_HISTORY_LIMIT = 30`) and use **Structural Sharing** (like `Immer` / `zundo`) so unchanged branches share memory references. |
| **Focus Loss During Undo**             | Undoing an action replaces DOM elements, causing active input fields to lose cursor focus.                                            | Keep UI ephemeral states (like `selectedFieldId`, `hoverIndex`, `isEditing`) **outside** the history stack.                                                         |
| **Form Input Interferences**           | User presses `Ctrl + Z` inside a text field expecting native text undo, but the form builder undoes an entire field deletion instead. | Check `e.target` inside the global keyboard listener and **ignore shortcuts if target is an active `<input>` / `<textarea>**`.                                      |

How do you validate and sanitize imported JSON schemas in a Config-Driven Form Builder?

Validating and sanitizing imported JSON schemas in a Config-Driven Form Builder is critical to ensure **application security** (preventing Cross-Site Scripting / XSS and Prototype Pollution) and **runtime stability** (preventing frontend crashes caused by missing or malformed keys).

A robust Low-Level Design (LLD) pipeline processes untrusted JSON through four distinct phases:

```
[ Raw JSON String ]
         │
         ▼
 1. Safe JSON Parse & Sanitize Keys (Prevents Prototype Pollution)
         │
         ▼
 2. Strict Schema Validation (Zod / AJV Schema Validation)
         │
         ▼
 3. HTML Content Sanitization (DOMPurify for Labels / Tooltips)
         │
         ▼
 4. ID Normalization & Tree Hydration (Fixes Duplicates & Defaults)
         │
         ▼
[ Safe Internal Schema State ]

```

---

## 1. Step 1: Safe Parsing & Prototype Pollution Defense

Raw `JSON.parse()` can be exploited via **Prototype Pollution** if an attacker embeds keys like `__proto__`, `constructor`, or `prototype` in the JSON string.

### Secure JSON Parser Implementation

```typescript
// safeJsonParse.ts

// List of dangerous object prototype properties
const SUSPICIOUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Custom reviver function for JSON.parse to strip out prototype pollution vectors
 */
function safeReviver(key: string, value: any): any {
  if (SUSPICIOUS_KEYS.has(key)) {
    console.warn(`[Security Alert] Stripped suspicious key "${key}" during JSON import.`);
    return undefined; // Strips key from object
  }
  return value;
}

export function parseAndSanitizeJSON(jsonString: string): { data: any | null; error: string | null } {
  try {
    const parsed = JSON.parse(jsonString, safeReviver);
    return { data: parsed, error: null };
  } catch (err: any) {
    return { data: null, error: `Invalid JSON syntax: ${err.message}` };
  }
}

```

---

## 2. Step 2: Structural Validation with Zod

After parsing, validate that the object structure matches your builder's specifications using **Zod**. This guarantees that required fields exist and property types are accurate.

```typescript
// schemaValidator.ts
import { z } from 'zod';

// 1. Validation Rule Schema
const ValidationRulesSchema = z.object({
  required: z.union([z.boolean(), z.string()]).optional(),
  minLength: z.object({ value: z.number().min(0), message: z.string() }).optional(),
  maxLength: z.object({ value: z.number().min(1), message: z.string() }).optional(),
  min: z.object({ value: z.number(), message: z.string() }).optional(),
  max: z.object({ value: z.number(), message: z.string() }).optional(),
  email: z.union([z.boolean(), z.string()]).optional(),
  regex: z.object({ pattern: z.string(), message: z.string() }).optional(),
}).passthrough(); // Allow unknown validation flags gracefully

// 2. Base Form Field Schema (Recursive for nested structures like Grids)
export const FormNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: z.enum(['TEXT_INPUT', 'NUMBER_INPUT', 'SELECT', 'CHECKBOX', 'GRID', 'COLUMN']),
    label: z.string().default('Untitled Field'),
    placeholder: z.string().optional(),
    defaultValue: z.any().optional(),
    options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    validation: ValidationRulesSchema.optional(),
    props: z.record(z.any()).optional(),
    children: z.array(FormNodeSchema).optional(), // Recursive for Container Nodes
  })
);

// 3. Root Schema
export const ConfigDrivenFormSchema = z.object({
  version: z.string().default('1.0'),
  title: z.string().default('Untitled Form'),
  fields: z.array(FormNodeSchema),
});

export type ValidatedFormSchema = z.infer<typeof ConfigDrivenFormSchema>;

export function validateSchemaStructure(data: unknown) {
  const result = ConfigDrivenFormSchema.safeParse(data);
  if (!result.success) {
    // Format Zod error messages clearly for the user UI
    const formattedErrors = result.error.issues.map(
      (issue) => `Path "${issue.path.join('.')}": ${issue.message}`
    );
    return { isValid: false, errors: formattedErrors, data: null };
  }
  return { isValid: true, errors: [], data: result.data };
}

```

---

## 3. Step 3: XSS Defense & HTML Sanitization

If your schema supports formatted labels, tooltips, or raw HTML descriptions, an attacker could embed malicious `<script>` tags or `onload`/`onerror` handlers.

Sanitize all human-readable string values using **DOMPurify** before passing them to render engines.

```typescript
// xssSanitizer.ts
import DOMPurify from 'dompurify';
import { ValidatedFormSchema, FormNodeSchema } from './schemaValidator';

/**
 * Recursively sanitizes string values across the entire schema tree
 */
export function sanitizeSchemaStrings(node: any): any {
  if (typeof node === 'string') {
    // Sanitize string to prevent XSS injection
    return DOMPurify.sanitize(node, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'], // Allow basic safe text formatting
      ALLOWED_ATTR: ['href', 'target'],
    });
  }

  if (Array.isArray(node)) {
    return node.map(sanitizeSchemaStrings);
  }

  if (node !== null && typeof node === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(node)) {
      sanitizedObj[key] = sanitizeSchemaStrings(value);
    }
    return sanitizedObj;
  }

  return node;
}

```

---

## 4. Step 4: ID Normalization & Tree Hydration

Imported schemas might contain **duplicate IDs** (if created by copying raw JSON) or missing IDs. This breaks React key rendering and form state binding.

Hydrate the schema by regenerating duplicate IDs and ensuring all defaults exist.

```typescript
// hydrator.ts
import { ValidatedFormSchema } from './schemaValidator';

export function hydrateAndNormalizeIds(schema: ValidatedFormSchema): ValidatedFormSchema {
  const seenIds = new Set<string>();

  function processNodes(nodes: any[]): any[] {
    return nodes.map((node) => {
      let nodeCopy = { ...node };

      // Fix duplicate or empty IDs
      if (!nodeCopy.id || seenIds.has(nodeCopy.id)) {
        nodeCopy.id = `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenIds.add(nodeCopy.id);

      // Validate Regular Expressions if present
      if (nodeCopy.validation?.regex?.pattern) {
        try {
          new RegExp(nodeCopy.validation.regex.pattern); // Test if valid regex
        } catch (e) {
          console.warn(`Invalid Regex pattern "${nodeCopy.validation.regex.pattern}" removed.`);
          delete nodeCopy.validation.regex;
        }
      }

      // Process children recursively if present
      if (Array.isArray(nodeCopy.children)) {
        nodeCopy.children = processNodes(nodeCopy.children);
      }

      return nodeCopy;
    });
  }

  return {
    ...schema,
    fields: processNodes(schema.fields),
  };
}

```

---

## 5. Unified Import Service Pipeline

Combine all steps into a single importer function.

```typescript
// schemaImporterService.ts
import { parseAndSanitizeJSON } from './safeJsonParse';
import { validateSchemaStructure } from './schemaValidator';
import { sanitizeSchemaStrings } from './xssSanitizer';
import { hydrateAndNormalizeIds } from './hydrator';

export interface ImportResult {
  success: boolean;
  schema?: any;
  errors?: string[];
}

export function importAndSanitizeSchema(rawJsonString: string): ImportResult {
  // 1. Safe Parse & Prototype Pollution Check
  const { data: parsedData, error: parseError } = parseAndSanitizeJSON(rawJsonString);
  if (parseError || !parsedData) {
    return { success: false, errors: [parseError || 'Empty JSON content'] };
  }

  // 2. Zod Structural Validation
  const { isValid, errors: validationErrors, data: validatedSchema } =
    validateSchemaStructure(parsedData);
    
  if (!isValid || !validatedSchema) {
    return { success: false, errors: validationErrors };
  }

  // 3. XSS HTML Sanitization
  const xssCleanSchema = sanitizeSchemaStrings(validatedSchema);

  // 4. ID Normalization & Tree Hydration
  const finalHydratedSchema = hydrateAndNormalizeIds(xssCleanSchema);

  return {
    success: true,
    schema: finalHydratedSchema,
  };
}

```

---

## 6. React File Upload & Importer UI Component

```tsx
// SchemaImporterModal.tsx
import React, { useState } from 'react';
import { importAndSanitizeSchema } from './schemaImporterService';
import { useFormBuilderStore } from './useFormBuilderStore';

export const SchemaImporterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [errorList, setErrorList] = useState<string[]>([]);
  const setPresent = useFormBuilderStore((s) => s.setPresent);

  const handleImport = () => {
    setErrorList([]);
    const result = importAndSanitizeSchema(jsonInput);

    if (result.success && result.schema) {
      // Replace active state with sanitized schema
      setPresent(result.schema);
      onClose();
    } else {
      setErrorList(result.errors || ['Unknown validation error']);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '550px', maxWidth: '90%' }}>
        <h3>Import Config-Driven Schema JSON</h3>
        
        <input type="file" accept=".json" onChange={handleFileUpload} style={{ marginBottom: '12px' }} />

        <textarea
          rows={10}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste schema JSON here..."
          style={{ width: '100%', fontFamily: 'monospace', padding: '8px', marginBottom: '12px' }}
        />

        {errorList.length > 0 && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
            <strong style={{ color: '#991b1b' }}>Validation Errors:</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', color: '#991b1b', fontSize: '12px' }}>
              {errorList.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleImport} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
            Import & Validate
          </button>
        </div>
      </div>
    </div>
  );
};

```

---

## Technical Defense Summary

| Vulnerability / Failure Mode   | Vector                                                                      | Mitigation Strategy                                                       |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Prototype Pollution**        | Attacker embeds `__proto__` properties in JSON payload.                     | Filter suspicious keys using custom **JSON reviver** during parsing.      |
| **Malformed Schema / Crash**   | Missing `id`, `type`, or invalid enum properties causing component crashes. | Validate schema using **Zod / AJV** before loading state.                 |
| **Cross-Site Scripting (XSS)** | Injection of `<script>` or event attributes in labels/tooltips.             | Run string fields through **DOMPurify** recursively.                      |
| **Duplicate Component Keys**   | Copy-pasted JSON nodes with identical IDs breaking React DOM diffing.       | Deduplicate and re-hydrate keys with a **Set tracking lookup** step.      |
| **Invalid Regex Crash**        | Bad RegEx patterns breaking runtime validation (`new RegExp("[")`).         | Test pattern validity inside a `try/catch` block during schema hydration. |

How do you handle schema version migrations (e.g. v1 to v2) when updating a Config-Driven UI system?

Handling schema version migrations (e.g., `v1` to `v2`) in a Config-Driven UI system is critical to prevent breaking existing user data, stored form configurations, or backend APIs when your schema format evolves.

Without a migration pipeline, updating a schema definition—such as renaming `label` to `title` or restructuring layout nodes—will crash older frontend renderers or force users to manually recreate their forms.

The standard architectural solution is the **Migration Pipeline Pattern (Chain of Responsibility)**.

---

## 1. High-Level Migration Architecture

When raw JSON enters the system (via API, IndexedDB, or File Import), it passes through a **Sequential Migration Chain** before reaching the runtime renderer.

```
+------------------+     Version Check      +--------------------+
| Unmigrated JSON  | ---------------------> | Current Version?   |
|  (e.g., v1.0)    |                        | (Target: v3.0)     |
+------------------+                        +---------+----------+
                                                      |
                                           v1 < v3    | Needs Migration
                                                      v
                                            +--------------------+
                                            | Execute v1 -> v2   |
                                            +---------+----------+
                                                      |
                                                      v
                                            +--------------------+
                                            | Execute v2 -> v3   |
                                            +---------+----------+
                                                      |
                                                      v
                                            +--------------------+
                                            |  Validated v3 JSON |
                                            |  (Passed to App)   |
                                            +--------------------+

```

---

## 2. Defining Migration Step Transformers

Each version step is a pure function that takes the previous version's schema and transforms it into the next version.

### Example Scenario

* **`v1` Schema:** Uses flat arrays and separate `required` boolean flags.
* **`v2` Schema:** Renames `label` to `title` and groups all validation properties under a unified `validation` object.
* **`v3` Schema:** Introduces container support (`GRID` and `COLUMN`) and converts flat fields to recursive tree nodes.

```typescript
// migrations/types.ts

export interface BaseSchema {
  version: string;
  [key: string]: any;
}

export type MigrationFunction = (oldSchema: BaseSchema) => BaseSchema;

```

### Transformer 1: `v1` $\rightarrow$ `v2`

```typescript
// migrations/v1ToV2.ts
import { BaseSchema } from './types';

export const migrateV1ToV2: MigrationFunction = (v1Schema) => {
  const v2Fields = (v1Schema.fields || []).map((field: any) => {
    const { label, isRequired, minLen, ...rest } = field;

    return {
      ...rest,
      // Change 1: Rename 'label' to 'title'
      title: label || 'Untitled Field',

      // Change 2: Consolidate scattered validation properties into a single object
      validation: {
        ...(field.validation || {}),
        ...(isRequired ? { required: 'This field is required' } : {}),
        ...(minLen ? { minLength: { value: minLen, message: `Minimum ${minLen} characters` } } : {}),
      },
    };
  });

  return {
    ...v1Schema,
    version: '2.0', // Upgrade version tag
    fields: v2Fields,
  };
};

```

### Transformer 2: `v2` $\rightarrow$ `v3`

```typescript
// migrations/v2ToV3.ts
import { BaseSchema } from './types';

export const migrateV2ToV3: MigrationFunction = (v2Schema) => {
  // Change 3: Restructure schema root from `fields` to `children` to support tree layout
  const v3Children = (v2Schema.fields || []).map((field: any) => ({
    id: field.id || `node_${Math.random().toString(36).substr(2, 6)}`,
    type: field.type,
    props: {
      title: field.title,
      placeholder: field.placeholder,
      options: field.options,
    },
    validation: field.validation,
  }));

  const { fields, ...rest } = v2Schema;

  return {
    ...rest,
    version: '3.0', // Upgrade version tag
    children: v3Children,
  };
};

```

---

## 3. Migration Registry & Sequential Runner

Build a central registry mapping source versions to their corresponding migration functions.

```typescript
// migrations/migrationRunner.ts
import { BaseSchema, MigrationFunction } from './types';
import { migrateV1ToV2 } from './v1ToV2';
import { migrateV2ToV3 } from './v2ToV3';

// Current active system schema version
export const CURRENT_SCHEMA_VERSION = '3.0';

// Ordered map of version transitions
const MIGRATION_REGISTRY: Record<string, MigrationFunction> = {
  '1.0': migrateV1ToV2, // Upgrades 1.0 -> 2.0
  '2.0': migrateV2ToV3, // Upgrades 2.0 -> 3.0
};

export interface MigrationResult {
  success: boolean;
  schema: BaseSchema;
  migratedFromVersion?: string;
  errors?: string[];
}

export function migrateSchema(inputSchema: BaseSchema): MigrationResult {
  let currentSchema = { ...inputSchema };

  // Assume '1.0' if version string is missing
  if (!currentSchema.version) {
    currentSchema.version = '1.0';
  }

  const initialVersion = currentSchema.version;

  try {
    // Keep running migrations sequentially until current version matches system version
    while (currentSchema.version !== CURRENT_SCHEMA_VERSION) {
      const migrationFn = MIGRATION_REGISTRY[currentSchema.version];

      if (!migrationFn) {
        return {
          success: false,
          schema: inputSchema,
          errors: [`Unsupported schema version "${currentSchema.version}". Cannot migrate to "${CURRENT_SCHEMA_VERSION}".`],
        };
      }

      console.log(`Migrating schema from v${currentSchema.version}...`);
      currentSchema = migrationFn(currentSchema);
    }

    return {
      success: true,
      schema: currentSchema,
      migratedFromVersion: initialVersion !== CURRENT_SCHEMA_VERSION ? initialVersion : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      schema: inputSchema,
      errors: [`Migration failed during upgrade from v${currentSchema.version}: ${err.message}`],
    };
  }
}

```

---

## 4. Integrating Migrations into Schema Loader Pipeline

Run the migration engine **before** structural Zod/Yup validation and state hydration.

```typescript
// schemaLoader.ts
import { migrateSchema, CURRENT_SCHEMA_VERSION } from './migrations/migrationRunner';
import { validateV3Schema } from './v3SchemaValidator'; // Target V3 Zod Schema

export function loadAndMigrateSchema(rawJson: string) {
  // 1. Safe JSON Parse
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (e) {
    return { success: false, errors: ['Invalid JSON string format'] };
  }

  // 2. Run Migration Chain
  const migrationResult = migrateSchema(parsed);
  if (!migrationResult.success) {
    return { success: false, errors: migrationResult.errors };
  }

  // 3. Validate Migrated Schema against Target Version (v3 Zod Schema)
  const validationResult = validateV3Schema(migrationResult.schema);
  if (!validationResult.success) {
    return {
      success: false,
      errors: ['Migrated schema failed final v3 structural validation:', ...validationResult.errors],
    };
  }

  if (migrationResult.migratedFromVersion) {
    console.warn(`Schema was successfully migrated from v${migrationResult.migratedFromVersion} to v${CURRENT_SCHEMA_VERSION}`);
  }

  return {
    success: true,
    schema: validationResult.data,
  };
}

```

---

## 5. Handling Backward Compatibility & Persisting Upgrades

When older clients load an outdated schema, you must decide whether to save the updated schema back to the database.

### Strategy Options

| Strategy                   | Mechanism                                                                              | Pros                                                     | Cons                                                     |
| -------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| **On-the-Fly (In-Memory)** | Schema is migrated in memory at runtime upon fetch. Database remains unchanged.        | Zero risk of corrupting database records.                | Incurs small CPU cost on every load.                     |
| **Write-Back on Save**     | Schema is migrated in memory and written back to DB when the user edits and saves.     | Gradually upgrades active records in DB.                 | Inactive/archived forms remain on older schema versions. |
| **Batch DB Migration**     | A backend CLI script migrates all DB records simultaneously during release deployment. | Database stays 100% uniform; simplifies backend queries. | Requires downtime/maintenance windows for huge datasets. |

---

## Summary Matrix: Best Practices

| Best Practice            | Implementation Guideline                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Semantic Versioning**  | Use strict semver tags (`1.0`, `1.1`, `2.0`). Increment major versions for breaking structural changes.                               |
| **Atomic Transformers**  | Keep each migration function small, pure, and focused on upgrading exactly one version step (`v1 -> v2`).                             |
| **Immutable Migrations** | Never mutate input schema objects directly; return fresh copy transforms to prevent side effects.                                     |
| **Unit Testing**         | Write unit tests with real `v1`, `v2` JSON fixtures verifying that `migrateSchema(v1Fixture)` yields identical output to `v3Fixture`. |

How do you handle schema versioning and compatibility across micro-frontends in a Config-Driven UI system?

Handling schema versioning and compatibility across micro-frontends (MFEs) in a Config-Driven UI architecture introduces a unique challenge: **decoupled deployments**.

Because different micro-frontend teams (e.g., Checkout, Profile, Dashboard) deploy independent component registries at different times, a single JSON schema might be consumed by MFEs running different versions of the rendering engine or component library.

To prevent runtime crashes, white-screens, or broken UI layouts across micro-frontends, you must implement a multi-layered compatibility and version management strategy.

---

## 1. High-Level Architectural Architecture

```
                       +-----------------------------------+
                       |    Central Schema Server / CMS    |
                       |  (Emits Config JSON with Version) |
                       +-----------------+-----------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |     Host Shell Container App      |
                       |  (Schema Ingestion & Routing)     |
                       +--------+-----------------+--------+
                                |                 |
            +-------------------+                 +-------------------+
            |                                                         |
            v                                                         v
+-----------+---------------------+                 +-----------------+-------------------+
|  Micro-Frontend A (Checkout)    |                 |  Micro-Frontend B (Inventory)     |
|  - Component Registry v2.1.0    |                 |  - Component Registry v1.8.0      |
|  - Local Feature Capability Map |                 |  - Fallback / Adapters Engine     |
+---------------------------------+                 +-----------------------------------+

```

---

## 2. Core Strategies for Cross-MFE Compatibility

### Strategy 1: Semantic Versioning & Contract Capabilities

Instead of forcing every micro-frontend to update simultaneously, establish a **Shared Schema Contract** versioned via Semantic Versioning (SemVer):

* **Major (`v1.0.0` $\rightarrow$ `v2.0.0`):** Breaking structural changes (e.g., changing flat arrays to recursive trees).
* **Minor (`v1.1.0` $\rightarrow$ `v1.2.0`):** Backward-compatible new features (e.g., adding a new component type like `DATE_PICKER`).
* **Patch (`v1.1.1` $\rightarrow$ `v1.1.2`):** Non-breaking bug fixes or visual prop updates.

#### Feature Capability Checking

Micro-frontends export a **Capability Manifest** declaring which component types and schema versions they support.

```typescript
// mfeCheckoutRegistry.ts
export const MFE_CHECKOUT_CAPABILITIES = {
  mfeName: 'MFE_CHECKOUT',
  supportedSchemaVersion: '^2.0.0', // Compatible with any 2.x version
  supportedComponents: new Set([
    'TEXT_INPUT',
    'SELECT',
    'CREDIT_CARD_INPUT',
    'PAYMENT_ACCORDION', // Component unique to this MFE
  ]),
};

```

---

### Strategy 2: Defensive Rendering & Graceful Fallbacks

If an MFE receives a JSON schema containing a component type it hasn't implemented yet (e.g., MFE is on `v1.8`, but schema specifies a `v2.1` `COLOR_PICKER`), it must **never crash**.

Implement a **Fallback Component Wrapper**:

```tsx
// ComponentRegistry.tsx inside an MFE
import React, { ComponentType } from 'react';

const LOCAL_REGISTRY: Record<string, ComponentType<any>> = {
  TEXT_INPUT: React.lazy(() => import('./TextInput')),
  SELECT: React.lazy(() => import('./SelectInput')),
};

// Generic Fallback Component for unsupported types
const UnknownComponentFallback = ({ type }: { type: string }) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ border: '1px dashed orange', padding: '8px', color: 'orange' }}>
        ⚠️ Warning: Component type "{type}" is not supported by this micro-frontend version.
      </div>
    );
  }
  // In production, degrade silently or render basic input
  return null;
};

export function MfeComponentRenderer({ node }: { node: { type: string; props: any } }) {
  const Component = LOCAL_REGISTRY[node.type];

  if (!Component) {
    console.warn(`[MFE Schema Warning]: Unsupported component "${node.type}" encountered.`);
    return <UnknownComponentFallback type={node.type} />;
  }

  return <Component {...node.props} />;
}

```

---

### Strategy 3: Schema Adapters (Adapter Pattern)

When a micro-frontend receives a schema version newer than what its internal components expect, pass the schema through an **In-Memory Schema Adapter** before rendering.

```typescript
// schemaAdapters.ts

/**
 * Downgrades/Adapts v2.x JSON config to be safely consumed by a v1.x MFE component
 */
export function adaptSchemaForV1Mfe(v2SchemaNode: any): any {
  // Translate v2 'title' prop back to v1 'label' prop if MFE expects 'label'
  if (v2SchemaNode.props?.title && !v2SchemaNode.props?.label) {
    v2SchemaNode.props.label = v2SchemaNode.props.title;
  }

  // Convert unsupported complex types to basic supported types
  if (v2SchemaNode.type === 'SEARCHABLE_SELECT') {
    v2SchemaNode.type = 'SELECT'; // Fallback to standard dropdown
  }

  // Process children recursively
  if (Array.isArray(v2SchemaNode.children)) {
    v2SchemaNode.children = v2SchemaNode.children.map(adaptSchemaForV1Mfe);
  }

  return v2SchemaNode;
}

```

---

### Strategy 4: Shared Design System via Module Federation

When using **Webpack Module Federation** or **Vite Module Federation**, share the core **Schema Registry Contract** as a singleton dependency across the Shell and all micro-frontends.

```javascript
// webpack.config.js (Host Shell & Micro-frontends)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './CheckoutFormRenderer': './src/CheckoutFormRenderer',
      },
      // Share common schema contract & design system primitives
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@company/schema-contract': { singleton: true, strictVersion: false },
        '@company/design-system': { singleton: true, strictVersion: false },
      },
    }),
  ],
};

```

---

### Strategy 5: Dynamic MFE Routing Based on Schema Version

If a major schema breaking change occurs (`v1.x` $\rightarrow$ `v2.x`) and certain MFEs cannot support `v2.x` adapters, the **Host Shell** uses the schema's version header to dynamically route rendering to the appropriate remote entry build.

```tsx
// HostShellRenderer.tsx
import React, { Suspense } from 'react';

// Remote Micro-Frontend Entries
const MfeCheckoutV1 = React.lazy(() => import('mfeCheckoutV1/CheckoutFormRenderer'));
const MfeCheckoutV2 = React.lazy(() => import('mfeCheckoutV2/CheckoutFormRenderer'));

export function HostShellFormRenderer({ schema }: { schema: { version: string; data: any } }) {
  const majorVersion = schema.version.split('.')[0];

  return (
    <Suspense fallback={<div>Loading Micro-Frontend...</div>}>
      {majorVersion === '1' ? (
        // Route to legacy MFE container running v1 registry
        <MfeCheckoutV1 config={schema} />
      ) : (
        // Route to modern MFE container running v2 registry
        <MfeCheckoutV2 config={schema} />
      )}
    </Suspense>
  );
}

```

---

## Architectural Compatibility Matrix

| Scenario                                            | Risk                                                                        | Low-Level Solution                                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **New component type sent to old MFE**              | Unhandled component type causes rendering crash.                            | **Graceful Fallbacks:** Render null or default fallback wrapper; log warning.                                      |
| **Field prop renamed in new schema**                | Component receives `undefined` for required prop (e.g. `label` vs `title`). | **Adapter Pattern:** Map missing legacy props from new schema props before rendering.                              |
| **Major structural breaking change (`v1` to `v2`)** | Incompatible DOM tree structure breaks MFE layout entirely.                 | **Shell Version Routing:** Host shell delegates rendering to matching MFE remote build based on major version tag. |
| **Independent team deployments**                    | Out-of-sync component libraries across MFEs.                                | **Shared Contract Types (`npm` package or Federated Module):** Enforce SemVer interfaces via TypeScript contracts. |

How do you handle schema versioning and compatibility across micro-frontends in a Config-Driven UI system?
Handling schema versioning and compatibility across micro-frontends (MFEs) in a Config-Driven UI architecture introduces a unique challenge: **decoupled deployments**.

Because different micro-frontend teams (e.g., Checkout, Profile, Dashboard) deploy independent component registries at different times, a single JSON schema might be consumed by MFEs running different versions of the rendering engine or component library.

To prevent runtime crashes, white-screens, or broken UI layouts across micro-frontends, you must implement a multi-layered compatibility and version management strategy.

---

## 1. High-Level Architectural Architecture

```
                       +-----------------------------------+
                       |    Central Schema Server / CMS    |
                       |  (Emits Config JSON with Version) |
                       +-----------------+-----------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |     Host Shell Container App      |
                       |  (Schema Ingestion & Routing)     |
                       +--------+-----------------+--------+
                                |                 |
            +-------------------+                 +-------------------+
            |                                                         |
            v                                                         v
+-----------+---------------------+                 +-----------------+-------------------+
|  Micro-Frontend A (Checkout)    |                 |  Micro-Frontend B (Inventory)     |
|  - Component Registry v2.1.0    |                 |  - Component Registry v1.8.0      |
|  - Local Feature Capability Map |                 |  - Fallback / Adapters Engine     |
+---------------------------------+                 +-----------------------------------+

```

---

## 2. Core Strategies for Cross-MFE Compatibility

### Strategy 1: Semantic Versioning & Contract Capabilities

Instead of forcing every micro-frontend to update simultaneously, establish a **Shared Schema Contract** versioned via Semantic Versioning (SemVer):

* **Major (`v1.0.0` $\rightarrow$ `v2.0.0`):** Breaking structural changes (e.g., changing flat arrays to recursive trees).
* **Minor (`v1.1.0` $\rightarrow$ `v1.2.0`):** Backward-compatible new features (e.g., adding a new component type like `DATE_PICKER`).
* **Patch (`v1.1.1` $\rightarrow$ `v1.1.2`):** Non-breaking bug fixes or visual prop updates.

#### Feature Capability Checking

Micro-frontends export a **Capability Manifest** declaring which component types and schema versions they support.

```typescript
// mfeCheckoutRegistry.ts
export const MFE_CHECKOUT_CAPABILITIES = {
  mfeName: 'MFE_CHECKOUT',
  supportedSchemaVersion: '^2.0.0', // Compatible with any 2.x version
  supportedComponents: new Set([
    'TEXT_INPUT',
    'SELECT',
    'CREDIT_CARD_INPUT',
    'PAYMENT_ACCORDION', // Component unique to this MFE
  ]),
};

```

---

### Strategy 2: Defensive Rendering & Graceful Fallbacks

If an MFE receives a JSON schema containing a component type it hasn't implemented yet (e.g., MFE is on `v1.8`, but schema specifies a `v2.1` `COLOR_PICKER`), it must **never crash**.

Implement a **Fallback Component Wrapper**:

```tsx
// ComponentRegistry.tsx inside an MFE
import React, { ComponentType } from 'react';

const LOCAL_REGISTRY: Record<string, ComponentType<any>> = {
  TEXT_INPUT: React.lazy(() => import('./TextInput')),
  SELECT: React.lazy(() => import('./SelectInput')),
};

// Generic Fallback Component for unsupported types
const UnknownComponentFallback = ({ type }: { type: string }) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ border: '1px dashed orange', padding: '8px', color: 'orange' }}>
        ⚠️ Warning: Component type "{type}" is not supported by this micro-frontend version.
      </div>
    );
  }
  // In production, degrade silently or render basic input
  return null;
};

export function MfeComponentRenderer({ node }: { node: { type: string; props: any } }) {
  const Component = LOCAL_REGISTRY[node.type];

  if (!Component) {
    console.warn(`[MFE Schema Warning]: Unsupported component "${node.type}" encountered.`);
    return <UnknownComponentFallback type={node.type} />;
  }

  return <Component {...node.props} />;
}

```

---

### Strategy 3: Schema Adapters (Adapter Pattern)

When a micro-frontend receives a schema version newer than what its internal components expect, pass the schema through an **In-Memory Schema Adapter** before rendering.

```typescript
// schemaAdapters.ts

/**
 * Downgrades/Adapts v2.x JSON config to be safely consumed by a v1.x MFE component
 */
export function adaptSchemaForV1Mfe(v2SchemaNode: any): any {
  // Translate v2 'title' prop back to v1 'label' prop if MFE expects 'label'
  if (v2SchemaNode.props?.title && !v2SchemaNode.props?.label) {
    v2SchemaNode.props.label = v2SchemaNode.props.title;
  }

  // Convert unsupported complex types to basic supported types
  if (v2SchemaNode.type === 'SEARCHABLE_SELECT') {
    v2SchemaNode.type = 'SELECT'; // Fallback to standard dropdown
  }

  // Process children recursively
  if (Array.isArray(v2SchemaNode.children)) {
    v2SchemaNode.children = v2SchemaNode.children.map(adaptSchemaForV1Mfe);
  }

  return v2SchemaNode;
}

```

---

### Strategy 4: Shared Design System via Module Federation

When using **Webpack Module Federation** or **Vite Module Federation**, share the core **Schema Registry Contract** as a singleton dependency across the Shell and all micro-frontends.

```javascript
// webpack.config.js (Host Shell & Micro-frontends)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './CheckoutFormRenderer': './src/CheckoutFormRenderer',
      },
      // Share common schema contract & design system primitives
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@company/schema-contract': { singleton: true, strictVersion: false },
        '@company/design-system': { singleton: true, strictVersion: false },
      },
    }),
  ],
};

```

---

### Strategy 5: Dynamic MFE Routing Based on Schema Version

If a major schema breaking change occurs (`v1.x` $\rightarrow$ `v2.x`) and certain MFEs cannot support `v2.x` adapters, the **Host Shell** uses the schema's version header to dynamically route rendering to the appropriate remote entry build.

```tsx
// HostShellRenderer.tsx
import React, { Suspense } from 'react';

// Remote Micro-Frontend Entries
const MfeCheckoutV1 = React.lazy(() => import('mfeCheckoutV1/CheckoutFormRenderer'));
const MfeCheckoutV2 = React.lazy(() => import('mfeCheckoutV2/CheckoutFormRenderer'));

export function HostShellFormRenderer({ schema }: { schema: { version: string; data: any } }) {
  const majorVersion = schema.version.split('.')[0];

  return (
    <Suspense fallback={<div>Loading Micro-Frontend...</div>}>
      {majorVersion === '1' ? (
        // Route to legacy MFE container running v1 registry
        <MfeCheckoutV1 config={schema} />
      ) : (
        // Route to modern MFE container running v2 registry
        <MfeCheckoutV2 config={schema} />
      )}
    </Suspense>
  );
}

```

---

## Architectural Compatibility Matrix

| Scenario                                            | Risk                                                                        | Low-Level Solution                                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **New component type sent to old MFE**              | Unhandled component type causes rendering crash.                            | **Graceful Fallbacks:** Render null or default fallback wrapper; log warning.                                      |
| **Field prop renamed in new schema**                | Component receives `undefined` for required prop (e.g. `label` vs `title`). | **Adapter Pattern:** Map missing legacy props from new schema props before rendering.                              |
| **Major structural breaking change (`v1` to `v2`)** | Incompatible DOM tree structure breaks MFE layout entirely.                 | **Shell Version Routing:** Host shell delegates rendering to matching MFE remote build based on major version tag. |
| **Independent team deployments**                    | Out-of-sync component libraries across MFEs.                                | **Shared Contract Types (`npm` package or Federated Module):** Enforce SemVer interfaces via TypeScript contracts. |

How do you handle global state and cross-MFE communication in a Config-Driven micro-frontend architecture?
In a **Config-Driven Micro-Frontend (MFE) Architecture**, handling global state and cross-MFE communication requires a delicate balance: micro-frontends must remain **independently deployable and loosely coupled**, yet they need a standardized, reliable way to share application state (like user auth, theme, or cart state) and react to config-driven events.

Because JSON configurations define the user interface across multiple MFEs, communication must be driven by **decoupled event interfaces** rather than direct function references or shared monolithic state stores.

---

## 1. Core Architectural Options for Cross-MFE Communication

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOST SHELL CONTAINER                            │
│                                                                        │
│  ┌───────────────────────┐                  ┌───────────────────────┐  │
│  │   Micro-Frontend A    │                  │   Micro-Frontend B    │  │
│  │   (e.g., Form MFE)    │                  │   (e.g., Summary MFE) │  │
│  └───────────┬───────────┘                  └───────────▲───────────┘  │
└──────────────┼──────────────────────────────────────────┼──────────────┘
               │                                          │
               │  1. Dispatch CustomEvent                 │ 3. React to
               │     or Bus Message                       │    State Change
               ▼                                          │
┌─────────────────────────────────────────────────────────┴──────────────┐
│                  GLOBAL EVENT BUS / CUSTOM EVENT MATRIX                │
│                                                                        │
│  Event: "FIELD_CHANGED"  ──►  [ Shared State Pipeline ] ──────────────┘│
└────────────────────────────────────────────────────────────────────────┘

```

### Primary Approaches

| Approach                                 | Coupling Level | Best Used For                             | Pros                                              | Cons                                                 |
| ---------------------------------------- | -------------- | ----------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| **Native DOM Custom Events**             | Extremely Low  | Cross-MFE notifications, UI triggers      | Zero external library needed; framework-agnostic. | Harder to debug without strict TypeScript contracts. |
| **Global Event Bus (Pub/Sub)**           | Low            | Config-driven action dispatches           | Centralized logging; decoupled event payloads.    | Requires an event bus singleton layer.               |
| **Reactive Shared Store (RxJS/Zustand)** | Medium         | Real-time global data (Auth, Cart, Theme) | High performance; reactive state updates.         | Tighter coupling between MFEs and store schema.      |

---

## 2. Pattern 1: Native Window CustomEvents (Framework-Agnostic)

Native browser `CustomEvent` dispatching is the standard for zero-coupling communication. One MFE emits a custom event on `window`, and another MFE listens for it.

### Step A: Define Strict Event Payload Contracts

```typescript
// sharedEvents.ts - Published as a lightweight NPM package or Shared Contract
export interface FormFieldChangedPayload {
  formId: string;
  fieldId: string;
  value: any;
}

export enum MfeEventType {
  FORM_FIELD_CHANGED = 'mfe:form:field_changed',
  GLOBAL_STATE_UPDATED = 'mfe:global:state_updated',
}

// Helper to safely dispatch events
export function dispatchMfeEvent<T>(eventType: MfeEventType, payload: T) {
  const event = new CustomEvent(eventType, {
    detail: payload,
    bubbles: true,
    composed: true, // Penetrates Shadow DOM boundaries if Web Components are used
  });
  window.dispatchEvent(event);
}

```

### Step B: Emitting Events from a Config-Driven Component (MFE-A)

```tsx
// ConfigInputField.tsx inside Form MFE
import React from 'react';
import { dispatchMfeEvent, MfeEventType } from './sharedEvents';

export function ConfigInputField({ node, formId }: { node: any; formId: string }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Dispatch native CustomEvent for cross-MFE consumption
    dispatchMfeEvent(MfeEventType.FORM_FIELD_CHANGED, {
      formId,
      fieldId: node.id,
      value: newValue,
    });
  };

  return (
    <div>
      <label>{node.props.label}</label>
      <input type="text" onChange={handleChange} />
    </div>
  );
}

```

### Step C: Subscribing to Events in Another Micro-Frontend (MFE-B)

```tsx
// SummaryWidget.tsx inside Summary MFE
import React, { useEffect, useState } from 'react';
import { MfeEventType, FormFieldChangedPayload } from './sharedEvents';

export function SummaryWidget() {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const handleFieldChange = (event: Event) => {
      const customEvent = event as CustomEvent<FormFieldChangedPayload>;
      const { fieldId, value } = customEvent.detail;

      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    };

    // Listen to custom event on global window
    window.addEventListener(MfeEventType.FORM_FIELD_CHANGED, handleFieldChange);

    return () => {
      window.removeEventListener(MfeEventType.FORM_FIELD_CHANGED, handleFieldChange);
    };
  }, []);

  return (
    <div className="summary-card">
      <h3>Live Summary</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

```

---

## 3. Pattern 2: Shared Lightweight Reactive Store (RxJS / Zustand)

When MFEs need access to **shared global state** (like logged-in user profile, permissions, or session tokens), native events become cumbersome because late-mounting MFEs miss past events.

Use an RxJS `BehaviorSubject` or Zustand store exposed as a **Module Federation Singleton**.

### Shared Store Implementation using RxJS (`@company/global-store`)

```typescript
// globalStateStore.ts
import { BehaviorSubject, Observable } from 'rxjs';

export interface GlobalUserContext {
  userId: string | null;
  authToken: string | null;
  theme: 'light' | 'dark';
  featureFlags: Record<string, boolean>;
}

const initialContext: GlobalUserContext = {
  userId: null,
  authToken: null,
  theme: 'light',
  featureFlags: {},
};

class GlobalStateStore {
  private state$ = new BehaviorSubject<GlobalUserContext>(initialContext);

  // Observable stream for components to subscribe to
  public get stream(): Observable<GlobalUserContext> {
    return this.state$.asObservable();
  }

  // Get current snapshot instantly
  public get snapshot(): GlobalUserContext {
    return this.state$.getValue();
  }

  // Update global state
  public updateState(partialState: Partial<GlobalUserContext>) {
    this.state$.next({
      ...this.snapshot,
      ...partialState,
    });
  }
}

// Export single instance across all MFEs
export const globalStore = new GlobalStateStore();

```

### Webpack Module Federation Shared Configuration

Ensure the store is loaded as a **singleton** so all MFEs share the exact same memory reference.

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_form',
      shared: {
        '@company/global-store': {
          singleton: true,
          eager: true,
          requiredVersion: '^1.0.0',
        },
      },
    }),
  ],
};

```

---

## 4. Pattern 3: Config-Driven Event Action Dispatches

In a Config-Driven UI system, the JSON schema itself defines what event should fire when a user interacts with a component.

### JSON Schema Config Specification

```json
{
  "type": "BUTTON",
  "props": { "label": "Submit Form" },
  "events": {
    "onClick": [
      {
        "action": "EMIT_CROSS_MFE_EVENT",
        "payload": {
          "eventName": "mfe:checkout:submit",
          "data": { "source": "checkout_step_1" }
        }
      }
    ]
  }
}

```

### Config Action Executor

```typescript
// actionExecutor.ts
import { dispatchMfeEvent } from './sharedEvents';

export function executeConfigAction(actionDescriptor: any, contextData: any) {
  switch (actionDescriptor.action) {
    case 'EMIT_CROSS_MFE_EVENT':
      dispatchMfeEvent(
        actionDescriptor.payload.eventName,
        {
          ...actionDescriptor.payload.data,
          formData: contextData,
        }
      );
      break;

    case 'NAVIGATE_MFE_ROUTE':
      window.history.pushState({}, '', actionDescriptor.payload.url);
      break;

    default:
      console.warn(`Unknown action type: ${actionDescriptor.action}`);
  }
}

```

---

## 5. Security & Isolation Best Practices

1. **Namespace Event Names:** Always prefix event names with a domain or MFE namespace (e.g., `mfe:checkout:cart_updated`) to prevent event collisions between teams.
2. **Never Pass Executable Functions over Events:** Only send **serializable JSON payloads** over events. Passing callbacks across MFEs can cause severe memory leaks and cross-context crashes.
3. **Clean Up Listeners:** Always unsubscribe from custom event listeners or RxJS subscriptions inside React `useEffect` cleanups (`componentWillUnmount`).
4. **Data Isolation (PoLP):** Do not dump entire global state trees into events. Micro-frontends should only broadcast the minimum payload required for other components to function.

---

## Summary Comparison Matrix

| Problem Scenario                                | Recommended Pattern                                     | Why?                                                                  |
| ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| **Notify MFE-B when user types in MFE-A**       | Native `CustomEvent` (`window.dispatchEvent`)           | Zero library dependencies; simple decoupled messaging.                |
| **Share Auth Tokens / Theme across all MFEs**   | Shared RxJS / Zustand Singleton via Module Federation   | Allows late-mounting MFEs to read current state snapshot immediately. |
| **JSON Config triggering cross-app operations** | Declarative Action Descriptors (`EMIT_CROSS_MFE_EVENT`) | Keeps JSON schema pure and serializable while driving dynamic events. |
