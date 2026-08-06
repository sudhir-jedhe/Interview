// The Promise.resolve method returns a Promise object that is resolved with a given value.

```js
let promise = new Promise(resolve => {
    setTimeout(() => resolve(2), 2000);
});

promise.then(val => console.log(val));

console.log('finished');
// We create a promise which resolves after two seconds with an integer value. The then function attaches callbacks for the resolution
// and/or rejection of the promise

async function doWork() {

    let res = await promise;
    console.log(res);
}

let promise = new Promise(resolve => {

    setTimeout(() => resolve(2), 2000);
});

doWork();

console.log('finished');