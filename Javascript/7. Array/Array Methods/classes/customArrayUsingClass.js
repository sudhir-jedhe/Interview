class customArray {
  constructor() {
    this.length = 0;
    this.data = {};
  }

  push(item) {
    this.data[this.length] = item;
    this.length++;
    return this.length;
  }

  pop() {
    if (this.length === 0) {
      return undefined;
    }
    this.length--;
    const lastItem = this.data[this.length];
    delete this.data[this.length];
    return lastItem;
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    return this.data[index];
  }

  delete(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    const item = this.data[index];
    delete this.data[index];
    this.length--;
    return item;
  }

  unShift(item) {
    for (let i = this.length; i > 0; i--) {
      this.data[i] = this.data[i - 1];
    }
    this.data[0] = item;
    this.length++;
    return this.length;
  }

  shift() {
    for (let i = 0; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    delete this.data[this.length - 1];
    this.length--;
    return this.length;
  }

  map(callback) {
    const newArray = new customArray();
    for (let i = 0; i < this.length; i++) {
      newArray.push(callback(this.data[i], i, this));
    }
    return newArray;
  }


}
