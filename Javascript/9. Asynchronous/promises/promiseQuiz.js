// Quiz 1: Multiple resolve/reject calls
console.log('Quiz 1: Multiple resolve/reject calls');
new Promise((resolve, reject) => {
  resolve(1);
  resolve(2);
  reject("error");
}).then(
  (value) => {
    console.log('Quiz 1 result:', value);
  },
  (error) => {
    console.log('Quiz 1 error:', error);
  }
);
// Output: Quiz 1 result: 1
// Explanation: A Promise can only settle once. After the first resolve(1),
// subsequent resolve/reject calls are ignored.

// Quiz 2: Promise chaining with rejection
console.log('\nQuiz 2: Promise chaining with rejection');
const promise = new Promise((resolve, reject) => {
  const promise2 = Promise.reject("error").then(
    () => {
      console.log(1);
    },
    () => {
      console.log(2);
    }
  );
  resolve(promise2);
});
promise.then(result => console.log('Final result:', result));
// Output: 2, undefined
// Explanation: Promise.reject triggers the rejection handler which logs 2,
// then resolves to undefined which is logged by the final then

// Quiz 3: Promise equality and resolution
console.log('\nQuiz 3: Promise equality and resolution');
const p1 = Promise.resolve(1);
const p2 = new Promise((resolve) => resolve(p1));
const p3 = Promise.resolve(p1);
const p4 = p2.then(() => new Promise((resolve) => resolve(p3)));
const p5 = p4.then(() => p4);

// Test equality
Promise.all([p1, p2, p3, p4, p5]).then(() => {
  console.log('p1 == p2:', p1 == p2);  // false
  console.log('p1 == p3:', p1 == p3);  // false
  console.log('p3 == p4:', p3 == p4);  // false
  console.log('p4 == p5:', p4 == p5);  // false
});

// Explanation:
console.log('\nExplanations:');
console.log('1. Each Promise creation creates a new object, so equality comparisons return false');
console.log('2. Promise.resolve(promise) returns the promise if input is already a promise');
console.log('3. new Promise() always creates a new promise object');
console.log('4. .then() always returns a new promise');