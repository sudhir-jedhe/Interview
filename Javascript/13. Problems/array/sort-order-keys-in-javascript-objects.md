```js
var GFG_Object = {
  CSS: "1",
  JavaScript: "2",
  HTML: "3",
  Python: "4",
};

// Sorted keys are obtained in 'key' array
function sortKeys(obj_1) {
  var key = Object.keys(obj_1).sort(function order(key1, key2) {
    if (key1 < key2) return -1;
    else if (key1 > key2) return +1;
    else return 0;
  });

  // Taking the object in 'temp' object
  // and deleting the original object.
  var temp = {};

  for (var i = 0; i < key.length; i++) {
    temp[key[i]] = obj_1[key[i]];
    delete obj_1[key[i]];
  }

  // Copying the object from 'temp' to
  // 'original object'.
  for (var i = 0; i < key.length; i++) {
    obj_1[key[i]] = temp[key[i]];
  }
  return obj_1;
}

function gfg_Run() {
  // Getting the keys of JavaScript Object.
  Modified_Object = Object.keys(GFG_Object)

    // Sort and calling a method on
    // keys on sorted fashion.
    .sort()
    .reduce(function (Obj, key) {
      // Adding the key-value pair to the
      // new object in sorted keys manner
      Obj[key] = GFG_Object[key];
      return Obj;
    }, {});
  return JSON.stringify(Modified_Object);
}
