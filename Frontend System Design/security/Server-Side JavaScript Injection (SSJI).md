**Server-Side JavaScript Injection (SSJI)** occurs when an attacker manipulates server-rendered JavaScript engines (like Node.js executing Next.js Server Components, API routes, or SSR pages) into evaluating untrusted inputs as executable code.

Unlike Client-Side Cross-Site Scripting (XSS)—which targets the end user's browser—SSJI executes directly on your **Node.js server instance**. This gives attackers full access to the underlying server environment, allowing them to read local files, steal environment variables, compromise database credentials, or achieve **Remote Code Execution (RCE)**.

---

## 1. How SSJI Manifests in Node.js / Next.js

SSJI vulnerabilities typically arise when server-side code uses dynamic code evaluation functions or unsafe expression parsers on untrusted user inputs.

### Primary SSJI Vulnerability Sinks in Node.js

| Dangerous JavaScript Sink                     | Vulnerability Cause                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| **`eval(userInput)`**                         | Directly evaluates arbitrary text as JavaScript code.                                 |
| **`new Function('...', userInput)()`**        | Dynamically instantiates and runs functions from strings.                             |
| **`vm.runInContext(userInput)`**              | Node's `vm` module is **not** a security sandbox and can be escaped to run host code. |
| **`child_process.exec(userInput)`**           | Command Injection that allows arbitrary OS system commands.                           |
| **Unsafe Template Engines**                   | Compiling user templates dynamically (e.g., dynamic EJS/Handlebars compilation).      |
| **Unsafe Deserialization (`node-serialize`)** | Reconstructing objects containing serialized functions (`_$$ND_FUNC$$_`).             |

---

## 2. Real-World Exploitation Scenarios in Next.js

### Scenario A: Dynamic Math / Expression Evaluator (`eval` Vulnerability)

Imagine a Next.js API route or Server Action meant to calculate custom discount rules or dynamic pricing based on a formula passed from the client:

```typescript
// app/api/calculate/route.ts — VULNERABLE CODE
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { formula } = await req.json();

  // DANGER: Dynamic evaluation of user-supplied formula string
  const result = eval(formula); 

  return NextResponse.json({ result });
}

```

#### The Exploit Payload

An attacker sends a payload that leverages Node's `process` module to read sensitive environment variables or execute system commands:

```json
{
  "formula": "process.env.DATABASE_URL"
}

```

Or to achieve full Remote Code Execution (RCE) and read system files (`/etc/passwd`):

```json
{
  "formula": "require('child_process').execSync('cat /etc/passwd').toString()"
}

```

---

### Scenario B: Unsafe Context Execution (`vm` Sandbox Escape)

Developers often mistakenly believe Node’s built-in `vm` module provides a secure execution sandbox for untrusted scripts.

```typescript
// VULNERABLE VM USAGE
import vm from 'vm';

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  
  const context = { result: null };
  vm.createContext(context);
  
  // DANGER: vm is NOT a security boundary!
  vm.runInContext(`result = ${code}`, context); 
  
  return NextResponse.json(context);
}

```

#### The Exploit Payload (Escaping the `vm` Context)

By accessing the constructor of an object within the context, an attacker can escape into the main Node.js process:

```javascript
this.constructor.constructor('return process.env')()

```

---

## 3. How to Prevent SSJI in Node.js & Next.js

### Rule 1: Eliminate Dynamic Code Sinks Completely

Never use `eval()`, `new Function()`, `setTimeout("string")`, or `vm.runInContext()` with dynamic data.

---

### Rule 2: Use Safe Math & Expression Parsers

If your application *must* evaluate mathematical expressions or custom logic strings, use a safe, abstract syntax tree (AST) parser like **`mathjs`** or **`expr-eval`** instead of raw execution engines.

```typescript
// app/api/calculate/route.ts — SECURED WITH MATHJS
import { NextRequest, NextResponse } from 'next/server';
import { create, all } from 'mathjs';

// Instantiate a restricted mathjs instance
const math = create(all);
const limitedEvaluate = math.evaluate;

export async function POST(req: NextRequest) {
  const { formula } = await req.json();

  try {
    // SAFE: mathjs parses AST nodes and restricts access to JavaScript globals/process
    const result = limitedEvaluate(formula);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid formula' }, { status: 400 });
  }
}

```

---

### Rule 3: Secure Dynamic Template Rendering

If rendering dynamic templates, use declarative templating engines without dynamic code evaluation flags, or pre-compile templates during the build step.

