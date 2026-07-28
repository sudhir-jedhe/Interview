```js
const calculator = {
    // Method to read two values and save them as properties 'a' and 'b'
    read(a, b) {
      this.a = a;
      this.b = b;
    },
  
    // Method to return the sum of 'a' and 'b'
    sum() {
      return this.a + this.b;
    },
  
    // Method to multiply 'a' and 'b' and return the result
    mul() {
      return this.a * this.b;
    }
  };
  
  // Example Usage:
  calculator.read(5, 10);  // Assign values 5 and 10 to a and b
  console.log(calculator.sum()); // Output: 15
  console.log(calculator.mul()); // Output: 50
  


//   Create an object calculator with three methods:


//   	read() takes two values and saves them as object properties with names a and b respectively.
//   	sum() returns the sum of saved values.
//   	mul() multiplies saved values and returns the result. js