This Node.js script renames **all `.js` files in the current directory** to **`.md` files**.

### What the code does

const fs = require("fs");

const path = require("path");

- `fs` → Node.js File System module for file operations.
- `path` → Utility module for handling file paths.

---

const files = fs.readdirSync(\_\_dirname);

- Reads all files and folders from the current directory (`__dirname`).
- Returns an array of names.

Example:

["index.js", "app.js", "README.md"]

---

files.forEach((file) => {

- Loops through every item in the directory.

---

```
if (path.extname(file) === ".js") {
```

- Checks whether the file extension is `.js`.

Examples:

```
path.extname("app.js");      // ".js"

path.extname("README.md");   // ".md"
```

---

```
const newFileName = path.join(

  \_\_dirname,

  path.basename(file, ".js") + ".md",

);
```

Creates the new filename:

app.js      -> app.md

index.js    -> index.md

- `path.basename(file, ".js")` removes the `.js` extension.
- `.md` is appended.
- `path.join()` creates the full path.

---

fs.renameSync(path.join(\_\_dirname, file), newFileName);

Renames the file synchronously.

Example:

app.js -> app.md

---

console.log(`Renamed: ${file} -&gt; ${newFileName}`);

Logs each successful rename:

Renamed: app.js -> /project/app.md

Renamed: index.js -> /project/index.md

---

## Example

### Before

project/

├── app.js

├── index.js

├── README.md

### After Running

project/

├── app.md

├── index.md

├── README.md

``

---

## Potential Issues

### 1\. Overwrites existing `.md` files

If `app.md` already exists, `renameSync()` may fail or behave unexpectedly depending on the OS.

Consider checking first:

```js
if (!fs.existsSync(newFileName)) {
  fs.renameSync(oldPath, newFileName);
}
```

---

### 2\. Processes only the current directory

It does **not** rename files inside subfolders.

---

### 3\. Synchronous operations

`readdirSync()` and `renameSync()` block the Node.js event loop. For large directories, an asynchronous version is preferable.

---

## Modern Async Version

```js
const fs = require("fs/promises");

const path = require("path");

async function renameFiles() {

  const files = await fs.readdir(\_\_dirname);

  for (const file of files) {

    if (path.extname(file) === ".js") {

      const oldPath = path.join(\_\_dirname, file);

      const newPath = path.join(

        \_\_dirname,

        `${path.basename(file, ".js")}.md`

      );

      await fs.rename(oldPath, newPath);

      console.log(`Renamed: ${file} -&gt; ${path.basename(newPath)}`);

    }

  }

}

renameFiles().catch(console.error);

```

### Time Complexity

- `readdirSync()` → **O(n)**
- Loop through files → **O(n)**
- Overall → **O(n)** where `n` is the number of files in the directory.

# Handling Renaming Conflicts Safely

A common problem is:

`app.js  -> app.md`

but `app.md` already exists.

Blindly calling `rename()` can:

- Fail with an error
- Overwrite data (depending on the operation and platform)
- Cause unexpected behaviour in batch jobs

## Strategy 1: Skip Existing Files

```javascript
if (
  await fs
    .access(newPath)
    .then(() => true)
    .catch(() => false)
) {
  console.log(`Skipped: ${newPath} already exists`);
  return;
}
```

**Result:**

- `app.js` -> skipped
- `app.md` -> unchanged

## Strategy 2: Create Unique Names

Automatically generate:

- `app.js`
- `app.md` (already exists)

↓

`app(1).md`

### Example:

````javascript
async function getUniqueFileName(filePath) {
  let counter = 1;
  let candidate = filePath;

  while (
    await fs.access(candidate)
      .then(() => true)
      .catch(() => false)
  ) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);

    candidate = path.join(
      dir,
      `${name}(${counter})${ext}`
    );

    counter++;
  }

  return candidate;
}
s```
documentation continues...
details about backup strategy, dry run mode, asynchronous and parallel versions, and tips for safe implementation.
````

# 1. Adding Logging for Rename Errors

In production systems, you should log:

- File being renamed
- Target filename
- Error code (EEXIST, ENOENT, EPERM, etc.)
- Timestamp
- Stack trace (for debugging)

## Basic Error Logging

```javascript
try {
  await fs.rename(oldPath, newPath);
  console.log(`[SUCCESS] ${oldPath} -> ${newPath}`);
} catch (error) {
  console.error(`[ERROR] Failed to rename ${oldPath}`);
  console.error("Code:", error.code);
  console.error("Message:", error.message);
}
```

## Structured Logging

```javascript
function logRenameError(oldPath, newPath, error) {
  console.error(
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        operation: "rename",
        source: oldPath,
        destination: newPath,
        code: error.code,
        message: error.message,
      },
      null,
      2,
    ),
  );
}
```

### Usage:

````javascript
try {
  await fs.rename(oldPath, newPath);
} catch (error) {
  logRenameError(oldPath, newPath, error);
}
e```
tSample output:
datajson:
d{
{
  "timestamp": "2026-07-21T12:00:00.000Z",
  "operation": "rename",
  "source": "app.js",
  "destination": "app.md",
  "code": "EEXIST",
  "message": "file already exists, rename 'app.js' -> 'app.md'"
}
d}
d
---
dLogging to a File
```javascript
const fsSync = require("fs");

function writeLog(message) {
  fsSync.appendFileSync(
    "rename.log",
    `${new Date().toISOString()} ${message}\n`
  );
}

try {
  await fs.rename(oldPath, newPath);
} catch (error) {
  writeLog(`FAILED ${oldPath} -> ${newPath}: ${error.message}`);
}
defaults;

# 2. Limiting Concurrency in Parallel Renaming
## Why Limit Concurrency?
suppose you have:
n50,000 files
bThis will cause problems:
aawait Promise.all(files.map(renameFile));
because Node tries to start all rename operations simultaneously.
potential issues:
high memory usage
too many open files (EMFILE)
disk thrashing
performance degradation
## Simple Concurrency Pool
def limit to 5 parallel operations:
async function processWithLimit(items, limit, worker) {
  const executing = [];

  for (const item of items) {
    const promise = worker(item);
    executing.push(promise);

    // Remove finished promise from execution pool
    promise.finally(() => {
      executing.splice(executing.indexOf(promise), 1);
    });

    // If pool is full, wait for the fastest one to complete
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  // Wait for all remaining active promises to finish
  await Promise.all(executing);
}

// Usage:
await processWithLimit(files, 5, renameFile);
Result:
only 5 renames active at any time.
### Professional Approach: p-limit
Install:
npm install p-limit
Usage:
const pLimit = require("p-limit");

const limit = pLimit(10); // Limit to 10 concurrent executions

await Promise.all(
  files.map(file => limit(() => renameFile(file)))
);
Benefits:
cCleaner codeBetter scalabilityWidely used in production
### Complete Example
const fs = require("fs/promises");
const path = require("path");
const pLimit = require("p-limit");

const limit = pLimit(5);

async function renameFile(file) {
  if (path.extname(file) !== ".js") {
    return;
  }

  const oldPath = path.join(__dirname, file);
  const newPath = path.join(__dirname, `${path.basename(file, ".js")}.md`);

  try {
    await fs.rename(oldPath, newPath);
    console.log(`✓ ${file} -> ${path.basename(newPath)}`);
  } catch (error) {
    console.error(`✗ Failed: ${file}`);
    console.error(error.message);
  }
}

async function run() {
  const files = await fs.readdir(__dirname);

  await Promise.all(
    files.map(file => limit(() => renameFile(file)))
  );
}

run().catch(console.error);
---
````

# Production Node.js File Manipulation: Logging, Concurrency & Rollbacks

---

## 1. Adding Logging for Rename Errors

In production systems, you should log key context whenever a file operation fails:

- **File being renamed** (Source path)
- **Target filename** (Destination path)
- **Error code** (`EEXIST`, `ENOENT`, `EPERM`, etc.)
- **Timestamp**
- **Stack trace** (for debugging)

---

### Basic Error Logging

```javascript
try {
  await fs.rename(oldPath, newPath);
  console.log(`[SUCCESS] ${oldPath} -> ${newPath}`);
} catch (error) {
  console.error(`[ERROR] Failed to rename ${oldPath}`);
  console.error("Code:", error.code);
  console.error("Message:", error.message);
}
Structured LoggingStructured logging (JSON) makes logs easily parsable by monitoring tools like ELK, Datadog, or CloudWatch.JavaScriptfunction logRenameError(oldPath, newPath, error) {
  console.error(
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        operation: "rename",
        source: oldPath,
        destination: newPath,
        code: error.code,
        message: error.message,
        stack: error.stack,
      },
      null,
      2
    )
  );
}
UsageJavaScripttry {
  await fs.rename(oldPath, newPath);
} catch (error) {
  logRenameError(oldPath, newPath, error);
}
Sample JSON OutputJSON{
  "timestamp": "2026-07-21T12:00:00.000Z",
  "operation": "rename",
  "source": "app.js",
  "destination": "app.md",
  "code": "EEXIST",
  "message": "file already exists, rename 'app.js' -> 'app.md'"
}
Logging to a FileJavaScriptconst fsSync = require("fs");

