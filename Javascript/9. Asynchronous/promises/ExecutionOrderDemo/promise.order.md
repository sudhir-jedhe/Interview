// This is a JavaScript Quiz from BFE.dev
```js
console.log(1);
const promise = new Promise((resolve) => {
  console.log(2);
  resolve();
  console.log(3);
});

console.log(4);

promise
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });

console.log(7);

setTimeout(() => {
  console.log(8);
}, 10);

setTimeout(() => {
  console.log(9);
}, 0);

// 1 2 3 4 7 5 6 9 8
// 1
// 2 promise declare then its sysnchronous , but when call with then start execute start async and
// 3 resolve() doesnt make synchronous only change state to full fill. net lime console synchronous
// 4
// 7 fetch and Promise.then Aysnchrous and move entire part in Micro task que
// 5 both setTimeout part of callback queue macro queue. event loop  monitor microtasj and call back queue
// if event loop move call back queue to global execution context stack if it empty
// microtask gets higher priority over call back queue
// microtask queue push first in global context stack execute
// 6
// 9 // lower timeour delay
// 8

/****************************************************************************** */
const createPromise = () => Promise.resolve(1);

function func1() {
  createPromise().then(console.log);
  console.log(2);
}

async function func2() {
  await createPromise();
  console.log(3);
}

console.log(4);
func1();
func2();

/******************************************************* */
// This is a JavaScript Quiz from BFE.dev

console.log(1);

setTimeout(() => {
  console.log(2);
}, 10);

setTimeout(() => {
  console.log(3);
}, 0);

new Promise((_, reject) => {
  console.log(4);
  reject(5);
  console.log(6);
})
  .then(() => console.log(7))
  .catch(() => console.log(8))
  .then(() => console.log(9))
  .catch(() => console.log(10))
  .then(() => console.log(11))
  .then(console.log)
  .finally(() => console.log(12));

console.log(13);