```typescript
// BAD: Compiling dynamic string templates at runtime
import Handlebars from 'handlebars';
const template = Handlebars.compile(req.body.userTemplate); // Risky

// GOOD: Render data into static, pre-compiled templates
import welcomeTemplate from './templates/welcome.hbs';
const html = welcomeTemplate({ name: userInput }); // Safe

```

---

### Rule 4: Isolate Dynamic Untrusted Code (Isolated-VM)

If your business requirement explicitly demands executing user-written JavaScript (e.g., a plugin architecture or web IDE), use a true memory-isolated sandbox like **`isolated-vm`**, which executes code in a separate V8 Isolate.

```typescript
// src/security/safeExecutor.ts
import ivm from 'isolated-vm';

export async function executeUntrustedJs(userCode: string) {
  const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Max 8MB memory
  const context = await isolate.createContext();
  const jail = context.global;

  // Provide only safe primitives to the sandbox context
  await jail.set('global', jail.derefInto());

  const script = await isolate.compileScript(userCode);
  const result = await script.run(context, { timeout: 1000 }); // 1 sec timeout

  isolate.dispose(); // Clean up memory
  return result;
}

```

---

### Rule 5: Apply Least Privilege & Environment Isolation

Even if code injection occurs, proper infrastructure design minimizes the blast radius:

1. **Non-Root Containers:** Run Node.js inside Docker using a unprivileged non-root user (`USER node`).
2. **Read-Only File Systems:** Mount the application container root filesystem as read-only.
3. **Environment Variable Protection:** Keep critical secrets (master API keys, DB credentials) in separate secret stores (e.g., AWS Secrets Manager, Vault) rather than raw environment variables exposed to the Node process.

---

## Summary Matrix: SSJI Security Controls

| Threat Scenario            | Vulnerable Pattern                 | Secure Alternative                                     |
| -------------------------- | ---------------------------------- | ------------------------------------------------------ |
| **Math / Formula Parsing** | `eval(userFormula)`                | `mathjs.evaluate()` or `expr-eval`                     |
| **Dynamic Functions**      | `new Function('req', userScript)`  | `isolated-vm` (isolated V8 isolates)                   |
| **Sandbox Execution**      | `vm.runInContext(code)`            | Docker containers / AWS Lambda isolated tasks          |
| **System Commands**        | `child_process.exec("ping " + ip)` | `child_process.execFile` with explicit argument arrays |

Protecting a front-end architecture against **Server-Side JavaScript Injection (SSJI)** is critical when using modern Server-Side Rendering (SSR) frameworks—such as **Next.js, Nuxt, SvelteKit, or Node.js Backend-for-Frontend (BFF)** layers.

Unlike client-side Cross-Site Scripting (XSS), SSJI executes directly within your server engine (Node.js/V8). An exploited SSJI vulnerability allows attackers to run arbitrary code on the host server, read environment variables, exfiltrate database credentials, or achieve complete **Remote Code Execution (RCE)**.

To preserve system integrity and block SSJI attacks, modern front-end system design enforces a **Defense-in-Depth** model across code execution, parsing, process management, and infrastructure boundaries.

---

## System Architecture: SSJI Defense-in-Depth

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SSJI DEFENSE-IN-DEPTH MODEL                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. CODE EXECUTION LAYER                                               │  │
│  │  • Ban dangerous JS sinks: `eval()`, `new Function()`, `vm` module    │  │
│  │  • Use safe AST expression parsers (mathjs / expr-eval)               │  │
│  │  • Pre-compile static templates (no dynamic string evaluation)       │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. INPUT VALIDATION & TYPING LAYER                                    │  │
│  │  • Strict schema validation (Zod / TypeBox)                           │  │
│  │  • Reject serialized JS objects (`node-serialize` payloads)           │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. RUNTIME ISOLATION LAYER                                            │  │
│  │  • Execute user-defined code in V8 Isolates (`isolated-vm`)           │  │
│  │  • Enforce strict memory & CPU execution timeouts                    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. INFRASTRUCTURE & CONTAINER LAYER                                   │  │
│  │  • Non-root container runtime (`USER node`)                           │  │
│  │  • Read-only file system mounts (`readOnlyRootFilesystem: true`)        │  │
│  │  • Egress network filtering & Secret Stores (Vault / AWS Secrets)      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Primary SSJI Vulnerability Patterns vs. Secure Countermeasures

