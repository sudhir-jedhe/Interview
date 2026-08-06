```js
function getKeyByValue(object, value) {
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value) return prop;
    }
  }
}

const exampleObject = {
  key1: "Geeks",
  key2: 100,
  key3: "Javascript",
};

ans = getKeyByValue(exampleObject, 100);

console.log(ans);

/*************************************************************** */

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const exampleObject = {
  key1: "Geeks",
  key2: 100,
  key3: "Javascript",
};

ans = getKeyByValue(exampleObject, "Geeks");
console.log(ans);

/*********************************************************************** */
function getKeyByValue(obj, value) {
  return Object.keys(obj).filter((key) => obj[key] === value);
}

const exampleObject = {
  key1: "Geeks",
  key2: 100,
  key3: "Javascript",
};

ans = getKeyByValue(exampleObject, "Geeks");
console.log(ans);

/************************************************************ */
function getKeyByValue(obj, value) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (val === value) {
      acc.push(key);
    }
    return acc;
  }, []);
}

const exampleObject = {
  key1: "Geeks",
  key2: 100,
  key3: "Javascript",
};

ans = getKeyByValue(exampleObject, "Geeks");
console.log(ans);
