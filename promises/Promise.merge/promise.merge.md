You have to implement a function called promiseMerge that can take n no. of promises as input.

It should return a promise that fulfils with

summation of all resulting values if the type of all inputs is number.
concatted value if the type of all inputs is string.
computed value using AND operator if the type of all input is boolean.
a new concatted array if the type of all inputs is array.
a new object with all the keys from inputs if the typeof all inputs is object.
It should reject with an TypeError if either of the inputs is different from other inputs types.

Assumptions
Valid input types are: Number, String, Boolean, Array, and Object.
Syntax
```js
promiseMerge(p1, p2, ..., n);
Examples
cons value = await promiseMerge(Promise.resolve(1), Promise.resolve(2));
// => 3

cons value = await promiseMerge(Promise.resolve("devtools"), Promise.resolve(".tech"));
// => devtools.tech

cons value = await promiseMerge(Promise.resolve([1, 2, 3]), Promise.resolve([4, 5, 6]), Promise.resolve([7, 8, 9]));
// => [1,2,3,4,5,6,7,8,9]

cons value = await promiseMerge(Promise.resolve({ a: 1 }), Promise.resolve({ b: 2 }), Promise.resolve({ c: 3 }));
// => { a: 1, b: 2, c: 3};

cons value = await promiseMerge(Promise.resolve(true), Promise.resolve(false));
// => false

cons value = await promiseMerge(Promise.resolve("devtools"), Promise.resolve(1));
// => rejects with TypeError

cons value = await promiseMerge(Promise.resolve("devtools"), Promise.resolve([1, 2]));
// => rejects with TypeError

cons value = await promiseMerge();
// => rejects with TypeError





async function promiseMerge() {
    // write your solution below
    const noOfAgruments = arguments.length;
    let result;
    
    if (noOfAgruments === 0) {
      return Promise.reject(new TypeError());
    } else {
      for(let i = 0; i < noOfAgruments; i++) {
        const data = await arguments[i];
        const dataType = Object.prototype.toString.call(data).split(" ")[1].replace(/\]/, '');
        if (i == 0) {
          result = data;
        } else {
          const resultDataType = Object.prototype.toString.call(result).split(" ")[1].replace(/\]/, '');
          if (dataType === resultDataType) {
            switch (dataType) {
              case 'Number':
              case 'String':
                result += data;
                break;
              case 'Boolean':
                result = result && data;
                break;
              case 'Array':
                result = [...result, ...data];
                break;
              case 'Object':
                result = {...result, ...data};
                break;
              default:
                 return Promise.reject(new TypeError());
            }
          } else {
            return Promise.reject(new TypeError());
          }
        }
      }
    }
    
    
    
    if (result != undefined) {
      return Promise.resolve(result);
    }
  }




  /******************************************************* */
  
function isPlainObject(value) {
    // {} => true
    // new Set() => false
  
    if (value === null || typeof value !== 'object') {
      return false;
    }
  
    // value's prototype (value.constructor.prototype)
    // value.constructor.prototype === Object.prototype
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  }
  
  function findType(value) {
    // the aim of this function is to determine
    // input value's type
    // array, object, number, string, boolean
    // invalid
  
    if (Array.isArray(value)) {
      return 'array';
    } else if (isPlainObject(value)) {
      // {}
      return 'object';
    } else {
      const type = typeof value;
  
      return ['number', 'string', 'boolean'].includes(type) ? type : 'invalid';
    }
  }
  
  function promiseMerge(...promises) {
    // write your solution below
    return new Promise((resolve, reject) => {
      // [p1, p2 ...pN];
      // [r1, r2, ...];
  
      if (promises.length === 0) {
        return reject(new TypeError('invalid arguments'));
      }
  
      Promise.all(promises)
        .then((results) => {
          let response = null;
          // results: [1,2]
          // typeof results[0] => number
          const type = findType(results[0]);
  
          for (let i = 1; i < results.length; i++) {
            const currentItemType = findType(results[i]);
  
            if (currentItemType !== type) {
              return reject(new TypeError('invalid types'));
            }
          }
  
          if (type === 'number' || type === 'string') {
            response = results.reduce(
              (acc, current) => {
                acc += current;
  
                return acc;
              },
              type === 'string' ? '' : 0
            );
          } else if (type === 'array') {
            // [].concat([1,2], [3,4], [5,6])
            // [1,2,3,4,5,6]
            response = [].concat(...results);
          } else if (type === 'object') {
            // Object.assign({}, {a: 1}, { b: 2} ...)
            // { a: 1, b: 2, ... }
            response = Object.assign({}, ...results);
          } else if (type === 'boolean') {
            response = results.reduce((acc, current) => {
              acc = acc && current;
  
              return acc;
            }, true);
          } else {
            return reject(new TypeError("invalid type"));
          }
  
          return resolve(response);
        })
        .catch(reject);
    });
  }
  