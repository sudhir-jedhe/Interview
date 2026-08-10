In Front-End System Design, **Input Validation** and **Input Sanitization** serve two completely different security and operational purposes:

* **Input Validation:** Checks whether the user's input matches expected criteria (data type, length, format, allowed characters). Its primary role on the front end is **UX feedback**, reducing unnecessary network traffic, and enforcing data integrity before sending requests.
* **Output Sanitization / DOM Cleaning:** Removes or encodes potentially dangerous executable code (like `<script>` tags, inline event handlers like `onload`, or `javascript:` pseudoprotocols) **before** data is rendered into the DOM. This is your primary client-side defense against Cross-Site Scripting (XSS).

> **Golden Rule of Front-End Security:** Client-side validation is a **usability control, not a security boundary**. Attackers can easily bypass front-end validation using tools like cURL, Postman, or Burp Suite. True input validation must always be enforced on the backend server. However, **front-end output sanitization and DOM context encoding are mandatory** to protect users when rendering data.

---

## 1. Input Validation vs. Output Sanitization Architecture

```
[ User Input / Form Field ]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Client-Side Input Validation (UX Boundary)                │
│  - Schema Validation (Zod / Yup)                            │
│  - Type Checking, Format Verification, Range Boundaries     │
│  - Rejects malformed requests before network hit            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Network Transmission                                     │
│  - Transmitted via JSON / HTTPS                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend Processing & Server-Side Validation              │
│  - Strict Data Validation & Persistence                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Client-Side Rendering & Output Sanitization (Security)   │
│  - Auto-Escaping Template Engines (React JSX / Vue)         │
│  - DOMPurify Sanitization for Dynamic HTML                  │
│  - Trusted Types API (Enforces safe DOM sinks)              │
└─────────────────────────────────────────────────────────────┘

```

---

## 2. Practical Code Example: Front-End Validation & Sanitization

Below is a complete TypeScript/React implementation demonstrating **Client-Side Validation (Zod)** combined with **Safe DOM Rendering and Sanitization (DOMPurify + Trusted Types)**.

### Step A: Schema-Based Input Validation (`userSchema.ts`)

Use schema validation libraries like **Zod** to validate structures, formats, and character bounds before making network requests.

```typescript
// src/schemas/userSchema.ts
import { z } from 'zod';

export const commentFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username contains invalid characters'),
  
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .max(100, 'Email too long'),

  // Allow rich text content, but validate length
  commentText: z
    .string()
    .trim()
    .min(5, 'Comment must be at least 5 characters')
    .max(2000, 'Comment exceeds maximum length'),
});

export type CommentFormInput = z.infer<typeof commentFormSchema>;

```

---

### Step B: DOM Sanitization Setup (`trustedSanitizer.ts`)

When rendering dynamic user content (like Markdown or rich text comments), pass raw inputs through **DOMPurify** paired with the browser's native **Trusted Types API**.

```typescript
// src/security/trustedSanitizer.ts
import DOMPurify from 'dompurify';

// Initialize a Trusted Types policy for safe DOM assignments
export const domSanitizerPolicy = window.trustedTypes?.createPolicy('appSanitizer', {
  createHTML: (rawHtml: string) => {
    // Strip malicious tags, attributes, and script protocols
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'a', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false, // Disallow data-* attributes to prevent attribute injection
    });
  },
});

export const sanitizeContent = (rawContent: string): string => {
  if (domSanitizerPolicy) {
    return domSanitizerPolicy.createHTML(rawContent) as unknown as string;
  }
  // Fallback for browsers without native Trusted Types support
  return DOMPurify.sanitize(rawContent);
};

```

---

### Step C: React Component Integration (`CommentComponent.tsx`)

```tsx
// src/components/CommentComponent.tsx
import React, { useState } from 'react';
import { commentFormSchema, CommentFormInput } from '../schemas/userSchema';
import { sanitizeContent } from '../security/trustedSanitizer';

export const CommentComponent: React.FC = () => {
  const [formData, setFormData] = useState<CommentFormInput>({
    username: '',
    email: '',
    commentText: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postedComments, setPostedComments] = useState<Array<{ username: string; html: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. INPUT VALIDATION STEP
    const validationResult = commentFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0].toString()] = err.message;
      });
      setErrors(formattedErrors);
      return; // Abort submission locally
    }

    setErrors({});
    const validData = validationResult.data;

    // 2. SANITIZATION STEP (Before rendering rich text into the DOM)
    const cleanHTML = sanitizeContent(validData.commentText);

    setPostedComments((prev) => [
      ...prev,
      { username: validData.username, html: cleanHTML },
    ]);

    setFormData({ username: '', email: '', commentText: '' });
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <textarea
            placeholder="Write a comment..."
            value={formData.commentText}
            onChange={(e) => setFormData({ ...formData, commentText: e.target.value })}
          />
          {errors.commentText && <span className="error">{errors.commentText}</span>}
        </div>

        <button type="submit">Submit Comment</button>
      </form>

      <hr />

      <h3>Comments</h3>
      {postedComments.map((comment, idx) => (
        <div key={idx} className="comment-card">
          {/* Default JSX bindings auto-escape raw text variables */}
          <h4>User: {comment.username}</h4>

          {/* 3. SAFE DOM INSERTION using sanitized Trusted Types / DOMPurify string */}
          <div dangerouslySetInnerHTML={{ __html: comment.html }} />
        </div>
      ))}
    </div>
  );
};

```

---

## 3. Defense-in-Depth Strategy for Front-End Inputs

| Layer / Mechanism                 | Purpose                                                                                                  | Threat Prevented                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Schema Validation (Zod)**       | Rejects invalid types, strings, and lengths on the client.                                               | Malformed payloads, unnecessary API load.                          |
| **Framework Auto-Escaping**       | Renders variables as plain text node strings (`{userInput}`) rather than raw HTML.                       | Reflected & Stored XSS.                                            |
| **DOMPurify**                     | Strips dangerous tags (`<script>`, `<iframe>`, `<object>`) and event attributes (`onerror=`, `onload=`). | DOM-Based XSS & HTML Injection.                                    |
| **Trusted Types API**             | Forces all string writes to DOM sinks (`innerHTML`, `script.src`) to pass through an approved policy.    | Accidental bypasses of sanitization in developer code.             |
| **Content Security Policy (CSP)** | Restricts script execution origins and blocks inline script evaluation (`'unsafe-inline'`).              | Catches un-sanitized scripts that manage to slip past DOM filters. |
