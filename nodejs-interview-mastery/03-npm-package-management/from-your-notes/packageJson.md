# package.json, npm & Node Modules – Interview Questions and Answers

As a full-stack developer using **Node.js, Express, MongoDB, and React**, these are among the most frequently asked interview topics. Your own project experience includes Node.js and Express-based REST APIs. [\[Sudhir Jedhe 2 \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7BF58C5747-96DD-4F3E-BB6A-900C2EBA385C%7D&file=Sudhir%20Jedhe%202.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Sudhir_Jed..._Optimized \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B6D62BFD5-1C8F-43D9-B7DD-A310E3955486%7D&file=Sudhir_Jedhe_3Page_Recruiter_Optimized.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# package.json Interview Questions

## 1. What is package.json?

`package.json` is the heart of every Node.js project.

It contains:

```text
Project Metadata
Dependencies
Scripts
Version Information
Configuration
```

Example:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js"
}
```

The file commonly contains fields such as `name`, `version`, `main`, `scripts`, `dependencies`, and `devDependencies`. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Propeller%20Group%201/codebase/corporate-learning-system-main/frontend/node_modules/is-core-module/package.json?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/socket.io/package.json?web=1)

***

## 2. Why is package.json Important?

Without package.json:

```text
No dependency tracking

No scripts

No version control
```

Benefits:

```text
Easy project setup

Dependency management

CI/CD support

Environment consistency
```

***

## 3. Difference Between package.json and package-lock.json?

### package.json

Contains:

```json
{
  "express": "^4.18.2"
}
```

Version range allowed.

***

### package-lock.json

Contains:

```json
{
  "express": "4.18.2"
}
```

Exact version.

Purpose:

```text
Consistent installs
```

***

## 4. What are Scripts in package.json?

Example:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}
```

Run:

```bash
npm start
npm run dev
npm test
```

Many package.json files define scripts such as `test`, `lint`, `build`, and `prepublishOnly`. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Propeller%20Group%201/codebase/corporate-learning-system-main/frontend/node_modules/is-core-module/package.json?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/socket.io/package.json?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/url-parse/package.json?web=1)

***

## 5. What are Dependencies?

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Installed in production.

***

## 6. What are devDependencies?

```json
{
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

Only required during development.

Examples:

```text
Jest
ESLint
Prettier
Typescript
```

Package manifests typically separate `dependencies` and `devDependencies`. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Propeller%20Group%201/codebase/corporate-learning-system-main/frontend/node_modules/is-core-module/package.json?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/xmlhttprequest-ts/package.json?web=1)

***

## 7. Difference Between:

```json
^4.18.2
```

and

```json
~4.18.2
```

### Caret (^)

```text
Allows minor updates
```

```text
4.18.2 → 4.x.x
```

***

### Tilde (\~)

```text
Allows patch updates only
```

```text
4.18.2 → 4.18.x
```

***

# npm Interview Questions

## 8. What is npm?

npm stands for:

```text
Node Package Manager
```

Used for:

```text
Installing packages
Managing versions
Running scripts
Publishing packages
```

***

## 9. Difference Between npm install and npm ci

### npm install

```bash
npm install
```

Installs dependencies.

May update lock file.

***

### npm ci

```bash
npm ci
```

Used in:

```text
CI/CD Pipelines
GitHub Actions
Jenkins
Azure DevOps
```

Benefits:

```text
Faster

Clean Install

Uses package-lock.json
```

***

## 10. Difference Between

### Local Install

```bash
npm install express
```

Installed:

```text
node_modules
```

***

### Global Install

```bash
npm install -g nodemon
```

Available system-wide.

***

## 11. What is npx?

Executes packages without global installation.

```bash
npx create-react-app myapp
```

Benefits:

```text
No global install needed
Latest version execution
```

***

## 12. What Happens When npm install Runs?

Steps:

```text
Read package.json

Resolve dependencies

Download packages

Create node_modules

Update package-lock.json
```

***

## 13. What is Semantic Versioning?

Format:

```text
MAJOR.MINOR.PATCH

1.2.3
```

### Major

```text
Breaking Changes
```

### Minor

```text
New Features
```

### Patch

```text
Bug Fix
```

***

# Node Module Interview Questions

## 14. What is a Module in Node.js?

A module is reusable code.

Three Types:

```text
Core Module

Local Module

Third Party Module
```

***

## 15. Core Modules

Built into Node.

Examples:

```javascript
const fs = require("fs");

const path = require("path");

const http = require("http");
```

***

## 16. Local Modules

### math.js

```javascript
function add(a, b) {
  return a + b;
}

module.exports = {
  add
};
```

### app.js

```javascript
const math =
  require("./math");

