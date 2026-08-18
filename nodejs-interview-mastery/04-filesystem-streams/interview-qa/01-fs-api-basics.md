# Interview Q&A: fs API Basics

**Q: What are the three ways to read a file with Node's fs module, and when should you use each?**
`fs.readFileSync` reads synchronously, blocking the entire event loop until the OS call returns — acceptable only for CLI scripts or startup-time config loading before a server starts accepting requests. `fs.readFile` is the callback-based async form, delegating to libuv's thread pool and invoking an error-first callback on completion. `fs.promises.readFile` does the same but returns a Promise, composing cleanly with `async/await` and is the recommended default for modern application code. Never use `readFileSync` inside a request handler — it serializes every concurrent request behind each disk read.

**Q: Why does fs.readFile's error handling look different from fs.readFileSync's?**
`fs.readFileSync` throws synchronously on failure (e.g., `ENOENT` for a missing file), so wrapping the call in `try/catch` correctly catches it immediately. `fs.readFile` never throws synchronously for I/O errors — it always reports them via the callback's first (`err`) argument, so a `try/catch` wrapped around the call itself is pointless; the callback can fire well after the surrounding synchronous code (including any `catch` block) has already finished executing.

**Q: How would you copy a large file efficiently in Node, and what's wrong with using fs.readFileSync + fs.writeFileSync?**
Use `fs.createReadStream` piped (via `pipeline()`) into `fs.createWriteStream`, or the convenience `fs.copyFile`/`fs.promises.copyFile` for a simple whole-file copy — both stream the data at the OS level without holding the entire file in JS-accessible memory at once. `readFileSync` + `writeFileSync` loads the entire source file into a Buffer in memory before writing any of it back out, which is both slower (no work starts until the full read completes) and memory-unsafe for large files.
