**You're writing a data-processing pipeline that reads a huge CSV file line by line and needs to expose a `parseCsv(text)` function returning something the caller can `for-of` over one row at a time, without loading every parsed row into memory at once. How do generators solve this, and what would go wrong with an array-returning approach for a very large file?**

**Approach:**
```js
function* parseCsv(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const values = lines[i].split(',');
    yield Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));
  }
}

for (const row of parseCsv(csvText)) {
  console.log(row);
  // could `break` early without ever parsing the rest of the file
}
```
An array-returning version (`function parseCsv(text) { return lines.map(...); }`) forces the entire file to be parsed and held in memory before the caller can process a single row — for a multi-gigabyte CSV this can exhaust memory or introduce a large upfront latency spike. The generator version parses lazily, one row per `next()` call, so memory usage stays constant regardless of file size, and a caller who only needs the first few rows (e.g., a preview feature) can `break` out of the loop early, skipping the cost of parsing the rest entirely.
