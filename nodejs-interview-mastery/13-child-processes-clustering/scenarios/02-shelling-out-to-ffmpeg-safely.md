# Scenario: You need to run `ffmpeg` to transcode videos uploaded by users

You're building a video processing pipeline that shells out to the `ffmpeg` CLI. Files can be large, and the filename/options are partially derived from user input (original filename, requested output format).

**Approach:** Never build a shell string with user input — that's a command-injection vector. Use `spawn` with an argument array (no shell parsing involved) and stream output instead of buffering, since `exec`'s default 1MB buffer will choke on ffmpeg's verbose stderr output for large files:

```js
const { spawn } = require('child_process');
const path = require('path');

function transcode(inputPath, outputFormat) {
  return new Promise((resolve, reject) => {
    // outputFormat should be validated against an allowlist before this point
    const outputPath = inputPath.replace(/\.\w+$/, `.${outputFormat}`);
    const proc = spawn('ffmpeg', ['-i', inputPath, outputPath]);

    proc.stderr.on('data', () => {}); // ffmpeg logs progress to stderr; drain it
    proc.on('close', (code) => {
      code === 0 ? resolve(outputPath) : reject(new Error(`ffmpeg exited ${code}`));
    });
    proc.on('error', reject); // e.g. ffmpeg binary not found
  });
}
```

Also validate `outputFormat` against a strict allowlist (`['mp4', 'webm', 'mov']`) before using it in a path — even without a shell, an unchecked value could still be used for path traversal if you're not careful with how it's incorporated into the output path.