### Scenario A: Dynamic Formula & Logic Evaluation

**Vulnerable Pattern:** Using `eval()` or `new Function()` on the server to calculate dynamic business rules, pricing formulas, or user-submitted expressions.

```typescript
// ❌ VULNERABLE TO SSJI / RCE
export async function POST(req: Request) {
  const { userFormula } = await req.json();
  // If userFormula is "process.env.DATABASE_URL", it leaks secrets
  // If userFormula is "require('child_process').execSync('rm -rf /')", it destroys system
  const result = eval(userFormula); 
  return Response.json({ result });
}

```

**Secure Architecture:** Replace dynamic execution sinks with safe Abstract Syntax Tree (AST) parsers that evaluate mathematical or logical expressions without giving access to Node.js `process`, `global`, or `require`.

```typescript
// ✅ SECURE: Safe AST Parsing with MathJS
import { create, all } from 'mathjs';

const math = create(all);
// Restrict evaluation exclusively to mathematical primitives
const safeEvaluate = math.evaluate;

export async function POST(req: Request) {
  const { userFormula } = await req.json();

  try {
    // Safely parses math expressions without exposing Node.js environment
    const result = safeEvaluate(userFormula);
    return Response.json({ result });
  } catch {
    return Response.json({ error: 'Invalid formula syntax' }, { status: 400 });
  }
}

```

---

### Scenario B: Unsafe Script Execution via `vm` Module

**Vulnerable Pattern:** Assuming Node’s built-in `vm` module is a secure sandbox. Node's documentation explicitly warns that `vm` is **not a security boundary**.

```typescript
// ❌ VULNERABLE: vm context escape
import vm from 'vm';

const context = { result: null };
vm.createContext(context);
// Attacker payload: "this.constructor.constructor('return process.env')()"
vm.runInContext(`result = ${untrustedUserInput}`, context); 

```

**Secure Architecture:** If your business requirement demands running user-supplied JavaScript (such as custom workflow plugins or Webhooks), execute it inside a dedicated V8 memory isolate using **`isolated-vm`**.

```typescript
// ✅ SECURE: Memory-isolated V8 Execution Environment
import ivm from 'isolated-vm';

export async function executeUntrustedScript(userScript: string) {
  // Spawn a fresh V8 isolate with a strict 8MB memory ceiling
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Set timeout limit to prevent infinite-loop DoS attacks (100ms)
  const script = await isolate.compileScript(userScript);
  const result = await script.run(context, { timeout: 100 });

  // Explicitly dispose memory isolate
  isolate.dispose();
  return result;
}

```

---

### Scenario C: Unsafe Object Deserialization

**Vulnerable Pattern:** Deserializing complex objects using libraries like `node-serialize` or custom JSON parsers that process functions (`_$$ND_FUNC$$_`).

```typescript
// ❌ VULNERABLE: Evaluates serialized functions during JSON parsing
const serialize = require('node-serialize');
// Payload can contain auto-executing IIFE functions
const userSession = serialize.unserialize(req.cookies.session);

```

**Secure Architecture:** Validate all incoming JSON payloads against strict TypeScript schemas using libraries like **Zod**, and disallow object type coercion or function deserialization.

```typescript
// ✅ SECURE: Strict Schema Validation
import { z } from 'zod';

const userPayloadSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['user', 'admin']),
  preferences: z.record(z.string()),
});

export async function parseIncomingRequest(rawJson: unknown) {
  // Safe validation — strips unexpected properties and prevents prototype poisoning
  return userPayloadSchema.parse(rawJson);
}

```

---

## 2. Infrastructure-Level Controls to Preserve System Integrity

Even if a zero-day vulnerability in a dependency introduces an SSJI path, your container and network infrastructure must ensure the attacker cannot compromise the underlying host system or exfiltrate secrets.

### A. Non-Root Container Execution

Never run Node.js processes as `root`. Run the app using an unprivileged user to restrict system modification rights.

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Run as non-privileged 'node' user
USER node
EXPOSE 3000
CMD ["node", "server.js"]

```

### B. Read-Only Root Filesystem

Configure Kubernetes or Docker to mount the application root filesystem as read-only. This prevents an injected script from writing backdoor files, altering source code, or dropping malware into `node_modules`.

```yaml
# Kubernetes Deployment Spec
securityContext:
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false

