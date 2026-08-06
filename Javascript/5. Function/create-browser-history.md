```
// BrowserHistory class definition
class BrowserHistory {
  constructor(url) {
    this.history = [];
    this.pointer = -1;
    if (url !== undefined) {
      this.history.push(url);
      this.pointer++;
    }
  }

  visit(url) {
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(url);
    this.pointer++;
  }

  back() {
    this.pointer = Math.max(0, --this.pointer);
    return this.history[this.pointer];
  }

  forward() {
    this.pointer = Math.min(this.history.length - 1, ++this.pointer);
    return this.history[this.pointer];
  }
}

// Driver code to test the BrowserHistory class
const browserHistory = new BrowserHistory("https://algodaily.com");

// Visiting new URLs
browserHistory.visit("https://google.com");
browserHistory.visit("https://facebook.com");

// Navigating back and forth
console.log(browserHistory.back()); // Should print "https://google.com"
console.log(browserHistory.back()); // Should print "https://algodaily.com"
console.log(browserHistory.forward()); // Should print "https://google.com"

// Visiting a new URL from a past page
browserHistory.visit("https://twitter.com");

console.log(browserHistory.back()); // Should print "https://google.com"
console.log(browserHistory.forward()); // Should print "https://twitter.com"
```
```js
function BrowserHistory() {
  // track history
  this.history = [];
  this.index = -1;

  // add new url at next index
  this.visit = function (url) {
    this.history[++this.index] = url;
    this.history.length = this.index + 1;
  };

  // return the url of the current index
  this.current = function () {
    return this.history[this.index];
  };

  // go to previous entry
  this.backward = function () {
    this.index = Math.max(0, --this.index);
  };

  // go to next entry
  this.forward = function () {
    this.index = Math.min(this.history.length - 1, ++this.index);
  };
}
Input:
const bh = new BrowserHistory();

bh.visit('A');
console.log(bh.current());

bh.visit('B');
console.log(bh.current());

bh.visit('C');
console.log(bh.current());

bh.backward();
console.log(bh.current());

bh.visit('D');
console.log(bh.current());

bh.backward();
console.log(bh.current());

bh.forward();
console.log(bh.current());

Output:
"A"

"B"

"C"

"B"

"D"

"B"

"D"

```