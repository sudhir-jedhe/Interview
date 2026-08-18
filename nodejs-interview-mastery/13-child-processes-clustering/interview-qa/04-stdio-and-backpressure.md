# Interview Q&A: stdio Handling and Backpressure

**Q: If you `fork()` a Node script, why might `console.log` in the child not show up in your terminal?**

By default `fork()`'s child inherits the parent's stdio, so output goes straight to the same terminal — unless you pass `{ silent: true }`, in which case the child's stdout/stderr are piped back as streams (`child.stdout`, `child.stderr`) for the parent to consume programmatically instead of them printing directly.

**Q: How would you handle backpressure when piping a large file through a spawned child process?**

Treat `child.stdout` as a normal `Readable` stream and pipe it — Node's stream `.pipe()` automatically pauses the source when the destination's internal buffer is full and resumes when it drains, so `spawn('some-cli').stdout.pipe(fs.createWriteStream('out.bin'))` handles backpressure without manual bookkeeping. Manually reading with `.on('data', ...)` and writing without checking the return value of `.write()` can overwhelm memory for large streams.
