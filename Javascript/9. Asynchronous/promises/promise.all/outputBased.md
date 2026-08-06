/**************************************** */
```js
const promiseOne = new Promise((resolve, reject) => setTimeout(resolve, 4000));
const promiseTwo = new Promise((resolve, reject) => setTimeout(reject, 4000));

Promise.all([promiseOne, promiseTwo]).then((data) => console.log(data));
// ```// - 1: [{status: "fullfilled", value: undefined}, {status: "rejected", reason: undefined}]
// - 2: [{status: "fullfilled", value: undefined}, Uncaught(in promise)]
// - 3: Uncaught (in promise)
// - 4: [Uncaught(in promise), Uncaught(in promise)]

/* ##### Answer: 3

The above promises settled at the same time but one of them resolved and other one rejected. When you use `.all` method on these promises, the result will be short circuted by throwing an error due to rejection in second promise. But If you use `.allSettled` method then result of both the promises will be returned irrespective of resolved or rejected promise status without throwing any error. */

Promise.allSettled([promiseOne, promiseTwo]).then((data) => console.log(data));

/********************************************** */
const p1 = Promise.resolve(3);
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 100);
});

Promise.all([p1, p2]).then((values) => {
  console.log(values);
});

/************************************************** */

const prom1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Resolved First after 1 second");
  }, 1000);
});

const prom2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Resolved First after 2 seconds");
  }, 2000);
});

const prom3 = 20;

try {
  let result = Promise.all([prom1, prom2, prom3]);
  result.then((data) => console.log(data));
} catch (error) {
  console.log(error);
}

/************************************************ */

const prom1 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve("gfg1");
  }, 1000);
});

const prom2 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    reject("error");
  }, 2000);
});

const prom3 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve("gfg2");
  }, 3000);
});

const prom4 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve("gfg3");
  }, 3000);
});

Promise.myall = function (values) {
  const promise = new Promise(function (resolve, reject) {
    let result = [];
    let total = 0;
    values.forEach((item, index) => {
      Promise.resolve(item)
        .then((res) => {
          result[index] = res;
          total++;
          if (total === values.length) resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
  return promise;
};

Promise.myall([prom1, prom2, prom3])
  .then((res) => {
    console.log(res);
  })
  .catch((er) => {
    console.log(er);
  });

Promise.myall([prom1, prom3, prom4])
  .then((res) => {
    console.log(res);
  })
  .catch((er) => {
    console.log(er);
  });

/**************************************************************** */

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);
const promise4 = Promise.reject(4);

const promiseAll = async () => {
  const group1 = await Promise.all([promise1, promise2]);
  const group2 = await Promise.all([promise3, promise4]);
  return [group1, group2];
};

promiseAll().then(console.log).catch(console.log);

/************************************************** */
// This is a JavaScript Quiz from BFE.dev

(async () => {
  await Promise.all([]).then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.log(error);
    }
  );

  await Promise.all([1, 2, Promise.resolve(3), Promise.resolve(4)]).then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.log(error);
    }
  );

  await Promise.all([1, 2, Promise.resolve(3), Promise.reject("error")]).then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.log(error);
    }
  );
})();

/********************************************************** */
