```js
const lookup = [
    { symbol: 'M', value: 1000 },
    { symbol: 'CM', value: 900 },
    { symbol: 'D', value: 500 },
    { symbol: 'CD', value: 400 },
    { symbol: 'C', value: 100 },
    { symbol: 'XC', value: 90 },
    { symbol: 'L', value: 50 },
    { symbol: 'XL', value: 40 },
    { symbol: 'X', value: 10 },
    { symbol: 'IX', value: 9 },
    { symbol: 'V', value: 5 },
    { symbol: 'IV', value: 4 },
    { symbol: 'I', value: 1 },
  ]
  const integerToRoman = (num, res = '') => {
    if (num > 0) {
      const { symbol, value } = lookup.find(({ value }) => num >= value)
      return integerToRoman(num - value, `${res}${symbol}`)
    }
    return res
  }
  

  /******************************************** */

  
/**
 * @param {number} integer
 * @returns {string} str - roman numeral string
 */
function romanToInteger(num) {
    // your code here
    const mapping = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    let current = num;
    let res = '';
    for (let i = 0; i < mapping.length; ++i) {
      if (current <= 0) {
        break;
      }
      const [value, ch] = mapping[i];
      while (current >= value) {
        current = current - value;
        res = `${res}${ch}`;
      }
    }
    return res;
  }
  


  /**************************** */

  /**
 * @param {number} integer
 * @returns {string} str - roman numeral string
 */
function romanToInteger(num) {
    const map = {
      'M': 1000,
      'CM': 900,
      'D': 500,
      'CD': 400,
      'C': 100,
      'XC': 90,
      'L': 50,
      'XL': 40,
      'X': 10,
      'IX': 9,
      'V': 5,
      'IV': 4,
      'I': 1,
    };
    let res = '';
    for (let key in map) {
      let repeatCount = Math.floor(num / map[key]);
      if (repeatCount) {
        res += key.repeat(repeatCount);
      }
      num %= map[key];
      if (!num) return res;
    }
    return res;
  }

  
  let str = "";
  for(let i in table){
    let q = Math.floor(num / table[i]);
    num %= table[i];
    str += i.repeat(q);
  }
  return str;
}

/********************* */

function romanToInteger(num) {
    const digits = [
      ['M', 1000],
      ['CM', 900],
      ['D', 500],
      ['CD', 400],
      ['C', 100],
      ['XC', 90],
      ['L', 50],
      ['XL', 40],
      ['X', 10],
      ['IX', 9],
      ['V', 5],
      ['IV', 4],
      ['I', 1],
    ];
    let res = '';
    for (const [symbol, value] of digits) {
      if (!num) {
        break;
      }
      const count = Math.floor(num / value);
      res += symbol.repeat(count);
      num %= value;
    }
    return res;
  }
  