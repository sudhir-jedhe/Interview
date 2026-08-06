Array.prototype.appendAtEnd = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  this[this.length] = valueToBeAppended;
  return this;
};

Array.prototype.appendAtEndUsingPush = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  this.push(valueToBeAppended);
  return this;
};

Array.prototype.appendAtEndUsingSpread = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return [...this, valueToBeAppended];
};

Array.prototype.appendAtEndUsingConcat = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return this.concat(valueToBeAppended);
};

Array.prototype.appendAtEndUsingForLoop = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = new Array(this.length + 1);
  for (let i = 0; i < this.length; i++) {
    newArray[i] = this[i];
  }
  newArray[this.length] = valueToBeAppended;
  return newArray;
};

Array.prototype.appendAtEndUsingMap = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = this.map((item) => item);
  newArray[newArray.length] = valueToBeAppended;
  return newArray;
};

Array.prototype.appendAtEndUsingReduce = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return this.reduce((acc, curr) => {
    acc.push(curr);
    return acc;
  }, []).concat(valueToBeAppended);
};

Array.prototype.appendAtEndUsingReduceRight = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return this.reduceRight((acc, curr) => {
    acc.unshift(curr);
    return acc;
  }, []).concat(valueToBeAppended);
};

Array.prototype.appendAtEndUsingForEach = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = [];
  this.forEach((item) => {
    newArray.push(item);
  });
  newArray.push(valueToBeAppended);
  return newArray;
};

Array.prototype.appendAtEndUsingFilter = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = this.filter((item) => item !== undefined);
  newArray.push(valueToBeAppended);
  return newArray;
};

Array.prototype.appendAtEndUsingSlice = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = this.slice();
  newArray.push(valueToBeAppended);
  return newArray;
};

Array.prototype.appendAtEndUsingConcatWithSpread = function (
  valueToBeAppended,
) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return [].concat(...this, valueToBeAppended);
};

Array.prototype.appendAtEndUsingFlat = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  return [this, valueToBeAppended].flat();
};

Array.prototype.appendAtEndUsingSplice = function (valueToBeAppended) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.appendAtEnd called on null or undefined",
    );
  }
  const newArray = this.slice();
  newArray.splice(newArray.length, 0, valueToBeAppended);
  return newArray;
};

const arr = [1, 2, 3];
arr.appendAtEnd(4);
console.log(arr); // [1, 2, 3, 4]
