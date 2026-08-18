# Using pipeline() to Gzip a File with Automatic Error Cleanup

```js
const fs = require('node:fs');
const zlib = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function gzipFile(inputPath, outputPath) {
  await pipeline(
    fs.createReadStream(inputPath),
    zlib.createGzip(),
    fs.createWriteStream(outputPath)
  );
  console.log('compressed successfully');
}
```

Three streams are chained here: a Readable (the source file), a Transform (`zlib.createGzip()`, which compresses each chunk as it passes through), and a Writable (the destination `.gz` file). `pipeline()` wires them together with automatic backpressure handling in both directions, and — critically — if any of the three streams errors (a permission error opening the output file, a corrupted read, disk full mid-write), all three are destroyed and the returned Promise rejects with that error, leaving no dangling file descriptors. See `../theory/03-stream-types-and-pipeline.md` for why raw chained `.pipe()` calls don't give you this guarantee.
