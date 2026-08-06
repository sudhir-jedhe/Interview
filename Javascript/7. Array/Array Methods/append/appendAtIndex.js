Array.prototype.appendAtIndex = function (index, valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  // splice method is used to insert the value at the specified index
  // splice(start, deleteCount, item1, item2, ...)
  // at start splice(0,0, valueToBeAppended)
  this.splice(index, 0, valueToBeAppended);
  return this;
};

Array.prototype.appendAtIndexUsingSlice = function (index, valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  const newArray = this.slice(0, index);
  newArray.push(valueToBeAppended);
  return newArray.concat(this.slice(index));
};

Array.prototype.appendAtIndexUsingForLoop = function (
  index,
  valueToBeAppended,
) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  const newArray = [];
  for (let i = 0; i < this.length; i++) {
    if (i === index) {
      newArray.push(valueToBeAppended);
    }
    newArray.push(this[i]);
  }
  if (index === this.length) {
    newArray.push(valueToBeAppended);
  }
  return newArray;
};

Array.prototype.appendAtIndexUsingSpread = function (index, valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  return [...this.slice(0, index), valueToBeAppended, ...this.slice(index)];
};
Array.prototype.appendAtIndexUsingConcat = function (index, valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  return this.slice(0, index).concat(valueToBeAppended, this.slice(index));
};

Array.prototype.appendAtIndexUsingFlat = function (index, valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtIndex called on null or undefined",
    );
  }
  if (index < 0 || index > this.length) {
    throw new RangeError("Index out of bounds");
  }
  return [this.slice(0, index), valueToBeAppended, this.slice(index)].flat();
};