function writeLog(message) {
  fsSync.appendFileSync(
    "rename.log",
    `${new Date().toISOString()} ${message}\n`
  );
}

try {
  await fs.rename(oldPath, newPath);
} catch (error) {
  writeLog(`FAILED ${oldPath} -> ${newPath}: ${error.message}`);
}
2. Limiting Concurrency in Parallel RenamingWhy Limit Concurrency?Suppose you need to process 50,000 files. Running them all at once using standard array mappings will overload the system:JavaScript// BAD: Tries to start 50,000 rename operations simultaneously
await Promise.all(files.map(renameFile));
Potential Issues:High Memory Usage: Holding thousands of active Promises in memory.Too Many Open Files (EMFILE): Exceeding operating system file descriptor limits.Disk Thrashing: Heavy I/O bottleneck slowing down execution.Performance Degradation: Application freeze or crash.Custom Concurrency PoolYou can implement a custom worker queue to restrict active parallel operations (e.g., limit to 5 at a time):JavaScriptasync function processWithLimit(items, limit, worker) {
  const executing = [];

  for (const item of items) {
    const promise = worker(item);
    executing.push(promise);

    // Remove finished promise from execution pool
    promise.finally(() => {
      executing.splice(executing.indexOf(promise), 1);
    });

    // If pool is full, wait for the fastest one to complete
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  // Wait for all remaining active promises to finish
  await Promise.all(executing);
}

// Usage:
await processWithLimit(files, 5, renameFile);
Result: Maximum of 5 active file renames occurring simultaneously.Professional Approach: p-limitFor production environments, using a tested library like p-limit is recommended.InstallationBashnpm install p-limit
Basic UsageJavaScriptconst pLimit = require("p-limit");

const limit = pLimit(10); // Limit to 10 concurrent executions

await Promise.all(
  files.map(file => limit(() => renameFile(file)))
);
Benefits:Cleaner, concise syntaxBetter scalability and internal queue handlingIndustry standard in Node.js ecosystemComplete Example using p-limitJavaScriptconst fs = require("fs/promises");
const path = require("path");
const pLimit = require("p-limit");

const limit = pLimit(5);

async function renameFile(file) {
  if (path.extname(file) !== ".js") {
    return;
  }

  const oldPath = path.join(__dirname, file);
  const newPath = path.join(__dirname, `${path.basename(file, ".js")}.md`);

  try {
    await fs.rename(oldPath, newPath);
    console.log(`✓ ${file} -> ${path.basename(newPath)}`);
  } catch (error) {
    console.error(`✗ Failed: ${file}`);
    console.error(error.message);
  }
}

async function run() {
  const files = await fs.readdir(__dirname);

  await Promise.all(
    files.map(file => limit(() => renameFile(file)))
  );
}

run().catch(console.error);
3. Production-Grade Rollback MechanismsA production-grade rollback mechanism records every successful rename operation so changes can be cleanly reversed if a batch job fails or encounters an error mid-way.Approach 1: Persistent JSON Rollback File (Recommended)This approach maintains a transaction log saved to disk, allowing you to run a separate rollback script at a later time if needed.1. Rename Phase (Recording Operations)JavaScriptconst fs = require("fs/promises");
const path = require("path");

const rollbackLog = [];

async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);

  rollbackLog.push({
    oldPath,
    newPath,
    timestamp: new Date().toISOString(),
  });
}