console.log(
  math.add(2, 3)
);
```

***

## 17. What is module.exports?

Exports functions from a module.

```javascript
module.exports = {
  add,
  subtract
};
```

***

## 18. Difference Between exports and module.exports

### exports

Shortcut.

```javascript
exports.add = add;
```

***

### module.exports

Main export object.

```javascript
module.exports = add;
```

Interview Tip:

```text
Avoid mixing them.
```

***

## 19. What is CommonJS?

Node's traditional module system.

```javascript
require()

module.exports
```

***

## 20. What is ES Module?

Modern module system.

```javascript
import fs from "fs";

export default app;
```

package.json:

```json
{
  "type": "module"
}
```

***

## 21. Module Caching (Favourite Interview Question)

### Question

What happens if the same module is imported twice?

```javascript
require("./math");
require("./math");
```

### Answer

Node loads it once.

Then:

```text
Caches Module
```

Future imports use cache.

Benefits:

```text
Performance Improvement
```

***

## 22. How to Clear Module Cache?

```javascript
delete require.cache[
 require.resolve("./math")
];
```

***

## Scenario-Based Questions

### Q1

> Express is installed but not appearing in package.json. Why?

```bash
npm install express --no-save
```

or

manually removed.

***

### Q2

> Project works on your machine but fails on another machine.

Check:

```text
package-lock.json

node version

environment variables
```

***

### Q3

> node\_modules deleted accidentally.

Solution:

```bash
npm install
```

Restores all dependencies from package.json.

***

### Q4

> Team members use different versions of a package.

Solution:

```text
package-lock.json

npm ci
```

***

# Most Asked Interview Questions

```text
✅ package.json

✅ package-lock.json

✅ Dependencies vs DevDependencies

✅ npm vs npx

✅ npm install vs npm ci

✅ Semantic Versioning

✅ CommonJS vs ES Modules

✅ module.exports

✅ exports

✅ Core Modules

✅ Local Modules

✅ Module Caching

✅ Scripts in package.json
```

# Senior-Level Interview Answer

> `package.json` defines project metadata, scripts, and dependency management. npm uses it to install and manage packages. Node.js modules allow code reusability through CommonJS (`require`, `module.exports`) or ES Modules (`import`, `export`). In enterprise applications, I use package-lock.json for deterministic builds, npm ci in CI/CD pipelines, semantic versioning for dependency control, and modular architecture to keep services maintainable and scalable. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Propeller%20Group%201/codebase/corporate-learning-system-main/frontend/node_modules/is-core-module/package.json?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/socket.io/package.json?web=1), [\[AI_Intevie...n_00003247 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Pranita%20Mahajan_00003247.pdf?web=1)


These three topics are **very frequently asked in Node.js interviews**, especially for **5–10+ years Full Stack (React + Node.js)** roles.

***

# 1. npm Scripts Explained with Examples

## What Are npm Scripts?

`npm scripts` are commands defined inside `package.json`.

They automate repetitive tasks such as:

```text
✅ Start Application
✅ Run Tests
✅ Build Project
✅ Lint Code
✅ Run Development Server
✅ Deploy Application
```

Example:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

***

## Running Scripts

### Start Application

```bash
npm start
```

Runs:

```bash
node app.js
```

***

### Development Mode

```bash
npm run dev
```

Runs:

```bash
nodemon app.js
```

Benefits:

```text
Auto Restart Server
```

***

### Testing

```bash
npm test
```

Runs:

```bash
jest
```

***

## Real Project Example

```json
{
  "scripts": {

    "start": "node server.js",

    "dev": "nodemon server.js",

    "test": "jest",

    "build": "webpack",

    "lint": "eslint src",

    "format": "prettier --write ."
  }
}
```

***

## Pre and Post Scripts

npm automatically executes:

### Example

```json
{
  "scripts": {
    "prestart": "npm run build",
    "start": "node app.js"
  }
}
```

Execution:

```text
prestart
↓
start
```

***

## Senior Interview Question

### Why Use npm Scripts?

Answer:

```text
Automation

Consistency

CI/CD Integration

Developer Productivity
```

***

# 2. CommonJS vs ES Modules

Node.js supports two module systems.

***

# CommonJS

Traditional Node.js module system.

### Export

```javascript
// math.js

function add(a, b) {
  return a + b;
}

module.exports = {
  add
};
```

***

### Import

```javascript
const math =
  require("./math");

console.log(
  math.add(2, 3)
);
```

***

## Characteristics

```text
require()

module.exports

Synchronous Loading
```

***

# ES Modules (ESM)

Modern JavaScript module system.

### Export

```javascript
export function add(a, b) {
  return a + b;
}
```

***

### Import

```javascript
import {
  add
} from "./math.js";
```

***

### Enable

package.json

```json
{
  "type": "module"
}
```

***

# CommonJS vs ES Modules

| Feature         | CommonJS       | ES Module       |
| --------------- | -------------- | --------------- |
| Import          | require()      | import          |
| Export          | module.exports | export          |
| Loading         | Synchronous    | Static Analysis |
| Browser Support | No             | Yes             |
| Tree Shaking    | No             | Yes             |
| Modern Standard | No             | Yes             |

***

## Interview Question

### Why is ES Module Preferred?

```text
Tree Shaking

