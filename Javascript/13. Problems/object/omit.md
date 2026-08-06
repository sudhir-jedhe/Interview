```js
function omit(object, paths) {
  const newObject = {};

  for (const key in object) {
    if (!paths.includes(key)) {
      newObject[key] = object[key];
    }
  }

  return newObject;
}

const object = {
  name: "Will Riker",
  rank: "Commander",
  age: 29,
};

const newObject = omit(object, ["rank", "age"]);

console.log(newObject); // { name: 'Will Riker' }
