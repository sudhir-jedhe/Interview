# tiny-static-server

A minimal, dependency-free static file server, built directly on Node's `http` and `fs` modules — no Express, no third-party MIME-type package. It exists as a small, real project demonstrating the raw-`http` concepts covered in `../../theory/` and `../../problems/01-minimal-static-file-server.md`, extended with directory listing and a usable CLI.

## Features

- Correct `Content-Type` based on file extension (HTML, CSS, JS, JSON, images, fonts, etc.)
- Auto-generated directory listing (HTML index) when a directory has no `index.html`
- Streams files with `fs.createReadStream` instead of buffering them fully in memory
- Blocks path traversal (`..`) attempts with a `403`
- `404` for missing files, `405` for unsupported methods
- Zero runtime dependencies

## Usage

```bash
# Run directly with Node
node server.js [directory] [--port 8080]

# Examples
node server.js                      # serve the current directory on port 8080
node server.js ./public             # serve ./public
node server.js ./public --port 5000 # serve ./public on port 5000
node server.js ./public -p 5000     # short flag also works
```

### Installing as a CLI

The `package.json` declares a `bin` entry, so after `npm link` (or a global install) you can run it as a standalone command:

```bash
npm link
tiny-static-server ./public --port 5000
```

Or run it without installing, via `npx` from within this directory:

```bash
npx . ./public --port 5000
```

## How it works

`server.js` exports `createStaticServer(rootDir)`, which returns a plain `http.Server`:

```js
const { createStaticServer } = require('./server.js');

const server = createStaticServer('./public');
server.listen(3000);
```

For every request, it:

1. Resolves the requested URL path against `rootDir` using `path.resolve`, then verifies the resolved path is still inside `rootDir` (rejecting `..`-based traversal with `403`).
2. `fs.stat`s the resolved path:
   - If it's a directory, looks for `index.html` inside it; if missing, renders an HTML directory listing.
   - If it's a file, streams it back with the correct `Content-Type` derived from its extension (falling back to `application/octet-stream` for unknown types).
3. Returns `404` if the path doesn't exist, `405` for any method other than `GET`/`HEAD`.

## Project layout

```
tiny-static-server/
  server.js       # the whole server + CLI entry point
  package.json    # npm metadata + "bin" entry for CLI installation
  README.md       # this file
```
