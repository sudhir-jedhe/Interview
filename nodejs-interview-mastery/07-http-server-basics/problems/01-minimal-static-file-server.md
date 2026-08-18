# Problem: Minimal Static File Server Using Only http and fs

## Problem Statement

Implement a static file server using only the built-in `http` and `fs` modules — no framework, no third-party MIME-type package. Given a root directory, it should serve files from disk based on the request path, set the correct `Content-Type` based on file extension, and return a proper `404` for missing files.

## Requirements

- `createStaticServer(rootDir)` returns an `http.Server`.
- `GET /` serves `index.html` from `rootDir` if it exists.
- `GET /path/to/file.ext` serves that file with a `Content-Type` derived from its extension (support at least `.html`, `.css`, `.js`, `.json`, `.png`, `.jpg`, `.svg`, `.txt`, and a sane fallback for unknown extensions).
- Requests for paths outside `rootDir` (via `../` traversal) must be rejected with `403`, not allowed to escape the root.
- Missing files return `404` with a plain-text body, not a stack trace or an unhandled exception.
- Uses streaming (`fs.createReadStream`) rather than `fs.readFile`, so large files don't get fully buffered in memory.

## Approach

Resolve the request path against the root directory using `path.join` + `path.resolve`, then verify the resolved path still starts with the resolved root directory — this is the standard defense against path traversal (`..`) attacks. Look up the `Content-Type` from a small extension-to-MIME-type map. Stream the file with `fs.createReadStream` and handle its `'error'` event (distinguishing "file not found" from other I/O errors) instead of using a blocking `fs.existsSync` check followed by a separate read (which has a race condition between the check and the read).

## Solution

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};
const DEFAULT_MIME_TYPE = 'application/octet-stream';

function createStaticServer(rootDir) {
  const resolvedRoot = path.resolve(rootDir);

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end('Method Not Allowed');
    }

    // Strip query string, decode percent-encoding, default to index.html for '/'.
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const relativePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');

    const resolvedPath = path.resolve(resolvedRoot, relativePath);

    // Path traversal guard: the resolved path must stay inside resolvedRoot.
    if (!resolvedPath.startsWith(resolvedRoot + path.sep) && resolvedPath !== resolvedRoot) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || DEFAULT_MIME_TYPE;

    const stream = fs.createReadStream(resolvedPath);

    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': contentType });
      if (req.method === 'HEAD') {
        stream.destroy();
        return res.end();
      }
      stream.pipe(res);
    });

    stream.on('error', (err) => {
      if (err.code === 'ENOENT' || err.code === 'EISDIR') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  });
}

module.exports = { createStaticServer, MIME_TYPES };
```

**Why this works:** using `stream.on('open', ...)` to send headers (rather than pre-checking with `fs.existsSync`) avoids a time-of-check-to-time-of-use race and naturally distinguishes "the file wasn't found" (`ENOENT`, mapped to 404) from other failures (mapped to 500). The `resolvedPath.startsWith(resolvedRoot + path.sep)` check closes the classic `GET /../../etc/passwd`-style traversal hole, since `path.resolve` collapses `..` segments before the check runs — a raw string check on the un-resolved URL would be bypassable. A full runnable version of this pattern, extended with directory listing and a CLI, lives in `../projects/tiny-static-server/`.
