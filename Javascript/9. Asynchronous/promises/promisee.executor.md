// This is a JavaScript Quiz from BFE.dev

new Promise((resolve, reject) => {
  resolve(1);
  resolve(2);
  reject("error");
}).then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log("error");
  }
);

// 1

// any call after 1 st resolve or reject its settled so ne next line code count
// promise settled  only once.
// if resolve then go to then else go to catch error

/********************************************** */
//2

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
promise.then(console.log);

/*************************************************** */
// This is a JavaScript Quiz from BFE.dev

const p1 = Promise.resolve(1);
const p2 = new Promise((resolve) => resolve(p1));
const p3 = Promise.resolve(p1);
const p4 = p2.then(() => new Promise((resolve) => resolve(p3)));
const p5 = p4.then(() => p4);

console.log(p1 == p2);
console.log(p1 == p3);
console.log(p3 == p4);
console.log(p4 == p5);
