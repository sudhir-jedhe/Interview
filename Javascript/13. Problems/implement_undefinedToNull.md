```js
function undefinedToNull(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = value === undefined ? null : value;
  }
  return newObj;
}

undefinedToNull({ a: undefined, b: "BFE.dev" });
// {a: null, b: 'BFE.dev'}

undefinedToNull({ a: ["BFE.dev", undefined, "bigfrontend.dev"] });
// {a: ['BFE.dev', null, 'bigfrontend.dev']}
