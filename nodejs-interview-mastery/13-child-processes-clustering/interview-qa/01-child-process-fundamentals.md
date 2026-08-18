# Interview Q&A: Child Process Fundamentals

**Q: What's the difference between `exec` and `spawn`?**

`exec` runs a command through a shell and buffers all output in memory, delivering it to a callback once the process exits — convenient for short commands with small output but risky with user input (shell injection) and unsuitable for large output (default 1MB buffer cap). `spawn` runs a command without a shell by default, streaming stdout/stderr as `Readable` streams instead of buffering, making it the right choice for long-running processes or large output volumes.

**Q: Why is `exec` a security risk if you build the command string from user input?**

Because `exec` passes the string to a shell for interpretation, shell metacharacters (`;`, `&&`, `|`, backticks) in unsanitized input let an attacker chain arbitrary additional commands. `exec(\`convert ${filename} out.png\`)` with `filename = "a.png; rm -rf /"` executes both commands. `execFile`/`spawn` avoid this because arguments are passed as an array and never parsed by a shell.

**Q: What does `fork()` give you that plain `spawn()` doesn't?**

`fork()` is specialized for launching another Node.js script and automatically sets up an IPC (inter-process communication) channel between parent and child, exposed as `.send()`/`.on('message', ...)`. Plain `spawn()` gives you raw stdio streams only — you'd have to build your own message protocol over stdin/stdout if you wanted structured communication.

**Q: Why is Node.js "single-threaded" but still able to handle many concurrent requests?**

Your JavaScript callback code runs on a single thread, but I/O operations (network, file system with libuv's thread pool) are handled asynchronously in the background — Node's event loop picks up completed I/O and runs the associated callback. This means Node handles high I/O concurrency well on one thread, but genuinely CPU-bound synchronous work (a tight loop, JSON.parse on a huge payload, image processing) still blocks that one thread and stalls everything else.
