# A Custom Transform Stream That Uppercases Text Chunks

```js
const { Transform } = require('node:stream');

class UppercaseFilter extends Transform {
  _transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
}
process.stdin.pipe(new UppercaseFilter()).pipe(process.stdout);
```

`UppercaseFilter` extends the built-in `Transform` class and overrides `_transform`, the one method every Transform subclass must implement — it receives each incoming chunk, and calls `callback(err, transformedChunk)` to emit the corresponding output chunk (or `callback(err)` alone to signal an error without producing output for this chunk). Piping `process.stdin` through it and out to `process.stdout` turns this into a working CLI filter: run it and anything typed is echoed back in uppercase. This is the minimal version of the same pattern developed fully in `../problems/02-custom-uppercase-transform.md`, which adds a `_flush` step and proper composition with `pipeline()`.