Better Optimization

Standard JavaScript

Browsers Support It
```

***

# Real Example

## CommonJS

```javascript
const express =
  require("express");
```

***

## ES Module

```javascript
import express
from "express";
```

***

# Senior Interview Answer

> CommonJS is Node.js's traditional module system using require and module.exports. ES Modules use import/export syntax and support static analysis, tree shaking, and better optimization. Modern projects increasingly prefer ES Modules because they align with browser standards and modern JavaScript tooling.

***

# 3. How Module Caching Improves Performance

This is one of the most commonly asked Node.js internals questions.

***

# What Happens Without Caching?

Suppose:

```javascript
const math =
  require("./math");
```

Every import would:

```text
Read File
Compile Code
Execute Code
Return Module
```

Doing this repeatedly is expensive.

***

# What Node Actually Does

### First Import

```javascript
const math =
  require("./math");
```

Node:

```text
Load File
Compile
Execute
Store in Cache
```

***

### Second Import

```javascript
const math2 =
  require("./math");
```

Node:

```text
Directly Return Cached Copy
```

No recompilation.

***

# Example

### counter.js

```javascript
console.log(
  "Module Loaded"
);

module.exports = {};
```

***

### app.js

```javascript
require("./counter");

require("./counter");

require("./counter");
```

Output:

```text
Module Loaded
```

Only once.

***

# Why Is This Faster?

Without cache:

```text
Disk I/O
Compilation
Execution
```

Every time.

***

With cache:

```text
Memory Lookup
```

Only.

Much faster.

***

# Check Cache

```javascript
console.log(
  require.cache
);
```

***

# Clear Cache

```javascript
delete require.cache[
  require.resolve("./math")
];
```

Used in:

```text
Testing
Hot Reloading
Development Tools
```

***

# Real Production Scenario

Suppose:

```javascript
Database Config
Logger
Redis Client
AWS SDK
```

If every API request reloaded these:

```text
Huge Performance Cost
```

Because of cache:

```text
Loaded Once

Shared Across Requests
```

***

# Interview Question

### Are Modules Singleton in Node.js?

Mostly yes.

Because:

```text
Module Loaded Once

Cached

Shared Across Imports
```

Example:

```javascript
const db1 =
  require("./db");

const db2 =
  require("./db");
```

Both reference the same cached module instance.

***

# Senior-Level Interview Answer

> Node.js caches modules after their first load. When a module is required multiple times, Node returns the cached instance instead of reading and executing the file again. This reduces disk I/O, compilation overhead, and startup time, significantly improving application performance. Module caching also enables singleton patterns for shared resources such as database connections, loggers, Redis clients, and configuration objects.


# npm Lifecycle Scripts Explained

npm lifecycle scripts are special scripts that run automatically before or after certain npm commands.

They are commonly used for:

```text
✅ Build Automation
✅ Testing
✅ Linting
✅ Validation
✅ Packaging
✅ Deployment Preparation
```

Many package.json files use lifecycle hooks such as `prepack`, `prepublishOnly`, `pretest`, `posttest`, and `postversion`. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# How Lifecycle Scripts Work

For any script:

```text
pre<script>
<script>
post<script>
```

npm automatically executes them in order.

Example:

```json
{
  "scripts": {
    "prestart": "echo Building...",
    "start": "node app.js",
    "poststart": "echo App Started"
  }
}
```

Running:

```bash
npm start
```

Execution order:

```text
1. prestart
2. start
3. poststart
```

Output:

```text
Building...
App Started
```

***

# Common Lifecycle Scripts

## 1. preinstall

Runs before:

```bash
npm install
```

Example:

```json
{
  "scripts": {
    "preinstall": "echo Before Install"
  }
}
```

***

## 2. install

Runs during installation.

```json
{
  "scripts": {
    "install": "node setup.js"
  }
}
```

***

## 3. postinstall

Runs after installation.

Example:

```json
{
  "scripts": {
    "postinstall": "echo Install Complete"
  }
}
```

Common use:

```text
Generate files
Build native modules
Initialise configuration
```

***

## 4. pretest / test / posttest

Example:

```json
{
  "scripts": {
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo Tests Complete"
  }
}
```

Execution:

```bash
npm test
```

Order:

```text
pretest
↓
test
↓
posttest
```

Lifecycle hooks such as `pretest`, `test`, and `posttest` are used in real npm packages. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

## 5. prepack

Runs before:

```bash
npm pack
```

or

```bash
npm publish
```

Example:

```json
{
  "scripts": {
    "prepack": "npm run build"
  }
}
```

Real package manifests commonly use a `prepack` hook to compile/build artefacts before packaging. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

## 6. prepublishOnly

Runs only before publishing.

```json
{
  "scripts": {
    "prepublishOnly":
      "npm run test"
  }
}
```

Purpose:

```text
Run tests
Run linting
Validate package
```

before publishing to npm.

This hook appears in package manifests found in enterprise files. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

## 7. version / postversion

Used during release automation.

Example:

```json
{
  "scripts": {
    "version":
      "npm run changelog",
    "postversion":
      "git push --tags"
  }
}
```

Some package manifests use `version` and `postversion` hooks for changelog and Git tag updates. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# Real Production Example

```json
{
  "scripts": {

    "pretest": "eslint .",

    "test": "jest",

    "posttest": "npm run coverage",

    "prebuild": "npm run clean",

    "build": "webpack",

    "postbuild": "npm run deploy"
  }
}
```

Pipeline:

```text
Lint
 ↓
