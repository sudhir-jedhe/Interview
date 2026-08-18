// after some delay
// repeatedly after some internal - 2 seconds

// settimeout
// setinterval
// cleartimeout
// clearinterval
// setimmediate

import { setTimeout as sleep } from "node:timers/promises";

function runSetTimeoutExample(): void {
  console.log("1. setTimeout example started");

  setTimeout(() => {
    console.log("2. this runs after 1 second");
  }, 1000);

  console.log("3. this run immediately. node doesn't wait");
}

function runClearTimeoutExample(): void {
  const timerId = setTimeout(() => {
    console.log("this message will not run");
  }, 2000);

  clearTimeout(timerId);
  console.log("4. cleartimeout cancelled the 2 second timer");
}

// setinterval is going to run the callback again and again after the fixed delay

function runSetIntervalExample(): void {
  let count = 0;

  const intervalId = setInterval(() => {
    count++;

    console.log(`5. setInterval tick: ${count}`);

    if (count === 3) {
      clearInterval(intervalId);
      console.log("6. setInterval stopped");
    }
  }, 1000);
}

function runSetImmediateExample(): void {
  setImmediate(() => {
    console.log("7. setImmediate callback");
  });

  console.log("8. synchronous code after setImmediate");
}

async function runPromiseTimerExample(): Promise<void> {
  console.log("9. waiting for promise based timer");

  await sleep(1500);

  console.log("10. promise based timer finishes after 1.5 seconds");
}

function runTimerDemo(): void {
  runSetTimeoutExample();
  runClearTimeoutExample();
  runSetIntervalExample();
  runSetImmediateExample();
}

runTimerDemo();

runPromiseTimerExample().catch((error: unknown) => {
  console.error("timer based demo failed", error);
});