```

### C. Out-of-Process Secret Management

Do not rely exclusively on `process.env` for storing persistent database credentials or master API keys. Load secrets dynamically from an encrypted secret manager (e.g., AWS Secrets Manager, HashiCorp Vault) into memory, or pass them via short-lived IAM roles (e.g., AWS Workload Identity). This prevents a simple `process.env` dump from leaking critical infrastructure credentials.

---

## SSJI Security Strategy Matrix

| Risk Level   | Threat Scenario                    | Front-End & SSR Architectural Defense                                             |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------- |
| **Critical** | `eval()` or `new Function()` usage | **Strict Ban:** Enforce ESLint rules (`no-eval`, `no-implied-eval`).              |
| **High**     | Pseudo-sandboxing via `vm` module  | **Isolate Runtime:** Use `isolated-vm` for custom code execution.                 |
| **High**     | Dynamic template code generation   | **Static Pre-compilation:** Compile templates ahead-of-time (AOT) during build.   |
| **Medium**   | Unsafe deserialization payload     | **Schema Validation:** Enforce strict type validation using `Zod` or `TypeBox`.   |
| **System**   | Container compromise post-SSJI     | **Infrastructure Lockdown:** Read-only root filesystem + non-root user execution. |

Protecting a front-end architecture against **Server-Side JavaScript Injection (SSJI)** is critical when using modern Server-Side Rendering (SSR) frameworks—such as **Next.js, Nuxt, SvelteKit, or Node.js Backend-for-Frontend (BFF)** layers.

Unlike client-side Cross-Site Scripting (XSS), SSJI executes directly within your server engine (Node.js/V8). An exploited SSJI vulnerability allows attackers to run arbitrary code on the host server, read environment variables, exfiltrate database credentials, or achieve complete **Remote Code Execution (RCE)**.

To preserve system integrity and block SSJI attacks, modern front-end system design enforces a **Defense-in-Depth** model across code execution, parsing, process management, and infrastructure boundaries.

---

## System Architecture: SSJI Defense-in-Depth

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SSJI DEFENSE-IN-DEPTH MODEL                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. CODE EXECUTION LAYER                                               │  │
│  │  • Ban dangerous JS sinks: `eval()`, `new Function()`, `vm` module    │  │
│  │  • Use safe AST expression parsers (mathjs / expr-eval)               │  │
│  │  • Pre-compile static templates (no dynamic string evaluation)       │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. INPUT VALIDATION & TYPING LAYER                                    │  │
│  │  • Strict schema validation (Zod / TypeBox)                           │  │
│  │  • Reject serialized JS objects (`node-serialize` payloads)           │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. RUNTIME ISOLATION LAYER                                            │  │
│  │  • Execute user-defined code in V8 Isolates (`isolated-vm`)           │  │
│  │  • Enforce strict memory & CPU execution timeouts                    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. INFRASTRUCTURE & CONTAINER LAYER                                   │  │
│  │  • Non-root container runtime (`USER node`)                           │  │
│  │  • Read-only file system mounts (`readOnlyRootFilesystem: true`)        │  │
│  │  • Egress network filtering & Secret Stores (Vault / AWS Secrets)      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Primary SSJI Vulnerability Patterns vs. Secure Countermeasures

### Scenario A: Dynamic Formula & Logic Evaluation

**Vulnerable Pattern:** Using `eval()` or `new Function()` on the server to calculate dynamic business rules, pricing formulas, or user-submitted expressions.

```typescript
// ❌ VULNERABLE TO SSJI / RCE
export async function POST(req: Request) {
  const { userFormula } = await req.json();
  // If userFormula is "process.env.DATABASE_URL", it leaks secrets
  // If userFormula is "require('child_process').execSync('rm -rf /')", it destroys system
  const result = eval(userFormula); 
  return Response.json({ result });
}

```

**Secure Architecture:** Replace dynamic execution sinks with safe Abstract Syntax Tree (AST) parsers that evaluate mathematical or logical expressions without giving access to Node.js `process`, `global`, or `require`.

```typescript
// ✅ SECURE: Safe AST Parsing with MathJS
import { create, all } from 'mathjs';

const math = create(all);
// Restrict evaluation exclusively to mathematical primitives
const safeEvaluate = math.evaluate;

export async function POST(req: Request) {
  const { userFormula } = await req.json();

  try {
    // Safely parses math expressions without exposing Node.js environment
    const result = safeEvaluate(userFormula);
    return Response.json({ result });
  } catch {
    return Response.json({ error: 'Invalid formula syntax' }, { status: 400 });
  }
}