Test
 ↓
Coverage
 ↓
Build
 ↓
Deploy
```

***

# Interview Questions

## What is the difference between pretest and test?

### pretest

Runs automatically before:

```bash
npm test
```

### test

Actual test execution.

***

## What is prepublishOnly used for?

Used to ensure:

```text
Tests Pass
Lint Passes
Build Succeeds
```

before publishing a package. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

## Difference Between prepack and prepublishOnly?

### prepack

```text
Before packaging
```

Runs on:

```bash
npm pack
npm publish
```

***

### prepublishOnly

```text
Only before publish
```

Runs on:

```bash
npm publish
```

***

## What Lifecycle Scripts Are Common in CI/CD?

```text
pretest
test
posttest
prebuild
build
prepublishOnly
postversion
```

***

# Senior Interview Answer

> npm lifecycle scripts are automatic hooks that run before or after npm commands. They help automate tasks such as linting, testing, building, packaging, and deployment. For example, when `npm test` is executed, npm automatically runs `pretest`, then `test`, then `posttest`. In enterprise applications, lifecycle scripts are frequently used to enforce code quality checks, automate CI/CD workflows, generate build artefacts, and validate packages before publishing. Many production packages use hooks such as `prepack`, `prepublishOnly`, `pretest`, and `postversion` to automate these processes. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)


# npm Lifecycle Scripts – Examples, Debugging & CI/CD Use Cases

Lifecycle scripts are special npm hooks that execute automatically before or after a command. Common hooks include `pretest`, `posttest`, `prepack`, `prepublishOnly`, and `postversion`. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# 1. Examples of Pre and Post Lifecycle Scripts

## Example 1: prestart and poststart

### package.json

```json
{
  "scripts": {
    "prestart": "echo Building application...",
    "start": "node server.js",
    "poststart": "echo Server started successfully"
  }
}
```

Run:

```bash
npm start
```

Execution order:

```text
prestart
↓
start
↓
poststart
```

Output:

```text
Building application...
Server started successfully
```

***

## Example 2: pretest and posttest

```json
{
  "scripts": {
    "pretest": "eslint src",
    "test": "jest",
    "posttest": "echo Test completed"
  }
}
```

Run:

```bash
npm test
```

Execution:

```text
Lint Code
↓
Run Tests
↓
Success Message
```

***

## Example 3: prebuild and postbuild

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "webpack",
    "postbuild": "node scripts/deploy.js"
  }
}
```

Flow:

```text
Clean Old Files
↓
Build App
↓
Deploy Build
```

***

## Example 4: prepublishOnly

```json
{
  "scripts": {
    "prepublishOnly": "npm test"
  }
}
```

When:

```bash
npm publish
```

npm automatically runs:

```text
Test
↓
Publish
```

This hook is commonly used before package publication. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# 2. How to Debug npm Lifecycle Scripts

## Method 1: Run Script Directly

Instead of:

```bash
npm test
```

Run:

```bash
npm run pretest
```

or

```bash
npm run build
```

to isolate failures.

***

## Method 2: Enable Verbose Logging

```bash
npm run build --verbose
```

or

```bash
npm install --verbose
```

Shows detailed execution logs.

***

## Method 3: Add Debug Logs

Example:

```json
{
  "scripts": {
    "build": "echo Starting build && webpack"
  }
}
```

Output:

```text
Starting build
```

Useful for finding where execution stops.

***

## Method 4: Check Environment Variables

```json
{
  "scripts": {
    "debug-env": "node -e \"console.log(process.env.NODE_ENV)\""
  }
}
```

Run:

```bash
npm run debug-env
```

***

## Method 5: Exit Codes

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

If Jest fails:

```text
Exit Code = 1
```

CI pipeline fails immediately.

***

## Method 6: Run with npm\_config\_loglevel

```bash
npm run build --loglevel verbose
```

Provides additional npm diagnostics.

***

# Common Lifecycle Script Issues

## Issue 1: Script Not Found

```bash
npm ERR! missing script: build
```

Check:

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

***

## Issue 2: Dependency Missing

```bash
webpack: command not found
```

Fix:

```bash
npm install webpack --save-dev
```

***

## Issue 3: Permission Problems (Linux/Mac)

```bash
chmod +x script.sh
```

