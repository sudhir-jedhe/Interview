```js
class CustomTokenizer {
  constructor(string, delimiters) {
    this.string = string;
    this.delimiters = delimiters;
    this.position = 0;
  }

  nextToken() {
    while (this.position < this.string.length) {
      const currentChar = this.string[this.position];
      if (this.delimiters.includes(currentChar)) {
        this.position++;
        continue;
      }

      const tokenStart = this.position;
      while (
        this.position < this.string.length &&
        !this.delimiters.includes(this.string[this.position])
      ) {
        this.position++;
      }

      const token = this.string.substring(tokenStart, this.position);
      return token;
    }

    return null;
  }
}

const string = "This is an example sentence!";
const delimiters = [" ", ","];

const tokenizer = new CustomTokenizer(string, delimiters);

while (true) {
  const token = tokenizer.nextToken();
  if (token === null) {
    break;
  }

  console.log(token);
}

// This
// is
// an
// example
// sentence!

const str = "this is some string";
String.prototype.customSplit = (sep = "") => {
  const res = [];
  let temp = "";
  for (let i = 0; i < str.length; i++) {
    const el = str[i];
    if (el === sep || (sep === "" && temp)) {
      res.push(temp);
      temp = "";
    }
    if (el !== sep) {
      temp += el;
    }
  }
  if (temp) {
    res.push(temp);
    temp = "";
  }
  return res;
};
console.log(str.customSplit(" "));



/***************************************** */

class StringTokenizer {
  constructor(delimiter) {
      this.delimiter = delimiter; // Set the delimiter for tokenization
  }

  // Tokenize the input string
  tokenize(input) {
      if (typeof input !== 'string') {
          throw new TypeError('Input must be a string');
      }

      // Split the input string by the delimiter
      return input.split(this.delimiter).map(token => token.trim()).filter(token => token !== '');
  }
}

// Example usage
const tokenizer = new StringTokenizer(','); // Create a tokenizer with a comma as the delimiter

const inputString = 'apple, banana, cherry, date,   fig,   grape';
const tokens = tokenizer.tokenize(inputString);

console.log(tokens); // Output: [ 'apple', 'banana', 'cherry', 'date', 'fig', 'grape' ]


/*********************************** */


class EnhancedStringTokenizer {
  constructor(delimiters) {
      this.delimiters = delimiters; // Set an array of delimiters
  }

  // Create a regex from the delimiters
  createRegex() {
      const escapedDelimiters = this.delimiters.map(delim => delim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape special characters
      return new RegExp(`[${escapedDelimiters.join('')}]`);
  }

  // Tokenize the input string
  tokenize(input) {
      if (typeof input !== 'string') {
          throw new TypeError('Input must be a string');
      }

      const regex = this.createRegex();
      return input.split(regex).map(token => token.trim()).filter(token => token !== '');
  }
}

// Example usage
const tokenizer = new EnhancedStringTokenizer([',', ' ']); // Create a tokenizer with comma and space as delimiters

const inputString = 'apple, banana cherry, date,   fig,   grape';
const tokens = tokenizer.tokenize(inputString);

console.log(tokens); // Output: [ 'apple', 'banana', 'cherry', 'date', 'fig', 'grape' ]



/****************************** */

/**
 * @param {string} str
 * @return {Generator}
 */
function* tokenize(str) {
  let buffer = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    switch (char) {
      case ' ':
        continue
      case '+':
      case '-':
      case '*':
      case '/':
      case '(':
      case ')':
        if (buffer != '') {
          yield buffer
          buffer = ''
        }
        yield char
        continue
      default:
        buffer += char
    }
  }
  
  if (buffer != '') {
    yield buffer
  }
}


/**************** */


function* tokenize(str) {
  let tokens = str.match(/(\d+)|[\+\-\*\/\(\)]/g)
  for (var token of tokens) { yield token }
}
