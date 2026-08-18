# log-tailer

A small, dependency-free `tail -f`-style CLI that watches a log file and streams newly appended lines to stdout as they're written — built on `fs.watch` and Node streams (`fs.createReadStream` with a byte offset), not polling.

This is a companion project to the `04-filesystem-streams` topic notes — see `../../theory/05-watching-files.md` and `../../scenarios/03-tailing-a-log-file.md` for the concepts this project applies.

## Why this exists

Interview questions about `fs.watch` and streaming file reads are usually answered with a snippet; this project turns that snippet into something you can actually run, extend, and break — which is a better way to internalize backpressure, chunk-boundary line splitting, and the platform quirks of `fs.watch` than reading about them.

## Installation

No dependencies to install — it's plain Node.js (v18+, uses `fs.promises`-adjacent APIs available since early Node 18).

```bash
cd projects/log-tailer
npm link   # optional: makes the `log-tailer` command available globally via the "bin" entry
```

Or just run it directly with `node`:

```bash
node index.js <file>
```

## Usage

```bash
# Tail a file, printing new lines as they're appended (Ctrl+C to stop)
log-tailer /var/log/app.log

# Also print the last 20 existing lines before tailing (like `tail -n 20 -f`)
log-tailer /var/log/app.log -n 20

# Only print lines containing a substring (simple grep-style filter)
log-tailer /var/log/app.log --grep=ERROR

# Combine flags
log-tailer /var/log/app.log -n 50 --grep=WARN
```

### Try it yourself

```bash
# terminal 1
touch /tmp/demo.log
node index.js /tmp/demo.log

# terminal 2
echo "hello" >> /tmp/demo.log
echo "ERROR: something broke" >> /tmp/demo.log
```

Terminal 1 should print each new line as it's appended, with no polling delay.

## How it works

1. On startup, `fs.statSync` records the current end-of-file byte offset — the tool only cares about bytes appended *after* it starts watching (plus whatever `-n` explicitly asks to backfill).
2. `fs.watch(filePath, callback)` subscribes to OS-level filesystem change notifications (inotify/FSEvents/ReadDirectoryChangesW depending on platform) — no polling loop.
3. On each `'change'` event, the tool re-`stat`s the file, and if it's grown, opens a `fs.createReadStream` starting exactly at the previously-recorded byte offset (`{ start: position, end: newSize - 1 }`) — so it only reads the *new* bytes, never re-reading from the beginning.
4. Incoming chunks are buffered and split on `\n`; any trailing partial line (a line whose closing `\n` hasn't arrived yet) is held over and prepended to the next chunk, so lines are never split or duplicated across reads.
5. If the file shrinks between checks (common with `logrotate`-style truncation), the tool resets its read offset to `0` and resumes from the start of the (now different) file contents.

## Flags

| Flag | Description |
|---|---|
| `-n <count>` | Print the last `<count>` existing lines before starting to tail (like `tail -n`) |
| `--grep=<substring>` | Only print lines containing `<substring>` (simple substring match, not a full regex) |

## Known limitations

This is a learning-focused implementation, not a production-grade tool. In particular:

- **`fs.watch` platform inconsistency** — event reliability and the exact meaning of `'rename'` vs `'change'` varies across Linux/macOS/Windows. A production tool would add a periodic `fs.stat` poll as a fallback safety net, or depend on a library like `chokidar` that already handles these differences.
- **No re-open on rotation** — if the log file is rotated (renamed away and a new file created at the same path, e.g. by `logrotate`), this tool prints a warning to stderr but does not automatically re-open the new file at that path; a production tailer would detect the rename and reattach.
- **`-n` reads the whole file synchronously** to find the last N lines, which is simple and fine for typical log sizes but not memory-bounded for extremely large files — a fully streaming reverse-line-reader would be needed for multi-gigabyte files under the `-n` flag specifically (the live-tailing path itself is already fully streaming and memory-bounded, regardless of file size).
- **`--grep` is a plain substring match**, not a regular expression, to keep the CLI dependency-free and simple.

## Files

- `index.js` — the CLI implementation (also exports `parseArgs`, `readLastLines`, `tailFile` for testing/reuse)
- `package.json` — package manifest with a `"bin"` entry so `npm link` exposes it as the `log-tailer` command