***

# 3. Lifecycle Scripts in CI/CD

Lifecycle scripts are heavily used in build pipelines.

***

# Example CI Pipeline

### package.json

```json
{
  "scripts": {
    "lint": "eslint src",
    "test": "jest",
    "build": "webpack"
  }
}
```

Pipeline:

```text
Code Commit
↓
Lint
↓
Test
↓
Build
↓
Deploy
```

***

# CI/CD Use Case 1: Code Quality Enforcement

```json
{
  "scripts": {
    "pretest": "eslint src",
    "test": "jest"
  }
}
```

Output:

```text
Bad Code
↓
Pipeline Stops
```

Prevents broken code deployment.

***

# CI/CD Use Case 2: Automated Testing

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Every pull request:

```text
Run Tests
↓
Approve PR
```

***

# CI/CD Use Case 3: Build Verification

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

Ensures:

```text
Application Compiles
```

before deployment.

***

# CI/CD Use Case 4: Publish Validation

```json
{
  "scripts": {
    "prepublishOnly": "npm test"
  }
}
```

Flow:

```text
Run Tests
↓
Publish Package
```

Commonly used in npm package publishing workflows. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# CI/CD Use Case 5: Release Automation

```json
{
  "scripts": {
    "version": "npm run changelog",
    "postversion": "git push --tags"
  }
}
```

Automates:

```text
Version Updates
Git Tags
Release Notes
```

Lifecycle hooks such as `version` and `postversion` are present in real package configurations. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# Real Enterprise Example

```json
{
  "scripts": {

    "pretest": "eslint src",

    "test": "jest",

    "posttest": "npm run coverage",

    "prebuild": "rimraf dist",

    "build": "webpack",

    "postbuild": "npm run deploy"
  }
}
```

Flow:

```text
Lint
↓
Unit Tests
↓
Coverage Report
↓
Clean Build
↓
Compile
↓
Deploy
```

***

# Senior Interview Answer

> npm lifecycle scripts are automated hooks that run before or after npm commands. Typical examples include `pretest`, `posttest`, `prebuild`, `postbuild`, `prepack`, and `prepublishOnly`. They help automate validation, testing, building, packaging, and deployment processes. In CI/CD pipelines, lifecycle scripts ensure code quality by running lint checks, automated tests, build verification, coverage reports, and release tasks before code reaches production. Hooks such as `prepack`, `prepublishOnly`, `pretest`, and `postversion` are commonly used to automate package validation and release workflows. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)


# More npm Lifecycle Script Examples

For senior Node.js interviews, interviewers often ask **real-world lifecycle automation scenarios** rather than definitions.

***

# Example 1: Automatic Lint → Test → Build

### package.json

```json
{
  "scripts": {
    "prebuild": "npm run lint && npm run test",

    "build": "webpack",

    "postbuild": "echo Build completed"
  }
}
```

Run:

```bash
npm run build
```

Execution:

```text
Lint
 ↓
Test
 ↓
Build
 ↓
Success Message
```

***

# Example 2: Database Migration Before Start

```json
{
  "scripts": {
    "prestart": "node migrate-db.js",

    "start": "node server.js"
  }
}
```

Flow:

```text
Run Migration
 ↓
Start Application
```

Useful in:

```text
Microservices
Production Deployments
```

***

# Example 3: Generate Environment Configs

```json
{
  "scripts": {
    "predev": "node scripts/config.js",

    "dev": "nodemon server.js"
  }
}
```

Flow:

```text
Generate Config
 ↓
Start Dev Server
```

***

# Example 4: Security Scan Before Deployment

```json
{
  "scripts": {
    "predeploy": "npm audit",

    "deploy": "node deploy.js"
  }
}
```

Flow:

```text
Security Check
 ↓
Deployment
```

***

# Example 5: Docker Build Automation

```json
{
  "scripts": {
    "predocker": "npm run test",

    "docker": "docker build -t app ."
  }
}
```

Flow:

```text
Test
 ↓
Docker Build
```

***

# Example 6: Git Hooks + npm Scripts

```json
{
  "scripts": {
    "precommit": "npm run lint",

    "commit": "git commit"
  }
}
```

Prevent:

```text
Bad Code
Broken Formatting
```

from entering repository.

***

# How to Handle Errors in Lifecycle Scripts

## Pattern 1: Stop Pipeline on Failure

```json
{
  "scripts": {
    "build": "eslint . && jest && webpack"
  }
}
```

Behavior:

```text
ESLint Fails
 ↓
Stop Execution
```

***

## Pattern 2: Custom Error Message

```json
{
  "scripts": {
    "test": "jest || echo \"Tests Failed\""
  }
}
```

Output:

```text
Tests Failed
```

***

## Pattern 3: Explicit Exit Code

```javascript
if(!configExists){

  console.error(
    "Missing Config"
  );

  process.exit(1);
}
```

CI/CD systems rely on:

