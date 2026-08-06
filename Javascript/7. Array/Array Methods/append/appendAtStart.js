Array.prototype.appendAtStartUsingUnshift = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  this.unshift(valueToBeAppended);
  return this;
};

console.log(arr.appendAtStartUsingUnshift(0)); // [0, 1, 2, 3, 4]

Array.prototype.appendAtStartUsingRest = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  return [valueToBeAppended, ...this];
};

Array.prototype.appendAtStartUsingForLoop = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }

  for (let i = this.length; i > 0; i--) {
    this[i] = this[i - 1];
  }
  this[0] = valueToBeAppended;
  return this;
};

Array.prototype.appendAtStartUsingSlice = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  const newArray = this.slice();
  newArray.unshift(valueToBeAppended);
  return newArray;
};

Array.prototype.appendAtStartUsingConcat = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  return [valueToBeAppended].concat(this);
};

Array.prototype.appendAtStartUsingFlat = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  return [[valueToBeAppended], this].flat();
};

Array.prototype.appendAtStartUsingSplice = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtStart called on null or undefined",
    );
  }
  const newArray = this.slice();
  newArray.splice(0, 0, valueToBeAppended);
  return newArray;
};
