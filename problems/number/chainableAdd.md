```js
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE FUNCTION NAME
function add(n) {
    let total = n;
    return {
      add: function (value) {
        total += value;
        return this;
      },
      sum: function () {
        if (!total) return 0;
        if (typeof total !== "number") throw new TypeError;
        return total;
      },
    };
  }
  
  // How to implement a chainable Add function to calculate the sum of numbers?