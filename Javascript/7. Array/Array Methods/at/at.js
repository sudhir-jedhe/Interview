Array.prototype.customAt = function (index) {
    if (this === null || this === undefined) {
        throw new TypeError(
            "Array.prototype.customAt called on null or undefined"
        );
    }
    const len = this.length;
    let k = index >= 0 ? index : len + index;
    if (k < 0 || k >= len) {
        return undefined;
    }
    return this[k];
}

// other implementation using slice
Array.prototype.customAtUsingSlice = function (index) {
    if (this === null || this === undefined) {
        throw new TypeError(
            "Array.prototype.customAt called on null or undefined"
        );
    }
    const len = this.length;
    let k = index >= 0 ? index : len + index;
    if (k < 0 || k >= len) {
        return undefined;
    }
    return this.slice(k, k + 1)[0];
}

// other implementation using for loop      
Array.prototype.customAtUsingForLoop = function (index) {
    if (this === null || this === undefined) {
        throw new TypeError(
            "Array.prototype.customAt called on null or undefined"
        );
    }
    const len = this.length;
    let k = index >= 0 ? index : len + index;
    if (k < 0 || k >= len) {
        return undefined;
    }
    for (let i = 0; i < len; i++) {
        if (i === k) {
            return this[i];
        }
    }
}   
// other implementation using forEach
Array.prototype.customAtUsingForEach = function (index) {
    if (this === null || this === undefined) {
        throw new TypeError(
            "Array.prototype.customAt called on null or undefined"
        );
    }
    const len = this.length;
    let k = index >= 0 ? index : len + index;
    if (k < 0 || k >= len) {
        return undefined;
    }
    let result;
    this.forEach((item, i) => {
        if (i === k) {
            result = item;
        }
    });
    return result;
}   
// Handle negative indices and out-of-bounds indices
Array.prototype.customAtWithNegativeIndices = function (index) {
    if (this === null || this === undefined) {
        throw new TypeError(
            "Array.prototype.customAt called on null or undefined"
        );
    }
    const len = this.length;
    let k = index >= 0 ? index : len + index;
    if (k < 0 || k >= len) {
        return undefined;
    }
    return this[k];
}   