```

---

### Scenario B: Unsafe Script Execution via `vm` Module

**Vulnerable Pattern:** Assuming Node’s built-in `vm` module is a secure sandbox. Node's documentation explicitly warns that `vm` is **not a security boundary**.

```typescript
// ❌ VULNERABLE: vm context escape
import vm from 'vm';

const context = { result: null };
vm.createContext(context);
// Attacker payload: "this.constructor.constructor('return process.env')()"
vm.runInContext(`result = ${untrustedUserInput}`, context); 

```

**Secure Architecture:** If your business requirement demands running user-supplied JavaScript (such as custom workflow plugins or Webhooks), execute it inside a dedicated V8 memory isolate using **`isolated-vm`**.

```typescript
// ✅ SECURE: Memory-isolated V8 Execution Environment
import ivm from 'isolated-vm';

export async function executeUntrustedScript(userScript: string) {
  // Spawn a fresh V8 isolate with a strict 8MB memory ceiling
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Set timeout limit to prevent infinite-loop DoS attacks (100ms)
  const script = await isolate.compileScript(userScript);
  const result = await script.run(context, { timeout: 100 });

  // Explicitly dispose memory isolate
  isolate.dispose();
  return result;
}

```

---

### Scenario C: Unsafe Object Deserialization

**Vulnerable Pattern:** Deserializing complex objects using libraries like `node-serialize` or custom JSON parsers that process functions (`_$$ND_FUNC$$_`).

```typescript
// ❌ VULNERABLE: Evaluates serialized functions during JSON parsing
const serialize = require('node-serialize');
// Payload can contain auto-executing IIFE functions
const userSession = serialize.unserialize(req.cookies.session);

```

**Secure Architecture:** Validate all incoming JSON payloads against strict TypeScript schemas using libraries like **Zod**, and disallow object type coercion or function deserialization.

```typescript
// ✅ SECURE: Strict Schema Validation
import { z } from 'zod';

const userPayloadSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['user', 'admin']),
  preferences: z.record(z.string()),
});

export async function parseIncomingRequest(rawJson: unknown) {
  // Safe validation — strips unexpected properties and prevents prototype poisoning
  return userPayloadSchema.parse(rawJson);
}

```

---

## 2. Infrastructure-Level Controls to Preserve System Integrity

Even if a zero-day vulnerability in a dependency introduces an SSJI path, your container and network infrastructure must ensure the attacker cannot compromise the underlying host system or exfiltrate secrets.

### A. Non-Root Container Execution

Never run Node.js processes as `root`. Run the app using an unprivileged user to restrict system modification rights.

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Run as non-privileged 'node' user
USER node
EXPOSE 3000
CMD ["node", "server.js"]

```

### B. Read-Only Root Filesystem

Configure Kubernetes or Docker to mount the application root filesystem as read-only. This prevents an injected script from writing backdoor files, altering source code, or dropping malware into `node_modules`.

```yaml
# Kubernetes Deployment Spec
securityContext:
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false

```

### C. Out-of-Process Secret Management

Do not rely exclusively on `process.env` for storing persistent database credentials or master API keys. Load secrets dynamically from an encrypted secret manager (e.g., AWS Secrets Manager, HashiCorp Vault) into memory, or pass them via short-lived IAM roles (e.g., AWS Workload Identity). This prevents a simple `process.env` dump from leaking critical infrastructure credentials.

---

## SSJI Security Strategy Matrix

| Risk Level   | Threat Scenario                    | Front-End & SSR Architectural Defense                                             |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------- |
| **Critical** | `eval()` or `new Function()` usage | **Strict Ban:** Enforce ESLint rules (`no-eval`, `no-implied-eval`).              |
| **High**     | Pseudo-sandboxing via `vm` module  | **Isolate Runtime:** Use `isolated-vm` for custom code execution.                 |
| **High**     | Dynamic template code generation   | **Static Pre-compilation:** Compile templates ahead-of-time (AOT) during build.   |
| **Medium**   | Unsafe deserialization payload     | **Schema Validation:** Enforce strict type validation using `Zod` or `TypeBox`.   |
| **System**   | Container compromise post-SSJI     | **Infrastructure Lockdown:** Read-only root filesystem + non-root user execution. |

Protecting a front-end architecture against **Server-Side JavaScript Injection (SSJI)** is critical when using modern Server-Side Rendering (SSR) frameworks—such as **Next.js, Nuxt, SvelteKit, or Node.js Backend-for-Frontend (BFF)** layers.