```text
Exit Code 0 → Success

Exit Code 1 → Failure
```

***

## Pattern 4: Error Handling Script

```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

```javascript
try {

  build();

} catch(err) {

  console.error(err);

  process.exit(1);

}
```

Recommended for:

```text
Custom Build Tools
Deployment Scripts
Migration Scripts
```

***

## Pattern 5: Fail Fast

Bad:

```json
{
  "build":
    "eslint .; jest; webpack"
}
```

All commands run.

***

Good:

```json
{
  "build":
    "eslint . && jest && webpack"
}
```

Stops immediately on failure.

***

# Best Practices for Lifecycle Scripts in CI/CD

## 1. Keep Scripts Small

Bad:

```json
{
  "build":
    "1000 line bash script"
}
```

Good:

```json
{
  "build":
    "node scripts/build.js"
}
```

***

## 2. Fail Fast

```json
{
  "test":
    "eslint . && jest"
}
```

Immediate feedback.

***

## 3. Use npm ci in Pipelines

Instead of:

```bash
npm install
```

Use:

```bash
npm ci
```

Benefits:

```text
Faster

Deterministic

Uses package-lock.json
```

***

## 4. Separate Build and Deploy

Bad:

```json
{
  "build":
    "webpack && aws deploy"
}
```

Good:

```json
{
  "build":"webpack",

  "deploy":"aws deploy"
}
```

Easier debugging.

***

## 5. Add Logging

```json
{
  "build":
    "echo Starting Build && webpack"
}
```

Helpful in:

```text
GitHub Actions

Jenkins

Azure DevOps
```

***

## 6. Use Environment Variables

```json
{
  "build":
    "NODE_ENV=production webpack"
}
```

Avoid hardcoding.

***

## 7. Run Security Checks

```json
{
  "predeploy":
    "npm audit"
}
```

Checks vulnerabilities before release.

***

## 8. Enforce Quality Gates

```json
{
  "prebuild":
    "eslint src",

  "pretest":
    "npm run lint"
}
```

Flow:

```text
Lint
 ↓
Test
 ↓
Build
 ↓
Deploy
```

***

# Real Enterprise CI/CD Flow

```json
{
  "scripts": {

    "lint": "eslint src",

    "test": "jest",

    "coverage": "jest --coverage",

    "build": "webpack",

    "security": "npm audit",

    "deploy": "node deploy.js"
  }
}
```

Pipeline:

```text
Developer Push
 ↓
Lint
 ↓
Unit Test
 ↓
Coverage Check
 ↓
Security Scan
 ↓
Build
 ↓
Deploy
```

***

# Frequently Asked Interview Questions

### What happens if prebuild fails?

```text
build is NOT executed
```

***

### Can postbuild run if build fails?

```text
No
```

***

### Why use lifecycle scripts instead of manual execution?

```text
Automation

Consistency

CI/CD Integration

Reduced Human Errors
```

***

### Why use npm scripts over shell scripts?

```text
Cross-platform

Easy to Maintain

Built into npm

Version Controlled
```

# Senior-Level Interview Answer

> In enterprise CI/CD pipelines, lifecycle scripts automate quality checks and deployments. I typically use `pretest` for linting, `test` for Jest execution, `prebuild` for validation, `build` for packaging, and `predeploy` for security scanning. Scripts should be small, fail fast, provide meaningful logs, use environment variables, and return proper exit codes so CI systems such as GitHub Actions, Jenkins, and Azure DevOps can reliably detect failures and stop deployments.


# npm Lifecycle Scripts for Deployment

In real-world CI/CD pipelines, lifecycle scripts are often used to validate, test, build, package, and deploy applications automatically. Common lifecycle hooks used in package manifests include `pretest`, `prepack`, `prepublishOnly`, `version`, and `postversion`. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# Example 1: Deployment Pipeline

```json
{
  "scripts": {

    "predeploy": "npm run test && npm run build",

    "deploy": "node scripts/deploy.js",

    "postdeploy": "echo Deployment completed"
  }
}
```

Run:

```bash
npm run deploy
```

Flow:

```text
Run Tests
 ↓
Build Application
 ↓
Deploy
 ↓
Success Notification
```

***

# Example 2: AWS Deployment

```json
{
  "scripts": {

    "predeploy":
      "npm run lint && npm run test",

    "deploy":
      "aws s3 sync dist s3://my-app",

    "postdeploy":
      "echo Production deployment complete"
  }
}
```

Flow:

```text
Lint
 ↓
Test
 ↓
Deploy
 ↓
