#!/usr/bin/env node
'use strict';

/**
 * log-tailer — a small `tail -f`-style CLI that watches a log file and
 * streams newly appended lines to stdout as they're written, using
 * fs.watch + streams (no polling).
 *
 * Usage:
 *   log-tailer <file>                 tail a file, printing new lines as they arrive
 *   log-tailer <file> -n 20           also print the last 20 existing lines before tailing
 *   log-tailer <file> --grep=ERROR    only print lines containing the given substring
 *
 * This is a learning/demo implementation, not a production-hardened tool --
 * see the "Known limitations" section in README.md.
 */

const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');

function parseArgs(argv) {
  const args = { file: null, lines: 0, grep: null };
  const rest = [];

  for (const arg of argv) {
    if (arg.startsWith('-n')) {
      // supports both "-n 20" (next arg) and "-n=20"/"-n20" forms minimally
      const eq = arg.indexOf('=');
      if (eq !== -1) {
        args.lines = Number(arg.slice(eq + 1));
      } else if (arg === '-n') {
        args._expectLinesValue = true;
      } else {
        args.lines = Number(arg.slice(2));
      }
    } else if (args._expectLinesValue) {
      args.lines = Number(arg);
      args._expectLinesValue = false;
    } else if (arg.startsWith('--grep=')) {
      args.grep = arg.slice('--grep='.length);
    } else {
      rest.push(arg);
    }
  }

  delete args._expectLinesValue;
  args.file = rest[0] || null;
  return args;
}

/**
 * Reads the last `n` lines of a file synchronously at startup, for the
 * optional "-n" flag. Simple and fine for the moderate log sizes this
 * tool targets; see README.md for the tradeoff vs a true streaming
 * reverse-read for very large files.
 */
function readLastLines(filePath, n) {
  if (n <= 0) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const allLines = content.split('\n').filter((_, i, arr) => !(i === arr.length - 1 && arr[arr.length - 1] === ''));
  return allLines.slice(-n);
}

function matchesFilter(line, grep) {
  return !grep || line.includes(grep);
}

function tailFile(filePath, { grep } = {}) {
  let position = fs.statSync(filePath).size; // start watching from current end of file
  let buffered = '';
  let reading = false; // simple guard against overlapping reads if 'change' fires again mid-read

  function processNewData() {
    if (reading) return;
    reading = true;

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        // File may have been rotated/deleted -- reset position so we don't
        // try to read from an offset that no longer exists once it reappears.
        reading = false;
        return;
      }

      if (stats.size < position) {
        // File shrank -- most likely truncated or rotated by an external
        // logger (e.g. logrotate). Restart from the beginning of the new file.
        position = 0;
      }

      if (stats.size === position) {
        reading = false;
        return; // nothing new
      }

      const stream = fs.createReadStream(filePath, {
        start: position,
        end: stats.size - 1,
        encoding: 'utf8',
      });

      stream.on('data', (chunk) => {
        buffered += chunk;
        const parts = buffered.split('\n');
        buffered = parts.pop(); // keep the last, possibly-incomplete line for next time
        for (const line of parts) {
          if (matchesFilter(line, grep)) {
            process.stdout.write(line + '\n');
          }
        }
      });

      stream.on('end', () => {
        position = stats.size;
        reading = false;
      });

      stream.on('error', (err) => {
        process.stderr.write(`log-tailer: read error: ${err.message}\n`);
        reading = false;
      });
    });
  }

  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      processNewData();
    }
    // 'rename' can indicate the file was moved/rotated -- for a learning
    // implementation we just log it; production tools re-open by path.
    if (eventType === 'rename') {
      process.stderr.write(`log-tailer: warning: '${filePath}' was renamed or removed\n`);
    }
  });

  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0);
  });

  return watcher;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.file) {
    process.stderr.write('usage: log-tailer <file> [-n <count>] [--grep=<substring>]\n');
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), args.file);

  if (!fs.existsSync(filePath)) {
    process.stderr.write(`log-tailer: no such file: ${filePath}\n`);
    process.exit(1);
  }

  if (args.lines > 0) {
    for (const line of readLastLines(filePath, args.lines)) {
      if (matchesFilter(line, args.grep)) {
        process.stdout.write(line + '\n');
      }
    }
  }

  tailFile(filePath, { grep: args.grep });
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, readLastLines, tailFile };
