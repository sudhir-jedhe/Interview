```js
function deepCopy(obj) {
    if (Array.isArray(obj)) {
      const output = Array.isArray ? [] : {};
    
      for (const item of obj) {
        if (typeof item === 'object') {
          output.push(deepCopy(item));
        } else {
          output.push(item);
        }
      }
      return output;
    }
    const output = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const item = obj[key];
      if (typeof item === 'object') {
        output[key] = deepCopy(item);
      } else {
        output[key] = item;
      }
    }
    return output;
  }
  function compare(base, copy) {
    let isEqual = true;
    if (typeof base !== typeof copy) {
      return false;
    }
    if (typeof copy !== 'object') {
      return copy === base;
    }
    for (const key in copy) {
      if (base.hasOwnProperty(key)) {
        if (compare(base[key], copy[key])) {
          copy[key] = base[key];
        } else {
          isEqual = false;
        }
      } else {
        isEqual = false;
      }
    }
    for (const key in base) {
      if (!copy.hasOwnProperty(key)) {
        isEqual = false;
      }
    }
    return isEqual;
  }
  /**
   * @param {any} base
   * @param {(draft: any) => any} recipe
   * @returns {any}
   */
  function produce(base, recipe) {
    const copy = deepCopy(base);
    recipe(copy);
    if (compare(base, copy)) {
      return base;
    }
    return copy;
  }

  /************************************* */


  /**
 * @param {any} base
 * @param {(draft: any) => any} recipe
 * @returns {any}
 */
function produce(base, recipe) {
    // your code here
    let clone = JSON.parse(JSON.stringify(base));
    recipe(clone);
    if (JSON.stringify(clone) === JSON.stringify(base)) return base;
    cloneObjects(base, clone);
    return clone;
  }
  function cloneObjects(base, clone) {
    if (!base || !clone) return;
    const keys = Object.keys(clone);
    for (let key of keys) {
      if (JSON.stringify(base[key]) === JSON.stringify(clone[key])) {
        clone[key] = base[key];
      }
      if (typeof clone[key] === 'object') {
        cloneObjects(base[key], clone[key]);
      }
    }
  }

  
  