Notify
```

***

# Example 3: Docker Deployment

```json
{
  "scripts": {

    "predeploy":
      "npm run build",

    "deploy":
      "docker build -t app .",

    "postdeploy":
      "docker push app"
  }
}
```

***

# Example 4: Release Pipeline

```json
{
  "scripts": {

    "prepublishOnly":
      "npm run test",

    "version":
      "npm run changelog",

    "postversion":
      "git push --tags"
  }
}
```

Lifecycle hooks such as `prepublishOnly`, `version`, and `postversion` are commonly used in package publishing and release workflows. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# npm Lifecycle Script Error Handling

A senior-level interview topic is:

```text
How do you ensure deployment stops on failures?
```

***

## Fail Fast Pattern

✅ Good

```json
{
  "scripts": {
    "build":
      "eslint . && jest && webpack"
  }
}
```

Execution:

```text
ESLint Fails
 ↓
Stop
```

No build occurs.

***

## Poor Pattern

❌ Bad

```json
{
  "scripts": {
    "build":
      "eslint . ; jest ; webpack"
  }
}
```

All commands continue.

Can deploy broken code.

***

# Using Exit Codes

### deploy.js

```javascript
try {

  deployApp();

} catch(error) {

  console.error(error);

  process.exit(1);

}
```

CI/CD systems detect:

```text
0 = Success

1 = Failure
```

***

# Validation Before Deployment

```json
{
  "scripts": {

    "predeploy":
      "node validate-env.js",

    "deploy":
      "node deploy.js"
  }
}
```

### validate-env.js

```javascript
if (!process.env.API_KEY) {

  console.error(
    "API_KEY Missing"
  );

  process.exit(1);
}
```

Benefits:

```text
Prevent bad deployments

Fail early

Clear error message
```

***

# Logging Best Practices

```json
{
  "scripts": {
    "build":
      "echo Starting Build && webpack"
  }
}
```

Output:

```text
Starting Build
```

Helps troubleshoot build failures.

***

# Best Practices for npm Scripts in CI/CD Pipelines

## 1. Use npm ci Instead of npm install

✅ Recommended

```bash
npm ci
```

Benefits:

```text
Faster

Repeatable

Uses lock file
```

***

## 2. Separate Build and Deploy

✅ Good

```json
{
  "scripts": {

    "build": "webpack",

    "deploy": "node deploy.js"
  }
}
```

Avoid:

```json
{
  "scripts": {
    "build":
      "webpack && deploy"
  }
}
```

Reason:

```text
Easier Debugging
```

***

## 3. Perform Validation Early

Example:

```json
{
  "scripts": {
    "pretest":
      "eslint src"
  }
}
```

Flow:

```text
Lint
 ↓
Test
 ↓
Build
```

Lifecycle hooks like `pretest` are commonly used to run checks before tests. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

## 4. Keep Scripts Small

✅ Better

```json
{
  "scripts": {
    "build":
      "node scripts/build.js"
  }
}
```

Instead of:

```json
{
  "scripts": {
    "build":
      "very long shell command..."
  }
}
```

***

## 5. Use Environment Variables

```json
{
  "scripts": {
    "build":
      "NODE_ENV=production webpack"
  }
}
```

Avoid:

```javascript
const env = "production";
```

Hard-coded values.

***

## 6. Add Security Checks

```json
{
  "scripts": {
    "security":
      "npm audit"
  }
}
```

Pipeline:

```text
Audit
 ↓
Build
 ↓
Deploy
```

***

## 7. Generate Coverage Reports

```json
{
  "scripts": {

    "test":
      "jest",

    "posttest":
      "jest --coverage"
  }
}
```

Lifecycle patterns such as `posttest` are used to execute actions after tests complete. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9)

***

# Enterprise CI/CD Example

```json
{
  "scripts": {

    "lint": "eslint src",

    "test": "jest",

    "security": "npm audit",

    "build": "webpack",

    "deploy": "node deploy.js"
  }
}
```

Pipeline:

```text
Developer Push
 ↓
Lint
 ↓
Test
 ↓
Security Scan
 ↓
Build
 ↓
Deploy
```

***

# Interview Questions

### What happens if predeploy fails?

```text
deploy will not execute
```

***

### What happens if build returns exit code 1?

```text
Pipeline fails immediately
```

***

### Why use lifecycle scripts in CI/CD?

```text
Automation

Consistency

Quality Gates

Reduced Manual Steps

Repeatable Deployments
```

***

# Senior-Level Interview Answer

> In production CI/CD pipelines, I use lifecycle scripts to enforce quality gates before deployment. Typically, `pretest` runs linting, `test` executes unit tests, `predeploy` validates configuration and performs security checks, and `deploy` handles the actual release. Scripts should fail fast using proper exit codes, produce meaningful logs, remain small and modular, and use `npm ci` for deterministic builds. This ensures reliable, repeatable, and secure deployments across environments. [\[What shoul...ogin Flow? \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg5Njk3MTUxNjgyMTUwNCJ9), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)


# npm Script Exit Codes Explained

**Exit codes** are how npm scripts communicate success or failure to npm, CI/CD pipelines, Docker, Jenkins, GitHub Actions, Azure DevOps, etc.

Think of them as:

```text
0  = Success ✅
1+ = Failure ❌
```

Many automation and deployment systems rely on exit codes to decide whether to continue or stop execution. For example, CI/CD workflows discussed in internal DevOps and npm-related materials use build/test stages that proceed only when previous commands succeed. [\[DevOps Ini...Procedure \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/DevOps%20Initiation%20Procedure.pdf?web=1), [\[Persistent...y response \| PowerPoint\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

***

# 1. Exit Code 0 (Success)

### package.json

```json
{
  "scripts": {
    "build": "echo Build Successful"
  }
}
```

Run:

```bash
npm run build
```

Result:

```text
Exit Code = 0
```

Pipeline continues.

***

# 2. Exit Code 1 (Failure)

### package.json

```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

