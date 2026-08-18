# Correctly Handling UTF-8 Split Across Stream Chunks

Shows the `StringDecoder` API that Node's own streams use internally to avoid corrupting multi-byte characters that straddle chunk boundaries.

```js
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const euroSymbolBytes = Buffer.from('€'); // 3 bytes: e2 82 ac
const part1 = euroSymbolBytes.subarray(0, 2);
const part2 = euroSymbolBytes.subarray(2);

let output = '';
output += decoder.write(part1); // buffers incomplete sequence, emits ''
output += decoder.write(part2); // completes the sequence, emits '€'
console.log(output); // "€"
```

Calling `.toString('utf8')` independently on `part1` and `part2` would each produce a `�` replacement character, since neither half is a complete UTF-8 sequence on its own. `StringDecoder` holds back incomplete bytes internally until a full character is available.
