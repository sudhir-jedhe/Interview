# Child Processes & Clustering — `child_process` Basics

## Why spawn a process at all

Node's JS execution is single-threaded. Two situations force you outside that thread: (1) you need to run an external program (`git`, `ffmpeg`, `imagemagick`, a Python script) that isn't Node code at all, and (2) you have CPU-bound work (image resizing, PDF generation, heavy computation) that would otherwise block the event loop and stall every other request your server is handling. In both cases you hand work to a separate OS process (or thread) so the main event loop stays free to keep serving I/O.

## Four ways to spawn

```js
const { exec, execFile, spawn, fork } = require('child_process');
```

- **`exec(command, cb)`** — runs a command through a shell (`/bin/sh` on POSIX). Buffers all stdout/stderr into memory and hands it to a callback when the process exits. Convenient for short commands with small output, but two gotchas: (1) because it goes through a shell, string-concatenating user input into the command is a command-injection vector; (2) buffered output has a `maxBuffer` limit (default 1MB) — exceed it and the process errors out.
- **`execFile(file, args, cb)`** — same buffered-callback style as `exec`, but runs the executable directly without a shell. Faster, and safe from shell injection since `args` is an array, not an interpolated string.
- **`spawn(command, args)`** — no shell by default, returns a `ChildProcess` with streaming `stdout`/`stderr`. Best choice for long-running processes or large output because you consume data incrementally instead of buffering it all in memory.
- **`fork(modulePath)`** — a specialized `spawn` specifically for launching another **Node.js** script as a child process. It automatically sets up an IPC channel so parent and child can `.send()` messages back and forth, which is the mechanism `cluster` is built on.

```js
// spawn: streaming, no shell, good for big output / long-running commands
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la', '/tmp']);
ls.stdout.on('data', (chunk) => process.stdout.write(chunk));
ls.on('close', (code) => console.log(`exited with ${code}`));

// fork: parent <-> child Node processes talking over IPC
const { fork } = require('child_process');
const child = fork('./worker.js');
child.send({ task: 'compute', n: 42 });
child.on('message', (result) => console.log('got', result));
```

**Gotcha:** never build `exec` commands from untrusted input — `exec(\`convert ${userFilename} out.png\`)` lets someone pass `foo.png; rm -rf /` as a filename. Use `execFile`/`spawn` with an args array instead, which sidesteps shell parsing entirely.

## `exec` vs `execFile` vs `spawn` vs `fork`

| Aspect | exec | execFile | spawn | fork |
|---|---|---|---|---|
| Shell involved | Yes | No | No (unless `shell: true`) | No |
| Output handling | Buffered, passed to callback | Buffered, passed to callback | Streamed via `stdout`/`stderr` | Streamed, plus IPC channel |
| Injection risk | High if input is interpolated | Low (args passed as array) | Low | Low |
| Typical use | Quick shell one-liners (`git rev-parse`) | Running a known binary with args safely | Long-running processes, large output | Launching another Node.js script with messaging |

Use `execFile`/`spawn` over `exec` whenever any part of the command comes from user input — string interpolation into a shell command is the classic command-injection bug. The most common mistake is defaulting to `exec` out of habit and then discovering (in production, or in a security audit) that it silently shells out user-controlled data.
