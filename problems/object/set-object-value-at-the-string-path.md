```js
const object = { a: [{ b: { c: 3 } }] };

set(object, "a[0].b.c", 4);
console.log(object.a[0].b.c);
// 4

set(object, ["x", "0", "y", "z"], 5);
console.log(object.x[0].y.z);
// 5

const helper = (obj, path, value) => {
  // get the current and the remaining keys from the path
  let [current, ...rest] = path;

  // if there are more keys
  // add the value as an object or array
  // depending upon the typeof key
  if (rest.length > 0) {
    // if there is no key present
    // create a new one
    if (!obj[current]) {
      // if the key is numeric
      // add an array
      // else add an object
      const isNumber = `${+rest[0]}` === rest[0];
      obj[current] = isNumber ? [] : {};
    }

    // recurisvely update the remaining path
    // if the last path is not of object type
    // but key is then
    // create an object or array based on the key
    // and update the value
    if (typeof obj[current] !== "object") {
      // determine if the key is string or numeric
      const isNumber = `${+rest[0]}` === rest[0];
      obj[current] = helper(isNumber ? [] : {}, rest, value);
    }
    // else directly update value
    else {
      obj[current] = helper(obj[current], rest, value);
    }
  }
  // else directly assing the value to the key
  else {
    obj[current] = value;
  }

  // return the updated obj
  return obj;
};

const set = (obj, path, value) => {
  let pathArr = path;

  // if path is of string type
  // replace the special characters
  // and split the string on . to get the path keys array
  if (typeof path === "string") {
    pathArr = path.replace("[", ".").replace("]", "").split(".");
  }

  // use the helper function to update
  helper(obj, pathArr, value);
};


Input:
const abc = {
  a: {
    b: {
      c: [1, 2, 3]
    },
    d: {
      a: "hello"
    }
  }
};

// If it is string then filter all the special characters like [, ] and split the string on . to get all the path keys in an array.

// Then using a helper function we can assign the value to the provided path.

// Get only the first key from the path array and aggregate the rest of the keys.
// If there are no more keys left to update, assign the value to the current key.
// Else recursively call the same function with the current value for the next path.
// While moving to the next path, check the type of key, if it is numeric the value should be an array thus pass array, else if it is a string pass the object.

const instance1 = JSON.parse(JSON.stringify(abc));
set(instance1, 'a.b.c', 'learnersbucket');
console.log(instance1.a.b.c);

const instance2 = JSON.parse(JSON.stringify(abc));
set(instance2, 'a.b.c.0', 'learnersbucket');
console.log(instance2.a.b.c[0]);

const instance3 = JSON.parse(JSON.stringify(abc));
set(instance3, 'a.b.c[1]', 'learnersbucket');
console.log(instance3.a.b.c[1]);

const instance4 = JSON.parse(JSON.stringify(abc));
set(instance4, ['a', 'b', 'c', '2'], 'learnersbucket');
console.log(instance4.a.b.c[2]);

const instance5 = JSON.parse(JSON.stringify(abc));
set(instance5, 'a.b.c[3]', 'learnersbucket');
console.log(instance5.a.b.c[3])

const instance6 = JSON.parse(JSON.stringify(abc));
set(instance6, 'a.c.d[0]', 'learnersbucket');
// valid digits treated as array elements
console.log(instance6.a.c.d[0]);

const instance7 = JSON.parse(JSON.stringify(abc));
set(instance7, 'a.d.01', 'learnersbucket');
// invalid digits treated as property string
console.log(instance7.a.d['01']);

const object = { 'a': [{ 'b': { 'c': 3 } }] };
set(object, 'a[0].b.c', 4);
console.log(object.a[0].b.c);

set(object, ['x', '0', 'y', 'z'], 5);
console.log(object.x[0].y.z);

Output:
"learnersbucket"
"learnersbucket"
"learnersbucket"
"learnersbucket"
"learnersbucket"
"learnersbucket"
"learnersbucket"
4
5



const set = (obj, path, value) => {
  if (Object(obj) !== obj) return obj; // When obj is not an object
  if (!Array.isArray(path)) path = path.toString().match(/(^. (\))+/g) || ();
  path.slice(0,-1).reduce((a, c, i) =>
    Object(a[c]) === a[c] // Does the key exist and is an object?
      ? a[c]
      : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}), obj)[path[path.length - 1]] = value;
  return obj;
};


const obj = {};

set(obj, 'a.b.c', 123);

console.log(obj); // { a: { b: { c: 123 } } }
