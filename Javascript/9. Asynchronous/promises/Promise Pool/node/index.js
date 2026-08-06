const { promisePool } = require('./promisePool');

async function runTestCase(functions, n) {
  console.log(`Running test case with ${functions.length} functions and pool limit ${n}`);
  const [individualTimes, totalTime] = await promisePool(functions, n);
  console.log('Individual promise resolution times:', individualTimes);
  console.log('Total execution time:', totalTime);
  console.log('---');
}

// Example 1
const functions1 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions1, 2);

// Example 2
const functions2 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions2, 5);

// Example 3
const functions3 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions3, 1);

// Additional test case with more functions and varying execution times
const functions4 = [
  () => new Promise(res => setTimeout(res, 100)),
  () => new Promise(res => setTimeout(res, 200)),
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 500)),
  () => new Promise(res => setTimeout(res, 600)),
];
runTestCase(functions4, 3);

