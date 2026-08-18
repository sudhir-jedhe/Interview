// piece by piece
// not loading the data everything at once
// read large files
// upload files
// downloading files
// video/audio processing
// compression

import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

// CHUNKS

// here is my full 500mb file
// here is chunk 1
// here is chunk 2
// here is chunk 3
// here is chunk 4
// here is chunk 5

// memory efficient

// streams types
// readable stream - source of data
// writable stream - destination where the data is written
// transform stream - read the data, change it and pass that forward

const readableStream = Readable.from([
  "hello ",
  "from ",
  "node.js ",
  "streams",
]);

// callback(error, result)

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const text = chunk.toString();

    callback(null, text.toUpperCase());
  },
});

const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("received chunk", chunk.toString());

    callback();
  },
});

async function main(): Promise<void> {
  try {
    await pipeline(readableStream, uppercaseTransform, writableStream);

    console.log("Stream completed");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown error";
    console.error("stream failed", msg);
  }
}

main();