async function saveRollbackLog() {
  await fs.writeFile(
    "rollback.json",
    JSON.stringify(rollbackLog, null, 2)
  );
}
Generated rollback.json ExampleJSON[
  {
    "oldPath": "/project/app.js",
    "newPath": "/project/app.md",
    "timestamp": "2026-07-21T08:15:00.000Z"
  },
  {
    "oldPath": "/project/index.js",
    "newPath": "/project/index.md",
    "timestamp": "2026-07-21T08:15:01.000Z"
  }
]
2. Rollback Script (Reversing Operations)Reads the log file and reverses each recorded rename action in reverse order.JavaScriptconst fs = require("fs/promises");

async function rollback() {
  const operations = JSON.parse(
    await fs.readFile("rollback.json", "utf8")
  );

  // Reverse array to unwind changes backwards
  for (const operation of operations.reverse()) {
    try {
      await fs.rename(
        operation.newPath,
        operation.oldPath
      );

      console.log(
        `Rolled back: ${operation.newPath} -> ${operation.oldPath}`
      );
    } catch (error) {
      console.error(
        `Rollback failed for ${operation.newPath}: ${error.message}`
      );
    }
  }
}

rollback().catch(console.error);
Why Reverse Order?Suppose file movements occur in sequence:a.js $\rightarrow$ a.mda.md $\rightarrow$ archive/a.mdUnwinding must happen in reverse order to avoid pointing to non-existent intermediate paths:archive/a.md $\rightarrow$ a.mda.md $\rightarrow$ a.jsTherefore, using operations.reverse() is crucial to prevent state corruption.Approach 2: Automatic In-Memory Rollback on FailureIf any single rename fails during execution, automatically undo all operations completed up to that point.JavaScriptconst fs = require("fs/promises");