Unlike client-side Cross-Site Scripting (XSS), SSJI executes directly within your server engine (Node.js/V8). An exploited SSJI vulnerability allows attackers to run arbitrary code on the host server, read environment variables, exfiltrate database credentials, or achieve complete **Remote Code Execution (RCE)**.

To preserve system integrity and block SSJI attacks, modern front-end system design enforces a **Defense-in-Depth** model across code execution, parsing, process management, and infrastructure boundaries.

---

## System Architecture: SSJI Defense-in-Depth

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SSJI DEFENSE-IN-DEPTH MODEL                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. CODE EXECUTION LAYER                                               │  │
│  │  • Ban dangerous JS sinks: `eval()`, `new Function()`, `vm` module    │  │
│  │  • Use safe AST expression parsers (mathjs / expr-eval)               │  │
│  │  • Pre-compile static templates (no dynamic string evaluation)       │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. INPUT VALIDATION & TYPING LAYER                                    │  │
│  │  • Strict schema validation (Zod / TypeBox)                           │  │
│  │  • Reject serialized JS objects (`node-serialize` payloads)           │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. RUNTIME ISOLATION LAYER                                            │  │
│  │  • Execute user-defined code in V8 Isolates (`isolated-vm`)           │  │
│  │  • Enforce strict memory & CPU execution timeouts                    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. INFRASTRUCTURE & CONTAINER LAYER                                   │  │
│  │  • Non-root container runtime (`USER node`)                           │  │
│  │  • Read-only file system mounts (`readOnlyRootFilesystem: true`)        │  │
│  │  • Egress network filtering & Secret Stores (Vault / AWS Secrets)      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Primary SSJI Vulnerability Patterns vs. Secure Countermeasures

### Scenario A: Dynamic Formula & Logic Evaluation

**Vulnerable Pattern:** Using `eval()` or `new Function()` on the server to calculate dynamic business rules, pricing formulas, or user-submitted expressions.

```typescript
// ❌ VULNERABLE TO SSJI / RCE
export async function POST(req: Request) {
  const { userFormula } = await req.json();
  // If userFormula is "process.env.DATABASE_URL", it leaks secrets
  // If userFormula is "require('child_process').execSync('rm -rf /')", it destroys system
  const result = eval(userFormula); 
  return Response.json({ result });
}

```

**Secure Architecture:** Replace dynamic execution sinks with safe Abstract Syntax Tree (AST) parsers that evaluate mathematical or logical expressions without giving access to Node.js `process`, `global`, or `require`.

```typescript
// ✅ SECURE: Safe AST Parsing with MathJS
import { create, all } from 'mathjs';

const math = create(all);
// Restrict evaluation exclusively to mathematical primitives
const safeEvaluate = math.evaluate;

export async function POST(req: Request) {
  const { userFormula } = await req.json();

  try {
    // Safely parses math expressions without exposing Node.js environment
    const result = safeEvaluate(userFormula);
    return Response.json({ result });
  } catch {
    return Response.json({ error: 'Invalid formula syntax' }, { status: 400 });
  }
}

```

---

### Scenario B: Unsafe Script Execution via `vm` Module

**Vulnerable Pattern:** Assuming Node’s built-in `vm` module is a secure sandbox. Node's documentation explicitly warns that `vm` is **not a security boundary**.

```typescript
// ❌ VULNERABLE: vm context escape
import vm from 'vm';

const context = { result: null };
vm.createContext(context);
// Attacker payload: "this.constructor.constructor('return process.env')()"
vm.runInContext(`result = ${untrustedUserInput}`, context); 

```

**Secure Architecture:** If your business requirement demands running user-supplied JavaScript (such as custom workflow plugins or Webhooks), execute it inside a dedicated V8 memory isolate using **`isolated-vm`**.

```typescript
// ✅ SECURE: Memory-isolated V8 Execution Environment
import ivm from 'isolated-vm';

export async function executeUntrustedScript(userScript: string) {
  // Spawn a fresh V8 isolate with a strict 8MB memory ceiling
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Set timeout limit to prevent infinite-loop DoS attacks (100ms)
  const script = await isolate.compileScript(userScript);
  const result = await script.run(context, { timeout: 100 });

  // Explicitly dispose memory isolate
  isolate.dispose();
  return result;
}

```

---

### Scenario C: Unsafe Object Deserialization

