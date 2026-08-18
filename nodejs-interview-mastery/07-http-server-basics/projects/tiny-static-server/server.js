#!/usr/bin/env node
'use strict';

/**
 * tiny-static-server
 *
 * A minimal, dependency-free static file server CLI built directly on
 * Node's `http` and `fs` modules. Supports:
 *   - Correct Content-Type by file extension
 *   - Directory listing (auto-generated HTML index) when no index.html exists
 *   - 404 for missing files, 403 for path traversal attempts
 *   - A --port flag and a positional root-directory argument
 *
 * Usage:
 *   node server.js [directory] [--port 8080]
 *   npx tiny-static-server [directory] [--port 8080]   (once installed via bin)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const DEFAULT_MIME_TYPE = 'application/octet-stream';

function parseArgs(argv) {
  let rootDir = '.';
  let port = 8080;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--port' || arg === '-p') {
      port = Number(argv[++i]);
    } else if (arg.startsWith('--port=')) {
      port = Number(arg.split('=')[1]);
    } else if (!arg.startsWith('-')) {
      rootDir = arg;
    }
  }

  return { rootDir, port };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderDirectoryListing(urlPath, entries) {
  const rows = entries
    .map((entry) => {
      const href = path.posix.join(urlPath, entry.name) + (entry.isDirectory ? '/' : '');
      const label = entry.isDirectory ? `${entry.name}/` : entry.name;
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;
    })
    .join('\n');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Index of ${escapeHtml(urlPath)}</title>
  </head>
  <body>
    <h1>Index of ${escapeHtml(urlPath)}</h1>
    <ul>
      ${urlPath !== '/' ? '<li><a href="../">../</a></li>' : ''}
      ${rows}
    </ul>
  </body>
</html>`;
}

function createStaticServer(rootDir) {
  const resolvedRoot = path.resolve(rootDir);

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end('Method Not Allowed');
    }

    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split('?')[0]);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request');
    }

    const relativePath = urlPath.replace(/^\/+/, '');
    const resolvedPath = path.resolve(resolvedRoot, relativePath);

    // Path traversal guard: resolved path must stay inside resolvedRoot.
    if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(resolvedRoot + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    fs.stat(resolvedPath, (statErr, stats) => {
      if (statErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found');
      }

      if (stats.isDirectory()) {
        return serveDirectory(resolvedPath, urlPath, req, res);
      }

      return serveFile(resolvedPath, req, res);
    });
  });
}

function serveFile(resolvedPath, req, res) {
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

  stream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Internal Server Error');
  });
}

function serveDirectory(resolvedPath, urlPath, req, res) {
  const indexPath = path.join(resolvedPath, 'index.html');

  fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
    if (!indexErr) {
      return serveFile(indexPath, req, res);
    }

    fs.readdir(resolvedPath, { withFileTypes: true }, (readErr, dirEntries) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }

      const entries = dirEntries.map((e) => ({
        name: e.name,
        isDirectory: e.isDirectory(),
      }));

      const normalizedUrlPath = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
      const html = renderDirectoryListing(normalizedUrlPath, entries);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (req.method === 'HEAD') return res.end();
      res.end(html);
    });
  });
}

function main() {
  const { rootDir, port } = parseArgs(process.argv.slice(2));
  const resolvedRoot = path.resolve(rootDir);

  if (!fs.existsSync(resolvedRoot)) {
    console.error(`Directory not found: ${resolvedRoot}`);
    process.exit(1);
  }

  const server = createStaticServer(resolvedRoot);
  server.listen(port, () => {
    console.log(`tiny-static-server serving ${resolvedRoot}`);
    console.log(`  -> http://localhost:${port}`);
  });
}

// Only auto-start when run directly (node server.js / via bin), not when required as a module.
if (require.main === module) {
  main();
}

module.exports = { createStaticServer, parseArgs, MIME_TYPES };
