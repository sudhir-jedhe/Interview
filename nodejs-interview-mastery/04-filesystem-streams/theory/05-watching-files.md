# Watching Files for Changes

Beyond reading/writing (covered in `01-fs-api-styles.md`) and streaming (`02`-`04`), `fs` also provides a way to be notified when a file or directory changes on disk, without polling.

`fs.watch(path, callback)` uses OS-level file system notification APIs (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows) to fire a callback on changes, which is efficient since it doesn't poll:

```js
fs.watch('/var/log/app.log', (eventType, filename) => {
  console.log(eventType, filename); // 'change' or 'rename'
});
```

## Caveats

`fs.watch`'s behavior is notably platform-inconsistent: whether you reliably get the changed filename, how renames are reported (some editors write via a temp file + rename, which some platforms report as `'rename'` rather than `'change'`), and whether rapid successive changes can be missed on some platforms. `fs.watchFile` is a polling-based alternative that's more consistent but far less efficient (constant `stat` calls on an interval).

Production file-watching needs (build tools, hot-reload, log tailing) typically reach for a battle-tested library like `chokidar` that smooths over these differences, or add a periodic `fs.stat` poll as a fallback safety net alongside `fs.watch`. See `../scenarios/03-tailing-a-log-file.md` and `../projects/log-tailer/` for a `tail -f`-style implementation built directly on `fs.watch`.