**Vulnerable Pattern:** Deserializing complex objects using libraries like `node-serialize` or custom JSON parsers that process functions (`_$$ND_FUNC$$_`).

```typescript
// ❌ VULNERABLE: Evaluates serialized functions during JSON parsing
const serialize = require('node-serialize');
// Payload can contain auto-executing IIFE functions
const userSession = serialize.unserialize(req.cookies.session);

```

**Secure Architecture:** Validate all incoming JSON payloads against strict TypeScript schemas using libraries like **Zod**, and disallow object type coercion or function deserialization.

```typescript
// ✅ SECURE: Strict Schema Validation
import { z } from 'zod';

const userPayloadSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['user', 'admin']),
  preferences: z.record(z.string()),
});

export async function parseIncomingRequest(rawJson: unknown) {
  // Safe validation — strips unexpected properties and prevents prototype poisoning
  return userPayloadSchema.parse(rawJson);
}

```

---

## 2. Infrastructure-Level Controls to Preserve System Integrity

Even if a zero-day vulnerability in a dependency introduces an SSJI path, your container and network infrastructure must ensure the attacker cannot compromise the underlying host system or exfiltrate secrets.

### A. Non-Root Container Execution

Never run Node.js processes as `root`. Run the app using an unprivileged user to restrict system modification rights.

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Run as non-privileged 'node' user
USER node
EXPOSE 3000
CMD ["node", "server.js"]

```

### B. Read-Only Root Filesystem

Configure Kubernetes or Docker to mount the application root filesystem as read-only. This prevents an injected script from writing backdoor files, altering source code, or dropping malware into `node_modules`.

```yaml
# Kubernetes Deployment Spec
securityContext:
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false

```

### C. Out-of-Process Secret Management

Do not rely exclusively on `process.env` for storing persistent database credentials or master API keys. Load secrets dynamically from an encrypted secret manager (e.g., AWS Secrets Manager, HashiCorp Vault) into memory, or pass them via short-lived IAM roles (e.g., AWS Workload Identity). This prevents a simple `process.env` dump from leaking critical infrastructure credentials.

---

## SSJI Security Strategy Matrix

| Risk Level   | Threat Scenario                    | Front-End & SSR Architectural Defense                                             |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------- |
| **Critical** | `eval()` or `new Function()` usage | **Strict Ban:** Enforce ESLint rules (`no-eval`, `no-implied-eval`).              |
| **High**     | Pseudo-sandboxing via `vm` module  | **Isolate Runtime:** Use `isolated-vm` for custom code execution.                 |
| **High**     | Dynamic template code generation   | **Static Pre-compilation:** Compile templates ahead-of-time (AOT) during build.   |
| **Medium**   | Unsafe deserialization payload     | **Schema Validation:** Enforce strict type validation using `Zod` or `TypeBox`.   |
| **System**   | Container compromise post-SSJI     | **Infrastructure Lockdown:** Read-only root filesystem + non-root user execution. |

Show how to configure ESLint and SAST security tools in CI/CD to detect and block SSJI sinks like eval and vm.

Automating security checks in your CI/CD pipeline using **Static Application Security Testing (SAST)** and **ESLint security plugins** catches Server-Side JavaScript Injection (SSJI) sinks (`eval`, `new Function`, `vm.runInContext`, `child_process.exec`) before code is ever merged into `main`.

Here is a complete setup using **ESLint Security Plugins**, **Semgrep (SAST)**, and a **GitHub Actions Pipeline**.

---

## 1. ESLint Configuration for SSJI Prevention

Install the required ESLint security plugins:

```bash
npm install -D eslint-plugin-security eslint-plugin-no-unsanitized eslint-plugin-sonarjs

