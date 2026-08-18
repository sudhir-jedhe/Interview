# You Need to Watch a Log File and Tail New Lines as They're Appended, Like tail -f

An ops dashboard needs to stream new log lines to connected clients in near-real-time as a service appends to its log file, without re-reading the whole file on every change and without polling constantly.

**Approach:** Use `fs.watch` to get notified when the file changes, and on each change, read only the newly appended bytes by tracking the last known file size/position and using `fs.createReadStream` with a `start` offset — never re-read from the beginning:

```js
const fs = require('node:fs');

function tailFile(path, onLine) {
  let position = fs.statSync(path).size; // start at current end of file
  let buffered = '';

  fs.watch(path, (eventType) => {
    if (eventType !== 'change') return;
    const { size } = fs.statSync(path);
    if (size <= position) return; // truncated or no new data
    const stream = fs.createReadStream(path, { start: position, end: size - 1, encoding: 'utf8' });
    stream.on('data', (chunk) => {
      buffered += chunk;
      const lines = buffered.split('\n');
      buffered = lines.pop(); // keep any incomplete trailing line for next read
      lines.forEach(onLine);
    });
    stream.on('end', () => { position = size; });
  });
}

tailFile('/var/log/app.log', (line) => console.log('new line:', line));
```

Note `fs.watch`'s behavior (whether you get filename info, whether renames fire `'rename'` vs `'change'`) is platform-dependent, so production tail implementations often add a periodic `fs.stat` poll as a fallback safety net, or use a maintained library (`chokidar`) that smooths over these OS differences. See `../theory/05-watching-files.md` for the caveats in depth, and `../projects/log-tailer/` for a complete runnable CLI built on exactly this pattern.