### build.js

```javascript
throw new Error(
  "Compilation Failed"
);
```

Output:

```text
npm ERR!
```

Result:

```text
Exit Code = 1
```

Pipeline stops immediately.

***

# 3. Using process.exit()

Node provides:

```javascript
process.exit(code);
```

### Success

```javascript
process.exit(0);
```

Means:

```text
Completed Successfully
```

***

### Failure

```javascript
process.exit(1);
```

Means:

```text
Execution Failed
```

***

# Real Example

### validate-env.js

```javascript
if (!process.env.API_KEY) {

  console.error(
    "Missing API_KEY"
  );

  process.exit(1);

}

console.log(
  "Validation Passed"
);

process.exit(0);
```

### package.json

```json
{
  "scripts": {
    "predeploy":
      "node validate-env.js",

    "deploy":
      "node deploy.js"
  }
}
```

Execution:

```text
Validation Failed
 ↓
Exit Code 1
 ↓
Deploy NOT Executed
```

***

# 4. How npm Uses Exit Codes

### package.json

```json
{
  "scripts": {
    "lint": "eslint src",

    "test": "jest",

    "build": "webpack"
  }
}
```

Execution:

```bash
npm run lint
```

If ESLint finds errors:

```text
Exit Code 1
```

Result:

```text
Script Failed
```

npm shows:

```text
npm ERR!
```

***

# 5. Chained Commands and Exit Codes

### Good

```json
{
  "scripts": {
    "build":
      "eslint . && jest && webpack"
  }
}
```

Flow:

```text
ESLint
 ↓
Jest
 ↓
Webpack
```

If ESLint fails:

```text
Exit Code 1
 ↓
Stop Execution
```

***

### Bad

```json
{
  "scripts": {
    "build":
      "eslint . ; jest ; webpack"
  }
}
```

Flow:

```text
ESLint Fails
 ↓
Still Runs Jest
 ↓
Still Runs Webpack
```

Can hide failures.

***

# 6. Lifecycle Scripts and Exit Codes

### package.json

```json
{
  "scripts": {

    "pretest": "eslint src",

    "test": "jest"
  }
}
```

Run:

```bash
npm test
```

If:

```text
pretest returns 1
```

Then:

```text
test never executes
```

This behaviour is important for lifecycle hooks such as `pretest`, `prepack`, and `prepublishOnly`. [\[Axios NPM...Axios, at \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzc5Mzk1ODAxNDE1NjgwMCJ9)

***

# 7. Capturing Exit Codes

Linux/Mac:

```bash
echo $?
```

Windows:

```cmd
echo %ERRORLEVEL%
```

Example:

```bash
npm test
```

Output:

```text
1
```

Meaning:

```text
Tests Failed
```

***

# 8. Custom Error Handling

```javascript
try {

  build();

  process.exit(0);

} catch(error) {

  console.error(error);

  process.exit(1);

}
```

Industry standard pattern.

***

# 9. GitHub Actions Example

```yaml
- run: npm test
```

If:

```text
Exit Code = 1
```

GitHub Actions:

```text
❌ Job Failed
```

If:

```text
Exit Code = 0
```

```text
✅ Continue Pipeline
```

***

# 10. Jenkins Example

```groovy
stage('Test') {
    sh 'npm test'
}
```

If Jest returns:

```text
Exit Code 1
```

Jenkins marks build:

```text
FAILED
```

***

# Interview Questions

## What exit code indicates success?

```text
0
```

***

## What exit code indicates failure?

```text
Non-zero

1, 2, 100, etc.
```

***

## What happens if a predeploy script returns exit code 1?

```text
Deployment stops.
```

***

## Why are exit codes important?

```text
Allow automation tools

CI/CD pipelines

Docker

Kubernetes

Jenkins

GitHub Actions

to detect success/failure.
```

***

## Senior-Level Interview Answer

> npm scripts return exit codes to indicate whether a task succeeded or failed. An exit code of `0` means success, while any non-zero value indicates failure. npm propagates these exit codes to CI/CD systems such as Jenkins, GitHub Actions, and Azure DevOps. In production pipelines, I use lifecycle scripts and validation checks that return `process.exit(1)` on failure, ensuring deployments stop immediately when tests, linting, security scans, or environment validations fail. This creates reliable and fail-fast automation.