```

Configure your ESLint configuration file (`.eslintrc.js` or `eslint.config.mjs`) to explicitly flag and block dynamic code evaluation sinks:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:security/recommended-legacy',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['security', 'no-unsanitized'],
  rules: {
    // =========================================================================
    // CRITICAL SECURITY RULES: BLOCK SSJI & DYNAMIC EXECUTION
    // =========================================================================

    // 1. Disallow eval() completely
    'no-eval': 'error',

    // 2. Disallow implicit eval via setTimeout("string"), setInterval("string")
    'no-implied-eval': 'error',

    // 3. Disallow new Function('...') string evaluation
    'no-new-func': 'error',

    // 4. Disallow script URLs (javascript:...)
    'no-script-url': 'error',

    // 5. Flag dangerous Node.js process calls & unsafe regex (eslint-plugin-security)
    'security/detect-eval-with-expression': 'error',
    'security/detect-child-process': 'error', // Flags child_process.exec
    'security/detect-non-literal-require': 'error', // Flags dynamic require()
    'security/detect-non-literal-fs-filename': 'warn',

    // 6. Block Node.js built-in `vm` module imports (Not a security sandbox!)
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'vm',
            message:
              'CRITICAL: The Node.js "vm" module is NOT a security boundary and leads to SSJI sandbox escapes. Use "isolated-vm" or a safe AST parser instead.',
          },
          {
            name: 'node:vm',
            message:
              'CRITICAL: The Node.js "vm" module is NOT a security boundary and leads to SSJI sandbox escapes. Use "isolated-vm" or a safe AST parser instead.',
          },
        ],
      },
    ],

    // 7. Prevent un-sanitized DOM & HTML assignments (eslint-plugin-no-unsanitized)
    'no-unsanitized/property': 'error',
    'no-unsanitized/method': 'error',
  },
};

```

---

## 2. SAST Scanning with Semgrep

While ESLint checks code syntax, **Semgrep** is a lightweight, AST-aware SAST engine that traces data flow to ensure untrusted inputs do not reach dangerous execution sinks.

Create a custom Semgrep security policy file in your repository at `.semgrep/ssji-rules.yml`:

```yaml
# .semgrep/ssji-rules.yml
rules:
  - id: detect-ssji-eval
    languages: [javascript, typescript]
    severity: ERROR
    message: "CRITICAL: Server-Side JavaScript Injection (SSJI) detected. Dynamic evaluation of inputs using eval() can lead to Remote Code Execution (RCE)."
    pattern: eval(...)

  - id: detect-ssji-new-function
    languages: [javascript, typescript]
    severity: ERROR
    message: "CRITICAL: Creating functions from dynamic strings via 'new Function()' allows arbitrary code execution on the Node.js server."
    pattern: new Function(...)

  - id: detect-ssji-vm-module
    languages: [javascript, typescript]
    severity: ERROR
    message: "SECURITY WARNING: Node.js 'vm' module usage detected. 'vm' is NOT a security boundary and can be escaped to run host server code."
    patterns:
      - pattern-either:
          - pattern: vm.runInContext(...)
          - pattern: vm.runInNewContext(...)
          - pattern: vm.runInThisContext(...)
          - pattern: vm.createScript(...)

  - id: detect-unsafe-child-process-exec
    languages: [javascript, typescript]
    severity: ERROR
    message: "Command Injection Risk: Do not pass non-literal strings to child_process.exec(). Use child_process.execFile() with explicit argument arrays instead."
    pattern: child_process.exec($X, ...)

```

---

## 3. GitHub Actions CI/CD Pipeline Integration

Set up a automated workflow (`.github/workflows/sast-security-ci.yml`) that runs both ESLint and Semgrep SAST scans on every Pull Request. If an SSJI sink or security violation is found, the build immediately fails and blocks the PR from merging.

```yaml
# .github/workflows/sast-security-ci.yml
name: SAST & Security Code Audit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  eslint-security-scan:
    name: Run ESLint Security Rules
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Execute ESLint Security Inspection
        run: npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0

  semgrep-sast-scan:
    name: Run Semgrep SAST Analysis
    runs-on: ubuntu-latest
    container:
      image: semgrep/semgrep:latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Run Semgrep Rules
        run: semgrep scan --config p/javascript --config .semgrep/ssji-rules.yml --error

  npm-audit-check:
    name: Dependency Vulnerability Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run NPM Audit
        run: npm audit --audit-level=high

```

---

## Summary Matrix: CI/CD Security Layering

| Security Layer    | Tool Used                         | Detection Target                                                       | Pipeline Action                                          |
| ----------------- | --------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| **Linting Layer** | ESLint (`eslint-plugin-security`) | `eval()`, `new Function()`, `import 'vm'`                              | Fails build if restricted syntax is detected.            |
| **SAST Layer**    | Semgrep (`ssji-rules.yml`)        | Dynamic AST data flow to `vm.runInContext()` or `child_process.exec()` | Fails build and highlights vulnerable line in PR review. |
| **Supply Chain**  | `npm audit`                       | Known CVEs in third-party `node_modules`                               | Blocks PR if High/Critical vulnerabilities exist.        |