const rollbackLog = [];

async function batchRename(files) {
  try {
    for (const { oldPath, newPath } of files) {
      await fs.rename(oldPath, newPath);

      // Track completed operation
      rollbackLog.push({ oldPath, newPath });
    }
  } catch (error) {
    console.error("Failure detected. Starting automatic rollback...");

    // Unwind changes in reverse
    for (const operation of rollbackLog.reverse()) {
      try {
        await fs.rename(operation.newPath, operation.oldPath);
      } catch (rollbackError) {
        console.error(`Secondary failure during rollback: ${rollbackError.message}`);
      }
    }

    // Re-throw original error after rollback completion
    throw error;
  }
}
Execution Flow ExamplePlaintextapp.js   -> app.md     ✓
index.js -> index.md   ✓
main.js  -> main.md    ✗ (Failure)

[Rollback Triggered]
index.md -> index.js   ✓
app.md   -> app.js     ✓

End state: Pristine condition (app.js, index.js, main.js). No partial changes remain.
Approach 3: Backup-Based RollbackFor highly critical files where data corruption or loss cannot be tolerated.Rename Phase with BackupsJavaScript// 1. Create a backup copy
await fs.copyFile(oldPath, `${oldPath}.bak`);

// 2. Perform target rename
await fs.rename(oldPath, newPath);
Directory status: app.js.bak (backup) and app.md (renamed file).Rollback PhaseJavaScript// Restore from backup
await fs.copyFile(`${oldPath}.bak`, oldPath);
StrategyBenefitsTrade-offsBackup-Based• Original data guaranteed safe• Survives unexpected crashes/kills• Simple disaster recovery• High disk space usage• Slower performance due to file copying4. Enterprise-Grade PatternProduction-grade tools combine multiple patterns to form a robust file processing pipeline:Dry Run: Pre-validate paths and preview expected changes before execution.Transaction Log: Write operations to rollback.json for auditability and manual recovery.Backup Strategy: Generate .bak copies for high-stakes workloads.Automatic Rollback: Instantly undo partial batches upon unhandled runtime exceptions.Summary Report: Output structured metrics at the end of the batch run:Plaintext========================================
OPERATION SUMMARY
========================================
Files Processed: 1000
Renamed:         986
Skipped:         10
Failed:          4

Rollback log created: rollback.json
========================================
5. Senior Interview Summary Pitch"For safe bulk file operations, I maintain an execution transaction log recording every successful old-to-new path mapping. If a failure occurs mid-batch, I iterate through the log in reverse order to restore each file, maintaining atomic transactional behaviour.For critical data pipelines, I additionally implement backup-before-write strategies using temporary copies. This guarantees auditability, zero partial states, and seamless recovery from unexpected system crashes."
```
